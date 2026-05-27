import { Settings, Trophy, Star, Calendar, Edit3, LogOut, Loader2, ArrowLeft, MapPin, Clock, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { SportEvent } from "./types";
import { parseLocation } from "./MapScreen";

const SPORT_NAMES: Record<number, string> = {
  1: "Fútbol",
  2: "Tenis",
  3: "Baloncesto",
  4: "Pádel",
  5: "Senderismo",
  6: "Running",
  7: "Vóleibol",
};

const SPORT_EMOJIS: Record<number, string> = {
  1: "⚽",
  2: "🎾",
  3: "🏀",
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

function formatEvent(row: any): any {
  if (!row) return null;
  const coords = parseLocation(row.location);
  const lat = coords?.lat ?? 0;
  const lng = coords?.lng ?? 0;
  const sportName = SPORT_NAMES[row.sport_id] || "Deporte";
  return {
    ...row,
    lat,
    lng,
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
    image: "https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&q=80&w=800",
    distanceKm: 2.5,
    joined: row.joined ?? 1,
    spots: row.max_capacity || 10,
    price: 0,
    zone: "Caracas",
  };
}

export function ProfileScreen({
  onEdit,
  onSelectEvent,
}: {
  onEdit?: () => void;
  onSelectEvent?: (e: SportEvent) => void;
}) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sportGroups, setSportGroups] = useState<SportGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<SportGroup | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        setUser(user);

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Usuario";
  const email = user?.email || "";
  const initials = name.substring(0, 2).toUpperCase();

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalEvents = sportGroups.reduce((acc, g) => acc + g.count, 0);

  const stats = [
    { label: "Eventos", value: totalEvents.toString(), icon: Calendar },
    { label: "Rating", value: "4.9", icon: Star },
    { label: "Trofeos", value: "7", icon: Trophy },
  ];

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

  // ── Vista principal del perfil ────────────────────────────────────────────
  return (
    <div className="h-full overflow-y-auto bg-background pb-24">
      {/* Hero */}
      <div className="relative gradient-dark px-5 pb-20 pt-12 text-primary-foreground">
        <div className="flex items-center justify-between">
          <button
            onClick={onEdit}
            className="grid h-10 w-10 place-items-center rounded-full bg-card/10 text-[#32CD32] transition-transform active:scale-95"
          >
            <Edit3 size={16} />
          </button>
          <button className="grid h-10 w-10 place-items-center rounded-full bg-card/10">
            <Settings size={16} />
          </button>
        </div>
        <div className="mt-4 flex items-center gap-4">
          {user?.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt="Avatar"
              className="h-20 w-20 rounded-full object-cover ring-4 ring-card/20 shadow-pop"
            />
          ) : (
            <div
              className="grid h-20 w-20 place-items-center rounded-full bg-card text-2xl font-bold ring-4 ring-card/20 shadow-pop"
              style={{ color: "#32CD32" }}
            >
              {initials}
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              {name}
              {user?.user_metadata?.is_organizer && (
                <span className="flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-500 shadow-pop">
                  <Star size={10} className="fill-amber-500" /> Organizador
                </span>
              )}
            </h1>
            <p className="text-xs text-white/80">{email}</p>
            <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-primary/20 px-2 py-0.5 text-[11px] font-semibold text-primary">
              <Star size={11} className="fill-primary" /> Jugador verificado
            </div>
          </div>
        </div>
      </div>

      {/* Stats card */}
      <div className="-mt-12 px-5">
        <div className="grid grid-cols-3 gap-2 rounded-2xl bg-card p-4 shadow-pop">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="mx-auto mb-1 grid h-9 w-9 place-items-center rounded-xl bg-muted">
                <s.icon size={16} className="text-primary" />
              </div>
              <div className="text-lg font-bold text-secondary">{s.value}</div>
              <div className="text-[11px] text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sports */}
      <div className="px-5 pt-6">
        <h2 className="mb-3 text-sm font-bold text-secondary">Mis deportes</h2>
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
              No has escogido ningún deporte
            </div>
          )}
        </div>
      </div>

      {/* Logout */}
      <div className="px-5 pt-8">
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500/10 py-4 text-sm font-bold text-red-500 transition-colors hover:bg-red-500/20"
        >
          <LogOut size={18} />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
