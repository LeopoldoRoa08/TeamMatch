import { useState, useEffect } from "react";
import { events as mockEvents } from "./data";
import { EventCard } from "./EventCard";
import type { SportEvent } from "./types";
import { supabase } from "@/lib/supabase";
import { Loader2, Star } from "lucide-react";
import { UserAvatar } from "./UserAvatar";
import footballField from "@/assets/football-field.jpg";
import padelCourt from "@/assets/padel-court.jpg";
import hikingTrail from "@/assets/hiking-trail.jpg";
import runningTrail from "@/assets/running-trail.jpg";
import { parseLocation } from "./MapScreen";

const getSportImage = (sportId: number) => {
  if (sportId === 1) return footballField;
  if (sportId === 4) return padelCourt;
  if (sportId === 2) return padelCourt; // tenis fallback
  if (sportId === 3) return hikingTrail; // golf fallback
  return runningTrail;
};

const tabs = ["Disponibles", "Mis Partidos", "Solicitudes", "Historial"] as const;

export function MyEventsScreen({ onSelect }: { onSelect: (e: SportEvent) => void }) {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Disponibles");
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [availableEvents, setAvailableEvents] = useState<any[]>([]);
  const [myEvents, setMyEvents] = useState<any[]>([]);
  const [pastEvents, setPastEvents] = useState<any[]>([]);
  const [createdEvents, setCreatedEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

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
      .select("*")
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
      .select("*")
      .eq("creator_username", email);

    const { data: joinedData } = await supabase
      .from("event_participants")
      .select("events(*)")
      .eq("user_username", email);

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
        profiles(is_premium, rating)
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
        <UserAvatar size="md" />
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
              const sportName = req.events?.sport_id === 1 ? "Fútbol" : req.events?.sport_id === 2 ? "Tenis" : req.events?.sport_id === 4 ? "Pádel" : "Evento";

              return (
                <div key={req.id} className="rounded-2xl bg-card p-4 shadow-soft">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-full gradient-primary text-sm font-bold text-secondary">
                      {(req.user_username || "U").substring(0, 2).toUpperCase()}
                    </div>
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
                      <div className="text-xs text-muted-foreground mt-0.5">quiere unirse a tu partido de {sportName}</div>
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
        <div className="space-y-3 px-5 pt-3">
          {tab === "Disponibles" && (
            <>
              {availableEvents.map((e) => (
                <EventCard key={e.id} event={e} onClick={() => onSelect(e)} />
              ))}
              {availableEvents.length === 0 && (
                <div className="text-center text-sm text-muted-foreground p-5 mt-10">
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
                <div className="text-center text-sm text-muted-foreground p-5 mt-10">
                  No tienes partidos próximos programados
                </div>
              )}
            </>
          )}
          {tab === "Historial" && (
            <>
              {pastEvents.map((e) => (
                <EventCard key={e.id} event={e} onClick={() => onSelect(e)} />
              ))}
              {pastEvents.length === 0 && (
                <div className="text-center text-sm text-muted-foreground p-5 mt-10">
                  No has jugado ningún partido todavía
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
