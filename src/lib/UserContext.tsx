import { createContext, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSettings } from "./SettingsContext";
import { ACHIEVEMENTS, type Achievement } from "@/components/teammatch/achievementsData";

export interface RpgCoupon {
  id: string;
  code: string;
  title: string;
  discount: string;
  description: string;
  date: string;
  claimed: boolean;
}

export interface RpgXpEntry {
  id: string;
  title: string;
  xp: number;
  date: string;
  type: "join" | "create" | "use" | "system";
}

export interface XpNotification {
  xp: number;
  reason: string;
  isLevelUp: boolean;
  newLevel?: number;
  newCoupon?: RpgCoupon | null;
}

export interface EventNotification {
  type: "accepted" | "rejected";
  eventTitle: string;
  sport: string;
}

interface UserContextValue {
  user: any | null;
  avatarUrl: string | null;
  displayName: string;
  initials: string;
  xp: number;
  level: number;
  useCount: number;
  coupons: RpgCoupon[];
  xpHistory: RpgXpEntry[];
  joinedEventsCount: number;
  createdEventsCount: number;
  xpNotification: XpNotification | null;
  eventNotification: EventNotification | null;
  clearNotification: () => void;
  clearEventNotification: () => void;
  addXp: (amount: number, reason: string) => Promise<void>;
  claimCoupon: (code: string) => Promise<void>;
  updateProfile: (updates: {
    name: string;
    avatarUrl: string | null;
    isOrganizer: boolean;
    email?: string;
    age?: number;
    gender?: string;
    description?: string;
    location?: string;
    preferredSports?: string[];
  }) => Promise<void>;
  isLoading: boolean;
  carisma: number;
  incrementCarisma: (amount?: number) => Promise<void>;
  unlockedAchievements: string[];
  achievementNotification: {
    title: string;
    rarity: "bronze" | "silver" | "gold" | "platinum";
    icon: string;
  } | null;
  clearAchievementNotification: () => void;
  isPremium: boolean | null;
}

const UserContext = createContext<UserContextValue>({
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
  clearNotification: () => {},
  clearEventNotification: () => {},
  addXp: async () => {},
  claimCoupon: async () => {},
  updateProfile: async () => {},
  isLoading: true,
  carisma: 0,
  incrementCarisma: async () => {},
  unlockedAchievements: [],
  achievementNotification: null,
  clearAchievementNotification: () => {},
  isPremium: null,
});

function getCouponForLevel(level: number): RpgCoupon | null {
  if (level === 2) {
    return {
      id: "ASPIRANTE2",
      code: "ASPIRANTE2",
      title: "Pase de Aspirante ⚡",
      discount: "10% de Descuento",
      description: "Otorgado automáticamente por alcanzar el Nivel 2.",
      date: new Date().toLocaleDateString(),
      claimed: false,
    };
  }
  if (level === 3) {
    return {
      id: "GUERRERO3",
      code: "GUERRERO3",
      title: "Pergamino de Guerrero 🏋️‍♂️",
      discount: "15% de Descuento",
      description: "Otorgado automáticamente por alcanzar el Nivel 3.",
      date: new Date().toLocaleDateString(),
      claimed: false,
    };
  }
  if (level === 5) {
    return {
      id: "LEYENDA5",
      code: "LEYENDA5",
      title: "Medalla de Leyenda 🌟",
      discount: "Partido Gratis (100% Off)",
      description: "Otorgado automáticamente por alcanzar el Nivel 5.",
      date: new Date().toLocaleDateString(),
      claimed: false,
    };
  }
  return null;
}

