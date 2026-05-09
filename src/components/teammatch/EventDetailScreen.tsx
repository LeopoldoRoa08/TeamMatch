import { ArrowLeft, MapPin, Clock, Calendar, Users, Share2, Star } from "lucide-react";
import type { SportEvent } from "./types";
import { SportBadge } from "./SportBadge";

export function EventDetailScreen({ event, onBack }: { event: SportEvent; onBack: () => void }) {
  const players = Array.from({ length: event.joined }).map((_, i) => ({
    initials: ["JM", "LP", "CG", "RF", "DV", "AS", "MN", "TC", "EP", "GH", "BR"][i] ?? "??",
  }));
  const empty = event.spots - event.joined;

  return (
    <div className="relative h-full overflow-y-auto bg-background">
      {/* Hero */}
      <div className="relative h-64 w-full overflow-hidden">
        <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-secondary/40" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-12">
          <button
            onClick={onBack}
            className="grid h-10 w-10 place-items-center rounded-full glass shadow-soft"
          >
            <ArrowLeft size={18} className="text-secondary" />
          </button>
          <button className="grid h-10 w-10 place-items-center rounded-full glass shadow-soft">
            <Share2 size={16} className="text-secondary" />
          </button>
        </div>
        <div className="absolute inset-x-0 bottom-4 px-5">
          <div className="mb-2 flex items-center gap-2">
            <SportBadge sport={event.sport} />
            <span className="rounded-full bg-card/90 px-2.5 py-1 text-[11px] font-bold text-secondary">
              {event.level}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-primary-foreground drop-shadow">
            {event.title}
          </h1>
        </div>
      </div>

      <div className="space-y-4 p-5 pb-32">
        {/* Host */}
        <div className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-soft">
          <div className="grid h-11 w-11 place-items-center rounded-full gradient-primary text-sm font-bold text-secondary">
            {event.hostAvatar}
          </div>
          <div className="flex-1">
            <div className="text-[11px] font-medium text-muted-foreground">Organizador</div>
            <div className="text-sm font-bold text-secondary">{event.host}</div>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-secondary">
            <Star size={14} className="fill-accent text-accent" /> 4.8
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-3">
          <InfoTile icon={Calendar} label="Fecha" value={event.date} />
          <InfoTile icon={Clock} label="Hora" value={event.time} />
          <InfoTile icon={MapPin} label="Lugar" value={event.location} />
          <InfoTile icon={Users} label="Cupos" value={`${event.joined}/${event.spots}`} />
        </div>

        {/* Description */}
        <div>
          <h3 className="mb-2 text-sm font-bold text-secondary">Descripción</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Partido amistoso, cancha sintética con luces. Trae ropa cómoda y agua. Se aceptan jugadores
            con experiencia, ambiente respetuoso y competitivo.
          </p>
        </div>

        {/* Players */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-bold text-secondary">Jugadores</h3>
            <span className="text-xs text-muted-foreground">{empty} cupos disponibles</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {players.map((p, i) => (
              <div
                key={i}
                className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-[11px] font-bold text-primary-foreground"
              >
                {p.initials}
              </div>
            ))}
            {Array.from({ length: empty }).map((_, i) => (
              <div
                key={`e-${i}`}
                className="grid h-10 w-10 place-items-center rounded-full border-2 border-dashed border-border text-muted-foreground"
              >
                +
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="absolute inset-x-0 bottom-0 z-20 glass border-t border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <div>
            <div className="text-[11px] font-medium text-muted-foreground">Aporte</div>
            <div className="text-lg font-bold text-secondary">
              {event.price === 0 ? "Gratis" : `$${event.price} USD`}
            </div>
          </div>
          <button className="ml-auto flex-1 rounded-2xl gradient-primary py-3.5 text-sm font-bold text-secondary shadow-pop active:scale-[0.98]">
            Solicitar unirme
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-card p-3 shadow-soft">
      <div className="mb-1 grid h-8 w-8 place-items-center rounded-lg bg-muted">
        <Icon size={15} className="text-primary" />
      </div>
      <div className="text-[11px] font-medium text-muted-foreground">{label}</div>
      <div className="text-sm font-bold text-secondary">{value}</div>
    </div>
  );
}
