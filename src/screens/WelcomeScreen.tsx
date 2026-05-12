import { ArrowRight, MapPin, Users, Trophy } from 'lucide-react';
import { Logo } from '../components/Logo';
import { motion } from 'motion/react';

export function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-secondary text-white">
      <div className="absolute inset-0 opacity-40">
        <img src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=1200" alt="Sports Background" className="h-full w-full object-cover grayscale" />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary via-secondary/80 to-secondary" />
      </div>
      <div className="relative flex h-full flex-col justify-between p-8 pt-16">
        <Logo size={40} className="self-center" />
        <div className="space-y-8">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" /> Disponible en Caracas
            </span>
            <h1 className="font-display text-5xl font-bold leading-[0.9] tracking-tighter sm:text-6xl">
              TU PRÓXIMO<br /><span className="text-primary">PARTIDO</span> TE ESPERA.
            </h1>
            <p className="mt-6 text-sm leading-relaxed text-zinc-400 max-w-[280px]">
              Encuentra eventos deportivos cerca de ti, únete con un toque o crea el tuyo y arma equipo.
            </p>
          </motion.div>
        </div>
        <motion.button onClick={onStart} className="flex w-full items-center justify-center gap-3 rounded-2xl gradient-primary py-4 text-sm font-bold text-black shadow-pop">
          EMPEZAR A JUGAR <ArrowRight size={20} strokeWidth={3} />
        </motion.button>
      </div>
    </div>
  );
}
