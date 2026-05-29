import { Trophy, ChevronRight, Calendar, Clock, MapPin, ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { UserAvatar } from "./UserAvatar";
import type { SportEvent } from "./types";
import footballField from "@/assets/football-field.jpg";
import padelCourt from "@/assets/padel-court.jpg";
import hikingTrail from "@/assets/hiking-trail.jpg";
import runningTrail from "@/assets/running-trail.jpg";
import tennisCourt from "@/assets/tennis-court.png";
import golfCourse from "@/assets/golf-course.png";

const SPORT_NAMES: Record<number, string> = {
  1: "Fútbol",
  2: "Tenis",
  3: "Golf",
  4: "Pádel",
  5: "Senderismo",
  6: "Running",
  7: "Vóleibol",
};

const SPORT_EMOJIS: Record<number, string> = {
  1: "⚽",
  2: "🎾",
  3: "⛳",
  4: "🏓",
  5: "🥾",
  6: "🏃",
  7: "🏐",
};

interface SportGroup {
  sportId: number;
  name: string;
  emoji: string;
  count: number;
  events: any[];
}

const getSportImage = (sportId: number) => {
  if (sportId === 1) return footballField;
  if (sportId === 2) return tennisCourt;
  if (sportId === 3) return golfCourse;
  if (sportId === 4) return padelCourt;
  if (sportId === 5) return hikingTrail;
  return runningTrail;
};

function formatEvent(row: any): any {
  if (!row) return null;
  const sportName = SPORT_NAMES[row.sport_id] || "Deporte";
  return {
    ...row,
    sport: sportName,
    title: row.title || `Partido de ${sportName}`,
    hostName: row.creator_username || "Usuario",
    hostAvatar: (row.creator_username || "U").substring(0, 2).toUpperCase(),
    time: row.event_date
      ? new Date(row.event_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "00:00",
    date: row.event_date
      ? new Date(row.event_date).toLocaleDateString("es-VE", {
          weekday: "short",
          day: "numeric",
          month: "short",
        })
      : "Próximamente",
    image: getSportImage(row.sport_id),
    distanceKm: 2.5,
    joined: row.joined ?? 1,
    spots: row.max_capacity || 10,
    price: 0,
    zone: "Caracas",
  };
}

export function MySportsScreen({ onSelectEvent, onNavigateToProfile }: { onSelectEvent?: (e: SportEvent) => void, onNavigateToProfile?: () => void }) {
  const [loading, setLoading] = useState(true);
  const [sportGroups, setSportGroups] = useState<SportGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<SportGroup | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        // Traer eventos completos en los que el usuario participa
        const { data } = await supabase
          .from("event_participants")
          .select(`events!inner(*)`)
          .eq("user_username", user.email);

        if (data && data.length > 0) {
          // Agrupar por deporte
          const groups: Record<number, SportGroup> = {};
          data.forEach((p: any) => {
            const ev = p.events;
            if (!ev) return;
            const sid: number = ev.sport_id;
            if (!groups[sid]) {
              groups[sid] = {
                sportId: sid,
                name: SPORT_NAMES[sid] || "Deporte",
                emoji: SPORT_EMOJIS[sid] || "🏅",
                count: 0,
                events: [],
              };
            }
            groups[sid].count += 1;
            groups[sid].events.push(formatEvent(ev));
          });
          setSportGroups(Object.values(groups));
        }
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // ── Vista: eventos de un deporte ──────────────────────────────────────────
  if (selectedGroup) {
    return (
      <div className="h-full overflow-y-auto bg-background pb-24">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-background/90 px-4 pb-3 pt-12 backdrop-blur">
          <button
            onClick={() => setSelectedGroup(null)}
            className="grid h-10 w-10 place-items-center rounded-full bg-muted transition-all active:scale-95"
          >
            <ArrowLeft size={18} className="text-secondary" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-secondary">
              {selectedGroup.emoji} {selectedGroup.name}
            </h1>
            <p className="text-[11px] text-muted-foreground">
              {selectedGroup.count} partido{selectedGroup.count !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Event list */}
        <div className="space-y-3 px-5 pt-4">
          {selectedGroup.events.map((ev) => (
            <button
              key={ev.id}
              onClick={() => onSelectEvent?.(ev as SportEvent)}
              className="w-full rounded-2xl bg-card p-4 shadow-soft text-left transition-all hover:shadow-pop active:scale-[0.98]"
            >
              <div className="flex items-start gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-muted text-2xl shrink-0">
                  {selectedGroup.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-secondary truncate">{ev.title}</div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {ev.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {ev.time}
                    </span>
                    {ev.intensity && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold">
                        {ev.intensity}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin size={11} />
                    <span className="truncate">{ev.zone}</span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-muted-foreground shrink-0 mt-1" />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Vista principal de Mis Deportes ────────────────────────────────────────────
  return (
    <div className="h-full overflow-y-auto bg-background pb-24">
      <header className="flex items-center justify-between px-5 pb-3 pt-12">
        <div>
          <h1 className="text-2xl font-bold text-secondary flex items-center gap-2">
            <Trophy size={24} className="text-primary" />
            Mis deportes
          </h1>
          <p className="text-sm text-muted-foreground">Tus estadísticas y partidos por disciplina</p>
        </div>
        <UserAvatar size="md" className="cursor-pointer" onClick={onNavigateToProfile} />
      </header>

      <div className="px-5 pt-6">
        <div className="space-y-2">
          {sportGroups.length > 0 ? (
            sportGroups.map((g) => (
              <button
                key={g.sportId}
                onClick={() => setSelectedGroup(g)}
                className="w-full flex items-center gap-3 rounded-2xl bg-card p-3 shadow-soft transition-all hover:shadow-pop active:scale-[0.98]"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-muted text-xl shrink-0">
                  {g.emoji}
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-bold text-secondary">{g.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {g.count} partido{g.count !== 1 ? "s" : ""}
                  </div>
                </div>
                <ChevronRight size={16} className="text-primary shrink-0" />
              </button>
            ))
          ) : (
            <div className="text-sm text-muted-foreground p-3 text-center bg-card rounded-2xl shadow-soft">
              No te has unido a eventos de ningún deporte todavía
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
