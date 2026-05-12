import { Trophy } from 'lucide-react';

export function Logo({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex aspect-square items-center justify-center rounded-lg gradient-primary shadow-pop" style={{ width: size, height: size }}>
        <Trophy className="text-black" size={size * 0.6} strokeWidth={2.5} />
      </div>
      <span className="font-display font-bold tracking-tight text-secondary-foreground" style={{ fontSize: size * 0.8 }}>
        Teammatch
      </span>
    </div>
  );
}
