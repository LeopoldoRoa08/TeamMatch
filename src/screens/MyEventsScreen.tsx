import { useState } from 'react';
import { SportEvent } from '../types';
import { EventCard } from '../components/EventCard';
import { motion, AnimatePresence } from 'motion/react';

const tabs = ["Próximos", "Solicitudes", "Historial"] as const;

export function MyEventsScreen({ onSelect, events }: { onSelect: (e: SportEvent) => void; events: SportEvent[] }) {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Próximos");
  
  return (
    <div className="h-full w-full bg-secondary overflow-hidden">
      <div className="p-6 pt-12 space-y-6">
        <h1 className="font-display text-4xl font-bold tracking-tight text-white">Mis Partidos</h1>
        <div className="flex bg-black/40 rounded-2xl p-1 border border-white/5">
          {tabs.map((t) => {
            const active = tab === t;
            return (
              <button key={t} onClick={() => setTab(t)} className="relative flex-1 py-3 text-[10px] font-bold uppercase tracking-widest outline-none">
                <span className={`relative z-10 transition-colors ${active ? 'text-black' : 'text-zinc-500'}`}>{t}</span>
                {active && <motion.div layoutId="tab-active" className="absolute inset-0 bg-primary rounded-xl" />}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-6 pb-32 no-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="space-y-4">
            {events.filter(e => e.joined > 0).map((e) => <EventCard key={e.id} event={e} onClick={() => onSelect(e)} />)}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
