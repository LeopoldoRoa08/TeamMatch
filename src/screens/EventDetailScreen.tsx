import { ArrowLeft, Share2, Calendar, Clock, MapPin, Users, Star, CheckCircle2 } from 'lucide-react';
import { SportEvent } from '../types';
import { SportBadge } from '../components/SportBadge';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function EventDetailScreen({ event, onBack, onJoin }: { event: SportEvent; onBack: () => void; onJoin: (id: string) => void; }) {
  const [isJoined, setIsJoined] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [attendees, setAttendees] = useState<{initials: string}[]>([]);

  useEffect(() => {
    async function loadAttendees() {
      try {
        const { data, error } = await supabase.from('attendees').select('user_initials').eq('event_id', event.id).order('created_at', { ascending: true });
        if (!error && data) {
          setAttendees(data.map(a => ({ initials: a.user_initials })));
          if (data.some(a => a.user_initials === 'AR')) setIsJoined(true);
        }
      } catch (e) { console.warn('Supabase loading failed', e); }
    }
    loadAttendees();
  }, [event.id]);

  const playersList = attendees.length > 0 ? attendees : Array.from({ length: event.joined }).map((_, i) => ({ initials: "??", }));
  const empty = event.spots - playersList.length;
  const isFull = playersList.length >= event.spots;

  const handleJoinClick = async () => {
    if (isJoined || isFull) return;
    setIsJoining(true);
    try {
      const { data: latest } = await supabase.from('events').select('joined, spots').eq('id', event.id).single();
      if (latest && latest.joined < latest.spots) {
        await supabase.from('events').update({ joined: latest.joined + 1 }).eq('id', event.id);
        await supabase.from('attendees').insert({ event_id: event.id, user_name: 'Alejandro Reyes', user_initials: 'AR' });
        setIsJoined(true);
        onJoin(event.id);
      } else { alert("Evento lleno"); }
    } catch (err) { console.error(err); } finally { setIsJoining(false); }
  };

  return (
    <div className="relative h-full w-full bg-secondary text-white overflow-y-auto pb-32 no-scrollbar">
      <div className="relative h-[40vh] w-full">
        <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
        <div className="absolute top-12 left-6 right-6 flex justify-between">
          <button onClick={onBack} className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/30 text-primary backdrop-blur-md"><ArrowLeft size={20} /></button>
        </div>
      </div>
      <div className="p-6 space-y-8">
        <h1 className="font-display text-3xl font-bold tracking-tight text-white">{event.title}</h1>
        <div className="grid grid-cols-2 gap-4">
          <InfoTile icon={Calendar} label="Fecha" value={event.date} />
          <InfoTile icon={Users} label="Cupos" value={`${playersList.length}/${event.spots}`} />
        </div>
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Jugadores</h3>
          <div className="flex flex-wrap gap-3">
            <AnimatePresence>
              {playersList.map((p, i) => (
                <motion.div key={i} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`flex h-11 w-11 items-center justify-center rounded-xl font-bold ${p.initials === "AR" ? "bg-primary text-black" : "bg-zinc-800 text-zinc-300"}`}>{p.initials}</motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-secondary/80 backdrop-blur-xl">
        <motion.button onClick={handleJoinClick} disabled={isFull || isJoining || isJoined} className={`w-full rounded-2xl py-4 text-sm font-bold flex items-center justify-center gap-2 ${isJoined ? "bg-emerald-500 text-white" : isFull ? "bg-zinc-800 text-zinc-500" : "bg-white text-black"}`}>
          {isJoining ? "Uniéndote..." : isJoined ? "¡UNIDO EXITOSAMENTE!" : isFull ? "LLENO" : "SOLICITAR UNIRME"}
        </motion.button>
      </div>
    </div>
  );
}
function InfoTile({ icon: Icon, label, value }: { icon: any; label: string; value: string; }) {
  return <div className="rounded-2xl border border-white/5 bg-accent p-4"><div className="text-[10px] text-zinc-600 uppercase mb-1">{label}</div><div className="text-xs font-bold">{value}</div></div>;
}
