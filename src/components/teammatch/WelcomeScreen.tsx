import { MapPin, Users, Trophy, ArrowRight } from "lucide-react";
import { Logo } from "./Logo";
import caracasMap from "@/assets/caracas-map.jpg";

export function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="relative h-full w-full overflow-hidden gradient-dark text-secondary-foreground">
      {/* Background map */}
      <div className="absolute inset-0 opacity-25">
        <img src={caracasMap} alt="Mapa de Caracas" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/40 via-secondary/70 to-secondary" />
      </div>

      {/* Floating glows */}
      <div className="absolute -top-20 -left-16 h-64 w-64 rounded-full bg-primary/30 blur-3xl" />
      <div className="absolute bottom-32 -right-20 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />

      <div className="relative flex h-full flex-col px-7 pt-14 pb-8">
        <div className="flex justify-center">
          <Logo size={32} />
        </div>

        <div className="mt-12 flex flex-1 flex-col">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Disponible en Caracas
          </span>

          <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight">
            Tu próximo
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              partido te espera.
            </span>
          </h1>
          <p className="mt-4 max-w-[300px] text-sm leading-relaxed text-secondary-foreground/70">
            Encuentra eventos deportivos cerca de ti, únete con un toque o crea el tuyo y arma equipo.
          </p>

          <div className="mt-8 space-y-3">
            {[
              { icon: MapPin, title: "Mapa en vivo", desc: "Eventos cerca en tiempo real" },
              { icon: Users, title: "Únete fácil", desc: "Solicita un cupo en segundos" },
              { icon: Trophy, title: "Por nivel", desc: "Juega con gente a tu altura" },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex items-center gap-3 rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-3 backdrop-blur-sm"
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl gradient-primary shadow-pop">
                  <Icon className="h-5 w-5 text-secondary" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{title}</div>
                  <div className="text-xs text-secondary-foreground/60">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <button
            onClick={onStart}
            className="group flex w-full items-center justify-center gap-2 rounded-2xl gradient-primary py-4 text-base font-bold text-secondary shadow-pop transition active:scale-[0.98]"
          >
            Empezar a jugar
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
          </button>
          <button
            onClick={onStart}
            className="w-full rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 py-3 text-sm font-medium text-secondary-foreground/80"
          >
            Ya tengo cuenta
          </button>
          <p className="pt-1 text-center text-[11px] text-secondary-foreground/40">
            Al continuar aceptas los Términos y la Política de Privacidad
          </p>
        </div>
      </div>
    </div>
  );
}
