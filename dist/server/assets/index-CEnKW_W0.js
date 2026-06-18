import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect, createContext, useContext, useCallback, useMemo, Suspense, lazy } from "react";
import { createClient } from "@supabase/supabase-js";
import { MapPin, X, MessageSquare, ChevronRight, Crosshair, Users, Trophy, Zap, ArrowRight, CheckCircle2, ArrowLeft, Star, Calendar, Clock, Loader2, Check, UserPlus, Trash2, Palette, Sun, Moon, Sparkles, Globe, LogOut, Shield, Edit3, Settings, Award, BookOpen, Flame, Copy, Camera, Save, ShieldCheck, AlertCircle, Send, CalendarCheck, FileText, Plus, Heart, UserCheck, UserX, Search, User, Mail, Lock, EyeOff, Eye, Map as Map$1, XCircle } from "lucide-react";
const supabaseUrl = "https://aknwdkjzodhkhzxjvipu.supabase.co";
const supabaseAnonKey = "sb_publishable_wXXt4M1loO2NvsCC0nmM5A_1NJneITx";
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabase$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  supabase
}, Symbol.toStringTag, { value: "Module" }));
const ACHIEVEMENTS = [
  // BRONZE (12 achievements, 15 XP)
  {
    id: "primer_paso",
    title: "Primer Paso",
    description: "Inscríbete y participa en tu primer partido",
    icon: "👟",
    rarity: "bronze",
    xpReward: 15
  },
  {
    id: "gran_carisma",
    title: "Alma de la Pista",
    description: "Consigue al menos 3 puntos de carisma",
    icon: "🤝",
    rarity: "bronze",
    xpReward: 15
  },
  {
    id: "iniciado_uso",
    title: "Entrenamiento Diario",
    description: "Usa la aplicación durante 2 días",
    icon: "🏃‍♂️",
    rarity: "bronze",
    xpReward: 15
  },
  {
    id: "organizador_novato",
    title: "Organizador Novato",
    description: "Crea tu segundo partido en la plataforma",
    icon: "📢",
    rarity: "bronze",
    xpReward: 15
  },
  {
    id: "primer_contacto",
    title: "Primer Contacto",
    description: "Consigue tu primer punto de carisma",
    icon: "💬",
    rarity: "bronze",
    xpReward: 15
  },
  {
    id: "primer_nivel",
    title: "Paso Firme",
    description: "Alcanza el Nivel 2 de experiencia",
    icon: "🌱",
    rarity: "bronze",
    xpReward: 15
  },
  {
    id: "nivel_tres",
    title: "Aspirante Activo",
    description: "Alcanza el Nivel 3 de experiencia",
    icon: "⚡",
    rarity: "bronze",
    xpReward: 15
  },
  {
    id: "carta_presentacion",
    title: "Carta de Presentación",
    description: "Añade una descripción sobre ti en tu perfil",
    icon: "📝",
    rarity: "bronze",
    xpReward: 15
  },
  {
    id: "establecido",
    title: "Deportista Local",
    description: "Configura tu ubicación en tu perfil",
    icon: "📍",
    rarity: "bronze",
    xpReward: 15
  },
  {
    id: "multidisciplinario",
    title: "Multidisciplinario",
    description: "Selecciona al menos 3 deportes preferidos en tu perfil",
    icon: "🎾",
    rarity: "bronze",
    xpReward: 15
  },
  {
    id: "primer_ahorro",
    title: "Ahorrador RPG",
    description: "Canjea tu primer cupón en el cofre",
    icon: "💎",
    rarity: "bronze",
    xpReward: 15
  },
  {
    id: "espiritu_comunidad",
    title: "Espíritu de Comunidad",
    description: "Acepta a tu primer amigo",
    icon: "👋",
    rarity: "bronze",
    xpReward: 15
  },
  // SILVER (9 achievements, 25 XP)
  {
    id: "creador_leyendas",
    title: "Creador de Leyendas",
    description: "Crea y organiza tu primer evento deportivo",
    icon: "⚽",
    rarity: "silver",
    xpReward: 25
  },
  {
    id: "fidelidad_hierro",
    title: "Fidelidad de Hierro",
    description: "Registra 5 días de entrenamiento abriendo la app",
    icon: "📅",
    rarity: "silver",
    xpReward: 25
  },
  {
    id: "habito_saludable",
    title: "Hábito Saludable",
    description: "Usa la aplicación durante 10 días",
    icon: "🍎",
    rarity: "silver",
    xpReward: 25
  },
  {
    id: "miembro_equipo",
    title: "Miembro del Equipo",
    description: "Participa en 5 partidos en total",
    icon: "👕",
    rarity: "silver",
    xpReward: 25
  },
  {
    id: "popular",
    title: "Popular",
    description: "Consigue 5 puntos de carisma",
    icon: "🌟",
    rarity: "silver",
    xpReward: 25
  },
  {
    id: "maestro_match",
    title: "Maestro del Match",
    description: "Alcanza el Nivel 4 de experiencia",
    icon: "🎓",
    rarity: "silver",
    xpReward: 25
  },
  {
    id: "perfil_completo",
    title: "Identidad Revelada",
    description: "Completa todos los campos básicos de tu perfil (nombre, edad, género, descripción y ubicación)",
    icon: "🛡️",
    rarity: "silver",
    xpReward: 25
  },
  {
    id: "coleccionista_cupones",
    title: "Acumulador de Pergaminos",
    description: "Consigue al menos 3 cupones en tu inventario",
    icon: "📜",
    rarity: "silver",
    xpReward: 25
  },
  {
    id: "favorito_casa",
    title: "Favorito de la Casa",
    description: "Participa en tres partidos en una misma ubicación",
    icon: "🏠",
    rarity: "silver",
    xpReward: 25
  },
  // GOLD (10 achievements, 50 XP)
  {
    id: "viajero_deporte",
    title: "Deportista Consagrado",
    description: "Participa activamente en 3 partidos",
    icon: "🏆",
    rarity: "gold",
    xpReward: 50
  },
  {
    id: "nivel_heroe",
    title: "Leyenda de Caracas",
    description: "Alcanza el Nivel 5 de experiencia",
    icon: "👑",
    rarity: "gold",
    xpReward: 50
  },
  {
    id: "atleta_constante",
    title: "Atleta Constante",
    description: "Usa la aplicación durante 20 días",
    icon: "🔥",
    rarity: "gold",
    xpReward: 50
  },
  {
    id: "imparable",
    title: "Imparable",
    description: "Usa la aplicación durante 50 días",
    icon: "♾️",
    rarity: "gold",
    xpReward: 50
  },
  {
    id: "veterano_canchas",
    title: "Veterano de las Canchas",
    description: "Participa en 10 partidos en total",
    icon: "🏟️",
    rarity: "gold",
    xpReward: 50
  },
  {
    id: "estrella_liga",
    title: "Estrella de la Liga",
    description: "Participa en 20 partidos en total",
    icon: "🌠",
    rarity: "gold",
    xpReward: 50
  },
  {
    id: "lider_grupo",
    title: "Líder de Grupo",
    description: "Crea 5 partidos en la plataforma",
    icon: "📢",
    rarity: "gold",
    xpReward: 50
  },
  {
    id: "director_tecnico",
    title: "Director Técnico",
    description: "Crea 10 partidos en la plataforma",
    icon: "📋",
    rarity: "gold",
    xpReward: 50
  },
  {
    id: "idolo_masas",
    title: "Ídolo de Masas",
    description: "Consigue 10 puntos de carisma",
    icon: "🤩",
    rarity: "gold",
    xpReward: 50
  },
  {
    id: "semidios_deporte",
    title: "Semidiós del Deporte",
    description: "Alcanza el Nivel 10 de experiencia",
    icon: "🔱",
    rarity: "gold",
    xpReward: 50
  },
  // PLATINUM (1 achievement, 100 XP)
  {
    id: "maestro_teammatch",
    title: "Coleccionista de Trofeos",
    description: "Consigue todos los demás logros de la aplicación",
    icon: "🌌",
    rarity: "platinum",
    xpReward: 100
  }
];
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
  },
  unlockedAchievements: [],
  achievementNotification: null,
  clearAchievementNotification: () => {
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
function evaluateAchievements(currentUnlocked, stats) {
  const newlyUnlocked = [];
  const updatedUnlocked = [...currentUnlocked];
  for (const ach of ACHIEVEMENTS) {
    if (ach.id === "maestro_teammatch") continue;
    if (!updatedUnlocked.includes(ach.id)) {
      let met = false;
      switch (ach.id) {
        case "primer_paso":
          met = stats.joinedEventsCount >= 1;
          break;
        case "gran_carisma":
          met = stats.carisma >= 3;
          break;
        case "iniciado_uso":
          met = stats.useCount >= 2;
          break;
        case "organizador_novato":
          met = stats.createdEventsCount >= 2;
          break;
        case "primer_contacto":
          met = stats.carisma >= 1;
          break;
        case "primer_nivel":
          met = stats.level >= 2;
          break;
        case "nivel_tres":
          met = stats.level >= 3;
          break;
        case "carta_presentacion":
          met = !!stats.description && stats.description.trim().length > 0;
          break;
        case "establecido":
          met = !!stats.location && stats.location.trim().length > 0;
          break;
        case "multidisciplinario":
          met = stats.preferredSports && stats.preferredSports.length >= 3;
          break;
        case "primer_ahorro":
          met = stats.coupons && stats.coupons.some((c) => c.claimed === true);
          break;
        case "espiritu_comunidad":
          met = stats.carisma >= 1;
          break;
        case "creador_leyendas":
          met = stats.createdEventsCount >= 1;
          break;
        case "fidelidad_hierro":
          met = stats.useCount >= 5;
          break;
        case "habito_saludable":
          met = stats.useCount >= 10;
          break;
        case "miembro_equipo":
          met = stats.joinedEventsCount >= 5;
          break;
        case "popular":
          met = stats.carisma >= 5;
          break;
        case "maestro_match":
          met = stats.level >= 4;
          break;
        case "perfil_completo":
          met = !!stats.fullName && !!stats.age && !!stats.gender && !!stats.description && !!stats.location;
          break;
        case "coleccionista_cupones":
          met = stats.coupons && stats.coupons.length >= 3;
          break;
        case "favorito_casa":
          {
            const joinHistory = stats.xpHistory.filter((h) => h.type === "join");
            const locationsPool = ["chacao", "mercedes", "altamira", "hatillo", "castellana", "palos grandes"];
            met = locationsPool.some(
              (loc) => joinHistory.filter((h) => h.title.toLowerCase().includes(loc)).length >= 3
            );
          }
          break;
        case "viajero_deporte":
          met = stats.joinedEventsCount >= 3;
          break;
        case "nivel_heroe":
          met = stats.level >= 5;
          break;
        case "atleta_constante":
          met = stats.useCount >= 20;
          break;
        case "imparable":
          met = stats.useCount >= 50;
          break;
        case "veterano_canchas":
          met = stats.joinedEventsCount >= 10;
          break;
        case "estrella_liga":
          met = stats.joinedEventsCount >= 20;
          break;
        case "lider_grupo":
          met = stats.createdEventsCount >= 5;
          break;
        case "director_tecnico":
          met = stats.createdEventsCount >= 10;
          break;
        case "idolo_masas":
          met = stats.carisma >= 10;
          break;
        case "semidios_deporte":
          met = stats.level >= 10;
          break;
      }
      if (met) {
        updatedUnlocked.push(ach.id);
        newlyUnlocked.push(ach);
      }
    }
  }
  if (!updatedUnlocked.includes("maestro_teammatch")) {
    const nonPlatinumCount = ACHIEVEMENTS.filter((a) => a.id !== "maestro_teammatch").length;
    const unlockedNonPlatinumCount = updatedUnlocked.filter((id) => id !== "maestro_teammatch").length;
    if (unlockedNonPlatinumCount === nonPlatinumCount) {
      const platAch = ACHIEVEMENTS.find((a) => a.id === "maestro_teammatch");
      if (platAch) {
        updatedUnlocked.push("maestro_teammatch");
        newlyUnlocked.push(platAch);
      }
    }
  }
  return { newlyUnlocked, updatedUnlocked };
}
function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [xpNotification, setXpNotification] = useState(null);
  const [eventNotification, setEventNotification] = useState(null);
  const [achievementQueue, setAchievementQueue] = useState([]);
  const [achievementNotification, setAchievementNotification] = useState(null);
  const addXpRef = useRef(async () => {
  });
  const previousStatuses = useRef({});
  const isFirstFetch = useRef(true);
  const [isLoading, setIsLoading] = useState(true);
  const clearAchievementNotification = () => setAchievementNotification(null);
  useEffect(() => {
    if (!achievementNotification && achievementQueue.length > 0) {
      const next = achievementQueue[0];
      setAchievementNotification(next);
      setAchievementQueue((prev) => prev.slice(1));
    }
  }, [achievementNotification, achievementQueue]);
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
        carisma: 0,
        unlocked_achievements: []
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
      let tempHistory = [
        {
          id: "use_" + Date.now(),
          title: `Aventura Diaria (Uso #${currentUseCount}) ⚡`,
          xp: xpGained,
          date: (/* @__PURE__ */ new Date()).toLocaleDateString(),
          type: "use"
        },
        ...meta.xp_history || []
      ];
      let tempXp = newXp;
      let tempLevel = newLevel;
      let tempUnlocked = [...meta.unlocked_achievements || []];
      const allNewlyUnlocked = [];
      let hasNewUnlocks = true;
      while (hasNewUnlocks) {
        const stats = {
          useCount: currentUseCount,
          joinedEventsCount: meta.joined_events_count || 0,
          createdEventsCount: meta.created_events_count || 0,
          carisma: meta.carisma || 0,
          level: tempLevel,
          description: meta.description || "",
          location: meta.location || "",
          preferredSports: meta.preferred_sports || [],
          fullName: meta.full_name || "",
          age: meta.age || 0,
          gender: meta.gender || "",
          coupons: newCoupons,
          xpHistory: tempHistory
        };
        const { newlyUnlocked, updatedUnlocked } = evaluateAchievements(tempUnlocked, stats);
        if (newlyUnlocked.length > 0) {
          allNewlyUnlocked.push(...newlyUnlocked);
          tempUnlocked = updatedUnlocked;
          let achXp = 0;
          newlyUnlocked.forEach((a) => achXp += a.xpReward);
          tempXp += achXp;
          while (tempXp >= tempLevel * 100) {
            tempXp -= tempLevel * 100;
            tempLevel += 1;
            isLevelUp = true;
          }
        } else {
          hasNewUnlocks = false;
        }
      }
      newXp = tempXp;
      newLevel = tempLevel;
      if (isLevelUp) {
        const levelCoupon = getCouponForLevel(newLevel);
        if (levelCoupon && !newCoupons.some((c) => c.code === levelCoupon.code)) {
          newCoupons.push(levelCoupon);
          if (!awardedCoupon) awardedCoupon = levelCoupon;
        }
      }
      const achievementHistoryEntries = allNewlyUnlocked.map((ach) => ({
        id: "ach_" + ach.id + "_" + Date.now(),
        title: `🏆 ¡Logro Desbloqueado: ${ach.title}!`,
        xp: ach.xpReward,
        date: (/* @__PURE__ */ new Date()).toLocaleDateString(),
        type: "system"
      }));
      const finalHistory = [
        ...achievementHistoryEntries,
        ...tempHistory
      ];
      const { data: { user: updatedUser } } = await supabase.auth.updateUser({
        data: {
          xp: newXp,
          level: newLevel,
          use_count: currentUseCount,
          coupons: newCoupons,
          xp_history: finalHistory,
          unlocked_achievements: tempUnlocked
        }
      });
      if (updatedUser) setUser(updatedUser);
      if (allNewlyUnlocked.length > 0) {
        setAchievementQueue((prev) => [...prev, ...allNewlyUnlocked]);
      }
      setXpNotification({
        xp: xpGained,
        reason: `¡Uso diario #${currentUseCount} de la app!`,
        isLevelUp,
        newLevel: isLevelUp ? newLevel : void 0,
        newCoupon: awardedCoupon
      });
    } else {
      const currentUnlocked = meta.unlocked_achievements || [];
      const stats = {
        useCount: meta.use_count || 0,
        joinedEventsCount: meta.joined_events_count || 0,
        createdEventsCount: meta.created_events_count || 0,
        carisma: meta.carisma || 0,
        level: meta.level || 1,
        description: meta.description || "",
        location: meta.location || "",
        preferredSports: meta.preferred_sports || [],
        fullName: meta.full_name || "",
        age: meta.age || 0,
        gender: meta.gender || "",
        coupons: meta.coupons || [],
        xpHistory: meta.xp_history || []
      };
      const { newlyUnlocked, updatedUnlocked } = evaluateAchievements(currentUnlocked, stats);
      if (newlyUnlocked.length > 0) {
        let tempXp = meta.xp || 0;
        let tempLevel = meta.level || 1;
        let isLevelUp = false;
        let achXp = 0;
        newlyUnlocked.forEach((a) => achXp += a.xpReward);
        tempXp += achXp;
        while (tempXp >= tempLevel * 100) {
          tempXp -= tempLevel * 100;
          tempLevel += 1;
          isLevelUp = true;
        }
        let newCoupons = [...meta.coupons || []];
        let awardedCoupon = null;
        if (isLevelUp) {
          const levelCoupon = getCouponForLevel(tempLevel);
          if (levelCoupon && !newCoupons.some((c) => c.code === levelCoupon.code)) {
            newCoupons.push(levelCoupon);
            awardedCoupon = levelCoupon;
          }
        }
        const achievementHistoryEntries = newlyUnlocked.map((ach) => ({
          id: "ach_" + ach.id + "_" + Date.now(),
          title: `🏆 ¡Logro Desbloqueado: ${ach.title}!`,
          xp: ach.xpReward,
          date: (/* @__PURE__ */ new Date()).toLocaleDateString(),
          type: "system"
        }));
        const newHistory = [
          ...achievementHistoryEntries,
          ...meta.xp_history || []
        ];
        const { data: { user: updatedUser } } = await supabase.auth.updateUser({
          data: {
            xp: tempXp,
            level: tempLevel,
            coupons: newCoupons,
            unlocked_achievements: updatedUnlocked,
            xp_history: newHistory
          }
        });
        if (updatedUser) setUser(updatedUser);
        setAchievementQueue((prev) => [...prev, ...newlyUnlocked]);
        if (isLevelUp) {
          setXpNotification({
            xp: achXp,
            reason: "¡Hazaña lograda por tus logros desbloqueados!",
            isLevelUp,
            newLevel: tempLevel,
            newCoupon: awardedCoupon
          });
        }
      }
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
    const type = reason.includes("unirse") || reason.includes("Unirse") ? "join" : reason.includes("crear") || reason.includes("Organizar") ? "create" : "system";
    const joinedDelta = type === "join" ? 1 : 0;
    const createdDelta = type === "create" ? 1 : 0;
    const nextJoinedCount = (meta.joined_events_count || 0) + joinedDelta;
    const nextCreatedCount = (meta.created_events_count || 0) + createdDelta;
    const currentUseCount = meta.use_count || 0;
    const currentCarisma = meta.carisma || 0;
    const tempHistory = [
      {
        id: "xp_" + Date.now(),
        title: reason,
        xp: amount,
        date: (/* @__PURE__ */ new Date()).toLocaleDateString(),
        type
      },
      ...meta.xp_history || []
    ];
    let tempXp = newXp;
    let tempLevel = newLevel;
    let tempUnlocked = [...meta.unlocked_achievements || []];
    const allNewlyUnlocked = [];
    let hasNewUnlocks = true;
    while (hasNewUnlocks) {
      const stats = {
        useCount: currentUseCount,
        joinedEventsCount: nextJoinedCount,
        createdEventsCount: nextCreatedCount,
        carisma: currentCarisma,
        level: tempLevel,
        description: meta.description || "",
        location: meta.location || "",
        preferredSports: meta.preferred_sports || [],
        fullName: meta.full_name || "",
        age: meta.age || 0,
        gender: meta.gender || "",
        coupons: newCoupons,
        xpHistory: tempHistory
      };
      const { newlyUnlocked, updatedUnlocked } = evaluateAchievements(tempUnlocked, stats);
      if (newlyUnlocked.length > 0) {
        allNewlyUnlocked.push(...newlyUnlocked);
        tempUnlocked = updatedUnlocked;
        let achXp = 0;
        newlyUnlocked.forEach((a) => achXp += a.xpReward);
        tempXp += achXp;
        while (tempXp >= tempLevel * 100) {
          tempXp -= tempLevel * 100;
          tempLevel += 1;
          isLevelUp = true;
        }
      } else {
        hasNewUnlocks = false;
      }
    }
    newXp = tempXp;
    newLevel = tempLevel;
    if (isLevelUp) {
      const levelCoupon = getCouponForLevel(newLevel);
      if (levelCoupon && !newCoupons.some((c) => c.code === levelCoupon.code)) {
        newCoupons.push(levelCoupon);
        awardedCoupon = levelCoupon;
      }
    }
    const achievementHistoryEntries = allNewlyUnlocked.map((ach) => ({
      id: "ach_" + ach.id + "_" + Date.now(),
      title: `🏆 ¡Logro Desbloqueado: ${ach.title}!`,
      xp: ach.xpReward,
      date: (/* @__PURE__ */ new Date()).toLocaleDateString(),
      type: "system"
    }));
    const finalHistory = [
      ...achievementHistoryEntries,
      ...tempHistory
    ];
    const { data: { user: updatedUser } } = await supabase.auth.updateUser({
      data: {
        xp: newXp,
        level: newLevel,
        coupons: newCoupons,
        xp_history: finalHistory,
        joined_events_count: nextJoinedCount,
        created_events_count: nextCreatedCount,
        unlocked_achievements: tempUnlocked
      }
    });
    if (updatedUser) setUser(updatedUser);
    if (allNewlyUnlocked.length > 0) {
      setAchievementQueue((prev) => [...prev, ...allNewlyUnlocked]);
    }
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
    const currentXp = meta.xp || 0;
    const currentLevel = meta.level || 1;
    let newXp = currentXp;
    let newLevel = currentLevel;
    let isLevelUp = false;
    let tempXp = newXp;
    let tempLevel = newLevel;
    let tempUnlocked = [...meta.unlocked_achievements || []];
    const allNewlyUnlocked = [];
    let hasNewUnlocks = true;
    while (hasNewUnlocks) {
      const stats = {
        useCount: meta.use_count || 0,
        joinedEventsCount: meta.joined_events_count || 0,
        createdEventsCount: meta.created_events_count || 0,
        carisma: meta.carisma || 0,
        level: tempLevel,
        description: meta.description || "",
        location: meta.location || "",
        preferredSports: meta.preferred_sports || [],
        fullName: meta.full_name || "",
        age: meta.age || 0,
        gender: meta.gender || "",
        coupons: newCoupons,
        xpHistory: meta.xp_history || []
      };
      const { newlyUnlocked, updatedUnlocked } = evaluateAchievements(tempUnlocked, stats);
      if (newlyUnlocked.length > 0) {
        allNewlyUnlocked.push(...newlyUnlocked);
        tempUnlocked = updatedUnlocked;
        let achXp = 0;
        newlyUnlocked.forEach((a) => achXp += a.xpReward);
        tempXp += achXp;
        while (tempXp >= tempLevel * 100) {
          tempXp -= tempLevel * 100;
          tempLevel += 1;
          isLevelUp = true;
        }
      } else {
        hasNewUnlocks = false;
      }
    }
    newXp = tempXp;
    newLevel = tempLevel;
    let levelCoupons = [...newCoupons];
    let awardedCoupon = null;
    if (isLevelUp) {
      const levelCoupon = getCouponForLevel(newLevel);
      if (levelCoupon && !levelCoupons.some((c) => c.code === levelCoupon.code)) {
        levelCoupons.push(levelCoupon);
        awardedCoupon = levelCoupon;
      }
    }
    const achievementHistoryEntries = allNewlyUnlocked.map((ach) => ({
      id: "ach_" + ach.id + "_" + Date.now(),
      title: `🏆 ¡Logro Desbloqueado: ${ach.title}!`,
      xp: ach.xpReward,
      date: (/* @__PURE__ */ new Date()).toLocaleDateString(),
      type: "system"
    }));
    const finalHistory = [
      ...achievementHistoryEntries,
      ...meta.xp_history || []
    ];
    const { data: { user: updatedUser } } = await supabase.auth.updateUser({
      data: {
        coupons: levelCoupons,
        xp: newXp,
        level: newLevel,
        unlocked_achievements: tempUnlocked,
        xp_history: finalHistory
      }
    });
    if (updatedUser) setUser(updatedUser);
    if (allNewlyUnlocked.length > 0) {
      setAchievementQueue((prev) => [...prev, ...allNewlyUnlocked]);
    }
    if (isLevelUp) {
      setXpNotification({
        xp: 0,
        reason: "¡Has subido de nivel por tus hazañas!",
        isLevelUp,
        newLevel,
        newCoupon: awardedCoupon
      });
    }
  };
  const updateProfile = async (updates) => {
    if (!user) return;
    const meta = user.user_metadata || {};
    const currentXp = meta.xp || 0;
    const currentLevel = meta.level || 1;
    let newXp = currentXp;
    let newLevel = currentLevel;
    let isLevelUp = false;
    let tempXp = newXp;
    let tempLevel = newLevel;
    let tempUnlocked = [...meta.unlocked_achievements || []];
    const allNewlyUnlocked = [];
    let hasNewUnlocks = true;
    while (hasNewUnlocks) {
      const stats = {
        useCount: meta.use_count || 0,
        joinedEventsCount: meta.joined_events_count || 0,
        createdEventsCount: meta.created_events_count || 0,
        carisma: meta.carisma || 0,
        level: tempLevel,
        description: updates.description || meta.description || "",
        location: updates.location || meta.location || "",
        preferredSports: updates.preferredSports || meta.preferred_sports || [],
        fullName: updates.name || meta.full_name || "",
        age: updates.age || meta.age || 0,
        gender: updates.gender || meta.gender || "",
        coupons: meta.coupons || [],
        xpHistory: meta.xp_history || []
      };
      const { newlyUnlocked, updatedUnlocked } = evaluateAchievements(tempUnlocked, stats);
      if (newlyUnlocked.length > 0) {
        allNewlyUnlocked.push(...newlyUnlocked);
        tempUnlocked = updatedUnlocked;
        let achXp = 0;
        newlyUnlocked.forEach((a) => achXp += a.xpReward);
        tempXp += achXp;
        while (tempXp >= tempLevel * 100) {
          tempXp -= tempLevel * 100;
          tempLevel += 1;
          isLevelUp = true;
        }
      } else {
        hasNewUnlocks = false;
      }
    }
    newXp = tempXp;
    newLevel = tempLevel;
    let newCoupons = [...meta.coupons || []];
    let awardedCoupon = null;
    if (isLevelUp) {
      const levelCoupon = getCouponForLevel(newLevel);
      if (levelCoupon && !newCoupons.some((c) => c.code === levelCoupon.code)) {
        newCoupons.push(levelCoupon);
        awardedCoupon = levelCoupon;
      }
    }
    const achievementHistoryEntries = allNewlyUnlocked.map((ach) => ({
      id: "ach_" + ach.id + "_" + Date.now(),
      title: `🏆 ¡Logro Desbloqueado: ${ach.title}!`,
      xp: ach.xpReward,
      date: (/* @__PURE__ */ new Date()).toLocaleDateString(),
      type: "system"
    }));
    const finalHistory = [
      ...achievementHistoryEntries,
      ...meta.xp_history || []
    ];
    const { data: { user: updatedUser }, error: updateError } = await supabase.auth.updateUser({
      data: {
        full_name: updates.name,
        avatar_url: updates.avatarUrl,
        is_organizer: updates.isOrganizer,
        age: updates.age,
        gender: updates.gender,
        description: updates.description,
        location: updates.location,
        preferred_sports: updates.preferredSports,
        xp: newXp,
        level: newLevel,
        coupons: newCoupons,
        unlocked_achievements: tempUnlocked,
        xp_history: finalHistory
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
    if (allNewlyUnlocked.length > 0) {
      setAchievementQueue((prev) => [...prev, ...allNewlyUnlocked]);
    }
    if (isLevelUp) {
      setXpNotification({
        xp: 0,
        reason: "¡Has subido de nivel por tus hazañas!",
        isLevelUp,
        newLevel,
        newCoupon: awardedCoupon
      });
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
    const currentXp = meta.xp || 0;
    const currentLevel = meta.level || 1;
    let newXp = currentXp;
    let newLevel = currentLevel;
    let isLevelUp = false;
    let tempXp = newXp;
    let tempLevel = newLevel;
    let tempUnlocked = [...meta.unlocked_achievements || []];
    const allNewlyUnlocked = [];
    let hasNewUnlocks = true;
    while (hasNewUnlocks) {
      const stats = {
        useCount: meta.use_count || 0,
        joinedEventsCount: meta.joined_events_count || 0,
        createdEventsCount: meta.created_events_count || 0,
        carisma: newCarisma,
        level: tempLevel,
        description: meta.description || "",
        location: meta.location || "",
        preferredSports: meta.preferred_sports || [],
        fullName: meta.full_name || "",
        age: meta.age || 0,
        gender: meta.gender || "",
        coupons: meta.coupons || [],
        xpHistory: meta.xp_history || []
      };
      const { newlyUnlocked, updatedUnlocked } = evaluateAchievements(tempUnlocked, stats);
      if (newlyUnlocked.length > 0) {
        allNewlyUnlocked.push(...newlyUnlocked);
        tempUnlocked = updatedUnlocked;
        let achXp = 0;
        newlyUnlocked.forEach((a) => achXp += a.xpReward);
        tempXp += achXp;
        while (tempXp >= tempLevel * 100) {
          tempXp -= tempLevel * 100;
          tempLevel += 1;
          isLevelUp = true;
        }
      } else {
        hasNewUnlocks = false;
      }
    }
    newXp = tempXp;
    newLevel = tempLevel;
    let newCoupons = [...meta.coupons || []];
    let awardedCoupon = null;
    if (isLevelUp) {
      const levelCoupon = getCouponForLevel(newLevel);
      if (levelCoupon && !newCoupons.some((c) => c.code === levelCoupon.code)) {
        newCoupons.push(levelCoupon);
        awardedCoupon = levelCoupon;
      }
    }
    const achievementHistoryEntries = allNewlyUnlocked.map((ach) => ({
      id: "ach_" + ach.id + "_" + Date.now(),
      title: `🏆 ¡Logro Desbloqueado: ${ach.title}!`,
      xp: ach.xpReward,
      date: (/* @__PURE__ */ new Date()).toLocaleDateString(),
      type: "system"
    }));
    const finalHistory = [
      ...achievementHistoryEntries,
      ...meta.xp_history || []
    ];
    const { data: { user: updatedUser } } = await supabase.auth.updateUser({
      data: {
        carisma: newCarisma,
        xp: newXp,
        level: newLevel,
        coupons: newCoupons,
        unlocked_achievements: tempUnlocked,
        xp_history: finalHistory
      }
    });
    if (updatedUser) setUser(updatedUser);
    if (allNewlyUnlocked.length > 0) {
      setAchievementQueue((prev) => [...prev, ...allNewlyUnlocked]);
    }
    if (isLevelUp) {
      setXpNotification({
        xp: 0,
        reason: "¡Has subido de nivel por tus hazañas!",
        isLevelUp,
        newLevel,
        newCoupon: awardedCoupon
      });
    }
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
        incrementCarisma,
        unlockedAchievements: user?.user_metadata?.unlocked_achievements || [],
        achievementNotification,
        clearAchievementNotification
      },
      children
    }
  );
}
function useCurrentUser() {
  return useContext(UserContext);
}
const translations = {
  es: {
    // Settings
    "settings.title": "Configuración",
    "settings.aesthetics": "Estética de la App",
    "settings.language": "Idioma",
    "settings.gamePrefs": "Preferencias de Juego",
    "settings.rpgMode": "Modo RPG Activo",
    "settings.rpgModeDesc": "Muestra niveles, XP, cofres y stats. Apágalo para una vista más deportiva.",
    "settings.pushNotif": "Notificaciones Push",
    "settings.pushNotifDesc": "Avisos de partidos e invitaciones de clanes.",
    "settings.distance": "Unidad de Distancia",
    "settings.distanceDesc": "Para buscar eventos cercanos.",
    "settings.logout": "Cerrar Sesión",
    "themes.light": "Claro",
    "themes.dark": "Oscuro",
    "themes.neon": "Neón",
    "themes.nature": "Naturaleza",
    "themes.ocean": "Océano",
    // Navigation
    "nav.events": "Eventos",
    "nav.sports": "Deportes",
    "nav.map": "Mapa",
    "nav.friends": "Amigos",
    "nav.profile": "Perfil",
    "nav.clans": "Clanes",
    // Profile
    "profile.rpgActive": "Modo RPG Activo",
    "profile.level": "Nivel",
    "profile.xpPoints": "Puntos de Experiencia",
    "profile.achievements": "Logros Obtenidos",
    "profile.progress": "Progreso",
    "profile.stats": "Stats",
    "profile.inventory": "Cofre",
    "profile.history": "Aventuras",
    "profile.logout": "Cerrar Sesión del Héroe",
    "profile.editProfile": "Editar Perfil",
    "profile.premium": "Premium",
    "profile.basic": "Básica",
    "profile.organizer": "Organizador",
    "profile.age": "Edad",
    "profile.gender": "Género",
    "profile.location": "Ubicación",
    "profile.aboutMe": "Sobre mí",
    "profile.favSports": "Deportes Favoritos",
    "profile.closeProfile": "Cerrar Perfil",
    "profile.male": "Masculino",
    "profile.female": "Femenino",
    // Events
    "events.joinEvent": "Unirme al Partido",
    "events.createEvent": "Crear Evento",
    "events.noEvents": "No hay eventos disponibles",
    "events.search": "Buscar eventos...",
    "events.participants": "Participantes",
    "events.registerClan": "Inscribir mi Clan",
    "events.tab.upcoming": "Próximos",
    "events.tab.mine": "Mis Partidos",
    "events.tab.requests": "Solicitudes",
    "events.upcoming": "Próximamente",
    "events.error.noPermission": "No tienes permiso para realizar esta acción.",
    "events.error.processing": "Error al procesar la solicitud: ",
    "events.noPendingRequests": "No tienes solicitudes pendientes nuevas",
    "events.wantsToJoin": "quiere unirse a tu partido de",
    "events.viewProfile": "Ver Perfil",
    "events.noUpcomingMatches": "No tienes partidos próximos programados",
    // Friends
    "friends.title": "Amigos",
    "friends.findPlayers": "Buscar Jugadores",
    "friends.myFriends": "Mis Amigos",
    "friends.noFriends": "No hay perfiles disponibles",
    "friends.findPlayersDescription": "Vuelve más tarde o ajusta tus filtros",
    "friends.resetList": "Reiniciar",
    "friends.requests": "Solicitudes Recibidas",
    "friends.accept": "Aceptar",
    "friends.reject": "Rechazar",
    "friends.defaultName": "Deportista",
    "friends.unknownLocation": "Ubicación desconocida",
    "friends.noDescription": "Sin descripción",
    "friends.acceptedXp": "¡Aceptaste a {name} como amigo! 🤝",
    "friends.sendingRequest": "Enviando solicitud...",
    "friends.connectingWith": "Conectando con",
    "friends.requestSent": "¡SOLICITUD ENVIADA! 🤝",
    "friends.sent": "¡Enviado!",
    "friends.requestDesc": "Has enviado una solicitud de Match a {name}. Ahora debes esperar a que la apruebe para aparecer en tu lista de amigos.",
    "friends.gotIt": "¡Entendido!",
    "friends.problem": "Hubo un problema",
    "friends.errorDesc": "No pudimos enviar tu solicitud. Verifica tu conexión.",
    "friends.newMatch": "¡NUEVO MATCH! 🤝",
    "friends.requestAccepted": "¡SOLICITUD ACEPTADA!",
    "friends.nowFriends": "¡Tú y {name} ahora son amigos! Han ganado +1 punto de Carisma.",
    "friends.forYou": "Para ti",
    "friends.loadingProfiles": "Cargando perfiles reales...",
    "friends.compatible": "Compatible",
    "friends.makeMatch": "¡Hacer Match!",
    "friends.mySavedFriends": "Mis Amigos Guardados",
    "friends.friendsCount": "amigos",
    "friends.searchPlaceholder": "Buscar amigo por nombre, deporte...",
    "friends.searchEmpty": "No se encontraron amigos con ese criterio",
    "friends.noFriendsAdded": "Aún no tienes amigos agregados. ¡Busca conexiones en la pestaña 'Para ti'!",
    "friends.sendMessage": "Enviar Mensaje",
    // Clans
    "clans.title": "Clanes",
    "clans.createClan": "Crear Clan",
    "clans.joinClan": "Unirse a Clan",
    "clans.myClan": "Mi Clan",
    "clans.captain": "Capitán",
    "clans.members": "Miembros",
    "clans.search": "Buscar clanes...",
    "clans.subtitle": "Tu equipo permanente",
    "clans.noClans": "No perteneces a ningún clan",
    "clans.createFirst": "Crea tu primer clan",
    "clans.form.name": "Nombre del Clan",
    "clans.form.sport": "Deporte Principal",
    "clans.form.primaryColor": "Color Primario",
    "clans.form.secondaryColor": "Color Secundario",
    "clans.form.desc": "Descripción",
    "clans.btn.create": "Crear Clan",
    "clans.btn.creating": "Creando...",
    "clans.join.title": "Unirse a un Clan",
    "clans.join.desc": "Pídele al capitán de tu equipo el código de invitación e ingrésalo abajo.",
    "clans.btn.join": "Solicitar Unión",
    "common.add": "Agregar",
    "common.delete": "Eliminar",
    "events.error.alreadyApplied": "Ya enviaste una solicitud",
    "events.error.joinError": "Error al solicitar unirse",
    "events.error.allClanMembersEnrolled": "Todos los miembros seleccionados ya están inscritos en este evento",
    "events.error.someClanMembersEnrolled": "Algunos miembros ya están inscritos en este evento",
    "events.error.joinClanError": "Error al inscribir al clan",
    "events.error.deleteEvent": "Error al eliminar el evento",
    "events.error.onlyHostCanAccept": "Solo el creador del evento puede aceptar o rechazar solicitudes.",
    "events.success.actionComplete": "Has {action} la solicitud.",
    "events.error.updateRequest": "Error al actualizar la solicitud",
    "events.error.alreadyInMatch": "{name} ya está en el partido.",
    "events.success.addedToMatch": "¡{name} ha sido agregado al partido!",
    "events.success.requestSentTo": "¡Solicitud enviada a {name}!",
    "events.error.inviteError": "Error al invitar a {name}.",
    "events.confirmLeave": "¿Estás seguro de que deseas salirte de este partido?",
    "events.success.requestSentTitle": "¡Solicitud enviada!",
    "events.success.requestSentDesc": "Tu solicitud para unirte al partido de {sport} ha sido enviada con éxito.",
    "events.date": "Fecha",
    "events.time": "Hora",
    "events.location": "Lugar",
    "events.spots": "Cupos",
    "events.locationNotAvailable": "Ubicación no disponible",
    "events.howToGetThere": "Cómo llegar con Google Maps",
    "events.realTime": "En tiempo real",
    "events.fromYourLocation": "Desde tu ubicación",
    "events.description": "Descripción",
    "events.defaultDescription": "Partido amistoso, cancha sintética con luces. Trae ropa cómoda y agua. Se aceptan jugadores con experiencia, ambiente respetuoso y competitivo.",
    "events.pendingRequests": "Solicitudes pendientes",
    "events.approvedPlayers": "Jugadores aprobados",
    "events.inviteFriends": "Invitar Amigos",
    "events.spotsAvailable": "cupos disponibles",
    "events.loadingPlayers": "Cargando jugadores...",
    "events.applyCoupon": "Aplicar Cupón RPG:",
    "events.noCoupon": "-- Sin cupón --",
    "events.contribution": "Aporte",
    "events.free": "Gratis",
    "events.youAreHost": "Eres el organizador 👑",
    "events.deleteEvent": "Eliminar Evento",
    "events.leaveMatch": "Salir del partido 🚪",
    "events.cancelRequest": "Cancelar solicitud ✖️",
    "events.sending": "Enviando...",
    "events.eventFull": "Evento Lleno",
    "events.requestToJoin": "Solicitar unirme",
    "events.enrolling": "Inscribiendo...",
    "events.enrollClan": "Inscribir Clan",
    "events.inviteFriendsTitle": "Invitar Amigos",
    "events.loadingFriends": "Cargando amigos...",
    "events.noFriendsAvailable": "No tienes amigos disponibles para invitar o todos ya están en el partido.",
    "events.backToMatch": "Volver al Partido",
    "events.deleteEventConfirmTitle": "¿Eliminar Evento?",
    "events.deleteEventConfirmDesc": "Esta acción eliminará {title} de forma permanente. Todos los participantes serán removidos y no habrá forma de revertirlo.",
    "events.selectMembers": "Seleccionar Miembros",
    "events.selectMembersDesc": "El evento tiene {spots} cupos. Selecciona quiénes participarán.",
    "events.error.maxMembers": "Solo puedes seleccionar hasta {spots} miembros.",
    "events.join": "Unirse",
    "events.viewRoute": "Ver Ruta",
    "clans.btn.joining": "Enviando...",
    "clans.inviteCode": "Código Invitación:",
    "clans.played": "Jugados",
    "clans.won": "Ganados",
    "clans.lost": "Perdidos",
    "clans.inviteFriends": "+ Invitar Amigos",
    "clans.leaveClan": "Salir del Clan",
    "clans.editClan": "Editar Clan",
    "clans.requests": "Solicitudes de Unión",
    // Common
    "common.back": "Volver",
    "common.save": "Guardar",
    "common.cancel": "Cancelar",
    "common.loading": "Cargando...",
    "common.error": "Error",
    "common.success": "¡Éxito!",
    "common.search": "Buscar...",
    "common.noResults": "Sin resultados",
    "common.years": "años",
    "common.used": "Usado",
    "common.copied": "Copiado",
    "common.copy": "Copiar",
    "common.redeem": "Canjear",
    "common.user": "Usuario",
    // Map
    "map.distanceNear": "Cerca (≤ 5km)",
    "map.distanceMedium": "Medio (≤ 15km)",
    "map.distanceAny": "Cualquier distancia",
    "map.scheduledMatches": "Partidos programados",
    "map.coordsNotAvailable": "Coordenadas no disponibles.",
    "map.loading": "Cargando mapa...",
    "map.hub": "Hub Deportivo",
    "map.freeAccess": "Acceso gratuito",
    "map.perHour": "hora",
    "map.commentsTitle": "Comentarios de la cancha",
    "map.commentsDesc": "Mira opiniones o escribe sobre esta cancha",
    "map.noMatches": "No hay partidos programados aquí",
    "map.createOne": "¡Ve a la pestaña Eventos para crear uno!",
    "map.players": "jugadores",
    "map.myLocation": "Mi ubicación",
    "map.gpsLoc": "Mi ubicación GPS",
    "map.error.unsupported": "Tu navegador no soporta geolocalización",
    "map.error.failed": "No se pudo obtener tu ubicación",
    "map.error.denied": "Permiso de ubicación denegado",
    "map.error.unavailable": "Ubicación no disponible",
    "map.error.timeout": "Tiempo de espera agotado",
    "sports.all": "Todos",
    "sports.title": "Deportes",
    "sports.football": "Fútbol",
    "sports.tennis": "Tenis",
    "sports.golf": "Golf",
    "sports.padel": "Pádel",
    "sports.other": "Otro",
    "common.close": "Cerrar",
    // CreateEventForm
    "createEvent.title": "Nuevo evento",
    "createEvent.subtitle": "Completa los datos para publicar tu evento",
    "createEvent.sport": "Deporte",
    "createEvent.intensity": "Intensidad",
    "createEvent.date": "Fecha",
    "createEvent.time": "Hora",
    "createEvent.facility": "Instalación / Cancha",
    "createEvent.loadingCourts": "Cargando canchas disponibles...",
    "createEvent.noCourts": "No hay canchas registradas en la app.",
    "createEvent.registerFirst": "Registra primero una cancha en la sección de Canchas.",
    "createEvent.createCourt": "+ Crear nueva cancha",
    "createEvent.selectCourt": "-- Selecciona una cancha --",
    "createEvent.autoClan": "Inscribir Clan Automáticamente",
    "createEvent.noClan": "-- No inscribir clan completo --",
    "createEvent.enrollClan": "Inscribir a {name} ({count} miembros)",
    "createEvent.clanNote": "Si seleccionas un clan, todos sus miembros actuales serán inscritos automáticamente en este evento.",
    "createEvent.maxCapacity": "Capacidad máxima",
    "createEvent.capacityPlaceholder": "Ej: 12 jugadores (opcional)",
    "createEvent.description": "Descripción",
    "createEvent.descPlaceholder": "Ej: Traer ropa cómoda, agua y actitud deportiva. (Máximo 150 caracteres)",
    "createEvent.publishing": "Publicando evento…",
    "createEvent.publish": "Publicar evento",
    "createEvent.published": "¡EVENTO PUBLICADO! ⚽",
    "createEvent.done": "¡Listo!",
    "createEvent.successMsg": "Tu partido ya está en el mapa, listo para que otros jugadores se unan. ¡A jugar!",
    "createEvent.understood": "¡Entendido!",
    "createEvent.loginRequired": "Debes iniciar sesión para crear un evento.",
    "createEvent.emailError": "No se pudo obtener el email del usuario. Intenta cerrar sesión y volver a entrar.",
    "createEvent.error": "Error al crear el evento",
    "createEvent.unexpectedError": "Error inesperado al crear el evento.",
    "createEvent.err.sport": "Selecciona un deporte",
    "createEvent.err.intensity": "Selecciona la intensidad",
    "createEvent.err.date": "La fecha es obligatoria",
    "createEvent.err.time": "La hora es obligatoria",
    "createEvent.err.court": "Selecciona una cancha obligatoriamente",
    // EditProfile
    "editProfile.title": "Editar Perfil",
    "editProfile.profilePhoto": "Foto de perfil",
    "editProfile.fullName": "Nombre completo",
    "editProfile.namePlaceholder": "Tu nombre",
    "editProfile.email": "Correo electrónico",
    "editProfile.emailNote": "Al cambiar el correo electrónico, se enviará un mensaje de confirmación.",
    "editProfile.age": "Edad",
    "editProfile.gender": "Género",
    "editProfile.selectGender": "Seleccionar...",
    "editProfile.male": "Masculino",
    "editProfile.female": "Femenino",
    "editProfile.other": "Otro",
    "editProfile.location": "Ubicación (Municipio/Zona)",
    "editProfile.locationPlaceholder": "Ej. Chacao, Caracas",
    "editProfile.aboutMe": "Sobre mí (Descripción)",
    "editProfile.aboutPlaceholder": "Cuéntanos un poco sobre ti, tu nivel de juego, etc.",
    "editProfile.preferredSports": "Deportes preferidos",
    "editProfile.organizerMode": "Modo Organizador",
    "editProfile.organizerDesc": "Te permite registrar y gestionar tus propias instalaciones y canchas",
    "editProfile.saveChanges": "Guardar Cambios",
    "editProfile.success": "Perfil actualizado correctamente",
    "editProfile.error": "Error al actualizar el perfil",
    "editProfile.imgRequired": "Debes seleccionar una imagen.",
    "editProfile.imgError": "Error al subir la imagen",
    // EventCard
    "eventCard.free": "Gratis",
    "eventCard.spots": "cupos",
    "eventCard.viewEvent": "Ver evento",
    "eventCard.waitingRequest": "Esperando solicitud",
    "eventCard.joinEvent": "Unirse al evento",
    // CanchasScreen
    "canchas.title": "Canchas",
    "canchas.available": "Canchas disponibles",
    "canchas.selectForEvent": "Selecciona una cancha para tu evento",
    "canchas.addCourt": "Añadir cancha",
    "canchas.add": "Añadir",
    "canchas.noCourts": "No hay canchas por ahora",
    "canchas.beFirst": "Sé el primero en añadir una cancha",
    "canchas.addFirst": "Añadir primera cancha",
    "canchas.addTitle": "Añadir cancha",
    "canchas.addSubtitle": "Registra una nueva cancha deportiva",
    "canchas.name": "Nombre",
    "canchas.namePlaceholder": "Ej: Cancha San Bernardino",
    "canchas.nameRequired": "El nombre es obligatorio",
    "canchas.sportRequired": "Selecciona un deporte",
    "canchas.locationRequired": "Elige la ubicación en el mapa",
    "canchas.tapMap": "Toca el mapa para elegir la ubicación",
    "canchas.locationSelected": "Ubicación seleccionada",
    "canchas.description": "Descripción",
    "canchas.descPlaceholder": "Iluminación nocturna, vestuarios, estacionamiento...",
    "canchas.pricePerHour": "Precio por hora (Bs.)",
    "canchas.pricePlaceholder": "Ej: 50 (opcional)",
    "canchas.saving": "Guardando cancha…",
    "canchas.save": "Guardar cancha",
    "canchas.added": "¡Cancha añadida!",
    "canchas.addedDesc": "Ya aparece en el listado de canchas",
    "canchas.loadingMap": "Cargando mapa…",
    "canchas.searchingAddress": "Buscando dirección...",
    // CanchaComments
    "comments.title": "Comentarios",
    "comments.loading": "Cargando comentarios…",
    "comments.noComments": "Sin comentarios aún",
    "comments.beFirst": "Sé el primero en dejar un comentario sobre las condiciones o accesibilidad de esta cancha.",
    "comments.noCommentsYet": "Nadie ha comentado en esta cancha todavía.",
    "comments.player": "Jugador",
    "comments.verified": "Verificado",
    "comments.checkingAccess": "Comprobando acceso…",
    "comments.loginToComment": "Inicia sesión para comentar",
    "comments.shareOpinion": "Comparte tu opinión sobre esta cancha con la comunidad.",
    "comments.loginRegister": "Iniciar Sesión / Registrarse",
    "comments.restricted": "Acceso restringido",
    "comments.restrictedDesc": "Solo puedes comentar si has participado o estás participando en un evento en esta cancha. ¡Únete a un partido o crea uno aquí primero!",
    "comments.placeholder": "Escribe tu opinión sobre la cancha (iluminación, estado, etc.)…",
    "comments.readyToComment": "Listo para comentar",
    "comments.submitError": "Error al enviar el comentario.",
    // Auth
    "auth.welcomeBack": "Bienvenido",
    "auth.welcomeBackEmoji": "de vuelta 👋",
    "auth.createAccount": "Crea tu cuenta",
    "auth.createAccountEmoji": "y entra a jugar ⚡",
    "auth.loginSubtitle": "Inicia sesión para ver y unirte a eventos.",
    "auth.registerSubtitle": "Regístrate gratis. En segundos estás dentro.",
    "auth.fullName": "Nombre completo",
    "auth.namePlaceholder": "Ej: Diego Ramírez",
    "auth.registerAsOrganizer": "Quiero registrarme como Organizador",
    "auth.email": "Correo electrónico",
    "auth.password": "Contraseña",
    "auth.minChars": "Mín. 6 caracteres",
    "auth.yourPassword": "Tu contraseña",
    "auth.forgotPassword": "¿Olvidaste tu contraseña?",
    "auth.loggingIn": "Iniciando sesión...",
    "auth.creatingAccount": "Creando cuenta...",
    "auth.loggedIn": "¡Sesión iniciada!",
    "auth.accountCreated": "¡Cuenta creada!",
    "auth.login": "Iniciar sesión",
    "auth.createFree": "Crear cuenta gratis",
    "auth.or": "o",
    "auth.noAccount": "¿No tienes cuenta? Regístrate",
    "auth.hasAccount": "¿Ya tienes cuenta? Inicia sesión",
    "auth.terms": "Al continuar aceptas los Términos de Uso y la Política de Privacidad de TeamMatch.",
    "auth.loggedInMsg": "¡Sesión iniciada! Entrando...",
    "auth.accountCreatedMsg": "¡Cuenta creada! Bienvenido...",
    "auth.fillFields": "Completa todos los campos obligatorios.",
    "auth.enterName": "Ingresa tu nombre para continuar.",
    "auth.minPassword": "La contraseña debe tener al menos 6 caracteres.",
    "auth.err.invalidLogin": "Correo o contraseña incorrectos. Revisa tus datos.",
    "auth.err.emailNotConfirmed": "Confirma tu correo antes de iniciar sesión.",
    "auth.err.alreadyRegistered": "Ya existe una cuenta con ese correo. Intenta iniciar sesión.",
    "auth.err.weakPassword": "La contraseña debe tener al menos 6 caracteres.",
    "auth.err.invalidEmail": "Ingresa un correo electrónico válido.",
    "auth.err.rateLimit": "Demasiados intentos. Espera unos minutos e intenta de nuevo.",
    // MySports
    "mySports.title": "Mis deportes",
    "mySports.subtitle": "Tus estadísticas y partidos por disciplina",
    "mySports.match": "partido",
    "mySports.matches": "partidos",
    "mySports.noSports": "No te has unido a eventos de ningún deporte todavía",
    // CouponPopup
    "coupon.specialAd": "Anuncio Especial 📣",
    "coupon.copied": "¡Copiado!",
    "coupon.copyHint": "*Haz clic en el código para copiarlo al portapapeles.",
    // Welcome
    "welcome.availableIn": "Disponible en Caracas",
    "welcome.nextMatch": "Tu próximo",
    "welcome.awaits": "partido te espera.",
    "welcome.subtitle": "Encuentra eventos deportivos cerca de ti, únete con un toque o crea el tuyo y arma equipo.",
    "welcome.liveMap": "Mapa en vivo",
    "welcome.liveMapDesc": "Eventos cerca en tiempo real",
    "welcome.joinEasy": "Únete fácil",
    "welcome.joinEasyDesc": "Solicita un cupo en segundos",
    "welcome.byLevel": "Por nivel",
    "welcome.byLevelDesc": "Juega con gente a tu altura",
    "welcome.startPlaying": "Empezar a jugar",
    "welcome.hasAccount": "Ya tengo cuenta",
    "welcome.terms": "Al continuar aceptas los Términos y la Política de Privacidad",
    // LoginPrompt
    "loginPrompt.joinTo": "¡Únete para {action}!",
    "loginPrompt.defaultAction": "realizar esta acción",
    "loginPrompt.subtitle": "Crea tu cuenta gratis y accede a todos los partidos y canchas de Caracas.",
    "loginPrompt.perk1": "Únete a partidos cerca de ti",
    "loginPrompt.perk2": "Crea eventos y arma tu equipo",
    "loginPrompt.perk3": "Gana XP y desbloquea recompensas",
    "loginPrompt.perk4": "Matchmaking por nivel y deporte",
    "loginPrompt.createFree": "Crear Cuenta Gratis",
    "loginPrompt.hasAccount": "Ya tengo cuenta — Iniciar Sesión",
    "loginPrompt.notNow": "Ahora no, seguir explorando"
  },
  en: {
    "settings.title": "Settings",
    "settings.aesthetics": "App Aesthetics",
    "settings.language": "Language",
    "settings.gamePrefs": "Game Preferences",
    "settings.rpgMode": "RPG Mode Active",
    "settings.rpgModeDesc": "Shows levels, XP, chests and stats. Turn off for a cleaner sports view.",
    "settings.pushNotif": "Push Notifications",
    "settings.pushNotifDesc": "Match alerts and clan invitations.",
    "settings.distance": "Distance Unit",
    "settings.distanceDesc": "For finding nearby events.",
    "settings.logout": "Log Out",
    "themes.light": "Light",
    "themes.dark": "Dark",
    "themes.neon": "Neon",
    "themes.nature": "Nature",
    "themes.ocean": "Ocean",
    "nav.events": "Events",
    "nav.sports": "Sports",
    "nav.map": "Map",
    "nav.friends": "Friends",
    "nav.profile": "Profile",
    "nav.clans": "Clans",
    "profile.rpgActive": "RPG Mode Active",
    "profile.level": "Level",
    "profile.xpPoints": "Experience Points",
    "profile.achievements": "Achievements",
    "profile.progress": "Progress",
    "profile.stats": "Stats",
    "profile.inventory": "Chest",
    "profile.history": "History",
    "profile.logout": "Logout",
    "profile.editProfile": "Edit Profile",
    "profile.premium": "Premium",
    "profile.basic": "Basic",
    "profile.organizer": "Organizer",
    "profile.age": "Age",
    "profile.gender": "Gender",
    "profile.location": "Location",
    "profile.aboutMe": "About me",
    "profile.favSports": "Favorite Sports",
    "profile.closeProfile": "Close Profile",
    "profile.male": "Male",
    "profile.female": "Female",
    "events.joinEvent": "Join Match",
    "events.createEvent": "Create Event",
    "events.noEvents": "No events available",
    "events.search": "Search events...",
    "events.participants": "Participants",
    "events.registerClan": "Register my Clan",
    "events.tab.upcoming": "Upcoming",
    "events.tab.mine": "My Matches",
    "events.tab.requests": "Requests",
    "events.upcoming": "Upcoming",
    "events.error.noPermission": "You do not have permission to do this.",
    "events.error.processing": "Error processing request: ",
    "events.noPendingRequests": "No new pending requests",
    "events.wantsToJoin": "wants to join your match of",
    "events.viewProfile": "View Profile",
    "events.noUpcomingMatches": "You have no upcoming matches scheduled",
    "events.error.alreadyApplied": "You already sent a request",
    "events.error.joinError": "Error requesting to join",
    "events.error.allClanMembersEnrolled": "All selected members are already enrolled in this event",
    "events.error.someClanMembersEnrolled": "Some members are already enrolled in this event",
    "events.error.joinClanError": "Error enrolling the clan",
    "events.error.deleteEvent": "Error deleting the event",
    "events.error.onlyHostCanAccept": "Only the event creator can accept or reject requests.",
    "events.success.actionComplete": "You have {action} the request.",
    "events.error.updateRequest": "Error updating the request",
    "events.error.alreadyInMatch": "{name} is already in the match.",
    "events.success.addedToMatch": "¡{name} has been added to the match!",
    "events.success.requestSentTo": "¡Request sent to {name}!",
    "events.error.inviteError": "Error inviting {name}.",
    "events.confirmLeave": "Are you sure you want to leave this match?",
    "events.success.requestSentTitle": "¡Request sent!",
    "events.success.requestSentDesc": "Your request to join the {sport} match has been sent successfully.",
    "events.date": "Date",
    "events.time": "Time",
    "events.location": "Location",
    "events.spots": "Spots",
    "events.locationNotAvailable": "Location not available",
    "events.howToGetThere": "How to get there with Google Maps",
    "events.realTime": "In real time",
    "events.fromYourLocation": "From your location",
    "events.description": "Description",
    "events.defaultDescription": "Friendly match, synthetic court with lights. Bring comfortable clothes and water. Players with experience accepted, respectful and competitive environment.",
    "events.pendingRequests": "Pending requests",
    "events.approvedPlayers": "Approved players",
    "events.inviteFriends": "Invite Friends",
    "events.spotsAvailable": "spots available",
    "events.loadingPlayers": "Loading players...",
    "events.applyCoupon": "Apply RPG Coupon:",
    "events.noCoupon": "-- No coupon --",
    "events.contribution": "Contribution",
    "events.free": "Free",
    "events.youAreHost": "You are the organizer 👑",
    "events.deleteEvent": "Delete Event",
    "events.leaveMatch": "Leave match 🚪",
    "events.cancelRequest": "Cancel request ✖️",
    "events.sending": "Sending...",
    "events.eventFull": "Event Full",
    "events.requestToJoin": "Request to join",
    "events.enrolling": "Enrolling...",
    "events.enrollClan": "Enroll Clan",
    "events.inviteFriendsTitle": "Invite Friends",
    "events.loadingFriends": "Loading friends...",
    "events.noFriendsAvailable": "You have no friends available to invite or everyone is already in the match.",
    "events.backToMatch": "Back to Match",
    "events.deleteEventConfirmTitle": "Delete Event?",
    "events.deleteEventConfirmDesc": "This action will permanently delete {title}. All participants will be removed and there will be no way to revert it.",
    "events.selectMembers": "Select Members",
    "events.selectMembersDesc": "The event has {spots} spots. Select who will participate.",
    "events.error.maxMembers": "You can only select up to {spots} members.",
    "events.join": "Join",
    "events.viewRoute": "View Route",
    "clans.title": "Clans",
    "clans.createClan": "Create Clan",
    "clans.joinClan": "Join Clan",
    "clans.myClan": "My Clan",
    "clans.captain": "Captain",
    "clans.members": "Members",
    "clans.search": "Search clans...",
    "clans.subtitle": "Your permanent team",
    "clans.noClans": "You do not belong to any clan",
    "clans.createFirst": "Create your first clan",
    "clans.form.name": "Clan Name",
    "clans.form.sport": "Main Sport",
    "clans.form.primaryColor": "Primary Color",
    "clans.form.secondaryColor": "Secondary Color",
    "clans.form.desc": "Description",
    "clans.btn.create": "Create Clan",
    "clans.btn.creating": "Creating...",
    "clans.join.title": "Join a Clan",
    "clans.join.desc": "Ask your team captain for the invite code and enter it below.",
    "clans.btn.join": "Request to Join",
    "clans.btn.joining": "Sending...",
    "clans.inviteCode": "Invite Code:",
    "clans.played": "Played",
    "clans.won": "Won",
    "clans.lost": "Lost",
    "clans.inviteFriends": "+ Invite Friends",
    "clans.leaveClan": "Leave Clan",
    "clans.editClan": "Edit Clan",
    "clans.requests": "Join Requests",
    "clans.noClansAvailable": "No clans available",
    "friends.title": "Friends",
    "friends.findPlayers": "Find Players",
    "friends.myFriends": "My Friends",
    "friends.noFriends": "No profiles available",
    "friends.findPlayersDescription": "Come back later or adjust your filters",
    "friends.resetList": "Reset",
    "friends.requests": "Received Requests",
    "friends.accept": "Accept",
    "friends.reject": "Reject",
    "friends.defaultName": "Athlete",
    "friends.unknownLocation": "Unknown location",
    "friends.noDescription": "No description",
    "friends.acceptedXp": "You accepted {name} as a friend! 🤝",
    "friends.sendingRequest": "Sending request...",
    "friends.connectingWith": "Connecting with",
    "friends.requestSent": "REQUEST SENT! 🤝",
    "friends.sent": "Sent!",
    "friends.requestDesc": "You have sent a match request to {name}. Wait for them to approve to see them in your friends list.",
    "friends.gotIt": "Got it!",
    "friends.problem": "There was a problem",
    "friends.errorDesc": "We couldn't send your request. Check your connection.",
    "friends.newMatch": "NEW MATCH! 🤝",
    "friends.requestAccepted": "REQUEST ACCEPTED!",
    "friends.nowFriends": "You and {name} are now friends! You earned +1 Charisma point.",
    "friends.forYou": "For you",
    "friends.loadingProfiles": "Loading real profiles...",
    "friends.compatible": "Compatible",
    "friends.makeMatch": "Make Match!",
    "friends.mySavedFriends": "My Saved Friends",
    "friends.friendsCount": "friends",
    "friends.searchPlaceholder": "Search friend by name, sport...",
    "friends.searchEmpty": "No friends found with that criteria",
    "friends.noFriendsAdded": "You have no friends added yet. Look for connections in the 'For you' tab!",
    "friends.sendMessage": "Send Message",
    "sports.search": "Search sports...",
    "sports.title": "Sports",
    "sports.all": "All",
    "sports.football": "Football",
    "sports.tennis": "Tennis",
    "sports.golf": "Golf",
    "sports.padel": "Padel",
    "sports.other": "Other",
    "common.back": "Back",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success!",
    "common.search": "Search...",
    "common.noResults": "No results",
    "common.years": "years",
    "common.used": "Used",
    "common.copied": "Copied",
    "common.copy": "Copy",
    "common.redeem": "Redeem",
    "common.add": "Add",
    "common.delete": "Delete",
    "common.close": "Close",
    "common.user": "User",
    // CreateEventForm
    "createEvent.title": "New event",
    "createEvent.subtitle": "Fill in the details to publish your event",
    "createEvent.sport": "Sport",
    "createEvent.intensity": "Intensity",
    "createEvent.date": "Date",
    "createEvent.time": "Time",
    "createEvent.facility": "Facility / Court",
    "createEvent.loadingCourts": "Loading available courts...",
    "createEvent.noCourts": "No courts registered in the app.",
    "createEvent.registerFirst": "Register a court first in the Courts section.",
    "createEvent.createCourt": "+ Create new court",
    "createEvent.selectCourt": "-- Select a court --",
    "createEvent.autoClan": "Auto-enroll Clan",
    "createEvent.noClan": "-- Don't enroll full clan --",
    "createEvent.enrollClan": "Enroll {name} ({count} members)",
    "createEvent.clanNote": "If you select a clan, all current members will be automatically enrolled in this event.",
    "createEvent.maxCapacity": "Max capacity",
    "createEvent.capacityPlaceholder": "E.g.: 12 players (optional)",
    "createEvent.description": "Description",
    "createEvent.descPlaceholder": "E.g.: Bring comfortable clothes, water and a positive attitude. (Max 150 chars)",
    "createEvent.publishing": "Publishing event…",
    "createEvent.publish": "Publish event",
    "createEvent.published": "EVENT PUBLISHED! ⚽",
    "createEvent.done": "Done!",
    "createEvent.successMsg": "Your match is on the map, ready for other players to join. Let's play!",
    "createEvent.understood": "Got it!",
    "createEvent.loginRequired": "You must log in to create an event.",
    "createEvent.emailError": "Could not get user email. Try logging out and back in.",
    "createEvent.error": "Error creating event",
    "createEvent.unexpectedError": "Unexpected error creating event.",
    "createEvent.err.sport": "Select a sport",
    "createEvent.err.intensity": "Select the intensity",
    "createEvent.err.date": "Date is required",
    "createEvent.err.time": "Time is required",
    "createEvent.err.court": "You must select a court",
    // EditProfile
    "editProfile.title": "Edit Profile",
    "editProfile.profilePhoto": "Profile photo",
    "editProfile.fullName": "Full name",
    "editProfile.namePlaceholder": "Your name",
    "editProfile.email": "Email address",
    "editProfile.emailNote": "Changing your email will send a confirmation message.",
    "editProfile.age": "Age",
    "editProfile.gender": "Gender",
    "editProfile.selectGender": "Select...",
    "editProfile.male": "Male",
    "editProfile.female": "Female",
    "editProfile.other": "Other",
    "editProfile.location": "Location (City/Area)",
    "editProfile.locationPlaceholder": "E.g. Chacao, Caracas",
    "editProfile.aboutMe": "About me (Description)",
    "editProfile.aboutPlaceholder": "Tell us a bit about yourself, your skill level, etc.",
    "editProfile.preferredSports": "Preferred sports",
    "editProfile.organizerMode": "Organizer Mode",
    "editProfile.organizerDesc": "Allows you to register and manage your own facilities and courts",
    "editProfile.saveChanges": "Save Changes",
    "editProfile.success": "Profile updated successfully",
    "editProfile.error": "Error updating profile",
    "editProfile.imgRequired": "You must select an image.",
    "editProfile.imgError": "Error uploading image",
    // EventCard
    "eventCard.free": "Free",
    "eventCard.spots": "spots",
    "eventCard.viewEvent": "View event",
    "eventCard.waitingRequest": "Waiting for approval",
    "eventCard.joinEvent": "Join event",
    // CanchasScreen
    "canchas.title": "Courts",
    "canchas.available": "Available courts",
    "canchas.selectForEvent": "Select a court for your event",
    "canchas.addCourt": "Add court",
    "canchas.add": "Add",
    "canchas.noCourts": "No courts yet",
    "canchas.beFirst": "Be the first to add a court",
    "canchas.addFirst": "Add first court",
    "canchas.addTitle": "Add court",
    "canchas.addSubtitle": "Register a new sports court",
    "canchas.name": "Name",
    "canchas.namePlaceholder": "E.g.: San Bernardino Court",
    "canchas.nameRequired": "Name is required",
    "canchas.sportRequired": "Select a sport",
    "canchas.locationRequired": "Choose a location on the map",
    "canchas.tapMap": "Tap the map to choose a location",
    "canchas.locationSelected": "Location selected",
    "canchas.description": "Description",
    "canchas.descPlaceholder": "Night lighting, locker rooms, parking...",
    "canchas.pricePerHour": "Price per hour (Bs.)",
    "canchas.pricePlaceholder": "E.g.: 50 (optional)",
    "canchas.saving": "Saving court…",
    "canchas.save": "Save court",
    "canchas.added": "Court added!",
    "canchas.addedDesc": "It now appears in the courts list",
    "canchas.loadingMap": "Loading map…",
    "canchas.searchingAddress": "Searching address...",
    // CanchaComments
    "comments.title": "Comments",
    "comments.loading": "Loading comments…",
    "comments.noComments": "No comments yet",
    "comments.beFirst": "Be the first to leave a comment about the conditions or accessibility of this court.",
    "comments.noCommentsYet": "Nobody has commented on this court yet.",
    "comments.player": "Player",
    "comments.verified": "Verified",
    "comments.checkingAccess": "Checking access…",
    "comments.loginToComment": "Log in to comment",
    "comments.shareOpinion": "Share your opinion about this court with the community.",
    "comments.loginRegister": "Log In / Register",
    "comments.restricted": "Restricted access",
    "comments.restrictedDesc": "You can only comment if you have participated or are participating in an event at this court. Join a match or create one here first!",
    "comments.placeholder": "Write your opinion about the court (lighting, condition, etc.)…",
    "comments.readyToComment": "Ready to comment",
    "comments.submitError": "Error sending comment.",
    // Auth
    "auth.welcomeBack": "Welcome",
    "auth.welcomeBackEmoji": "back 👋",
    "auth.createAccount": "Create your account",
    "auth.createAccountEmoji": "and start playing ⚡",
    "auth.loginSubtitle": "Log in to see and join events.",
    "auth.registerSubtitle": "Sign up for free. You'll be in within seconds.",
    "auth.fullName": "Full name",
    "auth.namePlaceholder": "E.g.: Diego Ramírez",
    "auth.registerAsOrganizer": "I want to register as an Organizer",
    "auth.email": "Email address",
    "auth.password": "Password",
    "auth.minChars": "Min. 6 characters",
    "auth.yourPassword": "Your password",
    "auth.forgotPassword": "Forgot your password?",
    "auth.loggingIn": "Logging in...",
    "auth.creatingAccount": "Creating account...",
    "auth.loggedIn": "Logged in!",
    "auth.accountCreated": "Account created!",
    "auth.login": "Log in",
    "auth.createFree": "Create free account",
    "auth.or": "or",
    "auth.noAccount": "Don't have an account? Sign up",
    "auth.hasAccount": "Already have an account? Log in",
    "auth.terms": "By continuing you accept TeamMatch's Terms of Use and Privacy Policy.",
    "auth.loggedInMsg": "Logged in! Entering...",
    "auth.accountCreatedMsg": "Account created! Welcome...",
    "auth.fillFields": "Please fill in all required fields.",
    "auth.enterName": "Enter your name to continue.",
    "auth.minPassword": "Password must be at least 6 characters.",
    "auth.err.invalidLogin": "Incorrect email or password. Check your info.",
    "auth.err.emailNotConfirmed": "Confirm your email before logging in.",
    "auth.err.alreadyRegistered": "An account with that email already exists. Try logging in.",
    "auth.err.weakPassword": "Password must be at least 6 characters.",
    "auth.err.invalidEmail": "Enter a valid email address.",
    "auth.err.rateLimit": "Too many attempts. Wait a few minutes and try again.",
    // MySports
    "mySports.title": "My sports",
    "mySports.subtitle": "Your stats and matches by sport",
    "mySports.match": "match",
    "mySports.matches": "matches",
    "mySports.noSports": "You haven't joined events for any sport yet",
    // CouponPopup
    "coupon.specialAd": "Special Announcement 📣",
    "coupon.copied": "Copied!",
    "coupon.copyHint": "*Click the code to copy it to the clipboard.",
    // Welcome
    "welcome.availableIn": "Available in Caracas",
    "welcome.nextMatch": "Your next",
    "welcome.awaits": "match awaits.",
    "welcome.subtitle": "Find sports events near you, join with a tap or create your own and build a team.",
    "welcome.liveMap": "Live map",
    "welcome.liveMapDesc": "Nearby events in real time",
    "welcome.joinEasy": "Join easily",
    "welcome.joinEasyDesc": "Request a spot in seconds",
    "welcome.byLevel": "By level",
    "welcome.byLevelDesc": "Play with people at your level",
    "welcome.startPlaying": "Start playing",
    "welcome.hasAccount": "I already have an account",
    "welcome.terms": "By continuing you accept the Terms and Privacy Policy",
    // LoginPrompt
    "loginPrompt.joinTo": "Join to {action}!",
    "loginPrompt.defaultAction": "perform this action",
    "loginPrompt.subtitle": "Create your free account and access all matches and courts in Caracas.",
    "loginPrompt.perk1": "Join matches near you",
    "loginPrompt.perk2": "Create events and build your team",
    "loginPrompt.perk3": "Earn XP and unlock rewards",
    "loginPrompt.perk4": "Matchmaking by level and sport",
    "loginPrompt.createFree": "Create Free Account",
    "loginPrompt.hasAccount": "I already have an account — Log In",
    "loginPrompt.notNow": "Not now, keep exploring",
    "map.distanceNear": "Near (≤ 5km)",
    "map.distanceMedium": "Medium (≤ 15km)",
    "map.distanceAny": "Any distance",
    "map.scheduledMatches": "Scheduled matches",
    "map.coordsNotAvailable": "Coordinates not available.",
    "map.loading": "Loading map...",
    "map.hub": "Sports Hub",
    "map.freeAccess": "Free access",
    "map.perHour": "hour",
    "map.commentsTitle": "Court comments",
    "map.commentsDesc": "Read reviews or write about this court",
    "map.noMatches": "No matches scheduled here",
    "map.createOne": "Go to Events tab to create one!",
    "map.players": "players",
    "map.myLocation": "My location",
    "map.gpsLoc": "My GPS location",
    "map.error.unsupported": "Your browser does not support geolocation",
    "map.error.failed": "Could not get your location",
    "map.error.denied": "Location permission denied",
    "map.error.unavailable": "Location not available",
    "map.error.timeout": "Timeout reached"
  },
  pt: {
    "settings.title": "Configurações",
    "settings.aesthetics": "Estética do App",
    "settings.language": "Idioma",
    "settings.gamePrefs": "Preferências de Jogo",
    "settings.rpgMode": "Modo RPG Ativo",
    "settings.rpgModeDesc": "Mostra níveis, XP, baús e atributos. Desligue para visão esportiva.",
    "settings.pushNotif": "Notificações Push",
    "settings.pushNotifDesc": "Avisos de partidas e convites de clãs.",
    "settings.distance": "Unidade de Distância",
    "settings.distanceDesc": "Para buscar eventos próximos.",
    "settings.logout": "Sair",
    "themes.light": "Claro",
    "themes.dark": "Escuro",
    "themes.neon": "Neon",
    "themes.nature": "Natureza",
    "themes.ocean": "Oceano",
    "nav.events": "Eventos",
    "nav.sports": "Esportes",
    "nav.map": "Mapa",
    "nav.friends": "Amigos",
    "nav.profile": "Perfil",
    "nav.clans": "Clãs",
    "profile.rpgActive": "Modo RPG Ativo",
    "profile.level": "Nível",
    "profile.xpPoints": "Pontos de Experiência",
    "profile.achievements": "Conquistas",
    "profile.progress": "Progresso",
    "profile.stats": "Stats",
    "profile.inventory": "Baú",
    "profile.history": "Histórico",
    "profile.logout": "Sair",
    "profile.editProfile": "Editar Perfil",
    "events.joinEvent": "Entrar na Partida",
    "events.createEvent": "Criar Evento",
    "events.noEvents": "Nenhum evento disponível",
    "events.search": "Buscar eventos...",
    "events.participants": "Participantes",
    "events.registerClan": "Inscrever meu Clã",
    "events.tab.upcoming": "Próximos",
    "events.tab.mine": "Minhas Partidas",
    "events.tab.requests": "Solicitações",
    "clans.title": "Clãs",
    "clans.createClan": "Criar Clã",
    "clans.joinClan": "Entrar num Clã",
    "clans.myClan": "Meu Clã",
    "clans.captain": "Capitão",
    "clans.members": "Membros",
    "common.back": "Voltar",
    "common.save": "Salvar",
    "common.cancel": "Cancelar",
    "common.loading": "Carregando...",
    "common.error": "Erro",
    "common.success": "Sucesso!",
    "common.search": "Buscar...",
    "common.noResults": "Sem resultados",
    "common.years": "anos"
  },
  fr: {
    "settings.title": "Paramètres",
    "settings.aesthetics": "Esthétique",
    "settings.language": "Langue",
    "settings.gamePrefs": "Préférences de Jeu",
    "settings.rpgMode": "Mode RPG Actif",
    "settings.rpgModeDesc": "Affiche niveaux, XP, coffres et stats.",
    "settings.pushNotif": "Notifications Push",
    "settings.pushNotifDesc": "Alertes de matchs et invitations de clan.",
    "settings.distance": "Unité de Distance",
    "settings.distanceDesc": "Pour trouver des événements à proximité.",
    "settings.logout": "Se Déconnecter",
    "themes.light": "Clair",
    "themes.dark": "Sombre",
    "themes.neon": "Néon",
    "themes.nature": "Nature",
    "themes.ocean": "Océan",
    "nav.events": "Événements",
    "nav.sports": "Sports",
    "nav.map": "Carte",
    "nav.friends": "Amis",
    "nav.profile": "Profil",
    "nav.clans": "Clans",
    "profile.rpgActive": "Mode RPG Actif",
    "profile.level": "Niveau",
    "profile.xpPoints": "Points d'Expérience",
    "profile.achievements": "Succès",
    "profile.progress": "Progrès",
    "profile.stats": "Stats",
    "profile.inventory": "Coffre",
    "profile.history": "Historique",
    "profile.logout": "Déconnexion",
    "profile.editProfile": "Modifier le Profil",
    "events.joinEvent": "Rejoindre le Match",
    "events.createEvent": "Créer un Événement",
    "events.noEvents": "Aucun événement disponible",
    "events.search": "Rechercher...",
    "events.participants": "Participants",
    "events.registerClan": "Inscrire mon Clan",
    "clans.title": "Clans",
    "clans.createClan": "Créer un Clan",
    "clans.joinClan": "Rejoindre un Clan",
    "clans.myClan": "Mon Clan",
    "clans.captain": "Capitaine",
    "clans.members": "Membres",
    "common.back": "Retour",
    "common.save": "Sauvegarder",
    "common.cancel": "Annuler",
    "common.loading": "Chargement...",
    "common.error": "Erreur",
    "common.success": "Succès !",
    "common.search": "Rechercher...",
    "common.noResults": "Aucun résultat",
    "common.years": "ans"
  },
  it: {
    "settings.title": "Impostazioni",
    "settings.aesthetics": "Estetica dell'App",
    "settings.language": "Lingua",
    "settings.gamePrefs": "Preferenze di Gioco",
    "settings.rpgMode": "Modalità RPG Attiva",
    "settings.rpgModeDesc": "Mostra livelli, XP, forzieri e statistiche.",
    "settings.pushNotif": "Notifiche Push",
    "settings.pushNotifDesc": "Avvisi di partite e inviti ai clan.",
    "settings.distance": "Unità di Distanza",
    "settings.distanceDesc": "Per trovare eventi vicini.",
    "settings.logout": "Esci",
    "themes.light": "Chiaro",
    "themes.dark": "Scuro",
    "themes.neon": "Neon",
    "themes.nature": "Natura",
    "themes.ocean": "Oceano",
    "nav.events": "Eventi",
    "nav.sports": "Sport",
    "nav.map": "Mappa",
    "nav.friends": "Amici",
    "nav.profile": "Profilo",
    "nav.clans": "Clan",
    "profile.rpgActive": "Modalità RPG Attiva",
    "profile.level": "Livello",
    "profile.xpPoints": "Punti Esperienza",
    "profile.achievements": "Obiettivi",
    "profile.progress": "Progresso",
    "profile.stats": "Stats",
    "profile.inventory": "Forziere",
    "profile.history": "Cronologia",
    "profile.logout": "Esci",
    "profile.editProfile": "Modifica Profilo",
    "events.joinEvent": "Unisciti alla Partita",
    "events.createEvent": "Crea Evento",
    "events.noEvents": "Nessun evento disponibile",
    "events.search": "Cerca eventi...",
    "events.participants": "Partecipanti",
    "events.registerClan": "Iscrivere il mio Clan",
    "clans.title": "Clan",
    "clans.createClan": "Crea Clan",
    "clans.joinClan": "Unisciti a un Clan",
    "clans.myClan": "Il mio Clan",
    "clans.captain": "Capitano",
    "clans.members": "Membri",
    "common.back": "Indietro",
    "common.save": "Salva",
    "common.cancel": "Annulla",
    "common.loading": "Caricamento...",
    "common.error": "Errore",
    "common.success": "Successo!",
    "common.search": "Cerca...",
    "common.noResults": "Nessun risultato",
    "common.years": "anni"
  },
  de: {
    "settings.title": "Einstellungen",
    "settings.aesthetics": "App-Ästhetik",
    "settings.language": "Sprache",
    "settings.gamePrefs": "Spieleinstellungen",
    "settings.rpgMode": "RPG-Modus Aktiv",
    "settings.rpgModeDesc": "Zeigt Level, XP, Truhen und Stats an.",
    "settings.pushNotif": "Push-Benachrichtigungen",
    "settings.pushNotifDesc": "Spielbenachrichtigungen und Clan-Einladungen.",
    "settings.distance": "Entfernungseinheit",
    "settings.distanceDesc": "Um Ereignisse in der Nähe zu finden.",
    "settings.logout": "Abmelden",
    "themes.light": "Hell",
    "themes.dark": "Dunkel",
    "themes.neon": "Neon",
    "themes.nature": "Natur",
    "themes.ocean": "Ozean",
    "nav.events": "Ereignisse",
    "nav.sports": "Sport",
    "nav.map": "Karte",
    "nav.friends": "Freunde",
    "nav.profile": "Profil",
    "nav.clans": "Clans",
    "profile.rpgActive": "RPG-Modus Aktiv",
    "profile.level": "Level",
    "profile.xpPoints": "Erfahrungspunkte",
    "profile.achievements": "Erfolge",
    "profile.progress": "Fortschritt",
    "profile.stats": "Stats",
    "profile.inventory": "Truhe",
    "profile.history": "Verlauf",
    "profile.logout": "Abmelden",
    "profile.editProfile": "Profil Bearbeiten",
    "events.joinEvent": "Spiel beitreten",
    "events.createEvent": "Ereignis erstellen",
    "events.noEvents": "Keine Ereignisse verfügbar",
    "events.search": "Suche...",
    "events.participants": "Teilnehmer",
    "events.registerClan": "Meinen Clan anmelden",
    "clans.title": "Clans",
    "clans.createClan": "Clan erstellen",
    "clans.joinClan": "Clan beitreten",
    "clans.myClan": "Mein Clan",
    "clans.captain": "Kapitän",
    "clans.members": "Mitglieder",
    "common.back": "Zurück",
    "common.save": "Speichern",
    "common.cancel": "Abbrechen",
    "common.loading": "Laden...",
    "common.error": "Fehler",
    "common.success": "Erfolg!",
    "common.search": "Suchen...",
    "common.noResults": "Keine Ergebnisse",
    "common.years": "Jahre"
  }
};
const SettingsContext = createContext({
  language: "es",
  setLanguage: () => {
  },
  theme: "light",
  setTheme: () => {
  },
  rpgMode: true,
  setRpgMode: () => {
  },
  notifications: true,
  setNotifications: () => {
  },
  unit: "km",
  setUnit: () => {
  },
  t: (key) => key
});
function SettingsProvider({ children }) {
  const [language, setLanguageState] = useState("es");
  const [theme, setThemeState] = useState("light");
  const [rpgMode, setRpgModeState] = useState(true);
  const [notifications, setNotificationsState] = useState(true);
  const [unit, setUnitState] = useState("km");
  useEffect(() => {
    const savedLang = localStorage.getItem("app-language");
    if (savedLang && translations[savedLang]) setLanguageState(savedLang);
    const savedTheme = localStorage.getItem("app-theme");
    if (savedTheme) setThemeState(savedTheme);
    const savedRpg = localStorage.getItem("app-rpg");
    if (savedRpg !== null) setRpgModeState(savedRpg !== "false");
    const savedNotif = localStorage.getItem("app-notifications");
    if (savedNotif !== null) setNotificationsState(savedNotif !== "false");
    const savedUnit = localStorage.getItem("app-unit");
    if (savedUnit) setUnitState(savedUnit);
  }, []);
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("dark", "theme-neon", "theme-nature", "theme-ocean");
    if (theme === "dark") html.classList.add("dark");
    else if (theme !== "light") html.classList.add(`theme-${theme}`);
    localStorage.setItem("app-theme", theme);
  }, [theme]);
  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem("app-language", lang);
  };
  const setTheme = (t2) => {
    setThemeState(t2);
  };
  const setRpgMode = (val) => {
    setRpgModeState(val);
    localStorage.setItem("app-rpg", val.toString());
  };
  const setNotifications = (val) => {
    setNotificationsState(val);
    localStorage.setItem("app-notifications", val.toString());
  };
  const setUnit = (val) => {
    setUnitState(val);
    localStorage.setItem("app-unit", val);
  };
  const t = (key) => {
    return translations[language]?.[key] ?? translations["es"][key] ?? key;
  };
  return /* @__PURE__ */ jsx(SettingsContext.Provider, { value: { language, setLanguage, theme, setTheme, rpgMode, setRpgMode, notifications, setNotifications, unit, setUnit, t }, children });
}
function useSettings() {
  return useContext(SettingsContext);
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
const LeafletMap$1 = lazy(
  () => import("./LeafletMap-C3F2iawj.js").then((m) => ({ default: m.default }))
);
function MapSkeleton$1() {
  const { t } = useSettings();
  return /* @__PURE__ */ jsx("div", { className: "h-full w-full animate-pulse bg-muted", children: /* @__PURE__ */ jsx("div", { className: "flex h-full items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-3 text-muted-foreground", children: [
    /* @__PURE__ */ jsx("div", { className: "h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" }),
    /* @__PURE__ */ jsx("span", { className: "text-xs font-medium", children: t("map.loading") || "Loading map…" })
  ] }) }) });
}
const sports = ["Todos", "Fútbol", "Tenis", "Golf", "Pádel"];
function parseLocation$2(location) {
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
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
function MapScreen({
  onSelect,
  userLocation: propUserLocation,
  setUserLocation: propSetUserLocation,
  onNavigateToComments,
  onNavigateToProfile
}) {
  const { t } = useSettings();
  const [active, setActive] = useState("Todos");
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [distanceLevel, setDistanceLevel] = useState("Cualquier distancia");
  const [events, setEvents] = useState([]);
  const [canchas, setCanchas] = useState([]);
  const [selectedCancha, setSelectedCancha] = useState(null);
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
        const coords = parseLocation$2(c.location);
        console.log(`📍 Cancha "${c.name}" coords:`, coords);
        return { ...c, lat: coords?.lat ?? null, lng: coords?.lng ?? null };
      });
      setCanchas(processedCanchas);
    }
    const { data, error } = await supabase.from("events").select("*, canchas(name)").order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching events:", error);
      return;
    }
    if (data) {
      const processed = data.map((row) => {
        const coords = parseLocation$2(row.location);
        const lat = coords?.lat ?? 0;
        const lng = coords?.lng ?? 0;
        const sportName = row.sport_id === 1 ? t("sports.football") || "Fútbol" : row.sport_id === 2 ? t("sports.tennis") || "Tenis" : row.sport_id === 3 ? t("sports.golf") || "Golf" : row.sport_id === 4 ? t("sports.padel") || "Pádel" : t("sports.other") || "Otro";
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
          canchas: row.canchas,
          cancha_name: row.canchas?.name,
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
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (active !== "Todos" && e.sport !== active) return false;
      if (selectedDate && e.event_date) {
        if (!e.event_date.startsWith(selectedDate)) return false;
      }
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
      if (selectedSport && selectedSport !== "Todos") {
        const sportIdMap = {
          "Fútbol": 1,
          "Tenis": 2,
          "Golf": 3,
          "Pádel": 4
        };
        const targetId = sportIdMap[selectedSport];
        if (c.sport_id !== targetId && c.sport !== selectedSport) return false;
      }
      if (selectedDate) {
        if (c.lat == null || c.lng == null) return false;
        const hasEventOnDate = filteredEvents.some((e) => {
          if (e.lat == null || isNaN(e.lat) || e.lng == null || isNaN(e.lng)) return false;
          const diffLat = Math.abs(e.lat - c.lat);
          const diffLng = Math.abs(e.lng - c.lng);
          return diffLat < 1e-4 && diffLng < 1e-4;
        });
        if (!hasEventOnDate) return false;
      }
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
  return /* @__PURE__ */ jsxs("div", { className: "relative h-full overflow-hidden bg-muted", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 z-0", children: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(MapSkeleton$1, {}), children: /* @__PURE__ */ jsx(
      LeafletMap$1,
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
      /* @__PURE__ */ jsxs("div", { className: "w-full flex gap-3 overflow-x-auto px-4 pb-4 pointer-events-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x", children: [
        sports.map((s) => {
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
              children: s === "Todos" ? t("sports.all") || "Todos" : t(`sports.${s.toLowerCase().replace("ú", "u").replace("á", "a")}`) || s
            },
            s
          );
        }),
        /* @__PURE__ */ jsx("div", { className: "snap-center shrink-0 flex items-center bg-background/95 text-secondary border-transparent hover:bg-background backdrop-blur-md rounded-3xl px-5 py-3 text-sm font-black tracking-wide shadow-xl transition-all border-2", children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "date",
            value: selectedDate,
            onChange: (e) => setSelectedDate(e.target.value),
            className: "bg-transparent outline-none cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 hover:[&::-webkit-calendar-picker-indicator]:opacity-100"
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "snap-center shrink-0 flex items-center bg-background/95 text-secondary border-transparent hover:bg-background backdrop-blur-md rounded-3xl px-5 py-3 text-sm font-black tracking-wide shadow-xl transition-all border-2", children: /* @__PURE__ */ jsxs(
          "select",
          {
            value: distanceLevel,
            onChange: (e) => setDistanceLevel(e.target.value),
            className: "bg-transparent outline-none cursor-pointer font-black",
            children: [
              /* @__PURE__ */ jsx("option", { value: "Cerca", children: t("map.distanceNear") || "Cerca (≤ 5km)" }),
              /* @__PURE__ */ jsx("option", { value: "Medio", children: t("map.distanceMedium") || "Medio (≤ 15km)" }),
              /* @__PURE__ */ jsx("option", { value: "Cualquier distancia", children: t("map.distanceAny") || "Cualquier distancia" })
            ]
          }
        ) })
      ] })
    ] }),
    selectedCancha && /* @__PURE__ */ jsxs("div", { className: "absolute bottom-0 inset-x-0 z-40 bg-background rounded-t-3xl shadow-2xl px-5 pt-4 pb-10 border-t border-border animate-in slide-in-from-bottom duration-300", children: [
      /* @__PURE__ */ jsx("div", { className: "mx-auto mb-4 h-1 w-10 rounded-full bg-muted-foreground/20" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-200", children: [
            /* @__PURE__ */ jsx(MapPin, { size: 10 }),
            " ",
            t("map.hub") || "Hub Deportivo"
          ] }),
          /* @__PURE__ */ jsx("h3", { className: "mt-1.5 text-base font-extrabold text-secondary tracking-tight", children: selectedCancha.name }),
          selectedCancha.description && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-0.5 line-clamp-1", children: selectedCancha.description }),
          selectedCancha.price != null && selectedCancha.price > 0 ? /* @__PURE__ */ jsxs("p", { className: "text-xs font-semibold text-primary mt-1", children: [
            "Bs. ",
            selectedCancha.price,
            "/",
            t("map.perHour") || "hora"
          ] }) : /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-emerald-600 mt-1", children: t("map.freeAccess") || "Acceso gratuito" })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setSelectedCancha(null),
            className: "grid h-8 w-8 place-items-center rounded-full bg-muted text-secondary hover:bg-muted/80 transition-colors",
            "aria-label": t("common.close") || "Cerrar",
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
                /* @__PURE__ */ jsx("div", { className: "font-bold text-xs text-secondary", children: t("map.commentsTitle") || "Comentarios de la cancha" }),
                /* @__PURE__ */ jsx("div", { className: "text-[10px] text-muted-foreground mt-0.5", children: t("map.commentsDesc") || "Mira opiniones o escribe sobre esta cancha" })
              ] })
            ] }),
            /* @__PURE__ */ jsx(ChevronRight, { size: 16, className: "text-muted-foreground group-hover:translate-x-0.5 transition-transform" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "mt-5 space-y-3", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground", children: t("map.scheduledMatches") || "Partidos programados" }),
        (() => {
          if (selectedCancha.lat == null || selectedCancha.lng == null) return /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: t("map.coordsNotAvailable") || "Coordenadas no disponibles." });
          const canchaEvents = filteredEvents.filter((e) => {
            if (e.lat == null || isNaN(e.lat) || e.lng == null || isNaN(e.lng)) return false;
            const diffLat = Math.abs(e.lat - selectedCancha.lat);
            const diffLng = Math.abs(e.lng - selectedCancha.lng);
            return diffLat < 1e-4 && diffLng < 1e-4;
          });
          if (canchaEvents.length === 0) {
            return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-dashed border-border p-6 text-center", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-muted-foreground mb-1", children: t("map.noMatches") || "No hay partidos programados aquí" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: t("map.createOne") || "¡Ve a la pestaña Eventos para crear uno!" })
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
                    " ",
                    t("map.players") || "jugadores"
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
        "aria-label": t("map.myLocation") || "Mi ubicación",
        title: t("map.gpsLoc") || "Mi ubicación GPS",
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
          children: t("common.close") || "Cerrar"
        }
      )
    ] }) })
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
  const { t } = useSettings();
  if (!isOpen) return null;
  const defaultAction = t("loginPrompt.defaultAction") || "realizar esta acción";
  const finalContext = actionContext === "realizar esta acción" ? defaultAction : actionContext;
  const perks = [
    { icon: MapPin, text: t("loginPrompt.perk1") || "Únete a partidos cerca de ti" },
    { icon: Users, text: t("loginPrompt.perk2") || "Crea eventos y arma tu equipo" },
    { icon: Trophy, text: t("loginPrompt.perk3") || "Gana XP y desbloquea recompensas" },
    { icon: Zap, text: t("loginPrompt.perk4") || "Matchmaking por nivel y deporte" }
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
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-black text-white leading-tight", children: t("loginPrompt.joinTo") ? t("loginPrompt.joinTo").replace("{action}", finalContext) : `¡Únete para ${finalContext}!` }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-white/60 leading-relaxed max-w-[280px] mx-auto", children: t("loginPrompt.subtitle") || "Crea tu cuenta gratis y accede a todos los partidos y canchas de Caracas." })
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
                t("loginPrompt.createFree") || "Crear Cuenta Gratis",
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
              children: t("loginPrompt.hasAccount") || "Ya tengo cuenta — Iniciar Sesión"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: onClose,
            className: "w-full text-center text-xs text-white/30 hover:text-white/50 transition-colors py-1",
            children: t("loginPrompt.notNow") || "Ahora no, seguir explorando"
          }
        )
      ] })
    ] }) })
  ] });
}
const EventMiniMap = lazy(() => import("./EventMiniMap-fC0nXxB3.js"));
function EventDetailScreen({
  event,
  onBack,
  userLocation,
  onOpenAuth
}) {
  const { t } = useSettings();
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
  const [inviteFriends, setInviteFriends] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(null);
  const [hostProfile, setHostProfile] = useState(null);
  const [myCaptainedClans, setMyCaptainedClans] = useState([]);
  const [registeringClan, setRegisteringClan] = useState(false);
  const [showClanMemberSelectModal, setShowClanMemberSelectModal] = useState(false);
  const [clanToJoin, setClanToJoin] = useState(null);
  const [selectableClanMembers, setSelectableClanMembers] = useState([]);
  const [selectedClanMemberIds, setSelectedClanMemberIds] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
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
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUser(data.user);
      if (data.user?.id) {
        supabase.from("clans").select("*, clan_members(*)").eq("captain_id", data.user.id).then((res) => {
          if (res.data) setMyCaptainedClans(res.data);
        });
      }
    });
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
    const { data, error } = await supabase.from("event_participants").select("*, profiles(username, rating, avatar_url), clans(hex_primary, hex_secondary)").eq("event_id", event.id);
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
      if (error.code === "23505") alert(t("events.error.alreadyApplied") || "Ya enviaste una solicitud");
      else alert(`${t("events.error.joinError") || "Error al solicitar unirse"}: ${error.message || JSON.stringify(error)}`);
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
  async function handleJoinAsClan(clan) {
    if (!currentUser || !currentUser.email) {
      setShowLoginPrompt(true);
      return;
    }
    setRegisteringClan(true);
    const members = clan.clan_members.filter((m) => m.status === "approved");
    const emptySpots2 = Math.max(0, event.spots - participants.filter((p) => p.status === "approved" || p.status === "aceptado" || p.status === "aprobado" || !p.status).length);
    if (members.length > emptySpots2) {
      setClanToJoin(clan);
      setSelectableClanMembers(members);
      setSelectedClanMemberIds([]);
      setShowClanMemberSelectModal(true);
      setRegisteringClan(false);
      return;
    }
    await executeClanJoin(clan, members);
  }
  async function executeClanJoin(clan, members) {
    setRegisteringClan(true);
    try {
      const { data: profiles } = await supabase.from("profiles").select("id, username").in("id", members.map((m) => m.user_id));
      if (!profiles) throw new Error("No profiles found");
      const existingUsernames = participants.map((p) => p.user_username);
      const insertData = profiles.filter((p) => !existingUsernames.includes(p.username)).map((p) => ({
        event_id: event.id,
        user_username: p.username,
        status: "aceptado",
        clan_id: clan.id
      }));
      if (insertData.length === 0) {
        alert(t("events.error.allClanMembersEnrolled") || "Todos los miembros seleccionados ya están inscritos en este evento");
        setRegisteringClan(false);
        return;
      }
      const { error } = await supabase.from("event_participants").insert(insertData);
      if (error) {
        if (error.code === "23505") alert(t("events.error.someClanMembersEnrolled") || "Algunos miembros ya están inscritos en este evento");
        else throw error;
      } else {
        setShowSuccess(true);
        setShowClanMemberSelectModal(false);
        fetchParticipants();
        setTimeout(() => setShowSuccess(false), 2e3);
      }
    } catch (err) {
      console.error(err);
      alert((t("events.error.joinClanError") || "Error al inscribir al clan: ") + (err.message || JSON.stringify(err)));
    }
    setRegisteringClan(false);
  }
  async function handleDeleteEvent() {
    if (!currentUser || !isHost) return;
    setDeleting(true);
    try {
      await supabase.from("event_participants").delete().eq("event_id", event.id);
      const { error } = await supabase.from("events").delete().eq("id", event.id);
      if (error) throw error;
      setShowDeleteConfirm(false);
      onBack();
    } catch (err) {
      alert((t("events.error.deleteEvent") || "Error al eliminar el evento: ") + err.message);
    }
    setDeleting(false);
  }
  async function handleAction(participantId, status) {
    if (!currentUser?.email || currentUser.email !== event.host && currentUser.email !== event.hostName) {
      alert(t("events.error.onlyHostCanAccept") || "Solo el creador del evento puede aceptar o rechazar solicitudes.");
      return;
    }
    setActionLoading(participantId.toString());
    const { error } = await supabase.from("event_participants").update({ status }).eq("id", participantId);
    if (!error) {
      alert(t("events.success.actionComplete")?.replace("{action}", status === "aceptado" ? "aceptado" : "rechazado") || `Has ${status === "aceptado" ? "aceptado" : "rechazado"} la solicitud.`);
      fetchParticipants();
    } else {
      alert(t("events.error.updateRequest") || "Error al actualizar la solicitud");
    }
    setActionLoading(null);
  }
  async function fetchFriends() {
    if (!currentUser?.id) return;
    setLoadingFriends(true);
    try {
      const { data: requestsData } = await supabase.from("friend_requests").select("*").or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`).eq("status", "accepted");
      const friendIds = (requestsData || []).map(
        (r) => r.sender_id === currentUser.id ? r.receiver_id : r.sender_id
      );
      if (friendIds.length > 0) {
        const { data: profiles } = await supabase.from("profiles").select("*").in("id", friendIds);
        if (profiles) {
          const mapped = profiles.map((p) => {
            const idHash = p.id ? p.id.split("-").join("") : p.username;
            let charCodeSum = 0;
            for (let i = 0; i < idHash.length; i++) charCodeSum += idHash.charCodeAt(i);
            const emojis = ["🏃‍♂️", "🎯", "🥊", "🏄", "🧗‍♀️", "🛹", "🪼", "🪨", "🐾", "🐺"];
            const gradients = ["from-pink-500 to-rose-400", "from-emerald-500 to-teal-400", "from-blue-500 to-cyan-400", "from-purple-500 to-indigo-400", "from-amber-500 to-orange-400", "from-sky-500 to-blue-600", "from-orange-400 to-red-500"];
            let name = p.full_name || "";
            if (!name && p.username?.includes("@")) {
              name = p.username.split("@")[0].split(".").map((n) => n.charAt(0).toUpperCase() + n.slice(1)).join(" ");
            }
            return {
              id: p.id,
              name: name || p.username || "Deportista",
              username: p.username,
              location: p.location || "Ubicación desconocida",
              avatar_url: p.avatar_url,
              emoji: emojis[charCodeSum % emojis.length],
              gradient: gradients[charCodeSum % gradients.length],
              sports: p.preferred_sports || []
            };
          });
          setInviteFriends(mapped);
        }
      } else {
        setInviteFriends([]);
      }
    } catch (err) {
      console.error("Error fetching friends for invite:", err);
    } finally {
      setLoadingFriends(false);
    }
  }
  async function handleInviteFriend(friend) {
    const friendEmail = friend.username;
    if (!friendEmail) return;
    const invitationStatus = isHost ? "aceptado" : "pendiente";
    try {
      const { error } = await supabase.from("event_participants").insert({
        event_id: event.id,
        user_username: friendEmail,
        status: invitationStatus
      });
      if (error) {
        if (error.code === "23505") {
          setInviteSuccess(t("events.error.alreadyInMatch")?.replace("{name}", friend.name) || `${friend.name} ya está en el partido.`);
        } else {
          throw error;
        }
      } else {
        setInviteSuccess(
          invitationStatus === "aceptado" ? t("events.success.addedToMatch")?.replace("{name}", friend.name) || `¡${friend.name} ha sido agregado al partido!` : t("events.success.requestSentTo")?.replace("{name}", friend.name) || `¡Solicitud enviada a ${friend.name}!`
        );
        fetchParticipants();
      }
      setTimeout(() => setInviteSuccess(null), 3e3);
    } catch (e) {
      console.error("Error inviting friend:", e);
      setInviteSuccess(t("events.error.inviteError")?.replace("{name}", friend.name) || `Error al invitar a ${friend.name}.`);
      setTimeout(() => setInviteSuccess(null), 3e3);
    }
  }
  async function handleLeave() {
    if (!currentUser?.email) return;
    const confirmLeave = confirm(t("events.confirmLeave") || "¿Estás seguro de que deseas salirte de este partido?");
    if (!confirmLeave) return;
    try {
      const { error } = await supabase.from("event_participants").delete().eq("event_id", event.id).eq("user_username", currentUser.email);
      if (error) throw error;
      fetchParticipants();
    } catch (e) {
      console.error("Error leaving event:", e);
      setParticipants((prev) => prev.filter((p) => p.user_username !== currentUser.email));
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
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-secondary", children: t("events.success.requestSentTitle") || "¡Solicitud enviada!" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: t("events.success.requestSentDesc")?.replace("{sport}", event.sport) || `Tu solicitud para unirte al partido de ${event.sport} ha sido enviada con éxito.` })
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
        actionContext: t("eventCard.joinEvent")?.toLowerCase() || "unirte al partido"
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "relative h-64 w-full overflow-hidden", children: [
      /* @__PURE__ */ jsx("img", { src: event.image, alt: event.title, className: "h-full w-full object-cover" }),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background via-background/30 to-secondary/40" }),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-12", children: /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onBack,
          className: "grid h-10 w-10 place-items-center rounded-full glass shadow-soft",
          children: /* @__PURE__ */ jsx(ArrowLeft, { size: 18, className: "text-secondary" })
        }
      ) }),
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
          /* @__PURE__ */ jsx("div", { className: "text-[11px] font-medium text-muted-foreground", children: t("profile.organizer") || "Organizador" }),
          /* @__PURE__ */ jsx("div", { className: "text-sm font-bold text-secondary", children: event.host })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-xs font-bold text-secondary", children: [
          /* @__PURE__ */ jsx(Star, { size: 14, className: "fill-accent text-accent" }),
          " 4.8"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-3 items-stretch", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex h-full flex-col justify-center gap-3 rounded-2xl bg-card p-4 shadow-soft", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(Calendar, { size: 16, className: "text-primary shrink-0" }),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsx("div", { className: "text-[10px] font-medium text-muted-foreground uppercase tracking-wider", children: t("events.date") || "Fecha" }),
              /* @__PURE__ */ jsx("div", { className: "truncate text-sm font-bold text-secondary", children: event.date })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(Clock, { size: 16, className: "text-primary shrink-0" }),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsx("div", { className: "text-[10px] font-medium text-muted-foreground uppercase tracking-wider", children: t("events.time") || "Hora" }),
              /* @__PURE__ */ jsx("div", { className: "truncate text-sm font-bold text-secondary", children: event.time })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(MapPin, { size: 16, className: "text-primary shrink-0" }),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsx("div", { className: "text-[10px] font-medium text-muted-foreground uppercase tracking-wider", children: t("events.location") || "Lugar" }),
              /* @__PURE__ */ jsx("div", { className: "truncate text-sm font-bold text-secondary", title: event.canchas?.name || event.cancha_name || event.place_name || event.zone || event.location, children: event.canchas?.name || event.cancha_name || event.place_name || event.zone || event.location })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(Users, { size: 16, className: "text-primary shrink-0" }),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsx("div", { className: "text-[10px] font-medium text-muted-foreground uppercase tracking-wider", children: t("events.spots") || "Cupos" }),
              /* @__PURE__ */ jsxs("div", { className: "truncate text-sm font-bold text-secondary", children: [
                approvedPlayers.length,
                "/",
                event.spots
              ] })
            ] })
          ] })
        ] }),
        event.lat && event.lng ? /* @__PURE__ */ jsx("div", { className: "h-full min-h-[160px] w-full rounded-2xl overflow-hidden shadow-soft relative z-0", children: /* @__PURE__ */ jsx(
          Suspense,
          {
            fallback: /* @__PURE__ */ jsx("div", { className: "h-full min-h-[160px] w-full rounded-2xl bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsx(Loader2, { size: 20, className: "animate-spin text-muted-foreground" }) }),
            children: /* @__PURE__ */ jsx(EventMiniMap, { lat: event.lat, lng: event.lng })
          }
        ) }) : /* @__PURE__ */ jsx("div", { className: "h-full min-h-[160px] w-full rounded-2xl bg-muted flex items-center justify-center border border-dashed border-border text-[10px] text-muted-foreground text-center p-2", children: t("events.locationNotAvailable") ? t("events.locationNotAvailable").split("\\n").map((line, i) => /* @__PURE__ */ jsxs("span", { children: [
          line,
          /* @__PURE__ */ jsx("br", {})
        ] }, i)) : /* @__PURE__ */ jsxs(Fragment, { children: [
          "Ubicación no",
          /* @__PURE__ */ jsx("br", {}),
          "disponible"
        ] }) })
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
            /* @__PURE__ */ jsx("span", { children: t("events.howToGetThere") || "Cómo llegar con Google Maps" }),
            userLocation ? /* @__PURE__ */ jsx("span", { className: "ml-1 rounded-full bg-primary/20 px-2 py-0.5 text-[9px] font-bold text-primary animate-pulse", children: t("events.realTime") || "En tiempo real" }) : /* @__PURE__ */ jsx("span", { className: "ml-1 rounded-full bg-muted px-2 py-0.5 text-[9px] font-medium text-muted-foreground", children: t("events.fromYourLocation") || "Desde tu ubicación" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "mb-2 text-sm font-bold text-secondary", children: t("events.description") || "Descripción" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed text-muted-foreground", children: event.description_after_arrival || t("events.defaultDescription") || "Partido amistoso, cancha sintética con luces. Trae ropa cómoda y agua. Se aceptan jugadores con experiencia, ambiente respetuoso y competitivo." })
      ] }),
      pendingRequests.length > 0 && currentUser?.email && (currentUser.email === event.host || currentUser.email === event.hostName) && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("h3", { className: "mb-3 text-sm font-bold text-secondary flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] text-white", children: pendingRequests.length }),
          t("events.pendingRequests") || "Solicitudes pendientes"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-2", children: pendingRequests.map((req) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-2xl border border-border bg-card p-3 shadow-soft", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            renderAvatar(req.user_username || "Usuario", "h-10 w-10", req.profiles?.avatar_url),
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
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-secondary", children: t("events.approvedPlayers") || "Jugadores aprobados" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            currentUser && /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => {
                  fetchFriends();
                  setShowInviteModal(true);
                },
                className: "rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 text-primary px-3 py-1.5 text-xs font-black transition-all active:scale-95 shadow-sm cursor-pointer flex items-center gap-1",
                children: [
                  /* @__PURE__ */ jsx(UserPlus, { size: 12 }),
                  " ",
                  t("events.inviteFriends") || "Invitar Amigos"
                ]
              }
            ),
            /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
              emptySpots,
              " ",
              t("events.spotsAvailable") || "cupos disponibles"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: loading ? /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: t("events.loadingPlayers") || "Cargando jugadores..." }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          approvedPlayers.map((p, i) => /* @__PURE__ */ jsxs("div", { title: p.user_username, className: "relative", children: [
            renderAvatar(p.user_username || "Usuario", "h-10 w-10", p.profiles?.avatar_url),
            p.clan_id && /* @__PURE__ */ jsx("div", { className: "absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-secondary flex items-center justify-center shadow-sm", title: t("clans.member") || "Miembro de Clan", children: /* @__PURE__ */ jsx("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("path", { d: "M20.38 3.46 16 2a8.59 8.59 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z", fill: p.clans?.hex_primary || "#32CD32", stroke: p.clans?.hex_secondary || "#1a1a1a" }) }) })
          ] }, p.id || i)),
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
      showFloatXp && /* @__PURE__ */ jsx("div", { className: "float-xp absolute left-1/2 -translate-x-1/2 -top-12 z-50", children: "+15 XP ⚡" }),
      event.price > 0 && activeCoupons.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mb-3 flex items-center justify-between gap-2 border-b border-border/60 pb-3", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-black uppercase text-muted-foreground flex items-center gap-1", children: [
          "📜 ",
          t("events.applyCoupon") || "Aplicar Cupón RPG:"
        ] }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: selectedCouponCode,
            onChange: (e) => setSelectedCouponCode(e.target.value),
            className: "text-xs font-bold text-secondary border border-border bg-card/85 rounded-xl px-2 py-1 outline-none focus:border-primary shrink-0 max-w-[200px]",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: t("events.noCoupon") || "-- Sin cupón --" }),
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
            t("events.contribution") || "Aporte",
            " ",
            selectedCouponCode && /* @__PURE__ */ jsx("span", { className: "text-[9px] font-extrabold text-primary bg-primary/10 px-1 rounded-full", children: appliedDiscountText })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-lg font-bold text-secondary", children: [
            finalPrice === 0 ? t("events.free") || "Gratis" : `$${finalPrice.toFixed(2)} USD`,
            selectedCouponCode && /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-muted-foreground line-through ml-1.5", children: [
              "$",
              event.price
            ] })
          ] })
        ] }),
        isHost ? /* @__PURE__ */ jsxs("div", { className: "ml-auto flex flex-col gap-2 flex-1", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              disabled: true,
              className: "w-full rounded-2xl py-3 text-sm font-bold bg-primary text-secondary cursor-default select-none shadow-soft text-center",
              children: t("events.youAreHost") || "Eres el organizador 👑"
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setShowDeleteConfirm(true),
              className: "w-full rounded-2xl py-3 text-sm font-black bg-rose-500/10 text-rose-500 border border-rose-500/30 hover:bg-rose-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2",
              children: [
                /* @__PURE__ */ jsx(Trash2, { size: 14 }),
                t("events.deleteEvent") || "Eliminar Evento"
              ]
            }
          )
        ] }) : isUserApproved ? /* @__PURE__ */ jsx(
          "button",
          {
            disabled: joining,
            onClick: handleLeave,
            className: "ml-auto flex-1 rounded-2xl py-3.5 text-sm font-bold bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 active:scale-[0.98] transition-all text-center cursor-pointer",
            children: t("events.leaveMatch") || "Salir del partido 🚪"
          }
        ) : isUserPending ? /* @__PURE__ */ jsx(
          "button",
          {
            disabled: joining,
            onClick: handleLeave,
            className: "ml-auto flex-1 rounded-2xl py-3.5 text-sm font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-red-500/10 hover:text-red-500 active:scale-[0.98] transition-all text-center cursor-pointer",
            children: t("events.cancelRequest") || "Cancelar solicitud ✖️"
          }
        ) : /* @__PURE__ */ jsx(
          "button",
          {
            disabled: joining || emptySpots === 0,
            onClick: handleJoin,
            className: `ml-auto flex-1 rounded-2xl py-3.5 text-sm font-bold shadow-pop active:scale-[0.98] transition-all disabled:opacity-90 cursor-pointer ${emptySpots === 0 ? "bg-muted text-muted-foreground cursor-not-allowed" : "gradient-primary text-secondary"}`,
            children: joining ? t("events.sending") || "Enviando..." : emptySpots === 0 ? t("events.eventFull") || "Evento Lleno" : t("events.requestToJoin") || "Solicitar unirme"
          }
        ),
        myCaptainedClans.filter((c) => c.sport === event.sport).map((clan) => /* @__PURE__ */ jsx(
          "button",
          {
            disabled: joining || registeringClan || emptySpots === 0,
            onClick: () => handleJoinAsClan(clan),
            className: `ml-auto flex-1 rounded-2xl py-3.5 text-sm font-bold shadow-pop active:scale-[0.98] transition-all disabled:opacity-90 cursor-pointer ${emptySpots === 0 ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-emerald-500 hover:bg-emerald-600 text-white"}`,
            children: registeringClan ? t("events.enrolling") || "Inscribiendo..." : `${t("events.enrollClan") || "Inscribir Clan"} ${clan.name}`
          },
          clan.id
        ))
      ] })
    ] }),
    showInviteModal && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-6 py-4 animate-in fade-in duration-300", children: /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-sm rounded-3xl bg-secondary border border-primary/30 p-6 shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[80vh]", children: [
      /* @__PURE__ */ jsxs("h3", { className: "text-lg font-black text-white flex items-center gap-2 border-b border-white/10 pb-3", children: [
        /* @__PURE__ */ jsx(Users, { size: 20, className: "text-primary animate-pulse" }),
        " ",
        t("events.inviteFriendsTitle") || "Invitar Amigos"
      ] }),
      inviteSuccess && /* @__PURE__ */ jsx("div", { className: "mt-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 px-3 py-2 text-xs font-bold text-emerald-400 text-center animate-in fade-in duration-200", children: inviteSuccess }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto py-4 space-y-2 pr-1", children: loadingFriends ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center gap-2 py-8", children: [
        /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin text-primary" }),
        /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: t("events.loadingFriends") || "Cargando amigos..." })
      ] }) : (() => {
        const nonParticipantFriends = inviteFriends.filter((friend) => {
          return !participants.some((p) => p.user_username === friend.username);
        });
        if (nonParticipantFriends.length === 0) {
          return /* @__PURE__ */ jsx("div", { className: "text-center text-xs text-muted-foreground py-8", children: t("events.noFriendsAvailable") || "No tienes amigos disponibles para invitar o todos ya están en el partido." });
        }
        return nonParticipantFriends.map((friend) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between bg-card p-3 rounded-2xl border border-border shadow-soft", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
            friend.avatar_url ? /* @__PURE__ */ jsx("img", { src: friend.avatar_url, alt: friend.name, className: "h-9 w-9 rounded-full object-cover shadow-sm shrink-0" }) : /* @__PURE__ */ jsx("div", { className: `h-9 w-9 rounded-full bg-gradient-to-tr ${friend.gradient} grid place-items-center text-base shadow-sm shrink-0`, children: friend.emoji }),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs font-bold text-secondary truncate", children: friend.name }),
              /* @__PURE__ */ jsx("div", { className: "text-[9px] text-muted-foreground", children: friend.location })
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleInviteFriend(friend),
              className: "rounded-xl gradient-primary text-secondary px-3 py-1.5 text-[10px] font-black transition-all active:scale-95 shadow-sm cursor-pointer",
              children: t("common.add") || "Agregar"
            }
          )
        ] }, friend.id));
      })() }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setShowInviteModal(false),
          className: "w-full rounded-2xl bg-muted py-3 text-xs font-black uppercase tracking-wider text-muted-foreground shadow-sm hover:bg-muted/80 transition-all mt-2 cursor-pointer",
          children: t("common.close") || "Cerrar"
        }
      )
    ] }) }),
    selectedUserProfile && (() => {
      const formatted = getFormattedProfile$1(selectedUserProfile);
      if (!formatted) return null;
      return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 px-6 py-4 animate-in fade-in duration-300", children: /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-sm rounded-3xl bg-secondary border border-primary/30 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col", children: [
        /* @__PURE__ */ jsx("div", { className: `h-24 w-full bg-gradient-to-tr ${formatted.gradient} relative shrink-0` }),
        /* @__PURE__ */ jsx("div", { className: "absolute top-10 left-6", children: /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsx("div", { className: "h-16 w-16 rounded-full bg-card p-1 shadow-md ring-4 ring-secondary", children: formatted.avatar_url ? /* @__PURE__ */ jsx("img", { src: formatted.avatar_url, alt: "Avatar", className: "h-full w-full rounded-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: `h-full w-full rounded-full bg-gradient-to-tr ${formatted.gradient} grid place-items-center text-2xl`, children: formatted.emoji }) }) }) }),
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
              formatted.is_organizer && /* @__PURE__ */ jsx("span", { className: "inline-flex items-center gap-0.5 rounded-full bg-amber-500/20 px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-amber-500 border border-amber-500/30", children: t("profile.organizer") || "Organizador" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] text-white/50", children: formatted.username })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-2.5 py-1 text-xs font-bold text-primary", children: [
            /* @__PURE__ */ jsx(Star, { size: 12, className: "fill-primary text-primary" }),
            " ",
            formatted.rating.toFixed(2),
            " ",
            t("profile.rating") || "Reputación"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 text-center text-xs", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-white/5 p-2 rounded-xl border border-white/10", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[9px] text-white/50 block font-bold", children: t("profile.age") || "Edad" }),
              /* @__PURE__ */ jsxs("span", { className: "font-extrabold text-white", children: [
                formatted.age,
                " ",
                t("common.years") || "años"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white/5 p-2 rounded-xl border border-white/10", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[9px] text-white/50 block font-bold", children: t("profile.gender") || "Género" }),
              /* @__PURE__ */ jsx("span", { className: "font-extrabold text-white truncate block", children: formatted.gender })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white/5 p-2 rounded-xl border border-white/10", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[9px] text-white/50 block font-bold", children: t("profile.location") || "Ubicación" }),
              /* @__PURE__ */ jsx("span", { className: "font-extrabold text-white truncate block", title: formatted.location, children: formatted.location })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[9px] text-white/50 font-bold uppercase tracking-wider block", children: t("profile.aboutMe") || "Sobre mí" }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs leading-relaxed text-white/80 bg-white/5 p-3 rounded-xl border border-white/5 italic", children: [
              '"',
              formatted.bio,
              '"'
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[9px] text-white/50 font-bold uppercase tracking-wider block", children: t("profile.favoriteSports") || "Deportes Favoritos" }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: formatted.sports.map((sport) => /* @__PURE__ */ jsx("span", { className: "rounded-full bg-primary/15 border border-primary/25 px-2.5 py-0.5 text-[9px] font-bold text-primary", children: sport }, sport)) })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setSelectedUserProfile(null),
              className: "w-full rounded-2xl bg-muted py-3 text-xs font-black uppercase tracking-wider text-muted-foreground shadow-sm hover:bg-muted/80 transition-all mt-2 cursor-pointer",
              children: t("events.backToMatch") || "Volver al Partido"
            }
          )
        ] })
      ] }) });
    })(),
    showDeleteConfirm && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-[70] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm", children: /* @__PURE__ */ jsxs("div", { className: "bg-background p-6 rounded-3xl border border-rose-500/30 w-full max-w-sm shadow-pop relative overflow-hidden animate-in zoom-in-95 duration-200", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-tr from-rose-500/5 to-transparent pointer-events-none" }),
      /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex flex-col items-center text-center gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "h-16 w-16 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center", children: /* @__PURE__ */ jsx(Trash2, { size: 28, className: "text-rose-500" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-black text-secondary", children: t("events.deleteEventConfirmTitle") || "¿Eliminar Evento?" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1.5 leading-relaxed", children: t("events.deleteEventConfirmDesc")?.replace("{title}", `"${event.title}"`) || `Esta acción eliminará "${event.title}" de forma permanente. Todos los participantes serán removidos y no habrá forma de revertirlo.` })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "w-full flex gap-3 pt-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setShowDeleteConfirm(false),
              disabled: deleting,
              className: "flex-1 py-3.5 rounded-2xl bg-muted text-muted-foreground font-bold text-sm hover:bg-muted/80 transition-all",
              children: t("common.cancel") || "Cancelar"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleDeleteEvent,
              disabled: deleting,
              className: "flex-1 py-3.5 rounded-2xl bg-rose-500 text-white font-black text-sm hover:bg-rose-600 active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2",
              children: deleting ? /* @__PURE__ */ jsx(Loader2, { size: 16, className: "animate-spin" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Trash2, { size: 14 }),
                " ",
                t("common.delete") || "Eliminar"
              ] })
            }
          )
        ] })
      ] })
    ] }) }),
    showClanMemberSelectModal && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm", children: /* @__PURE__ */ jsxs("div", { className: "bg-background p-5 rounded-3xl border border-border w-full max-w-sm max-h-[80vh] flex flex-col shadow-pop relative overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none" }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-black text-secondary mb-1", children: t("events.selectMembers") || "Seleccionar Miembros" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-4", children: t("events.selectMembersDesc")?.replace("{spots}", String(Math.max(0, event.spots - participants.filter((p) => p.status === "approved" || p.status === "aceptado" || p.status === "aprobado" || !p.status).length))) || `El evento tiene ${Math.max(0, event.spots - participants.filter((p) => p.status === "approved" || p.status === "aceptado" || p.status === "aprobado" || !p.status).length)} cupos. Selecciona quiénes participarán.` }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto space-y-2 relative z-10", children: selectableClanMembers.map((m) => {
        const isSelected = selectedClanMemberIds.includes(m.user_id);
        return /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => {
              if (isSelected) {
                setSelectedClanMemberIds(selectedClanMemberIds.filter((id) => id !== m.user_id));
              } else {
                const emptySpots2 = Math.max(0, event.spots - participants.filter((p) => p.status === "approved" || p.status === "aceptado" || p.status === "aprobado" || !p.status).length);
                if (selectedClanMemberIds.length >= emptySpots2) {
                  alert(t("events.error.maxMembers")?.replace("{spots}", String(emptySpots2)) || `Solo puedes seleccionar hasta ${emptySpots2} miembros.`);
                  return;
                }
                setSelectedClanMemberIds([...selectedClanMemberIds, m.user_id]);
              }
            },
            className: `w-full flex items-center justify-between p-3 rounded-2xl border transition-all ${isSelected ? "border-primary bg-primary/10" : "border-border bg-card"}`,
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                renderAvatar(m.profiles?.username || "Usuario", "h-8 w-8", m.profiles?.avatar_url),
                /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-secondary truncate max-w-[150px]", children: m.profiles?.username?.split("@")[0] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: `h-5 w-5 rounded-md flex items-center justify-center border ${isSelected ? "bg-primary border-primary text-secondary" : "border-muted-foreground/30"}`, children: isSelected && /* @__PURE__ */ jsx(Check, { size: 12, strokeWidth: 3 }) })
            ]
          },
          m.id
        );
      }) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 flex gap-2 relative z-10", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => setShowClanMemberSelectModal(false), className: "flex-1 bg-muted text-muted-foreground py-3 rounded-2xl font-bold text-sm", children: t("common.cancel") || "Cancelar" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            disabled: selectedClanMemberIds.length === 0 || registeringClan,
            onClick: () => {
              executeClanJoin(clanToJoin, selectableClanMembers.filter((m) => selectedClanMemberIds.includes(m.user_id)));
            },
            className: "flex-1 gradient-primary text-secondary py-3 rounded-2xl font-black text-sm disabled:opacity-50 flex justify-center items-center",
            children: registeringClan ? /* @__PURE__ */ jsx(Loader2, { size: 16, className: "animate-spin" }) : `${t("events.join") || "Unirse"} (${selectedClanMemberIds.length})`
          }
        )
      ] })
    ] }) })
  ] });
}
const getFormattedProfile$1 = (p) => {
  if (!p) return null;
  const username = p.username || "Usuario";
  let charCodeSum = 0;
  for (let i = 0; i < username.length; i++) charCodeSum += username.charCodeAt(i);
  const age = p.age || 20 + charCodeSum % 15;
  const locations = ["Chacao", "Las Mercedes", "Altamira", "El Hatillo", "La Castellana", "Los Palos Grandes"];
  const location = p.location || locations[charCodeSum % locations.length];
  const sportsPool = ["Running", "Senderismo", "Pádel", "Tenis", "Vóleibol"];
  const sportsCount = 1 + charCodeSum % 3;
  const sports2 = p.preferred_sports || [];
  if (sports2.length === 0) {
    for (let i = 0; i < sportsCount; i++) {
      const sport = sportsPool[(charCodeSum + i) % sportsPool.length];
      if (!sports2.includes(sport)) sports2.push(sport);
    }
  }
  const emojis = ["🏃‍♂️", "🎯", "🥊", "🏄", "🧗‍♀️", "🛹", "🪼", "🪨", "🐾", "🐺"];
  const emoji = emojis[charCodeSum % emojis.length];
  const gradients = ["from-pink-500 to-rose-400", "from-emerald-500 to-teal-400", "from-blue-500 to-cyan-400", "from-purple-500 to-indigo-400", "from-amber-500 to-orange-400", "from-sky-500 to-blue-600", "from-orange-400 to-red-500"];
  const gradient = gradients[charCodeSum % gradients.length];
  const bios = ["¡Me encanta el deporte y conocer gente nueva para entrenar en Caracas!", "Siempre activo para jugar un partido de pádel o tenis.", "Subo al Ávila todos los fines de semana. ¡Acompáñame!", "Running y entrenamiento funcional. Busco motivar y que me motiven.", "Jugador recreativo de vóleibol y fútbol. Buena vibra."];
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
function SettingsModal({ isOpen, onClose, onLogout }) {
  const { language, setLanguage, theme, setTheme, rpgMode, setRpgMode, notifications, setNotifications, unit, setUnit, t } = useSettings();
  if (!isOpen) return null;
  const themes = [
    { id: "light", icon: Sun, color: "bg-[#f8f9fa] border-gray-300 text-gray-800" },
    { id: "dark", icon: Moon, color: "bg-[#111827] border-gray-600 text-gray-100" },
    { id: "neon", icon: Sparkles, color: "bg-[#2e0536] border-[#ff00a0] text-[#ff00a0]" },
    { id: "nature", icon: Palette, color: "bg-[#f0fdf4] border-[#22c55e] text-[#15803d]" },
    { id: "ocean", icon: Palette, color: "bg-[#eff6ff] border-[#3b82f6] text-[#1d4ed8]" }
  ];
  const languages = [
    { id: "es", name: "Español", flag: "🇪🇸" },
    { id: "en", name: "English", flag: "🇺🇸" },
    { id: "pt", name: "Português", flag: "🇧🇷" },
    { id: "fr", name: "Français", flag: "🇫🇷" },
    { id: "it", name: "Italiano", flag: "🇮🇹" },
    { id: "de", name: "Deutsch", flag: "🇩🇪" }
  ];
  const themeNames = {
    light: t("themes.light"),
    dark: t("themes.dark"),
    neon: t("themes.neon"),
    nature: t("themes.nature"),
    ocean: t("themes.ocean")
  };
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-[100] flex flex-col justify-end bg-background/80 backdrop-blur-sm animate-in fade-in duration-200", children: /* @__PURE__ */ jsxs("div", { className: "bg-card w-full max-h-[90vh] rounded-t-3xl border-t border-border shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)] flex flex-col animate-in slide-in-from-bottom-full duration-300", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-5 border-b border-border shrink-0", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-black text-secondary", children: t("settings.title") }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onClose,
          className: "p-2 rounded-full bg-muted text-muted-foreground hover:text-secondary hover:bg-muted/80 transition-colors",
          children: /* @__PURE__ */ jsx(X, { size: 20 })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-5 overflow-y-auto flex-1 space-y-8 pb-24", children: [
      /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx(Palette, { size: 14, className: "text-primary" }),
          " ",
          t("settings.aesthetics")
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex gap-3 overflow-x-auto pb-2 snap-x", children: themes.map((themeObj) => /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setTheme(themeObj.id),
            className: `relative snap-center shrink-0 w-24 h-24 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all active:scale-95 ${themeObj.color} ${theme === themeObj.id ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-105" : "opacity-60"}`,
            children: [
              /* @__PURE__ */ jsx(themeObj.icon, { size: 24 }),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black", children: themeNames[themeObj.id] }),
              theme === themeObj.id && /* @__PURE__ */ jsx("span", { className: "absolute top-1.5 right-1.5 bg-primary text-secondary rounded-full p-0.5 shadow-sm", children: /* @__PURE__ */ jsx(Check, { size: 10, strokeWidth: 4 }) })
            ]
          },
          themeObj.id
        )) })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx(Globe, { size: 14, className: "text-primary" }),
          " ",
          t("settings.language")
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2", children: languages.map((l) => /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setLanguage(l.id),
            className: `flex items-center justify-between p-3 rounded-xl border transition-all ${language === l.id ? "bg-primary/10 border-primary/30 text-primary font-bold shadow-soft" : "bg-muted/30 border-border/50 text-secondary hover:bg-muted/50"}`,
            children: [
              /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2 text-sm", children: [
                /* @__PURE__ */ jsx("span", { className: "text-lg leading-none", children: l.flag }),
                l.name
              ] }),
              language === l.id && /* @__PURE__ */ jsx(Check, { size: 14 })
            ]
          },
          l.id
        )) })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx(Zap, { size: 14, className: "text-primary" }),
          " ",
          t("settings.gamePrefs")
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border", children: [
          /* @__PURE__ */ jsxs("div", { className: "p-4 flex items-center justify-between gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold text-secondary", children: t("settings.rpgMode") }),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5 leading-snug", children: t("settings.rpgModeDesc") })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setRpgMode(!rpgMode),
                className: `w-12 h-6 rounded-full transition-all duration-300 relative shrink-0 ${rpgMode ? "bg-primary shadow-pop" : "bg-muted-foreground/30"}`,
                children: /* @__PURE__ */ jsx("span", { className: `block w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all duration-300 ${rpgMode ? "left-[calc(100%-1.375rem)]" : "left-0.5"}` })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-4 flex items-center justify-between gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold text-secondary", children: t("settings.pushNotif") }),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5 leading-snug", children: t("settings.pushNotifDesc") })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setNotifications(!notifications),
                className: `w-12 h-6 rounded-full transition-all duration-300 relative shrink-0 ${notifications ? "bg-primary shadow-pop" : "bg-muted-foreground/30"}`,
                children: /* @__PURE__ */ jsx("span", { className: `block w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all duration-300 ${notifications ? "left-[calc(100%-1.375rem)]" : "left-0.5"}` })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-4 flex items-center justify-between gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold text-secondary", children: t("settings.distance") }),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5 leading-snug", children: t("settings.distanceDesc") })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex bg-muted rounded-lg p-1 shrink-0", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setUnit("km"),
                  className: `px-3 py-1 text-xs font-bold rounded-md transition-all ${unit === "km" ? "bg-card text-secondary shadow-sm" : "text-muted-foreground"}`,
                  children: "Km"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setUnit("mi"),
                  className: `px-3 py-1 text-xs font-bold rounded-md transition-all ${unit === "mi" ? "bg-card text-secondary shadow-sm" : "text-muted-foreground"}`,
                  children: "Mi"
                }
              )
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("section", { className: "pt-2", children: /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: onLogout,
          className: "w-full flex items-center justify-center gap-2 p-3.5 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive font-black active:scale-95 transition-all hover:bg-destructive/20",
          children: [
            /* @__PURE__ */ jsx(LogOut, { size: 16 }),
            " ",
            t("settings.logout")
          ]
        }
      ) })
    ] })
  ] }) });
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
    carisma,
    unlockedAchievements
  } = useCurrentUser();
  const { t, rpgMode } = useSettings();
  const [activeTab, setActiveTab] = useState("stats");
  const [copiedCode, setCopiedCode] = useState(null);
  const [showClaimSuccess, setShowClaimSuccess] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const handleLogout = async () => {
    const { supabase: supabase2 } = await Promise.resolve().then(() => supabase$1);
    await supabase2.auth.signOut();
  };
  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2e3);
  };
  const unlockedCount = unlockedAchievements ? unlockedAchievements.length : 0;
  const completionPercentage = ACHIEVEMENTS.length > 0 ? Math.round(unlockedCount / ACHIEVEMENTS.length * 100) : 0;
  const platinumCount = unlockedAchievements ? ACHIEVEMENTS.filter((a) => a.rarity === "platinum" && unlockedAchievements.includes(a.id)).length : 0;
  const goldCount = unlockedAchievements ? ACHIEVEMENTS.filter((a) => a.rarity === "gold" && unlockedAchievements.includes(a.id)).length : 0;
  const silverCount = unlockedAchievements ? ACHIEVEMENTS.filter((a) => a.rarity === "silver" && unlockedAchievements.includes(a.id)).length : 0;
  const bronzeCount = unlockedAchievements ? ACHIEVEMENTS.filter((a) => a.rarity === "bronze" && unlockedAchievements.includes(a.id)).length : 0;
  const renderAchievementProgress = (ach, isUnlocked) => {
    if (isUnlocked) return null;
    let current = 0;
    let target = 1;
    switch (ach.id) {
      case "primer_paso":
        current = joinedEventsCount;
        target = 1;
        break;
      case "creador_leyendas":
        current = createdEventsCount;
        target = 1;
        break;
      case "fidelidad_hierro":
        current = useCount;
        target = 5;
        break;
      case "gran_carisma":
        current = carisma;
        target = 3;
        break;
      case "viajero_deporte":
        current = joinedEventsCount;
        target = 3;
        break;
      case "nivel_heroe":
        current = level;
        target = 5;
        break;
      default:
        return null;
    }
    const percentage = Math.min(100, Math.max(0, current / target * 100));
    return /* @__PURE__ */ jsxs("div", { className: "w-full mt-1.5 space-y-1", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-[8px] font-black text-white/40", children: [
        /* @__PURE__ */ jsx("span", { children: t("profile.progress") || "Progreso" }),
        /* @__PURE__ */ jsxs("span", { children: [
          current,
          " / ",
          target
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "h-1.5 w-full bg-secondary rounded-full overflow-hidden border border-white/5", children: /* @__PURE__ */ jsx(
        "div",
        {
          className: "h-full bg-primary/70 rounded-full transition-all duration-300",
          style: { width: `${percentage}%` }
        }
      ) })
    ] });
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
        /* @__PURE__ */ jsx("h1", { className: "mt-5 text-2xl font-black text-white", children: t("profile.guestTitle") || "Perfil de Invitado" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-sm text-white/50 max-w-[260px] mx-auto", children: t("profile.guestDesc") || "Explora la app libremente. Crea tu cuenta para desbloquear todo." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "px-5 -mt-10 space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-3xl bg-card border border-border shadow-pop overflow-hidden", children: [
          /* @__PURE__ */ jsxs("div", { className: "px-5 py-5 space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#32CD32]/15", children: /* @__PURE__ */ jsx(Sparkles, { size: 18, className: "text-[#32CD32] animate-pulse" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h2", { className: "text-base font-black text-secondary", children: t("profile.joinCommunity") || "Únete a la comunidad" }),
                /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground", children: t("profile.joinDesc") || "Accede a todo TeamMatch gratis" })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "space-y-2", children: [
              { icon: MapPin, text: t("profile.benefit1") || "Encuentra partidos cerca de ti en tiempo real" },
              { icon: Users, text: t("profile.benefit2") || "Solicita un cupo y únete con un toque" },
              { icon: Trophy, text: t("profile.benefit3") || "Sube de nivel y gana recompensas exclusivas" },
              { icon: Zap, text: t("profile.benefit4") || "Matchmaking inteligente por nivel de juego" },
              { icon: Star, text: t("profile.benefit5") || "Crea tus propios eventos y arma equipo" }
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
                    t("profile.createFreeAccount") || "Crear Cuenta Gratis",
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
                  children: t("profile.loginExisting") || "Ya tengo cuenta — Iniciar Sesión"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "border-t border-border grid grid-cols-3 divide-x divide-border", children: [
            { k: "1.2k", v: t("profile.players") || "Jugadores" },
            { k: "320", v: t("profile.eventsPerMonth") || "Eventos/mes" },
            { k: "4.9★", v: t("profile.rating") || "Rating" }
          ].map((s) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center py-4", children: [
            /* @__PURE__ */ jsx("div", { className: "text-lg font-black text-[#32CD32]", children: s.k }),
            /* @__PURE__ */ jsx("div", { className: "text-[10px] font-semibold text-muted-foreground", children: s.v })
          ] }, s.v)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-dashed border-border bg-muted/20 p-4 flex items-start gap-3", children: [
          /* @__PURE__ */ jsx(Shield, { size: 18, className: "text-muted-foreground shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground leading-relaxed", children: t("profile.guestDisclaimer") || "Tu cuenta es 100% gratuita. Puedes explorar el mapa, ver eventos y canchas sin necesidad de registrarte." })
        ] })
      ] })
    ] });
  }
  const email = user.email || "";
  const initials = displayName.substring(0, 2).toUpperCase();
  const xpNeeded = level * 100;
  const xpPercentage = Math.min(100, Math.max(0, xp / xpNeeded * 100));
  let rpgClass = t("profile.classRecruit") || "Recluta Novato 👟";
  let borderClass = "neon-border-bronze";
  let rarityLabel = t("profile.rarityNovice") || "Novato";
  let rarityColor = "text-amber-600 bg-amber-500/10 border-amber-500/20";
  if (level === 2) {
    rpgClass = t("profile.classAspirant") || "Aspirante Activo ⚡";
    borderClass = "neon-border-bronze";
    rarityLabel = t("profile.rarityCommon") || "Común";
    rarityColor = "text-gray-400 bg-gray-500/10 border-gray-500/20";
  } else if (level === 3) {
    rpgClass = t("profile.classWarrior") || "Guerrero del Fitness 🏋️‍♂️";
    borderClass = "neon-border-silver";
    rarityLabel = t("profile.rarityRare") || "Raro";
    rarityColor = "text-blue-400 bg-blue-500/10 border-blue-500/20";
  } else if (level === 4) {
    rpgClass = t("profile.classMaster") || "Maestro del Match 🏆";
    borderClass = "neon-border-gold";
    rarityLabel = t("profile.rarityEpic") || "Épico";
    rarityColor = "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
  } else if (level >= 5) {
    rpgClass = t("profile.classLegend") || "Leyenda de Caracas 🌟";
    borderClass = "neon-border-legendary";
    rarityLabel = t("profile.rarityLegendary") || "Legendario";
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
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-black text-secondary uppercase tracking-wide", children: t("profile.itemClaimed") || "¡Objeto Canjeado! 💎" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-primary", children: showClaimSuccess.title }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground max-w-[285px] mx-auto leading-relaxed", children: t("profile.itemClaimedDesc") ? t("profile.itemClaimedDesc").replace("{discount}", showClaimSuccess.discount) : `El beneficio de **${showClaimSuccess.discount}** ha sido activado con éxito para tu próxima reserva de cancha o partido.` })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "h-full overflow-y-auto bg-background pb-28", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative bg-background px-5 pb-6 pt-12 text-secondary", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: onEdit,
            className: "grid h-10 w-10 place-items-center rounded-full bg-muted text-primary transition-transform active:scale-95",
            children: /* @__PURE__ */ jsx(Edit3, { size: 16 })
          }
        ),
        rpgMode && /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary shadow-soft", children: [
          /* @__PURE__ */ jsx(Sparkles, { size: 11, className: "animate-pulse" }),
          " ",
          t("profile.rpgActive")
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setShowSettings(true),
            className: "grid h-10 w-10 place-items-center rounded-full bg-muted text-secondary hover:bg-muted/80 transition-colors",
            children: /* @__PURE__ */ jsx(Settings, { size: 16 })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-col sm:flex-row items-center gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative shrink-0", children: [
          /* @__PURE__ */ jsx("div", { className: `h-22 w-22 rounded-full overflow-hidden p-1 bg-card ${rpgMode ? borderClass : "ring-4 ring-primary/20"}`, children: avatarUrl ? /* @__PURE__ */ jsx(
            "img",
            {
              src: avatarUrl,
              alt: "Avatar",
              className: "h-full w-full rounded-full object-cover shadow-inner"
            }
          ) : /* @__PURE__ */ jsx("div", { className: "grid h-full w-full place-items-center rounded-full bg-secondary text-2xl font-black text-primary shadow-inner", children: initials }) }),
          rpgMode && /* @__PURE__ */ jsx("div", { className: "absolute -bottom-2 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary font-mono text-sm font-black text-secondary ring-2 ring-card shadow-pop", children: level })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 text-center sm:text-left space-y-1.5", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-2", children: [
            /* @__PURE__ */ jsxs("h1", { className: "text-xl font-black text-secondary flex items-center justify-center sm:justify-start gap-2", children: [
              displayName,
              user?.user_metadata?.is_organizer && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-amber-500 shadow-pop border border-amber-500/30", children: [
                /* @__PURE__ */ jsx(Star, { size: 9, className: "fill-amber-500 text-amber-500" }),
                " ",
                t("profile.organizer") || "Organizador"
              ] })
            ] }),
            rpgMode && /* @__PURE__ */ jsx(
              "span",
              {
                className: `inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide w-fit mx-auto sm:mx-0 ${rarityColor}`,
                children: rarityLabel
              }
            )
          ] }),
          rpgMode && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground font-semibold", children: rpgClass }),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground/70", children: email })
        ] })
      ] }),
      rpgMode && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "mt-8 space-y-1.5 bg-muted/50 p-3.5 rounded-2xl border border-border", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs font-black text-secondary", children: [
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(Trophy, { size: 13, className: "text-primary animate-pulse" }),
              " ",
              t("profile.xpPoints")
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "font-mono text-muted-foreground", children: [
              xp,
              " / ",
              xpNeeded,
              " XP"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "h-3.5 w-full rounded-full bg-muted shadow-inner overflow-hidden border border-border", children: /* @__PURE__ */ jsx(
            "div",
            {
              className: "h-full rounded-full bg-primary transition-all duration-500 ease-out",
              style: { width: `${xpPercentage}%` }
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-[9px] text-muted-foreground font-semibold", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              t("profile.level"),
              " ",
              level
            ] }),
            /* @__PURE__ */ jsx("span", { children: t("profile.xpForNextLevel") ? t("profile.xpForNextLevel").replace("{xp}", String(xpNeeded - xp)).replace("{level}", String(level + 1)) : `+${xpNeeded - xp} XP para Nivel ${level + 1}` })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            onClick: () => setActiveTab("achievements"),
            className: "mt-3.5 bg-card p-3.5 rounded-2xl border border-border hover:bg-muted/50 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-between shadow-soft select-none animate-fade-in",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-[#ffd700] via-[#c0c0c0] to-[#cd7f32] p-[1.5px] flex items-center justify-center shadow-md", children: /* @__PURE__ */ jsx("div", { className: "h-full w-full rounded-full bg-background flex items-center justify-center text-lg", children: "🏆" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsx("h4", { className: "text-xs font-black uppercase tracking-wider text-secondary", children: t("profile.achievements") }),
                    /* @__PURE__ */ jsxs("span", { className: "text-[9px] font-black text-primary bg-primary/10 px-1.5 rounded-full border border-primary/20", children: [
                      unlockedCount,
                      " / ",
                      ACHIEVEMENTS.length
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mt-1.5 text-[10px] font-bold text-muted-foreground", children: [
                    /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-0.5", children: [
                      "🏆 ",
                      /* @__PURE__ */ jsx("span", { className: "text-secondary", children: platinumCount })
                    ] }),
                    /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-0.5", children: [
                      "🥇 ",
                      /* @__PURE__ */ jsx("span", { className: "text-secondary", children: goldCount })
                    ] }),
                    /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-0.5", children: [
                      "🥈 ",
                      /* @__PURE__ */ jsx("span", { className: "text-secondary", children: silverCount })
                    ] }),
                    /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-0.5", children: [
                      "🥉 ",
                      /* @__PURE__ */ jsx("span", { className: "text-secondary", children: bronzeCount })
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                  /* @__PURE__ */ jsxs("span", { className: "text-xs font-black text-secondary", children: [
                    completionPercentage,
                    "%"
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-[8px] text-muted-foreground uppercase font-black tracking-wider", children: t("profile.progress") })
                ] }),
                /* @__PURE__ */ jsx(ArrowRight, { size: 13, className: "text-muted-foreground" })
              ] })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "px-5", children: /* @__PURE__ */ jsx("div", { className: `grid ${rpgMode ? "grid-cols-4" : "grid-cols-2"} gap-1 rounded-2xl bg-card p-1 shadow-pop border border-border`, children: [
      { id: "stats", label: t("profile.stats"), icon: Shield, show: true },
      { id: "achievements", label: t("profile.achievements").slice(0, 6), icon: Award, show: rpgMode },
      { id: "inventory", label: t("profile.inventory"), icon: Trophy, show: rpgMode },
      { id: "history", label: t("profile.history"), icon: BookOpen, show: true }
    ].filter((tab) => tab.show).map((tab) => {
      const ActiveIcon = tab.icon;
      const isSelected = activeTab === tab.id;
      return /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setActiveTab(tab.id),
          className: `flex flex-col items-center gap-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-wide transition-all active:scale-95 ${isSelected ? "bg-secondary text-primary shadow-sm" : "text-muted-foreground hover:bg-muted/50 hover:text-secondary"}`,
          children: [
            /* @__PURE__ */ jsx(ActiveIcon, { size: 13, className: isSelected ? "text-primary" : "" }),
            tab.label
          ]
        },
        tab.id
      );
    }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 px-5", children: [
      activeTab === "achievements" && /* @__PURE__ */ jsxs("div", { className: "space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-300", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx(Award, { size: 14, className: "text-primary" }),
          " ",
          t("profile.achievementsListTitle") || "Lista de Logros y Trofeos"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid gap-3", children: ACHIEVEMENTS.map((ach) => {
          const isUnlocked = unlockedAchievements ? unlockedAchievements.includes(ach.id) : false;
          const rarityStyles = {
            bronze: {
              border: isUnlocked ? "border-[#cd7f32]/30" : "border-border/60",
              glow: "from-[#a05a2c] to-[#cd7f32]",
              rarityName: t("profile.bronze") || "Bronce 🥉",
              color: "text-[#cd7f32]"
            },
            silver: {
              border: isUnlocked ? "border-[#c0c0c0]/30" : "border-border/60",
              glow: "from-[#718096] to-[#cbd5e0]",
              rarityName: t("profile.silver") || "Plata 🥈",
              color: "text-[#cbd5e0]"
            },
            gold: {
              border: isUnlocked ? "border-[#ffd700]/30" : "border-border/60",
              glow: "from-[#d69e2e] to-[#ecc94b]",
              rarityName: t("profile.gold") || "Oro 🥇",
              color: "text-[#ecc94b]"
            },
            platinum: {
              border: isUnlocked ? "border-[#e5e4e2]/40 shadow-[0_0_10px_rgba(229,228,226,0.1)]" : "border-border/60",
              glow: "from-[#4a5568] via-[#cbd5e0] to-[#e2e8f0]",
              rarityName: t("profile.platinum") || "Platino 🏆",
              color: "text-[#e5e4e2] font-black"
            }
          };
          const style = rarityStyles[ach.rarity];
          return /* @__PURE__ */ jsxs(
            "div",
            {
              className: `rounded-2xl p-3.5 border transition-all duration-300 flex items-center gap-3.5 bg-card ${style.border} ${!isUnlocked ? "opacity-60 grayscale bg-muted/20" : "shadow-soft border-l-4"}`,
              children: [
                /* @__PURE__ */ jsx("div", { className: `h-11 w-11 shrink-0 rounded-full p-[1.5px] bg-gradient-to-br ${isUnlocked ? style.glow : "from-muted to-muted-foreground/30"} flex items-center justify-center shadow-md relative`, children: /* @__PURE__ */ jsx("div", { className: "h-full w-full rounded-full bg-[#0d0f14] flex items-center justify-center text-lg select-none", children: isUnlocked ? ach.icon : "🔒" }) }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 space-y-0.5", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
                    /* @__PURE__ */ jsx("h4", { className: "text-xs font-black text-secondary truncate", children: ach.title }),
                    /* @__PURE__ */ jsx("span", { className: `text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-[#0d0f14]/5 ${style.color}`, children: style.rarityName })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground leading-normal pr-2", children: ach.description }),
                  renderAchievementProgress(ach, isUnlocked)
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "text-right shrink-0 flex flex-col justify-center", children: [
                  /* @__PURE__ */ jsxs("span", { className: `text-[9px] font-black px-2 py-0.5 rounded-full border ${isUnlocked ? "text-primary bg-primary/10 border-primary/20" : "text-muted-foreground bg-muted border-border"}`, children: [
                    "+",
                    ach.xpReward,
                    " XP"
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "text-[8px] text-muted-foreground font-semibold mt-1", children: isUnlocked ? t("profile.unlocked") || "Obtenido" : t("profile.locked") || "Bloqueado" })
                ] })
              ]
            },
            ach.id
          );
        }) })
      ] }),
      activeTab === "stats" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx(Award, { size: 14, className: "text-primary" }),
          " ",
          t("profile.playerAttributes") || "Atributos del Jugador"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsx(
            StatCard,
            {
              icon: Flame,
              label: t("profile.str") || "Fuerza (STR)",
              value: str,
              colorClass: "text-red-500",
              bgClass: "bg-red-500/5 border-red-500/10",
              description: t("profile.strDesc") || "Aumenta al unirte a partidos (+2 XP/partido)"
            }
          ),
          /* @__PURE__ */ jsx(
            StatCard,
            {
              icon: BookOpen,
              label: t("profile.wis") || "Sabiduría (WIS)",
              value: wis,
              colorClass: "text-blue-500",
              bgClass: "bg-blue-500/5 border-blue-500/10",
              description: t("profile.wisDesc") || "Aumenta al crear partidos (+5 XP/partido)"
            }
          ),
          /* @__PURE__ */ jsx(
            StatCard,
            {
              icon: Shield,
              label: t("profile.con") || "Constitución (CON)",
              value: con,
              colorClass: "text-emerald-500",
              bgClass: "bg-emerald-500/5 border-emerald-500/10",
              description: t("profile.conDesc") || "Aumenta con el uso diario de la app"
            }
          ),
          /* @__PURE__ */ jsx(
            StatCard,
            {
              icon: Sparkles,
              label: t("profile.cha") || "Carisma (CHA)",
              value: cha,
              colorClass: "text-amber-500",
              bgClass: "bg-amber-500/5 border-amber-500/10",
              description: t("profile.chaDesc") || "Calculado según tu reputación deportiva"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-card p-4 shadow-soft space-y-4", children: [
          /* @__PURE__ */ jsxs("h4", { className: "text-xs font-black uppercase tracking-wider text-secondary flex items-center gap-1.5 border-b border-border pb-2", children: [
            /* @__PURE__ */ jsx(Sparkles, { size: 14, className: "text-primary animate-pulse" }),
            " ",
            t("profile.profileInfo") || "Información de Perfil"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 text-center text-xs", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-muted/40 p-2.5 rounded-xl border border-border/50", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground block font-bold", children: t("profile.age") || "Edad" }),
              /* @__PURE__ */ jsx("span", { className: "font-black text-secondary", children: user.user_metadata?.age ? `${user.user_metadata.age} ${t("common.years") || "años"}` : "—" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-muted/40 p-2.5 rounded-xl border border-border/50", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground block font-bold", children: t("profile.gender") || "Género" }),
              /* @__PURE__ */ jsx("span", { className: "font-black text-secondary", children: user.user_metadata?.gender || "—" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-muted/40 p-2.5 rounded-xl border border-border/50", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground block font-bold", children: t("profile.location") || "Ubicación" }),
              /* @__PURE__ */ jsx("span", { className: "font-black text-secondary truncate block", title: user.user_metadata?.location || "", children: user.user_metadata?.location || "—" })
            ] })
          ] }),
          user.user_metadata?.description && /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground font-bold", children: t("profile.aboutMe") || "Sobre mí" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs leading-relaxed text-secondary-foreground/80 bg-muted/20 p-3 rounded-xl border border-border/30", children: user.user_metadata.description })
          ] }),
          user.user_metadata?.preferred_sports && user.user_metadata.preferred_sports.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground font-bold block", children: t("profile.favoriteSports") || "Deportes favoritos" }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: user.user_metadata.preferred_sports.map((sport) => /* @__PURE__ */ jsx("span", { className: "rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-[10px] font-bold text-primary", children: sport }, sport)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-card p-4 shadow-soft", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-xs font-black uppercase tracking-wider text-secondary mb-1", children: t("profile.campaignSummary") || "Resumen de Campaña" }),
          /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground leading-relaxed", children: t("profile.campaignDesc") ? t("profile.campaignDesc").replace("{joined}", String(joinedEventsCount)).replace("{created}", String(createdEventsCount)).replace("{used}", String(useCount)) : `Has completado **${joinedEventsCount} partidos** como luchador y has guiado a otros
                jugadores creando **${createdEventsCount} eventos**. Tu constancia te ha otorgado
                **${useCount} días de entrenamiento** activo.` })
        ] })
      ] }),
      activeTab === "inventory" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx(Trophy, { size: 14, className: "text-primary" }),
            " ",
            t("profile.magicChest") || "Cofre de Objetos Mágicos"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold text-muted-foreground", children: [
            coupons.filter((c) => !c.claimed).length,
            " ",
            t("profile.active") || "Activos"
          ] })
        ] }),
        coupons.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center space-y-2 animate-fade-in", children: [
          /* @__PURE__ */ jsx("div", { className: "text-4xl", children: "🎁" }),
          /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold text-secondary", children: t("profile.emptyChest") || "Cofre Vacío" }),
          /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground max-w-[240px] mx-auto", children: t("profile.emptyChestDesc") || "No tienes cupones. ¡Organiza eventos (+25 XP), únete a partidos (+15 XP) o usa la app diariamente para ganar cofres sorpresa!" })
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
                        children: isLegendary ? t("profile.legendaryItem") || "Objeto Legendario ⭐" : t("profile.epicItem") || "Objeto Épico 📜"
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
                    t("profile.code") || "Código:",
                    " ",
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
                          /* @__PURE__ */ jsx("span", { children: t("common.copied") || "Copiado" })
                        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                          /* @__PURE__ */ jsx(Copy, { size: 11 }),
                          /* @__PURE__ */ jsx("span", { children: t("common.copy") || "Copiar" })
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
                        children: t("common.redeem") || "Canjear"
                      }
                    ) : /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black text-muted-foreground px-2 py-1.5 bg-muted/80 rounded-xl", children: t("common.used") || "Usado" })
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
          " ",
          t("profile.adventureLog") || "Registro de Aventuras (XP Log)"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-2", children: xpHistory.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-8 text-xs text-muted-foreground", children: t("profile.noXp") || "Aún no has ganado experiencia. ¡Explora el mapa y únete a un partido!" }) : xpHistory.map((h) => {
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
          t("profile.logout")
        ]
      }
    ) }),
    /* @__PURE__ */ jsx(
      SettingsModal,
      {
        isOpen: showSettings,
        onClose: () => setShowSettings(false),
        onLogout: handleLogout
      }
    )
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
  const { t } = useSettings();
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
        throw new Error(t("editProfile.imgRequired") || "Debes seleccionar una imagen.");
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
      setError(error2.message || t("editProfile.imgError") || "Error al subir la imagen");
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
      setSuccess(t("editProfile.success") || "Perfil actualizado correctamente");
      setTimeout(() => {
        onBack();
      }, 1500);
    } catch (err) {
      setError(err.message || t("editProfile.error") || "Error al actualizar el perfil");
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
      /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold text-secondary", children: t("editProfile.title") || "Editar Perfil" })
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
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground", children: t("editProfile.profilePhoto") || "Foto de perfil" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-muted-foreground", children: t("editProfile.fullName") || "Nombre completo" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: name,
                onChange: (e) => setName(e.target.value),
                className: "w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-secondary outline-none transition-colors focus:border-primary",
                placeholder: t("editProfile.namePlaceholder") || "Tu nombre",
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-muted-foreground", children: t("editProfile.email") || "Correo electrónico" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "email",
                value: email,
                onChange: (e) => setEmail(e.target.value),
                className: "w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-secondary outline-none transition-colors focus:border-primary",
                placeholder: t("editProfile.emailPlaceholder") || "tu@email.com",
                required: true
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground", children: t("editProfile.emailNote") || "Al cambiar el correo electrónico, se enviará un mensaje de confirmación." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-muted-foreground", children: t("editProfile.age") || "Edad" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  value: age ?? "",
                  onChange: (e) => setAge(e.target.value ? parseInt(e.target.value) : void 0),
                  className: "w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-secondary outline-none transition-colors focus:border-primary",
                  placeholder: t("editProfile.agePlaceholder") || "Ej. 25",
                  min: "1",
                  max: "120"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-muted-foreground", children: t("editProfile.gender") || "Género" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: gender,
                  onChange: (e) => setGender(e.target.value),
                  className: "w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-secondary outline-none transition-colors focus:border-primary",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: t("editProfile.selectGender") || "Seleccionar..." }),
                    /* @__PURE__ */ jsx("option", { value: "Masculino", children: t("editProfile.male") || "Masculino" }),
                    /* @__PURE__ */ jsx("option", { value: "Femenino", children: t("editProfile.female") || "Femenino" }),
                    /* @__PURE__ */ jsx("option", { value: "Otro", children: t("editProfile.other") || "Otro" })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-muted-foreground", children: t("editProfile.location") || "Ubicación (Municipio/Zona)" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: location,
                onChange: (e) => setLocation(e.target.value),
                className: "w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-secondary outline-none transition-colors focus:border-primary",
                placeholder: t("editProfile.locationPlaceholder") || "Ej. Chacao, Caracas"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-muted-foreground", children: t("editProfile.aboutMe") || "Sobre mí (Descripción)" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                value: description,
                onChange: (e) => setDescription(e.target.value),
                rows: 3,
                className: "w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-secondary outline-none transition-colors focus:border-primary resize-none",
                placeholder: t("editProfile.aboutPlaceholder") || "Cuéntanos un poco sobre ti, tu nivel de juego, etc."
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-muted-foreground block", children: t("editProfile.preferredSports") || "Deportes preferidos" }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: ["Running", "Senderismo", "Pádel", "Tenis", "Vóleibol"].map((sport) => {
              const isSelected = preferredSports.includes(sport);
              let displaySport = sport;
              if (sport === "Running") displaySport = t("sports.running") || "Running";
              else if (sport === "Senderismo") displaySport = t("sports.hiking") || "Senderismo";
              else if (sport === "Pádel") displaySport = t("sports.padel") || "Pádel";
              else if (sport === "Tenis") displaySport = t("sports.tennis") || "Tenis";
              else if (sport === "Vóleibol") displaySport = t("sports.volleyball") || "Vóleibol";
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
                  children: displaySport
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
              /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-secondary block", children: t("editProfile.organizerMode") || "Modo Organizador" }),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground", children: t("editProfile.organizerDesc") || "Te permite registrar y gestionar tus propias instalaciones y canchas" })
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
            t("editProfile.saveChanges") || "Guardar Cambios"
          ] })
        }
      ) })
    ] })
  ] });
}
function parseLocation$1(location) {
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
  const { t } = useSettings();
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
      const lat = cancha.lat ?? parseLocation$1(cancha.location)?.lat;
      const lng = cancha.lng ?? parseLocation$1(cancha.location)?.lng;
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
            const eventCoords = parseLocation$1(event.location);
            if (!eventCoords) return false;
            const diffLat = Math.abs(eventCoords.lat - lat);
            const diffLng = Math.abs(eventCoords.lng - lng);
            return diffLat < 1e-4 && diffLng < 1e-4;
          });
        }
        if (!hasParticipated && createdEvents && createdEvents.length > 0) {
          hasParticipated = createdEvents.some((event) => {
            const eventCoords = parseLocation$1(event.location);
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
      setErrorMessage(err.message || t("comments.submitError") || "Error al enviar el comentario.");
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
        /* @__PURE__ */ jsx("h1", { className: "text-lg font-bold text-secondary", children: t("comments.title") || "Comentarios" }),
        /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground truncate max-w-[280px]", children: cancha.name })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto px-5 py-5 space-y-4 pb-36", children: loadingComments ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground", children: [
      /* @__PURE__ */ jsx(Loader2, { className: "animate-spin text-primary", size: 24 }),
      /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold", children: t("comments.loading") || "Cargando comentarios…" })
    ] }) : comments.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center gap-4 py-20 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "grid h-20 w-20 place-items-center rounded-full bg-muted text-4xl", children: "💬" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-base font-bold text-secondary", children: t("comments.noComments") || "Sin comentarios aún" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground max-w-[220px]", children: canComment ? t("comments.beFirst") || "Sé el primero en dejar un comentario sobre las condiciones o accesibilidad de esta cancha." : t("comments.noCommentsYet") || "Nadie ha comentado en esta cancha todavía." })
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
                  t("comments.player") || "Jugador",
                  /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[8px] font-bold text-emerald-700 ring-1 ring-emerald-200", children: [
                    /* @__PURE__ */ jsx(ShieldCheck, { size: 9 }),
                    " ",
                    t("comments.verified") || "Verificado"
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
      /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-muted-foreground", children: t("comments.checkingAccess") || "Comprobando acceso…" })
    ] }) : !user ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-3 rounded-2xl bg-muted/30 p-5 border border-dashed border-border", children: [
      /* @__PURE__ */ jsx("div", { className: "grid h-10 w-10 place-items-center rounded-full bg-muted text-lg", children: "💬" }),
      /* @__PURE__ */ jsxs("div", { className: "text-center space-y-1", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-secondary", children: t("comments.loginToComment") || "Inicia sesión para comentar" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: t("comments.shareOpinion") || "Comparte tu opinión sobre esta cancha con la comunidad." })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          id: "comments-login-btn",
          onClick: onOpenAuth,
          className: "flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#32CD32] to-[#22a822] px-5 py-2.5 text-xs font-black text-[#0f1117] shadow-pop shadow-green-500/20 transition-all active:scale-95 hover:shadow-green-500/30",
          children: t("comments.loginRegister") || "Iniciar Sesión / Registrarse"
        }
      )
    ] }) : !canComment ? /* @__PURE__ */ jsxs("div", { className: "flex gap-2.5 items-start rounded-2xl bg-amber-500/5 border border-amber-500/20 p-3.5", children: [
      /* @__PURE__ */ jsx(AlertCircle, { size: 16, className: "text-amber-600 mt-0.5 shrink-0" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold text-amber-800", children: t("comments.restricted") || "Acceso restringido" }),
        /* @__PURE__ */ jsx("p", { className: "text-[11px] leading-relaxed text-amber-700", children: t("comments.restrictedDesc") || "Solo puedes comentar si has participado o estás participando en un evento en esta cancha. ¡Únete a un partido o crea uno aquí primero!" })
      ] })
    ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmitComment, className: "space-y-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-end gap-2.5 bg-card border border-border rounded-2xl p-3 focus-within:border-primary transition-colors", children: [
        /* @__PURE__ */ jsx(
          "textarea",
          {
            value: newComment,
            onChange: (e) => setNewComment(e.target.value),
            placeholder: t("comments.placeholder") || "Escribe tu opinión sobre la cancha (iluminación, estado, etc.)…",
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
          t("comments.readyToComment") || "Listo para comentar"
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
  const { t } = useSettings();
  const [joining, setJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [status, setStatus] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [joinedCount, setJoinedCount] = useState(event.joined);
  const pct = joinedCount / event.spots * 100;
  joinedCount >= event.spots;
  useEffect(() => {
    let channel;
    const fetchJoinedCount = async () => {
      const { data, error } = await supabase.from("event_participants").select("status").eq("event_id", event.id);
      if (!error && data) {
        const approved = data.filter((p) => p.status === "approved" || p.status === "aceptado" || p.status === "aprobado" || !p.status);
        setJoinedCount(approved.length);
      }
    };
    fetchJoinedCount();
    let isMounted = true;
    const setupRealtime = async () => {
      fetchJoinedCount();
      const { data: { user } } = await supabase.auth.getUser();
      if (!isMounted) return;
      if (user && user.email) {
        setCurrentUser(user);
        const fetchStatus = async () => {
          const { data } = await supabase.from("event_participants").select("status").eq("event_id", event.id).eq("user_username", user.email).maybeSingle();
          if (isMounted) {
            if (data) setStatus(data.status);
            else setStatus(null);
          }
        };
        fetchStatus();
        channel = supabase.channel(`participant_status_${event.id}_${user.id}`);
        channel.on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "event_participants",
            filter: `event_id=eq.${event.id}`
          },
          (payload) => {
            if (!isMounted) return;
            if (payload.new && payload.new.user_username === user.email) {
              setStatus(payload.new.status);
            } else if (payload.eventType === "DELETE" && payload.old && payload.old.user_username === user.email) {
              setStatus(null);
            } else {
              fetchStatus();
            }
            fetchJoinedCount();
          }
        );
        channel.subscribe();
      }
    };
    setupRealtime();
    return () => {
      isMounted = false;
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
          /* @__PURE__ */ jsx("div", { className: "absolute right-3 top-3 rounded-full bg-card/90 px-2.5 py-1 text-[11px] font-bold text-secondary", children: event.price === 0 ? t("eventCard.free") || "Gratis" : `$${event.price}` }),
          /* @__PURE__ */ jsx("div", { className: "absolute bottom-2 left-3 right-3 flex items-end justify-between text-primary-foreground", children: /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-[11px] font-medium opacity-90", children: event.date }),
            /* @__PURE__ */ jsx("div", { className: "text-base font-bold leading-tight drop-shadow", children: event.title })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-3 flex-1 flex flex-col justify-between w-full space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsx("span", { className: "inline-flex items-center gap-1 font-medium text-secondary", children: event.date }),
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Clock, { size: 12 }),
              " ",
              event.time
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 truncate", title: event.canchas?.name || event.cancha_name || event.place_name || event.zone, children: [
              /* @__PURE__ */ jsx(MapPin, { size: 12, className: "shrink-0" }),
              /* @__PURE__ */ jsx("span", { className: "truncate", children: event.canchas?.name || event.cancha_name || event.place_name || event.zone })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-1 flex flex-col gap-1", children: [
              /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Users, { size: 12 }),
                " ",
                joinedCount,
                "/",
                event.spots,
                " ",
                t("eventCard.spots") || "cupos"
              ] }),
              variant === "full" && /* @__PURE__ */ jsx("div", { className: "h-1.5 w-full overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsx(
                "div",
                {
                  className: "h-full gradient-primary transition-all",
                  style: { width: `${pct}%` }
                }
              ) })
            ] })
          ] }),
          variant === "full" && /* @__PURE__ */ jsx("div", { className: "w-full flex flex-col gap-2 mt-auto", children: /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleJoin,
              className: `w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all active:scale-95 shadow-pop ${isAccepted ? "bg-primary text-white hover:bg-primary/90" : isPending ? "bg-amber-500 text-white hover:bg-amber-600" : "bg-secondary text-white hover:bg-secondary/90"}`,
              children: isAccepted ? t("eventCard.viewEvent") || "Ver evento" : isPending ? t("eventCard.waitingRequest") || "Esperando solicitud" : t("eventCard.joinEvent") || "Unirse al evento"
            }
          ) })
        ] })
      ]
    }
  );
}
function CouponPopup() {
  const { t } = useSettings();
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
            /* @__PURE__ */ jsx("span", { className: "inline-flex rounded-full bg-primary/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary border border-primary/30 animate-pulse mb-3", children: t("coupon.specialAd") || "Anuncio Especial 📣" }),
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
                  copied && /* @__PURE__ */ jsx("span", { className: "absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-md animate-bounce", children: t("coupon.copied") || "¡Copiado!" })
                ]
              },
              `code-${activeIdx}`
            ),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] text-white/50", children: t("coupon.copyHint") || "*Haz clic en el código para copiarlo al portapapeles." })
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
const LeafletMap = lazy(
  () => import("./LeafletMap-C3F2iawj.js").then((m) => ({ default: m.default }))
);
function MapSkeleton() {
  const { t } = useSettings();
  return /* @__PURE__ */ jsx("div", { className: "flex h-[220px] w-full items-center justify-center bg-muted", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-3 text-muted-foreground", children: [
    /* @__PURE__ */ jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" }),
    /* @__PURE__ */ jsx("span", { className: "text-xs font-medium", children: t("canchas.loadingMap") || "Cargando mapa…" })
  ] }) });
}
const SPORTS$1 = [
  { id: 1, label: "Fútbol", emoji: "⚽" },
  { id: 2, label: "Tenis", emoji: "🎾" },
  { id: 3, label: "Golf", emoji: "⛳" },
  { id: 4, label: "Pádel", emoji: "🏓" }
];
function AddCanchaForm({ onBack, onSaved }) {
  const { t } = useSettings();
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
    const e = {};
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
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-secondary", children: t("canchas.added") || "¡Cancha añadida!" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: t("canchas.addedDesc") || "Ya aparece en el listado de canchas" })
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
        /* @__PURE__ */ jsx("h1", { className: "text-lg md:text-3xl font-bold text-secondary", children: t("canchas.addTitle") || "Añadir cancha" }),
        /* @__PURE__ */ jsx("p", { className: "text-[11px] md:text-sm text-muted-foreground", children: t("canchas.addSubtitle") || "Registra una nueva cancha deportiva" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto px-5 md:px-12 py-5 md:py-8 pb-32 space-y-6 md:space-y-8 max-w-2xl mx-auto w-full", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground", children: [
          "🏟️ ",
          t("canchas.name") || "Nombre",
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-primary", children: "*" })
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            value: name,
            onChange: (e) => setName(e.target.value),
            placeholder: t("canchas.namePlaceholder") || "Ej: Cancha San Bernardino",
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
          "⚡ ",
          t("createEvent.sport") || "Deporte",
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-primary", children: "*" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2", children: SPORTS$1.map((s) => {
          let displayLabel = s.label;
          if (s.id === 1) displayLabel = t("sports.football") || "Fútbol";
          else if (s.id === 2) displayLabel = t("sports.tennis") || "Tenis";
          else if (s.id === 3) displayLabel = t("sports.golf") || "Golf";
          else if (s.id === 4) displayLabel = t("sports.padel") || "Pádel";
          return /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setSportId(s.id),
              className: `flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-sm font-semibold transition-all active:scale-[0.97] ${sportId === s.id ? "gradient-primary border-transparent text-secondary shadow-pop" : "border-border bg-card text-muted-foreground hover:border-primary/40"}`,
              children: [
                /* @__PURE__ */ jsx("span", { className: "text-xl", children: s.emoji }),
                displayLabel
              ]
            },
            s.id
          );
        }) }),
        errors.sportId && /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-1 text-[11px] font-medium text-destructive", children: [
          /* @__PURE__ */ jsx(AlertCircle, { size: 11 }),
          " ",
          errors.sportId
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground", children: [
          "📍 ",
          t("editProfile.location") || "Ubicación",
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-primary", children: "*" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-2xl border border-border bg-card shadow-soft", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3", children: [
            /* @__PURE__ */ jsx(MapPin, { size: 16, className: "text-primary shrink-0" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-muted-foreground line-clamp-1", children: address || (t("canchas.tapMap") || "Toca el mapa para elegir la ubicación") })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "relative z-0 h-[220px] w-full", children: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(MapSkeleton, {}), children: /* @__PURE__ */ jsx(LeafletMap, { onLocationSelect: handleMapClick }) }) }),
          latitude && longitude && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 border-t border-border bg-emerald-50 px-3 py-2", children: [
            /* @__PURE__ */ jsx(CheckCircle2, { size: 12, className: "text-emerald-600" }),
            /* @__PURE__ */ jsx("span", { className: "text-[11px] font-medium text-emerald-700", children: t("canchas.locationSelected") || "Ubicación seleccionada" })
          ] })
        ] }),
        errors.location && /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-1 text-[11px] font-medium text-destructive", children: [
          /* @__PURE__ */ jsx(AlertCircle, { size: 11 }),
          " ",
          errors.location
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground", children: [
          "📝 ",
          t("canchas.description") || "Descripción"
        ] }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            value: description,
            onChange: (e) => setDescription(e.target.value),
            placeholder: t("canchas.descPlaceholder") || "Iluminación nocturna, vestuarios, estacionamiento...",
            rows: 3,
            className: "w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm font-medium text-secondary outline-none transition-colors focus:border-primary resize-none placeholder:text-muted-foreground/50"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground", children: [
          "💰 ",
          t("canchas.pricePerHour") || "Precio por hora (Bs.)"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 shadow-soft focus-within:border-primary transition-colors", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-muted-foreground", children: "Bs." }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              min: 0,
              value: price,
              onChange: (e) => setPrice(e.target.value),
              placeholder: t("canchas.pricePlaceholder") || "Ej: 50 (opcional)",
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
          t("canchas.saving") || "Guardando cancha…"
        ] }) : t("canchas.save") || "Guardar cancha"
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
  descriptionAfterArrival: "",
  hostClanId: ""
};
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
  const { t } = useSettings();
  const [canchas, setCanchas] = useState([]);
  const [loadingCanchas, setLoadingCanchas] = useState(true);
  const [showAddCanchaForm, setShowAddCanchaForm] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [captainedClans, setCaptainedClans] = useState([]);
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
        supabase.from("clans").select("*, clan_members(*)").eq("captain_id", data.user.id).then((res) => {
          if (res.data) setCaptainedClans(res.data);
        });
      }
    });
  }, []);
  useEffect(() => {
    if (initialCancha) {
      const coords = parseLocation(initialCancha.location);
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
    if (!form.sportId) newErrors.sportId = t("createEvent.err.sport") || "Selecciona un deporte";
    if (!form.intensity) newErrors.intensity = t("createEvent.err.intensity") || "Selecciona la intensidad";
    if (!form.date) newErrors.date = t("createEvent.err.date") || "La fecha es obligatoria";
    if (!form.time) newErrors.time = t("createEvent.err.time") || "La hora es obligatoria";
    if (!form.canchaId) newErrors.canchaId = t("createEvent.err.court") || "Selecciona una cancha obligatoriamente";
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
        setServerError(t("createEvent.loginRequired") || "Debes iniciar sesión para crear un evento.");
        setStatus("error");
        return;
      }
      if (!user.email) {
        setServerError(t("createEvent.emailError") || "No se pudo obtener el email del usuario. Intenta cerrar sesión y volver a entrar.");
        setStatus("error");
        return;
      }
      const payload = {
        creator_username: user.email,
        sport_id: form.sportId,
        cancha_id: form.canchaId ? parseInt(form.canchaId, 10) : null,
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
        if (form.hostClanId) {
          const clan = captainedClans.find((c) => c.id === form.hostClanId);
          if (clan) {
            const members = clan.clan_members.filter((m) => m.status === "approved");
            const { data: profiles } = await supabase.from("profiles").select("id, username").in("id", members.map((m) => m.user_id));
            if (profiles) {
              const insertData = profiles.map((p) => ({
                event_id: newEvent.id,
                user_username: p.username,
                status: "aceptado",
                clan_id: clan.id
              }));
              await supabase.from("event_participants").insert(insertData);
            }
          }
        } else {
          const { error: joinError } = await supabase.from("event_participants").insert({
            event_id: newEvent.id,
            user_username: user.email,
            status: "aceptado"
          });
          if (joinError) {
            console.error("Error adding creator as participant:", joinError);
          }
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
        setServerError(`${t("createEvent.error") || "Error al crear el evento"}: ${pgErr.message}`);
      } else {
        console.error("❌ Error inesperado:", err);
        setServerError(t("createEvent.unexpectedError") || "Error inesperado al crear el evento.");
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
            const coords = parseLocation(newCancha.location);
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
        /* @__PURE__ */ jsx("span", { className: "inline-flex rounded-full bg-emerald-500/25 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-emerald-400 border border-emerald-500/30 animate-pulse", children: t("createEvent.published") || "¡EVENTO PUBLICADO! ⚽" }),
        /* @__PURE__ */ jsx("div", { className: "grid h-24 w-24 place-items-center rounded-full bg-emerald-500 text-white shadow-pop ring-8 ring-emerald-500/20", children: /* @__PURE__ */ jsx(CheckCircle2, { size: 48, strokeWidth: 2.5 }) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl font-black text-white tracking-tight drop-shadow-md", children: t("createEvent.done") || "¡Listo!" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-white/80 px-4 leading-relaxed", children: t("createEvent.successMsg") || "Tu partido ya está en el mapa, listo para que otros jugadores se unan. ¡A jugar!" })
        ] }),
        showFloatXp && /* @__PURE__ */ jsx("div", { className: "float-xp z-50", children: "+25 XP ⚡" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleDismissSuccess,
            className: "w-full rounded-2xl gradient-primary py-3.5 text-xs font-black uppercase tracking-wider text-secondary shadow-pop transition-all active:scale-95 mt-4 cursor-pointer",
            children: t("createEvent.understood") || "¡Entendido!"
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
        /* @__PURE__ */ jsx("h1", { className: "text-lg font-bold text-secondary", children: t("createEvent.title") || "Nuevo evento" }),
        /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground", children: t("createEvent.subtitle") || "Completa los datos para publicar tu evento" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto px-5 py-5 pb-32 space-y-6", children: [
      /* @__PURE__ */ jsx(
        FormSection,
        {
          title: t("createEvent.sport") || "Deporte",
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
          title: t("createEvent.intensity") || "Intensidad",
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
            title: t("createEvent.date") || "Fecha",
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
            title: t("createEvent.time") || "Hora",
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
          title: t("createEvent.facility") || "Instalación / Cancha",
          icon: /* @__PURE__ */ jsx(MapPin, { size: 13 }),
          error: errors.canchaId,
          required: true,
          children: loadingCanchas ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3.5 shadow-soft animate-pulse", children: [
            /* @__PURE__ */ jsx(Loader2, { size: 16, className: "animate-spin text-primary shrink-0" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-muted-foreground", children: t("createEvent.loadingCourts") || "Cargando canchas disponibles..." })
          ] }) : canchas.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-center", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-destructive", children: t("createEvent.noCourts") || "No hay canchas registradas en la app." }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground mt-1", children: t("createEvent.registerFirst") || "Registra primero una cancha en la sección de Canchas." }),
            isOrganizer && /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => setShowAddCanchaForm(true),
                className: "mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline",
                children: [
                  "+ ",
                  t("createEvent.createCourt") || "+ Crear nueva cancha"
                ]
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
                  },
                  className: `w-full appearance-none rounded-2xl border bg-card px-4 py-3.5 pr-10 text-sm font-semibold text-secondary outline-none transition-all focus:border-primary shadow-soft ${errors.canchaId ? "border-destructive" : "border-border"}`,
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: t("createEvent.selectCourt") || "-- Selecciona una cancha --" }),
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
      captainedClans.filter((c) => c.sport === form.sportId).length > 0 && /* @__PURE__ */ jsxs(
        FormSection,
        {
          title: t("createEvent.autoClan") || "Inscribir Clan Automáticamente",
          icon: /* @__PURE__ */ jsx(Shield, { size: 13 }),
          children: [
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: form.hostClanId,
                  onChange: (e) => setField("hostClanId", e.target.value),
                  className: "w-full appearance-none rounded-2xl border bg-card px-4 py-3.5 pr-10 text-sm font-semibold text-secondary outline-none transition-all focus:border-primary shadow-soft border-border",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: t("createEvent.noClan") || "-- No inscribir clan completo --" }),
                    captainedClans.filter((c) => c.sport === form.sportId).map((c) => /* @__PURE__ */ jsx("option", { value: c.id, children: t("createEvent.enrollClan")?.replace("{name}", c.name).replace("{count}", c.clan_members.filter((m) => m.status === "approved").length) || `Inscribir a ${c.name} (${c.clan_members.filter((m) => m.status === "approved").length} miembros)` }, c.id))
                  ]
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-y-0 right-4 flex items-center text-muted-foreground", children: /* @__PURE__ */ jsx(Shield, { size: 16 }) })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground mt-1", children: t("createEvent.clanNote") || "Si seleccionas un clan, todos sus miembros actuales serán inscritos automáticamente en este evento." })
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        FormSection,
        {
          title: t("createEvent.maxCapacity") || "Capacidad máxima",
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
                placeholder: t("createEvent.capacityPlaceholder") || "Ej: 12 jugadores (opcional)",
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
          title: t("createEvent.description") || "Descripción",
          icon: /* @__PURE__ */ jsx(FileText, { size: 13 }),
          children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 rounded-2xl border border-border bg-card px-4 py-3 shadow-soft focus-within:border-primary transition-colors", children: [
            /* @__PURE__ */ jsx(
              "textarea",
              {
                id: "event-description-input",
                maxLength: 150,
                rows: 3,
                placeholder: t("createEvent.descPlaceholder") || "Ej: Traer ropa cómoda, agua y actitud deportiva. (Máximo 150 caracteres)",
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
            t("createEvent.publishing") || "Publicando evento…"
          ] }) : t("createEvent.publish") || "Publicar evento"
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
const getSportImage$1 = (sportId) => {
  if (sportId === 1) return footballField;
  if (sportId === 2) return tennisCourt;
  if (sportId === 3) return golfCourse;
  if (sportId === 4) return padelCourt;
  return runningTrail;
};
function MyEventsScreen({ onSelect, onNavigateToProfile }) {
  const { t } = useSettings();
  const [tab, setTab] = useState(0);
  const [showCreateForm, setShowCreateForm] = useState(false);
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
    const coords = parseLocation$2(row.location);
    const lat = coords?.lat ?? 0;
    const lng = coords?.lng ?? 0;
    const sportName = row.sport_id === 1 ? t("sports.football") || "Fútbol" : row.sport_id === 2 ? t("sports.tennis") || "Tenis" : row.sport_id === 3 ? t("sports.golf") || "Golf" : row.sport_id === 4 ? t("sports.padel") || "Pádel" : t("sports.other") || "Otro";
    return {
      ...row,
      lat,
      lng,
      sport: sportName,
      title: row.title || `Evento de ${sportName}`,
      host: row.creator_username || (t("common.user") || "Usuario"),
      hostAvatar: (row.creator_username || "U").substring(0, 2).toUpperCase(),
      time: row.event_date ? new Date(row.event_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "00:00",
      date: row.event_date ? new Date(row.event_date).toLocaleDateString("es-VE", { weekday: "short", day: "numeric", month: "short" }) : t("events.upcoming") || "Próximamente",
      image: getSportImage$1(row.sport_id),
      distanceKm: 2.5,
      joined: row.joined ?? 1,
      spots: row.max_capacity || 10,
      price: 0,
      zone: "Caracas",
      canchas: row.canchas,
      cancha_name: row.canchas?.name,
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
    const { data, error } = await supabase.from("events").select("*, canchas(name)").or(`event_date.gte.${now},status.eq.abierto`).order("event_date", { ascending: true });
    if (!error && data) {
      setAvailableEvents(data.map(formatEvent2).filter(Boolean));
    }
    setLoading(false);
  }
  async function fetchUserEvents(email) {
    if (!email) return;
    setLoading(true);
    const { data: createdData } = await supabase.from("events").select("*, canchas(name)").eq("creator_username", email);
    const { data: joinedData } = await supabase.from("event_participants").select("events(*, canchas(name))").eq("user_username", email).neq("status", "rechazado");
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
    setTab(upcoming.length > 0 ? 1 : 0);
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
      alert(t("events.error.noPermission") || "No tienes permiso para realizar esta acción.");
      return;
    }
    setActionLoading(participantId.toString());
    const { error } = await supabase.from("event_participants").update({ status }).eq("id", participantId);
    if (!error) {
      setPendingRequests((prev) => prev.filter((r) => r.id !== participantId));
    } else {
      console.error(error);
      alert((t("events.error.processing") || "Error al procesar la solicitud: ") + error.message);
    }
    setActionLoading(null);
  }
  return /* @__PURE__ */ jsxs("div", { className: "h-full overflow-y-auto bg-background pb-24", children: [
    /* @__PURE__ */ jsx(CouponPopup, {}),
    /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between px-5 pb-3 pt-12", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-secondary", children: t("nav.events") }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: t("events.search") })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            id: "fab-create-event-btn",
            onClick: () => setShowCreateForm(true),
            className: "flex items-center gap-1.5 rounded-2xl gradient-primary px-4 py-2.5 text-xs font-bold text-secondary shadow-pop transition-all active:scale-95 hover:scale-105",
            "aria-label": t("events.createEvent") || "Crear partido",
            style: { boxShadow: "0 4px 18px rgba(99,102,241,0.45)" },
            children: [
              /* @__PURE__ */ jsx(Plus, { size: 15, strokeWidth: 2.5 }),
              t("events.createEvent")
            ]
          }
        ),
        /* @__PURE__ */ jsx(UserAvatar, { size: "md", className: "cursor-pointer", onClick: onNavigateToProfile })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "sticky top-0 z-10 bg-background/80 px-5 pb-3 pt-1 backdrop-blur", children: /* @__PURE__ */ jsx("div", { className: "flex gap-1 rounded-full bg-muted p-1", children: [
      t("events.tab.upcoming") || "Próximos",
      t("events.tab.mine") || "Mis Partidos",
      t("events.tab.requests") || "Solicitudes"
    ].map((label, index) => {
      if (index === 2 && createdEvents.length === 0) return null;
      return /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setTab(index),
          className: `flex-1 rounded-full py-2 text-xs font-semibold transition-all ${tab === index ? "bg-card text-secondary shadow-soft" : "text-muted-foreground"}`,
          children: label
        },
        label
      );
    }) }) }),
    tab === 2 ? /* @__PURE__ */ jsx("div", { className: "space-y-3 px-5 pt-3", children: loading ? /* @__PURE__ */ jsx("div", { className: "flex justify-center p-5", children: /* @__PURE__ */ jsx(Loader2, { className: "animate-spin text-primary" }) }) : pendingRequests.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center text-sm text-muted-foreground p-5", children: t("events.noPendingRequests") || "No tienes solicitudes pendientes nuevas" }) : pendingRequests.map((req) => {
      const isPremium = req.profiles?.is_premium;
      const sportName = req.events?.sport_id === 1 ? t("sports.football") || "Fútbol" : req.events?.sport_id === 2 ? t("sports.tennis") || "Tenis" : req.events?.sport_id === 3 ? t("sports.golf") || "Golf" : req.events?.sport_id === 4 ? t("sports.padel") || "Pádel" : "Evento";
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
                  /* @__PURE__ */ jsx("div", { className: "text-sm font-bold text-secondary", children: req.user_username?.split("@")[0] || (t("common.user") || "Usuario") }),
                  isPremium ? /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-0.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-700", children: [
                    /* @__PURE__ */ jsx(Star, { size: 8, className: "fill-amber-500" }),
                    " ",
                    t("profile.premium") || "Premium"
                  ] }) : /* @__PURE__ */ jsx("span", { className: "rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground", children: t("profile.basic") || "Básica" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground mt-0.5", children: [
                  t("events.wantsToJoin") || "quiere unirse a tu partido de",
                  " ",
                  sportName,
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      onClick: (e) => {
                        e.stopPropagation();
                        setSelectedUserProfile(req.profiles || { username: req.user_username });
                      },
                      className: "text-[10px] font-extrabold text-primary hover:underline block text-left mt-1",
                      children: [
                        t("events.viewProfile") || "Ver Perfil",
                        " 🔍"
                      ]
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
              children: t("friends.reject") || "Rechazar"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              disabled: actionLoading === req.id.toString(),
              onClick: () => handleAction(req.id, "aceptado"),
              className: "flex flex-1 items-center justify-center rounded-xl gradient-primary py-2.5 text-xs font-bold text-secondary shadow-pop disabled:opacity-50",
              children: actionLoading === req.id.toString() ? /* @__PURE__ */ jsx(Loader2, { size: 14, className: "animate-spin" }) : t("friends.accept") || "Aceptar"
            }
          )
        ] })
      ] }, req.id);
    }) }) : /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-4 px-5 pt-3", children: [
      tab === 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
        availableEvents.map((e) => /* @__PURE__ */ jsx(EventCard, { event: e, onClick: () => onSelect(e) }, e.id)),
        availableEvents.length === 0 && /* @__PURE__ */ jsx("div", { className: "w-full text-center text-sm text-muted-foreground p-5 mt-10", children: t("events.noEvents") })
      ] }),
      tab === 1 && /* @__PURE__ */ jsxs(Fragment, { children: [
        myEvents.map((e) => /* @__PURE__ */ jsx(EventCard, { event: e, onClick: () => onSelect(e) }, e.id)),
        myEvents.length === 0 && /* @__PURE__ */ jsx("div", { className: "w-full text-center text-sm text-muted-foreground p-5 mt-10", children: t("events.noUpcomingMatches") || "No tienes partidos próximos programados" })
      ] })
    ] }),
    selectedUserProfile && (() => {
      const formatted = getFormattedProfile(selectedUserProfile, t);
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
              formatted.is_organizer && /* @__PURE__ */ jsx("span", { className: "inline-flex items-center gap-0.5 rounded-full bg-amber-500/20 px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-amber-500 border border-amber-500/30", children: t("profile.organizer") || "Organizador" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] text-white/50", children: formatted.username })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 text-center text-xs", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-white/5 p-2 rounded-xl border border-white/10", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[9px] text-white/50 block font-bold", children: t("profile.age") || "Edad" }),
              /* @__PURE__ */ jsxs("span", { className: "font-extrabold text-white", children: [
                formatted.age,
                " ",
                t("common.years") || "años"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white/5 p-2 rounded-xl border border-white/10", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[9px] text-white/50 block font-bold", children: t("profile.gender") || "Género" }),
              /* @__PURE__ */ jsx("span", { className: "font-extrabold text-white truncate block", children: formatted.gender })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white/5 p-2 rounded-xl border border-white/10", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[9px] text-white/50 block font-bold", children: t("profile.location") || "Ubicación" }),
              /* @__PURE__ */ jsx("span", { className: "font-extrabold text-white truncate block", title: formatted.location, children: formatted.location })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[9px] text-white/50 font-bold uppercase tracking-wider block", children: t("profile.aboutMe") || "Sobre mí" }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs leading-relaxed text-white/80 bg-white/5 p-3 rounded-xl border border-white/5 italic", children: [
              '"',
              formatted.bio,
              '"'
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[9px] text-white/50 font-bold uppercase tracking-wider block", children: t("profile.favSports") || "Deportes Favoritos" }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: formatted.sports.map((sport) => /* @__PURE__ */ jsx("span", { className: "rounded-full bg-primary/15 border border-primary/25 px-2.5 py-0.5 text-[9px] font-bold text-primary", children: sport }, sport)) })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setSelectedUserProfile(null),
              className: "w-full rounded-2xl bg-muted py-3 text-xs font-black uppercase tracking-wider text-muted-foreground shadow-sm hover:bg-muted/80 transition-all mt-2 cursor-pointer",
              children: t("profile.closeProfile") || "Cerrar Perfil"
            }
          )
        ] })
      ] }) });
    })(),
    showCreateForm && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 bg-background", children: /* @__PURE__ */ jsx(
      CreateEventForm,
      {
        onClose: () => setShowCreateForm(false),
        onEventCreated: () => {
          setShowCreateForm(false);
          supabase.auth.getUser().then(({ data }) => {
            if (data.user) {
              fetchAvailable();
              fetchUserEvents(data.user.email);
            }
          });
        }
      }
    ) })
  ] });
}
const getFormattedProfile = (p, t) => {
  if (!p) return null;
  const username = p.username || (t ? t("common.user") : "Usuario");
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
  const name = username.includes("@") ? username.split("@")[0].split(/[._-]/).map((n) => n.charAt(0).toUpperCase() + n.slice(1)).join(" ") : username;
  return {
    name,
    username,
    age,
    gender: p.gender || (charCodeSum % 2 === 0 ? t ? t("profile.male") : "Masculino" : t ? t("profile.female") : "Femenino"),
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
function formatEvent(row, t) {
  if (!row) return null;
  const getSportName = (id) => {
    if (id === 1) return t("sports.football") || "Fútbol";
    if (id === 2) return t("sports.tennis") || "Tenis";
    if (id === 3) return t("sports.golf") || "Golf";
    if (id === 4) return t("sports.padel") || "Pádel";
    if (id === 5) return t("sports.hiking") || "Senderismo";
    if (id === 6) return t("sports.running") || "Running";
    if (id === 7) return t("sports.volleyball") || "Vóleibol";
    return t("sports.other") || "Deporte";
  };
  const sportName = getSportName(row.sport_id);
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
    }) : t("common.soon") || "Próximamente",
    image: getSportImage(row.sport_id),
    distanceKm: 2.5,
    joined: row.joined ?? 1,
    spots: row.max_capacity || 10,
    price: 0,
    zone: "Caracas"
  };
}
function MySportsScreen({ onSelectEvent, onNavigateToProfile }) {
  const { t } = useSettings();
  const [loading, setLoading] = useState(true);
  const [sportGroups, setSportGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        const { data } = await supabase.from("event_participants").select(`events!inner(*)`).eq("user_username", user.email);
        if (data && data.length > 0) {
          const groups = {};
          const getSportName = (id) => {
            if (id === 1) return t("sports.football") || "Fútbol";
            if (id === 2) return t("sports.tennis") || "Tenis";
            if (id === 3) return t("sports.golf") || "Golf";
            if (id === 4) return t("sports.padel") || "Pádel";
            if (id === 5) return t("sports.hiking") || "Senderismo";
            if (id === 6) return t("sports.running") || "Running";
            if (id === 7) return t("sports.volleyball") || "Vóleibol";
            return t("sports.other") || "Deporte";
          };
          data.forEach((p) => {
            const ev = p.events;
            if (!ev) return;
            const sid = ev.sport_id;
            if (!groups[sid]) {
              groups[sid] = {
                sportId: sid,
                name: getSportName(sid),
                emoji: SPORT_EMOJIS[sid] || "🏅",
                count: 0,
                events: []
              };
            }
            groups[sid].count += 1;
            groups[sid].events.push(formatEvent(ev, t));
          });
          setSportGroups(Object.values(groups));
        }
      }
      setLoading(false);
    });
  }, [t]);
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
            " ",
            selectedGroup.count === 1 ? t("mySports.match") || "partido" : t("mySports.matches") || "partidos"
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
          t("mySports.title") || "Mis deportes"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: t("mySports.subtitle") || "Tus estadísticas y partidos por disciplina" })
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
              " ",
              g.count === 1 ? t("mySports.match") || "partido" : t("mySports.matches") || "partidos"
            ] })
          ] }),
          /* @__PURE__ */ jsx(ChevronRight, { size: 16, className: "text-primary shrink-0" })
        ]
      },
      g.sportId
    )) : /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground p-3 text-center bg-card rounded-2xl shadow-soft", children: t("mySports.noSports") || "No te has unido a eventos de ningún deporte todavía" }) }) })
  ] });
}
function FriendsScreen({
  onNavigateToProfile,
  onSelectEvent
}) {
  const { user, addXp, incrementCarisma } = useCurrentUser();
  const { t } = useSettings();
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
        name = p.username.split("@")[0].split(/[._-]/).map((n) => n.charAt(0).toUpperCase() + n.slice(1)).join(" ");
      } else if (p.username) {
        name = p.username;
      }
    }
    return {
      id: p.id,
      name: name || (t("friends.defaultName") || "Deportista"),
      username: p.username,
      age: p.age || "?",
      location: p.location || (t("friends.unknownLocation") || "Ubicación desconocida"),
      bio: p.description || (t("friends.noDescription") || "Sin descripción"),
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
      await addXp(15, t("friends.acceptedXp") ? t("friends.acceptedXp").replace("{name}", request.name) : `¡Aceptaste a ${request.name} como amigo! 🤝`);
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
          /* @__PURE__ */ jsx("span", { className: "inline-flex rounded-full bg-primary/20 px-3.5 py-1 text-[10px] font-black uppercase tracking-widest text-primary border border-primary/20", children: t("friends.sendingRequest") || "Enviando solicitud..." }),
          /* @__PURE__ */ jsxs("h3", { className: "text-xl font-black text-white", children: [
            t("friends.connectingWith") || "Conectando con",
            " ",
            activeRequestUser.name
          ] })
        ] })
      ] }),
      matchProgress === "sent" && /* @__PURE__ */ jsxs("div", { className: "space-y-6 max-w-sm flex flex-col items-center animate-in zoom-in-95 duration-500 relative z-10", children: [
        /* @__PURE__ */ jsx("span", { className: "inline-flex rounded-full bg-emerald-500/25 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-emerald-400 border border-emerald-500/30 animate-pulse", children: t("friends.requestSent") || "¡SOLICITUD ENVIADA! 🤝" }),
        /* @__PURE__ */ jsx("div", { className: "grid h-24 w-24 place-items-center rounded-full bg-emerald-500 text-white shadow-pop ring-8 ring-emerald-500/20", children: /* @__PURE__ */ jsx(CheckCircle2, { size: 48, strokeWidth: 2.5 }) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl font-black text-white tracking-tight drop-shadow-md", children: t("friends.sent") || "¡Enviado!" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-white/80 px-4 leading-relaxed", children: t("friends.requestDesc") ? t("friends.requestDesc").replace("{name}", activeRequestUser.name) : `Has enviado una solicitud de Match a ${activeRequestUser.name}. Ahora debes esperar a que la apruebe para aparecer en tu lista de amigos.` })
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
            children: t("friends.gotIt") || "¡Entendido!"
          }
        )
      ] }),
      matchProgress === "error" && /* @__PURE__ */ jsxs("div", { className: "space-y-6 max-w-sm flex flex-col items-center animate-in zoom-in-95 duration-500 relative z-10", children: [
        /* @__PURE__ */ jsxs("span", { className: "inline-flex rounded-full bg-red-500/20 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-red-500 border border-red-500/30", children: [
          (t("common.error") || "ERROR").toUpperCase(),
          " 💔"
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "text-3xl font-black text-white tracking-tight", children: t("friends.problem") || "Hubo un problema" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-white/80 leading-relaxed px-6 bg-white/5 p-4 rounded-2xl border border-white/5", children: t("friends.errorDesc") || "No pudimos enviar tu solicitud. Verifica tu conexión o asegúrate de haber creado la tabla de friend_requests." }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              setMatchProgress(null);
              setActiveRequestUser(null);
            },
            className: "w-full rounded-2xl bg-red-500 hover:bg-red-600 text-white py-3.5 text-xs font-black uppercase tracking-wider shadow-pop transition-all active:scale-95 cursor-pointer",
            children: t("common.close") || "Cerrar"
          }
        )
      ] })
    ] }),
    acceptedMatchUser && /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-6 text-center animate-in fade-in duration-300 backdrop-blur-sm", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 sunburst-rays opacity-20 pointer-events-none" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6 max-w-sm flex flex-col items-center animate-in zoom-in-95 duration-500", children: [
        /* @__PURE__ */ jsx("span", { className: "inline-flex rounded-full bg-emerald-500/25 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-emerald-400 border border-emerald-500/30 animate-pulse", children: t("friends.newMatch") || "¡NUEVO MATCH! 🤝" }),
        /* @__PURE__ */ jsx("h2", { className: "text-4xl font-black text-white tracking-tight drop-shadow-md", children: t("friends.requestAccepted") || "¡SOLICITUD ACEPTADA!" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-white/80 px-4", children: t("friends.nowFriends") ? t("friends.nowFriends").replace("{name}", acceptedMatchUser.name) : `¡Tú y ${acceptedMatchUser.name} ahora son amigos! Han ganado +1 punto de Carisma.` }),
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
            children: t("common.close") || "Cerrar"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between px-5 pb-3 pt-12", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-secondary", children: t("friends.title") }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: t("friends.findPlayers") })
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
            t("friends.forYou") || "Para ti"
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
            t("friends.myFriends"),
            " (",
            friends.length,
            ")"
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto px-5 pt-3", children: activeSubTab === "tinder" ? /* @__PURE__ */ jsx("div", { className: "h-full flex flex-col items-center justify-center pb-4 relative", children: loadingProfiles ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center gap-3 py-12", children: [
      /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground font-bold uppercase tracking-wider animate-pulse", children: t("friends.loadingProfiles") || "Cargando perfiles reales..." })
    ] }) : activeCandidate ? /* @__PURE__ */ jsxs("div", { className: "w-full max-w-sm h-full max-h-[460px] flex flex-col justify-between rounded-3xl bg-card border border-border shadow-pop relative overflow-hidden animate-in zoom-in-95 duration-300", children: [
      /* @__PURE__ */ jsxs("div", { className: `h-40 shrink-0 flex items-center justify-center relative bg-gradient-to-tr ${activeCandidate.gradient}`, children: [
        activeCandidate.avatar_url ? /* @__PURE__ */ jsx("img", { src: activeCandidate.avatar_url, className: "absolute inset-0 w-full h-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: "text-6xl drop-shadow-md select-none", children: activeCandidate.emoji }),
        /* @__PURE__ */ jsxs("div", { className: "absolute top-4 right-4 flex items-center gap-1 rounded-full bg-black/40 backdrop-blur-md px-3 py-1 text-[10px] font-black text-white border border-white/10 shadow-pop", children: [
          /* @__PURE__ */ jsx(Sparkles, { size: 10, className: "text-primary animate-pulse" }),
          /* @__PURE__ */ jsxs("span", { children: [
            getCompatibilityScore(activeCandidate.sports),
            "% ",
            t("friends.compatible") || "Compatible"
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
              " ",
              t("common.years") || "años"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground leading-relaxed line-clamp-3", children: [
            '"',
            activeCandidate.bio,
            '"'
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5 border-t border-dashed border-border/80 pt-3", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground font-black uppercase tracking-wider block", children: t("sports.title") || "Deportes" }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: activeCandidate.sports.map((sport) => /* @__PURE__ */ jsx(SportBadge, { sport }, sport)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-4 border-t border-border/60 bg-muted/20 flex justify-center gap-6", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleReject,
            className: "grid h-12 w-12 place-items-center rounded-full bg-card border border-border text-muted-foreground hover:text-rose-500 hover:border-rose-200 active:scale-90 transition-all shadow-soft",
            title: t("friends.reject") || "Descartar",
            children: /* @__PURE__ */ jsx(X, { size: 20, strokeWidth: 2.5 })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleLike(activeCandidate),
            className: "grid h-12 w-12 place-items-center rounded-full gradient-primary text-secondary hover:shadow-lg active:scale-90 transition-all shadow-pop",
            title: t("friends.makeMatch") || "¡Hacer Match!",
            children: /* @__PURE__ */ jsx(Heart, { size: 20, strokeWidth: 2.5, className: "fill-current" })
          }
        )
      ] })
    ] }) : /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-dashed border-border bg-card p-8 text-center space-y-4 max-w-sm w-full py-12", children: [
      /* @__PURE__ */ jsx("div", { className: "text-5xl", children: "⚔️" }),
      /* @__PURE__ */ jsx("h4", { className: "text-lg font-black text-secondary", children: t("friends.noFriends") }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-2 max-w-[250px] mx-auto", children: t("friends.findPlayersDescription") }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setCurrentIndex(0),
          className: "rounded-2xl bg-secondary hover:bg-secondary/90 text-primary py-3 px-6 text-xs font-black uppercase tracking-wider transition-all active:scale-95 shadow-soft border border-primary/20",
          children: [
            t("friends.resetList"),
            " 🔄"
          ]
        }
      )
    ] }) }) : /* @__PURE__ */ jsxs("div", { className: "space-y-5 pb-8", children: [
      receivedRequests.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx(UserPlus, { size: 14, className: "text-primary" }),
          " ",
          t("friends.requests")
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-2", children: receivedRequests.map((req) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-card p-3 shadow-soft flex items-center justify-between gap-3 animate-in slide-in-from-top duration-300", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
            renderAvatar(req, "h-11 w-11 text-xl"),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-1.5", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-secondary truncate", children: req.name }),
                /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
                  req.age,
                  " ",
                  t("common.years")
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
                title: t("friends.reject"),
                children: /* @__PURE__ */ jsx(UserX, { size: 15 })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleAcceptRequest(req),
                className: "grid h-8 w-8 place-items-center rounded-xl gradient-primary text-secondary shadow-sm",
                title: t("friends.accept"),
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
            " ",
            t("friends.mySavedFriends") || "Mis Amigos Guardados"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold text-muted-foreground", children: [
            filteredFriends.length,
            " ",
            t("friends.friendsCount") || "amigos"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              placeholder: t("friends.searchPlaceholder") || "Buscar amigo por nombre, deporte...",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              className: "w-full rounded-2xl border border-border bg-card pl-10 pr-4 py-2.5 text-xs text-secondary outline-none transition-colors focus:border-primary"
            }
          ),
          /* @__PURE__ */ jsx(Search, { size: 14, className: "absolute left-3.5 top-3.5 text-muted-foreground" })
        ] }),
        filteredFriends.length === 0 ? /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-dashed border-border bg-card/40 p-8 text-center text-xs text-muted-foreground", children: searchQuery ? t("friends.searchEmpty") || "No se encontraron amigos con ese criterio" : t("friends.noFriendsAdded") || "Aún no tienes amigos agregados. ¡Busca conexiones en la pestaña 'Para ti'!" }) : /* @__PURE__ */ jsx("div", { className: "space-y-2", children: filteredFriends.map((friend) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-card p-3 shadow-soft flex items-center justify-between gap-3 hover:border-primary/20 transition-all", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
            renderAvatar(friend, "h-11 w-11 text-xl"),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-1.5", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-secondary truncate", children: friend.name }),
                /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
                  friend.age,
                  " ",
                  t("common.years") || "años"
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
              title: t("friends.sendMessage") || "Enviar Mensaje",
              children: /* @__PURE__ */ jsx(MessageSquare, { size: 14, className: "text-primary" })
            }
          )
        ] }, friend.id)) })
      ] })
    ] }) })
  ] });
}
function ClansScreen({
  onNavigateToProfile,
  onSelectEvent
}) {
  const { user } = useCurrentUser();
  const { t } = useSettings();
  const [activeTab, setActiveTab] = useState("mis-clanes");
  const [clans, setClans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClan, setSelectedClan] = useState(null);
  const [clanMembers, setClanMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [friends, setFriends] = useState([]);
  const [createData, setCreateData] = useState({ name: "", sport: "Pádel", primary: "#32CD32", secondary: "#1a1a1a", description: "" });
  const [creating, setCreating] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({ name: "", sport: "Pádel", primary: "#32CD32", secondary: "#1a1a1a", description: "" });
  const [editing, setEditing] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [joining, setJoining] = useState(false);
  useEffect(() => {
    if (user?.id) fetchMyClans();
  }, [user]);
  useEffect(() => {
    if (selectedClan) fetchClanMembers(selectedClan.id);
  }, [selectedClan]);
  async function fetchMyClans() {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data: capClans } = await supabase.from("clans").select("*").eq("captain_id", user.id);
      const { data: memberRows } = await supabase.from("clan_members").select("clan_id").eq("user_id", user.id).eq("status", "approved");
      let allClans = [...capClans || []];
      if (memberRows && memberRows.length > 0) {
        const clanIds = memberRows.map((r) => r.clan_id);
        const { data: memberClans } = await supabase.from("clans").select("*").in("id", clanIds);
        if (memberClans) {
          memberClans.forEach((mc) => {
            if (!allClans.find((c) => c.id === mc.id)) allClans.push(mc);
          });
        }
      }
      setClans(allClans);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }
  async function fetchClanMembers(clanId) {
    setLoadingMembers(true);
    try {
      const { data } = await supabase.from("clan_members").select(`*, profiles:user_id(username, avatar_url, rating, full_name)`).eq("clan_id", clanId);
      if (data) setClanMembers(data);
    } catch (e) {
      console.error(e);
    }
    setLoadingMembers(false);
  }
  function generateInviteCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  async function handleCreateClan(e) {
    e.preventDefault();
    if (!user?.id || !createData.name) return;
    setCreating(true);
    try {
      const code = generateInviteCode();
      const { data: clan, error } = await supabase.from("clans").insert({
        name: createData.name,
        sport: createData.sport,
        captain_id: user.id,
        invite_code: code,
        hex_primary: createData.primary,
        hex_secondary: createData.secondary,
        description: createData.description
      }).select().single();
      if (error) throw error;
      await supabase.from("clan_members").insert({
        clan_id: clan.id,
        user_id: user.id,
        status: "approved"
      });
      alert(t("common.success") || "¡Clan creado exitosamente!");
      setCreateData({ name: "", sport: "Pádel", primary: "#32CD32", secondary: "#1a1a1a", description: "" });
      setActiveTab("mis-clanes");
      fetchMyClans();
    } catch (err) {
      if (err.code === "23505") alert((t("common.error") || "Error") + ": Ya existe un clan con ese nombre");
      else alert((t("common.error") || "Error") + " al crear clan");
    }
    setCreating(false);
  }
  async function handleJoinClan(e) {
    e.preventDefault();
    if (!user?.id || !inviteCode) return;
    setJoining(true);
    try {
      const { data: clan } = await supabase.from("clans").select("id").eq("invite_code", inviteCode.toUpperCase()).single();
      if (!clan) {
        alert("Código inválido");
        setJoining(false);
        return;
      }
      const { error } = await supabase.from("clan_members").insert({
        clan_id: clan.id,
        user_id: user.id,
        status: "pending"
      });
      if (error && error.code === "23505") alert("Ya enviaste una solicitud a este clan");
      else if (error) throw error;
      else alert("Solicitud enviada al capitán del clan");
      setInviteCode("");
    } catch (err) {
      alert("Error al unirse al clan");
    }
    setJoining(false);
  }
  async function handleApproveMember(memberId) {
    await supabase.from("clan_members").update({ status: "approved" }).eq("id", memberId);
    if (selectedClan) fetchClanMembers(selectedClan.id);
  }
  async function handleRejectMember(memberId) {
    await supabase.from("clan_members").update({ status: "rejected" }).eq("id", memberId);
    if (selectedClan) fetchClanMembers(selectedClan.id);
  }
  async function fetchFriendsToInvite() {
    if (!user?.id) return;
    try {
      const { data: requestsData } = await supabase.from("friend_requests").select("*").or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`).eq("status", "accepted");
      const friendIds = (requestsData || []).map(
        (r) => r.sender_id === user.id ? r.receiver_id : r.sender_id
      );
      if (friendIds.length > 0) {
        const { data: profiles } = await supabase.from("profiles").select("*").in("id", friendIds);
        setFriends(profiles || []);
      }
    } catch (err) {
      console.error(err);
    }
  }
  async function handleInviteFriend(friendId) {
    if (!selectedClan || !user?.id) return;
    try {
      await supabase.from("clan_members").insert({
        clan_id: selectedClan.id,
        user_id: friendId,
        status: "approved"
        // Amigos se unen de una vez si los invita el capi
      });
      alert("Amigo añadido al clan");
      fetchClanMembers(selectedClan.id);
      setShowInviteModal(false);
    } catch (e) {
      if (e.code === "23505") alert("Ya está en el clan");
      else alert("Error al añadir");
    }
  }
  async function handleEditClan(e) {
    e.preventDefault();
    if (!selectedClan) return;
    setEditing(true);
    try {
      const { error } = await supabase.from("clans").update({
        name: editData.name,
        sport: editData.sport,
        hex_primary: editData.primary,
        hex_secondary: editData.secondary,
        description: editData.description
      }).eq("id", selectedClan.id);
      if (error) throw error;
      alert("Clan actualizado");
      setShowEditModal(false);
      const updated = { ...selectedClan, name: editData.name, sport: editData.sport, hex_primary: editData.primary, hex_secondary: editData.secondary, description: editData.description };
      setSelectedClan(updated);
      setClans(clans.map((c) => c.id === updated.id ? updated : c));
    } catch (err) {
      alert("Error al editar: " + err.message);
    }
    setEditing(false);
  }
  async function handleRemoveMember(memberId) {
    if (!confirm("¿Seguro que deseas eliminar a este miembro del clan?")) return;
    try {
      const { error } = await supabase.from("clan_members").delete().eq("id", memberId);
      if (error) throw error;
      fetchClanMembers(selectedClan.id);
    } catch (err) {
      alert("Error al eliminar: " + err.message);
    }
  }
  async function handleLeaveClan() {
    if (!user?.id || !selectedClan) return;
    if (!confirm("¿Seguro que deseas salir de este clan?")) return;
    try {
      const { error } = await supabase.from("clan_members").delete().eq("clan_id", selectedClan.id).eq("user_id", user.id);
      if (error) throw error;
      setSelectedClan(null);
      fetchMyClans();
    } catch (err) {
      alert("Error al salir del clan: " + err.message);
    }
  }
  if (selectedClan) {
    let pendingRequestsSection = function() {
      if (pendingMembers.length === 0) return null;
      return /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border p-4 rounded-2xl shadow-soft space-y-3", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-xs font-black uppercase text-secondary flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "bg-rose-500 text-white px-2 py-0.5 rounded-full", children: pendingMembers.length }),
          t("clans.requests") || "Solicitudes de Unión"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-2", children: pendingMembers.map((req) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between bg-muted/30 p-2 rounded-xl", children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-secondary truncate max-w-[120px]", children: req.profiles?.full_name || req.profiles?.username }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
            /* @__PURE__ */ jsx("button", { onClick: () => handleRejectMember(req.id), className: "w-8 h-8 rounded-full bg-rose-500/10 text-rose-500 grid place-items-center", children: /* @__PURE__ */ jsx(X, { size: 14 }) }),
            /* @__PURE__ */ jsx("button", { onClick: () => handleApproveMember(req.id), className: "w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 grid place-items-center", children: /* @__PURE__ */ jsx(Check, { size: 14 }) })
          ] })
        ] }, req.id)) })
      ] });
    };
    const isCaptain = selectedClan.captain_id === user?.id;
    const approvedMembers = clanMembers.filter((m) => m.status === "approved");
    const pendingMembers = clanMembers.filter((m) => m.status === "pending");
    return /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col bg-background relative overflow-y-auto pb-24", children: [
      /* @__PURE__ */ jsxs("header", { className: "sticky top-0 z-10 flex items-center gap-3 bg-background/90 px-5 py-4 backdrop-blur-md border-b border-border", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => setSelectedClan(null), className: "h-10 w-10 grid place-items-center rounded-full glass", children: /* @__PURE__ */ jsx(ArrowLeft, { size: 18, className: "text-secondary" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold text-secondary", children: selectedClan.name }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground flex items-center gap-1", children: /* @__PURE__ */ jsx(SportBadge, { sport: selectedClan.sport }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-5 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center p-6 bg-card rounded-3xl border border-border shadow-soft relative overflow-hidden", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-10", style: { background: `linear-gradient(45deg, ${selectedClan.hex_primary}, ${selectedClan.hex_secondary})` } }),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "h-24 w-24 rounded-full flex items-center justify-center text-4xl shadow-pop z-10",
              style: { background: `linear-gradient(135deg, ${selectedClan.hex_primary}, ${selectedClan.hex_secondary})` },
              children: "🛡️"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-4 z-10", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-2xl font-black text-secondary", children: selectedClan.name }),
            isCaptain && /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => {
                  setEditData({
                    name: selectedClan.name,
                    sport: selectedClan.sport,
                    primary: selectedClan.hex_primary,
                    secondary: selectedClan.hex_secondary,
                    description: selectedClan.description || ""
                  });
                  setShowEditModal(true);
                },
                className: "grid h-8 w-8 place-items-center rounded-full bg-muted text-primary hover:bg-muted/80 transition-colors",
                children: /* @__PURE__ */ jsx(Edit3, { size: 14 })
              }
            )
          ] }),
          selectedClan.description && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1 z-10 text-center max-w-[280px]", children: selectedClan.description }),
          isCaptain && /* @__PURE__ */ jsxs("div", { className: "mt-2 text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20 z-10", children: [
            t("clans.inviteCode") || "Código Invitación:",
            " ",
            /* @__PURE__ */ jsx("span", { className: "font-mono text-secondary", children: selectedClan.invite_code })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border rounded-2xl p-3 text-center shadow-soft", children: [
            /* @__PURE__ */ jsx("div", { className: "text-2xl font-black text-secondary", children: selectedClan.matches_played }),
            /* @__PURE__ */ jsx("div", { className: "text-[10px] text-muted-foreground font-bold uppercase", children: t("clans.played") || "Jugados" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border rounded-2xl p-3 text-center shadow-soft", children: [
            /* @__PURE__ */ jsx("div", { className: "text-2xl font-black text-emerald-500", children: selectedClan.matches_won }),
            /* @__PURE__ */ jsx("div", { className: "text-[10px] text-emerald-500/70 font-bold uppercase", children: t("clans.won") || "Ganados" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border rounded-2xl p-3 text-center shadow-soft", children: [
            /* @__PURE__ */ jsx("div", { className: "text-2xl font-black text-rose-500", children: selectedClan.matches_lost }),
            /* @__PURE__ */ jsx("div", { className: "text-[10px] text-rose-500/70 font-bold uppercase", children: t("clans.lost") || "Perdidos" })
          ] })
        ] }),
        isCaptain && pendingRequestsSection(),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-secondary flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Users, { size: 16, className: "text-primary" }),
              " ",
              t("clans.members") || "Miembros",
              " (",
              approvedMembers.length,
              ")"
            ] }),
            isCaptain && /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => {
                  fetchFriendsToInvite();
                  setShowInviteModal(true);
                },
                className: "text-xs font-black text-primary bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors",
                children: "+ Invitar Amigos"
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-2", children: loadingMembers ? /* @__PURE__ */ jsx("div", { className: "text-center py-4", children: /* @__PURE__ */ jsx(Loader2, { className: "animate-spin text-primary inline" }) }) : approvedMembers.map((m) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 bg-card p-3 rounded-2xl border border-border shadow-soft", children: [
            m.profiles?.avatar_url ? /* @__PURE__ */ jsx("img", { src: m.profiles.avatar_url, className: "w-10 h-10 rounded-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full gradient-primary grid place-items-center font-bold text-secondary", children: m.profiles?.username?.substring(0, 2).toUpperCase() || "U" }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxs("div", { className: "text-sm font-bold text-secondary flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "truncate", children: m.profiles?.full_name || m.profiles?.username?.split("@")[0] }),
                m.user_id === selectedClan.captain_id && /* @__PURE__ */ jsx("span", { className: "text-[10px] bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded-full font-black uppercase shrink-0", children: t("clans.captain") || "Capitán" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-muted-foreground flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Star, { size: 10, className: "fill-accent text-accent" }),
                " ",
                m.profiles?.rating || "5.0"
              ] })
            ] }),
            isCaptain && m.user_id !== selectedClan.captain_id && /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleRemoveMember(m.id),
                className: "grid h-8 w-8 shrink-0 place-items-center rounded-full bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-colors",
                title: "Eliminar miembro",
                children: /* @__PURE__ */ jsx(Trash2, { size: 14 })
              }
            )
          ] }, m.id)) })
        ] })
      ] }),
      !isCaptain && /* @__PURE__ */ jsx("div", { className: "px-5 pb-2", children: /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: handleLeaveClan,
          className: "w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-500 font-black text-sm hover:bg-rose-500/20 transition-all active:scale-95",
          children: [
            /* @__PURE__ */ jsx(LogOut, { size: 16 }),
            "Salir del Clan"
          ]
        }
      ) }),
      showInviteModal && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-secondary p-5 rounded-3xl border border-border w-full max-w-sm max-h-[80vh] flex flex-col", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-white mb-4", children: "Invitar Amigos" }),
        /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto space-y-2", children: friends.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center text-white/50 text-xs py-4", children: "No tienes amigos para invitar." }) : friends.map((f) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between bg-card p-3 rounded-2xl border border-border", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-secondary truncate max-w-[150px]", children: f.full_name || f.username }),
          /* @__PURE__ */ jsx("button", { onClick: () => handleInviteFriend(f.id), className: "bg-primary text-secondary text-xs font-black px-3 py-1.5 rounded-full", children: "Agregar" })
        ] }, f.id)) }),
        /* @__PURE__ */ jsx("button", { onClick: () => setShowInviteModal(false), className: "mt-4 w-full bg-muted text-muted-foreground py-3 rounded-2xl font-bold", children: "Cerrar" })
      ] }) }),
      showEditModal && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-background p-5 rounded-3xl border border-border w-full max-w-sm max-h-[90vh] overflow-y-auto", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-secondary mb-4", children: "Editar Clan" }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleEditClan, className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-secondary uppercase", children: "Nombre" }),
            /* @__PURE__ */ jsx("input", { required: true, value: editData.name, onChange: (e) => setEditData({ ...editData, name: e.target.value }), className: "mt-1 w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-secondary outline-none focus:border-primary" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-secondary uppercase", children: "Deporte" }),
            /* @__PURE__ */ jsx("select", { value: editData.sport, onChange: (e) => setEditData({ ...editData, sport: e.target.value }), className: "mt-1 w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-secondary outline-none focus:border-primary", children: ["Running", "Senderismo", "Pádel", "Tenis", "Vóleibol", "Fútbol", "Golf"].map((s) => /* @__PURE__ */ jsx("option", { value: s, children: s }, s)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-secondary uppercase", children: "Descripción" }),
            /* @__PURE__ */ jsx("textarea", { value: editData.description, onChange: (e) => setEditData({ ...editData, description: e.target.value }), className: "mt-1 w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-secondary outline-none focus:border-primary", placeholder: "Describe tu clan...", rows: 3 })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-secondary uppercase", children: "Color Primario" }),
              /* @__PURE__ */ jsx("input", { type: "color", value: editData.primary, onChange: (e) => setEditData({ ...editData, primary: e.target.value }), className: "mt-1 w-full h-10 rounded-xl cursor-pointer" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-secondary uppercase", children: "Color Secundario" }),
              /* @__PURE__ */ jsx("input", { type: "color", value: editData.secondary, onChange: (e) => setEditData({ ...editData, secondary: e.target.value }), className: "mt-1 w-full h-10 rounded-xl cursor-pointer" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "pt-2 flex gap-2", children: [
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setShowEditModal(false), className: "flex-1 py-3 rounded-xl bg-muted text-muted-foreground font-bold text-sm", children: "Cancelar" }),
            /* @__PURE__ */ jsx("button", { type: "submit", disabled: editing, className: "flex-1 py-3 rounded-xl bg-primary text-secondary font-bold text-sm disabled:opacity-50 flex justify-center items-center", children: editing ? /* @__PURE__ */ jsx(Loader2, { size: 16, className: "animate-spin" }) : "Guardar" })
          ] })
        ] })
      ] }) })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col bg-background relative overflow-hidden pb-24", children: [
    /* @__PURE__ */ jsxs("header", { className: "px-5 pt-12 pb-3", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-secondary", children: t("clans.title") }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: t("clans.subtitle") || "Tu equipo permanente" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "px-5 pb-4", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1 rounded-full bg-muted p-1 border border-border/40", children: [
      /* @__PURE__ */ jsxs("button", { onClick: () => setActiveTab("mis-clanes"), className: `flex-1 rounded-full py-2.5 text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${activeTab === "mis-clanes" ? "bg-card text-secondary shadow-soft border border-border/20" : "text-muted-foreground"}`, children: [
        /* @__PURE__ */ jsx(Shield, { size: 14, className: activeTab === "mis-clanes" ? "text-primary" : "" }),
        " ",
        t("clans.myClan")
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: () => setActiveTab("crear"), className: `flex-1 rounded-full py-2.5 text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${activeTab === "crear" ? "bg-card text-secondary shadow-soft border border-border/20" : "text-muted-foreground"}`, children: [
        /* @__PURE__ */ jsx(Plus, { size: 14, className: activeTab === "crear" ? "text-primary" : "" }),
        " ",
        t("clans.createClan")
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: () => setActiveTab("unirse"), className: `flex-1 rounded-full py-2.5 text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${activeTab === "unirse" ? "bg-card text-secondary shadow-soft border border-border/20" : "text-muted-foreground"}`, children: [
        /* @__PURE__ */ jsx(Search, { size: 14, className: activeTab === "unirse" ? "text-primary" : "" }),
        " ",
        t("clans.joinClan").split(" ")[0]
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto px-5", children: [
      activeTab === "mis-clanes" && /* @__PURE__ */ jsx("div", { className: "space-y-3", children: loading ? /* @__PURE__ */ jsx("div", { className: "text-center py-10", children: /* @__PURE__ */ jsx(Loader2, { className: "animate-spin text-primary mx-auto" }) }) : clans.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-12 bg-card rounded-3xl border border-dashed border-border mt-4", children: [
        /* @__PURE__ */ jsx(Shield, { size: 48, className: "mx-auto text-muted-foreground/30 mb-3" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-secondary", children: t("clans.noClans") || "No perteneces a ningún clan" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setActiveTab("crear"), className: "mt-4 text-xs font-black text-primary bg-primary/10 px-4 py-2 rounded-full", children: t("clans.createFirst") || "Crea tu primer clan" })
      ] }) : clans.map((clan) => /* @__PURE__ */ jsxs("div", { onClick: () => setSelectedClan(clan), className: "bg-card p-4 rounded-3xl border border-border shadow-soft flex items-center gap-4 cursor-pointer hover:border-primary/30 transition-colors", children: [
        /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-inner shrink-0", style: { background: `linear-gradient(135deg, ${clan.hex_primary}, ${clan.hex_secondary})` }, children: "🛡️" }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-black text-secondary truncate", children: clan.name }),
          /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground flex gap-2 items-center mt-1", children: [
            /* @__PURE__ */ jsx(SportBadge, { sport: clan.sport }),
            clan.captain_id === user?.id && /* @__PURE__ */ jsx("span", { className: "bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded-full font-black text-[9px] uppercase", children: "Capitán" })
          ] })
        ] })
      ] }, clan.id)) }),
      activeTab === "crear" && /* @__PURE__ */ jsxs("form", { onSubmit: handleCreateClan, className: "space-y-4 bg-card p-5 rounded-3xl border border-border shadow-soft", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-black uppercase text-muted-foreground mb-1 block", children: "Nombre del Clan" }),
          /* @__PURE__ */ jsx("input", { required: true, value: createData.name, onChange: (e) => setCreateData({ ...createData, name: e.target.value }), placeholder: "Ej: Los Invencibles", className: "w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm text-secondary outline-none focus:border-primary" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-black uppercase text-muted-foreground mb-1 block", children: "Deporte Principal" }),
          /* @__PURE__ */ jsxs("select", { value: createData.sport, onChange: (e) => setCreateData({ ...createData, sport: e.target.value }), className: "w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm text-secondary outline-none focus:border-primary", children: [
            /* @__PURE__ */ jsx("option", { value: "Pádel", children: "Pádel" }),
            /* @__PURE__ */ jsx("option", { value: "Fútbol", children: "Fútbol" }),
            /* @__PURE__ */ jsx("option", { value: "Tenis", children: "Tenis" }),
            /* @__PURE__ */ jsx("option", { value: "Running", children: "Running" }),
            /* @__PURE__ */ jsx("option", { value: "Vóleibol", children: "Vóleibol" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-black uppercase text-muted-foreground mb-1 block", children: "Color Primario" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("input", { type: "color", value: createData.primary, onChange: (e) => setCreateData({ ...createData, primary: e.target.value }), className: "w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0 p-0" }),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-mono text-secondary", children: createData.primary })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-black uppercase text-muted-foreground mb-1 block", children: "Color Secundario" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("input", { type: "color", value: createData.secondary, onChange: (e) => setCreateData({ ...createData, secondary: e.target.value }), className: "w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0 p-0" }),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-mono text-secondary", children: createData.secondary })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("button", { disabled: creating, type: "submit", className: "w-full mt-4 gradient-primary text-secondary py-3.5 rounded-xl font-black uppercase shadow-pop active:scale-95 transition-all", children: creating ? t("clans.btn.creating") || "Creando..." : t("clans.btn.create") || "Crear Clan" })
      ] }),
      activeTab === "unirse" && /* @__PURE__ */ jsxs("form", { onSubmit: handleJoinClan, className: "space-y-4 bg-card p-5 rounded-3xl border border-border shadow-soft text-center py-8", children: [
        /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx(Search, { size: 28 }) }),
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-black text-secondary", children: t("clans.join.title") || "Unirse a un Clan" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: t("clans.join.desc") || "Pídele al capitán de tu equipo el código de invitación e ingrésalo abajo." }),
        /* @__PURE__ */ jsx("input", { required: true, value: inviteCode, onChange: (e) => setInviteCode(e.target.value), placeholder: "Ej: A4F9K2", className: "w-full max-w-[200px] mx-auto text-center font-mono text-xl tracking-widest uppercase bg-muted/50 border border-border rounded-xl px-4 py-3 text-secondary outline-none focus:border-primary" }),
        /* @__PURE__ */ jsx("button", { disabled: joining, type: "submit", className: "w-full gradient-primary text-secondary py-3.5 rounded-xl font-black uppercase shadow-pop active:scale-95 transition-all", children: joining ? t("clans.btn.joining") || "Enviando..." : t("clans.btn.join") || "Solicitar Unión" })
      ] })
    ] })
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
  const { t } = useSettings();
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
      return t("auth.err.invalidLogin") || "Correo o contraseña incorrectos. Revisa tus datos.";
    if (msg.includes("Email not confirmed"))
      return t("auth.err.emailNotConfirmed") || "Confirma tu correo antes de iniciar sesión.";
    if (msg.includes("User already registered"))
      return t("auth.err.alreadyRegistered") || "Ya existe una cuenta con ese correo. Intenta iniciar sesión.";
    if (msg.includes("Password should be at least"))
      return t("auth.err.weakPassword") || "La contraseña debe tener al menos 6 caracteres.";
    if (msg.includes("Unable to validate email"))
      return t("auth.err.invalidEmail") || "Ingresa un correo electrónico válido.";
    if (msg.includes("Email rate limit exceeded"))
      return t("auth.err.rateLimit") || "Demasiados intentos. Espera unos minutos e intenta de nuevo.";
    return msg;
  }
  async function handleSubmit() {
    setError(null);
    if (!email.trim() || !password.trim()) {
      setError(t("auth.fillFields") || "Completa todos los campos obligatorios.");
      return;
    }
    if (mode === "register" && !name.trim()) {
      setError(t("auth.enterName") || "Ingresa tu nombre para continuar.");
      return;
    }
    if (password.length < 6) {
      setError(t("auth.minPassword") || "La contraseña debe tener al menos 6 caracteres.");
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
        t("auth.welcomeBack") || "Bienvenido",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent", children: t("auth.welcomeBackEmoji") || "de vuelta 👋" })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        t("auth.createAccount") || "Crea tu cuenta",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent", children: t("auth.createAccountEmoji") || "y entra a jugar ⚡" })
      ] }) }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-secondary-foreground/60", children: mode === "login" ? t("auth.loginSubtitle") || "Inicia sesión para ver y unirte a eventos." : t("auth.registerSubtitle") || "Regístrate gratis. En segundos estás dentro." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex-1 overflow-y-auto px-7 pt-8 pb-6 space-y-4", children: [
      mode === "register" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          InputField,
          {
            id: "auth-name-input",
            label: t("auth.fullName") || "Nombre completo",
            type: "text",
            placeholder: t("auth.namePlaceholder") || "Ej: Diego Ramírez",
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
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-secondary-foreground", children: t("auth.registerAsOrganizer") || "Quiero registrarme como Organizador" })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        InputField,
        {
          id: "auth-email-input",
          label: t("auth.email") || "Correo electrónico",
          type: "email",
          placeholder: "tu@email.com",
          value: email,
          onChange: setEmail,
          icon: /* @__PURE__ */ jsx(Mail, { size: 16, className: "text-muted-foreground" }),
          disabled: isLoading
        }
      ),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "mb-1.5 block text-xs font-bold uppercase tracking-wide text-secondary-foreground/50", children: t("auth.password") || "Contraseña" }),
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
                  placeholder: mode === "register" ? t("auth.minChars") || "Mín. 6 caracteres" : t("auth.yourPassword") || "Tu contraseña",
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
        mode === "login" && /* @__PURE__ */ jsx("button", { className: "mt-1.5 text-[11px] text-primary hover:underline", children: t("auth.forgotPassword") || "¿Olvidaste tu contraseña?" })
      ] }),
      error && /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2.5 rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3", children: [
        /* @__PURE__ */ jsx(AlertCircle, { size: 15, className: "mt-0.5 shrink-0 text-destructive" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive", children: error })
      ] }),
      isSuccess && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3", children: [
        /* @__PURE__ */ jsx(CheckCircle2, { size: 15, className: "shrink-0 text-emerald-400" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-emerald-300", children: mode === "login" ? t("auth.loggedInMsg") || "¡Sesión iniciada! Entrando..." : t("auth.accountCreatedMsg") || "¡Cuenta creada! Bienvenido..." })
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
            isLoading ? mode === "login" ? t("auth.loggingIn") || "Iniciando sesión..." : t("auth.creatingAccount") || "Creando cuenta..." : isSuccess ? mode === "login" ? t("auth.loggedIn") || "¡Sesión iniciada!" : t("auth.accountCreated") || "¡Cuenta creada!" : mode === "login" ? t("auth.login") || "Iniciar sesión" : t("auth.createFree") || "Crear cuenta gratis"
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 py-1", children: [
        /* @__PURE__ */ jsx("div", { className: "h-px flex-1 bg-primary-foreground/10" }),
        /* @__PURE__ */ jsx("span", { className: "text-[11px] text-secondary-foreground/40", children: t("auth.or") || "o" }),
        /* @__PURE__ */ jsx("div", { className: "h-px flex-1 bg-primary-foreground/10" })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          id: "auth-switch-mode-btn",
          onClick: () => switchMode(mode === "login" ? "register" : "login"),
          disabled: isLoading,
          className: "w-full rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 py-3.5 text-sm font-medium text-secondary-foreground/80 transition-all hover:bg-primary-foreground/10 active:scale-[0.98] disabled:opacity-50",
          children: mode === "login" ? t("auth.noAccount") || "¿No tienes cuenta? Regístrate" : t("auth.hasAccount") || "¿Ya tienes cuenta? Inicia sesión"
        }
      ),
      /* @__PURE__ */ jsx("p", { className: "pt-1 text-center text-[10px] text-secondary-foreground/30", children: t("auth.terms") || "Al continuar aceptas los Términos de Uso y la Política de Privacidad de TeamMatch." })
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
  const { t } = useSettings();
  const items = [
    { id: "events", label: t("nav.events"), icon: CalendarCheck },
    { id: "map", label: t("nav.map"), icon: Map$1 },
    { id: "friends", label: t("nav.friends"), icon: Users },
    { id: "clans", label: t("nav.clans"), icon: Shield },
    { id: "sports", label: t("nav.sports"), icon: Trophy },
    { id: "profile", label: t("nav.profile"), icon: User }
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
  return /* @__PURE__ */ jsx(SettingsProvider, { children: /* @__PURE__ */ jsx(UserProvider, { children: /* @__PURE__ */ jsx(AppContent, {}) }) });
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
    if (screen === "clans") return /* @__PURE__ */ jsx(ClansScreen, { onNavigateToProfile: () => setScreen("profile"), onSelectEvent: openDetail });
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
      appState !== "auth" && /* @__PURE__ */ jsx(AchievementNotificationBanner, {}),
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
function playPlayStationTrophySound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(880, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.15);
    gain1.gain.setValueAtTime(0.3, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(1e-3, ctx.currentTime + 1.2);
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1108.73, ctx.currentTime);
    gain2.gain.setValueAtTime(0.15, ctx.currentTime);
    gain2.gain.exponentialRampToValueAtTime(1e-3, ctx.currentTime + 1.5);
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = "triangle";
    osc3.frequency.setValueAtTime(220, ctx.currentTime);
    gain3.gain.setValueAtTime(0.1, ctx.currentTime);
    gain3.gain.exponentialRampToValueAtTime(1e-3, ctx.currentTime + 2);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc3.connect(gain3);
    gain3.connect(ctx.destination);
    osc1.start();
    osc2.start();
    osc3.start();
    osc1.stop(ctx.currentTime + 2);
    osc2.stop(ctx.currentTime + 2);
    osc3.stop(ctx.currentTime + 2);
  } catch (e) {
    console.warn("Failed to play audio:", e);
  }
}
function AchievementNotificationBanner() {
  const {
    achievementNotification,
    clearAchievementNotification
  } = useCurrentUser();
  useEffect(() => {
    if (achievementNotification) {
      playPlayStationTrophySound();
      const timer = setTimeout(() => {
        clearAchievementNotification();
      }, 5500);
      return () => clearTimeout(timer);
    }
  }, [achievementNotification, clearAchievementNotification]);
  if (!achievementNotification) return null;
  const {
    title,
    rarity,
    icon
  } = achievementNotification;
  const rarityColors = {
    bronze: {
      border: "border-[#cd7f32]/40 shadow-[0_0_10px_rgba(205,127,50,0.15)]",
      text: "text-[#cd7f32] font-black",
      badge: "from-[#a05a2c] to-[#cd7f32]",
      label: "BRONCE",
      emoji: "🥉"
    },
    silver: {
      border: "border-[#c0c0c0]/40 shadow-[0_0_10px_rgba(192,192,192,0.15)]",
      text: "text-[#cbd5e0] font-black",
      badge: "from-[#718096] to-[#cbd5e0]",
      label: "PLATA",
      emoji: "🥈"
    },
    gold: {
      border: "border-[#ffd700]/40 shadow-[0_0_10px_rgba(255,215,0,0.2)]",
      text: "text-[#ecc94b] font-black",
      badge: "from-[#d69e2e] to-[#ecc94b]",
      label: "ORO",
      emoji: "🥇"
    },
    platinum: {
      border: "border-[#e5e4e2]/50 shadow-[0_0_15px_rgba(229,228,226,0.3)]",
      text: "text-[#e5e4e2] font-extrabold tracking-wider animate-pulse",
      badge: "from-[#4a5568] via-[#cbd5e0] to-[#e2e8f0]",
      label: "PLATINO",
      emoji: "🏆"
    }
  };
  const style = rarityColors[rarity] || rarityColors.bronze;
  return /* @__PURE__ */ jsxs("div", { className: "fixed top-8 left-1/2 -translate-x-1/2 z-[99999] w-[90%] max-w-[380px] rounded-full bg-[#0a0c10]/95 border border-white/10 px-4 py-2.5 flex items-center gap-3.5 shadow-2xl animate-in slide-in-from-top-12 duration-500 overflow-hidden select-none", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[reflection_3s_infinite]" }),
    /* @__PURE__ */ jsxs("div", { className: `h-11 w-11 shrink-0 rounded-full bg-gradient-to-br ${style.badge} p-[1.5px] flex items-center justify-center shadow-lg relative`, children: [
      /* @__PURE__ */ jsx("div", { className: "h-full w-full rounded-full bg-[#0a0c10] flex items-center justify-center text-xl", children: icon }),
      /* @__PURE__ */ jsx("span", { className: "absolute -bottom-1 -right-1 text-[10px] bg-[#0a0c10] border border-white/10 rounded-full px-0.5", children: style.emoji })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1", children: /* @__PURE__ */ jsxs("span", { className: `text-[8px] font-black tracking-widest uppercase ${style.text}`, children: [
        "TROFEO DE ",
        style.label,
        " OBTENIDO"
      ] }) }),
      /* @__PURE__ */ jsx("h4", { className: "text-xs font-black text-white truncate leading-tight mt-0.5", children: title }),
      /* @__PURE__ */ jsx("p", { className: "text-[9px] text-white/50 truncate mt-0.5 font-medium", children: "¡Has desbloqueado un logro!" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "h-6 w-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsx(Award, { size: 12, className: style.text }) })
  ] });
}
export {
  Index as component
};
