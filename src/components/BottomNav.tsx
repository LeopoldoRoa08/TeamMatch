import { Map, CalendarCheck, User, Plus } from 'lucide-react';
import { Screen } from '../types';
import { motion } from 'motion/react';

interface Props {
  current: Screen;
  onChange: (s: Screen) => void;
  onCreate: () => void;
}

export function BottomNav({ current, onChange, onCreate }: Props) {
  const items: { id: Screen; label: string; icon: any }[] = [
    { id: "map", label: "Explorar", icon: Map },
    { id: "events", label: "Eventos", icon: CalendarCheck },
  ];
  const right: { id: Screen; label: string; icon: any }[] = [
    { id: "profile", label: "Perfil", icon: User },
  ];

  const Btn = ({ id, label, icon: Icon }: { id: Screen; label: string; icon: any; key?: any }) => {
    const active = current === id;
    return (
      <button onClick={() => onChange(id)} className="flex flex-1 flex-col items-center justify-center gap-1 py-1 transition-all">
        <div className={`relative flex items-center justify-center rounded-xl p-1.5 transition-colors ${active ? 'bg-primary/10' : ''}`}>
           <Icon className={active ? "text-primary" : "text-zinc-500"} size={22} strokeWidth={active ? 2.5 : 2} />
          {active && <motion.div layoutId="nav-active" className="absolute -bottom-1 h-1 w-1 rounded-full bg-primary" />}
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-widest ${active ? "text-primary" : "text-zinc-500"}`}>{label}</span>
      </button>
    );
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 bg-secondary/80 px-4 pb-6 pt-2 backdrop-blur-xl">
      <div className="mx-auto flex max-w-md items-end justify-between gap-2">
        {items.map((it) => <Btn key={it.id} id={it.id} label={it.label} icon={it.icon} />)}
        <div className="relative -top-6 flex flex-1 items-center justify-center">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onCreate} className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-black shadow-pop transition-all">
            <Plus size={32} strokeWidth={3} />
          </motion.button>
        </div>
        {right.map((it) => <Btn key={it.id} id={it.id} label={it.label} icon={it.icon} />)}
      </div>
    </nav>
  );
}
