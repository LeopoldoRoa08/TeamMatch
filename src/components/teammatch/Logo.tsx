import { Trophy } from "lucide-react";

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="grid place-items-center rounded-xl gradient-primary shadow-pop"
        style={{ width: size, height: size }}
      >
        <Trophy className="text-secondary" style={{ width: size * 0.55, height: size * 0.55 }} strokeWidth={2.5} />
      </div>
      <span className="font-bold tracking-tight text-secondary" style={{ fontSize: size * 0.65 }}>
        Teammatch
      </span>
    </div>
  );
}
