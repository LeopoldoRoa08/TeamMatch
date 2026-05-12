import { Clock, MapPin, Users } from 'lucide-react';
import { SportEvent } from '../types';
import { SportBadge } from './SportBadge';
import { motion } from 'motion/react';

export function EventCard({ event, onClick, variant = "full" }: { event: SportEvent; onClick?: () => void; variant?: "full" | "compact" }) {
  const pct = (event.joined / event.spots) * 100;
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`group relative flex w-full flex-col overflow-hidden rounded-2xl bg-accent text-left shadow-soft transition-all hover:bg-zinc-800 ${variant === 'compact' ? 'h-48' : ''}`}
    >
      <div className={`relative w-full ${variant === 'compact' ? 'h-24' : 'h-40'}`}>
        <img src={event.image} alt={event.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-accent/90 to-transparent" />
        <div className="absolute top-3 left-3"><SportBadge sport={event.sport} /></div>
        <div className="absolute top-3 right-3 rounded-full bg-black/50 px-2 py-1 text-[11px] font-bold text-white backdrop-blur-md">
          {event.price === 0 ? "GRATIS" : `$${event.price}`}
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{event.date}</div>
          <div className="font-display text-base font-bold text-white line-clamp-1 leading-tight">{event.title}</div>
        </div>
      </div>
      <div className="flex-1 p-3 flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs font-medium text-zinc-300">
          <span className="flex items-center gap-1"><Clock size={12} className="text-primary" /> {event.time}</span>
          <span className="flex items-center gap-1"><MapPin size={12} className="text-primary" /> {event.zone}</span>
        </div>
        {variant === "full" && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Cupos</span>
              <span className="text-[10px] font-bold text-white flex items-center gap-1"><Users size={10} className="text-primary" /> {event.joined}/{event.spots}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
              <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} className="h-full gradient-primary" />
            </div>
          </div>
        )}
      </div>
    </motion.button>
  );
}