function evaluateAchievements(
  currentUnlocked: string[],
  stats: {
    useCount: number;
    joinedEventsCount: number;
    createdEventsCount: number;
    carisma: number;
    level: number;
    description: string;
    location: string;
    preferredSports: string[];
    fullName: string;
    age: number;
    gender: string;
    coupons: any[];
    xpHistory: any[];
  }
) {
  const newlyUnlocked: Achievement[] = [];
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
          met = stats.coupons && stats.coupons.some((c: any) => c.claimed === true);
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
          met = !!stats.fullName && !!stats.age && !!stats.gender && 
                !!stats.description && !!stats.location;
          break;
        case "coleccionista_cupones":
          met = stats.coupons && stats.coupons.length >= 3;
          break;
        case "favorito_casa":
          {
            const joinHistory = stats.xpHistory.filter(h => h.type === "join");
            const locationsPool = ["chacao", "mercedes", "altamira", "hatillo", "castellana", "palos grandes"];
            met = locationsPool.some(loc => 
              joinHistory.filter(h => h.title.toLowerCase().includes(loc)).length >= 3
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

  // Platino si desbloqueó todos los otros 31
  if (!updatedUnlocked.includes("maestro_teammatch")) {
    const nonPlatinumCount = ACHIEVEMENTS.filter(a => a.id !== "maestro_teammatch").length;
    const unlockedNonPlatinumCount = updatedUnlocked.filter(id => id !== "maestro_teammatch").length;
    
    if (unlockedNonPlatinumCount === nonPlatinumCount) {
      const platAch = ACHIEVEMENTS.find(a => a.id === "maestro_teammatch");
      if (platAch) {
        updatedUnlocked.push("maestro_teammatch");
        newlyUnlocked.push(platAch);
      }
    }
  }

  return { newlyUnlocked, updatedUnlocked };
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { rpgMode } = useSettings();
  const [user, setUser] = useState<any>(null);
  const [dbIsPremium, setDbIsPremium] = useState<boolean | null>(null);
  const [xp, setXp] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [xpNotification, setXpNotification] = useState<XpNotification | null>(null);
  const [eventNotification, setEventNotification] = useState<EventNotification | null>(null);
  const [achievementQueue, setAchievementQueue] = useState<Achievement[]>([]);
  const [achievementNotification, setAchievementNotification] = useState<{
    title: string;
    rarity: "bronze" | "silver" | "gold" | "platinum";
    icon: string;
  } | null>(null);
  const addXpRef = useRef<(amount: number, reason: string) => Promise<void>>(async () => {});
  const previousStatuses = useRef<Record<number, string>>({});
  const isFirstFetch = useRef(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync state variables with user metadata when the user object changes
  useEffect(() => {
    if (user) {
      setXp(user.user_metadata?.xp || 0);
      setLevel(user.user_metadata?.level || 1);
    }
  }, [user]);

  const clearAchievementNotification = () => setAchievementNotification(null);

  // PlayStation style sequential notification queue
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
      data: { subscription },
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

  const initializeAndTrackUse = async (currentUser: any) => {
    try {
      // 1. Fetch profile first (strictly only the profiles table to avoid join errors if tables don't exist)
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select(`
          id,
          username,
          full_name,
          avatar_url,
          rating,
          is_premium,
          age,
          gender,
          description,
          location,
          preferred_sports
        `)
        .eq("id", currentUser.id)
        .maybeSingle();

      if (profileError) {
        console.error("Error reading user profile on startup:", profileError.message);
      }

      let premiumStatus = false;
      let userXp = currentUser.user_metadata?.xp || 0;
      let userLevel = currentUser.user_metadata?.level || 1;

      if (profileData) {
        // Read is_premium from profiles table directly as the primary source of truth
        premiumStatus = profileData.is_premium ?? currentUser.user_metadata?.is_premium ?? false;
      } else {
        premiumStatus = currentUser.user_metadata?.is_premium ?? false;
      }

      // 2. Resilient check for separate is_premium table (in try-catch so it won't crash if table doesn't exist)
      try {
        const { data: premiumTableData, error: premiumTableError } = await supabase
          .from("is_premium")
          .select("is_active")
          .eq("user_id", currentUser.id)
          .maybeSingle();

        if (!premiumTableError && premiumTableData) {
          premiumStatus = premiumTableData.is_active;
        }
      } catch (e) {
        // Silent catch: table is_premium might not exist in this database schema
      }

      // 3. Resilient check for separate user_level_progress table (in try-catch)
      try {
        const { data: progressData, error: progressError } = await supabase
          .from("user_level_progress")
          .select("xp, level")
          .eq("user_id", currentUser.id)
          .maybeSingle();

        if (!progressError && progressData) {
          userXp = progressData.xp ?? userXp;
          userLevel = progressData.level ?? userLevel;
        }
      } catch (e) {
        // Silent catch: table user_level_progress might not exist in this database schema
      }

      setDbIsPremium(premiumStatus);
      setXp(userXp);
      setLevel(userLevel);
    } catch (err) {
      console.error("Error initializing session (read-only):", err);
      setDbIsPremium(currentUser.user_metadata?.is_premium ?? false);
    }
  };

  const addXp = async (amount: number, reason: string) => {
    if (!user || !rpgMode) return;
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

    let newCoupons = [...(meta.coupons || [])];
    let awardedCoupon: RpgCoupon | null = null;

    const type =
      reason.includes("unirse") || reason.includes("Unirse")
        ? "join"
        : reason.includes("crear") || reason.includes("Organizar")
          ? "create"
          : "system";

    const joinedDelta = type === "join" ? 1 : 0;
    const createdDelta = type === "create" ? 1 : 0;

    const nextJoinedCount = (meta.joined_events_count || 0) + joinedDelta;
    const nextCreatedCount = (meta.created_events_count || 0) + createdDelta;
    const currentUseCount = meta.use_count || 0;
    const currentCarisma = meta.carisma || 0;

    // 1. Inicializar tempHistory con la nueva entrada de XP antes del bucle de logros
    const tempHistory = [
      {
        id: "xp_" + Date.now(),
        title: reason,
        xp: amount,
        date: new Date().toLocaleDateString(),
        type,
      },
      ...(meta.xp_history || []),
    ];

    // 2. Evaluar logros
    let tempXp = newXp;
    let tempLevel = newLevel;
    let tempUnlocked = [...(meta.unlocked_achievements || [])];
    const allNewlyUnlocked: Achievement[] = [];

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
        xpHistory: tempHistory,
      };

      const { newlyUnlocked, updatedUnlocked } = evaluateAchievements(tempUnlocked, stats);
      if (newlyUnlocked.length > 0) {
        allNewlyUnlocked.push(...newlyUnlocked);
        tempUnlocked = updatedUnlocked;
        
        let achXp = 0;
        newlyUnlocked.forEach(a => achXp += a.xpReward);
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

    // Verificar cupón de nivel basado en el nivel final
    if (isLevelUp) {
      const levelCoupon = getCouponForLevel(newLevel);
      if (levelCoupon && !newCoupons.some((c: any) => c.code === levelCoupon.code)) {
        newCoupons.push(levelCoupon);
        awardedCoupon = levelCoupon;
      }
    }

    const achievementHistoryEntries = allNewlyUnlocked.map((ach) => ({
      id: "ach_" + ach.id + "_" + Date.now(),
      title: `🏆 ¡Logro Desbloqueado: ${ach.title}!`,
      xp: ach.xpReward,
      date: new Date().toLocaleDateString(),
      type: "system" as const,
    }));

    const finalHistory = [
      ...achievementHistoryEntries,
      ...tempHistory,
    ];

    const { data: { user: updatedUser } } = await supabase.auth.updateUser({
      data: {
        xp: newXp,
        level: newLevel,
        coupons: newCoupons,
        xp_history: finalHistory,
        joined_events_count: nextJoinedCount,
        created_events_count: nextCreatedCount,
        unlocked_achievements: tempUnlocked,
      },
    });
    if (updatedUser) setUser(updatedUser);
    const isUserPremium = dbIsPremium || user?.user_metadata?.is_premium || false;

    try {
      await supabase.from("user_level_progress").upsert({
        user_id: user.id,
        xp: newXp,
        level: newLevel,
        updated_at: new Date().toISOString()
      });
    } catch (e) {
      // Silencioso
    }

    if (isUserPremium && allNewlyUnlocked.length > 0) {
      setAchievementQueue((prev) => [...prev, ...allNewlyUnlocked]);
    }

    if (isUserPremium) {
      setXpNotification({
        xp: amount,
        reason,
        isLevelUp,
        newLevel: isLevelUp ? newLevel : undefined,
        newCoupon: awardedCoupon,
      });
    }
  };

  const claimCoupon = async (code: string) => {
    if (!user) return;
    const meta = user.user_metadata || {};
    const currentCoupons = meta.coupons || [];

    const newCoupons = currentCoupons.map((c: any) => {
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

    // Evaluar logros
    let tempXp = newXp;
    let tempLevel = newLevel;
    let tempUnlocked = [...(meta.unlocked_achievements || [])];
    const allNewlyUnlocked: Achievement[] = [];

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
        xpHistory: meta.xp_history || [],
      };

      const { newlyUnlocked, updatedUnlocked } = evaluateAchievements(tempUnlocked, stats);
      if (newlyUnlocked.length > 0) {
        allNewlyUnlocked.push(...newlyUnlocked);
        tempUnlocked = updatedUnlocked;
        
        let achXp = 0;
        newlyUnlocked.forEach(a => achXp += a.xpReward);
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
    let awardedCoupon: RpgCoupon | null = null;
    if (isLevelUp) {
      const levelCoupon = getCouponForLevel(newLevel);
      if (levelCoupon && !levelCoupons.some((c: any) => c.code === levelCoupon.code)) {
        levelCoupons.push(levelCoupon);
        awardedCoupon = levelCoupon;
      }
    }

    const achievementHistoryEntries = allNewlyUnlocked.map((ach) => ({
      id: "ach_" + ach.id + "_" + Date.now(),
      title: `🏆 ¡Logro Desbloqueado: ${ach.title}!`,
      xp: ach.xpReward,
      date: new Date().toLocaleDateString(),
      type: "system" as const,
    }));

    const finalHistory = [
      ...achievementHistoryEntries,
      ...(meta.xp_history || []),
    ];

    const { data: { user: updatedUser } } = await supabase.auth.updateUser({
      data: {
        coupons: levelCoupons,
        xp: newXp,
        level: newLevel,
        unlocked_achievements: tempUnlocked,
        xp_history: finalHistory,
      },
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
        newCoupon: awardedCoupon,
      });
    }
  };

  const updateProfile = async (updates: {
    name: string;
    avatarUrl: string | null;
    isOrganizer: boolean;
    email?: string;
    age?: number;
    gender?: string;
    description?: string;
    location?: string;
    preferredSports?: string[];
  }) => {
    if (!user) return;
    const meta = user.user_metadata || {};

    const currentXp = meta.xp || 0;
    const currentLevel = meta.level || 1;

    let newXp = currentXp;
    let newLevel = currentLevel;
    let isLevelUp = false;

    // Evaluar logros
    let tempXp = newXp;
    let tempLevel = newLevel;
    let tempUnlocked = [...(meta.unlocked_achievements || [])];
    const allNewlyUnlocked: Achievement[] = [];

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
        xpHistory: meta.xp_history || [],
      };

      const { newlyUnlocked, updatedUnlocked } = evaluateAchievements(tempUnlocked, stats);
      if (newlyUnlocked.length > 0) {
        allNewlyUnlocked.push(...newlyUnlocked);
        tempUnlocked = updatedUnlocked;
        
        let achXp = 0;
        newlyUnlocked.forEach(a => achXp += a.xpReward);
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

    let newCoupons = [...(meta.coupons || [])];
    let awardedCoupon: RpgCoupon | null = null;
    if (isLevelUp) {
      const levelCoupon = getCouponForLevel(newLevel);
      if (levelCoupon && !newCoupons.some((c: any) => c.code === levelCoupon.code)) {
        newCoupons.push(levelCoupon);
        awardedCoupon = levelCoupon;
      }
    }

    const achievementHistoryEntries = allNewlyUnlocked.map((ach) => ({
      id: "ach_" + ach.id + "_" + Date.now(),
      title: `🏆 ¡Logro Desbloqueado: ${ach.title}!`,
      xp: ach.xpReward,
      date: new Date().toLocaleDateString(),
      type: "system" as const,
    }));

    const finalHistory = [
      ...achievementHistoryEntries,
      ...(meta.xp_history || []),
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
        xp_history: finalHistory,
      },
      ...(updates.email && updates.email !== user.email && { email: updates.email })
    });

    if (updateError) throw updateError;

    try {
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        username: (updates.email || user.email || "").trim(),
        full_name: updates.name,
        avatar_url: updates.avatarUrl,
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
        newCoupon: awardedCoupon,
      });
    }
  };

  const clearNotification = () => setXpNotification(null);
  const clearEventNotification = () => setEventNotification(null);

  // Keep addXp ref fresh
  useEffect(() => { addXpRef.current = addXp; });

  // Function to check participant status updates (polling fallback)
  const checkStatusChanges = async () => {
    if (!user?.email) return;
    try {
      const { data, error } = await supabase
        .from("event_participants")
        .select("id, event_id, status")
        .eq("user_username", user.email);

      if (error || !data) return;

      const newStatuses: Record<number, string> = {};
      const changes: { id: number; eventId: string; status: string }[] = [];

      data.forEach((item: any) => {
        newStatuses[item.id] = item.status;
        const oldStatus = previousStatuses.current[item.id];
        if (!isFirstFetch.current && oldStatus === "pendiente" && item.status !== "pendiente") {
          changes.push({ id: item.id, eventId: item.event_id, status: item.status });
        }
      });

      // Update ref and flag
      previousStatuses.current = { ...previousStatuses.current, ...newStatuses };
      isFirstFetch.current = false;

      // Process any changed statuses
      for (const change of changes) {
        if (change.status === "aceptado" || change.status === "rechazado") {
          const { data: eventData } = await supabase
            .from("events")
            .select("title, sport_id")
            .eq("id", change.eventId)
            .maybeSingle();

          const sportName =
            eventData?.sport_id === 1 ? "Fútbol"
            : eventData?.sport_id === 2 ? "Tenis"
            : eventData?.sport_id === 3 ? "Golf"
            : eventData?.sport_id === 4 ? "Pádel"
            : "Deporte";
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

  // Realtime subscription + Polling fallback
  useEffect(() => {
    if (!user?.email) return;

    // Reset status tracker on user change
    isFirstFetch.current = true;
    previousStatuses.current = {};
    checkStatusChanges();

    // Setup polling every 4 seconds
    const interval = setInterval(checkStatusChanges, 4000);

    // Setup realtime subscription
    const channel = supabase
      .channel(`user_event_status_${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "event_participants",
          filter: `user_username=eq.${user.email}`,
        },
        async (payload: any) => {
          const newStatus = payload.new?.status;
          const oldStatus = payload.old?.status;
          if (!newStatus || newStatus === oldStatus) return;
          if (newStatus !== "aceptado" && newStatus !== "rechazado") return;

          const eventId = payload.new?.event_id;
          if (!eventId) return;

          const { data: eventData } = await supabase
            .from("events")
            .select("title, sport_id")
            .eq("id", eventId)
            .maybeSingle();

          const sportName =
            eventData?.sport_id === 1 ? "Fútbol"
            : eventData?.sport_id === 2 ? "Tenis"
            : eventData?.sport_id === 3 ? "Golf"
            : eventData?.sport_id === 4 ? "Pádel"
            : "Deporte";
          const eventTitle = eventData?.title || `Evento de ${sportName}`;

          if (newStatus === "aceptado") {
            setEventNotification({ type: "accepted", eventTitle, sport: sportName });
            addXpRef.current(15, `Aceptado en partido de ${sportName}: ${eventTitle} 👟`);
          } else if (newStatus === "rechazado") {
            setEventNotification({ type: "rejected", eventTitle, sport: sportName });
          }
          
          // Keep local state in sync to prevent double firing
          if (payload.new?.id) {
            previousStatuses.current[payload.new.id] = newStatus;
          }
        }
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [user?.email, user?.id]);

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Usuario";
  const initials = displayName.substring(0, 2).toUpperCase();
  const avatarUrl = user?.user_metadata?.avatar_url ?? null;

  // RPG stats extracted from metadata
  const useCount = user?.user_metadata?.use_count || 0;
  const coupons = user?.user_metadata?.coupons || [];
  const xpHistory = user?.user_metadata?.xp_history || [];
  const joinedEventsCount = user?.user_metadata?.joined_events_count || 0;
  const createdEventsCount = user?.user_metadata?.created_events_count || 0;
  const carisma = user?.user_metadata?.carisma || 0;

  const incrementCarisma = async (amount = 1) => {
    if (!user || !rpgMode) return;
    const meta = user.user_metadata || {};
    const currentCarisma = meta.carisma || 0;
    const newCarisma = currentCarisma + amount;

    const currentXp = meta.xp || 0;
    const currentLevel = meta.level || 1;

    let newXp = currentXp;
    let newLevel = currentLevel;
    let isLevelUp = false;

    // Evaluar logros
    let tempXp = newXp;
    let tempLevel = newLevel;
    let tempUnlocked = [...(meta.unlocked_achievements || [])];
    const allNewlyUnlocked: Achievement[] = [];

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
        xpHistory: meta.xp_history || [],
      };

      const { newlyUnlocked, updatedUnlocked } = evaluateAchievements(tempUnlocked, stats);
      if (newlyUnlocked.length > 0) {
        allNewlyUnlocked.push(...newlyUnlocked);
        tempUnlocked = updatedUnlocked;
        
        let achXp = 0;
        newlyUnlocked.forEach(a => achXp += a.xpReward);
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

    let newCoupons = [...(meta.coupons || [])];
    let awardedCoupon: RpgCoupon | null = null;
    if (isLevelUp) {
      const levelCoupon = getCouponForLevel(newLevel);
      if (levelCoupon && !newCoupons.some((c: any) => c.code === levelCoupon.code)) {
        newCoupons.push(levelCoupon);
        awardedCoupon = levelCoupon;
      }
    }

    const achievementHistoryEntries = allNewlyUnlocked.map((ach) => ({
      id: "ach_" + ach.id + "_" + Date.now(),
      title: `🏆 ¡Logro Desbloqueado: ${ach.title}!`,
      xp: ach.xpReward,
      date: new Date().toLocaleDateString(),
      type: "system" as const,
    }));

    const finalHistory = [
      ...achievementHistoryEntries,
      ...(meta.xp_history || []),
    ];

    const { data: { user: updatedUser } } = await supabase.auth.updateUser({
      data: {
        carisma: newCarisma,
        xp: newXp,
        level: newLevel,
        coupons: newCoupons,
        unlocked_achievements: tempUnlocked,
        xp_history: finalHistory,
      },
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
        newCoupon: awardedCoupon,
      });
    }
  };

  const isPremium = dbIsPremium;

  return (
    <UserContext.Provider
      value={{
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
        clearAchievementNotification,
        isPremium,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useCurrentUser() {
  return useContext(UserContext);
}
