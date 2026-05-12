import React, { useState } from 'react';
import { ArrowLeft, MapPin, Calendar, Clock, Users, DollarSign } from 'lucide-react';

const sports = ["Running", "Senderismo", "Pádel", "Vóleibol", "Tenis"];
const levels = ["Principiante", "Intermedio", "Avanzado"];

export function CreateEventScreen({ onClose }: { onClose: () => void }) {
  const [sport, setSport] = useState("Running");
  const [level, setLevel] = useState("Intermedio");

  return (
    <div className="flex h-full flex-col bg-secondary text-white overflow-hidden">
      <div className="flex items-center gap-4 p-6 pt-12">
        <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent border border-white/5 text-primary"><ArrowLeft size={20} /></button>
        <h1 className="font-display text-xl font-bold tracking-tight">Nuevo evento</h1>
      </div>
      <div className="flex-1 overflow-y-auto px-6 space-y-8 pb-32 no-scrollbar">
        <Section title="Deporte">
          <div className="flex gap-2 overflow-x-auto no-scrollbarpb-2">
            {sports.map((s) => <button key={s} onClick={() => setSport(s)} className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest ${sport === s ? "bg-primary text-black" : "bg-accent text-zinc-500"}`}>{s}</button>)}
          </div>
        </Section>
        <Section title="Nombre del evento">
          <input placeholder="Ej: Pickup amistoso" className="w-full rounded-2xl bg-accent p-4 text-sm font-bold text-white outline-none" />
        </Section>
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-secondary/80 backdrop-blur-xl">
        <button onClick={onClose} className="w-full rounded-2xl gradient-primary py-4 text-sm font-bold text-black shadow-pop">PUBLICAR EVENTO</button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="space-y-4"><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{title}</label>{children}</div>;
}
