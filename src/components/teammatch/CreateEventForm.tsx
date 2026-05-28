import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Zap,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MapPin,
  FileText,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AddCanchaForm } from "./CanchasScreen";
import { useCurrentUser } from "@/lib/UserContext";

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
  initialCancha?: any;
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
  canchaId: "",
  descriptionAfterArrival: "",
};

type FormState = typeof INITIAL_FORM;
type FieldError = Partial<Record<keyof FormState, string>>;

// Helper function to parse location coordinates (same robust parser as LeafletMap)
function parseLocation(location: any): { lat: number; lng: number } | null {
  if (!location) return null;
  if (typeof location === "object") {
    if (typeof location.lat === "number" && typeof location.lng === "number") {
      return { lat: location.lat, lng: location.lng };
    }
    if (Array.isArray(location) && location.length >= 2) {
      return { lat: location[0], lng: location[1] };
    }
    if (location.type === "Point" && Array.isArray(location.coordinates) && location.coordinates.length >= 2) {
      return { lat: location.coordinates[1], lng: location.coordinates[0] };
    }
  }
  if (typeof location === "string") {
    if (location.toUpperCase().includes("POINT")) {
      const cleaned = location.toUpperCase().replace("POINT", "").replace("(", "").replace(")", "").trim();
      const coords = cleaned.split(/\s+/);
      if (coords.length >= 2) {
        let lng = parseFloat(coords[0]);
        let lat = parseFloat(coords[1]);
        if (lat < -20 && lng > 0) {
          const temp = lat;
          lat = lng;
          lng = temp;
        }
        return { lat, lng };
      }
    } else if (/^[0-9A-Fa-f]+$/.test(location) && location.length >= 50) {
      try {
        const hex = location;
        const buffer = new Uint8Array(hex.match(/../g)!.map((h: string) => parseInt(h, 16))).buffer;
        const view = new DataView(buffer);
        let lng = view.getFloat64(9, true);
        let lat = view.getFloat64(17, true);
        if (lat < -20 && lng > 0) {
          const temp = lat;
          lat = lng;
          lng = temp;
        }
        return { lat, lng };
      } catch (err) {
        console.error("Error decodificando WKB Hex de PostGIS en CreateEventForm:", err);
      }
    }
  }
  return null;
}

