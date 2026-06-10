import { useState, useEffect } from "react";
import { events as mockEvents } from "./data";
import { EventCard } from "./EventCard";
import type { SportEvent } from "./types";
import { supabase } from "@/lib/supabase";
import { Loader2, Star, X } from "lucide-react";
import { UserAvatar } from "./UserAvatar";
import footballField from "@/assets/football-field.jpg";
import padelCourt from "@/assets/padel-court.jpg";
import hikingTrail from "@/assets/hiking-trail.jpg";
import runningTrail from "@/assets/running-trail.jpg";
import tennisCourt from "@/assets/tennis-court.png";
import golfCourse from "@/assets/golf-course.png";
import { parseLocation } from "./MapScreen";

const getSportImage = (sportId: number) => {
  if (sportId === 1) return footballField;
  if (sportId === 2) return tennisCourt;
  if (sportId === 3) return golfCourse;
  if (sportId === 4) return padelCourt;
  return runningTrail;
};

const tabs = ["Próximos", "Mis Partidos", "Solicitudes"] as const;

export function MyEventsScreen({ onSelect, onNavigateToProfile }: { onSelect: (e: SportEvent) => void, onNavigateToProfile?: () => void }) {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Mis Partidos");
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [availableEvents, setAvailableEvents] = useState<any[]>([]);
  const [myEvents, setMyEvents] = useState<any[]>([]);
  const [pastEvents, setPastEvents] = useState<any[]>([]);
  const [createdEvents, setCreatedEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedUserProfile, setSelectedUserProfile] = useState<any | null>(null);

  const formatEvent = (row: any) => {
    if (!row) return null;
    const coords = parseLocation(row.location);
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
      cancha_name: row.canchas?.name || null,
      description_after_arrival: row.description_after_arrival,
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
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("events")
      .select("*, canchas(name)")
      .or(`event_date.gte.${now},status.eq.abierto`)
      .order("event_date", { ascending: true });

    if (!error && data) {
      setAvailableEvents(data.map(formatEvent).filter(Boolean));
    }
    setLoading(false);
  }

  async function fetchUserEvents(email: string | undefined) {
    if (!email) return;
    setLoading(true);

    const { data: createdData } = await supabase
      .from("events")
      .select("*, canchas(name)")
      .eq("creator_username", email);

    const { data: joinedData } = await supabase
      .from("event_participants")
      .select("events(*, canchas(name))")
      .eq("user_username", email)
      .neq("status", "rechazado");

    const created = (createdData || []).map(formatEvent).filter(Boolean);
    const joined = (joinedData || []).map((d: any) => formatEvent(d.events)).filter(Boolean);

    const allUserEventsMap = new Map();
    created.forEach(e => allUserEventsMap.set(e.id, e));
    joined.forEach(e => allUserEventsMap.set(e.id, e));
    const allUserEvents = Array.from(allUserEventsMap.values());

    const now = new Date();
    const upcoming = allUserEvents.filter((e: any) => !e.event_date || new Date(e.event_date) >= now || e.status === "abierto");
    const past = allUserEvents.filter((e: any) => e.event_date && new Date(e.event_date) < now && e.status !== "abierto");

    upcoming.sort((a, b) => new Date(a.event_date || 0).getTime() - new Date(b.event_date || 0).getTime());
    past.sort((a, b) => new Date(b.event_date || 0).getTime() - new Date(a.event_date || 0).getTime());

    setMyEvents(upcoming);
    setPastEvents(past);
    setCreatedEvents(created);
    setLoading(false);

    setTab(upcoming.length > 0 ? "Mis Partidos" : "Próximos");
  }

  async function fetchRequests(email: string | undefined) {
    if (!email) return;
    setLoading(true);
    // Fetch pending requests for events owned by the user
    const { data, error } = await supabase
      .from("event_participants")
      .select(`
        id, 
        user_username, 
        status,
        events!inner(id, creator_username, sport_id),
        profiles(*)
      `)
      .eq("status", "pendiente")
      .eq("events.creator_username", email);

    if (!error && data) {
      setPendingRequests(data);
    }
    setLoading(false);
  }

  async function handleAction(participantId: number, status: "aceptado" | "rechazado") {
    const req = pendingRequests.find(r => r.id === participantId);
    if (!req || req.events?.creator_username !== currentUser?.email) {
      alert("No tienes permiso para realizar esta acción.");
      return;
    }

    setActionLoading(participantId.toString());
    const { error } = await supabase
      .from("event_participants")
      .update({ status })
      .eq("id", participantId);

    if (!error) {
      setPendingRequests(prev => prev.filter(r => r.id !== participantId));
    } else {
      console.error(error);
      alert("Error al procesar la solicitud: " + error.message);
    }
    setActionLoading(null);
  }

  return (
    <div className="h-full overflow-y-auto bg-background pb-24">
      <header className="flex items-center justify-between px-5 pb-3 pt-12">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Mis eventos</h1>
          <p className="text-sm text-muted-foreground">Tu agenda deportiva</p>
        </div>
        <UserAvatar size="md" className="cursor-pointer" onClick={onNavigateToProfile} />
      </header>

      <div className="sticky top-0 z-10 bg-background/80 px-5 pb-3 pt-1 backdrop-blur">
        <div className="flex gap-1 rounded-full bg-muted p-1">
          {tabs.map((t) => {
            // Only show 'Solicitudes' tab if the user has created at least one event
            if (t === "Solicitudes" && createdEvents.length === 0) return null;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 rounded-full py-2 text-xs font-semibold transition-all ${tab === t ? "bg-card text-secondary shadow-soft" : "text-muted-foreground"
                  }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {tab === "Solicitudes" ? (
        <div className="space-y-3 px-5 pt-3">
          {loading ? (
            <div className="flex justify-center p-5"><Loader2 className="animate-spin text-primary" /></div>
          ) : pendingRequests.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground p-5">No tienes solicitudes pendientes nuevas</div>
          ) : (
            pendingRequests.map((req) => {
              const isPremium = req.profiles?.is_premium;
              const sportName = req.events?.sport_id === 1 ? "Fútbol" : req.events?.sport_id === 2 ? "Tenis" : req.events?.sport_id === 3 ? "Golf" : req.events?.sport_id === 4 ? "Pádel" : "Evento";

              return (
                <div key={req.id} className="rounded-2xl bg-card p-4 shadow-soft">
                  <div 
                    onClick={() => setSelectedUserProfile(req.profiles || { username: req.user_username })}
                    className="mb-3 flex items-center gap-3 cursor-pointer hover:opacity-85 transition-opacity"
                  >
                    {req.profiles?.avatar_url ? (
                      <img
                        src={req.profiles.avatar_url}
                        alt="Avatar"
                        className="h-10 w-10 rounded-full object-cover shadow-soft ring-2 ring-primary/30"
                      />
                    ) : (
                      <div className="grid h-10 w-10 place-items-center rounded-full gradient-primary text-sm font-bold text-secondary">
                        {(req.user_username || "U").substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <div className="text-sm font-bold text-secondary">
                          {req.user_username?.split('@')[0] || "Usuario"}
                        </div>
                        {isPremium ? (
                          <span className="flex items-center gap-0.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-700">
                            <Star size={8} className="fill-amber-500" /> Premium
                          </span>
                        ) : (
                          <span className="rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground">
                            Básica
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        quiere unirse a tu partido de {sportName}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedUserProfile(req.profiles || { username: req.user_username });
                          }}
                          className="text-[10px] font-extrabold text-primary hover:underline block text-left mt-1"
                        >
                          Ver Perfil 🔍
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      disabled={actionLoading === req.id.toString()}
                      onClick={() => handleAction(req.id, "rechazado")}
                      className="flex-1 rounded-xl bg-muted py-2.5 text-xs font-semibold text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-50"
                    >
                      Rechazar
                    </button>
                    <button
                      disabled={actionLoading === req.id.toString()}
                      onClick={() => handleAction(req.id, "aceptado")}
                      className="flex flex-1 items-center justify-center rounded-xl gradient-primary py-2.5 text-xs font-bold text-secondary shadow-pop disabled:opacity-50"
                    >
                      {actionLoading === req.id.toString() ? <Loader2 size={14} className="animate-spin" /> : "Aceptar"}
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 px-5 pt-3">
          {tab === "Próximos" && (
            <>
              {availableEvents.map((e) => (
                <EventCard key={e.id} event={e} onClick={() => onSelect(e)} />
              ))}
              {availableEvents.length === 0 && (
                <div className="w-full text-center text-sm text-muted-foreground p-5 mt-10">
                  No hay eventos disponibles
                </div>
              )}
            </>
          )}
          {tab === "Mis Partidos" && (
            <>
              {myEvents.map((e) => (
                <EventCard key={e.id} event={e} onClick={() => onSelect(e)} />
              ))}
              {myEvents.length === 0 && (
                <div className="w-full text-center text-sm text-muted-foreground p-5 mt-10">
                  No tienes partidos próximos programados
                </div>
              )}
            </>
          )}
        </div>
      )}

      {selectedUserProfile && (() => {
        const formatted = getFormattedProfile(selectedUserProfile);
        if (!formatted) return null;
        
        return (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 px-6 py-4 animate-in fade-in duration-300">
            <div className="relative w-full max-w-sm rounded-3xl bg-secondary border border-primary/30 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col">
              
              <div className={`h-24 w-full bg-gradient-to-tr ${formatted.gradient} relative shrink-0`} />
              
              <div className="absolute top-10 left-6">
                <div className="relative">
                  <div className="h-16 w-16 rounded-full bg-card p-1 shadow-md ring-4 ring-secondary">
                    {formatted.avatar_url ? (
                      <img 
                        src={formatted.avatar_url} 
                        alt="Avatar" 
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <div className={`h-full w-full rounded-full bg-gradient-to-tr ${formatted.gradient} grid place-items-center text-2xl`}>
                        {formatted.emoji}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setSelectedUserProfile(null)}
                className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors grid place-items-center cursor-pointer"
              >
                <X size={16} />
              </button>

              <div className="p-6 pt-8 space-y-4 text-white">
                <div className="space-y-1">
                  <h3 className="text-base font-black flex items-center gap-2">
                    {formatted.name}
                    {formatted.is_organizer && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/20 px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-amber-500 border border-amber-500/30">
                        Organizador
                      </span>
                    )}
                  </h3>
                  <p className="text-[10px] text-white/50">{formatted.username}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                    <span className="text-[9px] text-white/50 block font-bold">Edad</span>
                    <span className="font-extrabold text-white">{formatted.age} años</span>
                  </div>
                  <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                    <span className="text-[9px] text-white/50 block font-bold">Género</span>
                    <span className="font-extrabold text-white truncate block">{formatted.gender}</span>
                  </div>
                  <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                    <span className="text-[9px] text-white/50 block font-bold">Ubicación</span>
                    <span className="font-extrabold text-white truncate block" title={formatted.location}>
                      {formatted.location}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] text-white/50 font-bold uppercase tracking-wider block">Sobre mí</span>
                  <p className="text-xs leading-relaxed text-white/80 bg-white/5 p-3 rounded-xl border border-white/5 italic">
                    "{formatted.bio}"
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[9px] text-white/50 font-bold uppercase tracking-wider block">Deportes Favoritos</span>
                  <div className="flex flex-wrap gap-1.5">
                    {formatted.sports.map((sport: string) => (
                      <span key={sport} className="rounded-full bg-primary/15 border border-primary/25 px-2.5 py-0.5 text-[9px] font-bold text-primary">
                        {sport}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedUserProfile(null)}
                  className="w-full rounded-2xl bg-muted py-3 text-xs font-black uppercase tracking-wider text-muted-foreground shadow-sm hover:bg-muted/80 transition-all mt-2 cursor-pointer"
                >
                  Cerrar Perfil
                </button>
              </div>

            </div>
          </div>
        );
      })()}
    </div>
  );
}

const getFormattedProfile = (p: any) => {
  if (!p) return null;
  const username = p.username || "Usuario";
  
  let charCodeSum = 0;
  for (let i = 0; i < username.length; i++) {
    charCodeSum += username.charCodeAt(i);
  }
  
  const age = p.age || (20 + (charCodeSum % 15));
  
  const locations = ["Chacao", "Las Mercedes", "Altamira", "El Hatillo", "La Castellana", "Los Palos Grandes"];
  const location = p.location || locations[charCodeSum % locations.length];
  
  const sportsPool = ["Running", "Senderismo", "Pádel", "Tenis", "Vóleibol"];
  const sportsCount = 1 + (charCodeSum % 3);
  const sports: string[] = p.preferred_sports || [];
  if (sports.length === 0) {
    for (let i = 0; i < sportsCount; i++) {
      const sport = sportsPool[(charCodeSum + i) % sportsPool.length];
      if (!sports.includes(sport)) {
        sports.push(sport);
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
  
  const name = username.includes("@") 
    ? username.split("@")[0].split(".").map((n: string) => n.charAt(0).toUpperCase() + n.slice(1)).join(" ") 
    : username;

  return {
    name,
    username,
    age,
    gender: p.gender || (charCodeSum % 2 === 0 ? "Masculino" : "Femenino"),
    location,
    bio,
    sports,
    emoji,
    gradient,
    rating: p.rating || 4.8,
    avatar_url: p.avatar_url,
    is_premium: p.is_premium || false,
    is_organizer: p.is_organizer || false
  };
};
