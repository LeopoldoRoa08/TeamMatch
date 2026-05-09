import { useState } from "react";
import { ArrowLeft, MapPin, Calendar, Clock, Users, DollarSign } from "lucide-react";
import mapImg from "@/assets/caracas-map.jpg";

const sports = ["Running", "Senderismo", "Pádel", "Vóleibol", "Tenis"];
const levels = ["Principiante", "Intermedio", "Avanzado"];

export function CreateEventScreen({ onClose }: { onClose: () => void }) {
  const [sport, setSport] = useState("Running");
  const [level, setLevel] = useState("Intermedio");

  return (
    <div className="h-full overflow-y-auto bg-background pb-24">
      <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background px-4 pb-3 pt-12">
        <button
          onClick={onClose}
          className="grid h-10 w-10 place-items-center rounded-full bg-muted"
        >
          <ArrowLeft size={18} className="text-secondary" />
        </button>
        <h1 className="text-lg font-bold text-secondary">Nuevo evento</h1>
      </div>

      <div className="space-y-5 px-5 py-5">
        {/* Sport */}
        <Section title="Deporte">
          <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {sports.map((s) => (
              <button
                key={s}
                onClick={() => setSport(s)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                  sport === s
                    ? "gradient-primary text-secondary shadow-pop"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </Section>

        {/* Title */}
        <Section title="Nombre del evento">
          <input
            defaultValue="Pickup amistoso"
            className="w-full rounded-2xl border border-border bg-card px-4 py-3.5 text-sm font-medium text-secondary outline-none focus:border-primary"
          />
        </Section>

        {/* Location with mini map */}
        <Section title="Ubicación">
          <div className="overflow-hidden rounded-2xl border border-border shadow-soft">
            <div className="relative h-36 w-full">
              <img src={mapImg} alt="Ubicación" className="h-full w-full object-cover" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
                <div className="grid h-10 w-10 place-items-center rounded-full gradient-primary shadow-pop ring-4 ring-card">
                  <MapPin size={18} className="text-secondary" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-card p-3">
              <MapPin size={14} className="text-primary" />
              <div className="text-sm font-semibold text-secondary">
                Cancha El Bosque, Chacao
              </div>
            </div>
          </div>
        </Section>

        {/* Date / Time */}
        <div className="grid grid-cols-2 gap-3">
          <Field icon={Calendar} label="Fecha" value="Sáb, 10 May" />
          <Field icon={Clock} label="Hora" value="18:00" />
        </div>

        {/* Spots / Price */}
        <div className="grid grid-cols-2 gap-3">
          <Field icon={Users} label="Cupos" value="14 jugadores" />
          <Field icon={DollarSign} label="Aporte" value="$8 USD" />
        </div>

        {/* Level */}
        <Section title="Nivel">
          <div className="grid grid-cols-3 gap-2">
            {levels.map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={`rounded-xl py-2.5 text-xs font-semibold transition-all ${
                  level === l
                    ? "bg-secondary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </Section>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 glass border-t border-border px-5 py-4">
        <button
          onClick={onClose}
          className="w-full rounded-2xl gradient-primary py-3.5 text-sm font-bold text-secondary shadow-pop"
        >
          Publicar evento
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
        {title}
      </label>
      {children}
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3 shadow-soft">
      <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase text-muted-foreground">
        <Icon size={12} /> {label}
      </div>
      <div className="text-sm font-bold text-secondary">{value}</div>
    </div>
  );
}
