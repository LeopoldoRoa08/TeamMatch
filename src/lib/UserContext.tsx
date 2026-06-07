import { createContext, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

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
  carisma: number;
  incrementCarisma: (amount?: number) => Promise<void>;
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
  carisma: 0,
  incrementCarisma: async () => {},
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

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [xpNotification, setXpNotification] = useState<XpNotification | null>(null);
  const [eventNotification, setEventNotification] = useState<EventNotification | null>(null);
  const addXpRef = useRef<(amount: number, reason: string) => Promise<void>>(async () => {});
  const previousStatuses = useRef<Record<number, string>>({});
  const isFirstFetch = useRef(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user);
        initializeAndTrackUse(data.user);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        initializeAndTrackUse(u);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const initializeAndTrackUse = async (currentUser: any) => {
    const today = new Date().toLocaleDateString();
    const lastDailyXpDate = localStorage.getItem("teammatch_last_daily_xp_date");
    const wasCounted = lastDailyXpDate === today;
    const meta = currentUser?.user_metadata || {};
    
    // Synchronize to public.profiles table
    try {
      const profileData: any = {
        id: currentUser.id,
        username: currentUser.email || "",
        full_name: meta.full_name || null,
        avatar_url: meta.avatar_url || null,
        rating: meta.rating || 4.80,
        is_premium: meta.is_premium || false,
        age: meta.age || null,
        gender: meta.gender || null,
        description: meta.description || null,
        location: meta.location || null,
        preferred_sports: meta.preferred_sports || null
      };
      const { error } = await supabase.from("profiles").upsert(profileData);
      if (error) {
        console.warn("Failed to upsert extended fields to public.profiles table, falling back to core fields:", error);
        // Fallback to core fields only
        await supabase.from("profiles").upsert({
          id: currentUser.id,
          username: currentUser.email || "",
          avatar_url: meta.avatar_url || null,
          rating: meta.rating || 4.80,
          is_premium: meta.is_premium || false
        });
      }
    } catch (e) {
      console.error("Error upserting public profile:", e);
    }

    
    // Si aún no inicializado, crear valores por defecto
    const isBrandNew = meta.xp === undefined || meta.level === undefined;

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
            date: new Date().toLocaleDateString(),
            type: "system",
          },
        ],
        carisma: 0,
      };
      
      const { data: { user: updatedUser } } = await supabase.auth.updateUser({
        data: initialMetadata,
      });
      if (updatedUser) setUser(updatedUser);
      localStorage.setItem("teammatch_last_daily_xp_date", today);
      return;
    }

    // Si ya existe pero no se ha contado esta sesión hoy, incrementar use_count
    if (!wasCounted) {
      localStorage.setItem("teammatch_last_daily_xp_date", today);
      const currentUseCount = (meta.use_count || 0) + 1;
      const currentXp = meta.xp || 0;
      const currentLevel = meta.level || 1;
      const xpGained = 10; // +10 XP por uso de la app

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
          date: new Date().toLocaleDateString(),
          type: "use",
        },
        ...(meta.xp_history || []),
      ];

      let newCoupons = [...(meta.coupons || [])];
      let awardedCoupon: RpgCoupon | null = null;

      // Otorga cupón al 5to uso (o más si no lo tiene por si el usuario está testeando)
      if (currentUseCount >= 5 && !newCoupons.some((c: any) => c.code === "FIDELIDAD5")) {
        awardedCoupon = {
          id: "FIDELIDAD5",
          code: "FIDELIDAD5",
          title: "Pergamino de Fidelidad 📜",
          discount: "$5 USD de Descuento",
          description: "Otorgado automáticamente tras tu 5to uso de la app.",
          date: new Date().toLocaleDateString(),
          claimed: false,
        };
        newCoupons.push(awardedCoupon);
      }

      // Recompensa si sube de nivel por el uso diario
      if (isLevelUp) {
        const levelCoupon = getCouponForLevel(newLevel);
        if (levelCoupon && !newCoupons.some((c: any) => c.code === levelCoupon.code)) {
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
          xp_history: newHistory,
        },
      });
      if (updatedUser) setUser(updatedUser);

      // Gatillar notificación
      setXpNotification({
        xp: xpGained,
        reason: `¡Uso diario #${currentUseCount} de la app!`,
        isLevelUp,
        newLevel: isLevelUp ? newLevel : undefined,
        newCoupon: awardedCoupon,
      });
    }
  };

  const addXp = async (amount: number, reason: string) => {
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

    let newCoupons = [...(meta.coupons || [])];
    let awardedCoupon: RpgCoupon | null = null;

    if (isLevelUp) {
      const levelCoupon = getCouponForLevel(newLevel);
      if (levelCoupon && !newCoupons.some((c: any) => c.code === levelCoupon.code)) {
        newCoupons.push(levelCoupon);
        awardedCoupon = levelCoupon;
      }
    }

    const type =
      reason.includes("unirse") || reason.includes("Unirse")
        ? "join"
        : reason.includes("crear") || reason.includes("Organizar")
          ? "create"
          : "system";

    const newHistory = [
      {
        id: "xp_" + Date.now(),
        title: reason,
        xp: amount,
        date: new Date().toLocaleDateString(),
        type,
      },
      ...(meta.xp_history || []),
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
        created_events_count: (meta.created_events_count || 0) + createdDelta,
      },
    });
    if (updatedUser) setUser(updatedUser);

    setXpNotification({
      xp: amount,
      reason,
      isLevelUp,
      newLevel: isLevelUp ? newLevel : undefined,
      newCoupon: awardedCoupon,
    });
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

    const { data: { user: updatedUser } } = await supabase.auth.updateUser({
      data: {
        coupons: newCoupons,
      },
    });
    if (updatedUser) setUser(updatedUser);
  };

  const incrementCarisma = async (amount: number = 1) => {
    if (!user) return;
    const meta = user.user_metadata || {};
    const currentCarisma = meta.carisma || 0;
    const newCarisma = currentCarisma + amount;

    const { data: { user: updatedUser } } = await supabase.auth.updateUser({
      data: {
        carisma: newCarisma,
      },
    });
    if (updatedUser) setUser(updatedUser);
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
      ...(updates.email && updates.email !== user.email && { email: updates.email })
    });


    if (updateError) throw updateError;

    try {
      const profileData: any = {
        id: user.id,
        username: (updates.email || user.email || "").trim(),
        full_name: updates.name || null,
        avatar_url: updates.avatarUrl,
        rating: user.user_metadata?.rating || 4.80,
        is_premium: user.user_metadata?.is_premium || false,
        age: updates.age || null,
        gender: updates.gender || null,
        description: updates.description || null,
        location: updates.location || null,
        preferred_sports: updates.preferredSports || null
      };
      const { error: profileError } = await supabase.from("profiles").upsert(profileData);
      if (profileError) {
        console.warn("Failed to upsert extended fields to public.profiles table, falling back to core fields:", profileError);
        // Fallback
        const { error: fallbackError } = await supabase.from("profiles").upsert({
          id: user.id,
          username: (updates.email || user.email || "").trim(),
          avatar_url: updates.avatarUrl,
          rating: user.user_metadata?.rating || 4.80,
          is_premium: user.user_metadata?.is_premium || false
        });
        if (fallbackError) {
          console.warn("Failed to update core profiles table due to RLS, but continuing:", fallbackError);
        }
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
  const xp = user?.user_metadata?.xp || 0;
  const level = user?.user_metadata?.level || 1;
  const useCount = user?.user_metadata?.use_count || 0;
  const coupons = user?.user_metadata?.coupons || [];
  const xpHistory = user?.user_metadata?.xp_history || [];
  const joinedEventsCount = user?.user_metadata?.joined_events_count || 0;
  const createdEventsCount = user?.user_metadata?.created_events_count || 0;
  const carisma = user?.user_metadata?.carisma || 0;

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
        carisma,
        incrementCarisma,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useCurrentUser() {
  return useContext(UserContext);
}
