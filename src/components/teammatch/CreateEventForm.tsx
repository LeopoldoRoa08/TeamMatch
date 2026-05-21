import { useState, useEffect, lazy, Suspense } from "react";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Users,
  Zap,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Trophy,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { CanchasScreen, type Cancha } from "./CanchasScreen";

const LeafletMap = lazy(() => import("./LeafletMap").then((m) => ({ default: m.default })));

function MapSkeleton() {
  return (
    <div className="flex h-[250px] w-full items-center justify-center bg-muted">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <span className="text-xs font-medium">Cargando mapa…</span>
      </div>
    </div>
  );
}

// ─── Catálogo de deportes ───────────────────────────────────────────────────
const SPORTS = [
  { id: 1, label: "Fútbol", emoji: "⚽" },
  { id: 2, label: "Tenis", emoji: "🎾" },
  { id: 3, label: "Golf", emoji: "⛳" },
  { id: 4, label: "Pádel", emoji: "🏓" },
] as const;

type SportId = (typeof SPORTS)[number]["id"];

// ─── Intensidades ────────────────────────────────────────────────────────────
const INTENSITIES = ["Principiante", "Intermedio", "Pro"] as const;
type Intensity = (typeof INTENSITIES)[number];

// ─── Colores por intensidad ──────────────────────────────────────────────────
const INTENSITY_STYLE: Record<Intensity, string> = {
  Principiante: "bg-emerald-50 text-emerald-700 ring-emerald-300",
  Intermedio: "bg-amber-50 text-amber-700 ring-amber-300",
  Pro: "bg-red-50 text-red-700 ring-red-300",
};

// ─── Props ───────────────────────────────────────────────────────────────────
interface Props {
  onClose: () => void;
  onEventCreated: () => void;
}

// ─── Estado inicial del formulario ───────────────────────────────────────────
const INITIAL_FORM = {
  sportId: null as SportId | null,
  intensity: null as Intensity | null,
  date: "",
  time: "",
  latitude: "",
  longitude: "",
  address: "",
  maxCapacity: "",
};

type FormState = typeof INITIAL_FORM;
type FieldError = Partial<Record<keyof FormState, string>>;

