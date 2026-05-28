import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect, createContext, useContext, Suspense, lazy, useCallback, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { CheckCircle2, ArrowLeft, AlertCircle, MapPin, Loader2, Zap, Calendar, Clock, Users, FileText, Search, SlidersHorizontal, Bell, X, MessageSquare, ChevronRight, Crosshair, Plus, Share2, Star, Check, Edit3, Settings, Trophy, LogOut, Camera, Save, ShieldCheck, Send, CalendarCheck, ArrowRight, User, Mail, Lock, EyeOff, Eye, Map as Map$1 } from "lucide-react";
const supabaseUrl = "https://aknwdkjzodhkhzxjvipu.supabase.co";
const supabaseAnonKey = "sb_publishable_wXXt4M1loO2NvsCC0nmM5A_1NJneITx";
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const UserContext = createContext({
  user: null,
  avatarUrl: null,
  displayName: "",
  initials: ""
});
function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Usuario";
  const initials = displayName.substring(0, 2).toUpperCase();
  const avatarUrl = user?.user_metadata?.avatar_url ?? null;
  return /* @__PURE__ */ jsx(UserContext.Provider, { value: { user, avatarUrl, displayName, initials }, children });
}
function useCurrentUser() {
  return useContext(UserContext);
}
const LeafletMap$1 = lazy(
  () => import("./LeafletMap-B9-Od04Y.js").then((m) => ({ default: m.default }))
);
function MapSkeleton$1() {
  return /* @__PURE__ */ jsx("div", { className: "flex h-[220px] w-full items-center justify-center bg-muted", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-3 text-muted-foreground", children: [
    /* @__PURE__ */ jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" }),
    /* @__PURE__ */ jsx("span", { className: "text-xs font-medium", children: "Cargando mapa…" })
  ] }) });
}
const SPORTS$1 = [
  { id: 1, label: "Fútbol", emoji: "⚽" },
  { id: 2, label: "Tenis", emoji: "🎾" },
  { id: 3, label: "Golf", emoji: "⛳" },
  { id: 4, label: "Pádel", emoji: "🏓" }
];
function AddCanchaForm({ onBack, onSaved }) {
  const [name, setName] = useState("");
  const [sportId, setSportId] = useState(null);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState({});
  async function handleMapClick(lat, lng) {
    setLatitude(lat.toString());
    setLongitude(lng.toString());
    setAddress("Buscando dirección...");
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
    const e = {};
    if (!name.trim()) e.name = "El nombre es obligatorio";
    if (!sportId) e.sportId = "Selecciona un deporte";
    if (!latitude || !longitude) e.location = "Elige la ubicación en el mapa";
    return e;
  }
  async function handleSubmit() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setStatus("loading");
    const {
      data: { user }
    } = await supabase.auth.getUser();
    const location = `POINT(${parseFloat(longitude)} ${parseFloat(latitude)})`;
    const { data: newCanchas, error } = await supabase.from("canchas").insert({
      name: name.trim(),
      sport_id: sportId,
      location,
      description: description.trim() || null,
      price: price ? parseFloat(price) : null,
      created_by: user?.email
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
    return /* @__PURE__ */ jsxs("div", { className: "flex h-full flex-col items-center justify-center gap-6 px-6 text-center bg-background", children: [
      /* @__PURE__ */ jsx("div", { className: "grid h-24 w-24 place-items-center rounded-full bg-emerald-500 text-white shadow-pop ring-8 ring-emerald-500/20", children: /* @__PURE__ */ jsx(CheckCircle2, { size: 48, strokeWidth: 2.5 }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-secondary", children: "¡Cancha añadida!" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Ya aparece en el listado de canchas" })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "relative flex h-full flex-col bg-background", children: [
    /* @__PURE__ */ jsxs("div", { className: "sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/90 px-4 pb-3 pt-12 backdrop-blur", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onBack,
          className: "grid h-10 w-10 place-items-center rounded-full bg-muted transition-all active:scale-95",
          "aria-label": "Volver",
          children: /* @__PURE__ */ jsx(ArrowLeft, { size: 18, className: "text-secondary" })
        }
      ),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-lg font-bold text-secondary", children: "Añadir cancha" }),
        /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground", children: "Registra una nueva cancha deportiva" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto px-5 py-5 pb-32 space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground", children: [
          "🏟️ Nombre ",
          /* @__PURE__ */ jsx("span", { className: "text-primary", children: "*" })
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            value: name,
            onChange: (e) => setName(e.target.value),
            placeholder: "Ej: Cancha San Bernardino",
            className: `w-full rounded-2xl border bg-card px-4 py-3 text-sm font-medium text-secondary outline-none transition-colors focus:border-primary ${errors.name ? "border-destructive" : "border-border"}`
          }
        ),
        errors.name && /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-1 text-[11px] font-medium text-destructive", children: [
          /* @__PURE__ */ jsx(AlertCircle, { size: 11 }),
          " ",
          errors.name
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground", children: [
          "⚡ Deporte ",
          /* @__PURE__ */ jsx("span", { className: "text-primary", children: "*" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2", children: SPORTS$1.map((s) => /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setSportId(s.id),
            className: `flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-sm font-semibold transition-all active:scale-[0.97] ${sportId === s.id ? "gradient-primary border-transparent text-secondary shadow-pop" : "border-border bg-card text-muted-foreground hover:border-primary/40"}`,
            children: [
              /* @__PURE__ */ jsx("span", { className: "text-xl", children: s.emoji }),
              s.label
            ]
          },
          s.id
        )) }),
        errors.sportId && /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-1 text-[11px] font-medium text-destructive", children: [
          /* @__PURE__ */ jsx(AlertCircle, { size: 11 }),
          " ",
          errors.sportId
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground", children: [
          "📍 Ubicación ",
          /* @__PURE__ */ jsx("span", { className: "text-primary", children: "*" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-2xl border border-border bg-card shadow-soft", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3", children: [
            /* @__PURE__ */ jsx(MapPin, { size: 16, className: "text-primary shrink-0" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-muted-foreground line-clamp-1", children: address || "Toca el mapa para elegir la ubicación" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "relative z-0 h-[220px] w-full", children: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(MapSkeleton$1, {}), children: /* @__PURE__ */ jsx(LeafletMap$1, { onLocationSelect: handleMapClick }) }) }),
          latitude && longitude && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 border-t border-border bg-emerald-50 px-3 py-2", children: [
            /* @__PURE__ */ jsx(CheckCircle2, { size: 12, className: "text-emerald-600" }),
            /* @__PURE__ */ jsx("span", { className: "text-[11px] font-medium text-emerald-700", children: "Ubicación seleccionada" })
          ] })
        ] }),
        errors.location && /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-1 text-[11px] font-medium text-destructive", children: [
          /* @__PURE__ */ jsx(AlertCircle, { size: 11 }),
          " ",
          errors.location
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("label", { className: "flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground", children: "📝 Descripción" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            value: description,
            onChange: (e) => setDescription(e.target.value),
            placeholder: "Iluminación nocturna, vestuarios, estacionamiento...",
            rows: 3,
            className: "w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm font-medium text-secondary outline-none transition-colors focus:border-primary resize-none placeholder:text-muted-foreground/50"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("label", { className: "flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground", children: "💰 Precio por hora (Bs.)" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 shadow-soft focus-within:border-primary transition-colors", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-muted-foreground", children: "Bs." }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              min: 0,
              value: price,
              onChange: (e) => setPrice(e.target.value),
              placeholder: "Ej: 50 (opcional)",
              className: "w-full bg-transparent text-sm font-medium text-secondary outline-none placeholder:text-muted-foreground/50"
            }
          )
        ] })
      ] }),
      errors.submit && /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2.5 rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3", children: [
        /* @__PURE__ */ jsx(AlertCircle, { size: 16, className: "mt-0.5 shrink-0 text-destructive" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive", children: errors.submit })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 bottom-0 z-20 glass border-t border-border px-5 py-4", children: /* @__PURE__ */ jsx(
      "button",
      {
        onClick: handleSubmit,
        disabled: status === "loading",
        className: "w-full rounded-2xl gradient-primary py-3.5 text-sm font-bold text-secondary shadow-pop transition-all active:scale-[0.98] disabled:opacity-70",
        children: status === "loading" ? /* @__PURE__ */ jsxs("span", { className: "flex items-center justify-center gap-2", children: [
          /* @__PURE__ */ jsx(Loader2, { size: 16, className: "animate-spin" }),
          "Guardando cancha…"
        ] }) : "Guardar cancha"
      }
    ) })
  ] });
}
const SPORTS = [
  { id: 1, label: "Fútbol", emoji: "⚽" },
  { id: 2, label: "Tenis", emoji: "🎾" },
  { id: 3, label: "Golf", emoji: "⛳" },
  { id: 4, label: "Pádel", emoji: "🏓" }
];
const INTENSITIES = ["Principiante", "Intermedio", "Pro"];
const INTENSITY_STYLE = {
  Principiante: "bg-emerald-50 text-emerald-700 ring-emerald-300",
  Intermedio: "bg-amber-50 text-amber-700 ring-amber-300",
  Pro: "bg-red-50 text-red-700 ring-red-300"
};
const INITIAL_FORM = {
  sportId: null,
  intensity: null,
  date: "",
  time: "",
  latitude: "",
  longitude: "",
  address: "",
  maxCapacity: "",
  canchaId: "",
  descriptionAfterArrival: ""
};
function parseLocation$2(location) {
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
        const buffer = new Uint8Array(hex.match(/../g).map((h) => parseInt(h, 16))).buffer;
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
function CreateEventForm({ onClose, onEventCreated, initialCancha }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [serverError, setServerError] = useState(null);
  const [canchas, setCanchas] = useState([]);
  const [loadingCanchas, setLoadingCanchas] = useState(true);
  const [showAddCanchaForm, setShowAddCanchaForm] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);
  async function loadCanchas() {
    setLoadingCanchas(true);
    try {
      const { data, error } = await supabase.from("canchas").select("*").order("name", { ascending: true });
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
      const coords = parseLocation$2(initialCancha.location);
      setForm((prev) => ({
        ...prev,
        sportId: initialCancha.sport_id ? initialCancha.sport_id : null,
        canchaId: initialCancha.id ? initialCancha.id.toString() : "",
        latitude: coords?.lat ? coords.lat.toString() : "",
        longitude: coords?.lng ? coords.lng.toString() : "",
        address: initialCancha.name || ""
      }));
    }
  }, [initialCancha]);
  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: void 0 }));
  }
  function validate() {
    const newErrors = {};
    if (!form.sportId) newErrors.sportId = "Selecciona un deporte";
    if (!form.intensity) newErrors.intensity = "Selecciona la intensidad";
    if (!form.date) newErrors.date = "La fecha es obligatoria";
    if (!form.time) newErrors.time = "La hora es obligatoria";
    if (!form.canchaId) newErrors.canchaId = "Selecciona una cancha obligatoriamente";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }
  async function handleSubmit() {
    if (!validate()) return;
    setStatus("loading");
    setServerError(null);
    try {
      const eventDate = (/* @__PURE__ */ new Date(`${form.date}T${form.time}:00`)).toISOString();
      const location = `POINT(${parseFloat(form.longitude)} ${parseFloat(form.latitude)})`;
      const {
        data: { user },
        error: authError
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
        description_after_arrival: form.descriptionAfterArrival || null
      };
      console.log("Payload de evento a enviar:", payload);
      const { data: newEvents, error: insertError } = await supabase.from("events").insert(payload).select();
      if (insertError) throw insertError;
      const newEvent = newEvents?.[0];
      if (newEvent) {
        const { error: joinError } = await supabase.from("event_participants").insert({
          event_id: newEvent.id,
          user_username: user.email,
          status: "aceptado"
        });
        if (joinError) {
          console.error("Error adding creator as participant:", joinError);
        }
      }
      setStatus("success");
      setTimeout(() => {
        setForm(INITIAL_FORM);
        setStatus("idle");
        onEventCreated();
        onClose();
      }, 1500);
    } catch (err) {
      if (err && typeof err === "object" && "message" in err) {
        const pgErr = err;
        console.error("❌ Supabase insert error:", pgErr);
        setServerError(`Error al crear el evento: ${pgErr.message}`);
      } else {
        console.error("❌ Error inesperado:", err);
        setServerError("Error inesperado al crear el evento.");
      }
      setStatus("error");
    }
  }
  if (showAddCanchaForm) {
    return /* @__PURE__ */ jsx(
      AddCanchaForm,
      {
        onBack: () => setShowAddCanchaForm(false),
        onSaved: async (newCancha) => {
          setShowAddCanchaForm(false);
          await loadCanchas();
          if (newCancha) {
            setField("canchaId", newCancha.id.toString());
            const coords = parseLocation$2(newCancha.location);
            if (coords) {
              setField("latitude", coords.lat.toString());
              setField("longitude", coords.lng.toString());
              setField("address", newCancha.name);
            }
          }
        }
      }
    );
  }
  if (status === "success") {
    return /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 z-50 flex h-full flex-col items-center justify-center space-y-6 bg-background px-6 text-center animate-in fade-in zoom-in duration-500", children: [
      /* @__PURE__ */ jsx("div", { className: "grid h-24 w-24 place-items-center rounded-full bg-emerald-500 text-white shadow-pop ring-8 ring-emerald-500/20", children: /* @__PURE__ */ jsx(CheckCircle2, { size: 48, strokeWidth: 2.5 }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-secondary", children: "¡Evento publicado!" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Tu partido ya está en el mapa, listo para que otros jugadores se unan." })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "relative flex h-full flex-col overflow-hidden bg-background", children: [
    /* @__PURE__ */ jsxs("div", { className: "sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/90 px-4 pb-3 pt-12 backdrop-blur", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onClose,
          className: "grid h-10 w-10 place-items-center rounded-full bg-muted transition-all active:scale-95",
          "aria-label": "Cerrar formulario",
          children: /* @__PURE__ */ jsx(ArrowLeft, { size: 18, className: "text-secondary" })
        }
      ),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-lg font-bold text-secondary", children: "Nuevo evento" }),
        /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground", children: "Completa los datos para publicar tu evento" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto px-5 py-5 pb-32 space-y-6", children: [
      /* @__PURE__ */ jsx(
        FormSection,
        {
          title: "Deporte",
          icon: /* @__PURE__ */ jsx(Zap, { size: 13 }),
          error: errors.sportId,
          required: true,
          children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2", children: SPORTS.map((s) => /* @__PURE__ */ jsxs(
            "button",
            {
              id: `sport-btn-${s.id}`,
              onClick: () => setField("sportId", s.id),
              className: `flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-sm font-semibold transition-all active:scale-[0.97] ${form.sportId === s.id ? "gradient-primary border-transparent text-secondary shadow-pop" : "border-border bg-card text-muted-foreground hover:border-primary/40"}`,
              children: [
                /* @__PURE__ */ jsx("span", { className: "text-xl", children: s.emoji }),
                s.label
              ]
            },
            s.id
          )) })
        }
      ),
      /* @__PURE__ */ jsx(
        FormSection,
        {
          title: "Intensidad",
          icon: /* @__PURE__ */ jsx(Zap, { size: 13 }),
          error: errors.intensity,
          required: true,
          children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-2", children: INTENSITIES.map((lvl) => /* @__PURE__ */ jsx(
            "button",
            {
              id: `intensity-btn-${lvl.toLowerCase()}`,
              onClick: () => setField("intensity", lvl),
              className: `rounded-xl py-2.5 text-xs font-bold ring-1 transition-all active:scale-95 ${form.intensity === lvl ? `${INTENSITY_STYLE[lvl]} ring-current shadow-sm` : "bg-muted text-muted-foreground ring-transparent"}`,
              children: lvl
            },
            lvl
          )) })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsx(
          FormSection,
          {
            title: "Fecha",
            icon: /* @__PURE__ */ jsx(Calendar, { size: 13 }),
            error: errors.date,
            required: true,
            children: /* @__PURE__ */ jsx(
              "input",
              {
                id: "event-date-input",
                type: "date",
                value: form.date,
                min: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
                onChange: (e) => setField("date", e.target.value),
                className: `w-full rounded-2xl border bg-card px-3 py-3 text-sm font-medium text-secondary outline-none transition-colors focus:border-primary ${errors.date ? "border-destructive" : "border-border"}`
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          FormSection,
          {
            title: "Hora",
            icon: /* @__PURE__ */ jsx(Clock, { size: 13 }),
            error: errors.time,
            required: true,
            children: /* @__PURE__ */ jsx(
              "input",
              {
                id: "event-time-input",
                type: "time",
                value: form.time,
                onChange: (e) => setField("time", e.target.value),
                className: `w-full rounded-2xl border bg-card px-3 py-3 text-sm font-medium text-secondary outline-none transition-colors focus:border-primary ${errors.time ? "border-destructive" : "border-border"}`
              }
            )
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        FormSection,
        {
          title: "Instalación / Cancha",
          icon: /* @__PURE__ */ jsx(MapPin, { size: 13 }),
          error: errors.canchaId,
          required: true,
          children: loadingCanchas ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3.5 shadow-soft animate-pulse", children: [
            /* @__PURE__ */ jsx(Loader2, { size: 16, className: "animate-spin text-primary shrink-0" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-muted-foreground", children: "Cargando canchas disponibles..." })
          ] }) : canchas.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-center", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-destructive", children: "No hay canchas registradas en la app." }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground mt-1", children: "Registra primero una cancha en la sección de Canchas." }),
            isOrganizer && /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setShowAddCanchaForm(true),
                className: "mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline",
                children: "+ Crear nueva cancha"
              }
            )
          ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxs(
                "select",
                {
                  id: "cancha-select",
                  value: form.canchaId,
                  onChange: (e) => {
                    const val = e.target.value;
                    setField("canchaId", val);
                    const selectedCancha = canchas.find((c) => c.id.toString() === val);
                    if (selectedCancha) {
                      const coords = parseLocation$2(selectedCancha.location);
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
                  },
                  className: `w-full appearance-none rounded-2xl border bg-card px-4 py-3.5 pr-10 text-sm font-semibold text-secondary outline-none transition-all focus:border-primary shadow-soft ${errors.canchaId ? "border-destructive" : "border-border"}`,
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "-- Selecciona una cancha --" }),
                    canchas.map((c) => /* @__PURE__ */ jsxs("option", { value: c.id, children: [
                      c.name,
                      " ",
                      c.price ? `(Bs. ${c.price}/h)` : ""
                    ] }, c.id))
                  ]
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-y-0 right-4 flex items-center text-muted-foreground", children: /* @__PURE__ */ jsx(MapPin, { size: 16 }) })
            ] }),
            isOrganizer && /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setShowAddCanchaForm(true),
                className: "inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline animate-fade-in",
                children: "+ Crear nueva cancha"
              }
            )
          ] })
        }
      ),
      /* @__PURE__ */ jsx(
        FormSection,
        {
          title: "Capacidad máxima",
          icon: /* @__PURE__ */ jsx(Users, { size: 13 }),
          children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 shadow-soft focus-within:border-primary transition-colors", children: [
            /* @__PURE__ */ jsx(Users, { size: 16, className: "shrink-0 text-muted-foreground" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                id: "event-capacity-input",
                type: "number",
                min: 1,
                max: 100,
                placeholder: "Ej: 12 jugadores (opcional)",
                value: form.maxCapacity,
                onChange: (e) => setField("maxCapacity", e.target.value),
                className: "w-full bg-transparent text-sm font-medium text-secondary outline-none placeholder:text-muted-foreground/50"
              }
            )
          ] })
        }
      ),
      /* @__PURE__ */ jsx(
        FormSection,
        {
          title: "Descripción",
          icon: /* @__PURE__ */ jsx(FileText, { size: 13 }),
          children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 rounded-2xl border border-border bg-card px-4 py-3 shadow-soft focus-within:border-primary transition-colors", children: [
            /* @__PURE__ */ jsx(
              "textarea",
              {
                id: "event-description-input",
                maxLength: 150,
                rows: 3,
                placeholder: "Ej: Traer ropa cómoda, agua y actitud deportiva. (Máximo 150 caracteres)",
                value: form.descriptionAfterArrival,
                onChange: (e) => setField("descriptionAfterArrival", e.target.value),
                className: "w-full bg-transparent text-sm font-medium text-secondary outline-none placeholder:text-muted-foreground/50 resize-none py-1"
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-muted-foreground text-right", children: [
              form.descriptionAfterArrival.length,
              "/150"
            ] })
          ] })
        }
      ),
      status === "error" && serverError && /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2.5 rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3", children: [
        /* @__PURE__ */ jsx(AlertCircle, { size: 16, className: "mt-0.5 shrink-0 text-destructive" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive", children: serverError })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-x-0 bottom-0 z-20 glass border-t border-border px-5 py-4", children: [
      form.sportId && form.intensity && /* @__PURE__ */ jsxs("div", { className: "mb-3 flex items-center gap-2 text-[11px] text-muted-foreground", children: [
        /* @__PURE__ */ jsxs("span", { className: "font-semibold text-secondary", children: [
          SPORTS.find((s) => s.id === form.sportId)?.emoji,
          " ",
          SPORTS.find((s) => s.id === form.sportId)?.label
        ] }),
        /* @__PURE__ */ jsx("span", { children: "·" }),
        /* @__PURE__ */ jsx("span", { children: form.intensity }),
        form.date && form.time && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("span", { children: "·" }),
          /* @__PURE__ */ jsx("span", { children: (/* @__PURE__ */ new Date(`${form.date}T${form.time}`)).toLocaleString("es-VE", {
            weekday: "short",
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit"
          }) })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          id: "publish-event-btn",
          onClick: handleSubmit,
          disabled: status === "loading",
          className: `w-full rounded-2xl py-3.5 text-sm font-bold transition-all active:scale-[0.98] ${status === "loading" ? "gradient-primary cursor-not-allowed opacity-70 text-secondary" : "gradient-primary text-secondary shadow-pop hover:shadow-lg"}`,
          children: status === "loading" ? /* @__PURE__ */ jsxs("span", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsx(Loader2, { size: 16, className: "animate-spin" }),
            "Publicando evento…"
          ] }) : "Publicar evento"
        }
      )
    ] })
  ] });
}
function FormSection({
  title,
  icon,
  error,
  required,
  children
}) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground", children: [
      icon,
      title,
      required && /* @__PURE__ */ jsx("span", { className: "text-primary", children: "*" })
    ] }),
    children,
    error && /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-1 text-[11px] font-medium text-destructive", children: [
      /* @__PURE__ */ jsx(AlertCircle, { size: 11 }),
      error
    ] })
  ] });
}
const sizeMap = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-20 w-20 text-2xl"
};
const ringMap = {
  sm: "ring-2",
  md: "ring-2",
  lg: "ring-4"
};
function UserAvatar({ size = "md", className = "", onClick }) {
  const { avatarUrl, initials } = useCurrentUser();
  const sizeClass = sizeMap[size];
  const ringClass = ringMap[size];
  if (avatarUrl) {
    return /* @__PURE__ */ jsx(
      "img",
      {
        src: avatarUrl,
        alt: "Avatar",
        onClick,
        className: `${sizeClass} rounded-full object-cover ${ringClass} ring-primary/30 shadow-soft ${onClick ? "cursor-pointer active:scale-95 transition-transform" : ""} ${className}`
      }
    );
  }
  return /* @__PURE__ */ jsx(
    "div",
    {
      onClick,
      className: `${sizeClass} grid place-items-center rounded-full gradient-primary font-bold text-secondary shadow-soft ${ringClass} ring-primary/30 ${onClick ? "cursor-pointer active:scale-95 transition-transform" : ""} ${className}`,
      children: initials
    }
  );
}
const footballField = "/assets/football-field-C0emToIf.jpg";
const padelCourt = "/assets/padel-court-CALSJD4S.jpg";
const hikingTrail = "/assets/hiking-trail-BbQuy3Lk.jpg";
const runningTrail = "/assets/running-trail-B8Oay5hI.jpg";
const getSportImage$1 = (sportId) => {
  if (sportId === 1) return footballField;
  if (sportId === 4) return padelCourt;
  if (sportId === 2) return padelCourt;
  if (sportId === 3) return hikingTrail;
  return runningTrail;
};
const LeafletMap = lazy(
  () => import("./LeafletMap-B9-Od04Y.js").then((m) => ({ default: m.default }))
);
function MapSkeleton() {
  return /* @__PURE__ */ jsx("div", { className: "h-full w-full animate-pulse bg-muted", children: /* @__PURE__ */ jsx("div", { className: "flex h-full items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-3 text-muted-foreground", children: [
    /* @__PURE__ */ jsx("div", { className: "h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" }),
    /* @__PURE__ */ jsx("span", { className: "text-xs font-medium", children: "Cargando mapa…" })
  ] }) }) });
}
const sports = ["Todos", "Fútbol", "Tenis", "Golf", "Pádel"];
function parseLocation$1(location) {
  if (!location) return null;
  if (typeof location === "object") {
    if (typeof location.lat === "number" && typeof location.lng === "number")
      return { lat: location.lat, lng: location.lng };
    if (Array.isArray(location) && location.length >= 2)
      return { lat: location[0], lng: location[1] };
    if (location.type === "Point" && Array.isArray(location.coordinates) && location.coordinates.length >= 2)
      return { lat: location.coordinates[1], lng: location.coordinates[0] };
  }
  if (typeof location === "string") {
    if (location.toUpperCase().includes("POINT")) {
      const cleaned = location.toUpperCase().replace("POINT", "").replace("(", "").replace(")", "").trim();
      const parts = cleaned.split(/\s+/);
      if (parts.length >= 2) {
        let lng = parseFloat(parts[0]);
        let lat = parseFloat(parts[1]);
        if (lat < -20 && lng > 0) {
          const t = lat;
          lat = lng;
          lng = t;
        }
        return { lat, lng };
      }
    } else if (/^[0-9A-Fa-f]+$/.test(location) && location.length >= 50) {
      try {
        const buf = new Uint8Array(
          location.match(/../g).map((h) => parseInt(h, 16))
        ).buffer;
        const dv = new DataView(buf);
        let lng = dv.getFloat64(9, true);
        let lat = dv.getFloat64(17, true);
        if (lat < -20 && lng > 0) {
          const t = lat;
          lat = lng;
          lng = t;
        }
        return { lat, lng };
      } catch {
      }
    }
  }
  return null;
}
function MapScreen({
  onSelect,
  userLocation: propUserLocation,
  setUserLocation: propSetUserLocation,
  onNavigateToComments
}) {
  const [active, setActive] = useState("Todos");
  const [selectedSport, setSelectedSport] = useState(null);
  const [events, setEvents] = useState([]);
  const [canchas, setCanchas] = useState([]);
  const [selectedCancha, setSelectedCancha] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [localUserLocation, setLocalUserLocation] = useState(null);
  const userLocation = propUserLocation !== void 0 ? propUserLocation : localUserLocation;
  const setUserLocation = propSetUserLocation !== void 0 ? propSetUserLocation : setLocalUserLocation;
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUser(data.user);
    });
  }, []);
  const handleLocateUser = useCallback(() => {
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
      {
        enableHighAccuracy: true,
        timeout: 1e4,
        maximumAge: 6e4
      }
    );
  }, [userLocation, setUserLocation]);
  const fetchData = useCallback(async () => {
    const { data: canchasData, error: canchasError } = await supabase.from("canchas").select("*");
    console.log("🕵️‍♂️ CANCHAS DATA (raw):", canchasData);
    if (canchasError) console.error("❌ ERROR CANCHAS:", canchasError);
    if (canchasData) {
      const processedCanchas = canchasData.map((c) => {
        const coords = parseLocation$1(c.location);
        console.log(`📍 Cancha "${c.name}" coords:`, coords);
        return { ...c, lat: coords?.lat ?? null, lng: coords?.lng ?? null };
      });
      setCanchas(processedCanchas);
    }
    const { data, error } = await supabase.from("events").select("*").order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching events:", error);
      return;
    }
    if (data) {
      const processed = data.map((row) => {
        const coords = parseLocation$1(row.location);
        const lat = coords?.lat ?? 0;
        const lng = coords?.lng ?? 0;
        const sportName = row.sport_id === 1 ? "Fútbol" : row.sport_id === 2 ? "Tenis" : row.sport_id === 3 ? "Golf" : row.sport_id === 4 ? "Pádel" : "Otro";
        return {
          ...row,
          lat,
          lng,
          sport: sportName,
          title: row.title || `Evento de ${sportName}`,
          host: row.creator_username || "Usuario",
          hostAvatar: (row.creator_username || "U").substring(0, 2).toUpperCase(),
          time: row.event_date ? new Date(row.event_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "00:00",
          date: row.event_date ? new Date(row.event_date).toLocaleDateString("es-VE", {
            weekday: "short",
            day: "numeric",
            month: "short"
          }) : "Próximamente",
          image: getSportImage$1(row.sport_id),
          joined: row.joined ?? 1,
          spots: row.max_capacity || 10,
          price: 0,
          zone: "Caracas",
          description_after_arrival: row.description_after_arrival
        };
      });
      console.log("Eventos cargados:", processed);
      setEvents(processed);
    }
  }, []);
  const fetchEvents = fetchData;
  useEffect(() => {
    fetchEvents();
    const channel = supabase.channel("public:events").on("postgres_changes", { event: "INSERT", schema: "public", table: "events" }, () => fetchEvents()).on("postgres_changes", { event: "UPDATE", schema: "public", table: "events" }, () => fetchEvents()).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchEvents]);
  const filtered = active === "Todos" ? events : events.filter((e) => e.sport === active);
  const filteredCanchas = selectedSport ? canchas.filter((c) => {
    const sportIdMap = {
      "Fútbol": 1,
      "Tenis": 2,
      "Golf": 3,
      "Pádel": 4
    };
    const targetId = sportIdMap[selectedSport];
    return c.sport_id === targetId || c.sport === selectedSport;
  }) : canchas;
  return /* @__PURE__ */ jsxs("div", { className: "relative h-full overflow-hidden bg-muted", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 z-0", children: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(MapSkeleton, {}), children: /* @__PURE__ */ jsx(
      LeafletMap,
      {
        canchas: filteredCanchas,
        onCanchaClick: (cancha) => setSelectedCancha(cancha),
        userLocation,
        onLocationSelect: (lat, lng) => {
          console.log("📍 Ubicación seleccionada en mapa:", { lat, lng });
          setUserLocation({ lat, lng });
        }
      }
    ) }) }),
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-x-0 top-0 z-20 px-4 pt-12 pointer-events-none", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 pointer-events-auto", children: [
        /* @__PURE__ */ jsx(UserAvatar, { size: "sm", className: "shrink-0" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-1 items-center gap-2 rounded-2xl glass px-4 py-3 shadow-soft", children: [
          /* @__PURE__ */ jsx(Search, { size: 18, className: "text-muted-foreground" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              placeholder: "Buscar deporte, zona…",
              className: "flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            }
          ),
          /* @__PURE__ */ jsx("button", { className: "grid h-7 w-7 place-items-center rounded-lg bg-secondary text-primary-foreground", children: /* @__PURE__ */ jsx(SlidersHorizontal, { size: 14 }) })
        ] }),
        /* @__PURE__ */ jsxs("button", { className: "relative grid h-12 w-12 place-items-center rounded-2xl glass shadow-soft", children: [
          /* @__PURE__ */ jsx(Bell, { size: 18, className: "text-secondary" }),
          /* @__PURE__ */ jsx("span", { className: "absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-accent" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-3 flex gap-2 overflow-x-auto pb-1 pointer-events-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", children: sports.map((s) => {
        const isActive = s === "Todos" ? selectedSport === null : selectedSport === s;
        return /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
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
            },
            className: `whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold shadow-soft transition-all border ${isActive ? "bg-secondary text-white border-secondary" : "glass text-secondary border-transparent"}`,
            children: s
          },
          s
        );
      }) })
    ] }),
    selectedCancha && !showCreateForm && /* @__PURE__ */ jsxs("div", { className: "absolute bottom-0 inset-x-0 z-40 bg-background rounded-t-3xl shadow-2xl px-5 pt-4 pb-10 border-t border-border animate-in slide-in-from-bottom duration-300", children: [
      /* @__PURE__ */ jsx("div", { className: "mx-auto mb-4 h-1 w-10 rounded-full bg-muted-foreground/20" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-200", children: [
            /* @__PURE__ */ jsx(MapPin, { size: 10 }),
            " Hub Deportivo"
          ] }),
          /* @__PURE__ */ jsx("h3", { className: "mt-1.5 text-base font-extrabold text-secondary tracking-tight", children: selectedCancha.name }),
          selectedCancha.description && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-0.5 line-clamp-1", children: selectedCancha.description }),
          selectedCancha.price != null && selectedCancha.price > 0 ? /* @__PURE__ */ jsxs("p", { className: "text-xs font-semibold text-primary mt-1", children: [
            "Bs. ",
            selectedCancha.price,
            "/hora"
          ] }) : /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-emerald-600 mt-1", children: "Acceso gratuito" })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setSelectedCancha(null),
            className: "grid h-8 w-8 place-items-center rounded-full bg-muted text-secondary hover:bg-muted/80 transition-colors",
            "aria-label": "Cerrar",
            children: /* @__PURE__ */ jsx(X, { size: 16, strokeWidth: 2.5 })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => onNavigateToComments(selectedCancha),
          className: "w-full flex items-center justify-between mt-4 rounded-2xl bg-secondary/5 hover:bg-secondary/10 p-3.5 border border-secondary/15 transition-all active:scale-[0.98] text-left group",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "grid h-10 w-10 place-items-center rounded-xl bg-secondary/10 text-secondary group-hover:scale-105 transition-transform", children: /* @__PURE__ */ jsx(MessageSquare, { size: 20, className: "text-primary" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "font-bold text-xs text-secondary", children: "Comentarios de la cancha" }),
                /* @__PURE__ */ jsx("div", { className: "text-[10px] text-muted-foreground mt-0.5", children: "Mira opiniones o escribe sobre esta cancha" })
              ] })
            ] }),
            /* @__PURE__ */ jsx(ChevronRight, { size: 16, className: "text-muted-foreground group-hover:translate-x-0.5 transition-transform" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "mt-5 space-y-3", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground", children: "Partidos programados" }),
        (() => {
          if (selectedCancha.lat == null || selectedCancha.lng == null) return /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Coordenadas no disponibles." });
          const canchaEvents = filtered.filter((e) => {
            if (e.lat == null || isNaN(e.lat) || e.lng == null || isNaN(e.lng)) return false;
            const diffLat = Math.abs(e.lat - selectedCancha.lat);
            const diffLng = Math.abs(e.lng - selectedCancha.lng);
            return diffLat < 1e-4 && diffLng < 1e-4;
          });
          if (canchaEvents.length === 0) {
            return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-dashed border-border p-5 text-center", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-muted-foreground", children: "No hay partidos programados aquí" }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => {
                    setShowCreateForm(true);
                  },
                  className: "mt-3 text-[11px] font-bold text-primary hover:underline",
                  children: "+ Crear un partido aquí"
                }
              )
            ] });
          }
          return /* @__PURE__ */ jsx("div", { className: "max-h-[180px] overflow-y-auto space-y-2.5 pr-1", children: canchaEvents.map((e) => /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => onSelect(e),
              className: "w-full flex items-center justify-between rounded-2xl bg-card p-3 border border-border transition-all active:scale-[0.98] hover:border-primary/40 text-left",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsx("div", { className: "font-bold text-xs text-secondary truncate", children: e.title }),
                  /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-muted-foreground mt-0.5", children: [
                    "⏰ ",
                    e.date,
                    " · ",
                    e.time
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-muted-foreground mt-0.5", children: [
                    "👥 ",
                    e.joined,
                    "/",
                    e.spots,
                    " jugadores"
                  ] })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "shrink-0 ml-2 rounded-full bg-secondary/10 px-2 py-0.5 text-[10px] font-bold text-secondary", children: e.sport })
              ]
            },
            e.id
          )) });
        })()
      ] })
    ] }),
    !selectedCancha && /* @__PURE__ */ jsx(
      "button",
      {
        id: "btn-locate-user",
        onClick: handleLocateUser,
        className: `absolute bottom-40 right-4 z-30 grid h-12 w-12 place-items-center rounded-2xl shadow-soft transition-all active:scale-90 hover:scale-105 ${userLocation ? "bg-blue-500 text-white shadow-[0_8px_25px_-4px_rgba(59,130,246,0.5)]" : "glass text-secondary"}`,
        "aria-label": "Mi ubicación",
        title: "Mi ubicación GPS",
        children: locating ? /* @__PURE__ */ jsx("div", { className: "h-5 w-5 rounded-full border-2 border-current border-t-transparent animate-spin" }) : /* @__PURE__ */ jsx(Crosshair, { size: 20, strokeWidth: 2.5 })
      }
    ),
    locationError && /* @__PURE__ */ jsx("div", { className: "absolute bottom-40 left-4 right-20 z-30 animate-in fade-in slide-in-from-bottom-2 duration-300", children: /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-destructive/90 px-4 py-3 text-xs font-semibold text-destructive-foreground shadow-soft backdrop-blur-sm", children: [
      locationError,
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setLocationError(null),
          className: "ml-2 underline opacity-80 hover:opacity-100",
          children: "Cerrar"
        }
      )
    ] }) }),
    !showCreateForm && /* @__PURE__ */ jsxs(
      "button",
      {
        id: "fab-create-event-btn",
        onClick: () => setShowCreateForm(true),
        className: "absolute bottom-24 right-4 z-50 flex items-center gap-2 rounded-2xl gradient-primary px-4 py-3 text-sm font-bold text-secondary shadow-pop transition-all active:scale-95 hover:scale-105",
        "aria-label": "Crear evento",
        children: [
          /* @__PURE__ */ jsx(Plus, { size: 18, strokeWidth: 2.5 }),
          "Crear"
        ]
      }
    ),
    showCreateForm && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 z-40 bg-background", children: /* @__PURE__ */ jsx(
      CreateEventForm,
      {
        onClose: () => {
          setShowCreateForm(false);
          setSelectedCancha(null);
        },
        onEventCreated: () => {
          fetchEvents();
          setSelectedCancha(null);
        },
        initialCancha: selectedCancha
      }
    ) })
  ] });
}
const map = {
  Running: { bg: "bg-primary text-secondary", label: "🏃" },
  Senderismo: { bg: "bg-accent text-secondary", label: "🥾" },
  Pádel: { bg: "bg-secondary text-primary-foreground", label: "🎾" },
  Tenis: { bg: "bg-warning text-warning-foreground", label: "🎾" },
  Vóleibol: { bg: "bg-chart-3 text-secondary-foreground", label: "🏐" },
  Fútbol: { bg: "bg-emerald-500 text-white", label: "⚽" },
  Golf: { bg: "bg-emerald-700 text-white", label: "⛳" },
  Otro: { bg: "bg-muted text-muted-foreground", label: "🏅" }
};
function SportBadge({ sport, withEmoji = true }) {
  const m = map[sport] || map["Otro"];
  return /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${m.bg}`, children: [
    withEmoji && /* @__PURE__ */ jsx("span", { children: m.label }),
    sport
  ] });
}
function EventDetailScreen({
  event,
  onBack,
  userLocation
}) {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setCurrentUser(data.user));
    fetchParticipants();
    const channel = supabase.channel(`participants_${event.id}`).on(
      "postgres_changes",
      { event: "*", schema: "public", table: "event_participants", filter: `event_id=eq.${event.id}` },
      () => fetchParticipants()
    ).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [event.id]);
  async function fetchParticipants() {
    setLoading(true);
    const { data, error } = await supabase.from("event_participants").select("*, profiles(username, rating)").eq("event_id", event.id);
    if (!error && data) {
      setParticipants(data);
    }
    setLoading(false);
  }
  async function handleJoin() {
    if (!currentUser || !currentUser.email) return alert("Debes iniciar sesión");
    setJoining(true);
    const { error } = await supabase.from("event_participants").insert({
      event_id: event.id,
      user_username: currentUser.email,
      status: "pendiente"
      // Adaptado a tu enum request_status
    });
    if (error) {
      console.error("Error al unirse:", error);
      if (error.code === "23505") alert("Ya enviaste una solicitud");
      else alert(`Error al solicitar unirse: ${error.message || JSON.stringify(error)}`);
    } else {
      alert("Solicitud enviada al organizador");
      fetchParticipants();
    }
    setJoining(false);
  }
  async function handleAction(participantId, status) {
    if (!currentUser?.email || currentUser.email !== event.host && currentUser.email !== event.hostName) {
      alert("Solo el creador del evento puede aceptar o rechazar solicitudes.");
      return;
    }
    setActionLoading(participantId.toString());
    const { error } = await supabase.from("event_participants").update({ status }).eq("id", participantId);
    if (!error) {
      alert(`Has ${status === "aceptado" ? "aceptado" : "rechazado"} la solicitud.`);
      fetchParticipants();
    } else {
      alert("Error al actualizar la solicitud");
    }
    setActionLoading(null);
  }
  const approvedPlayers = participants.filter((p) => p.status === "approved" || p.status === "aceptado" || p.status === "aprobado" || !p.status);
  const pendingRequests = participants.filter((p) => p.status === "pending" || p.status === "pendiente");
  const emptySpots = Math.max(0, event.spots - approvedPlayers.length);
  const isUserPending = participants.some((p) => p.user_username === currentUser?.email && (p.status === "pending" || p.status === "pendiente"));
  const isUserApproved = participants.some((p) => p.user_username === currentUser?.email && (p.status === "approved" || p.status === "aceptado" || p.status === "aprobado" || !p.status));
  return /* @__PURE__ */ jsxs("div", { className: "relative h-full overflow-y-auto bg-background", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative h-64 w-full overflow-hidden", children: [
      /* @__PURE__ */ jsx("img", { src: event.image, alt: event.title, className: "h-full w-full object-cover" }),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background via-background/30 to-secondary/40" }),
      /* @__PURE__ */ jsxs("div", { className: "absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-12", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: onBack,
            className: "grid h-10 w-10 place-items-center rounded-full glass shadow-soft",
            children: /* @__PURE__ */ jsx(ArrowLeft, { size: 18, className: "text-secondary" })
          }
        ),
        /* @__PURE__ */ jsx("button", { className: "grid h-10 w-10 place-items-center rounded-full glass shadow-soft", children: /* @__PURE__ */ jsx(Share2, { size: 16, className: "text-secondary" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "absolute inset-x-0 bottom-4 px-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-2 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(SportBadge, { sport: event.sport }),
          /* @__PURE__ */ jsx("span", { className: "rounded-full bg-card/90 px-2.5 py-1 text-[11px] font-bold text-secondary", children: event.level })
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-primary-foreground drop-shadow", children: event.title })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4 p-5 pb-32", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 rounded-2xl bg-card p-3 shadow-soft", children: [
        /* @__PURE__ */ jsx("div", { className: "grid h-11 w-11 place-items-center rounded-full gradient-primary text-sm font-bold text-secondary", children: event.hostAvatar }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[11px] font-medium text-muted-foreground", children: "Organizador" }),
          /* @__PURE__ */ jsx("div", { className: "text-sm font-bold text-secondary", children: event.host })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-xs font-bold text-secondary", children: [
          /* @__PURE__ */ jsx(Star, { size: 14, className: "fill-accent text-accent" }),
          " 4.8"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsx(InfoTile, { icon: Calendar, label: "Fecha", value: event.date }),
        /* @__PURE__ */ jsx(InfoTile, { icon: Clock, label: "Hora", value: event.time }),
        /* @__PURE__ */ jsx(
          InfoTile,
          {
            icon: MapPin,
            label: "Lugar",
            value: event.location,
            onClick: () => {
              const origin = userLocation ? `${userLocation.lat},${userLocation.lng}` : "";
              const destination = `${event.lat},${event.lng}`;
              const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
              window.open(url, "_blank");
            }
          }
        ),
        /* @__PURE__ */ jsx(InfoTile, { icon: Users, label: "Cupos", value: `${approvedPlayers.length}/${event.spots}` })
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => {
            const origin = userLocation ? `${userLocation.lat},${userLocation.lng}` : "";
            const destination = `${event.lat},${event.lng}`;
            const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
            window.open(url, "_blank");
          },
          className: "w-full flex items-center justify-center gap-2 rounded-2xl bg-secondary/10 hover:bg-secondary/20 active:scale-[0.98] py-3 text-xs font-bold text-secondary transition-all border border-secondary/20 shadow-soft",
          children: [
            /* @__PURE__ */ jsx(MapPin, { size: 16, className: "text-primary" }),
            /* @__PURE__ */ jsx("span", { children: "Cómo llegar con Google Maps" }),
            userLocation ? /* @__PURE__ */ jsx("span", { className: "ml-1 rounded-full bg-primary/20 px-2 py-0.5 text-[9px] font-bold text-primary animate-pulse", children: "En tiempo real" }) : /* @__PURE__ */ jsx("span", { className: "ml-1 rounded-full bg-muted px-2 py-0.5 text-[9px] font-medium text-muted-foreground", children: "Desde tu ubicación" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "mb-2 text-sm font-bold text-secondary", children: "Descripción" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed text-muted-foreground", children: event.description_after_arrival || "Partido amistoso, cancha sintética con luces. Trae ropa cómoda y agua. Se aceptan jugadores con experiencia, ambiente respetuoso y competitivo." })
      ] }),
      pendingRequests.length > 0 && currentUser?.email && (currentUser.email === event.host || currentUser.email === event.hostName) && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("h3", { className: "mb-3 text-sm font-bold text-secondary flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] text-white", children: pendingRequests.length }),
          "Solicitudes pendientes"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-2", children: pendingRequests.map((req) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-2xl border border-border bg-card p-3 shadow-soft", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "grid h-10 w-10 place-items-center rounded-full bg-secondary text-xs font-bold text-primary-foreground", children: (req.user_username || "U").substring(0, 2).toUpperCase() }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "text-sm font-bold text-secondary", children: req.user_username?.split("@")[0] || "Usuario" }),
              /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-muted-foreground flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Star, { size: 10, className: "fill-accent text-accent" }),
                req.profiles?.rating || "5.00"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                disabled: actionLoading === req.id.toString(),
                onClick: () => handleAction(req.id, "rechazado"),
                className: "grid h-9 w-9 place-items-center rounded-full bg-destructive/10 text-destructive transition-colors hover:bg-destructive/20 disabled:opacity-50",
                children: /* @__PURE__ */ jsx(X, { size: 16, strokeWidth: 2.5 })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                disabled: actionLoading === req.id.toString(),
                onClick: () => handleAction(req.id, "aceptado"),
                className: "grid h-9 w-9 place-items-center rounded-full bg-emerald-50 text-emerald-600 transition-colors hover:bg-emerald-100 disabled:opacity-50",
                children: actionLoading === req.id.toString() ? /* @__PURE__ */ jsx(Loader2, { size: 16, className: "animate-spin" }) : /* @__PURE__ */ jsx(Check, { size: 16, strokeWidth: 2.5 })
              }
            )
          ] })
        ] }, req.id)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-2 flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-secondary", children: "Jugadores aprobados" }),
          /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
            emptySpots,
            " cupos disponibles"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: loading ? /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Cargando jugadores..." }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          approvedPlayers.map((p, i) => /* @__PURE__ */ jsx(
            "div",
            {
              title: p.user_username,
              className: "grid h-10 w-10 place-items-center rounded-full bg-secondary text-[11px] font-bold text-primary-foreground",
              children: (p.user_username || "U").substring(0, 2).toUpperCase()
            },
            p.id || i
          )),
          Array.from({ length: emptySpots }).map((_, i) => /* @__PURE__ */ jsx(
            "div",
            {
              className: "grid h-10 w-10 place-items-center rounded-full border-2 border-dashed border-border text-muted-foreground",
              children: "+"
            },
            `e-${i}`
          ))
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 bottom-0 z-20 glass border-t border-border px-5 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-[11px] font-medium text-muted-foreground", children: "Aporte" }),
        /* @__PURE__ */ jsx("div", { className: "text-lg font-bold text-secondary", children: event.price === 0 ? "Gratis" : `$${event.price} USD` })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          disabled: joining || emptySpots === 0 || isUserPending || isUserApproved,
          onClick: handleJoin,
          className: "ml-auto flex-1 rounded-2xl gradient-primary py-3.5 text-sm font-bold text-secondary shadow-pop active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
          children: joining ? "Enviando..." : isUserApproved ? "Ya estás dentro" : isUserPending ? "Solicitud enviada" : emptySpots === 0 ? "Evento Lleno" : "Solicitar unirme"
        }
      )
    ] }) })
  ] });
}
function InfoTile({
  icon: Icon,
  label,
  value,
  onClick
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      onClick,
      className: `rounded-2xl bg-card p-3 shadow-soft transition-all ${onClick ? "cursor-pointer hover:border-primary/20 active:scale-95 border border-transparent hover:bg-card/90" : ""}`,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-1 flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("div", { className: "grid h-8 w-8 place-items-center rounded-lg bg-muted", children: /* @__PURE__ */ jsx(Icon, { size: 15, className: "text-primary" }) }),
          onClick && /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full", children: "Ver Ruta" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-[11px] font-medium text-muted-foreground", children: label }),
        /* @__PURE__ */ jsx("div", { className: "text-sm font-bold text-secondary truncate", children: value })
      ]
    }
  );
}
function ProfileScreen({
  onEdit,
  onSelectEvent
}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user: user2 } }) => {
      if (user2) {
        setUser(user2);
      }
      setLoading(false);
    });
  }, []);
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };
  const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Usuario";
  const email = user?.email || "";
  const initials = name.substring(0, 2).toUpperCase();
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex h-full w-full items-center justify-center bg-background", children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary" }) });
  }
  const stats = [
    { label: "Rating", value: "4.9", icon: Star },
    { label: "Trofeos", value: "7", icon: Trophy }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "h-full overflow-y-auto bg-background pb-24", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative gradient-dark px-5 pb-20 pt-12 text-primary-foreground", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: onEdit,
            className: "grid h-10 w-10 place-items-center rounded-full bg-card/10 text-[#32CD32] transition-transform active:scale-95",
            children: /* @__PURE__ */ jsx(Edit3, { size: 16 })
          }
        ),
        /* @__PURE__ */ jsx("button", { className: "grid h-10 w-10 place-items-center rounded-full bg-card/10", children: /* @__PURE__ */ jsx(Settings, { size: 16 }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center gap-4", children: [
        user?.user_metadata?.avatar_url ? /* @__PURE__ */ jsx(
          "img",
          {
            src: user.user_metadata.avatar_url,
            alt: "Avatar",
            className: "h-20 w-20 rounded-full object-cover ring-4 ring-card/20 shadow-pop"
          }
        ) : /* @__PURE__ */ jsx(
          "div",
          {
            className: "grid h-20 w-20 place-items-center rounded-full bg-card text-2xl font-bold ring-4 ring-card/20 shadow-pop",
            style: { color: "#32CD32" },
            children: initials
          }
        ),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h1", { className: "text-xl font-bold text-white flex items-center gap-2", children: [
            name,
            user?.user_metadata?.is_organizer && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-500 shadow-pop", children: [
              /* @__PURE__ */ jsx(Star, { size: 10, className: "fill-amber-500" }),
              " Organizador"
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-white/80", children: email }),
          /* @__PURE__ */ jsxs("div", { className: "mt-1 inline-flex items-center gap-1 rounded-full bg-primary/20 px-2 py-0.5 text-[11px] font-semibold text-primary", children: [
            /* @__PURE__ */ jsx(Star, { size: 11, className: "fill-primary" }),
            " Jugador verificado"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "-mt-12 px-5", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-2 rounded-2xl bg-card p-4 shadow-pop", children: stats.map((s) => /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "mx-auto mb-1 grid h-9 w-9 place-items-center rounded-xl bg-muted", children: /* @__PURE__ */ jsx(s.icon, { size: 16, className: "text-primary" }) }),
      /* @__PURE__ */ jsx("div", { className: "text-lg font-bold text-secondary", children: s.value }),
      /* @__PURE__ */ jsx("div", { className: "text-[11px] text-muted-foreground", children: s.label })
    ] }, s.label)) }) }),
    /* @__PURE__ */ jsx("div", { className: "px-5 pt-8", children: /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: handleLogout,
        className: "flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500/10 py-4 text-sm font-bold text-red-500 transition-colors hover:bg-red-500/20",
        children: [
          /* @__PURE__ */ jsx(LogOut, { size: 18 }),
          "Cerrar Sesión"
        ]
      }
    ) })
  ] });
}
function EditProfileScreen({ onBack }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: user2 } }) => {
      if (user2) {
        setUser(user2);
        setName(user2.user_metadata?.full_name || user2.email?.split("@")[0] || "");
        setEmail(user2.email || "");
        setAvatarUrl(user2.user_metadata?.avatar_url || null);
      }
      setLoading(false);
    });
  }, []);
  const handleImageUpload = async (e) => {
    try {
      setUploadingImage(true);
      setError("");
      if (!e.target.files || e.target.files.length === 0) {
        throw new Error("Debes seleccionar una imagen.");
      }
      const file = e.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;
      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file);
      if (uploadError) {
        throw uploadError;
      }
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      setAvatarUrl(data.publicUrl);
    } catch (error2) {
      setError(error2.message || "Error al subir la imagen");
    } finally {
      setUploadingImage(false);
    }
  };
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        data: { full_name: name, avatar_url: avatarUrl },
        // If email is different, we also update it, but it sends a confirmation email.
        ...email !== user.email && { email }
      });
      if (updateError) throw updateError;
      setSuccess("Perfil actualizado correctamente");
      setTimeout(() => {
        onBack();
      }, 1500);
    } catch (err) {
      setError(err.message || "Error al actualizar el perfil");
    } finally {
      setSaving(false);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex h-full w-full items-center justify-center bg-background", children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary" }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex h-full flex-col bg-background", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex items-center gap-3 px-5 py-4", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onBack,
          className: "grid h-10 w-10 place-items-center rounded-full bg-card shadow-soft transition-transform active:scale-95",
          children: /* @__PURE__ */ jsx(ArrowLeft, { size: 20, className: "text-secondary" })
        }
      ),
      /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold text-secondary", children: "Editar Perfil" })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSave, className: "flex-1 px-5 pt-4 space-y-6", children: [
      error && /* @__PURE__ */ jsx("div", { className: "rounded-xl bg-destructive/10 p-3 text-sm font-semibold text-destructive", children: error }),
      success && /* @__PURE__ */ jsx("div", { className: "rounded-xl bg-primary/10 p-3 text-sm font-semibold text-primary", children: success }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center space-y-3 pb-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative h-24 w-24", children: [
          avatarUrl ? /* @__PURE__ */ jsx("img", { src: avatarUrl, alt: "Avatar", className: "h-full w-full rounded-full object-cover border-4 border-card shadow-soft" }) : /* @__PURE__ */ jsx("div", { className: "flex h-full w-full items-center justify-center rounded-full bg-secondary text-3xl font-bold text-[#32CD32] shadow-soft", children: (name || "U").substring(0, 2).toUpperCase() }),
          /* @__PURE__ */ jsxs("label", { className: "absolute bottom-0 right-0 grid h-8 w-8 cursor-pointer place-items-center rounded-full bg-primary text-secondary shadow-pop transition-transform hover:scale-105 active:scale-95", children: [
            uploadingImage ? /* @__PURE__ */ jsx(Loader2, { size: 14, className: "animate-spin" }) : /* @__PURE__ */ jsx(Camera, { size: 14 }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "file",
                className: "hidden",
                accept: "image/*",
                onChange: handleImageUpload,
                disabled: uploadingImage
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground uppercase font-bold tracking-wider", children: "Foto de perfil" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-muted-foreground", children: "Nombre completo" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: name,
              onChange: (e) => setName(e.target.value),
              className: "w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-secondary outline-none transition-colors focus:border-primary",
              placeholder: "Tu nombre",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-muted-foreground", children: "Correo electrónico" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "email",
              value: email,
              onChange: (e) => setEmail(e.target.value),
              className: "w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-secondary outline-none transition-colors focus:border-primary",
              placeholder: "tu@email.com",
              required: true
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground", children: "Al cambiar el correo electrónico, se enviará un mensaje de confirmación." })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: saving,
          className: "flex w-full items-center justify-center gap-2 rounded-2xl gradient-primary py-4 text-sm font-bold text-secondary shadow-pop transition-transform active:scale-[0.98] disabled:opacity-70",
          children: saving ? /* @__PURE__ */ jsx(Loader2, { size: 18, className: "animate-spin" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Save, { size: 18 }),
            "Guardar Cambios"
          ] })
        }
      )
    ] })
  ] });
}
function parseLocation(location) {
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
        const buffer = new Uint8Array(hex.match(/../g).map((h) => parseInt(h, 16))).buffer;
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
        console.error("Error decodificando WKB Hex de PostGIS en CanchaCommentsScreen:", err);
      }
    }
  }
  return null;
}
function CanchaCommentsScreen({ cancha, onBack }) {
  const { user } = useCurrentUser();
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [canComment, setCanComment] = useState(false);
  const [checkingPermission, setCheckingPermission] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const commentsEndRef = useRef(null);
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);
  useEffect(() => {
    fetchComments();
    const channel = supabase.channel(`public:comentarios_Canchas:id_Cancha=eq.${cancha.id}`).on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "comentarios_Canchas",
        filter: `id_Cancha=eq.${cancha.id}`
      },
      () => {
        fetchComments();
      }
    ).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [cancha.id]);
  useEffect(() => {
    if (!user || !user.email) {
      setCanComment(false);
      setCheckingPermission(false);
      return;
    }
    async function checkPermission() {
      setCheckingPermission(true);
      const lat = cancha.lat ?? parseLocation(cancha.location)?.lat;
      const lng = cancha.lng ?? parseLocation(cancha.location)?.lng;
      if (!lat || !lng) {
        setCanComment(false);
        setCheckingPermission(false);
        return;
      }
      try {
        const { data: participations, error: partError } = await supabase.from("event_participants").select(`
            status,
            events (
              location
            )
          `).eq("user_username", user.email).in("status", ["approved", "aceptado", "aprobado"]);
        if (partError) {
          console.error("Error checking participations:", partError);
        }
        const { data: createdEvents, error: createdError } = await supabase.from("events").select("location").eq("creator_username", user.email);
        if (createdError) {
          console.error("Error checking created events:", createdError);
        }
        let hasParticipated = false;
        if (participations && participations.length > 0) {
          hasParticipated = participations.some((p) => {
            const event = p.events;
            if (!event) return false;
            const eventCoords = parseLocation(event.location);
            if (!eventCoords) return false;
            const diffLat = Math.abs(eventCoords.lat - lat);
            const diffLng = Math.abs(eventCoords.lng - lng);
            return diffLat < 1e-4 && diffLng < 1e-4;
          });
        }
        if (!hasParticipated && createdEvents && createdEvents.length > 0) {
          hasParticipated = createdEvents.some((event) => {
            const eventCoords = parseLocation(event.location);
            if (!eventCoords) return false;
            const diffLat = Math.abs(eventCoords.lat - lat);
            const diffLng = Math.abs(eventCoords.lng - lng);
            return diffLat < 1e-4 && diffLng < 1e-4;
          });
        }
        setCanComment(hasParticipated);
      } catch (error) {
        console.error("Error determining commenting permission:", error);
        setCanComment(false);
      } finally {
        setCheckingPermission(false);
      }
    }
    checkPermission();
  }, [user, cancha]);
  async function fetchComments() {
    try {
      const { data, error } = await supabase.from("comentarios_Canchas").select("*").eq("id_Cancha", cancha.id).order("hora", { ascending: true });
      if (error) throw error;
      if (data) setComments(data);
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setLoadingComments(false);
    }
  }
  async function handleSubmitComment(e) {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    setSubmitting(true);
    setErrorMessage(null);
    try {
      const { error } = await supabase.from("comentarios_Canchas").insert({
        id_Cancha: cancha.id,
        comentario: newComment.trim(),
        hora: (/* @__PURE__ */ new Date()).toISOString()
      });
      if (error) throw error;
      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error("Error posting comment:", err);
      setErrorMessage(err.message || "Error al enviar el comentario.");
    } finally {
      setSubmitting(false);
    }
  }
  function formatTime(timestamp) {
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString("es-VE", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return timestamp;
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: "relative flex h-full flex-col bg-background", children: [
    /* @__PURE__ */ jsxs("div", { className: "sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/90 px-4 pb-3 pt-12 backdrop-blur", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onBack,
          className: "grid h-10 w-10 place-items-center rounded-full bg-muted transition-all active:scale-95",
          "aria-label": "Volver",
          children: /* @__PURE__ */ jsx(ArrowLeft, { size: 18, className: "text-secondary" })
        }
      ),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-lg font-bold text-secondary", children: "Comentarios" }),
        /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground truncate max-w-[280px]", children: cancha.name })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto px-5 py-5 space-y-4 pb-36", children: loadingComments ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground", children: [
      /* @__PURE__ */ jsx(Loader2, { className: "animate-spin text-primary", size: 24 }),
      /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold", children: "Cargando comentarios…" })
    ] }) : comments.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center gap-4 py-20 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "grid h-20 w-20 place-items-center rounded-full bg-muted text-4xl", children: "💬" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-base font-bold text-secondary", children: "Sin comentarios aún" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground max-w-[220px]", children: canComment ? "Sé el primero en dejar un comentario sobre las condiciones o accesibilidad de esta cancha." : "Nadie ha comentado en esta cancha todavía." })
      ] })
    ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      comments.map((c) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "flex flex-col gap-1.5 rounded-2xl bg-card border border-border p-4 shadow-soft",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("div", { className: "grid h-7 w-7 place-items-center rounded-full bg-secondary/15 text-[11px] font-bold text-secondary", children: "JD" }),
                /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("span", { className: "text-xs font-extrabold text-secondary flex items-center gap-1", children: [
                  "Jugador",
                  /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[8px] font-bold text-emerald-700 ring-1 ring-emerald-200", children: [
                    /* @__PURE__ */ jsx(ShieldCheck, { size: 9 }),
                    " Verificado"
                  ] })
                ] }) })
              ] }),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground", children: formatTime(c.hora) })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-secondary leading-relaxed pl-1", children: c.comentario })
          ]
        },
        c.id
      )),
      /* @__PURE__ */ jsx("div", { ref: commentsEndRef })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 bottom-0 z-20 glass border-t border-border px-5 py-4", children: checkingPermission ? /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 py-2", children: [
      /* @__PURE__ */ jsx(Loader2, { className: "animate-spin text-primary", size: 14 }),
      /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-muted-foreground", children: "Comprobando acceso…" })
    ] }) : !user ? /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center gap-2 rounded-2xl bg-muted/40 p-4 border border-dashed border-border", children: /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-muted-foreground text-center", children: "Debes iniciar sesión para escribir un comentario." }) }) : !canComment ? /* @__PURE__ */ jsxs("div", { className: "flex gap-2.5 items-start rounded-2xl bg-amber-500/5 border border-amber-500/20 p-3.5", children: [
      /* @__PURE__ */ jsx(AlertCircle, { size: 16, className: "text-amber-600 mt-0.5 shrink-0" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold text-amber-800", children: "Acceso restringido" }),
        /* @__PURE__ */ jsx("p", { className: "text-[11px] leading-relaxed text-amber-700", children: "Solo puedes comentar si has participado o estás participando en un evento en esta cancha. ¡Únete a un partido o crea uno aquí primero!" })
      ] })
    ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmitComment, className: "space-y-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-end gap-2.5 bg-card border border-border rounded-2xl p-3 focus-within:border-primary transition-colors", children: [
        /* @__PURE__ */ jsx(
          "textarea",
          {
            value: newComment,
            onChange: (e) => setNewComment(e.target.value),
            placeholder: "Escribe tu opinión sobre la cancha (iluminación, estado, etc.)…",
            maxLength: 300,
            rows: 2,
            className: "w-full bg-transparent text-sm font-medium text-secondary outline-none placeholder:text-muted-foreground/45 resize-none py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            disabled: submitting
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: submitting || !newComment.trim(),
            className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl gradient-primary text-secondary shadow-pop transition-all active:scale-95 disabled:opacity-50 disabled:scale-100",
            "aria-label": "Enviar",
            children: submitting ? /* @__PURE__ */ jsx(Loader2, { size: 16, className: "animate-spin" }) : /* @__PURE__ */ jsx(Send, { size: 16 })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-[10px] text-muted-foreground px-1", children: [
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(CalendarCheck, { size: 11, className: "text-primary" }),
          "Listo para comentar"
        ] }),
        /* @__PURE__ */ jsxs("span", { children: [
          newComment.length,
          "/300"
        ] })
      ] }),
      errorMessage && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-xs font-semibold text-destructive px-1", children: [
        /* @__PURE__ */ jsx(AlertCircle, { size: 13 }),
        " ",
        errorMessage
      ] })
    ] }) })
  ] });
}
function EventCard({
  event,
  onClick,
  variant = "full"
}) {
  const [joining, setJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const pct = event.joined / event.spots * 100;
  event.joined >= event.spots;
  async function handleJoin(e) {
    e.stopPropagation();
    if (onClick) onClick();
  }
  return /* @__PURE__ */ jsxs(
    "button",
    {
      onClick,
      className: "group relative w-full overflow-hidden rounded-2xl bg-card text-left shadow-soft transition-all active:scale-[0.98]",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "relative h-28 w-full overflow-hidden", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: event.image,
              alt: event.title,
              loading: "lazy",
              className: "h-full w-full object-cover transition-transform group-hover:scale-105"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-secondary/70 via-secondary/0 to-secondary/0" }),
          /* @__PURE__ */ jsx("div", { className: "absolute left-3 top-3", children: /* @__PURE__ */ jsx(SportBadge, { sport: event.sport }) }),
          /* @__PURE__ */ jsx("div", { className: "absolute right-3 top-3 rounded-full bg-card/90 px-2.5 py-1 text-[11px] font-bold text-secondary", children: event.price === 0 ? "Gratis" : `$${event.price}` }),
          /* @__PURE__ */ jsx("div", { className: "absolute bottom-2 left-3 right-3 flex items-end justify-between text-primary-foreground", children: /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-[11px] font-medium opacity-90", children: event.date }),
            /* @__PURE__ */ jsx("div", { className: "text-base font-bold leading-tight drop-shadow", children: event.title })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2 p-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Clock, { size: 12 }),
              " ",
              event.time
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(MapPin, { size: 12 }),
              " ",
              event.zone
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "ml-auto text-[11px] font-semibold text-secondary", children: [
              event.distanceKm,
              " km"
            ] })
          ] }),
          variant === "full" && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("div", { className: "h-1.5 flex-1 overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsx(
                "div",
                {
                  className: "h-full gradient-primary transition-all",
                  style: { width: `${pct}%` }
                }
              ) }),
              /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-[11px] font-semibold text-secondary", children: [
                /* @__PURE__ */ jsx(Users, { size: 12 }),
                " ",
                event.joined,
                "/",
                event.spots
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: handleJoin,
                className: "mt-2 w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all active:scale-95 bg-secondary text-primary-foreground shadow-pop hover:bg-secondary/90",
                children: "Unirse al evento"
              }
            )
          ] })
        ] })
      ]
    }
  );
}
const getSportImage = (sportId) => {
  if (sportId === 1) return footballField;
  if (sportId === 4) return padelCourt;
  if (sportId === 2) return padelCourt;
  if (sportId === 3) return hikingTrail;
  return runningTrail;
};
const tabs = ["Disponibles", "Mis Partidos", "Solicitudes", "Historial"];
function MyEventsScreen({ onSelect }) {
  const [tab, setTab] = useState("Disponibles");
  const [pendingRequests, setPendingRequests] = useState([]);
  const [availableEvents, setAvailableEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [createdEvents, setCreatedEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const formatEvent2 = (row) => {
    if (!row) return null;
    const coords = parseLocation$1(row.location);
    const lat = coords?.lat ?? 0;
    const lng = coords?.lng ?? 0;
    const sportName = row.sport_id === 1 ? "Fútbol" : row.sport_id === 2 ? "Tenis" : row.sport_id === 3 ? "Golf" : row.sport_id === 4 ? "Pádel" : "Otro";
    return {
      ...row,
      lat,
      lng,
      sport: sportName,
      title: row.title || `Evento de ${sportName}`,
      host: row.creator_username || "Usuario",
      hostAvatar: (row.creator_username || "U").substring(0, 2).toUpperCase(),
      time: row.event_date ? new Date(row.event_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "00:00",
      date: row.event_date ? new Date(row.event_date).toLocaleDateString("es-VE", { weekday: "short", day: "numeric", month: "short" }) : "Próximamente",
      image: getSportImage(row.sport_id),
      distanceKm: 2.5,
      joined: row.joined ?? 1,
      spots: row.max_capacity || 10,
      price: 0,
      zone: "Caracas",
      description_after_arrival: row.description_after_arrival
    };
  };
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUser(data.user);
      if (data.user) {
        fetchRequests(data.user.email);
        fetchUserEvents(data.user.email);
        fetchAvailable();
      }
    });
  }, []);
  async function fetchAvailable() {
    setLoading(true);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const { data, error } = await supabase.from("events").select("*").or(`event_date.gte.${now},status.eq.abierto`).order("event_date", { ascending: true });
    if (!error && data) {
      setAvailableEvents(data.map(formatEvent2).filter(Boolean));
    }
    setLoading(false);
  }
  async function fetchUserEvents(email) {
    if (!email) return;
    setLoading(true);
    const { data: createdData } = await supabase.from("events").select("*").eq("creator_username", email);
    const { data: joinedData } = await supabase.from("event_participants").select("events(*)").eq("user_username", email);
    const created = (createdData || []).map(formatEvent2).filter(Boolean);
    const joined = (joinedData || []).map((d) => formatEvent2(d.events)).filter(Boolean);
    const allUserEventsMap = /* @__PURE__ */ new Map();
    created.forEach((e) => allUserEventsMap.set(e.id, e));
    joined.forEach((e) => allUserEventsMap.set(e.id, e));
    const allUserEvents = Array.from(allUserEventsMap.values());
    const now = /* @__PURE__ */ new Date();
    const upcoming = allUserEvents.filter((e) => !e.event_date || new Date(e.event_date) >= now || e.status === "abierto");
    const past = allUserEvents.filter((e) => e.event_date && new Date(e.event_date) < now && e.status !== "abierto");
    upcoming.sort((a, b) => new Date(a.event_date || 0).getTime() - new Date(b.event_date || 0).getTime());
    past.sort((a, b) => new Date(b.event_date || 0).getTime() - new Date(a.event_date || 0).getTime());
    setMyEvents(upcoming);
    setPastEvents(past);
    setCreatedEvents(created);
    setLoading(false);
  }
  async function fetchRequests(email) {
    if (!email) return;
    setLoading(true);
    const { data, error } = await supabase.from("event_participants").select(`
        id, 
        user_username, 
        status,
        events!inner(id, creator_username, sport_id),
        profiles(is_premium, rating)
      `).eq("status", "pendiente").eq("events.creator_username", email);
    if (!error && data) {
      setPendingRequests(data);
    }
    setLoading(false);
  }
  async function handleAction(participantId, status) {
    const req = pendingRequests.find((r) => r.id === participantId);
    if (!req || req.events?.creator_username !== currentUser?.email) {
      alert("No tienes permiso para realizar esta acción.");
      return;
    }
    setActionLoading(participantId.toString());
    const { error } = await supabase.from("event_participants").update({ status }).eq("id", participantId);
    if (!error) {
      setPendingRequests((prev) => prev.filter((r) => r.id !== participantId));
    } else {
      console.error(error);
      alert("Error al procesar la solicitud: " + error.message);
    }
    setActionLoading(null);
  }
  return /* @__PURE__ */ jsxs("div", { className: "h-full overflow-y-auto bg-background pb-24", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between px-5 pb-3 pt-12", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-secondary", children: "Mis eventos" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Tu agenda deportiva" })
      ] }),
      /* @__PURE__ */ jsx(UserAvatar, { size: "md" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "sticky top-0 z-10 bg-background/80 px-5 pb-3 pt-1 backdrop-blur", children: /* @__PURE__ */ jsx("div", { className: "flex gap-1 rounded-full bg-muted p-1", children: tabs.map((t) => {
      if (t === "Solicitudes" && createdEvents.length === 0) return null;
      return /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setTab(t),
          className: `flex-1 rounded-full py-2 text-xs font-semibold transition-all ${tab === t ? "bg-card text-secondary shadow-soft" : "text-muted-foreground"}`,
          children: t
        },
        t
      );
    }) }) }),
    tab === "Solicitudes" ? /* @__PURE__ */ jsx("div", { className: "space-y-3 px-5 pt-3", children: loading ? /* @__PURE__ */ jsx("div", { className: "flex justify-center p-5", children: /* @__PURE__ */ jsx(Loader2, { className: "animate-spin text-primary" }) }) : pendingRequests.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center text-sm text-muted-foreground p-5", children: "No tienes solicitudes pendientes nuevas" }) : pendingRequests.map((req) => {
      const isPremium = req.profiles?.is_premium;
      const sportName = req.events?.sport_id === 1 ? "Fútbol" : req.events?.sport_id === 2 ? "Tenis" : req.events?.sport_id === 4 ? "Pádel" : "Evento";
      return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-card p-4 shadow-soft", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-3 flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "grid h-10 w-10 place-items-center rounded-full gradient-primary text-sm font-bold text-secondary", children: (req.user_username || "U").substring(0, 2).toUpperCase() }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx("div", { className: "text-sm font-bold text-secondary", children: req.user_username?.split("@")[0] || "Usuario" }),
              isPremium ? /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-0.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-700", children: [
                /* @__PURE__ */ jsx(Star, { size: 8, className: "fill-amber-500" }),
                " Premium"
              ] }) : /* @__PURE__ */ jsx("span", { className: "rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground", children: "Básica" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground mt-0.5", children: [
              "quiere unirse a tu partido de ",
              sportName
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              disabled: actionLoading === req.id.toString(),
              onClick: () => handleAction(req.id, "rechazado"),
              className: "flex-1 rounded-xl bg-muted py-2.5 text-xs font-semibold text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-50",
              children: "Rechazar"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              disabled: actionLoading === req.id.toString(),
              onClick: () => handleAction(req.id, "aceptado"),
              className: "flex flex-1 items-center justify-center rounded-xl gradient-primary py-2.5 text-xs font-bold text-secondary shadow-pop disabled:opacity-50",
              children: actionLoading === req.id.toString() ? /* @__PURE__ */ jsx(Loader2, { size: 14, className: "animate-spin" }) : "Aceptar"
            }
          )
        ] })
      ] }, req.id);
    }) }) : /* @__PURE__ */ jsxs("div", { className: "space-y-3 px-5 pt-3", children: [
      tab === "Disponibles" && /* @__PURE__ */ jsxs(Fragment, { children: [
        availableEvents.map((e) => /* @__PURE__ */ jsx(EventCard, { event: e, onClick: () => onSelect(e) }, e.id)),
        availableEvents.length === 0 && /* @__PURE__ */ jsx("div", { className: "text-center text-sm text-muted-foreground p-5 mt-10", children: "No hay eventos disponibles" })
      ] }),
      tab === "Mis Partidos" && /* @__PURE__ */ jsxs(Fragment, { children: [
        myEvents.map((e) => /* @__PURE__ */ jsx(EventCard, { event: e, onClick: () => onSelect(e) }, e.id)),
        myEvents.length === 0 && /* @__PURE__ */ jsx("div", { className: "text-center text-sm text-muted-foreground p-5 mt-10", children: "No tienes partidos próximos programados" })
      ] }),
      tab === "Historial" && /* @__PURE__ */ jsxs(Fragment, { children: [
        pastEvents.map((e) => /* @__PURE__ */ jsx(EventCard, { event: e, onClick: () => onSelect(e) }, e.id)),
        pastEvents.length === 0 && /* @__PURE__ */ jsx("div", { className: "text-center text-sm text-muted-foreground p-5 mt-10", children: "No has jugado ningún partido todavía" })
      ] })
    ] })
  ] });
}
const SPORT_NAMES = {
  1: "Fútbol",
  2: "Tenis",
  3: "Baloncesto",
  4: "Pádel",
  5: "Senderismo",
  6: "Running",
  7: "Vóleibol"
};
const SPORT_EMOJIS = {
  1: "⚽",
  2: "🎾",
  3: "🏀",
  4: "🏓",
  5: "🥾",
  6: "🏃",
  7: "🏐"
};
function formatEvent(row) {
  if (!row) return null;
  const sportName = SPORT_NAMES[row.sport_id] || "Deporte";
  return {
    ...row,
    sport: sportName,
    title: row.title || `Partido de ${sportName}`,
    hostName: row.creator_username || "Usuario",
    hostAvatar: (row.creator_username || "U").substring(0, 2).toUpperCase(),
    time: row.event_date ? new Date(row.event_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "00:00",
    date: row.event_date ? new Date(row.event_date).toLocaleDateString("es-VE", {
      weekday: "short",
      day: "numeric",
      month: "short"
    }) : "Próximamente",
    image: "https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&q=80&w=800",
    distanceKm: 2.5,
    joined: row.joined ?? 1,
    spots: row.max_capacity || 10,
    price: 0,
    zone: "Caracas"
  };
}
function MySportsScreen({ onSelectEvent }) {
  const [loading, setLoading] = useState(true);
  const [sportGroups, setSportGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        const { data } = await supabase.from("event_participants").select(`events!inner(*)`).eq("user_username", user.email);
        if (data && data.length > 0) {
          const groups = {};
          data.forEach((p) => {
            const ev = p.events;
            if (!ev) return;
            const sid = ev.sport_id;
            if (!groups[sid]) {
              groups[sid] = {
                sportId: sid,
                name: SPORT_NAMES[sid] || "Deporte",
                emoji: SPORT_EMOJIS[sid] || "🏅",
                count: 0,
                events: []
              };
            }
            groups[sid].count += 1;
            groups[sid].events.push(formatEvent(ev));
          });
          setSportGroups(Object.values(groups));
        }
      }
      setLoading(false);
    });
  }, []);
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex h-full w-full items-center justify-center bg-background", children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary" }) });
  }
  if (selectedGroup) {
    return /* @__PURE__ */ jsxs("div", { className: "h-full overflow-y-auto bg-background pb-24", children: [
      /* @__PURE__ */ jsxs("div", { className: "sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-background/90 px-4 pb-3 pt-12 backdrop-blur", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setSelectedGroup(null),
            className: "grid h-10 w-10 place-items-center rounded-full bg-muted transition-all active:scale-95",
            children: /* @__PURE__ */ jsx(ArrowLeft, { size: 18, className: "text-secondary" })
          }
        ),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h1", { className: "text-lg font-bold text-secondary", children: [
            selectedGroup.emoji,
            " ",
            selectedGroup.name
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-muted-foreground", children: [
            selectedGroup.count,
            " partido",
            selectedGroup.count !== 1 ? "s" : ""
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-3 px-5 pt-4", children: selectedGroup.events.map((ev) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => onSelectEvent?.(ev),
          className: "w-full rounded-2xl bg-card p-4 shadow-soft text-left transition-all hover:shadow-pop active:scale-[0.98]",
          children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "grid h-12 w-12 place-items-center rounded-xl bg-muted text-2xl shrink-0", children: selectedGroup.emoji }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx("div", { className: "font-bold text-secondary truncate", children: ev.title }),
              /* @__PURE__ */ jsxs("div", { className: "mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(Calendar, { size: 11 }),
                  ev.date
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(Clock, { size: 11 }),
                  ev.time
                ] }),
                ev.intensity && /* @__PURE__ */ jsx("span", { className: "rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold", children: ev.intensity })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-1 flex items-center gap-1 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsx(MapPin, { size: 11 }),
                /* @__PURE__ */ jsx("span", { className: "truncate", children: ev.zone })
              ] })
            ] }),
            /* @__PURE__ */ jsx(ChevronRight, { size: 16, className: "text-muted-foreground shrink-0 mt-1" })
          ] })
        },
        ev.id
      )) })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "h-full overflow-y-auto bg-background pb-24", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between px-5 pb-3 pt-12", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("h1", { className: "text-2xl font-bold text-secondary flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Trophy, { size: 24, className: "text-primary" }),
          "Mis deportes"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Tus estadísticas y partidos por disciplina" })
      ] }),
      /* @__PURE__ */ jsx(UserAvatar, { size: "md" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "px-5 pt-6", children: /* @__PURE__ */ jsx("div", { className: "space-y-2", children: sportGroups.length > 0 ? sportGroups.map((g) => /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setSelectedGroup(g),
        className: "w-full flex items-center gap-3 rounded-2xl bg-card p-3 shadow-soft transition-all hover:shadow-pop active:scale-[0.98]",
        children: [
          /* @__PURE__ */ jsx("div", { className: "grid h-11 w-11 place-items-center rounded-xl bg-muted text-xl shrink-0", children: g.emoji }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 text-left", children: [
            /* @__PURE__ */ jsx("div", { className: "text-sm font-bold text-secondary", children: g.name }),
            /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
              g.count,
              " partido",
              g.count !== 1 ? "s" : ""
            ] })
          ] }),
          /* @__PURE__ */ jsx(ChevronRight, { size: 16, className: "text-primary shrink-0" })
        ]
      },
      g.sportId
    )) : /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground p-3 text-center bg-card rounded-2xl shadow-soft", children: "No te has unido a eventos de ningún deporte todavía" }) }) })
  ] });
}
function Logo({ size = 28 }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "grid place-items-center rounded-xl gradient-primary shadow-pop",
        style: { width: size, height: size },
        children: /* @__PURE__ */ jsx(Trophy, { className: "text-secondary", style: { width: size * 0.55, height: size * 0.55 }, strokeWidth: 2.5 })
      }
    ),
    /* @__PURE__ */ jsx("span", { className: "font-bold tracking-tight text-secondary", style: { fontSize: size * 0.65 }, children: "Teammatch" })
  ] });
}
const caracasMap = "/assets/caracas-map-BQoHHgZ8.jpg";
function WelcomeScreen({
  onRegister,
  onLogin
}) {
  return /* @__PURE__ */ jsxs("div", { className: "relative h-full w-full overflow-hidden gradient-dark text-secondary-foreground", children: [
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 opacity-25", children: [
      /* @__PURE__ */ jsx("img", { src: caracasMap, alt: "Mapa de Caracas", className: "h-full w-full object-cover" }),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-secondary/40 via-secondary/70 to-secondary" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute -top-20 -left-16 h-64 w-64 rounded-full bg-primary/30 blur-3xl" }),
    /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute bottom-32 -right-20 h-72 w-72 rounded-full bg-accent/25 blur-3xl" }),
    /* @__PURE__ */ jsxs("div", { className: "relative flex h-full flex-col px-7 pt-14 pb-8", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx(Logo, { size: 32 }) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-12 flex flex-1 flex-col", children: [
        /* @__PURE__ */ jsxs("span", { className: "inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary", children: [
          /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-primary" }),
          " Disponible en Caracas"
        ] }),
        /* @__PURE__ */ jsxs("h1", { className: "mt-5 text-4xl font-bold leading-[1.05] tracking-tight", children: [
          "Tu próximo",
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent", children: "partido te espera." })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 max-w-[300px] text-sm leading-relaxed text-secondary-foreground/70", children: "Encuentra eventos deportivos cerca de ti, únete con un toque o crea el tuyo y arma equipo." }),
        /* @__PURE__ */ jsx("div", { className: "mt-8 space-y-3", children: [
          { icon: MapPin, title: "Mapa en vivo", desc: "Eventos cerca en tiempo real" },
          { icon: Users, title: "Únete fácil", desc: "Solicita un cupo en segundos" },
          { icon: Trophy, title: "Por nivel", desc: "Juega con gente a tu altura" }
        ].map(({ icon: Icon, title, desc }) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "flex items-center gap-3 rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-3 backdrop-blur-sm",
            children: [
              /* @__PURE__ */ jsx("div", { className: "grid h-10 w-10 place-items-center rounded-xl gradient-primary shadow-pop", children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5 text-secondary", strokeWidth: 2.5 }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold", children: title }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-secondary-foreground/60", children: desc })
              ] })
            ]
          },
          title
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 space-y-3", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            id: "welcome-register-btn",
            onClick: onRegister,
            className: "group flex w-full items-center justify-center gap-2 rounded-2xl gradient-primary py-4 text-base font-bold text-secondary shadow-pop transition active:scale-[0.98]",
            children: [
              "Empezar a jugar",
              /* @__PURE__ */ jsx(ArrowRight, { className: "h-5 w-5 transition-transform group-hover:translate-x-1", strokeWidth: 2.5 })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            id: "welcome-login-btn",
            onClick: onLogin,
            className: "w-full rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 py-3 text-sm font-medium text-secondary-foreground/80 transition hover:bg-primary-foreground/10 active:scale-[0.98]",
            children: "Ya tengo cuenta"
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "pt-1 text-center text-[11px] text-secondary-foreground/40", children: "Al continuar aceptas los Términos y la Política de Privacidad" })
      ] })
    ] })
  ] });
}
function AuthScreen({ initialMode = "login", onSuccess, onClose }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  function switchMode(next) {
    setMode(next);
    setError(null);
    setStatus("idle");
  }
  function translateError(msg) {
    if (msg.includes("Invalid login credentials"))
      return "Correo o contraseña incorrectos. Revisa tus datos.";
    if (msg.includes("Email not confirmed"))
      return "Confirma tu correo antes de iniciar sesión.";
    if (msg.includes("User already registered"))
      return "Ya existe una cuenta con ese correo. Intenta iniciar sesión.";
    if (msg.includes("Password should be at least"))
      return "La contraseña debe tener al menos 6 caracteres.";
    if (msg.includes("Unable to validate email"))
      return "Ingresa un correo electrónico válido.";
    if (msg.includes("Email rate limit exceeded"))
      return "Demasiados intentos. Espera unos minutos e intenta de nuevo.";
    return msg;
  }
  async function handleSubmit() {
    setError(null);
    if (!email.trim() || !password.trim()) {
      setError("Completa todos los campos obligatorios.");
      return;
    }
    if (mode === "register" && !name.trim()) {
      setError("Ingresa tu nombre para continuar.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setStatus("loading");
    try {
      if (mode === "login") {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        });
        if (authError) throw authError;
      } else {
        const { error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { full_name: name.trim(), is_organizer: isOrganizer }
          }
        });
        if (authError) throw authError;
      }
      setStatus("success");
      setTimeout(() => onSuccess(), 900);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error inesperado. Intenta de nuevo.";
      setError(translateError(msg));
      setStatus("idle");
    }
  }
  const isLoading = status === "loading";
  const isSuccess = status === "success";
  return /* @__PURE__ */ jsxs("div", { className: "relative flex h-full w-full flex-col overflow-hidden gradient-dark text-secondary-foreground", children: [
    /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute -top-24 -left-20 h-72 w-72 rounded-full bg-primary/25 blur-3xl" }),
    /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute bottom-40 -right-24 h-64 w-64 rounded-full bg-accent/20 blur-3xl" }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex items-center gap-3 px-5 pt-12 pb-4", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          id: "auth-back-btn",
          onClick: onClose,
          className: "grid h-10 w-10 place-items-center rounded-full bg-primary-foreground/10 backdrop-blur transition-all active:scale-95",
          "aria-label": "Volver",
          children: /* @__PURE__ */ jsx(ArrowLeft, { size: 18, className: "text-secondary-foreground" })
        }
      ),
      /* @__PURE__ */ jsx(Logo, { size: 22 })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 px-7 pt-6", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold leading-tight tracking-tight", children: mode === "login" ? /* @__PURE__ */ jsxs(Fragment, { children: [
        "Bienvenido",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent", children: "de vuelta 👋" })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        "Crea tu cuenta",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent", children: "y entra a jugar ⚡" })
      ] }) }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-secondary-foreground/60", children: mode === "login" ? "Inicia sesión para ver y unirte a eventos." : "Regístrate gratis. En segundos estás dentro." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex-1 overflow-y-auto px-7 pt-8 pb-6 space-y-4", children: [
      mode === "register" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          InputField,
          {
            id: "auth-name-input",
            label: "Nombre completo",
            type: "text",
            placeholder: "Ej: Diego Ramírez",
            value: name,
            onChange: setName,
            icon: /* @__PURE__ */ jsx(User, { size: 16, className: "text-muted-foreground" }),
            disabled: isLoading
          }
        ),
        /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 rounded-2xl border border-primary-foreground/15 bg-primary-foreground/8 px-4 py-3.5 backdrop-blur cursor-pointer transition-colors hover:border-primary/50", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              checked: isOrganizer,
              onChange: (e) => setIsOrganizer(e.target.checked),
              className: "h-4 w-4 rounded border-primary-foreground/30 text-primary accent-primary",
              disabled: isLoading
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-secondary-foreground", children: "Quiero registrarme como Organizador" })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        InputField,
        {
          id: "auth-email-input",
          label: "Correo electrónico",
          type: "email",
          placeholder: "tu@email.com",
          value: email,
          onChange: setEmail,
          icon: /* @__PURE__ */ jsx(Mail, { size: 16, className: "text-muted-foreground" }),
          disabled: isLoading
        }
      ),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "mb-1.5 block text-xs font-bold uppercase tracking-wide text-secondary-foreground/50", children: "Contraseña" }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: `flex items-center gap-3 rounded-2xl border px-4 py-3.5 backdrop-blur transition-colors focus-within:border-primary ${error ? "border-destructive/60" : "border-primary-foreground/15 bg-primary-foreground/8"}`,
            children: [
              /* @__PURE__ */ jsx(Lock, { size: 16, className: "shrink-0 text-muted-foreground" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  id: "auth-password-input",
                  type: showPassword ? "text" : "password",
                  placeholder: mode === "register" ? "Mín. 6 caracteres" : "Tu contraseña",
                  value: password,
                  onChange: (e) => setPassword(e.target.value),
                  disabled: isLoading,
                  onKeyDown: (e) => e.key === "Enter" && handleSubmit(),
                  className: "flex-1 bg-transparent text-sm font-medium text-secondary-foreground outline-none placeholder:text-secondary-foreground/30 disabled:opacity-50"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowPassword((v) => !v),
                  className: "text-secondary-foreground/40 hover:text-secondary-foreground transition-colors",
                  "aria-label": showPassword ? "Ocultar contraseña" : "Mostrar contraseña",
                  children: showPassword ? /* @__PURE__ */ jsx(EyeOff, { size: 15 }) : /* @__PURE__ */ jsx(Eye, { size: 15 })
                }
              )
            ]
          }
        ),
        mode === "login" && /* @__PURE__ */ jsx("button", { className: "mt-1.5 text-[11px] text-primary hover:underline", children: "¿Olvidaste tu contraseña?" })
      ] }),
      error && /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2.5 rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3", children: [
        /* @__PURE__ */ jsx(AlertCircle, { size: 15, className: "mt-0.5 shrink-0 text-destructive" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive", children: error })
      ] }),
      isSuccess && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3", children: [
        /* @__PURE__ */ jsx(CheckCircle2, { size: 15, className: "shrink-0 text-emerald-400" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-emerald-300", children: mode === "login" ? "¡Sesión iniciada! Entrando..." : "¡Cuenta creada! Bienvenido..." })
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          id: "auth-submit-btn",
          onClick: handleSubmit,
          disabled: isLoading || isSuccess,
          className: `group mt-2 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold transition-all active:scale-[0.98] disabled:cursor-not-allowed ${isSuccess ? "bg-emerald-500 text-white" : "gradient-primary text-secondary shadow-pop hover:shadow-lg disabled:opacity-70"}`,
          children: [
            isLoading && /* @__PURE__ */ jsx(Loader2, { size: 16, className: "animate-spin" }),
            isSuccess && /* @__PURE__ */ jsx(CheckCircle2, { size: 16 }),
            !isLoading && !isSuccess && /* @__PURE__ */ jsx(
              ArrowRight,
              {
                size: 16,
                className: "transition-transform group-hover:translate-x-1"
              }
            ),
            isLoading ? mode === "login" ? "Iniciando sesión..." : "Creando cuenta..." : isSuccess ? mode === "login" ? "¡Sesión iniciada!" : "¡Cuenta creada!" : mode === "login" ? "Iniciar sesión" : "Crear cuenta gratis"
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 py-1", children: [
        /* @__PURE__ */ jsx("div", { className: "h-px flex-1 bg-primary-foreground/10" }),
        /* @__PURE__ */ jsx("span", { className: "text-[11px] text-secondary-foreground/40", children: "o" }),
        /* @__PURE__ */ jsx("div", { className: "h-px flex-1 bg-primary-foreground/10" })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          id: "auth-switch-mode-btn",
          onClick: () => switchMode(mode === "login" ? "register" : "login"),
          disabled: isLoading,
          className: "w-full rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 py-3.5 text-sm font-medium text-secondary-foreground/80 transition-all hover:bg-primary-foreground/10 active:scale-[0.98] disabled:opacity-50",
          children: mode === "login" ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"
        }
      ),
      /* @__PURE__ */ jsx("p", { className: "pt-1 text-center text-[10px] text-secondary-foreground/30", children: "Al continuar aceptas los Términos de Uso y la Política de Privacidad de TeamMatch." })
    ] })
  ] });
}
function InputField({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  icon,
  disabled
}) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(
      "label",
      {
        htmlFor: id,
        className: "mb-1.5 block text-xs font-bold uppercase tracking-wide text-secondary-foreground/50",
        children: label
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 rounded-2xl border border-primary-foreground/15 bg-primary-foreground/8 px-4 py-3.5 backdrop-blur transition-colors focus-within:border-primary", children: [
      icon,
      /* @__PURE__ */ jsx(
        "input",
        {
          id,
          type,
          placeholder,
          value,
          onChange: (e) => onChange(e.target.value),
          disabled,
          className: "flex-1 bg-transparent text-sm font-medium text-secondary-foreground outline-none placeholder:text-secondary-foreground/30 disabled:opacity-50"
        }
      )
    ] })
  ] });
}
function BottomNav({ current, onChange }) {
  const items = [
    { id: "map", label: "Explorar", icon: Map$1 },
    { id: "events", label: "Eventos", icon: CalendarCheck },
    { id: "sports", label: "Deportes", icon: Trophy },
    { id: "profile", label: "Perfil", icon: User }
  ];
  const Btn = ({ id, label, Icon }) => {
    const active = current === id;
    return /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => onChange(id),
        className: "flex flex-1 flex-col items-center gap-1 py-2 transition-colors",
        children: [
          /* @__PURE__ */ jsx(
            Icon,
            {
              className: active ? "text-primary" : "text-muted-foreground",
              size: 22,
              strokeWidth: active ? 2.5 : 2
            }
          ),
          /* @__PURE__ */ jsx("span", { className: `text-[10px] font-semibold ${active ? "text-secondary" : "text-muted-foreground"}`, children: label })
        ]
      }
    );
  };
  return /* @__PURE__ */ jsx("nav", { className: "absolute inset-x-0 bottom-0 z-30 glass border-t border-border", children: /* @__PURE__ */ jsxs("div", { className: "flex items-end px-2 pb-2 pt-1", children: [
    items.map((it) => /* @__PURE__ */ jsx(Btn, { id: it.id, label: it.label, Icon: it.icon }, it.id)),
    /* @__PURE__ */ jsx("div", { className: "flex-1" })
  ] }) });
}
function Index() {
  return /* @__PURE__ */ jsx(UserProvider, { children: /* @__PURE__ */ jsx(AppContent, {}) });
}
function AppContent() {
  const [appState, setAppState] = useState("checking");
  const [authMode, setAuthMode] = useState("login");
  const [screen, setScreen] = useState("map");
  const [selected, setSelected] = useState(null);
  const [selectedCancha, setSelectedCancha] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  useEffect(() => {
    supabase.auth.getSession().then(({
      data: {
        session
      }
    }) => {
      setAppState(session ? "app" : "welcome");
    });
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAppState(session ? "app" : "welcome");
    });
    return () => subscription.unsubscribe();
  }, []);
  const openDetail = (e) => {
    setSelected(e);
    setScreen("detail");
  };
  const renderScreen = () => {
    if (appState === "checking") {
      return /* @__PURE__ */ jsx("div", { className: "flex h-full w-full items-center justify-center bg-background", children: /* @__PURE__ */ jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" }) });
    }
    if (appState === "welcome") {
      return /* @__PURE__ */ jsx(WelcomeScreen, { onLogin: () => {
        setAuthMode("login");
        setAppState("auth");
      }, onRegister: () => {
        setAuthMode("register");
        setAppState("auth");
      } });
    }
    if (appState === "auth") {
      return /* @__PURE__ */ jsx(AuthScreen, { initialMode: authMode, onSuccess: () => setAppState("app"), onClose: () => setAppState("welcome") });
    }
    if (screen === "detail" && selected) return /* @__PURE__ */ jsx(EventDetailScreen, { event: selected, onBack: () => setScreen("map"), userLocation });
    if (screen === "events") return /* @__PURE__ */ jsx(MyEventsScreen, { onSelect: openDetail });
    if (screen === "sports") return /* @__PURE__ */ jsx(MySportsScreen, { onSelectEvent: openDetail });
    if (screen === "editProfile") return /* @__PURE__ */ jsx(EditProfileScreen, { onBack: () => setScreen("profile") });
    if (screen === "profile") return /* @__PURE__ */ jsx(ProfileScreen, { onEdit: () => setScreen("editProfile"), onSelectEvent: openDetail });
    if (screen === "comments" && selectedCancha) return /* @__PURE__ */ jsx(CanchaCommentsScreen, { cancha: selectedCancha, onBack: () => setScreen("map") });
    return /* @__PURE__ */ jsx(MapScreen, { onSelect: openDetail, userLocation, setUserLocation, onNavigateToComments: (cancha) => {
      setSelectedCancha(cancha);
      setScreen("comments");
    } });
  };
  return /* @__PURE__ */ jsx("main", { className: "fixed inset-0 w-full h-[100dvh] flex flex-col bg-background overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto overscroll-none pt-[env(safe-area-inset-top)] relative flex", children: [
    appState !== "app" && /* @__PURE__ */ jsxs("aside", { className: "relative hidden flex-1 flex-col justify-between overflow-hidden bg-secondary p-12 text-[#32CD32] lg:flex", children: [
      /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full bg-primary/25 blur-3xl" }),
      /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute bottom-10 -right-16 h-80 w-80 rounded-full bg-accent/20 blur-3xl" }),
      /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsx(Logo, { size: 36 }) }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxs("span", { className: "inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary", children: [
          /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-primary" }),
          " Disponible en Caracas"
        ] }),
        /* @__PURE__ */ jsxs("h1", { className: "mt-6 text-5xl font-bold leading-[1.05] tracking-tight xl:text-6xl text-primary-foreground", children: [
          "Encuentra tu próximo",
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent", children: "partido en Caracas." })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-5 max-w-md text-base text-[#32CD32]", children: "Crea eventos deportivos o únete a partidos cerca de ti. Mapa en vivo, jugadores verificados y matchmaking por nivel." }),
        /* @__PURE__ */ jsx("div", { className: "mt-10 grid max-w-md grid-cols-3 gap-3", children: [{
          k: "1.2k",
          v: "Jugadores"
        }, {
          k: "320",
          v: "Eventos/mes"
        }, {
          k: "4.9★",
          v: "Rating"
        }].map((s) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-4", children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-primary", children: s.k }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-[#32CD32]", children: s.v })
        ] }, s.v)) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "relative text-xs text-[#32CD32]", children: "👉 ¡A jugar ya!" })
    ] }),
    /* @__PURE__ */ jsx("section", { className: `relative flex min-h-[100dvh] w-full flex-col overflow-hidden bg-background ${appState !== "app" ? "lg:max-w-[520px] lg:border-l lg:border-primary-foreground/10 lg:shadow-pop" : "flex-1"}`, children: /* @__PURE__ */ jsxs("div", { className: "relative h-[100dvh] w-full overflow-hidden", children: [
      renderScreen(),
      appState === "app" && screen !== "detail" && screen !== "editProfile" && screen !== "comments" && /* @__PURE__ */ jsx(BottomNav, { current: screen, onChange: setScreen })
    ] }) })
  ] }) });
}
export {
  Index as component
};
