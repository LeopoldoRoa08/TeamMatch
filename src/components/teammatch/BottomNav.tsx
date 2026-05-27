import { Map, CalendarCheck, User, Trophy } from "lucide-react";
import type { Screen } from "./types-nav";

interface Props {
  current: Screen;
  onChange: (s: Screen) => void;
}

export function BottomNav({ current, onChange }: Props) {
  const items: { id: Screen; label: string; icon: typeof Map }[] = [
    { id: "map", label: "Explorar", icon: Map },
    { id: "events", label: "Eventos", icon: CalendarCheck },
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
    <nav className="absolute inset-x-0 bottom-0 z-30 glass border-t border-border">
      <div className="flex items-end px-2 pb-2 pt-1">
        {items.map((it) => (
          <Btn key={it.id} id={it.id} label={it.label} Icon={it.icon} />
        ))}

        <div className="flex-1" />
      </div>
    </nav>
  );
}
