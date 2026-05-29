import { useState, useEffect } from "react";
import { MapPin, Clock, Users, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import type { SportEvent } from "./types";
import { SportBadge } from "./SportBadge";

export function EventCard({
  event,
  onClick,
  variant = "full",
}: {
  event: SportEvent;
  onClick?: () => void;
  variant?: "full" | "compact";
}) {
  const [joining, setJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const pct = (event.joined / event.spots) * 100;
  const isFull = event.joined >= event.spots;

  useEffect(() => {
    let channel: any;

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user && user.email) {
        setCurrentUser(user);
        const fetchStatus = async () => {
          const { data } = await supabase
            .from("event_participants")
            .select("status")
            .eq("event_id", event.id)
            .eq("user_username", user.email)
            .maybeSingle();
          if (data) {
            setStatus(data.status);
          } else {
            setStatus(null);
          }
        };

        fetchStatus();

        channel = supabase
          .channel(`participant_status_${event.id}_${user.id}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "event_participants",
              filter: `event_id=eq.${event.id}`,
            },
            (payload: any) => {
              if (payload.new && payload.new.user_username === user.email) {
                setStatus(payload.new.status);
              } else if (payload.eventType === "DELETE" && payload.old && payload.old.user_username === user.email) {
                setStatus(null);
              } else {
                fetchStatus();
              }
            }
          )
          .subscribe();
      }
    });

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [event.id]);

  const isHost = currentUser && (event.host === currentUser.email || (event as any).creator_username === currentUser.email);
  const isAccepted = status === "aceptado" || status === "approved" || status === "aprobado" || isHost;
  const isPending = status === "pendiente" || status === "pending";

  async function handleJoin(e: React.MouseEvent) {
    e.stopPropagation(); // Evitar click redundante en la card
    if (onClick) onClick();
  }
  return (
    <button
      onClick={onClick}
      className="group relative w-full overflow-hidden rounded-2xl bg-card text-left shadow-soft transition-all active:scale-[0.98]"
    >
      <div className="relative h-28 w-full overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/70 via-secondary/0 to-secondary/0" />
        <div className="absolute left-3 top-3">
          <SportBadge sport={event.sport} />
        </div>
        <div className="absolute right-3 top-3 rounded-full bg-card/90 px-2.5 py-1 text-[11px] font-bold text-secondary">
          {event.price === 0 ? "Gratis" : `$${event.price}`}
        </div>
        <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between text-primary-foreground">
          <div>
            <div className="text-[11px] font-medium opacity-90">{event.date}</div>
            <div className="text-base font-bold leading-tight drop-shadow">{event.title}</div>
          </div>
        </div>
      </div>

      <div className="space-y-2 p-3">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock size={12} /> {event.time}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin size={12} /> {event.zone}
          </span>
          <span className="ml-auto text-[11px] font-semibold text-secondary">
            {event.distanceKm} km
          </span>
        </div>

        {variant === "full" && (
          <>
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full gradient-primary transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-secondary">
                <Users size={12} /> {event.joined}/{event.spots}
              </span>
            </div>

            <button
              onClick={handleJoin}
              className={`mt-2 w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all active:scale-95 shadow-pop ${
                isAccepted
                  ? "bg-primary text-secondary hover:bg-primary/90"
                  : isPending
                    ? "bg-amber-500/20 text-amber-500 border border-amber-500/30 hover:bg-amber-500/30"
                    : "bg-secondary text-primary-foreground hover:bg-secondary/90"
              }`}
            >
              {isAccepted
                ? "Ver evento"
                : isPending
                  ? "Esperando solicitud"
                  : "Unirse al evento"}
            </button>
          </>
        )}
      </div>
    </button>
  );
}
