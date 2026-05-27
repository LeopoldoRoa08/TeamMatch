import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { Search, SlidersHorizontal, Bell, Plus, X, MapPin, Crosshair } from "lucide-react";
import { CreateEventForm } from "./CreateEventForm";
import { supabase } from "@/lib/supabase";
import footballField from "@/assets/football-field.jpg";
import padelCourt from "@/assets/padel-court.jpg";
import hikingTrail from "@/assets/hiking-trail.jpg";
import runningTrail from "@/assets/running-trail.jpg";

const getSportImage = (sportId: number) => {
  if (sportId === 1) return footballField;
  if (sportId === 4) return padelCourt;
  if (sportId === 2) return padelCourt; // tenis fallback
  if (sportId === 3) return hikingTrail; // golf fallback
  return runningTrail;
};

// ── Carga diferida de Leaflet (solo client, nunca SSR) ────────────────────────
const LeafletMap = lazy(() =>
  import("./LeafletMap").then((m) => ({ default: m.default }))
);

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
const sports = ["Todos", "Fútbol", "Tenis", "Golf", "Pádel"] as const;

// ── Helper: parsear WKT/WKB/GeoJSON a {lat, lng} ─────────────────────────────
export function parseLocation(location: any): { lat: number; lng: number } | null {
  if (!location) return null;

  if (typeof location === "object") {
    if (typeof location.lat === "number" && typeof location.lng === "number")
      return { lat: location.lat, lng: location.lng };
    if (Array.isArray(location) && location.length >= 2)
      return { lat: location[0], lng: location[1] };
    if (
      location.type === "Point" &&
      Array.isArray(location.coordinates) &&
      location.coordinates.length >= 2
    )
      return { lat: location.coordinates[1], lng: location.coordinates[0] };
  }

  if (typeof location === "string") {
    if (location.toUpperCase().includes("POINT")) {
      const cleaned = location
        .toUpperCase()
        .replace("POINT", "")
        .replace("(", "")
        .replace(")", "")
        .trim();
      const parts = cleaned.split(/\s+/);
      if (parts.length >= 2) {
        let lng = parseFloat(parts[0]);
        let lat = parseFloat(parts[1]);
        // Parche: coordenadas invertidas (Caracas lat≈10, lng≈-66)
        if (lat < -20 && lng > 0) { const t = lat; lat = lng; lng = t; }
        return { lat, lng };
      }
    } else if (/^[0-9A-Fa-f]+$/.test(location) && location.length >= 50) {
      try {
        const buf = new Uint8Array(
          location.match(/../g)!.map((h: string) => parseInt(h, 16))
        ).buffer;
        const dv = new DataView(buf);
        let lng = dv.getFloat64(9, true);
        let lat = dv.getFloat64(17, true);
        if (lat < -20 && lng > 0) { const t = lat; lat = lng; lng = t; }
        return { lat, lng };
      } catch { /* silencioso */ }
    }
  }

  return null;
}

