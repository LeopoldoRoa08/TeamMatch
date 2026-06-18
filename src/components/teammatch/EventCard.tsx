import { useState, useEffect } from "react";
import { MapPin, Clock, Users, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import type { SportEvent } from "./types";
import { SportBadge } from "./SportBadge";
import { useSettings } from "@/lib/SettingsContext";

export function EventCard({
  event,
  onClick,
  variant = "full",
}: {
  event: SportEvent;
  onClick?: () => void;
  variant?: "full" | "compact";
}) {
  const { t } = useSettings();
  const [joining, setJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [joinedCount, setJoinedCount] = useState(event.joined);
  const pct = (joinedCount / event.spots) * 100;
  const isFull = joinedCount >= event.spots;

  useEffect(() => {
    let channel: any;

    const fetchJoinedCount = async () => {
      const { data, error } = await supabase
        .from("event_participants")
        .select("status")
        .eq("event_id", event.id);
      
      if (!error && data) {
        const approved = data.filter((p: any) => p.status === "approved" || p.status === "aceptado" || p.status === "aprobado" || !p.status);
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
          const { data } = await supabase
            .from("event_participants")
            .select("status")
            .eq("event_id", event.id)
            .eq("user_username", user.email)
            .maybeSingle();
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
            filter: `event_id=eq.${event.id}`,
          },
          (payload: any) => {
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
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-card text-left shadow-soft transition-all active:scale-[0.98] w-full"
    >
      <div className="relative h-28 w-full overflow-hidden shrink-0">
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
        <div className="absolute right-3 top-3 rounded-full bg-card/90 px-2.5 py-1 text-[11px] font-bold text-foreground">
          {event.price === 0 ? (t("eventCard.free") || "Gratis") : `$${event.price}`}
        </div>
        <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between text-primary-foreground">
          <div>
            <div className="text-[11px] font-medium opacity-90">{event.date}</div>
            <div className="text-base font-bold leading-tight drop-shadow">{event.title}</div>
          </div>
        </div>
      </div>

      <div className="p-3 flex-1 flex flex-col justify-between w-full space-y-3">
        <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1 font-medium text-foreground">
            {event.date}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock size={12} /> {event.time}
          </span>
          <span className="inline-flex items-center gap-1 truncate" title={(event as any).canchas?.name || (event as any).cancha_name || (event as any).place_name || event.zone}>
            <MapPin size={12} className="shrink-0" /> 
            <span className="truncate">
              {(event as any).canchas?.name || (event as any).cancha_name || (event as any).place_name || event.zone}
            </span>
          </span>
          
          <div className="mt-1 flex flex-col gap-1">
            <span className="inline-flex items-center gap-1">
              <Users size={12} /> {joinedCount}/{event.spots} {t("eventCard.spots") || "cupos"}
            </span>
            {variant === "full" && (
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full gradient-primary transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {variant === "full" && (
          <div className="w-full flex flex-col gap-2 mt-auto">
            <button
              onClick={handleJoin}
              className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all active:scale-95 shadow-pop ${
                isAccepted
                  ? "bg-primary text-white hover:bg-primary/90"
                  : isPending
                    ? "bg-amber-500 text-white hover:bg-amber-600"
                    : "bg-secondary text-white hover:bg-secondary/90"
              }`}
            >
              {isAccepted
                ? (t("eventCard.viewEvent") || "Ver evento")
                : isPending
                  ? (t("eventCard.waitingRequest") || "Esperando solicitud")
                  : (t("eventCard.joinEvent") || "Unirse al evento")}
            </button>
          </div>
        )}
      </div>
    </button>
  );
}
