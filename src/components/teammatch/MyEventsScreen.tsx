import { useState, useEffect } from "react";
import { events as mockEvents } from "./data";
import { EventCard } from "./EventCard";
import type { SportEvent } from "./types";
import { supabase } from "@/lib/supabase";
import { Loader2, Star } from "lucide-react";

const tabs = ["Próximos", "Solicitudes", "Historial"] as const;

export function MyEventsScreen({ onSelect }: { onSelect: (e: SportEvent) => void }) {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Próximos");
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUser(data.user);
      if (data.user) {
        fetchRequests(data.user.email);
      }
    });
  }, []);

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

  async function handleAction(participantId: number, status: "aprobado" | "rechazado") {
    setActionLoading(participantId.toString());
    const { error } = await supabase
      .from("event_participants")
      .update({ status })
      .eq("id", participantId);
      
    if (!error) {
      setPendingRequests(prev => prev.filter(r => r.id !== participantId));
    } else {
      alert("Error al procesar la solicitud");
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
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 rounded-full py-2 text-xs font-semibold transition-all ${
                tab === t ? "bg-card text-secondary shadow-soft" : "text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
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
                    onClick={() => handleAction(req.id, "aprobado")}
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
          {mockEvents.map((e) => (
            <EventCard key={e.id} event={e} onClick={() => onSelect(e)} />
          ))}
        </div>
      )}
    </div>
  );
}