// ── Componente principal ──────────────────────────────────────────────────────
export function MapScreen({
  onSelect,
  userLocation: propUserLocation,
  setUserLocation: propSetUserLocation,
}: {
  onSelect: (e: any) => void;
  userLocation?: { lat: number; lng: number } | null;
  setUserLocation?: (loc: { lat: number; lng: number } | null) => void;
}) {
  const [active, setActive] = useState<string>("Todos");
  const [events, setEvents] = useState<any[]>([]);
  const [canchas, setCanchas] = useState<any[]>([]);
  const [selectedCancha, setSelectedCancha] = useState<any>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [localUserLocation, setLocalUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const userLocation = propUserLocation !== undefined ? propUserLocation : localUserLocation;
  const setUserLocation = propSetUserLocation !== undefined ? propSetUserLocation : setLocalUserLocation;

  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUser(data.user);
    });
  }, []);

  // ── Obtener ubicación GPS del usuario ──────────────────────────────────────
  const handleLocateUser = useCallback(() => {
    // Si ya tiene ubicación, desactivarla (toggle)
    if (userLocation) {
      setUserLocation(null);
      setLocationError(null);
      return;
    }

    if (!navigator.geolocation) {
      setLocationError("Tu navegador no soporta geolocalización");
      return;
    }

    setLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("📍 Ubicación GPS del usuario:", { lat: latitude, lng: longitude });
        setUserLocation({ lat: latitude, lng: longitude });
        setLocating(false);
      },
      (error) => {
        console.error("❌ Error GPS:", error);
        let msg = "No se pudo obtener tu ubicación";
        if (error.code === error.PERMISSION_DENIED) msg = "Permiso de ubicación denegado";
        else if (error.code === error.POSITION_UNAVAILABLE) msg = "Ubicación no disponible";
        else if (error.code === error.TIMEOUT) msg = "Tiempo de espera agotado";
        setLocationError(msg);
        setLocating(false);
      },
      (error) => {
        console.error("❌ Error GPS:", error);
        let msg = "No se pudo obtener tu ubicación";
        if (error.code === error.PERMISSION_DENIED) msg = "Permiso de ubicación denegado";
        else if (error.code === error.POSITION_UNAVAILABLE) msg = "Ubicación no disponible";
        else if (error.code === error.TIMEOUT) msg = "Tiempo de espera agotado";
        setLocationError(msg);
        setLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, [userLocation, setUserLocation]);

  // ── Fetch de datos ──────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    // Canchas
    const { data: canchasData, error: canchasError } = await supabase
      .from("canchas")
      .select("*");
    console.log("🕵️‍♂️ CANCHAS DATA (raw):", canchasData);
    if (canchasError) console.error("❌ ERROR CANCHAS:", canchasError);
    if (canchasData) {
      const processedCanchas = canchasData.map((c: any) => {
        const coords = parseLocation(c.location);
        console.log(`📍 Cancha "${c.name}" coords:`, coords);
        return { ...c, lat: coords?.lat ?? null, lng: coords?.lng ?? null };
      });
      setCanchas(processedCanchas);
    }

    // Eventos / Partidos
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) { console.error("Error fetching events:", error); return; }

    if (data) {
      const processed = data.map((row: any) => {
        const coords = parseLocation(row.location);
        const lat = coords?.lat ?? 0;
        const lng = coords?.lng ?? 0;

        const sportName =
          row.sport_id === 1 ? "Fútbol"
          : row.sport_id === 2 ? "Tenis"
          : row.sport_id === 3 ? "Golf"
          : row.sport_id === 4 ? "Pádel"
          : "Otro";

        return {
          ...row,
          lat,
          lng,
          sport: sportName,
          title: row.title || `Evento de ${sportName}`,
          hostName: row.creator_username || "Usuario",
          hostAvatar: (row.creator_username || "U").substring(0, 2).toUpperCase(),
          time: row.event_date
            ? new Date(row.event_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : "00:00",
          date: row.event_date
            ? new Date(row.event_date).toLocaleDateString("es-VE", {
                weekday: "short", day: "numeric", month: "short",
              })
            : "Próximamente",
          image: getSportImage(row.sport_id),
          joined: row.joined ?? 1,
          spots: row.max_capacity || 10,
          price: 0,
          zone: "Caracas",
        };
      });

      console.log("Eventos cargados:", processed);
      setEvents(processed);
    }
  }, []);

  const fetchEvents = fetchData;

  useEffect(() => {
    fetchEvents();

    const channel = supabase
      .channel("public:events")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "events" }, () => fetchEvents())
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "events" }, () => fetchEvents())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchEvents]);

  const filtered = active === "Todos"
    ? events.filter((e) => !currentUser || e.creator_username !== currentUser.email)
    : events.filter((e) => e.sport === active && (!currentUser || e.creator_username !== currentUser.email));

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="relative h-full overflow-hidden bg-muted">

      {/* ── Mapa (solo pines verdes de canchas) ── */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<MapSkeleton />}>
          <LeafletMap
            canchas={canchas}
            onCanchaClick={(cancha: any) => setSelectedCancha(cancha)}
            userLocation={userLocation}
            onLocationSelect={(lat, lng) => {
              console.log("📍 Ubicación seleccionada en mapa:", { lat, lng });
              setUserLocation({ lat, lng });
            }}
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
                active === s ? "bg-secondary text-primary-foreground" : "glass text-secondary"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Panel emergente de cancha ── */}
      {selectedCancha && (
        <div className="absolute bottom-0 inset-x-0 z-40 bg-background rounded-t-3xl shadow-2xl px-5 pt-4 pb-10 border-t border-border animate-in slide-in-from-bottom duration-300">
          {/* Drag handle */}
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-muted-foreground/20" />

          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-200">
                <MapPin size={10} /> Hub Deportivo
              </span>
              <h3 className="mt-1.5 text-base font-extrabold text-secondary tracking-tight">
                {selectedCancha.name}
              </h3>
              {selectedCancha.description && (
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                  {selectedCancha.description}
                </p>
              )}
              {selectedCancha.price != null && selectedCancha.price > 0 ? (
                <p className="text-xs font-semibold text-primary mt-1">Bs. {selectedCancha.price}/hora</p>
              ) : (
                <p className="text-xs font-semibold text-emerald-600 mt-1">Acceso gratuito</p>
              )}
            </div>
            <button
              onClick={() => setSelectedCancha(null)}
              className="grid h-8 w-8 place-items-center rounded-full bg-muted text-secondary hover:bg-muted/80 transition-colors"
              aria-label="Cerrar"
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          </div>

          {/* Partidos en esta cancha */}
          <div className="mt-5 space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Partidos programados
            </h4>

            {(() => {
              // selectedCancha ya viene con lat/lng numéricos procesados por fetchData
              if (selectedCancha.lat == null || selectedCancha.lng == null) return (
                <p className="text-xs text-muted-foreground">Coordenadas no disponibles.</p>
              );

              const canchaEvents = filtered.filter((e) => {
                if (e.lat == null || isNaN(e.lat) || e.lng == null || isNaN(e.lng)) return false;
                const diffLat = Math.abs(e.lat - selectedCancha.lat);
                const diffLng = Math.abs(e.lng - selectedCancha.lng);
                return diffLat < 0.0001 && diffLng < 0.0001;
              });

              if (canchaEvents.length === 0) {
                return (
                  <div className="rounded-2xl border border-dashed border-border p-5 text-center">
                    <p className="text-xs font-medium text-muted-foreground">
                      No hay partidos programados aquí
                    </p>
                    <button
                      onClick={() => { setSelectedCancha(null); setShowCreateForm(true); }}
                      className="mt-3 text-[11px] font-bold text-primary hover:underline"
                    >
                      + Crear un partido aquí
                    </button>
                  </div>
                );
              }

              return (
                <div className="max-h-[180px] overflow-y-auto space-y-2.5 pr-1">
                  {canchaEvents.map((e) => (
                    <button
                      key={e.id}
                      onClick={() => onSelect(e)}
                      className="w-full flex items-center justify-between rounded-2xl bg-card p-3 border border-border transition-all active:scale-[0.98] hover:border-primary/40 text-left"
                    >
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-secondary truncate">{e.title}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">
                          ⏰ {e.date} · {e.time}
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">
                          👥 {e.joined}/{e.spots} jugadores
                        </div>
                      </div>
                      <span className="shrink-0 ml-2 rounded-full bg-secondary/10 px-2 py-0.5 text-[10px] font-bold text-secondary">
                        {e.sport}
                      </span>
                    </button>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ── Botón GPS — Mi ubicación ── */}
      {!selectedCancha && (
        <button
          id="btn-locate-user"
          onClick={handleLocateUser}
          className={`absolute bottom-40 right-4 z-30 grid h-12 w-12 place-items-center rounded-2xl shadow-soft transition-all active:scale-90 hover:scale-105 ${
            userLocation
              ? "bg-blue-500 text-white shadow-[0_8px_25px_-4px_rgba(59,130,246,0.5)]"
              : "glass text-secondary"
          }`}
          aria-label="Mi ubicación"
          title="Mi ubicación GPS"
        >
          {locating ? (
            <div className="h-5 w-5 rounded-full border-2 border-current border-t-transparent animate-spin" />
          ) : (
            <Crosshair size={20} strokeWidth={2.5} />
          )}
        </button>
      )}

      {/* ── Toast de error de ubicación ── */}
      {locationError && (
        <div className="absolute bottom-40 left-4 right-20 z-30 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="rounded-2xl bg-destructive/90 px-4 py-3 text-xs font-semibold text-destructive-foreground shadow-soft backdrop-blur-sm">
            {locationError}
            <button
              onClick={() => setLocationError(null)}
              className="ml-2 underline opacity-80 hover:opacity-100"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* ── FAB — Crear evento ── */}
      {!selectedCancha && (
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

      {/* ── Panel de creación ── */}
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
