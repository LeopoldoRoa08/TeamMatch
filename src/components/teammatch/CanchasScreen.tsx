import { useState, useEffect, lazy, Suspense } from "react";
import {
  ArrowLeft,
  Plus,
  MapPin,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useSettings } from "@/lib/SettingsContext";

const LeafletMap = lazy(() =>
  import("./LeafletMap").then((m) => ({ default: m.default }))
);

function MapSkeleton() {
  const { t } = useSettings();
  return (
    <div className="flex h-[220px] w-full items-center justify-center bg-muted">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <span className="text-xs font-medium">{t("canchas.loadingMap") || "Cargando mapa…"}</span>
      </div>
    </div>
  );
}

const SPORTS = [
  { id: 1, label: "Fútbol", emoji: "⚽" },
  { id: 2, label: "Tenis", emoji: "🎾" },
  { id: 3, label: "Golf", emoji: "⛳" },
  { id: 4, label: "Pádel", emoji: "🏓" },
] as const;

type SportId = (typeof SPORTS)[number]["id"];

export interface Cancha {
  id: number;
  name: string;
  sport_id: SportId;
  description?: string;
  price?: number;
  created_by?: string;
}

// ── AddCanchaForm ─────────────────────────────────────────────────────────────
export function AddCanchaForm({ onBack, onSaved }: { onBack: () => void; onSaved: (cancha?: any) => void }) {
  const { t } = useSettings();
  const [name, setName] = useState("");
  const [sportId, setSportId] = useState<SportId | null>(null);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleMapClick(lat: number, lng: number) {
    setLatitude(lat.toString());
    setLongitude(lng.toString());
    setAddress(t("canchas.searchingAddress") || "Buscando dirección...");
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      if (data?.display_name) {
        const n = data.address?.road || data.address?.suburb || data.display_name.split(",")[0];
        setAddress(n);
      } else {
        setAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      }
    } catch {
      setAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    }
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = t("canchas.nameRequired") || "El nombre es obligatorio";
    if (!sportId) e.sportId = t("canchas.sportRequired") || "Selecciona un deporte";
    if (!latitude || !longitude) e.location = t("canchas.locationRequired") || "Elige la ubicación en el mapa";
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setStatus("loading");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const location = `POINT(${parseFloat(longitude)} ${parseFloat(latitude)})`;

    const { data: newCanchas, error } = await supabase.from("canchas").insert({
      name: name.trim(),
      sport_id: sportId,
      location,
      description: description.trim() || null,
      price: price ? parseFloat(price) : null,
      created_by: user?.email,
    }).select();

    if (error) {
      console.error(error);
      setErrors({ submit: error.message });
      setStatus("error");
    } else {
      setStatus("success");
      const newCancha = newCanchas?.[0];
      setTimeout(() => onSaved(newCancha), 1200);
    }
  }

  if (status === "success") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-6 px-6 text-center bg-background">
        <div className="grid h-24 w-24 place-items-center rounded-full bg-emerald-500 text-white shadow-pop ring-8 ring-emerald-500/20">
          <CheckCircle2 size={48} strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">{t("canchas.added") || "¡Cancha añadida!"}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("canchas.addedDesc") || "Ya aparece en el listado de canchas"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col bg-background">
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center gap-3 md:gap-4 border-b border-border bg-background/90 px-4 md:px-8 pb-3 md:pb-5 pt-12 md:pt-16 backdrop-blur">
        <button
          onClick={onBack}
          className="grid h-10 w-10 md:h-12 md:w-12 place-items-center rounded-full bg-muted hover:bg-muted/80 transition-all active:scale-95"
          aria-label="Volver"
        >
          <ArrowLeft size={18} className="text-foreground md:scale-110" />
        </button>
        <div>
          <h1 className="text-lg md:text-3xl font-bold text-foreground">{t("canchas.addTitle") || "Añadir cancha"}</h1>
          <p className="text-[11px] md:text-sm text-muted-foreground">{t("canchas.addSubtitle") || "Registra una nueva cancha deportiva"}</p>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-5 py-5 pb-32 space-y-6">
        {/* Nombre */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
            🏟️ {t("canchas.name") || "Nombre"} <span className="text-primary">*</span>
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("canchas.namePlaceholder") || "Ej: Cancha San Bernardino"}
            className={`w-full rounded-2xl border bg-card px-4 py-3 text-sm font-medium text-foreground outline-none transition-colors focus:border-primary ${
              errors.name ? "border-destructive" : "border-border"
            }`}
          />
          {errors.name && (
            <p className="flex items-center gap-1 text-[11px] font-medium text-destructive">
              <AlertCircle size={11} /> {errors.name}
            </p>
          )}
        </div>

        {/* Deporte */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
            ⚡ {t("createEvent.sport") || "Deporte"} <span className="text-primary">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {SPORTS.map((s) => {
              let displayLabel: string = s.label;
              if (s.id === 1) displayLabel = t("sports.futbol") || "Fútbol";
              else if (s.id === 2) displayLabel = t("sports.tenis") || "Tenis";
              else if (s.id === 3) displayLabel = t("sports.golf") || "Golf";
              else if (s.id === 4) displayLabel = t("sports.padel") || "Pádel";

              return (
                <button
                  key={s.id}
                  onClick={() => setSportId(s.id)}
                  className={`flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-sm font-semibold transition-all active:scale-[0.97] ${
                    sportId === s.id
                      ? "gradient-primary border-transparent text-foreground shadow-pop"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  <span className="text-xl">{s.emoji}</span>
                  {displayLabel}
                </button>
              );
            })}
          </div>
          {errors.sportId && (
            <p className="flex items-center gap-1 text-[11px] font-medium text-destructive">
              <AlertCircle size={11} /> {errors.sportId}
            </p>
          )}
        </div>

        {/* Ubicación */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
            📍 {t("canchas.location") || "Ubicación"} <span className="text-primary">*</span>
          </label>
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
            <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
              <MapPin size={16} className="text-primary shrink-0" />
              <span className="text-xs font-semibold text-muted-foreground line-clamp-1">
                {address || (t("canchas.tapMap") || "Toca el mapa para elegir la ubicación")}
              </span>
            </div>
            <div className="relative z-0 h-[220px] w-full">
              <Suspense fallback={<MapSkeleton />}>
                <LeafletMap onLocationSelect={handleMapClick} />
              </Suspense>
            </div>
            {latitude && longitude && (
              <div className="flex items-center gap-1.5 border-t border-border bg-emerald-50 px-3 py-2">
                <CheckCircle2 size={12} className="text-emerald-600" />
                <span className="text-[11px] font-medium text-emerald-700">{t("canchas.locationSelected") || "Ubicación seleccionada"}</span>
              </div>
            )}
          </div>
          {errors.location && (
            <p className="flex items-center gap-1 text-[11px] font-medium text-destructive">
              <AlertCircle size={11} /> {errors.location}
            </p>
          )}
        </div>

        {/* Descripción */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
            📝 {t("canchas.description") || "Descripción"}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("canchas.descPlaceholder") || "Iluminación nocturna, vestuarios, estacionamiento..."}
            rows={3}
            className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground outline-none transition-colors focus:border-primary resize-none placeholder:text-muted-foreground/50"
          />
        </div>

        {/* Precio */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
            💰 {t("canchas.pricePerHour") || "Precio por hora (Bs.)"}
          </label>
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 shadow-soft focus-within:border-primary transition-colors">
            <span className="text-sm font-semibold text-muted-foreground">Bs.</span>
            <input
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder={t("canchas.pricePlaceholder") || "Ej: 50 (opcional)"}
              className="w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground/50"
            />
          </div>
        </div>

        {errors.submit && (
          <div className="flex items-start gap-2.5 rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3">
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-destructive" />
            <p className="text-sm text-destructive">{errors.submit}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="absolute inset-x-0 bottom-0 z-20 glass border-t border-border px-5 py-4">
        <button
          onClick={handleSubmit}
          disabled={status === "loading"}
          className="w-full rounded-2xl gradient-primary py-3.5 text-sm font-bold text-foreground shadow-pop transition-all active:scale-[0.98] disabled:opacity-70"
        >
          {status === "loading" ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              {t("canchas.saving") || "Guardando cancha…"}
            </span>
          ) : (
            t("canchas.save") || "Guardar cancha"
          )}
        </button>
      </div>
    </div>
  );
}

// ── CanchasScreen ─────────────────────────────────────────────────────────────
interface CanchasScreenProps {
  onBack: () => void;
  onSelect?: (cancha: Cancha) => void;
  isOrganizer: boolean;
}

export function CanchasScreen({ onBack, onSelect, isOrganizer }: CanchasScreenProps) {
  const { t } = useSettings();
  const [view, setView] = useState<"list" | "add">("list");
  const [canchas, setCanchas] = useState<Cancha[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCanchas();
  }, []);

  async function fetchCanchas() {
    setLoading(true);
    const { data, error } = await supabase
      .from("canchas")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setCanchas(data as Cancha[]);
    setLoading(false);
  }

  if (view === "add") {
    return (
      <AddCanchaForm
        onBack={() => setView("list")}
        onSaved={() => {
          setView("list");
          fetchCanchas();
        }}
      />
    );
  }

  const sportLabel = (id: number) => {
    if (id === 1) return t("sports.futbol") || "Fútbol";
    if (id === 2) return t("sports.tenis") || "Tenis";
    if (id === 3) return t("sports.golf") || "Golf";
    if (id === 4) return t("sports.padel") || "Pádel";
    return t("sports.other") || "Deporte";
  };
  const sportEmoji = (id: number) => SPORTS.find((s) => s.id === id)?.emoji ?? "🏟️";

  return (
    <div className="relative flex h-full flex-col bg-background">
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center gap-3 md:gap-4 border-b border-border bg-background/90 px-4 md:px-8 pb-3 md:pb-5 pt-12 md:pt-16 backdrop-blur">
        <button
          onClick={onBack}
          className="grid h-10 w-10 md:h-12 md:w-12 place-items-center rounded-full bg-muted hover:bg-muted/80 transition-all active:scale-95"
          aria-label="Volver"
        >
          <ArrowLeft size={18} className="text-foreground md:scale-110" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg md:text-3xl font-bold text-foreground">{t("canchas.title") || "Canchas"}</h1>
          <p className="text-[11px] md:text-sm text-muted-foreground">
            {onSelect ? (t("canchas.selectForEvent") || "Selecciona una cancha para tu evento") : (t("canchas.available") || "Canchas disponibles")}
          </p>
        </div>
        {isOrganizer && (
          <button
            onClick={() => setView("add")}
            className="flex items-center gap-1.5 rounded-xl gradient-primary px-3 py-2 md:px-5 md:py-3 text-xs md:text-sm font-bold text-foreground shadow-pop transition-all active:scale-95 hover:shadow-lg hover:-translate-y-0.5"
          >
            <Plus size={14} strokeWidth={2.5} className="md:scale-110" />
            <span className="hidden md:inline">{t("canchas.addCourt") || "Añadir cancha"}</span>
            <span className="md:hidden">{t("canchas.add") || "Añadir"}</span>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 md:px-8 py-5 md:py-8">
        {loading ? (
          <div className="flex justify-center p-10">
            <Loader2 className="animate-spin text-primary" />
          </div>
        ) : canchas.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-muted text-4xl">
              🏟️
            </div>
            <div>
              <p className="text-base font-bold text-foreground">{t("canchas.noCourts") || "No hay canchas por ahora"}</p>
              {isOrganizer && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("canchas.beFirst") || "Sé el primero en añadir una cancha"}
                </p>
              )}
            </div>
            {isOrganizer && (
              <button
                onClick={() => setView("add")}
                className="flex items-center gap-2 rounded-2xl gradient-primary px-5 py-3 text-sm font-bold text-foreground shadow-pop transition-all active:scale-95"
              >
                <Plus size={16} strokeWidth={2.5} />
                {t("canchas.addFirst") || "Añadir primera cancha"}
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {canchas.map((c) => (
              <button
                key={c.id}
                onClick={() => onSelect?.(c)}
                className="w-full h-full flex flex-col rounded-2xl bg-card p-4 md:p-5 shadow-soft text-left transition-all hover:shadow-pop hover:-translate-y-1 active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-muted text-2xl shrink-0">
                    {sportEmoji(c.sport_id)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-foreground truncate">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{sportLabel(c.sport_id)}</div>
                    {c.price != null && c.price > 0 && (
                      <div className="text-xs font-semibold text-primary mt-0.5">
                        Bs. {c.price}/hora
                      </div>
                    )}
                  </div>
                  <MapPin size={16} className="text-muted-foreground shrink-0" />
                </div>
                {c.description && (
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-2 text-left">
                    {c.description}
                  </p>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
