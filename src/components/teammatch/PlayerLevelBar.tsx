import { usePlayerLevel } from "@/hooks/usePlayerLevel";
import { Zap } from "lucide-react";

interface PlayerLevelBarProps {
  initialEventsCount?: number;
}

export function PlayerLevelBar({ initialEventsCount = 0 }: PlayerLevelBarProps) {
  const {
    level,
    experience,
    xpNextLevel,
    progressPercentage,
    addExperience,
  } = usePlayerLevel(initialEventsCount);

  return (
    <div className="rounded-2xl bg-card border border-border/60 p-4 shadow-soft">
      <div className="flex items-center gap-4">
        {/* IZQUIERDA: Círculo estilizado (Badge) Neon */}
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-secondary text-primary-foreground shadow-[0_0_15px_rgba(50,205,50,0.4)] ring-4 ring-primary/30 transition-transform duration-300 hover:scale-105">
          <div className="flex flex-col items-center justify-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#32CD32] opacity-80 leading-none">LVL</span>
            <span className="text-xl font-black text-white leading-none mt-0.5">{level}</span>
          </div>
          {/* Destello decorativo */}
          <div className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full bg-primary flex items-center justify-center animate-pulse">
            <Zap size={8} className="text-secondary" />
          </div>
        </div>

        {/* DERECHA: Barra de progreso y texto */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-secondary tracking-tight">Rango de Jugador</span>
            <button
              onClick={() => addExperience(50)}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-black text-primary transition-all hover:bg-primary/20 active:scale-90"
              title="Asistir a partido (+50 XP)"
            >
              +50 XP
            </button>
          </div>

          {/* Barra de progreso */}
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-800 border border-gray-700/50">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#32CD32] to-[#00FF7F] transition-all duration-500 ease-out shadow-[0_0_10px_rgba(50,205,50,0.6)]"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Detalles de XP */}
          <div className="mt-1 flex items-center justify-between text-[10px]">
            <span className="font-semibold text-muted-foreground">
              {experience} <span className="text-muted-foreground/50">/</span> {xpNextLevel} XP
            </span>
            <span className="font-bold text-[#32CD32] bg-[#32CD32]/10 px-1.5 py-0.25 rounded-full">
              {progressPercentage}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
