import { Settings, Trophy, Star, Calendar, Edit3 } from "lucide-react";

const sports = [
  { name: "Running", level: "Avanzado", color: "gradient-primary" },
  { name: "Pádel", level: "Intermedio", color: "bg-accent text-secondary" },
  { name: "Senderismo", level: "Principiante", color: "bg-secondary text-primary-foreground" },
];

const stats = [
  { label: "Eventos", value: "32", icon: Calendar },
  { label: "Rating", value: "4.9", icon: Star },
  { label: "Trofeos", value: "7", icon: Trophy },
];

export function ProfileScreen() {
  return (
    <div className="h-full overflow-y-auto bg-background pb-24">
      {/* Hero */}
      <div className="relative gradient-dark px-5 pb-20 pt-12 text-primary-foreground">
        <div className="flex items-center justify-between">
          <button className="grid h-10 w-10 place-items-center rounded-full bg-card/10">
            <Edit3 size={16} />
          </button>
          <button className="grid h-10 w-10 place-items-center rounded-full bg-card/10">
            <Settings size={16} />
          </button>
        </div>
        <div className="mt-4 flex items-center gap-4">
          <div className="grid h-20 w-20 place-items-center rounded-full gradient-primary text-2xl font-bold text-secondary ring-4 ring-card/20">
            AR
          </div>
          <div>
            <h1 className="text-xl font-bold">Alejandro Reyes</h1>
            <p className="text-xs opacity-80">Caracas · Chacao</p>
            <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-primary/20 px-2 py-0.5 text-[11px] font-semibold text-primary">
              <Star size={11} className="fill-primary" /> Jugador verificado
            </div>
          </div>
        </div>
      </div>

      {/* Stats card */}
      <div className="-mt-12 px-5">
        <div className="grid grid-cols-3 gap-2 rounded-2xl bg-card p-4 shadow-pop">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="mx-auto mb-1 grid h-9 w-9 place-items-center rounded-xl bg-muted">
                <s.icon size={16} className="text-primary" />
              </div>
              <div className="text-lg font-bold text-secondary">{s.value}</div>
              <div className="text-[11px] text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sports */}
      <div className="px-5 pt-6">
        <h2 className="mb-3 text-sm font-bold text-secondary">Mis deportes</h2>
        <div className="space-y-2">
          {sports.map((s) => (
            <div
              key={s.name}
              className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-soft"
            >
              <div className={`grid h-11 w-11 place-items-center rounded-xl ${s.color}`}>
                <Trophy size={18} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-secondary">{s.name}</div>
                <div className="text-xs text-muted-foreground">Nivel {s.level}</div>
              </div>
              <div className="text-xs font-semibold text-primary">Editar</div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="px-5 pt-6">
        <h2 className="mb-3 text-sm font-bold text-secondary">Logros</h2>
        <div className="grid grid-cols-4 gap-2">
          {["🥇", "🔥", "⚡", "🏆", "⭐", "🎯", "💪", "🚀"].map((emoji, i) => (
            <div
              key={i}
              className="aspect-square rounded-2xl bg-muted text-center text-2xl shadow-soft grid place-items-center"
            >
              {emoji}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
