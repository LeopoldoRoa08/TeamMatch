import { Map, CalendarCheck, Plus, User } from "lucide-react";
import type { Screen } from "./types-nav";

interface Props {
  current: Screen;
  onChange: (s: Screen) => void;
  onCreate: () => void;
}

export function BottomNav({ current, onChange, onCreate }: Props) {
  const items: { id: Screen; label: string; icon: typeof Map }[] = [
    { id: "map", label: "Explorar", icon: Map },
    { id: "events", label: "Eventos", icon: CalendarCheck },
  ];
  const right: { id: Screen; label: string; icon: typeof Map }[] = [
    { id: "profile", label: "Perfil", icon: User },
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
        <div className="flex flex-1 justify-center">
          <button
            onClick={onCreate}
            className="-mt-6 grid h-14 w-14 place-items-center rounded-full gradient-primary shadow-pop ring-4 ring-background transition-transform active:scale-95"
            aria-label="Crear evento"
          >
            <Plus className="text-secondary" size={26} strokeWidth={3} />
          </button>
        </div>
        {right.map((it) => (
          <Btn key={it.id} id={it.id} label={it.label} Icon={it.icon} />
        ))}
        <div className="flex-1" />
      </div>
    </nav>
  );
}