// ─── Componente principal ────────────────────────────────────────────────────
export function CreateEventForm({ onClose, onEventCreated, initialCancha }: Props) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FieldError>( {});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [showFloatXp, setShowFloatXp] = useState(false);
  const { addXp } = useCurrentUser();
  
  const [canchas, setCanchas] = useState<any[]>([]);
  const [loadingCanchas, setLoadingCanchas] = useState(true);
  const [showAddCanchaForm, setShowAddCanchaForm] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);

  // ── Cargar canchas al montar ───────────────────────────────────────────────
  async function loadCanchas() {
    setLoadingCanchas(true);
    try {
      const { data, error } = await supabase
        .from("canchas")
        .select("*")
        .order("name", { ascending: true });
      if (error) throw error;
      if (data) setCanchas(data);
    } catch (err) {
      console.error("Error cargando canchas para el formulario:", err);
    } finally {
      setLoadingCanchas(false);
    }
  }

  useEffect(() => {
    loadCanchas();

    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setIsOrganizer(!!data.user.user_metadata?.is_organizer);
      }
    });
  }, []);

  useEffect(() => {
    if (initialCancha) {
      const coords = parseLocation(initialCancha.location);
      setForm((prev) => ({
        ...prev,
        sportId: initialCancha.sport_id ? (initialCancha.sport_id as SportId) : null,
        canchaId: initialCancha.id ? initialCancha.id.toString() : "",
        latitude: coords?.lat ? coords.lat.toString() : "",
        longitude: coords?.lng ? coords.lng.toString() : "",
        address: initialCancha.name || "",
      }));
    }
  }, [initialCancha]);

  // ── Actualizar campo ──────────────────────────────────────────────────────
  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    // limpiar error individual al editar
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  // ── Validación ────────────────────────────────────────────────────────────
  function validate(): boolean {
    const newErrors: FieldError = {};

    if (!form.sportId) newErrors.sportId = "Selecciona un deporte";
    if (!form.intensity) newErrors.intensity = "Selecciona la intensidad";
    if (!form.date) newErrors.date = "La fecha es obligatoria";
    if (!form.time) newErrors.time = "La hora es obligatoria";
    if (!form.canchaId) newErrors.canchaId = "Selecciona una cancha obligatoriamente";

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

      // Formatear ubicación como WKT POINT para PostGIS
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

      if (!user.email) {
        setServerError("No se pudo obtener el email del usuario. Intenta cerrar sesión y volver a entrar.");
        setStatus("error");
        return;
      }

      const payload = {
        creator_username: user.email,
        sport_id: form.sportId,
        location,
        event_date: eventDate,
        max_capacity: form.maxCapacity ? parseInt(form.maxCapacity, 10) : null,
        intensity: form.intensity,
        status: "abierto",
        joined: 1,
        description_after_arrival: form.descriptionAfterArrival || null,
      };

      console.log("Payload de evento a enviar:", payload);

      const { data: newEvents, error: insertError } = await supabase
        .from("events")
        .insert(payload)
        .select();

      if (insertError) throw insertError;

      const newEvent = newEvents?.[0];
      if (newEvent) {
        // Automatically join the creator to the event
        const { error: joinError } = await supabase
          .from("event_participants")
          .insert({
            event_id: newEvent.id,
            user_username: user.email,
            status: "aceptado"
          });
        if (joinError) {
          console.error("Error adding creator as participant:", joinError);
        }
      }

      setStatus("success");
      setShowFloatXp(true);
      const sportLabel = SPORTS.find((s) => s.id === form.sportId)?.label || "Deporte";
      addXp(25, `Organizar partido de ${sportLabel} en ${form.address || "Caracas"} ⚽`);
      setTimeout(() => {
        setShowFloatXp(false);
      }, 1200);

      // Limpiar formulario tras éxito
      setTimeout(() => {
        setForm(INITIAL_FORM);
        setStatus("idle");
        onEventCreated();
        onClose();
      }, 1500);
    } catch (err: unknown) {
      if (err && typeof err === "object" && "message" in err) {
        const pgErr = err as { message: string; details?: string; hint?: string; code?: string };
        console.error("❌ Supabase insert error:", pgErr);
        setServerError(`Error al crear el evento: ${pgErr.message}`);
      } else {
        console.error("❌ Error inesperado:", err);
        setServerError("Error inesperado al crear el evento.");
      }
      setStatus("error");
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  if (showAddCanchaForm) {
    return (
      <AddCanchaForm
        onBack={() => setShowAddCanchaForm(false)}
        onSaved={async (newCancha) => {
          setShowAddCanchaForm(false);
          await loadCanchas();
          if (newCancha) {
            setField("canchaId", newCancha.id.toString());
            const coords = parseLocation(newCancha.location);
            if (coords) {
              setField("latitude", coords.lat.toString());
              setField("longitude", coords.lng.toString());
              setField("address", newCancha.name);
            }
          }
        }}
      />
    );
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

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-background">
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

        {/* Selección de Cancha */}
        <FormSection
          title="Instalación / Cancha"
          icon={<MapPin size={13} />}
          error={errors.canchaId}
          required
        >
          {loadingCanchas ? (
            <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3.5 shadow-soft animate-pulse">
              <Loader2 size={16} className="animate-spin text-primary shrink-0" />
              <span className="text-xs font-semibold text-muted-foreground">
                Cargando canchas disponibles...
              </span>
            </div>
          ) : canchas.length === 0 ? (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-center">
              <p className="text-xs font-semibold text-destructive">No hay canchas registradas en la app.</p>
              <p className="text-[10px] text-muted-foreground mt-1">Registra primero una cancha en la sección de Canchas.</p>
              {isOrganizer && (
                <button
                  type="button"
                  onClick={() => setShowAddCanchaForm(true)}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                  + Crear nueva cancha
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="relative">
                <select
                  id="cancha-select"
                  value={form.canchaId}
                  onChange={(e) => {
                    const val = e.target.value;
                    setField("canchaId", val);
                    const selectedCancha = canchas.find((c) => c.id.toString() === val);
                    if (selectedCancha) {
                      const coords = parseLocation(selectedCancha.location);
                      if (coords) {
                        setField("latitude", coords.lat.toString());
                        setField("longitude", coords.lng.toString());
                        setField("address", selectedCancha.name);
                      }
                    } else {
                      setField("latitude", "");
                      setField("longitude", "");
                      setField("address", "");
                    }
                  }}
                  className={`w-full appearance-none rounded-2xl border bg-card px-4 py-3.5 pr-10 text-sm font-semibold text-secondary outline-none transition-all focus:border-primary shadow-soft ${
                    errors.canchaId ? "border-destructive" : "border-border"
                  }`}
                >
                  <option value="">-- Selecciona una cancha --</option>
                  {canchas.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.price ? `(Bs. ${c.price}/h)` : ""}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-muted-foreground">
                  <MapPin size={16} />
                </div>
              </div>
              {isOrganizer && (
                <button
                  type="button"
                  onClick={() => setShowAddCanchaForm(true)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline animate-fade-in"
                >
                  + Crear nueva cancha
                </button>
              )}
            </div>
          )}
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

        {/* Descripción (opcional, máx 150 caracteres) */}
        <FormSection
          title="Descripción"
          icon={<FileText size={13} />}
        >
          <div className="flex flex-col gap-1 rounded-2xl border border-border bg-card px-4 py-3 shadow-soft focus-within:border-primary transition-colors">
            <textarea
              id="event-description-input"
              maxLength={150}
              rows={3}
              placeholder="Ej: Traer ropa cómoda, agua y actitud deportiva. (Máximo 150 caracteres)"
              value={form.descriptionAfterArrival}
              onChange={(e) => setField("descriptionAfterArrival", e.target.value)}
              className="w-full bg-transparent text-sm font-medium text-secondary outline-none placeholder:text-muted-foreground/50 resize-none py-1"
            />
            <div className="text-[10px] text-muted-foreground text-right">
              {form.descriptionAfterArrival.length}/150
            </div>
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
      <div className="absolute inset-x-0 bottom-0 z-20 glass border-t border-border px-5 py-4 relative">
        {showFloatXp && (
          <div className="float-xp absolute left-1/2 -translate-x-1/2 -top-12 z-50">
            +25 XP ⚡
          </div>
        )}
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