// ─── Componente principal ────────────────────────────────────────────────────
export function CreateEventForm({ onClose, onEventCreated }: Props) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FieldError>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [selectedCancha, setSelectedCancha] = useState<Cancha | null>(null);
  const [showCanchas, setShowCanchas] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setIsOrganizer(data.user.user_metadata?.is_organizer === true);
      }
    });
  }, []);

  // ── Actualizar campo ──────────────────────────────────────────────────────
  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    // limpiar error individual al editar
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  // ── Manejar click en el mapa ──────────────────────────────────────────────
  async function handleMapClick(lat: number, lng: number) {
    setField("latitude", lat.toString());
    setField("longitude", lng.toString());
    setField("address", "Buscando dirección...");

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      if (data && data.display_name) {
        // Extraemos un nombre amigable: calle, barrio, o la primera parte del display_name
        const name = data.address?.road || data.address?.suburb || data.display_name.split(',')[0];
        setField("address", name);
      } else {
        setField("address", `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      }
    } catch (e) {
      console.error("Geocoding error:", e);
      setField("address", `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    }
  }

  // ── Validación ────────────────────────────────────────────────────────────
  function validate(): boolean {
    const newErrors: FieldError = {};

    if (!form.sportId) newErrors.sportId = "Selecciona un deporte";
    if (!form.intensity) newErrors.intensity = "Selecciona la intensidad";
    if (!form.date) newErrors.date = "La fecha es obligatoria";
    if (!form.time) newErrors.time = "La hora es obligatoria";
    if (!form.latitude || !form.longitude) {
      newErrors.latitude = "Ingresa latitud y longitud";
    } else {
      const lat = parseFloat(form.latitude);
      const lng = parseFloat(form.longitude);
      if (isNaN(lat) || lat < -90 || lat > 90)
        newErrors.latitude = "Latitud inválida (-90 a 90)";
      if (isNaN(lng) || lng < -180 || lng > 180)
        newErrors.longitude = "Longitud inválida (-180 a 180)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  async function handleSubmit() {
    if (!validate()) return;

    setStatus("loading");
    setServerError(null);

    try {
      // Combinar fecha y hora en ISO 8601
      const eventDate = new Date(`${form.date}T${form.time}:00`).toISOString();

      // Formatear ubicación como WKT POINT para PostGIS / columna text
      const location = `POINT(${parseFloat(form.longitude)} ${parseFloat(form.latitude)})`;

      // Obtener usuario autenticado
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setServerError("Debes iniciar sesión para crear un evento.");
        setStatus("error");
        return;
      }


      // ── Payload del insert (esquema real de la tabla events) ────────────
      // Columnas: id, creator_username, sport_id, location (geography),
      //           event_date, max_capacity, status (enum), intensity (enum),
      //           description_after_arrival, created_at
      // creator_username debe coincidir exactamente con el registro en la tabla profiles
      // Usamos user.email como fuente de verdad (FK estricta)
      if (!user.email) {
        setServerError("No se pudo obtener el email del usuario. Intenta cerrar sesión y volver a entrar.");
        setStatus("error");
        return;
      }

      const payload = {
        // creator_username: email exacto del usuario (Foreign Key → tabla profiles)
        creator_username: user.email,

        // sport_id: entero — form.sportId ya viene del catálogo numérico (1-4)
        sport_id: form.sportId,

        // location: geography Point — formato WKT aceptado por PostGIS/Supabase
        location,

        // event_date: timestamp ISO 8601
        event_date: eventDate,

        // max_capacity: entero opcional
        max_capacity: form.maxCapacity ? parseInt(form.maxCapacity, 10) : null,

        // intensity: enum intensity_level — 'Principiante' | 'Intermedio' | 'Pro'
        intensity: form.intensity,

        // status: enum event_status — 'abierto' | 'lleno' | 'cancelado' | 'finalizado'
        status: "abierto",
      };

      // 🔍 Debug: verificar el payload exacto antes de enviarlo a Supabase
      console.log("Payload a enviar:", payload);

      const { error: insertError } = await supabase.from("events").insert(payload);

      if (insertError) throw insertError;

      setStatus("success");

      // Limpiar formulario tras éxito
      setTimeout(() => {
        setForm(INITIAL_FORM);
        setStatus("idle");
        onEventCreated();
        onClose();
      }, 1500);
    } catch (err: unknown) {
      // Loggear el error completo de Supabase (PostgrestError) para diagnóstico
      if (err && typeof err === "object" && "message" in err) {
        const pgErr = err as { message: string; details?: string; hint?: string; code?: string };
        console.error("❌ Supabase insert error:", {
          message: pgErr.message,
          details: pgErr.details,
          hint: pgErr.hint,
          code: pgErr.code,
        });
        setServerError(
          `Error al crear el evento: ${pgErr.message}${pgErr.hint ? ` — ${pgErr.hint}` : ""}`,
        );
      } else {
        console.error("❌ Error inesperado:", err);
        setServerError("Error inesperado al crear el evento. Revisa la consola para más detalles.");
      }
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="absolute inset-0 z-50 flex h-full flex-col items-center justify-center space-y-6 bg-background px-6 text-center animate-in fade-in zoom-in duration-500">
        <div className="grid h-24 w-24 place-items-center rounded-full bg-emerald-500 text-white shadow-pop ring-8 ring-emerald-500/20">
          <CheckCircle2 size={48} strokeWidth={2.5} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-secondary">¡Evento publicado!</h2>
          <p className="text-sm text-muted-foreground">
            Tu partido ya está en el mapa, listo para que otros jugadores se unan.
          </p>
        </div>
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-background">
      {/* ── Panel de canchas (overlay) ── */}
      {showCanchas && (
        <div className="absolute inset-0 z-50 bg-background">
          <CanchasScreen
            isOrganizer={isOrganizer}
            onBack={() => setShowCanchas(false)}
            onSelect={(cancha) => {
              setSelectedCancha(cancha);
              setShowCanchas(false);
            }}
          />
        </div>
      )}
      {/* ── Header ── */}
      <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/90 px-4 pb-3 pt-12 backdrop-blur">
        <button
          onClick={onClose}
          className="grid h-10 w-10 place-items-center rounded-full bg-muted transition-all active:scale-95"
          aria-label="Cerrar formulario"
        >
          <ArrowLeft size={18} className="text-secondary" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-secondary">Nuevo evento</h1>
          <p className="text-[11px] text-muted-foreground">
            Completa los datos para publicar tu evento
          </p>
        </div>
      </div>

      {/* ── Cuerpo del formulario ── */}
      <div className="flex-1 overflow-y-auto px-5 py-5 pb-32 space-y-6">

        {/* Deporte */}
        <FormSection
          title="Deporte"
          icon={<Zap size={13} />}
          error={errors.sportId}
          required
        >
          <div className="grid grid-cols-2 gap-2">
            {SPORTS.map((s) => (
              <button
                key={s.id}
                id={`sport-btn-${s.id}`}
                onClick={() => setField("sportId", s.id)}
                className={`flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-sm font-semibold transition-all active:scale-[0.97] ${
                  form.sportId === s.id
                    ? "gradient-primary border-transparent text-secondary shadow-pop"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40"
                }`}
              >
                <span className="text-xl">{s.emoji}</span>
                {s.label}
              </button>
            ))}
          </div>
        </FormSection>

        {/* Intensidad */}
        <FormSection
          title="Intensidad"
          icon={<Zap size={13} />}
          error={errors.intensity}
          required
        >
          <div className="grid grid-cols-3 gap-2">
            {INTENSITIES.map((lvl) => (
              <button
                key={lvl}
                id={`intensity-btn-${lvl.toLowerCase()}`}
                onClick={() => setField("intensity", lvl)}
                className={`rounded-xl py-2.5 text-xs font-bold ring-1 transition-all active:scale-95 ${
                  form.intensity === lvl
                    ? `${INTENSITY_STYLE[lvl]} ring-current shadow-sm`
                    : "bg-muted text-muted-foreground ring-transparent"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </FormSection>

        {/* Fecha y Hora */}
        <div className="grid grid-cols-2 gap-3">
          <FormSection
            title="Fecha"
            icon={<Calendar size={13} />}
            error={errors.date}
            required
          >
            <input
              id="event-date-input"
              type="date"
              value={form.date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setField("date", e.target.value)}
              className={`w-full rounded-2xl border bg-card px-3 py-3 text-sm font-medium text-secondary outline-none transition-colors focus:border-primary ${
                errors.date ? "border-destructive" : "border-border"
              }`}
            />
          </FormSection>

          <FormSection
            title="Hora"
            icon={<Clock size={13} />}
            error={errors.time}
            required
          >
            <input
              id="event-time-input"
              type="time"
              value={form.time}
              onChange={(e) => setField("time", e.target.value)}
              className={`w-full rounded-2xl border bg-card px-3 py-3 text-sm font-medium text-secondary outline-none transition-colors focus:border-primary ${
                errors.time ? "border-destructive" : "border-border"
              }`}
            />
          </FormSection>
        </div>

        {/* Ubicación */}
        <FormSection
          title="Ubicación"
          icon={<MapPin size={13} />}
          error={errors.latitude || errors.longitude}
          required
        >
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
            <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
              <MapPin size={16} className="text-primary shrink-0" />
              <span className="text-xs font-semibold text-muted-foreground line-clamp-1">
                {form.address || "Toca el mapa para elegir el lugar"}
              </span>
            </div>
            
            {/* Mapa Leaflet interactivo */}
            <div className="relative z-0 h-[250px] w-full">
              <Suspense fallback={<MapSkeleton />}>
                <LeafletMap 
                  events={[]} 
                  onLocationSelect={handleMapClick}
                />
              </Suspense>
            </div>

            {(form.latitude || form.longitude) && !errors.latitude && !errors.longitude && (
              <div className="flex items-center gap-1.5 border-t border-border bg-emerald-50 px-3 py-2">
                <CheckCircle2 size={12} className="text-emerald-600" />
                <span className="text-[11px] font-medium text-emerald-700">
                  Guardará como: POINT({parseFloat(form.longitude).toFixed(4)} {parseFloat(form.latitude).toFixed(4)})
                </span>
              </div>
            )}
          </div>
        </FormSection>

        {/* Cancha (opcional) */}
        <FormSection title="Cancha" icon={<Trophy size={13} />}>
          <button
            id="select-cancha-btn"
            type="button"
            onClick={() => setShowCanchas(true)}
            className={`w-full flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-sm font-semibold transition-all active:scale-[0.97] ${
              selectedCancha
                ? "border-primary/40 bg-primary/5 text-secondary"
                : "border-border bg-card text-muted-foreground hover:border-primary/40"
            }`}
          >
            <Trophy size={16} className="shrink-0 text-muted-foreground" />
            <span className="flex-1 text-left">
              {selectedCancha ? selectedCancha.name : "Seleccionar cancha (opcional)"}
            </span>
            {selectedCancha && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setSelectedCancha(null); }}
                className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground hover:text-destructive"
              >
                ✕
              </button>
            )}
            <ChevronRight size={16} className="shrink-0 text-muted-foreground" />
          </button>
        </FormSection>

        {/* Capacidad máxima (opcional) */}
        <FormSection
          title="Capacidad máxima"
          icon={<Users size={13} />}
        >
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 shadow-soft focus-within:border-primary transition-colors">
            <Users size={16} className="shrink-0 text-muted-foreground" />
            <input
              id="event-capacity-input"
              type="number"
              min={1}
              max={100}
              placeholder="Ej: 12 jugadores (opcional)"
              value={form.maxCapacity}
              onChange={(e) => setField("maxCapacity", e.target.value)}
              className="w-full bg-transparent text-sm font-medium text-secondary outline-none placeholder:text-muted-foreground/50"
            />
          </div>
        </FormSection>

        {/* Error del servidor */}
        {status === "error" && serverError && (
          <div className="flex items-start gap-2.5 rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3">
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-destructive" />
            <p className="text-sm text-destructive">{serverError}</p>
          </div>
        )}
      </div>

      {/* ── Footer con botón de acción ── */}
      <div className="absolute inset-x-0 bottom-0 z-20 glass border-t border-border px-5 py-4">
        {/* Resumen rápido */}
        {form.sportId && form.intensity && (
          <div className="mb-3 flex items-center gap-2 text-[11px] text-muted-foreground">
            <span className="font-semibold text-secondary">
              {SPORTS.find((s) => s.id === form.sportId)?.emoji}{" "}
              {SPORTS.find((s) => s.id === form.sportId)?.label}
            </span>
            <span>·</span>
            <span>{form.intensity}</span>
            {form.date && form.time && (
              <>
                <span>·</span>
                <span>
                  {new Date(`${form.date}T${form.time}`).toLocaleString("es-VE", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </>
            )}
          </div>
        )}

        <button
          id="publish-event-btn"
          onClick={handleSubmit}
          disabled={status === "loading"}
          className={`w-full rounded-2xl py-3.5 text-sm font-bold transition-all active:scale-[0.98] ${
            status === "loading"
              ? "gradient-primary cursor-not-allowed opacity-70 text-secondary"
              : "gradient-primary text-secondary shadow-pop hover:shadow-lg"
          }`}
        >
          {status === "loading" ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              Publicando evento…
            </span>
          ) : (
            "Publicar evento"
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Helper: Sección de formulario ──────────────────────────────────────────
function FormSection({
  title,
  icon,
  error,
  required,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
        {icon}
        {title}
        {required && <span className="text-primary">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-[11px] font-medium text-destructive">
          <AlertCircle size={11} />
          {error}
        </p>
      )}
    </div>
  );
}
