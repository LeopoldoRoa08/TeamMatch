import { useState } from 'react';
import { Search, SlidersHorizontal, Bell } from 'lucide-react';
import { SportEvent, Sport } from '../types';
import { EventCard } from '../components/EventCard';
import { motion } from 'motion/react';

const sports: (Sport | "Todos")[] = ["Todos", "Running", "Senderismo", "Pádel", "Vóleibol"];

export function MapScreen({ onSelect, events }: { onSelect: (e: SportEvent) => void; events: SportEvent[] }) {
  const [active, setActive] = useState<Sport | "Todos">("Todos");
  const [selectedId, setSelectedId] = useState(events[0]?.id || "");
  const filtered = active === "Todos" ? events : events.filter((e) => e.sport === active);

  return (
    <div className="relative h-full w-full bg-secondary">
      <div className="absolute inset-0 grayscale invert opacity-30">
         <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1200" alt="Map Background" className="h-full w-full object-cover" />
      </div>
      <div className="relative z-20 flex flex-col gap-4 p-6 pt-12">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-1 items-center gap-3 rounded-2xl bg-accent px-4 py-3 border border-white/5 shadow-2xl">
            <Search size={20} className="text-zinc-500" />
            <input placeholder="Buscar deporte, zona…" className="w-full bg-transparent text-sm font-medium text-white outline-none placeholder:text-zinc-600" />
          </div>
          <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 border border-white/5 text-primary"><Bell size={22} /></button>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {sports.map((s) => (
            <button key={s} onClick={() => setActive(s)} className={`whitespace-nowrap rounded-xl px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-all ${active === s ? "bg-primary text-black shadow-pop" : "bg-zinc-900 text-zinc-500"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-[88px] z-30 px-4">
        <div className="rounded-3xl bg-zinc-900/90 p-4 backdrop-blur-2xl border border-white/5 shadow-2xl">
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {filtered.map((e) => (
              <div key={e.id} className="w-[85vw] flex-shrink-0 sm:w-72">
                <EventCard event={e} onClick={() => onSelect(e)} variant="compact" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
