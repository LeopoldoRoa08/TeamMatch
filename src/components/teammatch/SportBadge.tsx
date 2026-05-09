import type { Sport } from "./types";

const map: Record<Sport, { bg: string; label: string }> = {
  Running: { bg: "bg-primary text-secondary", label: "🏃" },
  Senderismo: { bg: "bg-accent text-secondary", label: "🥾" },
  Pádel: { bg: "bg-secondary text-primary-foreground", label: "🎾" },
  Tenis: { bg: "bg-warning text-warning-foreground", label: "🎾" },
  Vóleibol: { bg: "bg-chart-3 text-secondary-foreground", label: "🏐" },
};

export function SportBadge({ sport, withEmoji = true }: { sport: Sport; withEmoji?: boolean }) {
  const m = map[sport];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${m.bg}`}>
      {withEmoji && <span>{m.label}</span>}
      {sport}
    </span>
  );
}
