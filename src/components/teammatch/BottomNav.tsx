import { Map, CalendarCheck, User, Trophy, Users, Shield } from "lucide-react";
import type { Screen } from "./types-nav";

interface Props {
  current: Screen;
  onChange: (s: Screen) => void;
}

export function BottomNav({ current, onChange }: Props) {
  const items: { id: Screen; label: string; icon: typeof Map }[] = [
    { id: "events", label: "Eventos", icon: CalendarCheck },
    { id: "map", label: "Explorar", icon: Map },
    { id: "friends", label: "Amigos", icon: Users as any },
    { id: "clans", label: "Clanes", icon: Shield as any },
    { id: "sports", label: "Deportes", icon: Trophy as any },
    { id: "profile", label: "Perfil", icon: User as any },
  ];

  const Btn = ({ id, label, Icon }: { id: Screen; label: string; Icon: typeof Map }) => {
    const active = current === id;
    return (
      <button
        onClick={() => onChange(id)}
        className="flex flex-1 flex-col items-center gap-1 py-2 transition-colors"
      >
        <Icon
          className={active ? "text-primary" : "text-muted-foreground"}
          size={22}
          strokeWidth={active ? 2.5 : 2}
        />
        <span className={`text-[10px] font-semibold ${active ? "text-secondary" : "text-muted-foreground"}`}>
          {label}
        </span>
      </button>
    );
  };

  return (
    <div className="absolute inset-x-0 bottom-0 z-30 pointer-events-none flex justify-center pb-0 lg:pb-6">
      <nav className="pointer-events-auto w-full lg:max-w-md lg:rounded-2xl glass border-t lg:border border-border shadow-pop">
        <div className="flex items-end px-2 pb-[calc(8px+env(safe-area-inset-bottom))] lg:pb-2 pt-1 lg:pt-2">
          {items.map((it) => (
            <Btn key={it.id} id={it.id} label={it.label} Icon={it.icon} />
          ))}
        </div>
      </nav>
    </div>
  );
}
