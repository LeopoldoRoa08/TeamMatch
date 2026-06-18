import { useState, useEffect, useCallback, lazy, Suspense, useMemo } from "react";
import { X, MapPin, Crosshair, MessageSquare, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useSettings } from "@/lib/SettingsContext";
import { UserAvatar } from "./UserAvatar";
import footballField from "@/assets/football-field.jpg";
import padelCourt from "@/assets/padel-court.jpg";
import hikingTrail from "@/assets/hiking-trail.jpg";
import runningTrail from "@/assets/running-trail.jpg";
import tennisCourt from "@/assets/tennis-court.png";
import golfCourse from "@/assets/golf-course.png";

const getSportImage = (sportId: number) => {
  if (sportId === 1) return footballField;
  if (sportId === 2) return tennisCourt;
  if (sportId === 3) return golfCourse;
  if (sportId === 4) return padelCourt;
  return runningTrail;
};

// ── Carga diferida de Leaflet (solo client, nunca SSR) ────────────────────────
const LeafletMap = lazy(() =>
  import("./LeafletMap").then((m) => ({ default: m.default }))
);

// ── Esqueleto mientras carga el mapa ─────────────────────────────────────────
function MapSkeleton() {
  const { t } = useSettings();
  return (
    <div className="h-full w-full animate-pulse bg-muted">
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <span className="text-xs font-medium">{t("map.loading") || "Loading map…"}</span>
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

// ── Helper: Haversine distance ───────────────────────────────────────────────
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ── Componente principal ──────────────────────────────────────────────────────
export function MapScreen({
  onSelect,
  userLocation: propUserLocation,
  setUserLocation: propSetUserLocation,
  onNavigateToComments,
  onNavigateToProfile,
}: {
  onSelect: (e: any) => void;
  userLocation?: { lat: number; lng: number } | null;
  setUserLocation?: (loc: { lat: number; lng: number } | null) => void;
  onNavigateToComments: (cancha: any) => void;
  onNavigateToProfile?: () => void;
}) {
  const { t } = useSettings();
  const [active, setActive] = useState<string>("Todos");
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [distanceLevel, setDistanceLevel] = useState<string>("Cualquier distancia");
  const [events, setEvents] = useState<any[]>([]);
  const [canchas, setCanchas] = useState<any[]>([]);
  const [selectedCancha, setSelectedCancha] = useState<any>(null);
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
      setLocationError(t("map.error.unsupported") || "Tu navegador no soporta geolocalización");
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
        let msg = t("map.error.failed") || "No se pudo obtener tu ubicación";
        if (error.code === error.PERMISSION_DENIED) msg = t("map.error.denied") || "Permiso de ubicación denegado";
        else if (error.code === error.POSITION_UNAVAILABLE) msg = t("map.error.unavailable") || "Ubicación no disponible";
        else if (error.code === error.TIMEOUT) msg = t("map.error.timeout") || "Tiempo de espera agotado";
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
      .select("*, canchas(name)")
      .order("created_at", { ascending: false });

    if (error) { console.error("Error fetching events:", error); return; }

    if (data) {
      const processed = data.map((row: any) => {
        const coords = parseLocation(row.location);
        const lat = coords?.lat ?? 0;
        const lng = coords?.lng ?? 0;

        const sportName =
          row.sport_id === 1 ? (t("sports.football") || "Fútbol")
          : row.sport_id === 2 ? (t("sports.tennis") || "Tenis")
          : row.sport_id === 3 ? (t("sports.golf") || "Golf")
          : row.sport_id === 4 ? (t("sports.padel") || "Pádel")
          : (t("sports.other") || "Otro");

        return {
          ...row,
          lat,
          lng,
          sport: sportName,
          title: row.title || `Evento de ${sportName}`,
          host: row.creator_username || "Usuario",
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
          canchas: row.canchas,
          cancha_name: row.canchas?.name,
          description_after_arrival: row.description_after_arrival,
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

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      // Filtro por deporte
      if (active !== "Todos" && e.sport !== active) return false;

      // Filtro por fecha
      if (selectedDate && e.event_date) {
        if (!e.event_date.startsWith(selectedDate)) return false;
      }

      // Filtro por distancia
      if (userLocation && e.lat != null && e.lng != null) {
        const dist = calculateDistance(userLocation.lat, userLocation.lng, e.lat, e.lng);
        let maxDist = Infinity;
        if (distanceLevel === "Cerca") maxDist = 5;
        else if (distanceLevel === "Medio") maxDist = 15;
        
        if (dist > maxDist) return false;
      }

      return true;
    });
  }, [events, active, selectedDate, userLocation, distanceLevel]);

  const filteredCanchas = useMemo(() => {
    return canchas.filter((c) => {
      // Filtro por deporte
      if (selectedSport && selectedSport !== "Todos") {
        const sportIdMap: Record<string, number> = {
          "Fútbol": 1,
          "Tenis": 2,
          "Golf": 3,
          "Pádel": 4,
        };
        const targetId = sportIdMap[selectedSport];
        if (c.sport_id !== targetId && c.sport !== selectedSport) return false;
      }

      // Filtro por fecha: si hay una fecha seleccionada, la cancha debe tener al menos un evento en esa fecha
      if (selectedDate) {
        if (c.lat == null || c.lng == null) return false;
        const hasEventOnDate = filteredEvents.some((e) => {
          if (e.lat == null || isNaN(e.lat) || e.lng == null || isNaN(e.lng)) return false;
          const diffLat = Math.abs(e.lat - c.lat);
          const diffLng = Math.abs(e.lng - c.lng);
          return diffLat < 0.0001 && diffLng < 0.0001;
        });
        if (!hasEventOnDate) return false;
      }

      // Filtro por distancia
      if (userLocation && c.lat != null && c.lng != null) {
        const dist = calculateDistance(userLocation.lat, userLocation.lng, c.lat, c.lng);
        let maxDist = Infinity;
        if (distanceLevel === "Cerca") maxDist = 5;
        else if (distanceLevel === "Medio") maxDist = 15;
        
        if (dist > maxDist) return false;
      }

      return true;
    });
  }, [canchas, selectedSport, userLocation, distanceLevel, selectedDate, filteredEvents]);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="relative h-full overflow-hidden bg-muted">

      {/* ── Mapa (solo pines verdes de canchas) ── */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<MapSkeleton />}>
          <LeafletMap
            canchas={filteredCanchas}
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
      <div className="absolute inset-x-0 top-0 z-20 pt-12 pointer-events-none flex flex-col">
        {/* User avatar on the left */}
        <div className="px-4 mb-3 pointer-events-auto w-fit">
          <UserAvatar size="sm" className="shadow-lg ring-2 ring-primary/20 bg-background/90 backdrop-blur-sm cursor-pointer" onClick={onNavigateToProfile} />
        </div>

        {/* Filtros de deporte */}
        <div className="w-full flex gap-3 overflow-x-auto px-4 pb-4 pointer-events-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x">
          {sports.map((s) => {
            const isActive = s === "Todos" ? selectedSport === null : selectedSport === s;
            return (
              <button
                key={s}
                onClick={() => {
                  if (s === "Todos") {
                    setSelectedSport(null);
                    setActive("Todos");
                  } else {
                    if (selectedSport === s) {
                      setSelectedSport(null);
                      setActive("Todos");
                    } else {
                      setSelectedSport(s);
                      setActive(s);
                    }
                  }
                }}
                className={`snap-center shrink-0 whitespace-nowrap rounded-3xl px-6 py-3.5 text-sm font-black tracking-wide shadow-xl transition-all border-2 ${
                  isActive
                    ? "bg-primary text-secondary border-primary scale-[1.02]"
                    : "bg-background/95 text-secondary border-transparent hover:bg-background backdrop-blur-md"
                }`}
              >
                {s === "Todos" ? (t("sports.all") || "Todos") : (t(`sports.${s.toLowerCase().replace('ú', 'u').replace('á', 'a')}`) || s)}
              </button>
            );
          })}

          {/* Filtro de Fecha */}
          <div className="snap-center shrink-0 flex items-center bg-background/95 text-secondary border-transparent hover:bg-background backdrop-blur-md rounded-3xl px-5 py-3 text-sm font-black tracking-wide shadow-xl transition-all border-2">
            <input 
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent outline-none cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 hover:[&::-webkit-calendar-picker-indicator]:opacity-100"
            />
          </div>

          {/* Filtro de Distancia */}
          <div className="snap-center shrink-0 flex items-center bg-background/95 text-secondary border-transparent hover:bg-background backdrop-blur-md rounded-3xl px-5 py-3 text-sm font-black tracking-wide shadow-xl transition-all border-2">
            <select
              value={distanceLevel}
              onChange={(e) => setDistanceLevel(e.target.value)}
              className="bg-transparent outline-none cursor-pointer font-black"
            >
              <option value="Cerca">{t("map.distanceNear") || "Cerca (≤ 5km)"}</option>
              <option value="Medio">{t("map.distanceMedium") || "Medio (≤ 15km)"}</option>
              <option value="Cualquier distancia">{t("map.distanceAny") || "Cualquier distancia"}</option>
            </select>
          </div>
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
                <MapPin size={10} /> {t("map.hub") || "Hub Deportivo"}
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
                <p className="text-xs font-semibold text-primary mt-1">Bs. {selectedCancha.price}/{t("map.perHour") || "hora"}</p>
              ) : (
                <p className="text-xs font-semibold text-emerald-600 mt-1">{t("map.freeAccess") || "Acceso gratuito"}</p>
              )}
            </div>
            <button
              onClick={() => setSelectedCancha(null)}
              className="grid h-8 w-8 place-items-center rounded-full bg-muted text-secondary hover:bg-muted/80 transition-colors"
              aria-label={t("common.close") || "Cerrar"}
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          </div>

          {/* Caja de Comentarios */}
          <button
            onClick={() => onNavigateToComments(selectedCancha)}
            className="w-full flex items-center justify-between mt-4 rounded-2xl bg-secondary/5 hover:bg-secondary/10 p-3.5 border border-secondary/15 transition-all active:scale-[0.98] text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary/10 text-secondary group-hover:scale-105 transition-transform">
                <MessageSquare size={20} className="text-primary" />
              </div>
              <div>
                <div className="font-bold text-xs text-secondary">{t("map.commentsTitle") || "Comentarios de la cancha"}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  {t("map.commentsDesc") || "Mira opiniones o escribe sobre esta cancha"}
                </div>
              </div>
            </div>
            <ChevronRight size={16} className="text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Partidos en esta cancha */}
          <div className="mt-5 space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {t("map.scheduledMatches") || "Partidos programados"}
            </h4>

            {(() => {
              // selectedCancha ya viene con lat/lng numéricos procesados por fetchData
              if (selectedCancha.lat == null || selectedCancha.lng == null) return (
                <p className="text-xs text-muted-foreground">{t("map.coordsNotAvailable") || "Coordenadas no disponibles."}</p>
              );

              const canchaEvents = filteredEvents.filter((e) => {
                if (e.lat == null || isNaN(e.lat) || e.lng == null || isNaN(e.lng)) return false;
                const diffLat = Math.abs(e.lat - selectedCancha.lat);
                const diffLng = Math.abs(e.lng - selectedCancha.lng);
                return diffLat < 0.0001 && diffLng < 0.0001;
              });

              if (canchaEvents.length === 0) {
                return (
                  <div className="rounded-2xl border border-dashed border-border p-6 text-center">
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {t("map.noMatches") || "No hay partidos programados aquí"}
                    </p>
                    <p className="text-xs text-muted-foreground">{t("map.createOne") || "¡Ve a la pestaña Eventos para crear uno!"}</p>
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
                          👥 {e.joined}/{e.spots} {t("map.players") || "jugadores"}
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
          aria-label={t("map.myLocation") || "Mi ubicación"}
          title={t("map.gpsLoc") || "Mi ubicación GPS"}
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
              {t("common.close") || "Cerrar"}
            </button>
          </div>
        </div>
      )}


    </div>
  );
}
