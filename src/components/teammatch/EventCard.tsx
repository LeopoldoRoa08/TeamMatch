import { MapPin, Clock, Users } from "lucide-react";
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
  const pct = (event.joined / event.spots) * 100;
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
          </>
        )}
      </div>
    </button>
  );
}
