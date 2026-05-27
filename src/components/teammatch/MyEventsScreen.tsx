import { useState, useEffect } from "react";
import { events as mockEvents } from "./data";
import { EventCard } from "./EventCard";
import type { SportEvent } from "./types";
import { supabase } from "@/lib/supabase";
import { Loader2, Star } from "lucide-react";
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

const tabs = ["Próximos", "Solicitudes", "Historial"] as const;

export function MyEventsScreen({ onSelect }: { onSelect: (e: SportEvent) => void }) {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Próximos");
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [createdEvents, setCreatedEvents] = useState<any[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<any[]>([]);
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
      hostName: row.creator_username || "Usuario",
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
        fetchCreated(data.user.email);
        fetchJoined(data.user.email);
      }
    });
  }, []);

  async function fetchCreated(email: string | undefined) {
    if (!email) return;
    const { data } = await supabase.from("events").select("*").neq("creator_username", email).order("created_at", { ascending: false });
    if (data) setCreatedEvents(data.map(formatEvent).filter(Boolean));
  }

  async function fetchJoined(email: string | undefined) {
    if (!email) return;
    const { data } = await supabase.from("event_participants").select("events(*)").eq("user_username", email);
    if (data) setJoinedEvents(data.map((d: any) => formatEvent(d.events)).filter(Boolean));
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
      <header className="px-5 pb-3 pt-12">
        <h1 className="text-2xl font-bold text-secondary">Mis eventos</h1>
        <p className="text-sm text-muted-foreground">Tu agenda deportiva</p>
      </header>

      <div className="sticky top-0 z-10 bg-background/80 px-5 pb-3 pt-1 backdrop-blur">
        <div className="flex gap-1 rounded-full bg-muted p-1">
          {tabs.map((t) => {
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 rounded-full py-2 text-xs font-semibold transition-all ${
                  tab === t ? "bg-card text-secondary shadow-soft" : "text-muted-foreground"
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
            )})
          )}
        </div>
      ) : (
        <div className="space-y-3 px-5 pt-3">
          {(tab === "Próximos" ? createdEvents : joinedEvents).map((e) => (
            <EventCard key={e.id} event={e} onClick={() => onSelect(e)} />
          ))}
          {(tab === "Próximos" ? createdEvents : joinedEvents).length === 0 && (
            <div className="text-center text-sm text-muted-foreground p-5 mt-10">
              {tab === "Próximos" 
                ? "No hay eventos disponibles" 
                : "No te has unido a ningún evento todavía."}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
