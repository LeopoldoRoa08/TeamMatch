import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect, createContext, useContext, Suspense, lazy, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import { CheckCircle2, ArrowLeft, AlertCircle, MapPin, Loader2, Zap, Calendar, Clock, Users, FileText, X, MessageSquare, ChevronRight, Crosshair, Plus, Trophy, ArrowRight, Share2, Star, Check, Sparkles, Shield, Edit3, Settings, BookOpen, Award, Flame, Copy, LogOut, Camera, Save, ShieldCheck, Send, CalendarCheck, Heart, UserCheck, UserPlus, UserX, Search, User, Mail, Lock, EyeOff, Eye, Map as Map$1, XCircle } from "lucide-react";
const supabaseUrl = "https://aknwdkjzodhkhzxjvipu.supabase.co";
const supabaseAnonKey = "sb_publishable_wXXt4M1loO2NvsCC0nmM5A_1NJneITx";
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabase$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  supabase
}, Symbol.toStringTag, { value: "Module" }));
const UserContext = createContext({
  user: null,
  avatarUrl: null,
  displayName: "",
  initials: "",
  xp: 0,
  level: 1,
  useCount: 0,
  coupons: [],
  xpHistory: [],
  joinedEventsCount: 0,
  createdEventsCount: 0,
  xpNotification: null,
  eventNotification: null,
  clearNotification: () => {
  },
  clearEventNotification: () => {
  },
  addXp: async () => {
  },
  claimCoupon: async () => {
  },
  updateProfile: async () => {
  },
  isLoading: true,
  carisma: 0,
  incrementCarisma: async () => {
  }
});
function getCouponForLevel(level) {
  if (level === 2) {
    return {
      id: "ASPIRANTE2",
      code: "ASPIRANTE2",
      title: "Pase de Aspirante ⚡",
      discount: "10% de Descuento",
      description: "Otorgado automáticamente por alcanzar el Nivel 2.",
      date: (/* @__PURE__ */ new Date()).toLocaleDateString(),
      claimed: false
    };
  }
  if (level === 3) {
    return {
      id: "GUERRERO3",
      code: "GUERRERO3",
      title: "Pergamino de Guerrero 🏋️‍♂️",
      discount: "15% de Descuento",
      description: "Otorgado automáticamente por alcanzar el Nivel 3.",
      date: (/* @__PURE__ */ new Date()).toLocaleDateString(),
      claimed: false
    };
  }
  if (level === 5) {
    return {
      id: "LEYENDA5",
      code: "LEYENDA5",
      title: "Medalla de Leyenda 🌟",
      discount: "Partido Gratis (100% Off)",
      description: "Otorgado automáticamente por alcanzar el Nivel 5.",
      date: (/* @__PURE__ */ new Date()).toLocaleDateString(),
      claimed: false
    };
  }
  return null;
}
function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [xpNotification, setXpNotification] = useState(null);
  const [eventNotification, setEventNotification] = useState(null);
  const addXpRef = useRef(async () => {
  });
  const previousStatuses = useRef({});
  const isFirstFetch = useRef(true);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user);
        initializeAndTrackUse(data.user).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        setIsLoading(true);
        initializeAndTrackUse(u).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);
  const initializeAndTrackUse = async (currentUser) => {
    const wasCounted = sessionStorage.getItem("teammatch_session_counted");
    const meta = currentUser?.user_metadata || {};
    try {
      await supabase.from("profiles").upsert({
        id: currentUser.id,
        username: currentUser.email || "",
        full_name: meta.full_name || null,
        avatar_url: meta.avatar_url || null,
        rating: meta.rating || 4.8,
        is_premium: meta.is_premium || false,
        age: meta.age || null,
        gender: meta.gender || null,
        description: meta.description || null,
        location: meta.location || null,
        preferred_sports: meta.preferred_sports || null
      });
    } catch (e) {
      console.error("Error upserting public profile:", e);
    }
    const isBrandNew = meta.xp === void 0 || meta.level === void 0;
    if (isBrandNew) {
      const initialMetadata = {
        xp: 0,
        level: 1,
        use_count: 1,
        coupons: [],
        joined_events_count: 0,
        created_events_count: 0,
        xp_history: [
          {
            id: "init_" + Date.now(),
            title: "Creación de Personaje 🎮",
            xp: 0,
            date: (/* @__PURE__ */ new Date()).toLocaleDateString(),
            type: "system"
          }
        ],
        carisma: 0
      };
      const { data: { user: updatedUser } } = await supabase.auth.updateUser({
        data: initialMetadata
      });
      if (updatedUser) setUser(updatedUser);
      sessionStorage.setItem("teammatch_session_counted", "true");
      return;
    }
    if (!wasCounted) {
      sessionStorage.setItem("teammatch_session_counted", "true");
      const currentUseCount = (meta.use_count || 0) + 1;
      const currentXp = meta.xp || 0;
      const currentLevel = meta.level || 1;
      const xpGained = 10;
      let newXp = currentXp + xpGained;
      let newLevel = currentLevel;
      let isLevelUp = false;
      while (newXp >= newLevel * 100) {
        newXp -= newLevel * 100;
        newLevel += 1;
        isLevelUp = true;
      }
      const newHistory = [
        {
          id: "use_" + Date.now(),
          title: `Aventura Diaria (Uso #${currentUseCount}) ⚡`,
          xp: xpGained,
          date: (/* @__PURE__ */ new Date()).toLocaleDateString(),
          type: "use"
        },
        ...meta.xp_history || []
      ];
      let newCoupons = [...meta.coupons || []];
      let awardedCoupon = null;
      if (currentUseCount >= 5 && !newCoupons.some((c) => c.code === "FIDELIDAD5")) {
        awardedCoupon = {
          id: "FIDELIDAD5",
          code: "FIDELIDAD5",
          title: "Pergamino de Fidelidad 📜",
          discount: "$5 USD de Descuento",
          description: "Otorgado automáticamente tras tu 5to uso de la app.",
          date: (/* @__PURE__ */ new Date()).toLocaleDateString(),
          claimed: false
        };
        newCoupons.push(awardedCoupon);
      }
      if (isLevelUp) {
        const levelCoupon = getCouponForLevel(newLevel);
        if (levelCoupon && !newCoupons.some((c) => c.code === levelCoupon.code)) {
          newCoupons.push(levelCoupon);
          if (!awardedCoupon) awardedCoupon = levelCoupon;
        }
      }
      const { data: { user: updatedUser } } = await supabase.auth.updateUser({
        data: {
          xp: newXp,
          level: newLevel,
          use_count: currentUseCount,
          coupons: newCoupons,
          xp_history: newHistory
        }
      });
      if (updatedUser) setUser(updatedUser);
      setXpNotification({
        xp: xpGained,
        reason: `¡Uso diario #${currentUseCount} de la app!`,
        isLevelUp,
        newLevel: isLevelUp ? newLevel : void 0,
        newCoupon: awardedCoupon
      });
    }
  };
  const addXp = async (amount, reason) => {
    if (!user) return;
    const meta = user.user_metadata || {};
    const currentXp = meta.xp || 0;
    const currentLevel = meta.level || 1;
    let newXp = currentXp + amount;
    let newLevel = currentLevel;
    let isLevelUp = false;
    while (newXp >= newLevel * 100) {
      newXp -= newLevel * 100;
      newLevel += 1;
      isLevelUp = true;
    }
    let newCoupons = [...meta.coupons || []];
    let awardedCoupon = null;
    if (isLevelUp) {
      const levelCoupon = getCouponForLevel(newLevel);
      if (levelCoupon && !newCoupons.some((c) => c.code === levelCoupon.code)) {
        newCoupons.push(levelCoupon);
        awardedCoupon = levelCoupon;
      }
    }
    const type = reason.includes("unirse") || reason.includes("Unirse") ? "join" : reason.includes("crear") || reason.includes("Organizar") ? "create" : "system";
    const newHistory = [
      {
        id: "xp_" + Date.now(),
        title: reason,
        xp: amount,
        date: (/* @__PURE__ */ new Date()).toLocaleDateString(),
        type
      },
      ...meta.xp_history || []
    ];
    const joinedDelta = type === "join" ? 1 : 0;
    const createdDelta = type === "create" ? 1 : 0;
    const { data: { user: updatedUser } } = await supabase.auth.updateUser({
      data: {
        xp: newXp,
        level: newLevel,
        coupons: newCoupons,
        xp_history: newHistory,
        joined_events_count: (meta.joined_events_count || 0) + joinedDelta,
        created_events_count: (meta.created_events_count || 0) + createdDelta
      }
    });
    if (updatedUser) setUser(updatedUser);
    setXpNotification({
      xp: amount,
      reason,
      isLevelUp,
      newLevel: isLevelUp ? newLevel : void 0,
      newCoupon: awardedCoupon
    });
  };
  const claimCoupon = async (code) => {
    if (!user) return;
    const meta = user.user_metadata || {};
    const currentCoupons = meta.coupons || [];
    const newCoupons = currentCoupons.map((c) => {
      if (c.code === code) {
        return { ...c, claimed: true };
      }
      return c;
    });
    const { data: { user: updatedUser } } = await supabase.auth.updateUser({
      data: {
        coupons: newCoupons
      }
    });
    if (updatedUser) setUser(updatedUser);
  };
  const updateProfile = async (updates) => {
    if (!user) return;
    const { data: { user: updatedUser }, error: updateError } = await supabase.auth.updateUser({
      data: {
        full_name: updates.name,
        avatar_url: updates.avatarUrl,
        is_organizer: updates.isOrganizer,
        age: updates.age,
        gender: updates.gender,
        description: updates.description,
        location: updates.location,
        preferred_sports: updates.preferredSports
      },
      ...updates.email && updates.email !== user.email && { email: updates.email }
    });
    if (updateError) throw updateError;
    try {
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        username: (updates.email || user.email || "").trim(),
        full_name: updates.name,
        avatar_url: updates.avatarUrl,
        rating: user.user_metadata?.rating || 4.8,
        is_premium: user.user_metadata?.is_premium || false,
        age: updates.age,
        gender: updates.gender,
        description: updates.description,
        location: updates.location,
        preferred_sports: updates.preferredSports
      });
      if (profileError) {
        console.warn("Failed to update public profiles table due to RLS, but continuing:", profileError);
      }
    } catch (e) {
      console.error("Error upserting public profile:", e);
    }
    if (updatedUser) {
      setUser(updatedUser);
    }
  };
  const clearNotification = () => setXpNotification(null);
  const clearEventNotification = () => setEventNotification(null);
  useEffect(() => {
    addXpRef.current = addXp;
  });
  const checkStatusChanges = async () => {
    if (!user?.email) return;
    try {
      const { data, error } = await supabase.from("event_participants").select("id, event_id, status").eq("user_username", user.email);
      if (error || !data) return;
      const newStatuses = {};
      const changes = [];
      data.forEach((item) => {
        newStatuses[item.id] = item.status;
        const oldStatus = previousStatuses.current[item.id];
        if (!isFirstFetch.current && oldStatus === "pendiente" && item.status !== "pendiente") {
          changes.push({ id: item.id, eventId: item.event_id, status: item.status });
        }
      });
      previousStatuses.current = { ...previousStatuses.current, ...newStatuses };
      isFirstFetch.current = false;
      for (const change of changes) {
        if (change.status === "aceptado" || change.status === "rechazado") {
          const { data: eventData } = await supabase.from("events").select("title, sport_id").eq("id", change.eventId).maybeSingle();
          const sportName = eventData?.sport_id === 1 ? "Fútbol" : eventData?.sport_id === 2 ? "Tenis" : eventData?.sport_id === 3 ? "Golf" : eventData?.sport_id === 4 ? "Pádel" : "Deporte";
          const eventTitle = eventData?.title || `Evento de ${sportName}`;
          if (change.status === "aceptado") {
            setEventNotification({ type: "accepted", eventTitle, sport: sportName });
            addXpRef.current(15, `Aceptado en partido de ${sportName}: ${eventTitle} 👟`);
          } else if (change.status === "rechazado") {
            setEventNotification({ type: "rejected", eventTitle, sport: sportName });
          }
        }
      }
    } catch (e) {
      console.error("Error in status check:", e);
    }
  };
  useEffect(() => {
    if (!user?.email) return;
    isFirstFetch.current = true;
    previousStatuses.current = {};
    checkStatusChanges();
    const interval = setInterval(checkStatusChanges, 4e3);
    const channel = supabase.channel(`user_event_status_${user.id}`).on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "event_participants",
        filter: `user_username=eq.${user.email}`
      },
      async (payload) => {
        const newStatus = payload.new?.status;
        const oldStatus = payload.old?.status;
        if (!newStatus || newStatus === oldStatus) return;
        if (newStatus !== "aceptado" && newStatus !== "rechazado") return;
        const eventId = payload.new?.event_id;
        if (!eventId) return;
        const { data: eventData } = await supabase.from("events").select("title, sport_id").eq("id", eventId).maybeSingle();
        const sportName = eventData?.sport_id === 1 ? "Fútbol" : eventData?.sport_id === 2 ? "Tenis" : eventData?.sport_id === 3 ? "Golf" : eventData?.sport_id === 4 ? "Pádel" : "Deporte";
        const eventTitle = eventData?.title || `Evento de ${sportName}`;
        if (newStatus === "aceptado") {
          setEventNotification({ type: "accepted", eventTitle, sport: sportName });
          addXpRef.current(15, `Aceptado en partido de ${sportName}: ${eventTitle} 👟`);
        } else if (newStatus === "rechazado") {
          setEventNotification({ type: "rejected", eventTitle, sport: sportName });
        }
        if (payload.new?.id) {
          previousStatuses.current[payload.new.id] = newStatus;
        }
      }
    ).subscribe();
    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [user?.email, user?.id]);
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Usuario";
  const initials = displayName.substring(0, 2).toUpperCase();
  const avatarUrl = user?.user_metadata?.avatar_url ?? null;
  const xp = user?.user_metadata?.xp || 0;
  const level = user?.user_metadata?.level || 1;
  const useCount = user?.user_metadata?.use_count || 0;
  const coupons = user?.user_metadata?.coupons || [];
  const xpHistory = user?.user_metadata?.xp_history || [];
  const joinedEventsCount = user?.user_metadata?.joined_events_count || 0;
  const createdEventsCount = user?.user_metadata?.created_events_count || 0;
  const carisma = user?.user_metadata?.carisma || 0;
  const incrementCarisma = async (amount = 1) => {
    if (!user) return;
    const meta = user.user_metadata || {};
    const currentCarisma = meta.carisma || 0;
    const newCarisma = currentCarisma + amount;
    const { data: { user: updatedUser } } = await supabase.auth.updateUser({
      data: {
        carisma: newCarisma
      }
    });
    if (updatedUser) setUser(updatedUser);
  };
  return /* @__PURE__ */ jsx(
    UserContext.Provider,
    {
      value: {
        user,
        avatarUrl,
        displayName,
        initials,
        xp,
        level,
        useCount,
        coupons,
        xpHistory,
        joinedEventsCount,
        createdEventsCount,
        xpNotification,
        eventNotification,
        clearNotification,
        clearEventNotification,
        addXp,
        claimCoupon,
        updateProfile,
        isLoading,
        carisma,
        incrementCarisma
      },
      children
    }
  );
}
function useCurrentUser() {
  return useContext(UserContext);
}
const LeafletMap$1 = lazy(
  () => import("./LeafletMap-DGs4gWld.js").then((m) => ({ default: m.default }))
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
    /* @__PURE__ */ jsxs("div", { className: "sticky top-0 z-20 flex items-center gap-3 md:gap-4 border-b border-border bg-background/90 px-4 md:px-8 pb-3 md:pb-5 pt-12 md:pt-16 backdrop-blur", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onBack,
          className: "grid h-10 w-10 md:h-12 md:w-12 place-items-center rounded-full bg-muted hover:bg-muted/80 transition-all active:scale-95",
          "aria-label": "Volver",
          children: /* @__PURE__ */ jsx(ArrowLeft, { size: 18, className: "text-secondary md:scale-110" })
        }
      ),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-lg md:text-3xl font-bold text-secondary", children: "Añadir cancha" }),
        /* @__PURE__ */ jsx("p", { className: "text-[11px] md:text-sm text-muted-foreground", children: "Registra una nueva cancha deportiva" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto px-5 md:px-12 py-5 md:py-8 pb-32 space-y-6 md:space-y-8 max-w-2xl mx-auto w-full", children: [
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
  const [showFloatXp, setShowFloatXp] = useState(false);
  const { addXp } = useCurrentUser();
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
      setShowFloatXp(true);
      const sportLabel = SPORTS.find((s) => s.id === form.sportId)?.label || "Deporte";
      addXp(25, `Organizar partido de ${sportLabel} en ${form.address || "Caracas"} ⚽`);
      setTimeout(() => {
        setShowFloatXp(false);
      }, 1200);
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
  function handleDismissSuccess() {
    setForm(INITIAL_FORM);
    setStatus("idle");
    onEventCreated();
    onClose();
  }
  if (status === "success") {
    return /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 z-50 flex h-full flex-col items-center justify-center bg-black/95 px-6 text-center animate-in fade-in duration-300", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 pointer-events-none", style: { background: "radial-gradient(circle at 50% 40%, rgba(16,185,129,0.15) 0%, transparent 70%)" } }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6 max-w-sm flex flex-col items-center animate-in zoom-in-95 duration-500 relative z-10", children: [
        /* @__PURE__ */ jsx("span", { className: "inline-flex rounded-full bg-emerald-500/25 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-emerald-400 border border-emerald-500/30 animate-pulse", children: "¡EVENTO PUBLICADO! ⚽" }),
        /* @__PURE__ */ jsx("div", { className: "grid h-24 w-24 place-items-center rounded-full bg-emerald-500 text-white shadow-pop ring-8 ring-emerald-500/20", children: /* @__PURE__ */ jsx(CheckCircle2, { size: 48, strokeWidth: 2.5 }) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl font-black text-white tracking-tight drop-shadow-md", children: "¡Listo!" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-white/80 px-4 leading-relaxed", children: "Tu partido ya está en el mapa, listo para que otros jugadores se unan. ¡A jugar!" })
        ] }),
        showFloatXp && /* @__PURE__ */ jsx("div", { className: "float-xp z-50", children: "+25 XP ⚡" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleDismissSuccess,
            className: "w-full rounded-2xl gradient-primary py-3.5 text-xs font-black uppercase tracking-wider text-secondary shadow-pop transition-all active:scale-95 mt-4 cursor-pointer",
            children: "¡Entendido!"
          }
        )
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
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-x-0 bottom-0 z-20 glass border-t border-border px-5 py-4 relative", children: [
      showFloatXp && /* @__PURE__ */ jsx("div", { className: "float-xp absolute left-1/2 -translate-x-1/2 -top-12 z-50", children: "+25 XP ⚡" }),
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
const runningTrail = "/assets/running-trail-B8Oay5hI.jpg";
const tennisCourt = "/assets/tennis-court-DN_fDHme.png";
const golfCourse = "/assets/golf-course-CNvN28v6.png";
const getSportImage$2 = (sportId) => {
  if (sportId === 1) return footballField;
  if (sportId === 2) return tennisCourt;
  if (sportId === 3) return golfCourse;
  if (sportId === 4) return padelCourt;
  return runningTrail;
};
const LeafletMap = lazy(
  () => import("./LeafletMap-DGs4gWld.js").then((m) => ({ default: m.default }))
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
  onNavigateToComments,
  onNavigateToProfile
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
          image: getSportImage$2(row.sport_id),
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
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-x-0 top-0 z-20 pt-12 pointer-events-none flex flex-col", children: [
      /* @__PURE__ */ jsx("div", { className: "px-4 mb-3 pointer-events-auto w-fit", children: /* @__PURE__ */ jsx(UserAvatar, { size: "sm", className: "shadow-lg ring-2 ring-primary/20 bg-background/90 backdrop-blur-sm cursor-pointer", onClick: onNavigateToProfile }) }),
      /* @__PURE__ */ jsx("div", { className: "w-full flex gap-3 overflow-x-auto px-4 pb-4 pointer-events-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x", children: sports.map((s) => {
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
            className: `snap-center shrink-0 whitespace-nowrap rounded-3xl px-6 py-3.5 text-sm font-black tracking-wide shadow-xl transition-all border-2 ${isActive ? "bg-primary text-secondary border-primary scale-[1.02]" : "bg-background/95 text-secondary border-transparent hover:bg-background backdrop-blur-md"}`,
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
            return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-dashed border-border p-6 text-center", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-muted-foreground mb-1", children: "No hay partidos programados aquí" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-4", children: "¡Sé el primero en organizar uno!" }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => {
                    setShowCreateForm(true);
                  },
                  className: "w-full py-3 px-5 rounded-xl font-bold text-sm text-white",
                  style: { background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))", boxShadow: "0 4px 16px rgba(99,102,241,0.35)" },
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
        className: "absolute bottom-24 right-4 z-50 flex items-center gap-2 rounded-2xl gradient-primary px-5 py-4 text-base font-bold text-secondary shadow-pop transition-all active:scale-95 hover:scale-105",
        "aria-label": "Crear evento",
        style: { boxShadow: "0 6px 24px rgba(99,102,241,0.45)" },
        children: [
          /* @__PURE__ */ jsx(Plus, { size: 20, strokeWidth: 2.5 }),
          "Crear partido"
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
function LoginPromptModal({
  isOpen,
  onClose,
  onLogin,
  onRegister,
  actionContext = "realizar esta acción"
}) {
  if (!isOpen) return null;
  const perks = [
    { icon: MapPin, text: "Únete a partidos cerca de ti" },
    { icon: Users, text: "Crea eventos y arma tu equipo" },
    { icon: Trophy, text: "Gana XP y desbloquea recompensas" },
    { icon: Zap, text: "Matchmaking por nivel y deporte" }
  ];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm animate-in fade-in duration-200",
        onClick: onClose
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "fixed inset-x-0 bottom-0 z-[9999] flex justify-center animate-in slide-in-from-bottom duration-300", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md rounded-t-3xl bg-[#0f1117] border border-white/10 shadow-2xl overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-center pt-3 pb-1", children: /* @__PURE__ */ jsx("div", { className: "h-1 w-10 rounded-full bg-white/20" }) }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onClose,
          className: "absolute top-4 right-4 grid h-8 w-8 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition-colors active:scale-95",
          "aria-label": "Cerrar",
          children: /* @__PURE__ */ jsx(X, { size: 14, className: "text-white/70" })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "px-6 pb-8 pt-2 space-y-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center space-y-2 pt-2", children: [
          /* @__PURE__ */ jsx("div", { className: "inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#32CD32] to-[#22a822] shadow-lg shadow-green-500/25 mx-auto", children: /* @__PURE__ */ jsx("span", { className: "text-3xl", children: "⚽" }) }),
          /* @__PURE__ */ jsxs("h2", { className: "text-xl font-black text-white leading-tight", children: [
            "¡Únete para ",
            actionContext,
            "!"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-white/60 leading-relaxed max-w-[280px] mx-auto", children: "Crea tu cuenta gratis y accede a todos los partidos y canchas de Caracas." })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "rounded-2xl bg-white/5 border border-white/8 divide-y divide-white/5", children: perks.map(({ icon: Icon, text }) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-4 py-3", children: [
          /* @__PURE__ */ jsx("div", { className: "grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#32CD32]/15", children: /* @__PURE__ */ jsx(Icon, { size: 14, className: "text-[#32CD32]" }) }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-white/80", children: text })
        ] }, text)) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2.5", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              id: "login-prompt-register-btn",
              onClick: onRegister,
              className: "group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#32CD32] to-[#22a822] py-4 text-sm font-black text-[#0f1117] shadow-lg shadow-green-500/25 transition-all active:scale-[0.98] hover:shadow-green-500/40",
              children: [
                "Crear Cuenta Gratis",
                /* @__PURE__ */ jsx(ArrowRight, { size: 16, className: "transition-transform group-hover:translate-x-1" })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              id: "login-prompt-login-btn",
              onClick: onLogin,
              className: "w-full rounded-2xl border border-white/15 bg-white/5 py-3.5 text-sm font-bold text-white/80 transition-all hover:bg-white/10 active:scale-[0.98]",
              children: "Ya tengo cuenta — Iniciar Sesión"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: onClose,
            className: "w-full text-center text-xs text-white/30 hover:text-white/50 transition-colors py-1",
            children: "Ahora no, seguir explorando"
          }
        )
      ] })
    ] }) })
  ] });
}
function EventDetailScreen({
  event,
  onBack,
  userLocation,
  onOpenAuth
}) {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFloatXp, setShowFloatXp] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { addXp, coupons, claimCoupon, avatarUrl: currentUserAvatar } = useCurrentUser();
  const [selectedCouponCode, setSelectedCouponCode] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedUserProfile, setSelectedUserProfile] = useState(null);
  const [hostProfile, setHostProfile] = useState(null);
  const [myFriends, setMyFriends] = useState([]);
  useEffect(() => {
    if (currentUser) {
      fetchMyFriends();
    }
  }, [currentUser]);
  async function fetchMyFriends() {
    if (!currentUser?.id) return;
    try {
      const { data: dbProfiles } = await supabase.from("profiles").select("*");
      const { data: requestsData } = await supabase.from("friend_requests").select("*").or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`);
      const requests = requestsData || [];
      const friends = [];
      requests.forEach((req) => {
        if (req.status === "accepted") {
          const otherUserId = req.sender_id === currentUser.id ? req.receiver_id : req.sender_id;
          const profile = dbProfiles?.find((p) => p.id === otherUserId);
          if (profile) {
            friends.push(profile);
          }
        }
      });
      setMyFriends(friends);
    } catch (e) {
      console.error(e);
    }
  }
  const renderAvatar = (username, sizeClass = "h-10 w-10", explicitAvatarUrl) => {
    const isCurrentUser = currentUser?.email === username || currentUser?.user_metadata?.full_name === username;
    const url = isCurrentUser ? currentUserAvatar || explicitAvatarUrl : explicitAvatarUrl;
    if (url) {
      return /* @__PURE__ */ jsx(
        "img",
        {
          src: url,
          alt: username,
          className: `${sizeClass} rounded-full object-cover shadow-soft ring-2 ring-primary/30`
        }
      );
    }
    return /* @__PURE__ */ jsx("div", { className: `${sizeClass} grid place-items-center rounded-full gradient-primary text-sm font-bold text-secondary shadow-soft ring-2 ring-primary/30`, children: (username || "U").substring(0, 2).toUpperCase() });
  };
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setCurrentUser(data.user));
    fetchParticipants();
    fetchHostProfile();
    const channel = supabase.channel(`participants_${event.id}`).on(
      "postgres_changes",
      { event: "*", schema: "public", table: "event_participants", filter: `event_id=eq.${event.id}` },
      () => fetchParticipants()
    ).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [event.id]);
  async function fetchHostProfile() {
    try {
      const { data } = await supabase.from("profiles").select("avatar_url, rating").eq("username", event.host).maybeSingle();
      if (data) {
        setHostProfile(data);
      }
    } catch (e) {
      console.error("Error fetching host profile:", e);
    }
  }
  async function fetchParticipants() {
    setLoading(true);
    const { data, error } = await supabase.from("event_participants").select("*, profiles(*)").eq("event_id", event.id);
    if (!error && data) {
      setParticipants(data);
    }
    setLoading(false);
  }
  async function handleJoin() {
    if (!currentUser || !currentUser.email) {
      setShowLoginPrompt(true);
      return;
    }
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
      setShowSuccess(true);
      if (selectedCouponCode) {
        await claimCoupon(selectedCouponCode);
      }
      fetchParticipants();
      setTimeout(() => {
        setShowSuccess(false);
      }, 2e3);
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
  async function handleInviteFriend(friend) {
    const friendEmail = friend.username || friend.name.toLowerCase().replace(" ", "") + "@teammatch.com";
    const invitationStatus = isHost ? "aceptado" : "pendiente";
    try {
      const { error } = await supabase.from("event_participants").insert({
        event_id: event.id,
        user_username: friendEmail,
        status: invitationStatus
      });
      if (error) throw error;
      if (invitationStatus === "aceptado") {
        alert(`¡${friend.name} ha sido agregado al partido!`);
      } else {
        alert(`¡Se ha enviado la solicitud de invitación para ${friend.name}! Esperando aprobación del organizador.`);
      }
      fetchParticipants();
    } catch (e) {
      console.warn("Could not insert to Supabase event_participants due to RLS/schema, simulating locally:", e);
      const idHash = friend.id ? friend.id.split("-").join("") : friend.username || friend.name;
      let charCodeSum = 0;
      for (let i = 0; i < idHash.length; i++) {
        charCodeSum += idHash.charCodeAt(i);
      }
      const rating = 4.5 + charCodeSum % 6 * 0.1;
      const mockParticipant = {
        id: Math.floor(Math.random() * 1e5),
        event_id: event.id,
        user_username: friendEmail,
        status: invitationStatus,
        profiles: {
          username: friend.username || friendEmail,
          avatar_url: null,
          rating: Number(rating.toFixed(2)),
          age: friend.age,
          gender: friend.gender || (charCodeSum % 2 === 0 ? "Masculino" : "Femenino"),
          description: friend.bio,
          location: friend.location,
          preferred_sports: friend.sports
        }
      };
      setParticipants((prev) => [...prev, mockParticipant]);
      if (invitationStatus === "aceptado") {
        alert(`¡${friend.name} ha sido agregado al partido!`);
      } else {
        alert(`¡Se ha enviado la solicitud de invitación para ${friend.name}! Esperando aprobación del organizador.`);
      }
    }
  }
  async function handleLeave() {
    if (!currentUser?.email) return;
    const confirmLeave = confirm("¿Estás seguro de que deseas salirte de este partido?");
    if (!confirmLeave) return;
    try {
      const { error } = await supabase.from("event_participants").delete().eq("event_id", event.id).eq("user_username", currentUser.email);
      if (error) throw error;
      alert("Te has salido del partido.");
      fetchParticipants();
    } catch (e) {
      console.error("Error leaving event, simulating locally:", e);
      setParticipants((prev) => prev.filter((p) => p.user_username !== currentUser.email));
      alert("Te has salido del partido.");
    }
  }
  const approvedPlayers = participants.filter((p) => p.status === "approved" || p.status === "aceptado" || p.status === "aprobado" || !p.status);
  const pendingRequests = participants.filter((p) => p.status === "pending" || p.status === "pendiente");
  const emptySpots = Math.max(0, event.spots - approvedPlayers.length);
  const activeCoupons = coupons.filter((c) => !c.claimed);
  let finalPrice = event.price;
  let appliedDiscountText = "";
  if (selectedCouponCode) {
    const coupon = coupons.find((c) => c.code === selectedCouponCode);
    if (coupon) {
      if (coupon.code === "FIDELIDAD5") {
        finalPrice = Math.max(0, event.price - 5);
        appliedDiscountText = "-$5 USD";
      } else if (coupon.code === "ASPIRANTE2") {
        finalPrice = Math.max(0, event.price * 0.9);
        appliedDiscountText = "-10%";
      } else if (coupon.code === "GUERRERO3") {
        finalPrice = Math.max(0, event.price * 0.85);
        appliedDiscountText = "-15%";
      } else if (coupon.code === "LEYENDA5") {
        finalPrice = 0;
        appliedDiscountText = "-100%";
      }
    }
  }
  const isHost = currentUser && (event.host === currentUser.email || event.hostName === currentUser.email);
  const isUserPending = participants.some((p) => p.user_username === currentUser?.email && (p.status === "pending" || p.status === "pendiente"));
  const isUserApproved = participants.some((p) => p.user_username === currentUser?.email && (p.status === "approved" || p.status === "aceptado" || p.status === "aprobado" || !p.status)) || isHost;
  if (showSuccess) {
    return /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 z-50 flex h-full flex-col items-center justify-center space-y-6 bg-background px-6 text-center animate-in fade-in zoom-in duration-500", children: [
      /* @__PURE__ */ jsx("div", { className: "grid h-24 w-24 place-items-center rounded-full bg-emerald-500 text-white shadow-pop ring-8 ring-emerald-500/20", children: /* @__PURE__ */ jsx(CheckCircle2, { size: 48, strokeWidth: 2.5 }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-secondary", children: "¡Solicitud enviada!" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "Tu solicitud para unirte al partido de ",
          event.sport,
          " ha sido enviada con éxito."
        ] })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "relative h-full overflow-y-auto bg-background", children: [
    /* @__PURE__ */ jsx(
      LoginPromptModal,
      {
        isOpen: showLoginPrompt,
        onClose: () => setShowLoginPrompt(false),
        onLogin: () => {
          setShowLoginPrompt(false);
          onOpenAuth?.();
        },
        onRegister: () => {
          setShowLoginPrompt(false);
          onOpenAuth?.();
        },
        actionContext: "unirte al partido"
      }
    ),
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
        renderAvatar(event.host, "h-11 w-11", hostProfile?.avatar_url),
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
            value: event.zone || (event.lat && event.lng ? `${event.lat.toFixed(4)}, ${event.lng.toFixed(4)}` : "Caracas"),
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
          /* @__PURE__ */ jsxs(
            "div",
            {
              onClick: () => setSelectedUserProfile(req.profiles || { username: req.user_username }),
              className: "flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity",
              children: [
                renderAvatar(req.user_username || "Usuario", "h-10 w-10", req.profiles?.avatar_url),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("div", { className: "text-sm font-bold text-secondary", children: req.user_username?.split("@")[0] || "Usuario" }),
                  /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-muted-foreground flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx(Star, { size: 10, className: "fill-accent text-accent" }),
                    req.profiles?.rating || "5.00"
                  ] }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: (e) => {
                        e.stopPropagation();
                        setSelectedUserProfile(req.profiles || { username: req.user_username });
                      },
                      className: "text-[9px] font-extrabold text-primary hover:underline block text-left",
                      children: "Ver Perfil 🔍"
                    }
                  )
                ] })
              ]
            }
          ),
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
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            currentUser && /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setShowInviteModal(true),
                className: "rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 text-primary px-3 py-1.5 text-xs font-black transition-all active:scale-95 shadow-sm cursor-pointer",
                children: "+ Invitar Amigos"
              }
            ),
            /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
              emptySpots,
              " cupos disponibles"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: loading ? /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Cargando jugadores..." }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          approvedPlayers.map((p, i) => /* @__PURE__ */ jsx("div", { title: p.user_username, children: renderAvatar(p.user_username || "Usuario", "h-10 w-10", p.profiles?.avatar_url) }, p.id || i)),
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
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-x-0 bottom-0 z-20 glass border-t border-border px-5 py-4 relative", children: [
      showFloatXp && /* @__PURE__ */ jsx("div", { className: "float-xp absolute left-1/2 -translate-x-1/2 -top-12 z-50", children: "+15 XP ⚔️" }),
      event.price > 0 && activeCoupons.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mb-3 flex items-center justify-between gap-2 border-b border-border/60 pb-3", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase text-muted-foreground flex items-center gap-1", children: "📜 Aplicar Cupón RPG:" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: selectedCouponCode,
            onChange: (e) => setSelectedCouponCode(e.target.value),
            className: "text-xs font-bold text-secondary border border-border bg-card/85 rounded-xl px-2 py-1 outline-none focus:border-primary shrink-0 max-w-[200px]",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "-- Sin cupón --" }),
              activeCoupons.map((c) => /* @__PURE__ */ jsxs("option", { value: c.code, children: [
                c.title,
                " (",
                c.discount,
                ")"
              ] }, c.code))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "text-[11px] font-medium text-muted-foreground flex items-center gap-1", children: [
            "Aporte ",
            selectedCouponCode && /* @__PURE__ */ jsx("span", { className: "text-[9px] font-extrabold text-primary bg-primary/10 px-1 rounded-full", children: appliedDiscountText })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-lg font-bold text-secondary", children: [
            finalPrice === 0 ? "Gratis" : `$${finalPrice.toFixed(2)} USD`,
            selectedCouponCode && /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-muted-foreground line-through ml-1.5", children: [
              "$",
              event.price
            ] })
          ] })
        ] }),
        isHost ? /* @__PURE__ */ jsx(
          "button",
          {
            disabled: true,
            className: "ml-auto flex-1 rounded-2xl py-3.5 text-sm font-bold bg-primary text-secondary cursor-default select-none shadow-soft text-center",
            children: "Eres el organizador 👑"
          }
        ) : isUserApproved ? /* @__PURE__ */ jsx(
          "button",
          {
            disabled: joining,
            onClick: handleLeave,
            className: "ml-auto flex-1 rounded-2xl py-3.5 text-sm font-bold bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 active:scale-[0.98] transition-all text-center cursor-pointer",
            children: "Salir del partido 🚪"
          }
        ) : isUserPending ? /* @__PURE__ */ jsx(
          "button",
          {
            disabled: joining,
            onClick: handleLeave,
            className: "ml-auto flex-1 rounded-2xl py-3.5 text-sm font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-red-500/10 hover:text-red-500 active:scale-[0.98] transition-all text-center cursor-pointer",
            children: "Cancelar solicitud ⏳"
          }
        ) : /* @__PURE__ */ jsx(
          "button",
          {
            disabled: joining || emptySpots === 0,
            onClick: handleJoin,
            className: `ml-auto flex-1 rounded-2xl py-3.5 text-sm font-bold shadow-pop active:scale-[0.98] transition-all disabled:opacity-90 cursor-pointer ${emptySpots === 0 ? "bg-muted text-muted-foreground cursor-not-allowed" : "gradient-primary text-secondary"}`,
            children: joining ? "Enviando..." : emptySpots === 0 ? "Evento Lleno" : "Solicitar unirme"
          }
        )
      ] })
    ] }),
    showInviteModal && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-6 py-4 animate-in fade-in duration-300", children: /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-sm rounded-3xl bg-secondary border border-primary/30 p-6 shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[80vh]", children: [
      /* @__PURE__ */ jsxs("h3", { className: "text-lg font-black text-white flex items-center gap-2 border-b border-white/10 pb-3", children: [
        /* @__PURE__ */ jsx(Users, { size: 20, className: "text-primary animate-pulse" }),
        " Invitar Amigos"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto py-4 space-y-2 pr-1", children: (() => {
        if (myFriends.length === 0) {
          return /* @__PURE__ */ jsx("div", { className: "text-center text-xs text-muted-foreground py-8", children: "No tienes amigos disponibles para invitar. ¡Acepta solicitudes en la pestaña de Amigos!" });
        }
        return myFriends.map((profile) => {
          const friend = getFormattedProfile$1(profile);
          if (!friend) return null;
          const friendEmail = friend.username || friend.name.toLowerCase().replace(" ", "") + "@teammatch.com";
          const isParticipant = participants.some(
            (p) => p.user_username === friendEmail || p.profiles?.username === friend.name || friend.username && p.user_username === friend.username
          );
          return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between bg-card p-3 rounded-2xl border border-border shadow-soft", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
              friend.avatar_url ? /* @__PURE__ */ jsx("img", { src: friend.avatar_url, className: "h-9 w-9 rounded-full object-cover shadow-sm shrink-0" }) : /* @__PURE__ */ jsx("div", { className: `h-9 w-9 rounded-full bg-gradient-to-tr ${friend.gradient} grid place-items-center text-base shadow-sm shrink-0`, children: friend.emoji }),
              /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsx("div", { className: "text-xs font-bold text-secondary truncate", children: friend.name }),
                /* @__PURE__ */ jsx("div", { className: "text-[9px] text-muted-foreground", children: friend.location })
              ] })
            ] }),
            isParticipant ? /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-lg", children: "Ya está en el partido" }) : /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleInviteFriend({ ...friend, id: profile.id }),
                className: "rounded-xl gradient-primary text-secondary px-3 py-1.5 text-[10px] font-black transition-all active:scale-95 shadow-sm cursor-pointer",
                children: "Agregar"
              }
            )
          ] }, profile.id);
        });
      })() }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setShowInviteModal(false),
          className: "w-full rounded-2xl bg-muted py-3 text-xs font-black uppercase tracking-wider text-muted-foreground shadow-sm hover:bg-muted/80 transition-all mt-2 cursor-pointer",
          children: "Cerrar"
        }
      )
    ] }) }),
    selectedUserProfile && (() => {
      const formatted = getFormattedProfile$1(selectedUserProfile);
      if (!formatted) return null;
      return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 px-6 py-4 animate-in fade-in duration-300", children: /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-sm rounded-3xl bg-secondary border border-primary/30 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col", children: [
        /* @__PURE__ */ jsx("div", { className: `h-24 w-full bg-gradient-to-tr ${formatted.gradient} relative shrink-0` }),
        /* @__PURE__ */ jsx("div", { className: "absolute top-10 left-6", children: /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsx("div", { className: "h-16 w-16 rounded-full bg-card p-1 shadow-md ring-4 ring-secondary", children: formatted.avatar_url ? /* @__PURE__ */ jsx(
          "img",
          {
            src: formatted.avatar_url,
            alt: "Avatar",
            className: "h-full w-full rounded-full object-cover"
          }
        ) : /* @__PURE__ */ jsx("div", { className: `h-full w-full rounded-full bg-gradient-to-tr ${formatted.gradient} grid place-items-center text-2xl`, children: formatted.emoji }) }) }) }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setSelectedUserProfile(null),
            className: "absolute top-4 right-4 h-8 w-8 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors grid place-items-center cursor-pointer",
            children: /* @__PURE__ */ jsx(X, { size: 16 })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "p-6 pt-8 space-y-4 text-white", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-base font-black flex items-center gap-2", children: [
              formatted.name,
              formatted.is_organizer && /* @__PURE__ */ jsx("span", { className: "inline-flex items-center gap-0.5 rounded-full bg-amber-500/20 px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-amber-500 border border-amber-500/30", children: "Organizador" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] text-white/50", children: formatted.username })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-2.5 py-1 text-xs font-bold text-primary", children: [
            /* @__PURE__ */ jsx(Star, { size: 12, className: "fill-primary text-primary" }),
            " ",
            formatted.rating.toFixed(2),
            " Reputación"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 text-center text-xs", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-white/5 p-2 rounded-xl border border-white/10", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[9px] text-white/50 block font-bold", children: "Edad" }),
              /* @__PURE__ */ jsxs("span", { className: "font-extrabold text-white", children: [
                formatted.age,
                " años"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white/5 p-2 rounded-xl border border-white/10", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[9px] text-white/50 block font-bold", children: "Género" }),
              /* @__PURE__ */ jsx("span", { className: "font-extrabold text-white truncate block", children: formatted.gender })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white/5 p-2 rounded-xl border border-white/10", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[9px] text-white/50 block font-bold", children: "Ubicación" }),
              /* @__PURE__ */ jsx("span", { className: "font-extrabold text-white truncate block", title: formatted.location, children: formatted.location })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[9px] text-white/50 font-bold uppercase tracking-wider block", children: "Sobre mí" }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs leading-relaxed text-white/80 bg-white/5 p-3 rounded-xl border border-white/5 italic", children: [
              '"',
              formatted.bio,
              '"'
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[9px] text-white/50 font-bold uppercase tracking-wider block", children: "Deportes Favoritos" }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: formatted.sports.map((sport) => /* @__PURE__ */ jsx("span", { className: "rounded-full bg-primary/15 border border-primary/25 px-2.5 py-0.5 text-[9px] font-bold text-primary", children: sport }, sport)) })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setSelectedUserProfile(null),
              className: "w-full rounded-2xl bg-muted py-3 text-xs font-black uppercase tracking-wider text-muted-foreground shadow-sm hover:bg-muted/80 transition-all mt-2 cursor-pointer",
              children: "Volver al Partido"
            }
          )
        ] })
      ] }) });
    })()
  ] });
}
const getFormattedProfile$1 = (p) => {
  if (!p) return null;
  const username = p.username || "Usuario";
  let charCodeSum = 0;
  for (let i = 0; i < username.length; i++) {
    charCodeSum += username.charCodeAt(i);
  }
  const age = p.age || 20 + charCodeSum % 15;
  const locations = ["Chacao", "Las Mercedes", "Altamira", "El Hatillo", "La Castellana", "Los Palos Grandes"];
  const location = p.location || locations[charCodeSum % locations.length];
  const sportsPool = ["Running", "Senderismo", "Pádel", "Tenis", "Vóleibol"];
  const sportsCount = 1 + charCodeSum % 3;
  const sports2 = p.preferred_sports || [];
  if (sports2.length === 0) {
    for (let i = 0; i < sportsCount; i++) {
      const sport = sportsPool[(charCodeSum + i) % sportsPool.length];
      if (!sports2.includes(sport)) {
        sports2.push(sport);
      }
    }
  }
  const emojis = ["🏃‍♂️", "🎯", "🥊", "🏄", "🧗‍♀️", "🛹", "🪼", "🪨", "🐾", "🐺"];
  const emoji = emojis[charCodeSum % emojis.length];
  const gradients = [
    "from-pink-500 to-rose-400",
    "from-emerald-500 to-teal-400",
    "from-blue-500 to-cyan-400",
    "from-purple-500 to-indigo-400",
    "from-amber-500 to-orange-400",
    "from-sky-500 to-blue-600",
    "from-orange-400 to-red-500"
  ];
  const gradient = gradients[charCodeSum % gradients.length];
  const bios = [
    "¡Me encanta el deporte y conocer gente nueva para entrenar en Caracas!",
    "Siempre activo para jugar un partido de pádel o tenis.",
    "Subo al Ávila todos los fines de semana. ¡Acompáñame!",
    "Running y entrenamiento funcional. Busco motivar y que me motiven.",
    "Jugador recreativo de vóleibol y fútbol. Buena vibra."
  ];
  const bio = p.description || bios[charCodeSum % bios.length];
  const name = username.includes("@") ? username.split("@")[0].split(".").map((n) => n.charAt(0).toUpperCase() + n.slice(1)).join(" ") : username;
  return {
    name,
    username,
    age,
    gender: p.gender || (charCodeSum % 2 === 0 ? "Masculino" : "Femenino"),
    location,
    bio,
    sports: sports2,
    emoji,
    gradient,
    rating: p.rating || 4.8,
    avatar_url: p.avatar_url,
    is_premium: p.is_premium || false,
    is_organizer: p.is_organizer || false
  };
};
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
  onSelectEvent,
  onOpenAuth,
  onOpenRegister
}) {
  const {
    user,
    avatarUrl,
    displayName,
    xp,
    level,
    useCount,
    coupons,
    xpHistory,
    joinedEventsCount,
    createdEventsCount,
    claimCoupon,
    carisma
  } = useCurrentUser();
  const [activeTab, setActiveTab] = useState("stats");
  const [copiedCode, setCopiedCode] = useState(null);
  const [showClaimSuccess, setShowClaimSuccess] = useState(null);
  const handleLogout = async () => {
    const { supabase: supabase2 } = await Promise.resolve().then(() => supabase$1);
    await supabase2.auth.signOut();
  };
  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2e3);
  };
  if (!user) {
    return /* @__PURE__ */ jsxs("div", { className: "h-full overflow-y-auto bg-background", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative bg-gradient-to-br from-[#0f1117] via-[#0f1117] to-[#1a2a1a] px-6 pb-20 pt-14 text-center overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 h-56 w-56 rounded-full bg-[#32CD32]/15 blur-3xl" }),
        /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute bottom-0 -right-10 h-40 w-40 rounded-full bg-[#32CD32]/10 blur-2xl" }),
        /* @__PURE__ */ jsxs("div", { className: "relative inline-flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#32CD32] to-[#22a822] shadow-2xl shadow-green-500/30 ring-4 ring-[#32CD32]/20 mx-auto", children: [
          /* @__PURE__ */ jsx("span", { className: "text-4xl", children: "🏟️" }),
          /* @__PURE__ */ jsx("div", { className: "absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#0f1117] ring-2 ring-[#32CD32]/30", children: /* @__PURE__ */ jsx("span", { className: "text-base", children: "❓" }) })
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "mt-5 text-2xl font-black text-white", children: "Perfil de Invitado" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-sm text-white/50 max-w-[260px] mx-auto", children: "Explora la app libremente. Crea tu cuenta para desbloquear todo." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "px-5 -mt-10 space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-3xl bg-card border border-border shadow-pop overflow-hidden", children: [
          /* @__PURE__ */ jsxs("div", { className: "px-5 py-5 space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#32CD32]/15", children: /* @__PURE__ */ jsx(Sparkles, { size: 18, className: "text-[#32CD32] animate-pulse" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h2", { className: "text-base font-black text-secondary", children: "Únete a la comunidad" }),
                /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground", children: "Accede a todo TeamMatch gratis" })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "space-y-2", children: [
              { icon: MapPin, text: "Encuentra partidos cerca de ti en tiempo real" },
              { icon: Users, text: "Solicita un cupo y únete con un toque" },
              { icon: Trophy, text: "Sube de nivel y gana recompensas exclusivas" },
              { icon: Zap, text: "Matchmaking inteligente por nivel de juego" },
              { icon: Star, text: "Crea tus propios eventos y arma equipo" }
            ].map(({ icon: Icon, text }) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 rounded-xl bg-muted/50 px-3 py-2.5", children: [
              /* @__PURE__ */ jsx("div", { className: "grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#32CD32]/15", children: /* @__PURE__ */ jsx(Icon, { size: 13, className: "text-[#32CD32]" }) }),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-secondary/80", children: text })
            ] }, text)) }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2 pt-1", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  id: "guest-profile-register-btn",
                  onClick: onOpenRegister,
                  className: "group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#32CD32] to-[#22a822] py-4 text-sm font-black text-[#0f1117] shadow-pop shadow-green-500/20 transition-all active:scale-[0.98] hover:shadow-green-500/30",
                  children: [
                    "Crear Cuenta Gratis",
                    /* @__PURE__ */ jsx(ArrowRight, { size: 16, className: "transition-transform group-hover:translate-x-1" })
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  id: "guest-profile-login-btn",
                  onClick: onOpenAuth,
                  className: "w-full rounded-2xl border border-border bg-muted/50 py-3.5 text-sm font-bold text-secondary transition-all hover:bg-muted active:scale-[0.98]",
                  children: "Ya tengo cuenta — Iniciar Sesión"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "border-t border-border grid grid-cols-3 divide-x divide-border", children: [
            { k: "1.2k", v: "Jugadores" },
            { k: "320", v: "Eventos/mes" },
            { k: "4.9★", v: "Rating" }
          ].map((s) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center py-4", children: [
            /* @__PURE__ */ jsx("div", { className: "text-lg font-black text-[#32CD32]", children: s.k }),
            /* @__PURE__ */ jsx("div", { className: "text-[10px] font-semibold text-muted-foreground", children: s.v })
          ] }, s.v)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-dashed border-border bg-muted/20 p-4 flex items-start gap-3", children: [
          /* @__PURE__ */ jsx(Shield, { size: 18, className: "text-muted-foreground shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-muted-foreground leading-relaxed", children: [
            "Tu cuenta es ",
            /* @__PURE__ */ jsx("strong", { className: "text-secondary", children: "100% gratuita" }),
            ". Puedes explorar el mapa, ver eventos y canchas sin necesidad de registrarte."
          ] })
        ] })
      ] })
    ] });
  }
  const email = user.email || "";
  const initials = displayName.substring(0, 2).toUpperCase();
  const xpNeeded = level * 100;
  const xpPercentage = Math.min(100, Math.max(0, xp / xpNeeded * 100));
  let rpgClass = "Recluta Novato 👟";
  let borderClass = "neon-border-bronze";
  let rarityLabel = "Novato";
  let rarityColor = "text-amber-600 bg-amber-500/10 border-amber-500/20";
  if (level === 2) {
    rpgClass = "Aspirante Activo ⚡";
    borderClass = "neon-border-bronze";
    rarityLabel = "Común";
    rarityColor = "text-gray-400 bg-gray-500/10 border-gray-500/20";
  } else if (level === 3) {
    rpgClass = "Guerrero del Fitness 🏋️‍♂️";
    borderClass = "neon-border-silver";
    rarityLabel = "Raro";
    rarityColor = "text-blue-400 bg-blue-500/10 border-blue-500/20";
  } else if (level === 4) {
    rpgClass = "Maestro del Match 🏆";
    borderClass = "neon-border-gold";
    rarityLabel = "Épico";
    rarityColor = "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
  } else if (level >= 5) {
    rpgClass = "Leyenda de Caracas 🌟";
    borderClass = "neon-border-legendary";
    rarityLabel = "Legendario";
    rarityColor = "text-purple-400 bg-purple-500/10 border-purple-500/20";
  }
  const str = 10 + joinedEventsCount * 2;
  const wis = 10 + createdEventsCount * 5;
  const con = 10 + useCount;
  const cha = 10 + carisma;
  if (showClaimSuccess) {
    return /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 z-50 flex h-full flex-col items-center justify-center space-y-6 bg-background px-6 text-center animate-in fade-in zoom-in duration-500", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 sunburst-rays opacity-10 pointer-events-none" }),
      /* @__PURE__ */ jsx("div", { className: "grid h-24 w-24 place-items-center rounded-full bg-primary text-secondary shadow-pop ring-8 ring-primary/20 animate-bounce", children: /* @__PURE__ */ jsx(Check, { size: 48, strokeWidth: 3, className: "text-secondary" }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-black text-secondary uppercase tracking-wide", children: "¡Objeto Canjeado! 💎" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-primary", children: showClaimSuccess.title }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground max-w-[285px] mx-auto leading-relaxed", children: [
          "El beneficio de **",
          showClaimSuccess.discount,
          "** ha sido activado con éxito para tu próxima reserva de cancha o partido."
        ] })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "h-full overflow-y-auto bg-background pb-28", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative gradient-dark px-5 pb-24 pt-12 text-primary-foreground", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: onEdit,
            className: "grid h-10 w-10 place-items-center rounded-full bg-card/10 text-primary transition-transform active:scale-95",
            children: /* @__PURE__ */ jsx(Edit3, { size: 16 })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary shadow-soft", children: [
          /* @__PURE__ */ jsx(Sparkles, { size: 11, className: "animate-pulse" }),
          " Modo RPG Activo"
        ] }),
        /* @__PURE__ */ jsx("button", { className: "grid h-10 w-10 place-items-center rounded-full bg-card/10", children: /* @__PURE__ */ jsx(Settings, { size: 16 }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-col sm:flex-row items-center gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative shrink-0", children: [
          /* @__PURE__ */ jsx("div", { className: `h-22 w-22 rounded-full overflow-hidden p-1 bg-card ${borderClass}`, children: avatarUrl ? /* @__PURE__ */ jsx(
            "img",
            {
              src: avatarUrl,
              alt: "Avatar",
              className: "h-full w-full rounded-full object-cover shadow-inner"
            }
          ) : /* @__PURE__ */ jsx("div", { className: "grid h-full w-full place-items-center rounded-full bg-secondary text-2xl font-black text-primary shadow-inner", children: initials }) }),
          /* @__PURE__ */ jsx("div", { className: "absolute -bottom-2 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary font-mono text-sm font-black text-secondary ring-2 ring-card shadow-pop", children: level })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 text-center sm:text-left space-y-1.5", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-2", children: [
            /* @__PURE__ */ jsxs("h1", { className: "text-xl font-black text-white flex items-center justify-center sm:justify-start gap-2", children: [
              displayName,
              user?.user_metadata?.is_organizer && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-amber-500 shadow-pop border border-amber-500/30", children: [
                /* @__PURE__ */ jsx(Star, { size: 9, className: "fill-amber-500 text-amber-500" }),
                " Organizador"
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              "span",
              {
                className: `inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide w-fit mx-auto sm:mx-0 ${rarityColor}`,
                children: rarityLabel
              }
            )
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-white/70 font-semibold", children: rpgClass }),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-white/50", children: email })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 space-y-1.5 bg-card/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs font-black text-white", children: [
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx(Trophy, { size: 13, className: "text-primary animate-pulse" }),
            " Puntos de Experiencia"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "font-mono", children: [
            xp,
            " / ",
            xpNeeded,
            " XP"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "h-3.5 w-full rounded-full bar-xp-container shadow-inner", children: /* @__PURE__ */ jsx(
          "div",
          {
            className: "h-full rounded-full bar-xp-glowing transition-all duration-500 ease-out",
            style: { width: `${xpPercentage}%` }
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-[9px] text-white/60 font-semibold", children: [
          /* @__PURE__ */ jsxs("span", { children: [
            "Nivel ",
            level
          ] }),
          /* @__PURE__ */ jsxs("span", { children: [
            "+",
            xpNeeded - xp,
            " XP para Nivel ",
            level + 1
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "px-5 -mt-8", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-1 rounded-2xl bg-card p-1.5 shadow-pop border border-border", children: [
      { id: "stats", label: "Hoja de Stats", icon: Shield },
      { id: "inventory", label: "Inventario", icon: Trophy },
      { id: "history", label: "Aventuras", icon: BookOpen }
    ].map((t) => {
      const ActiveIcon = t.icon;
      const isSelected = activeTab === t.id;
      return /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setActiveTab(t.id),
          className: `flex flex-col items-center gap-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 ${isSelected ? "bg-secondary text-primary shadow-sm" : "text-muted-foreground hover:bg-muted/50 hover:text-secondary"}`,
          children: [
            /* @__PURE__ */ jsx(ActiveIcon, { size: 14, className: isSelected ? "text-primary" : "" }),
            t.label
          ]
        },
        t.id
      );
    }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 px-5", children: [
      activeTab === "stats" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx(Award, { size: 14, className: "text-primary" }),
          " Atributos del Jugador"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsx(
            StatCard,
            {
              icon: Flame,
              label: "Fuerza (STR)",
              value: str,
              colorClass: "text-red-500",
              bgClass: "bg-red-500/5 border-red-500/10",
              description: "Aumenta al unirte a partidos (+2 XP/partido)"
            }
          ),
          /* @__PURE__ */ jsx(
            StatCard,
            {
              icon: BookOpen,
              label: "Sabiduría (WIS)",
              value: wis,
              colorClass: "text-blue-500",
              bgClass: "bg-blue-500/5 border-blue-500/10",
              description: "Aumenta al crear partidos (+5 XP/partido)"
            }
          ),
          /* @__PURE__ */ jsx(
            StatCard,
            {
              icon: Shield,
              label: "Constitución (CON)",
              value: con,
              colorClass: "text-emerald-500",
              bgClass: "bg-emerald-500/5 border-emerald-500/10",
              description: "Aumenta con el uso diario de la app"
            }
          ),
          /* @__PURE__ */ jsx(
            StatCard,
            {
              icon: Sparkles,
              label: "Carisma (CHA)",
              value: cha,
              colorClass: "text-amber-500",
              bgClass: "bg-amber-500/5 border-amber-500/10",
              description: "Calculado según tu reputación deportiva"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-card p-4 shadow-soft space-y-4", children: [
          /* @__PURE__ */ jsxs("h4", { className: "text-xs font-black uppercase tracking-wider text-secondary flex items-center gap-1.5 border-b border-border pb-2", children: [
            /* @__PURE__ */ jsx(Sparkles, { size: 14, className: "text-primary animate-pulse" }),
            " Información de Perfil"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 text-center text-xs", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-muted/40 p-2.5 rounded-xl border border-border/50", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground block font-bold", children: "Edad" }),
              /* @__PURE__ */ jsx("span", { className: "font-black text-secondary", children: user.user_metadata?.age ? `${user.user_metadata.age} años` : "—" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-muted/40 p-2.5 rounded-xl border border-border/50", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground block font-bold", children: "Género" }),
              /* @__PURE__ */ jsx("span", { className: "font-black text-secondary", children: user.user_metadata?.gender || "—" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-muted/40 p-2.5 rounded-xl border border-border/50", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground block font-bold", children: "Ubicación" }),
              /* @__PURE__ */ jsx("span", { className: "font-black text-secondary truncate block", title: user.user_metadata?.location || "", children: user.user_metadata?.location || "—" })
            ] })
          ] }),
          user.user_metadata?.description && /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground font-bold", children: "Sobre mí" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs leading-relaxed text-secondary-foreground/80 bg-muted/20 p-3 rounded-xl border border-border/30", children: user.user_metadata.description })
          ] }),
          user.user_metadata?.preferred_sports && user.user_metadata.preferred_sports.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground font-bold block", children: "Deportes favoritos" }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: user.user_metadata.preferred_sports.map((sport) => /* @__PURE__ */ jsx("span", { className: "rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-[10px] font-bold text-primary", children: sport }, sport)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-card p-4 shadow-soft", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-xs font-black uppercase tracking-wider text-secondary mb-1", children: "Resumen de Campaña" }),
          /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-muted-foreground leading-relaxed", children: [
            "Has completado **",
            joinedEventsCount,
            " partidos** como luchador y has guiado a otros jugadores creando **",
            createdEventsCount,
            " eventos**. Tu constancia te ha otorgado **",
            useCount,
            " días de entrenamiento** activo."
          ] })
        ] })
      ] }),
      activeTab === "inventory" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx(Trophy, { size: 14, className: "text-primary" }),
            " Cofre de Objetos Mágicos"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold text-muted-foreground", children: [
            coupons.filter((c) => !c.claimed).length,
            " Activos"
          ] })
        ] }),
        coupons.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center space-y-2 animate-fade-in", children: [
          /* @__PURE__ */ jsx("div", { className: "text-4xl", children: "🎁" }),
          /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold text-secondary", children: "Cofre Vacío" }),
          /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground max-w-[240px] mx-auto", children: "No tienes cupones. ¡Organiza eventos (+25 XP), únete a partidos (+15 XP) o usa la app diariamente para ganar cofres sorpresa!" })
        ] }) : /* @__PURE__ */ jsx("div", { className: "grid gap-3", children: coupons.map((c) => {
          const isLegendary = c.id === "LEYENDA5";
          return /* @__PURE__ */ jsxs(
            "div",
            {
              className: `rounded-2xl p-4 transition-all shadow-soft flex flex-col justify-between magic-scroll ${isLegendary ? "magic-scroll-legendary" : ""} ${c.claimed ? "opacity-60 grayscale border-border bg-muted/30 pointer-events-none" : ""}`,
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: `inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wider mb-2 ${isLegendary ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" : "bg-amber-500/20 text-amber-500 border border-amber-500/30"}`,
                        children: isLegendary ? "Objeto Legendario ⭐" : "Objeto Épico 📜"
                      }
                    ),
                    /* @__PURE__ */ jsx("h4", { className: "text-xs font-black text-secondary", children: c.title }),
                    /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5 leading-tight", children: c.description })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "text-right shrink-0", children: [
                    /* @__PURE__ */ jsx("div", { className: "text-sm font-black text-primary drop-shadow-sm", children: c.discount }),
                    /* @__PURE__ */ jsx("div", { className: "text-[9px] text-muted-foreground font-semibold mt-0.5", children: c.date })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center justify-between gap-3 pt-3.5 border-t border-dashed border-border/60", children: [
                  /* @__PURE__ */ jsxs("div", { className: "font-mono text-[10px] font-black text-muted-foreground bg-muted px-2 py-1 rounded-lg", children: [
                    "Código: ",
                    /* @__PURE__ */ jsx("span", { className: "text-secondary select-all", children: c.code })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: () => handleCopy(c.code),
                        className: "flex items-center gap-1 rounded-xl bg-card border border-border px-2.5 py-1.5 text-[10px] font-black text-secondary transition-all hover:bg-muted active:scale-95 shadow-sm",
                        children: copiedCode === c.code ? /* @__PURE__ */ jsxs(Fragment, { children: [
                          /* @__PURE__ */ jsx(Check, { size: 11, className: "text-emerald-500" }),
                          /* @__PURE__ */ jsx("span", { children: "Copiado" })
                        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                          /* @__PURE__ */ jsx(Copy, { size: 11 }),
                          /* @__PURE__ */ jsx("span", { children: "Copiar" })
                        ] })
                      }
                    ),
                    !c.claimed ? /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: async () => {
                          await claimCoupon(c.code);
                          setShowClaimSuccess({ title: c.title, discount: c.discount });
                          setTimeout(() => setShowClaimSuccess(null), 3e3);
                        },
                        className: "rounded-xl gradient-primary px-3 py-1.5 text-[10px] font-black text-secondary transition-all active:scale-95 shadow-sm cursor-pointer",
                        children: "Canjear"
                      }
                    ) : /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black text-muted-foreground px-2 py-1.5 bg-muted/80 rounded-xl", children: "Usado" })
                  ] })
                ] })
              ]
            },
            c.code
          );
        }) })
      ] }),
      activeTab === "history" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx(Calendar, { size: 14, className: "text-primary" }),
          " Registro de Aventuras (XP Log)"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-2", children: xpHistory.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-8 text-xs text-muted-foreground", children: "Aún no has ganado experiencia. ¡Explora el mapa y únete a un partido!" }) : xpHistory.map((h) => {
          let typeEmoji = "🎮";
          let typeBg = "bg-purple-500/10 text-purple-500 border border-purple-500/20";
          if (h.type === "join") {
            typeEmoji = "👟";
            typeBg = "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
          } else if (h.type === "create") {
            typeEmoji = "⚽";
            typeBg = "bg-blue-500/10 text-blue-500 border border-blue-500/20";
          } else if (h.type === "use") {
            typeEmoji = "⚡";
            typeBg = "bg-amber-500/10 text-amber-500 border border-amber-500/20";
          }
          return /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex items-center justify-between rounded-2xl border border-border bg-card p-3 shadow-soft",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: `grid h-8 w-8 place-items-center rounded-xl text-sm shrink-0 ${typeBg}`,
                      children: typeEmoji
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("div", { className: "text-xs font-black text-secondary leading-tight", children: h.title }),
                    /* @__PURE__ */ jsx("div", { className: "text-[9px] text-muted-foreground font-semibold mt-0.5", children: h.date })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "text-xs font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full", children: h.xp > 0 ? `+${h.xp} XP` : `0 XP` })
              ]
            },
            h.id
          );
        }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "px-5 pt-8", children: /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: handleLogout,
        className: "flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500/10 py-4 text-xs font-black uppercase tracking-wider text-red-500 transition-colors hover:bg-red-500/20",
        children: [
          /* @__PURE__ */ jsx(LogOut, { size: 16 }),
          "Cerrar Sesión del Héroe"
        ]
      }
    ) })
  ] });
}
function StatCard({
  icon: Icon,
  label,
  value,
  colorClass,
  bgClass,
  description
}) {
  return /* @__PURE__ */ jsxs("div", { className: `rounded-2xl border p-3 shadow-soft flex flex-col ${bgClass}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-1", children: [
      /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase tracking-wide text-muted-foreground truncate", children: label }),
      /* @__PURE__ */ jsx(Icon, { size: 14, className: colorClass })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "text-xl font-black text-secondary leading-none my-1", children: value }),
    /* @__PURE__ */ jsx("p", { className: "text-[9px] text-muted-foreground leading-tight", children: description })
  ] });
}
function EditProfileScreen({ onBack }) {
  const { user: currentUser, updateProfile } = useCurrentUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [age, setAge] = useState(void 0);
  const [gender, setGender] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [preferredSports, setPreferredSports] = useState([]);
  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
      setName(currentUser.user_metadata?.full_name || currentUser.email?.split("@")[0] || "");
      setEmail(currentUser.email || "");
      setAvatarUrl(currentUser.user_metadata?.avatar_url || null);
      setIsOrganizer(!!currentUser.user_metadata?.is_organizer);
      setAge(currentUser.user_metadata?.age || void 0);
      setGender(currentUser.user_metadata?.gender || "");
      setDescription(currentUser.user_metadata?.description || "");
      setLocation(currentUser.user_metadata?.location || "");
      setPreferredSports(currentUser.user_metadata?.preferred_sports || []);
      setLoading(false);
    } else {
      supabase.auth.getUser().then(({ data: { user: user2 } }) => {
        if (user2) {
          setUser(user2);
          setName(user2.user_metadata?.full_name || user2.email?.split("@")[0] || "");
          setEmail(user2.email || "");
          setAvatarUrl(user2.user_metadata?.avatar_url || null);
          setIsOrganizer(!!user2.user_metadata?.is_organizer);
          setAge(user2.user_metadata?.age || void 0);
          setGender(user2.user_metadata?.gender || "");
          setDescription(user2.user_metadata?.description || "");
          setLocation(user2.user_metadata?.location || "");
          setPreferredSports(user2.user_metadata?.preferred_sports || []);
        }
        setLoading(false);
      });
    }
  }, [currentUser]);
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
      await updateProfile({
        name,
        avatarUrl,
        isOrganizer,
        email: email !== user?.email ? email : void 0,
        age,
        gender,
        description,
        location,
        preferredSports
      });
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
    /* @__PURE__ */ jsxs("header", { className: "flex items-center gap-3 px-5 py-4 shrink-0", children: [
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
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSave, className: "flex flex-1 flex-col overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto px-5 pt-4 pb-4 space-y-6", children: [
        error && /* @__PURE__ */ jsx("div", { className: "rounded-xl bg-destructive/10 p-3 text-sm font-semibold text-destructive", children: error }),
        success && /* @__PURE__ */ jsx("div", { className: "rounded-xl bg-primary/10 p-3 text-sm font-semibold text-primary", children: success }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center space-y-3 pb-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            avatarUrl ? /* @__PURE__ */ jsx("img", { src: avatarUrl, alt: "Avatar", className: "h-24 w-24 rounded-full object-cover border-2 border-primary/30" }) : /* @__PURE__ */ jsx("div", { className: "h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary", children: name.substring(0, 2).toUpperCase() }),
            /* @__PURE__ */ jsxs("label", { className: "absolute bottom-0 right-0 grid h-8 w-8 cursor-pointer place-items-center rounded-full bg-primary text-secondary shadow-pop transition-transform active:scale-90", children: [
              uploadingImage ? /* @__PURE__ */ jsx(Loader2, { size: 16, className: "animate-spin" }) : /* @__PURE__ */ jsx(Camera, { size: 16 }),
              /* @__PURE__ */ jsx("input", { type: "file", accept: "image/*", onChange: handleImageUpload, className: "hidden", disabled: uploadingImage })
            ] })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground", children: "Foto de perfil" })
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
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-muted-foreground", children: "Edad" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  value: age ?? "",
                  onChange: (e) => setAge(e.target.value ? parseInt(e.target.value) : void 0),
                  className: "w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-secondary outline-none transition-colors focus:border-primary",
                  placeholder: "Ej. 25",
                  min: "1",
                  max: "120"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-muted-foreground", children: "Género" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: gender,
                  onChange: (e) => setGender(e.target.value),
                  className: "w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-secondary outline-none transition-colors focus:border-primary",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "Seleccionar..." }),
                    /* @__PURE__ */ jsx("option", { value: "Masculino", children: "Masculino" }),
                    /* @__PURE__ */ jsx("option", { value: "Femenino", children: "Femenino" }),
                    /* @__PURE__ */ jsx("option", { value: "Otro", children: "Otro" })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-muted-foreground", children: "Ubicación (Municipio/Zona)" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: location,
                onChange: (e) => setLocation(e.target.value),
                className: "w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-secondary outline-none transition-colors focus:border-primary",
                placeholder: "Ej. Chacao, Caracas"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-muted-foreground", children: "Sobre mí (Descripción)" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                value: description,
                onChange: (e) => setDescription(e.target.value),
                rows: 3,
                className: "w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-secondary outline-none transition-colors focus:border-primary resize-none",
                placeholder: "Cuéntanos un poco sobre ti, tu nivel de juego, etc."
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-muted-foreground block", children: "Deportes preferidos" }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: ["Running", "Senderismo", "Pádel", "Tenis", "Vóleibol"].map((sport) => {
              const isSelected = preferredSports.includes(sport);
              return /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    if (isSelected) {
                      setPreferredSports(preferredSports.filter((s) => s !== sport));
                    } else {
                      setPreferredSports([...preferredSports, sport]);
                    }
                  },
                  className: `rounded-full px-3 py-1.5 text-xs font-bold border transition-all ${isSelected ? "bg-primary/20 text-primary border-primary" : "bg-card text-muted-foreground border-border hover:border-muted-foreground"}`,
                  children: sport
                },
                sport
              );
            }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 cursor-pointer transition-all hover:border-primary/50 active:scale-[0.99]", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                checked: isOrganizer,
                onChange: (e) => setIsOrganizer(e.target.checked),
                className: "h-4 w-4 rounded border-border text-primary accent-primary"
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-secondary block", children: "Modo Organizador" }),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground", children: "Te permite registrar y gestionar tus propias instalaciones y canchas" })
            ] })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "shrink-0 px-5 py-4 border-t border-border bg-background", children: /* @__PURE__ */ jsx(
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
      ) })
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
function CanchaCommentsScreen({ cancha, onBack, onOpenAuth }) {
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
    ] }) : !user ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-3 rounded-2xl bg-muted/30 p-5 border border-dashed border-border", children: [
      /* @__PURE__ */ jsx("div", { className: "grid h-10 w-10 place-items-center rounded-full bg-muted text-lg", children: "💬" }),
      /* @__PURE__ */ jsxs("div", { className: "text-center space-y-1", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-secondary", children: "Inicia sesión para comentar" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Comparte tu opinión sobre esta cancha con la comunidad." })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          id: "comments-login-btn",
          onClick: onOpenAuth,
          className: "flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#32CD32] to-[#22a822] px-5 py-2.5 text-xs font-black text-[#0f1117] shadow-pop shadow-green-500/20 transition-all active:scale-95 hover:shadow-green-500/30",
          children: "Iniciar Sesión / Registrarse"
        }
      )
    ] }) : !canComment ? /* @__PURE__ */ jsxs("div", { className: "flex gap-2.5 items-start rounded-2xl bg-amber-500/5 border border-amber-500/20 p-3.5", children: [
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
  const [status, setStatus] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const pct = event.joined / event.spots * 100;
  event.joined >= event.spots;
  useEffect(() => {
    let channel;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user && user.email) {
        setCurrentUser(user);
        const fetchStatus = async () => {
          const { data } = await supabase.from("event_participants").select("status").eq("event_id", event.id).eq("user_username", user.email).maybeSingle();
          if (data) {
            setStatus(data.status);
          } else {
            setStatus(null);
          }
        };
        fetchStatus();
        channel = supabase.channel(`participant_status_${event.id}_${user.id}`).on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "event_participants",
            filter: `event_id=eq.${event.id}`
          },
          (payload) => {
            if (payload.new && payload.new.user_username === user.email) {
              setStatus(payload.new.status);
            } else if (payload.eventType === "DELETE" && payload.old && payload.old.user_username === user.email) {
              setStatus(null);
            } else {
              fetchStatus();
            }
          }
        ).subscribe();
      }
    });
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [event.id]);
  const isHost = currentUser && (event.host === currentUser.email || event.creator_username === currentUser.email);
  const isAccepted = status === "aceptado" || status === "approved" || status === "aprobado" || isHost;
  const isPending = status === "pendiente" || status === "pending";
  async function handleJoin(e) {
    e.stopPropagation();
    if (onClick) onClick();
  }
  return /* @__PURE__ */ jsxs(
    "button",
    {
      onClick,
      className: "group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-card text-left shadow-soft transition-all active:scale-[0.98] w-full",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "relative h-28 w-full overflow-hidden shrink-0", children: [
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
        /* @__PURE__ */ jsxs("div", { className: "p-3 flex-1 flex flex-col justify-between w-full space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-xs text-muted-foreground flex-wrap", children: [
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
          variant === "full" && /* @__PURE__ */ jsxs("div", { className: "w-full flex flex-col gap-2 mt-auto", children: [
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
                className: `w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all active:scale-95 shadow-pop ${isAccepted ? "bg-primary text-secondary hover:bg-primary/90" : isPending ? "bg-amber-500/20 text-amber-500 border border-amber-500/30 hover:bg-amber-500/30" : "bg-secondary text-primary-foreground hover:bg-secondary/90"}`,
                children: isAccepted ? "Ver evento" : isPending ? "Esperando solicitud" : "Unirse al evento"
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function CouponPopup() {
  const [coupons, setCoupons] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const hasSeen = sessionStorage.getItem("teamMatch_hasSeenCoupons");
    if (hasSeen === "true") {
      return;
    }
    async function loadActiveCoupons() {
      try {
        const todayDate = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
        const { data, error } = await supabase.from("cupones").select("*").gte("duracion", todayDate);
        if (error) {
          console.error("Error al obtener cupones:", error.message);
          return;
        }
        if (data && data.length > 0) {
          setCoupons(data);
          setIsOpen(true);
        }
      } catch (err) {
        console.error("Error inesperado al cargar cupones:", err);
      }
    }
    loadActiveCoupons();
  }, []);
  if (!isOpen || coupons.length === 0) {
    return null;
  }
  const currentCoupon = coupons[activeIdx];
  const couponTitle = currentCoupon.nombre || "¡Descuento Especial!";
  const couponDesc = currentCoupon.descripcion || "Disfruta de este beneficio exclusivo en tus próximos eventos.";
  const couponImg = currentCoupon["Imagen de Fondo"] || currentCoupon.imagen_de_fondo || "https://images.unsplash.com/photo-1540747737956-37872404797a?q=80&w=800";
  const couponCode = currentCoupon.idCupon || currentCoupon.codigo || currentCoupon.code || String(currentCoupon.id);
  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("teamMatch_hasSeenCoupons", "true");
  };
  const handleNext = (e) => {
    e.stopPropagation();
    setCopied(false);
    setActiveIdx((prev) => (prev + 1) % coupons.length);
  };
  const handleCopyCode = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2e3);
    } catch (err) {
      console.error("No se pudo copiar el código:", err);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in", children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: "relative w-full max-w-sm overflow-hidden rounded-3xl bg-secondary border border-white/10 shadow-2xl transition-all duration-300 animate-in zoom-in-95 slide-in-from-bottom-8 aspect-[3/4.2] flex flex-col justify-between",
      style: {
        backgroundImage: `url(${couponImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      },
      children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/95 z-0" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleClose,
            className: "absolute top-4 right-4 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 border border-white/20 text-white/80 hover:text-white hover:bg-black/60 transition-all hover:scale-105 active:scale-95 cursor-pointer",
            "aria-label": "Cerrar anuncio",
            children: /* @__PURE__ */ jsx(X, { size: 18 })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex flex-col h-full justify-between p-6 pt-12 pb-8 text-center text-white", children: [
          /* @__PURE__ */ jsxs("div", { className: "animate-in fade-in slide-in-from-top-3 duration-500", children: [
            /* @__PURE__ */ jsx("span", { className: "inline-flex rounded-full bg-primary/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary border border-primary/30 animate-pulse mb-3", children: "Anuncio Especial 📣" }),
            /* @__PURE__ */ jsx("h2", { className: "text-2xl md:text-3xl font-extrabold tracking-tight leading-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]", children: couponTitle })
          ] }, `title-${activeIdx}`),
          /* @__PURE__ */ jsx("div", { className: "px-2 py-4 animate-in fade-in duration-500 max-h-[140px] overflow-y-auto", children: /* @__PURE__ */ jsx("p", { className: "text-sm md:text-base text-gray-200 font-medium leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]", children: couponDesc }) }, `desc-${activeIdx}`),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4 w-full", children: [
            /* @__PURE__ */ jsxs(
              "div",
              {
                onClick: handleCopyCode,
                className: "group relative flex w-full max-w-[280px] cursor-pointer items-center justify-between gap-2 rounded-2xl border-2 border-dashed border-primary/60 bg-primary/10 backdrop-blur-md px-4 py-3 text-center transition-all hover:border-primary hover:bg-primary/20 hover:scale-102 active:scale-98 animate-in fade-in slide-in-from-bottom-3 duration-500",
                title: "Click para copiar código",
                children: [
                  /* @__PURE__ */ jsx("div", { className: "flex-1 font-mono text-lg font-black tracking-wider text-primary select-all", children: couponCode }),
                  /* @__PURE__ */ jsx("div", { className: "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/25 text-primary transition-transform group-hover:scale-110", children: copied ? /* @__PURE__ */ jsx(Check, { size: 14, className: "text-emerald-400" }) : /* @__PURE__ */ jsx(Copy, { size: 14 }) }),
                  copied && /* @__PURE__ */ jsx("span", { className: "absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-md animate-bounce", children: "¡Copiado!" })
                ]
              },
              `code-${activeIdx}`
            ),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] text-white/50", children: "*Haz clic en el código para copiarlo al portapapeles." })
          ] })
        ] }),
        coupons.length > 1 && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleNext,
            className: "absolute right-4 top-1/2 -translate-y-1/2 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-black/40 border border-white/20 text-white/80 hover:text-white hover:bg-black/60 hover:scale-110 hover:border-primary active:scale-90 transition-all shadow-lg cursor-pointer",
            "aria-label": "Siguiente cupón",
            children: /* @__PURE__ */ jsx(ChevronRight, { size: 24, className: "translate-x-[1px]" })
          }
        ),
        coupons.length > 1 && /* @__PURE__ */ jsx("div", { className: "absolute bottom-3 left-0 right-0 z-30 flex justify-center gap-1.5 pb-1", children: coupons.map((_, index) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: (e) => {
              e.stopPropagation();
              setCopied(false);
              setActiveIdx(index);
            },
            className: `h-1.5 rounded-full transition-all duration-300 ${activeIdx === index ? "bg-primary w-4" : "bg-white/30 w-1.5"}`,
            "aria-label": `Ir al cupón ${index + 1}`
          },
          index
        )) })
      ]
    }
  ) });
}
const getSportImage$1 = (sportId) => {
  if (sportId === 1) return footballField;
  if (sportId === 2) return tennisCourt;
  if (sportId === 3) return golfCourse;
  if (sportId === 4) return padelCourt;
  return runningTrail;
};
const tabs = ["Próximos", "Mis Partidos", "Solicitudes"];
function MyEventsScreen({ onSelect, onNavigateToProfile }) {
  const [tab, setTab] = useState("Próximos");
  const [pendingRequests, setPendingRequests] = useState([]);
  const [availableEvents, setAvailableEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [createdEvents, setCreatedEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUserProfile, setSelectedUserProfile] = useState(null);
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
      image: getSportImage$1(row.sport_id),
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
    const { data: joinedData } = await supabase.from("event_participants").select("events(*)").eq("user_username", email).neq("status", "rechazado");
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
    setTab(upcoming.length > 0 ? "Mis Partidos" : "Próximos");
  }
  async function fetchRequests(email) {
    if (!email) return;
    setLoading(true);
    const { data, error } = await supabase.from("event_participants").select(`
        id, 
        user_username, 
        status,
        events!inner(id, creator_username, sport_id),
        profiles(*)
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
    /* @__PURE__ */ jsx(CouponPopup, {}),
    /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between px-5 pb-3 pt-12", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-secondary", children: "Mis eventos" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Tu agenda deportiva" })
      ] }),
      /* @__PURE__ */ jsx(UserAvatar, { size: "md", className: "cursor-pointer", onClick: onNavigateToProfile })
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
      const sportName = req.events?.sport_id === 1 ? "Fútbol" : req.events?.sport_id === 2 ? "Tenis" : req.events?.sport_id === 3 ? "Golf" : req.events?.sport_id === 4 ? "Pádel" : "Evento";
      return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-card p-4 shadow-soft", children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            onClick: () => setSelectedUserProfile(req.profiles || { username: req.user_username }),
            className: "mb-3 flex items-center gap-3 cursor-pointer hover:opacity-85 transition-opacity",
            children: [
              req.profiles?.avatar_url ? /* @__PURE__ */ jsx(
                "img",
                {
                  src: req.profiles.avatar_url,
                  alt: "Avatar",
                  className: "h-10 w-10 rounded-full object-cover shadow-soft ring-2 ring-primary/30"
                }
              ) : /* @__PURE__ */ jsx("div", { className: "grid h-10 w-10 place-items-center rounded-full gradient-primary text-sm font-bold text-secondary", children: (req.user_username || "U").substring(0, 2).toUpperCase() }),
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
                  sportName,
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: (e) => {
                        e.stopPropagation();
                        setSelectedUserProfile(req.profiles || { username: req.user_username });
                      },
                      className: "text-[10px] font-extrabold text-primary hover:underline block text-left mt-1",
                      children: "Ver Perfil 🔍"
                    }
                  )
                ] })
              ] })
            ]
          }
        ),
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
    }) }) : /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-4 px-5 pt-3", children: [
      tab === "Próximos" && /* @__PURE__ */ jsxs(Fragment, { children: [
        availableEvents.map((e) => /* @__PURE__ */ jsx(EventCard, { event: e, onClick: () => onSelect(e) }, e.id)),
        availableEvents.length === 0 && /* @__PURE__ */ jsx("div", { className: "w-full text-center text-sm text-muted-foreground p-5 mt-10", children: "No hay eventos disponibles" })
      ] }),
      tab === "Mis Partidos" && /* @__PURE__ */ jsxs(Fragment, { children: [
        myEvents.map((e) => /* @__PURE__ */ jsx(EventCard, { event: e, onClick: () => onSelect(e) }, e.id)),
        myEvents.length === 0 && /* @__PURE__ */ jsx("div", { className: "w-full text-center text-sm text-muted-foreground p-5 mt-10", children: "No tienes partidos próximos programados" })
      ] })
    ] }),
    selectedUserProfile && (() => {
      const formatted = getFormattedProfile(selectedUserProfile);
      if (!formatted) return null;
      return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 px-6 py-4 animate-in fade-in duration-300", children: /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-sm rounded-3xl bg-secondary border border-primary/30 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col", children: [
        /* @__PURE__ */ jsx("div", { className: `h-24 w-full bg-gradient-to-tr ${formatted.gradient} relative shrink-0` }),
        /* @__PURE__ */ jsx("div", { className: "absolute top-10 left-6", children: /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsx("div", { className: "h-16 w-16 rounded-full bg-card p-1 shadow-md ring-4 ring-secondary", children: formatted.avatar_url ? /* @__PURE__ */ jsx(
          "img",
          {
            src: formatted.avatar_url,
            alt: "Avatar",
            className: "h-full w-full rounded-full object-cover"
          }
        ) : /* @__PURE__ */ jsx("div", { className: `h-full w-full rounded-full bg-gradient-to-tr ${formatted.gradient} grid place-items-center text-2xl`, children: formatted.emoji }) }) }) }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setSelectedUserProfile(null),
            className: "absolute top-4 right-4 h-8 w-8 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors grid place-items-center cursor-pointer",
            children: /* @__PURE__ */ jsx(X, { size: 16 })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "p-6 pt-8 space-y-4 text-white", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-base font-black flex items-center gap-2", children: [
              formatted.name,
              formatted.is_organizer && /* @__PURE__ */ jsx("span", { className: "inline-flex items-center gap-0.5 rounded-full bg-amber-500/20 px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-amber-500 border border-amber-500/30", children: "Organizador" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] text-white/50", children: formatted.username })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 text-center text-xs", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-white/5 p-2 rounded-xl border border-white/10", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[9px] text-white/50 block font-bold", children: "Edad" }),
              /* @__PURE__ */ jsxs("span", { className: "font-extrabold text-white", children: [
                formatted.age,
                " años"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white/5 p-2 rounded-xl border border-white/10", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[9px] text-white/50 block font-bold", children: "Género" }),
              /* @__PURE__ */ jsx("span", { className: "font-extrabold text-white truncate block", children: formatted.gender })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white/5 p-2 rounded-xl border border-white/10", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[9px] text-white/50 block font-bold", children: "Ubicación" }),
              /* @__PURE__ */ jsx("span", { className: "font-extrabold text-white truncate block", title: formatted.location, children: formatted.location })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[9px] text-white/50 font-bold uppercase tracking-wider block", children: "Sobre mí" }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs leading-relaxed text-white/80 bg-white/5 p-3 rounded-xl border border-white/5 italic", children: [
              '"',
              formatted.bio,
              '"'
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[9px] text-white/50 font-bold uppercase tracking-wider block", children: "Deportes Favoritos" }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: formatted.sports.map((sport) => /* @__PURE__ */ jsx("span", { className: "rounded-full bg-primary/15 border border-primary/25 px-2.5 py-0.5 text-[9px] font-bold text-primary", children: sport }, sport)) })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setSelectedUserProfile(null),
              className: "w-full rounded-2xl bg-muted py-3 text-xs font-black uppercase tracking-wider text-muted-foreground shadow-sm hover:bg-muted/80 transition-all mt-2 cursor-pointer",
              children: "Cerrar Perfil"
            }
          )
        ] })
      ] }) });
    })()
  ] });
}
const getFormattedProfile = (p) => {
  if (!p) return null;
  const username = p.username || "Usuario";
  let charCodeSum = 0;
  for (let i = 0; i < username.length; i++) {
    charCodeSum += username.charCodeAt(i);
  }
  const age = p.age || 20 + charCodeSum % 15;
  const locations = ["Chacao", "Las Mercedes", "Altamira", "El Hatillo", "La Castellana", "Los Palos Grandes"];
  const location = p.location || locations[charCodeSum % locations.length];
  const sportsPool = ["Running", "Senderismo", "Pádel", "Tenis", "Vóleibol"];
  const sportsCount = 1 + charCodeSum % 3;
  const sports2 = p.preferred_sports || [];
  if (sports2.length === 0) {
    for (let i = 0; i < sportsCount; i++) {
      const sport = sportsPool[(charCodeSum + i) % sportsPool.length];
      if (!sports2.includes(sport)) {
        sports2.push(sport);
      }
    }
  }
  const emojis = ["🏃‍♂️", "🎯", "🥊", "🏄", "🧗‍♀️", "🛹", "🪼", "🪨", "🐾", "🐺"];
  const emoji = emojis[charCodeSum % emojis.length];
  const gradients = [
    "from-pink-500 to-rose-400",
    "from-emerald-500 to-teal-400",
    "from-blue-500 to-cyan-400",
    "from-purple-500 to-indigo-400",
    "from-amber-500 to-orange-400",
    "from-sky-500 to-blue-600",
    "from-orange-400 to-red-500"
  ];
  const gradient = gradients[charCodeSum % gradients.length];
  const bios = [
    "¡Me encanta el deporte y conocer gente nueva para entrenar en Caracas!",
    "Siempre activo para jugar un partido de pádel o tenis.",
    "Subo al Ávila todos los fines de semana. ¡Acompáñame!",
    "Running y entrenamiento funcional. Busco motivar y que me motiven.",
    "Jugador recreativo de vóleibol y fútbol. Buena vibra."
  ];
  const bio = p.description || bios[charCodeSum % bios.length];
  const name = username.includes("@") ? username.split("@")[0].split(".").map((n) => n.charAt(0).toUpperCase() + n.slice(1)).join(" ") : username;
  return {
    name,
    username,
    age,
    gender: p.gender || (charCodeSum % 2 === 0 ? "Masculino" : "Femenino"),
    location,
    bio,
    sports: sports2,
    emoji,
    gradient,
    rating: p.rating || 4.8,
    avatar_url: p.avatar_url,
    is_premium: p.is_premium || false,
    is_organizer: p.is_organizer || false
  };
};
const hikingTrail = "/assets/hiking-trail-BbQuy3Lk.jpg";
const SPORT_NAMES = {
  1: "Fútbol",
  2: "Tenis",
  3: "Golf",
  4: "Pádel",
  5: "Senderismo",
  6: "Running",
  7: "Vóleibol"
};
const SPORT_EMOJIS = {
  1: "⚽",
  2: "🎾",
  3: "⛳",
  4: "🏓",
  5: "🥾",
  6: "🏃",
  7: "🏐"
};
const getSportImage = (sportId) => {
  if (sportId === 1) return footballField;
  if (sportId === 2) return tennisCourt;
  if (sportId === 3) return golfCourse;
  if (sportId === 4) return padelCourt;
  if (sportId === 5) return hikingTrail;
  return runningTrail;
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
    image: getSportImage(row.sport_id),
    distanceKm: 2.5,
    joined: row.joined ?? 1,
    spots: row.max_capacity || 10,
    price: 0,
    zone: "Caracas"
  };
}
function MySportsScreen({ onSelectEvent, onNavigateToProfile }) {
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
      /* @__PURE__ */ jsx(UserAvatar, { size: "md", className: "cursor-pointer", onClick: onNavigateToProfile })
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
function FriendsScreen({
  onNavigateToProfile,
  onSelectEvent
}) {
  const { user, addXp, incrementCarisma } = useCurrentUser();
  const [activeSubTab, setActiveSubTab] = useState("tinder");
  const [searchQuery, setSearchQuery] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [friends, setFriends] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchProgress, setMatchProgress] = useState(null);
  const [activeRequestUser, setActiveRequestUser] = useState(null);
  const [acceptedMatchUser, setAcceptedMatchUser] = useState(null);
  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return;
      try {
        setLoadingProfiles(true);
        const { data: dbProfiles, error: profilesError } = await supabase.from("profiles").select("*");
        if (profilesError) throw profilesError;
        const { data: requestsData, error: requestsError } = await supabase.from("friend_requests").select("*").or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);
        if (requestsError && requestsError.code !== "42P01") {
          console.error("Error fetching requests", requestsError);
        }
        const requests = requestsData || [];
        const myFriends = [];
        const myReceivedReqs = [];
        const existingRelations = /* @__PURE__ */ new Set();
        requests.forEach((req) => {
          const otherUserId = req.sender_id === user.id ? req.receiver_id : req.sender_id;
          existingRelations.add(otherUserId);
          const profile = dbProfiles?.find((p) => p.id === otherUserId);
          if (!profile) return;
          const mappedProfile = mapProfile(profile, req.id);
          if (req.status === "accepted") {
            myFriends.push(mappedProfile);
          } else if (req.status === "pending" && req.receiver_id === user.id) {
            myReceivedReqs.push(mappedProfile);
          }
        });
        setFriends(myFriends);
        setReceivedRequests(myReceivedReqs);
        const candidatesFiltered = (dbProfiles || []).filter((p) => p.id !== user.id && !existingRelations.has(p.id)).map((p) => mapProfile(p));
        setCandidates(candidatesFiltered);
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoadingProfiles(false);
      }
    }
    if (user) {
      fetchData();
      const channel = supabase.channel("public:friend_requests").on("postgres_changes", { event: "*", schema: "public", table: "friend_requests" }, () => {
        fetchData();
      }).subscribe();
      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      setLoadingProfiles(false);
    }
  }, [user]);
  function mapProfile(p, requestId) {
    const idHash = p.id ? p.id.split("-").join("") : p.username;
    let charCodeSum = 0;
    for (let i = 0; i < idHash.length; i++) {
      charCodeSum += idHash.charCodeAt(i);
    }
    const emojis = ["🏃‍♂️", "🎯", "🥊", "🏄", "🧗‍♀️", "🛹", "🪼", "🪨", "🐾", "🐺"];
    const emoji = emojis[charCodeSum % emojis.length];
    const gradients = [
      "from-pink-500 to-rose-400",
      "from-emerald-500 to-teal-400",
      "from-blue-500 to-cyan-400",
      "from-purple-500 to-indigo-400",
      "from-amber-500 to-orange-400",
      "from-sky-500 to-blue-600",
      "from-orange-400 to-red-500"
    ];
    const gradient = gradients[charCodeSum % gradients.length];
    let name = p.full_name || "";
    if (!name) {
      if (p.username && p.username.includes("@")) {
        name = p.username.split("@")[0].split(".").map((n) => n.charAt(0).toUpperCase() + n.slice(1)).join(" ");
      } else if (p.username) {
        name = p.username;
      }
    }
    return {
      id: p.id,
      name: name || "Deportista",
      username: p.username,
      age: p.age || "?",
      location: p.location || "Ubicación desconocida",
      bio: p.description || "Sin descripción",
      sports: p.preferred_sports || [],
      avatar_url: p.avatar_url || null,
      emoji,
      gradient,
      request_id: requestId
    };
  }
  const userSports = user?.user_metadata?.preferred_sports || [];
  const getCompatibilityScore = (candidateSports) => {
    if (userSports.length === 0 || candidateSports.length === 0) {
      return 50;
    }
    const common = candidateSports.filter((s) => userSports.includes(s)).length;
    const score = Math.round(50 + common / Math.max(1, userSports.length) * 48);
    return Math.min(99, score);
  };
  const handleLike = async (candidate) => {
    if (!user?.id) return;
    setActiveRequestUser(candidate);
    setMatchProgress("sending");
    try {
      const { error } = await supabase.from("friend_requests").insert({
        sender_id: user.id,
        receiver_id: candidate.id,
        status: "pending"
      });
      if (error) {
        console.error("Error creating friend request:", error);
        setMatchProgress("error");
        return;
      }
      setCandidates(candidates.filter((c) => c.id !== candidate.id));
      setMatchProgress("sent");
    } catch (err) {
      console.error(err);
      setMatchProgress("error");
    }
  };
  const handleReject = () => {
    setCurrentIndex((prev) => prev + 1);
  };
  const handleAcceptRequest = async (request) => {
    if (!request.request_id) return;
    try {
      const { error } = await supabase.from("friend_requests").update({ status: "accepted" }).eq("id", request.request_id);
      if (error) throw error;
      setReceivedRequests(receivedRequests.filter((r) => r.id !== request.id));
      setFriends([request, ...friends]);
      await addXp(15, `¡Aceptaste a ${request.name} como amigo! 🤝`);
      if (incrementCarisma) {
        await incrementCarisma(1);
      }
      setAcceptedMatchUser(request);
      setTimeout(() => {
        setAcceptedMatchUser(null);
      }, 3e4);
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };
  const handleRejectRequest = async (request) => {
    if (!request.request_id) return;
    try {
      const { error } = await supabase.from("friend_requests").update({ status: "rejected" }).eq("id", request.request_id);
      if (error) throw error;
      setReceivedRequests(receivedRequests.filter((r) => r.id !== request.id));
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };
  const filteredFriends = friends.filter(
    (friend) => friend.name.toLowerCase().includes(searchQuery.toLowerCase()) || friend.location.toLowerCase().includes(searchQuery.toLowerCase()) || friend.sports.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  const activeCandidate = candidates[currentIndex];
  const renderAvatar = (friend, sizeClass = "h-11 w-11 text-xl") => {
    if (friend.avatar_url) {
      return /* @__PURE__ */ jsx(
        "img",
        {
          src: friend.avatar_url,
          alt: friend.name,
          className: `${sizeClass} shrink-0 rounded-full object-cover shadow-soft border-2 border-white/10`
        }
      );
    }
    return /* @__PURE__ */ jsx("div", { className: `${sizeClass} shrink-0 rounded-full bg-gradient-to-tr ${friend.gradient} grid place-items-center shadow-soft`, children: friend.emoji });
  };
  return /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col bg-background relative overflow-hidden pb-24", children: [
    matchProgress && activeRequestUser && /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-6 text-center animate-in fade-in duration-300", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 pointer-events-none", style: { background: "radial-gradient(circle at 50% 40%, rgba(16,185,129,0.15) 0%, transparent 70%)" } }),
      matchProgress === "sending" && /* @__PURE__ */ jsxs("div", { className: "space-y-6 max-w-sm flex flex-col items-center animate-in zoom-in-95 duration-300 relative z-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative flex items-center justify-center h-24 w-24", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-full bg-primary/20 animate-ping duration-1000" }),
          /* @__PURE__ */ jsx("div", { className: "h-16 w-16 rounded-full bg-primary/10 border border-primary/30 text-primary grid place-items-center animate-pulse", children: /* @__PURE__ */ jsx(Heart, { size: 32, className: "fill-current text-primary animate-bounce" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("span", { className: "inline-flex rounded-full bg-primary/20 px-3.5 py-1 text-[10px] font-black uppercase tracking-widest text-primary border border-primary/20", children: "Enviando solicitud..." }),
          /* @__PURE__ */ jsxs("h3", { className: "text-xl font-black text-white", children: [
            "Conectando con ",
            activeRequestUser.name
          ] })
        ] })
      ] }),
      matchProgress === "sent" && /* @__PURE__ */ jsxs("div", { className: "space-y-6 max-w-sm flex flex-col items-center animate-in zoom-in-95 duration-500 relative z-10", children: [
        /* @__PURE__ */ jsx("span", { className: "inline-flex rounded-full bg-emerald-500/25 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-emerald-400 border border-emerald-500/30 animate-pulse", children: "¡SOLICITUD ENVIADA! 🤝" }),
        /* @__PURE__ */ jsx("div", { className: "grid h-24 w-24 place-items-center rounded-full bg-emerald-500 text-white shadow-pop ring-8 ring-emerald-500/20", children: /* @__PURE__ */ jsx(CheckCircle2, { size: 48, strokeWidth: 2.5 }) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl font-black text-white tracking-tight drop-shadow-md", children: "¡Enviado!" }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-white/80 px-4 leading-relaxed", children: [
            "Has enviado una solicitud de Match a ",
            activeRequestUser.name,
            ". Ahora debes esperar a que la apruebe para aparecer en tu lista de amigos."
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-8 py-6 relative", children: [
          /* @__PURE__ */ jsx("div", { className: "relative h-20 w-20 rounded-full border-4 border-primary bg-secondary grid place-items-center text-4xl shadow-pop animate-in slide-in-from-left duration-500 overflow-hidden", children: user?.user_metadata?.avatar_url ? /* @__PURE__ */ jsx("img", { src: user.user_metadata.avatar_url, className: "w-full h-full object-cover" }) : (user?.user_metadata?.full_name || "U").substring(0, 2).toUpperCase() }),
          /* @__PURE__ */ jsx("div", { className: "absolute left-1/2 -translate-x-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-secondary font-black shadow-pop text-lg animate-bounce", children: "⚔️" }),
          /* @__PURE__ */ jsx("div", { className: "relative h-20 w-20 shadow-pop animate-in slide-in-from-right duration-500", children: renderAvatar(activeRequestUser, "h-20 w-20 text-4xl") })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              setMatchProgress(null);
              setActiveRequestUser(null);
              setCurrentIndex((prev) => prev + 1);
            },
            className: "w-full rounded-2xl gradient-primary py-3.5 text-xs font-black uppercase tracking-wider text-secondary shadow-pop transition-all active:scale-95 mt-4 cursor-pointer",
            children: "¡Entendido!"
          }
        )
      ] }),
      matchProgress === "error" && /* @__PURE__ */ jsxs("div", { className: "space-y-6 max-w-sm flex flex-col items-center animate-in zoom-in-95 duration-500 relative z-10", children: [
        /* @__PURE__ */ jsx("span", { className: "inline-flex rounded-full bg-red-500/20 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-red-500 border border-red-500/30", children: "ERROR 💔" }),
        /* @__PURE__ */ jsx("h2", { className: "text-3xl font-black text-white tracking-tight", children: "Hubo un problema" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-white/80 leading-relaxed px-6 bg-white/5 p-4 rounded-2xl border border-white/5", children: "No pudimos enviar tu solicitud. Verifica tu conexión o asegúrate de haber creado la tabla de friend_requests." }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              setMatchProgress(null);
              setActiveRequestUser(null);
            },
            className: "w-full rounded-2xl bg-red-500 hover:bg-red-600 text-white py-3.5 text-xs font-black uppercase tracking-wider shadow-pop transition-all active:scale-95 cursor-pointer",
            children: "Cerrar"
          }
        )
      ] })
    ] }),
    acceptedMatchUser && /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-6 text-center animate-in fade-in duration-300 backdrop-blur-sm", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 sunburst-rays opacity-20 pointer-events-none" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6 max-w-sm flex flex-col items-center animate-in zoom-in-95 duration-500", children: [
        /* @__PURE__ */ jsx("span", { className: "inline-flex rounded-full bg-emerald-500/25 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-emerald-400 border border-emerald-500/30 animate-pulse", children: "¡NUEVO MATCH! 🤝" }),
        /* @__PURE__ */ jsx("h2", { className: "text-4xl font-black text-white tracking-tight drop-shadow-md", children: "¡SOLICITUD ACEPTADA!" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-white/80 px-4", children: [
          "¡Tú y ",
          acceptedMatchUser.name,
          " ahora son amigos! Han ganado +1 punto de Carisma."
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-8 py-8 relative", children: [
          /* @__PURE__ */ jsx("div", { className: "relative h-24 w-24 rounded-full border-4 border-primary bg-secondary grid place-items-center text-5xl shadow-pop animate-in slide-in-from-left duration-500 overflow-hidden", children: user?.user_metadata?.avatar_url ? /* @__PURE__ */ jsx("img", { src: user.user_metadata.avatar_url, className: "w-full h-full object-cover" }) : (user?.user_metadata?.full_name || "U").substring(0, 2).toUpperCase() }),
          /* @__PURE__ */ jsx("div", { className: "absolute left-1/2 -translate-x-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-secondary font-black shadow-pop text-2xl animate-bounce", children: /* @__PURE__ */ jsx(Heart, { className: "fill-current", size: 24 }) }),
          /* @__PURE__ */ jsx("div", { className: "relative h-24 w-24 shadow-pop animate-in slide-in-from-right duration-500", children: renderAvatar(acceptedMatchUser, "h-24 w-24 text-5xl") })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setAcceptedMatchUser(null),
            className: "w-full rounded-2xl gradient-primary py-3.5 text-xs font-black uppercase tracking-wider text-secondary shadow-pop transition-all active:scale-95 mt-4 cursor-pointer",
            children: "Cerrar"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between px-5 pb-3 pt-12", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-secondary", children: "Amigos" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Conecta con jugadores afines" })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onNavigateToProfile,
          className: "h-10 w-10 rounded-full bg-card shadow-soft border border-border grid place-items-center text-secondary transition-transform active:scale-95",
          children: /* @__PURE__ */ jsx(Users, { size: 18 })
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "px-5 pb-3 pt-1", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1 rounded-full bg-muted p-1 border border-border/40", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setActiveSubTab("tinder"),
          className: `flex-1 rounded-full py-2 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${activeSubTab === "tinder" ? "bg-card text-secondary shadow-soft border border-border/20" : "text-muted-foreground"}`,
          children: [
            /* @__PURE__ */ jsx(Flame, { size: 14, className: activeSubTab === "tinder" ? "text-primary" : "" }),
            "Para ti"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setActiveSubTab("friends"),
          className: `flex-1 rounded-full py-2 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${activeSubTab === "friends" ? "bg-card text-secondary shadow-soft border border-border/20" : "text-muted-foreground"}`,
          children: [
            /* @__PURE__ */ jsx(UserCheck, { size: 14, className: activeSubTab === "friends" ? "text-primary" : "" }),
            "Mis amigos (",
            friends.length,
            ")"
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto px-5 pt-3", children: activeSubTab === "tinder" ? /* @__PURE__ */ jsx("div", { className: "h-full flex flex-col items-center justify-center pb-4 relative", children: loadingProfiles ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center gap-3 py-12", children: [
      /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground font-bold uppercase tracking-wider animate-pulse", children: "Cargando perfiles reales..." })
    ] }) : activeCandidate ? /* @__PURE__ */ jsxs("div", { className: "w-full max-w-sm h-full max-h-[460px] flex flex-col justify-between rounded-3xl bg-card border border-border shadow-pop relative overflow-hidden animate-in zoom-in-95 duration-300", children: [
      /* @__PURE__ */ jsxs("div", { className: `h-40 shrink-0 flex items-center justify-center relative bg-gradient-to-tr ${activeCandidate.gradient}`, children: [
        activeCandidate.avatar_url ? /* @__PURE__ */ jsx("img", { src: activeCandidate.avatar_url, className: "absolute inset-0 w-full h-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: "text-6xl drop-shadow-md select-none", children: activeCandidate.emoji }),
        /* @__PURE__ */ jsxs("div", { className: "absolute top-4 right-4 flex items-center gap-1 rounded-full bg-black/40 backdrop-blur-md px-3 py-1 text-[10px] font-black text-white border border-white/10 shadow-pop", children: [
          /* @__PURE__ */ jsx(Sparkles, { size: 10, className: "text-primary animate-pulse" }),
          /* @__PURE__ */ jsxs("span", { children: [
            getCompatibilityScore(activeCandidate.sports),
            "% Compatible"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "absolute bottom-4 left-4 flex items-center gap-1 rounded-full bg-card/90 px-3 py-1.5 text-[10px] font-bold text-secondary border border-border shadow-soft", children: [
          /* @__PURE__ */ jsx(MapPin, { size: 10, className: "text-primary" }),
          /* @__PURE__ */ jsx("span", { children: activeCandidate.location })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 p-5 space-y-3.5 flex flex-col justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-2", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-black text-secondary", children: activeCandidate.name }),
            /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold text-muted-foreground", children: [
              activeCandidate.age,
              " años"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground leading-relaxed line-clamp-3", children: [
            '"',
            activeCandidate.bio,
            '"'
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5 border-t border-dashed border-border/80 pt-3", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground font-black uppercase tracking-wider block", children: "Deportes" }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: activeCandidate.sports.map((sport) => /* @__PURE__ */ jsx(SportBadge, { sport }, sport)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-4 border-t border-border/60 bg-muted/20 flex justify-center gap-6", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleReject,
            className: "grid h-12 w-12 place-items-center rounded-full bg-card border border-border text-muted-foreground hover:text-rose-500 hover:border-rose-200 active:scale-90 transition-all shadow-soft",
            title: "Descartar",
            children: /* @__PURE__ */ jsx(X, { size: 20, strokeWidth: 2.5 })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleLike(activeCandidate),
            className: "grid h-12 w-12 place-items-center rounded-full gradient-primary text-secondary hover:shadow-lg active:scale-90 transition-all shadow-pop",
            title: "¡Hacer Match!",
            children: /* @__PURE__ */ jsx(Heart, { size: 20, strokeWidth: 2.5, className: "fill-current" })
          }
        )
      ] })
    ] }) : /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-dashed border-border bg-card p-8 text-center space-y-4 max-w-sm w-full py-12", children: [
      /* @__PURE__ */ jsx("div", { className: "text-5xl", children: "⚔️" }),
      /* @__PURE__ */ jsx("h3", { className: "text-base font-black text-secondary", children: "¡Eso es todo por hoy!" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "Has revisado todos los candidatos cercanos en Caracas. Configura más deportes favoritos en tu perfil para encontrar nuevos partidos y amigos." }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setCurrentIndex(0),
          className: "rounded-2xl bg-secondary hover:bg-secondary/90 text-primary py-3 px-6 text-xs font-black uppercase tracking-wider transition-all active:scale-95 shadow-soft border border-primary/20",
          children: "Reiniciar Lista 🔄"
        }
      )
    ] }) }) : /* @__PURE__ */ jsxs("div", { className: "space-y-5 pb-8", children: [
      receivedRequests.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx(UserPlus, { size: 14, className: "text-primary" }),
          " Solicitudes Recibidas"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-2", children: receivedRequests.map((req) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-card p-3 shadow-soft flex items-center justify-between gap-3 animate-in slide-in-from-top duration-300", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
            renderAvatar(req, "h-11 w-11 text-xl"),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-1.5", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-secondary truncate", children: req.name }),
                /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
                  req.age,
                  " años"
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "text-[10px] text-primary font-extrabold", children: req.location }),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground truncate max-w-[160px]", children: req.bio })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5 shrink-0", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleRejectRequest(req),
                className: "grid h-8 w-8 place-items-center rounded-xl bg-muted/60 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-colors",
                title: "Rechazar",
                children: /* @__PURE__ */ jsx(UserX, { size: 15 })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleAcceptRequest(req),
                className: "grid h-8 w-8 place-items-center rounded-xl gradient-primary text-secondary shadow-sm",
                title: "Aceptar Match",
                children: /* @__PURE__ */ jsx(UserCheck, { size: 15 })
              }
            )
          ] })
        ] }, req.id)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx(UserCheck, { size: 14, className: "text-primary" }),
            " Mis Amigos Guardados"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold text-muted-foreground", children: [
            filteredFriends.length,
            " amigos"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              placeholder: "Buscar amigo por nombre, deporte...",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              className: "w-full rounded-2xl border border-border bg-card pl-10 pr-4 py-2.5 text-xs text-secondary outline-none transition-colors focus:border-primary"
            }
          ),
          /* @__PURE__ */ jsx(Search, { size: 14, className: "absolute left-3.5 top-3.5 text-muted-foreground" })
        ] }),
        filteredFriends.length === 0 ? /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-dashed border-border bg-card/40 p-8 text-center text-xs text-muted-foreground", children: searchQuery ? "No se encontraron amigos con ese criterio" : "Aún no tienes amigos agregados. ¡Busca conexiones en la pestaña 'Para ti'!" }) : /* @__PURE__ */ jsx("div", { className: "space-y-2", children: filteredFriends.map((friend) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-card p-3 shadow-soft flex items-center justify-between gap-3 hover:border-primary/20 transition-all", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
            renderAvatar(friend, "h-11 w-11 text-xl"),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-1.5", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-secondary truncate", children: friend.name }),
                /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
                  friend.age,
                  " años"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-muted-foreground flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(MapPin, { size: 9, className: "text-primary" }),
                /* @__PURE__ */ jsx("span", { children: friend.location })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1 mt-1", children: friend.sports.map((s) => /* @__PURE__ */ jsx("span", { className: "rounded-full bg-muted px-2 py-0.5 text-[8px] font-bold text-muted-foreground border border-border/50", children: s }, s)) })
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "grid h-9 w-9 place-items-center rounded-full bg-secondary/10 text-secondary hover:bg-secondary/20 active:scale-95 transition-all shadow-soft shrink-0 border border-secondary/10",
              title: "Enviar Mensaje",
              children: /* @__PURE__ */ jsx(MessageSquare, { size: 14, className: "text-primary" })
            }
          )
        ] }, friend.id)) })
      ] })
    ] }) })
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
    { id: "events", label: "Eventos", icon: CalendarCheck },
    { id: "map", label: "Explorar", icon: Map$1 },
    { id: "friends", label: "Amigos", icon: Users },
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
  return /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 bottom-0 z-30 pointer-events-none flex justify-center pb-0 lg:pb-6", children: /* @__PURE__ */ jsx("nav", { className: "pointer-events-auto w-full lg:max-w-md lg:rounded-2xl glass border-t lg:border border-border shadow-pop", children: /* @__PURE__ */ jsx("div", { className: "flex items-end px-2 pb-[calc(8px+env(safe-area-inset-bottom))] lg:pb-2 pt-1 lg:pt-2", children: items.map((it) => /* @__PURE__ */ jsx(Btn, { id: it.id, label: it.label, Icon: it.icon }, it.id)) }) }) });
}
function Index() {
  return /* @__PURE__ */ jsx(UserProvider, { children: /* @__PURE__ */ jsx(AppContent, {}) });
}
function AppContent() {
  const {
    isLoading
  } = useCurrentUser();
  const [appState, setAppState] = useState("checking");
  const [authMode, setAuthMode] = useState("login");
  const [screen, setScreen] = useState("events");
  const [selected, setSelected] = useState(null);
  const [selectedCancha, setSelectedCancha] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(() => {
      if (mounted) {
        setAppState("app");
      }
    });
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAppState((prev) => {
        if (prev === "checking") return prev;
        if (session) return "app";
        if (prev !== "auth") return "app";
        return prev;
      });
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);
  const openAuth = (mode = "login") => {
    setAuthMode(mode);
    setAppState("auth");
  };
  const openDetail = (e) => {
    setSelected(e);
    setScreen("detail");
  };
  const renderScreen = () => {
    if (appState === "auth") {
      return /* @__PURE__ */ jsx(AuthScreen, { initialMode: authMode, onSuccess: () => setAppState("app"), onClose: () => setAppState("app") });
    }
    if (screen === "detail" && selected) return /* @__PURE__ */ jsx(EventDetailScreen, { event: selected, onBack: () => setScreen("events"), userLocation, onOpenAuth: () => openAuth("login") });
    if (screen === "events") return /* @__PURE__ */ jsx(MyEventsScreen, { onSelect: openDetail, onNavigateToProfile: () => setScreen("profile") });
    if (screen === "sports") return /* @__PURE__ */ jsx(MySportsScreen, { onSelectEvent: openDetail, onNavigateToProfile: () => setScreen("profile") });
    if (screen === "friends") return /* @__PURE__ */ jsx(FriendsScreen, { onNavigateToProfile: () => setScreen("profile"), onSelectEvent: openDetail });
    if (screen === "editProfile") return /* @__PURE__ */ jsx(EditProfileScreen, { onBack: () => setScreen("profile") });
    if (screen === "profile") return /* @__PURE__ */ jsx(ProfileScreen, { onEdit: () => setScreen("editProfile"), onSelectEvent: openDetail, onOpenAuth: () => openAuth("login"), onOpenRegister: () => openAuth("register") });
    if (screen === "comments" && selectedCancha) return /* @__PURE__ */ jsx(CanchaCommentsScreen, { cancha: selectedCancha, onBack: () => setScreen("map"), onOpenAuth: () => openAuth("login") });
    return /* @__PURE__ */ jsx(MapScreen, { onSelect: openDetail, userLocation, setUserLocation, onNavigateToProfile: () => setScreen("profile"), onNavigateToComments: (cancha) => {
      setSelectedCancha(cancha);
      setScreen("comments");
    } });
  };
  if (appState === "checking" || appState === "app" && isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "flex h-[100dvh] w-full items-center justify-center bg-background", children: /* @__PURE__ */ jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" }) });
  }
  return /* @__PURE__ */ jsx("main", { className: "fixed inset-0 w-full h-[100dvh] flex flex-col bg-background lg:bg-muted/30 overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto overscroll-none pt-[env(safe-area-inset-top)] relative flex mx-auto w-full lg:max-w-7xl lg:shadow-2xl lg:bg-background", children: [
    appState === "auth" && /* @__PURE__ */ jsxs("aside", { className: "relative hidden flex-1 flex-col justify-between overflow-hidden bg-secondary p-12 text-[#32CD32] lg:flex", children: [
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
    /* @__PURE__ */ jsx("section", { className: `relative flex min-h-[100dvh] w-full flex-col overflow-hidden bg-background ${appState === "auth" ? "lg:max-w-[520px] lg:border-l lg:border-primary-foreground/10 lg:shadow-pop" : "flex-1 lg:border-x lg:border-border/50"}`, children: /* @__PURE__ */ jsxs("div", { className: "relative h-[100dvh] w-full overflow-hidden", children: [
      renderScreen(),
      appState !== "auth" && /* @__PURE__ */ jsx(RpgNotificationManager, {}),
      appState !== "auth" && /* @__PURE__ */ jsx(EventNotificationBanner, {}),
      appState !== "auth" && screen !== "detail" && screen !== "editProfile" && screen !== "comments" && /* @__PURE__ */ jsx(BottomNav, { current: screen, onChange: setScreen })
    ] }) })
  ] }) });
}
function RpgNotificationManager() {
  const {
    xpNotification,
    clearNotification
  } = useCurrentUser();
  const [chestState, setChestState] = useState("closed");
  useEffect(() => {
    if (xpNotification) {
      setChestState("closed");
    }
  }, [xpNotification]);
  const {
    xp,
    reason,
    isLevelUp,
    newLevel,
    newCoupon
  } = xpNotification || {};
  useEffect(() => {
    if (xpNotification && !xpNotification.isLevelUp && !xpNotification.newCoupon) {
      const timer = setTimeout(() => {
        clearNotification();
      }, 6500);
      return () => clearTimeout(timer);
    }
  }, [xpNotification, clearNotification]);
  if (!xpNotification) return null;
  if (isLevelUp) {
    return /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 px-6 py-4 animate-in fade-in duration-300", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 sunburst-rays opacity-25 pointer-events-none" }),
      /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-sm rounded-3xl bg-secondary border border-primary/30 p-6 text-center shadow-2xl animate-in zoom-in-95 duration-500 flex flex-col items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute -top-12 flex h-24 w-24 items-center justify-center rounded-full bg-primary text-secondary neon-border-legendary animate-bounce", children: /* @__PURE__ */ jsx(Sparkles, { size: 48, className: "animate-spin duration-3000" }) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-12 space-y-4 w-full", children: [
          /* @__PURE__ */ jsx("span", { className: "inline-flex rounded-full bg-primary/20 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-primary animate-pulse border border-primary/30", children: "¡Hazaña Lograda!" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-3xl font-black tracking-tight text-white drop-shadow", children: "¡SUBISTE DE NIVEL!" }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm font-bold text-primary", children: [
              "Has alcanzado el Nivel ",
              newLevel,
              " 🏆"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-secondary-foreground/85 leading-relaxed bg-white/5 p-3.5 rounded-2xl border border-white/5", children: [
            '"',
            reason,
            '" ',
            /* @__PURE__ */ jsx("br", {}),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] text-white/50 block mt-1", children: "¡Tus atributos físicos y mágicos STR, WIS, CON y CHA han aumentado!" })
          ] }),
          newCoupon && /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-dashed border-amber-500/40 bg-amber-500/5 p-3.5 space-y-2 animate-in slide-in-from-bottom duration-500", children: [
            /* @__PURE__ */ jsx("span", { className: "inline-flex rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-amber-500 border border-amber-500/30", children: "¡Recompensa de Nivel Desbloqueada! 🎁" }),
            /* @__PURE__ */ jsx("h4", { className: "text-xs font-black text-white", children: newCoupon.title }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] text-amber-500 font-extrabold", children: newCoupon.discount }),
            /* @__PURE__ */ jsxs("div", { className: "font-mono text-[9px] font-bold text-white/70 bg-white/5 py-1 rounded", children: [
              "Código: ",
              newCoupon.code
            ] })
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: clearNotification, className: "w-full rounded-2xl gradient-primary py-3.5 text-xs font-black uppercase tracking-wider text-secondary shadow-pop transition-all active:scale-95 hover:shadow-lg", children: "Cerrar y Continuar Aventura ⚔️" })
        ] })
      ] })
    ] });
  }
  if (newCoupon) {
    return /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 px-6 py-4 animate-in fade-in duration-300", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 sunburst-rays opacity-25 pointer-events-none" }),
      /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-sm rounded-3xl bg-secondary border border-primary/20 p-6 text-center shadow-2xl animate-in zoom-in-95 duration-500 flex flex-col items-center", children: [
        chestState === "closed" && /* @__PURE__ */ jsxs("div", { className: "space-y-6 py-6 w-full flex flex-col items-center", children: [
          /* @__PURE__ */ jsx("span", { className: "inline-flex rounded-full bg-amber-500/25 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-amber-500 border border-amber-500/20 animate-pulse", children: "¡FIDELIDAD RECOMPENSADA! 📜" }),
          /* @__PURE__ */ jsx("div", { className: "text-7xl chest-shake cursor-pointer", children: "🎁" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-black text-white", children: "¡Has ganado un Cofre del Tesoro!" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-secondary-foreground/75 px-4", children: "Por tu excelente fidelidad usando TeamMatch, has obtenido un cofre de recompensa." })
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: () => setChestState("opening"), className: "w-full rounded-2xl bg-amber-500 hover:bg-amber-600 text-secondary py-3.5 text-xs font-black uppercase tracking-wider shadow-pop transition-all active:scale-95", children: "Abrir Cofre 🔓" })
        ] }),
        chestState === "opening" && /* @__PURE__ */ jsxs("div", { className: "space-y-6 py-12 flex flex-col items-center justify-center w-full", children: [
          /* @__PURE__ */ jsx("div", { className: "text-7xl animate-ping opacity-75", children: "🌟" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-primary animate-pulse uppercase tracking-widest mt-4", children: "Desbloqueando magia..." }),
          (() => {
            setTimeout(() => setChestState("opened"), 1e3);
            return null;
          })()
        ] }),
        chestState === "opened" && /* @__PURE__ */ jsxs("div", { className: "space-y-5 w-full flex flex-col items-center chest-open-effect", children: [
          /* @__PURE__ */ jsx("span", { className: "inline-flex rounded-full bg-emerald-500/20 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-400 border border-emerald-500/20", children: "¡OBJETO OBTENIDO! 💎" }),
          /* @__PURE__ */ jsx("div", { className: "text-6xl animate-bounce", children: "📜" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5 w-full", children: [
            /* @__PURE__ */ jsx("h4", { className: "text-sm font-black text-white", children: newCoupon.title }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] text-secondary-foreground/80 leading-relaxed px-2", children: newCoupon.description }),
            /* @__PURE__ */ jsxs("div", { className: "mt-3 p-3 rounded-2xl bg-white/5 border border-white/5 space-y-2 w-full", children: [
              /* @__PURE__ */ jsx("div", { className: "text-base font-black text-primary", children: newCoupon.discount }),
              /* @__PURE__ */ jsxs("div", { className: "font-mono text-xs font-bold text-white/70 py-1 bg-white/5 rounded-xl select-all text-center", children: [
                "CÓDIGO: ",
                newCoupon.code
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: clearNotification, className: "w-full rounded-2xl gradient-primary py-3.5 text-xs font-black uppercase tracking-wider text-secondary shadow-pop transition-all active:scale-95", children: "Equipar en Inventario y Cerrar 💼" })
        ] })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "fixed bottom-24 left-1/2 -translate-x-1/2 z-[9999] w-[92%] max-w-[360px] rounded-2xl xp-toast-glass px-4 py-3.5 flex flex-col shadow-pop animate-in fade-in slide-in-from-bottom duration-500 overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "xp-toast-progress" }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/30 text-primary xp-pulse-icon", children: /* @__PURE__ */ jsx(Zap, { size: 18, className: "fill-current text-[#32CD32]" }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-1.5", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-[11px] font-black text-[#32CD32] tracking-wide uppercase drop-shadow-[0_0_6px_rgba(50,205,50,0.5)]", children: [
            "+",
            xp,
            " XP GANADO!"
          ] }),
          /* @__PURE__ */ jsx("span", { className: "text-[8px] text-white/50 font-bold uppercase tracking-wider", children: "¡Logro!" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-[11px] text-white/95 font-semibold truncate mt-0.5", title: reason, children: reason })
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: clearNotification, className: "grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors active:scale-95", "aria-label": "Cerrar notificación", children: /* @__PURE__ */ jsx(X, { size: 12 }) })
    ] })
  ] });
}
function EventNotificationBanner() {
  const {
    eventNotification,
    clearEventNotification
  } = useCurrentUser();
  if (!eventNotification) return null;
  const isAccepted = eventNotification.type === "accepted";
  return /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[99999] flex flex-col items-center justify-center space-y-6 bg-background/98 backdrop-blur-md px-6 text-center animate-in fade-in zoom-in duration-500", children: [
    /* @__PURE__ */ jsx("div", { className: `pointer-events-none absolute top-1/4 h-72 w-72 rounded-full blur-3xl opacity-20 ${isAccepted ? "bg-emerald-500" : "bg-red-500"}` }),
    /* @__PURE__ */ jsx("div", { className: `grid h-24 w-24 place-items-center rounded-full text-white shadow-pop ring-8 animate-bounce ${isAccepted ? "bg-emerald-500 ring-emerald-500/20" : "bg-red-500 ring-red-500/20"}`, children: isAccepted ? /* @__PURE__ */ jsx(CheckCircle2, { size: 48, strokeWidth: 2.5 }) : /* @__PURE__ */ jsx(XCircle, { size: 48, strokeWidth: 2.5 }) }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2 max-w-xs relative z-10", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-secondary", children: isAccepted ? "¡Has sido aceptado!" : "No has sido aceptado" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: isAccepted ? `Tu solicitud para unirte al partido "${eventNotification.eventTitle}" ha sido aprobada. ¡Prepárate para jugar!` : `Tu solicitud para unirte al partido "${eventNotification.eventTitle}" ha sido rechazada. El evento ha sido removido de tus deportes.` })
    ] }),
    /* @__PURE__ */ jsx("button", { onClick: clearEventNotification, className: `relative z-10 mt-4 min-w-[140px] rounded-2xl py-3.5 px-6 text-sm font-black text-white shadow-pop transition-all active:scale-95 ${isAccepted ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20" : "bg-red-500 hover:bg-red-600 shadow-red-500/20"}`, children: "Entendido" }),
    (() => {
      setTimeout(clearEventNotification, 8e3);
      return null;
    })()
  ] });
}
export {
  Index as component
};
