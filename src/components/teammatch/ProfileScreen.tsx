import {
  Settings,
  Trophy,
  Star,
  Edit3,
  LogOut,
  Loader2,
  Copy,
  Check,
  Shield,
  Flame,
  Zap,
  Sparkles,
  BookOpen,
  Award,
  Calendar,
} from "lucide-react";
import { useState } from "react";
import { useCurrentUser } from "@/lib/UserContext";

export function ProfileScreen({
  onEdit,
  onSelectEvent,
}: {
  onEdit?: () => void;
  onSelectEvent?: (e: any) => void;
}) {
  const {
    user,
    avatarUrl,
    displayName,
    xp,
    level,
    useCount,
    coupons,
    xpHistory,
    joinedEventsCount,
    createdEventsCount,
    claimCoupon,
  } = useCurrentUser();

  const [activeTab, setActiveTab] = useState<"stats" | "inventory" | "history">("stats");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleLogout = async () => {
    const { supabase } = await import("@/lib/supabase");
    await supabase.auth.signOut();
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (!user) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const email = user.email || "";
  const initials = displayName.substring(0, 2).toUpperCase();

  // RPG calculations
  const xpNeeded = level * 100;
  const xpPercentage = Math.min(100, Math.max(0, (xp / xpNeeded) * 100));

  let rpgClass = "Recluta Novato 👟";
  let borderClass = "neon-border-bronze";
  let rarityLabel = "Novato";
  let rarityColor = "text-amber-600 bg-amber-500/10 border-amber-500/20";

  if (level === 2) {
    rpgClass = "Aspirante Activo ⚡";
    borderClass = "neon-border-bronze";
    rarityLabel = "Común";
    rarityColor = "text-gray-400 bg-gray-500/10 border-gray-500/20";
  } else if (level === 3) {
    rpgClass = "Guerrero del Fitness 🏋️‍♂️";
    borderClass = "neon-border-silver";
    rarityLabel = "Raro";
    rarityColor = "text-blue-400 bg-blue-500/10 border-blue-500/20";
  } else if (level === 4) {
    rpgClass = "Maestro del Match 🏆";
    borderClass = "neon-border-gold";
    rarityLabel = "Épico";
    rarityColor = "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
  } else if (level >= 5) {
    rpgClass = "Leyenda de Caracas 🌟";
    borderClass = "neon-border-legendary";
    rarityLabel = "Legendario";
    rarityColor = "text-purple-400 bg-purple-500/10 border-purple-500/20";
  }

  // RPG stats
  const str = 10 + joinedEventsCount * 2;
  const wis = 10 + createdEventsCount * 5;
  const con = 10 + useCount;
  const cha = 10 + Math.round((user.user_metadata?.rating || 4.8) * 2);

  return (
    <div className="h-full overflow-y-auto bg-background pb-28">
      {/* Hero / RPG Avatar Section */}
      <div className="relative gradient-dark px-5 pb-24 pt-12 text-primary-foreground">
        <div className="flex items-center justify-between">
          <button
            onClick={onEdit}
            className="grid h-10 w-10 place-items-center rounded-full bg-card/10 text-primary transition-transform active:scale-95"
          >
            <Edit3 size={16} />
          </button>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary shadow-soft">
            <Sparkles size={11} className="animate-pulse" /> Modo RPG Activo
          </div>
          <button className="grid h-10 w-10 place-items-center rounded-full bg-card/10">
            <Settings size={16} />
          </button>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative shrink-0">
            {/* Level Badge Border */}
            <div className={`h-22 w-22 rounded-full overflow-hidden p-1 bg-card ${borderClass}`}>
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="h-full w-full rounded-full object-cover shadow-inner"
                />
              ) : (
                <div className="grid h-full w-full place-items-center rounded-full bg-secondary text-2xl font-black text-primary shadow-inner">
                  {initials}
                </div>
              )}
            </div>
            {/* Level floating Badge */}
            <div className="absolute -bottom-2 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary font-mono text-sm font-black text-secondary ring-2 ring-card shadow-pop">
              {level}
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1.5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h1 className="text-xl font-black text-white flex items-center justify-center sm:justify-start gap-2">
                {displayName}
              </h1>
              <span
                className={`inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide w-fit mx-auto sm:mx-0 ${rarityColor}`}
              >
                {rarityLabel}
              </span>
            </div>
            
            <p className="text-xs text-white/70 font-semibold">{rpgClass}</p>
            <p className="text-[10px] text-white/50">{email}</p>
          </div>
        </div>

        {/* Experiencia Progress Bar */}
        <div className="mt-8 space-y-1.5 bg-card/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between text-xs font-black text-white">
            <span className="flex items-center gap-1.5">
              <Trophy size={13} className="text-primary animate-pulse" /> Puntos de Experiencia
            </span>
            <span className="font-mono">{xp} / {xpNeeded} XP</span>
          </div>
          <div className="h-3.5 w-full rounded-full bar-xp-container shadow-inner">
            <div
              className="h-full rounded-full bar-xp-glowing transition-all duration-500 ease-out"
              style={{ width: `${xpPercentage}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[9px] text-white/60 font-semibold">
            <span>Nivel {level}</span>
            <span>+{xpNeeded - xp} XP para Nivel {level + 1}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs (RPG Character Sheet Style) */}
      <div className="px-5 -mt-8">
        <div className="grid grid-cols-3 gap-1 rounded-2xl bg-card p-1.5 shadow-pop border border-border">
          {[
            { id: "stats", label: "Hoja de Stats", icon: Shield },
            { id: "inventory", label: "Inventario", icon: Trophy },
            { id: "history", label: "Aventuras", icon: BookOpen },
          ].map((t) => {
            const ActiveIcon = t.icon;
            const isSelected = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex flex-col items-center gap-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 ${
                  isSelected
                    ? "bg-secondary text-primary shadow-sm"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-secondary"
                }`}
              >
                <ActiveIcon size={14} className={isSelected ? "text-primary" : ""} />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabs Content */}
      <div className="mt-6 px-5">
        {/* TAB 1: RPG Stats */}
        {activeTab === "stats" && (
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Award size={14} className="text-primary" /> Atributos del Jugador
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                icon={Flame}
                label="Fuerza (STR)"
                value={str}
                colorClass="text-red-500"
                bgClass="bg-red-500/5 border-red-500/10"
                description="Aumenta al unirte a partidos (+2 XP/partido)"
              />
              <StatCard
                icon={BookOpen}
                label="Sabiduría (WIS)"
                value={wis}
                colorClass="text-blue-500"
                bgClass="bg-blue-500/5 border-blue-500/10"
                description="Aumenta al crear partidos (+5 XP/partido)"
              />
              <StatCard
                icon={Shield}
                label="Constitución (CON)"
                value={con}
                colorClass="text-emerald-500"
                bgClass="bg-emerald-500/5 border-emerald-500/10"
                description="Aumenta con el uso diario de la app"
              />
              <StatCard
                icon={Sparkles}
                label="Carisma (CHA)"
                value={cha}
                colorClass="text-amber-500"
                bgClass="bg-amber-500/5 border-amber-500/10"
                description="Calculado según tu reputación deportiva"
              />
            </div>

            <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
              <h4 className="text-xs font-black uppercase tracking-wider text-secondary mb-1">
                Resumen de Campaña
              </h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Has completado **{joinedEventsCount} partidos** como luchador y has guiado a otros
                jugadores creando **{createdEventsCount} eventos**. Tu constancia te ha otorgado
                **{useCount} días de entrenamiento** activo.
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: Inventory / Rewards */}
        {activeTab === "inventory" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Trophy size={14} className="text-primary" /> Cofre de Objetos Mágicos
              </h3>
              <span className="text-[10px] font-bold text-muted-foreground">
                {coupons.filter((c) => !c.claimed).length} Activos
              </span>
            </div>

            {coupons.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center space-y-2 animate-fade-in">
                <div className="text-4xl">🎁</div>
                <h4 className="text-sm font-bold text-secondary">Cofre Vacío</h4>
                <p className="text-[11px] text-muted-foreground max-w-[240px] mx-auto">
                  No tienes cupones. ¡Organiza eventos (+25 XP), únete a partidos (+15 XP) o usa la app
                  diariamente para ganar cofres sorpresa!
                </p>
              </div>
            ) : (
              <div className="grid gap-3">
                {coupons.map((c: any) => {
                  const isLegendary = c.id === "LEYENDA5";
                  return (
                    <div
                      key={c.code}
                      className={`rounded-2xl p-4 transition-all shadow-soft flex flex-col justify-between magic-scroll ${
                        isLegendary ? "magic-scroll-legendary" : ""
                      } ${
                        c.claimed
                          ? "opacity-60 grayscale border-border bg-muted/30 pointer-events-none"
                          : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wider mb-2 ${
                              isLegendary
                                ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                                : "bg-amber-500/20 text-amber-500 border border-amber-500/30"
                            }`}
                          >
                            {isLegendary ? "Objeto Legendario ⭐" : "Objeto Épico 📜"}
                          </span>
                          <h4 className="text-xs font-black text-secondary">{c.title}</h4>
                          <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                            {c.description}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm font-black text-primary drop-shadow-sm">
                            {c.discount}
                          </div>
                          <div className="text-[9px] text-muted-foreground font-semibold mt-0.5">
                            {c.date}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3 pt-3.5 border-t border-dashed border-border/60">
                        <div className="font-mono text-[10px] font-black text-muted-foreground bg-muted px-2 py-1 rounded-lg">
                          Código: <span className="text-secondary select-all">{c.code}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleCopy(c.code)}
                            className="flex items-center gap-1 rounded-xl bg-card border border-border px-2.5 py-1.5 text-[10px] font-black text-secondary transition-all hover:bg-muted active:scale-95 shadow-sm"
                          >
                            {copiedCode === c.code ? (
                              <>
                                <Check size={11} className="text-emerald-500" />
                                <span>Copiado</span>
                              </>
                            ) : (
                              <>
                                <Copy size={11} />
                                <span>Copiar</span>
                              </>
                            )}
                          </button>
                          {!c.claimed ? (
                            <button
                              onClick={async () => {
                                await claimCoupon(c.code);
                                alert(
                                  "¡Objeto canjeado con éxito! 🏆 Disfruta de tu beneficio en el alquiler de canchas."
                                );
                              }}
                              className="rounded-xl gradient-primary px-3 py-1.5 text-[10px] font-black text-secondary transition-all active:scale-95 shadow-sm"
                            >
                              Canjear
                            </button>
                          ) : (
                            <span className="text-[10px] font-black text-muted-foreground px-2 py-1.5 bg-muted/80 rounded-xl">
                              Usado
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Adventure History */}
        {activeTab === "history" && (
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Calendar size={14} className="text-primary" /> Registro de Aventuras (XP Log)
            </h3>

            <div className="space-y-2">
              {xpHistory.length === 0 ? (
                <div className="text-center py-8 text-xs text-muted-foreground">
                  Aún no has ganado experiencia. ¡Explora el mapa y únete a un partido!
                </div>
              ) : (
                xpHistory.map((h: any) => {
                  let typeEmoji = "🎮";
                  let typeBg = "bg-purple-500/10 text-purple-500 border border-purple-500/20";
                  if (h.type === "join") {
                    typeEmoji = "👟";
                    typeBg = "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
                  } else if (h.type === "create") {
                    typeEmoji = "⚽";
                    typeBg = "bg-blue-500/10 text-blue-500 border border-blue-500/20";
                  } else if (h.type === "use") {
                    typeEmoji = "⚡";
                    typeBg = "bg-amber-500/10 text-amber-500 border border-amber-500/20";
                  }

                  return (
                    <div
                      key={h.id}
                      className="flex items-center justify-between rounded-2xl border border-border bg-card p-3 shadow-soft"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`grid h-8 w-8 place-items-center rounded-xl text-sm shrink-0 ${typeBg}`}
                        >
                          {typeEmoji}
                        </div>
                        <div>
                          <div className="text-xs font-black text-secondary leading-tight">
                            {h.title}
                          </div>
                          <div className="text-[9px] text-muted-foreground font-semibold mt-0.5">
                            {h.date}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {h.xp > 0 ? `+${h.xp} XP` : `0 XP`}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Logout */}
      <div className="px-5 pt-8">
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500/10 py-4 text-xs font-black uppercase tracking-wider text-red-500 transition-colors hover:bg-red-500/20"
        >
          <LogOut size={16} />
          Cerrar Sesión del Héroe
        </button>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  colorClass,
  bgClass,
  description,
}: {
  icon: any;
  label: string;
  value: number;
  colorClass: string;
  bgClass: string;
  description: string;
}) {
  return (
    <div className={`rounded-2xl border p-3 shadow-soft flex flex-col ${bgClass}`}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] font-black uppercase tracking-wide text-muted-foreground truncate">
          {label}
        </span>
        <Icon size={14} className={colorClass} />
      </div>
      <div className="text-xl font-black text-secondary leading-none my-1">{value}</div>
      <p className="text-[9px] text-muted-foreground leading-tight">{description}</p>
    </div>
  );
}
