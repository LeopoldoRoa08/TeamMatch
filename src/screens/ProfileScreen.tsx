import { Settings, LogOut, ChevronRight, Star, Heart, MapPin } from 'lucide-react';

export function ProfileScreen() {
  return (
    <div className="h-full w-full bg-secondary text-white overflow-y-auto no-scrollbar pb-32">
      <div className="relative p-6 pt-16 flex flex-col items-center gap-6">
        <div className="relative">
          <div className="h-28 w-28 overflow-hidden rounded-3xl border-4 border-zinc-900 shadow-pop">
            <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200" className="h-full w-full object-cover" />
          </div>
          <div className="absolute -bottom-2 -right-2 rounded-xl bg-primary px-2 py-1 text-[10px] font-black text-black">MVP</div>
        </div>
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold tracking-tight">Alejandro Reyes</h1>
          <p className="flex items-center justify-center gap-1 text-xs text-zinc-500"><MapPin size={12} className="text-primary" /> Caracas, Venezuela</p>
        </div>
      </div>
      <div className="px-6 space-y-6">
        <div className="grid grid-cols-3 gap-2">
          <Stat value="4.9" label="Rating" icon={Star} color="text-yellow-400" />
          <Stat value="24" label="Partidos" icon={ChevronRight} color="text-primary" />
          <Stat value="8" label="Medallas" icon={Heart} color="text-red-500" />
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label, icon: Icon, color }: { value: string; label: string; icon: any; color: string }) {
  return <div className="flex flex-col items-center justify-center rounded-2xl bg-accent p-4 border border-white/5"><span className={`text-lg font-black ${color}`}>{value}</span><span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{label}</span></div>;
}
