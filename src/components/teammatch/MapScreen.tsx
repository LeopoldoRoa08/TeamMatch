import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { Search, SlidersHorizontal, Bell, Plus } from "lucide-react";
import { CreateEventForm } from "./CreateEventForm";
import { EventCard } from "./EventCard";
import type { SportEvent } from "./types";
import { supabase } from "@/lib/supabase";

// ── Carga diferida de Leaflet ─────────────────────────────────────────────────
// React.lazy + Suspense garantiza que LeafletMap (y todo lo que importa:
// leaflet, react-leaflet, leaflet.css) solo se descargue y ejecute en el
// cliente. El SSR nunca evalúa este módulo → desaparece el error
// "ReferenceError: window is not defined".
const LeafletMap = lazy(() => import("./LeafletMap").then((m) => ({ default: m.default })));

// ── Esqueleto mientras carga el mapa ─────────────────────────────────────────
function MapSkeleton() {
  return (
    <div className="h-full w-full animate-pulse bg-muted">
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <span className="text-xs font-medium">Cargando mapa…</span>
        </div>
      </div>
    </div>
  );
}

// ── Filtros de deporte ────────────────────────────────────────────────────────
const sports = ["Todos", "Running", "Senderismo", "Pádel", "Vóleibol"] as const;

// ── Componente principal ──────────────────────────────────────────────────────
export function MapScreen({ onSelect }: { onSelect: (e: any) => void }) {
  const [active, setActive] = useState<string>("Todos");
  const [events, setEvents] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<any>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setIsOrganizer(data.user.user_metadata?.is_organizer === true);
      }
    });
  }, []);

  const fetchEvents = useCallback(async () => {
    const { data, error } = await supabase.from("events").select("*").order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching events:", error);
      return;
    }
    
    if (data) {
      const processed = data.map((row: any) => {
        let lat = 0;
        let lng = 0;
        if (row.location) {
          if (typeof row.location === "string") {
            if (row.location.toUpperCase().includes("POINT")) {
              // Limpiamos la cadena WKT y hacemos split por espacio
              const cleaned = row.location.toUpperCase().replace("POINT", "").replace("(", "").replace(")", "").trim();
              const coords = cleaned.split(/\s+/);
              if (coords.length >= 2) {
                lng = parseFloat(coords[0]); // Longitud
                lat = parseFloat(coords[1]); // Latitud
              }
            } else if (/^[0-9A-Fa-f]+$/.test(row.location) && row.location.length >= 50) {
              // Supabase / PostGIS devuelve un WKB Hex String nativo
              // Ej: 0101000020E6100000 + 8 bytes X + 8 bytes Y
              try {
                const hex = row.location;
                const buffer = new Uint8Array(hex.match(/../g)!.map((h: string) => parseInt(h, 16))).buffer;
                const view = new DataView(buffer);
                lng = view.getFloat64(9, true); // true para Little Endian
                lat = view.getFloat64(17, true);
              } catch (err) {
                console.error("Error decodificando WKB Hex de PostGIS:", err);
              }
            }

            // Parche inteligente: Si lat y lng están invertidos en la DB vieja
            // (por ej: lat = -66.87, lng = 10.49 en lugar de lat = 10.49, lng = -66.87)
            // como sabemos que Caracas está en Lat 10, Lng -66, los intercambiamos.
            if (lat < -20 && lng > 0) {
              const temp = lat;
              lat = lng;
              lng = temp;
            }
          } else if (typeof row.location === "object" && row.location.type === "Point") {
            lng = row.location.coordinates[0];
            lat = row.location.coordinates[1];
          }
        }

        // Fallbacks básicos para que la UI no se rompa (EventCard, iconos)
        const sportName = row.sport_id === 1 ? "Fútbol" : row.sport_id === 2 ? "Tenis" : row.sport_id === 3 ? "Golf" : row.sport_id === 4 ? "Pádel" : "Otro";

        return {
          ...row,
          lat,
          lng,
          sport: sportName,
          title: row.title || `Evento de ${sportName}`,
          hostName: row.creator_username || "Usuario",
          hostAvatar: (row.creator_username || "U").substring(0, 2).toUpperCase(),
          time: row.event_date ? new Date(row.event_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "00:00",
          date: row.event_date ? new Date(row.event_date).toLocaleDateString("es-VE", { weekday: "short", day: "numeric", month: "short" }) : "Próximamente",
          image: "https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&q=80&w=800",
          distanceKm: 2.5,
          joined: row.joined ?? 1,
          spots: row.max_capacity || 10,
          price: 0,
          zone: "Caracas",
        };
      });
      
      console.log('Eventos cargados:', processed);
      setEvents(processed);
      if (processed.length > 0) setSelectedId(processed[0].id);
    }
  }, []);

  useEffect(() => {
    fetchEvents();

    // ── Supabase Realtime: Escuchar nuevos eventos ─────────────────────────
    const channel = supabase
      .channel("public:events")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "events" },
        (payload) => {
          console.log("¡Nuevo evento en tiempo real detectado!", payload);
          // Refrescamos la lista para todos
          fetchEvents();
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "events" },
        (payload) => {
          console.log("¡Evento actualizado en tiempo real detectado!", payload);
          fetchEvents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchEvents]);

  const filtered = active === "Todos" ? events : events.filter((e) => e.sport === active);

  return (
    <div className="relative h-full overflow-hidden bg-muted">

      {/* ── Mapa Leaflet (lazy, solo client) ── */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<MapSkeleton />}>
          <LeafletMap
            events={filtered}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </Suspense>
      </div>

      {/* ── Top bar ── */}
      <div className="absolute inset-x-0 top-0 z-20 px-4 pt-12 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex flex-1 items-center gap-2 rounded-2xl glass px-4 py-3 shadow-soft">
            <Search size={18} className="text-muted-foreground" />
            <input
              placeholder="Buscar deporte, zona…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <button className="grid h-7 w-7 place-items-center rounded-lg bg-secondary text-primary-foreground">
              <SlidersHorizontal size={14} />
            </button>
          </div>
          <button className="relative grid h-12 w-12 place-items-center rounded-2xl glass shadow-soft">
            <Bell size={18} className="text-secondary" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-accent" />
          </button>
        </div>

        {/* Filtros de deporte */}
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 pointer-events-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {sports.map((s) => (
            <button
              key={s}
              onClick={() => setActive(s)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold shadow-soft transition-all ${
                active === s
                  ? "bg-secondary text-primary-foreground"
                  : "glass text-secondary"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Bottom sheet con cards de eventos ── */}
      <div className="absolute inset-x-0 bottom-16 z-20 pb-4 pointer-events-none">
        <div className="pointer-events-auto">
          <div className="px-4 pb-2">
            <div className="mx-auto h-1 w-10 rounded-full bg-card/70" />
          </div>
          <div className="mb-2 flex items-center justify-between px-5">
            <h2 className="text-sm font-bold text-secondary">
              {filtered.length} eventos cerca de ti
            </h2>
            <button className="text-xs font-semibold text-primary">Ver todos</button>
          </div>
          <div className="flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filtered.map((e) => (
              <div
                key={e.id}
                className="w-[78%] flex-shrink-0"
                onClick={() => setSelectedId(e.id)}
              >
                <EventCard event={e} onClick={() => onSelect(e)} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FAB — Crear evento ── */}
      {isOrganizer && (
        <button
          id="fab-create-event-btn"
          onClick={() => setShowCreateForm(true)}
          className="absolute bottom-24 right-4 z-30 flex items-center gap-2 rounded-2xl gradient-primary px-4 py-3 text-sm font-bold text-secondary shadow-pop transition-all active:scale-95 hover:scale-105"
          aria-label="Crear evento"
        >
          <Plus size={18} strokeWidth={2.5} />
          Crear
        </button>
      )}

      {/* ── Panel de creación (pantalla completa sobre el mapa) ── */}
      {showCreateForm && (
        <div className="absolute inset-0 z-40 bg-background">
          <CreateEventForm
            onClose={() => setShowCreateForm(false)}
            onEventCreated={fetchEvents}
          />
        </div>
      )}
    </div>
  );
}
