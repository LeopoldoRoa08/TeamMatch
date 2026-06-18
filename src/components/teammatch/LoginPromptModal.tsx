import { Trophy, MapPin, Users, X, ArrowRight, Zap } from "lucide-react";
import { useSettings } from "@/lib/SettingsContext";

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  onRegister: () => void;
  /** Contexto de la acción que disparó el modal. Ej: "unirte al partido", "comentar" */
  actionContext?: string;
}

export function LoginPromptModal({
  isOpen,
  onClose,
  onLogin,
  onRegister,
  actionContext = "realizar esta acción",
}: LoginPromptModalProps) {
  const { t } = useSettings();
  if (!isOpen) return null;

  const defaultAction = t("loginPrompt.defaultAction") || "realizar esta acción";
  const finalContext = actionContext === "realizar esta acción" ? defaultAction : actionContext;

  const perks = [
    { icon: MapPin, text: t("loginPrompt.perk1") || "Únete a partidos cerca de ti" },
    { icon: Users, text: t("loginPrompt.perk2") || "Crea eventos y arma tu equipo" },
    { icon: Trophy, text: t("loginPrompt.perk3") || "Gana XP y desbloquea recompensas" },
    { icon: Zap, text: t("loginPrompt.perk4") || "Matchmaking por nivel y deporte" },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-[9999] flex justify-center animate-in slide-in-from-bottom duration-300">
        <div className="w-full max-w-md rounded-t-3xl bg-[#0f1117] border border-white/10 shadow-2xl overflow-hidden">

          {/* Handle bar */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="h-1 w-10 rounded-full bg-white/20" />
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 grid h-8 w-8 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition-colors active:scale-95"
            aria-label="Cerrar"
          >
            <X size={14} className="text-white/70" />
          </button>

          <div className="px-6 pb-8 pt-2 space-y-5">
            {/* Header */}
            <div className="text-center space-y-2 pt-2">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#32CD32] to-[#22a822] shadow-lg shadow-green-500/25 mx-auto">
                <span className="text-3xl">⚽</span>
              </div>
              <h2 className="text-xl font-black text-white leading-tight">
                {t("loginPrompt.joinTo") ? t("loginPrompt.joinTo").replace("{action}", finalContext) : `¡Únete para ${finalContext}!`}
              </h2>
              <p className="text-sm text-white/60 leading-relaxed max-w-[280px] mx-auto">
                {t("loginPrompt.subtitle") || "Crea tu cuenta gratis y accede a todos los partidos y canchas de Caracas."}
              </p>
            </div>

            {/* Perks list */}
            <div className="rounded-2xl bg-white/5 border border-white/8 divide-y divide-white/5">
              {perks.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 px-4 py-3">
                  <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#32CD32]/15">
                    <Icon size={14} className="text-[#32CD32]" />
                  </div>
                  <span className="text-sm font-medium text-white/80">{text}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="space-y-2.5">
              <button
                id="login-prompt-register-btn"
                onClick={onRegister}
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#32CD32] to-[#22a822] py-4 text-sm font-black text-[#0f1117] shadow-lg shadow-green-500/25 transition-all active:scale-[0.98] hover:shadow-green-500/40"
              >
                {t("loginPrompt.createFree") || "Crear Cuenta Gratis"}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
              <button
                id="login-prompt-login-btn"
                onClick={onLogin}
                className="w-full rounded-2xl border border-white/15 bg-white/5 py-3.5 text-sm font-bold text-white/80 transition-all hover:bg-white/10 active:scale-[0.98]"
              >
                {t("loginPrompt.hasAccount") || "Ya tengo cuenta — Iniciar Sesión"}
              </button>
            </div>

            {/* Dismiss */}
            <button
              onClick={onClose}
              className="w-full text-center text-xs text-white/30 hover:text-white/50 transition-colors py-1"
            >
              {t("loginPrompt.notNow") || "Ahora no, seguir explorando"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
