import { Sport } from "../types";

const sportMap: Record<Sport, { bg: string; icon: string }> = {
  Running: { bg: "bg-primary text-black", icon: "🏃" },
  Senderismo: { bg: "bg-emerald-500 text-white", icon: "🥾" },
  Pádel: { bg: "bg-blue-500 text-white", icon: "🎾" },
  Tenis: { bg: "bg-yellow-400 text-black", icon: "🎾" },
  Vóleibol: { bg: "bg-orange-500 text-white", icon: "🏐" },
};

export function SportBadge({ sport, withEmoji = true, className = "" }: { sport: Sport; withEmoji?: boolean; className?: string }) {
  const m = sportMap[sport] || { bg: "bg-zinc-800 text-white", icon: "⚽" };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${m.bg} ${className}`}>
      {withEmoji && <span>{m.icon}</span>}
      {sport}
    </span>
  );
}
