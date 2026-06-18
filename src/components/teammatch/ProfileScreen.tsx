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
  ArrowRight,
  MapPin,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useCurrentUser } from "@/lib/UserContext";
import { SettingsModal } from "./SettingsModal";
import { ACHIEVEMENTS, type Achievement } from "./achievementsData";

export function ProfileScreen({
  onEdit,
  onSelectEvent,
  onOpenAuth,
  onOpenRegister,
}: {
  onEdit?: () => void;
  onSelectEvent?: (e: any) => void;
  onOpenAuth?: () => void;
  onOpenRegister?: () => void;
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
    carisma,
    unlockedAchievements,
  } = useCurrentUser();

  const [activeTab, setActiveTab] = useState<"stats" | "inventory" | "history" | "achievements">("stats");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showClaimSuccess, setShowClaimSuccess] = useState<{ title: string; discount: string } | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const handleLogout = async () => {
    const { supabase } = await import("@/lib/supabase");
    await supabase.auth.signOut();
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const unlockedCount = unlockedAchievements ? unlockedAchievements.length : 0;
  const completionPercentage = ACHIEVEMENTS.length > 0 
    ? Math.round((unlockedCount / ACHIEVEMENTS.length) * 100) 
    : 0;

  const platinumCount = unlockedAchievements ? ACHIEVEMENTS.filter(a => a.rarity === "platinum" && unlockedAchievements.includes(a.id)).length : 0;
  const goldCount = unlockedAchievements ? ACHIEVEMENTS.filter(a => a.rarity === "gold" && unlockedAchievements.includes(a.id)).length : 0;
  const silverCount = unlockedAchievements ? ACHIEVEMENTS.filter(a => a.rarity === "silver" && unlockedAchievements.includes(a.id)).length : 0;
  const bronzeCount = unlockedAchievements ? ACHIEVEMENTS.filter(a => a.rarity === "bronze" && unlockedAchievements.includes(a.id)).length : 0;

  const renderAchievementProgress = (ach: Achievement, isUnlocked: boolean) => {
    if (isUnlocked) return null;
    
    let current = 0;
    let target = 1;
    
    switch (ach.id) {
      case "primer_paso":
        current = joinedEventsCount;
        target = 1;
        break;
      case "creador_leyendas":
        current = createdEventsCount;
        target = 1;
        break;
      case "fidelidad_hierro":
        current = useCount;
        target = 5;
        break;
      case "gran_carisma":
        current = carisma;
        target = 3;
        break;
      case "viajero_deporte":
        current = joinedEventsCount;
        target = 3;
        break;
      case "nivel_heroe":
        current = level;
        target = 5;
        break;
      default:
        return null;
    }
    
    const percentage = Math.min(100, Math.max(0, (current / target) * 100));
    
    return (
      <div className="w-full mt-1.5 space-y-1">
        <div className="flex justify-between text-[8px] font-black text-white/40">
          <span>Progreso</span>
          <span>{current} / {target}</span>
        </div>
        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden border border-white/5">
          <div 
            className="h-full bg-primary/70 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  if (!user) {
    return (
      <div className="h-full overflow-y-auto bg-background">
        {/* Hero degradado */}
        <div className="relative bg-gradient-to-br from-[#0f1117] via-[#0f1117] to-[#1a2a1a] px-6 pb-20 pt-14 text-center overflow-hidden">
          {/* Glows decorativos */}
          <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 h-56 w-56 rounded-full bg-[#32CD32]/15 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 -right-10 h-40 w-40 rounded-full bg-[#32CD32]/10 blur-2xl" />

          {/* Avatar genérico animado */}
          <div className="relative inline-flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#32CD32] to-[#22a822] shadow-2xl shadow-green-500/30 ring-4 ring-[#32CD32]/20 mx-auto">
            <span className="text-4xl">🏟️</span>
            <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#0f1117] ring-2 ring-[#32CD32]/30">
              <span className="text-base">❓</span>
            </div>
          </div>

          <h1 className="mt-5 text-2xl font-black text-white">Perfil de Invitado</h1>
          <p className="mt-1.5 text-sm text-white/50 max-w-[260px] mx-auto">
            Explora la app libremente. Crea tu cuenta para desbloquear todo.
          </p>
        </div>

        {/* Tarjeta principal */}
        <div className="px-5 -mt-10 space-y-4">
          {/* Caja Únete a la comunidad */}
          <div className="rounded-3xl bg-card border border-border shadow-pop overflow-hidden">
            <div className="px-5 py-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#32CD32]/15">
                  <Sparkles size={18} className="text-[#32CD32] animate-pulse" />
                </div>
                <div>
                  <h2 className="text-base font-black text-secondary">Únete a la comunidad</h2>
                  <p className="text-[11px] text-muted-foreground">Accede a todo TeamMatch gratis</p>
                </div>
              </div>

              {/* Lista de beneficios */}
              <div className="space-y-2">
                {[
                  { icon: MapPin, text: "Encuentra partidos cerca de ti en tiempo real" },
                  { icon: Users, text: "Solicita un cupo y únete con un toque" },
                  { icon: Trophy, text: "Sube de nivel y gana recompensas exclusivas" },
                  { icon: Zap, text: "Matchmaking inteligente por nivel de juego" },
                  { icon: Star, text: "Crea tus propios eventos y arma equipo" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 rounded-xl bg-muted/50 px-3 py-2.5">
                    <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#32CD32]/15">
                      <Icon size={13} className="text-[#32CD32]" />
                    </div>
                    <span className="text-xs font-semibold text-secondary/80">{text}</span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="space-y-2 pt-1">
                <button
                  id="guest-profile-register-btn"
                  onClick={onOpenRegister}
                  className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#32CD32] to-[#22a822] py-4 text-sm font-black text-[#0f1117] shadow-pop shadow-green-500/20 transition-all active:scale-[0.98] hover:shadow-green-500/30"
                >
                  Crear Cuenta Gratis
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  id="guest-profile-login-btn"
                  onClick={onOpenAuth}
                  className="w-full rounded-2xl border border-border bg-muted/50 py-3.5 text-sm font-bold text-secondary transition-all hover:bg-muted active:scale-[0.98]"
                >
                  Ya tengo cuenta — Iniciar Sesión
                </button>
              </div>
            </div>

            {/* Estadisticas animadas como placeholders */}
            <div className="border-t border-border grid grid-cols-3 divide-x divide-border">
              {[
                { k: "1.2k", v: "Jugadores" },
                { k: "320", v: "Eventos/mes" },
                { k: "4.9★", v: "Rating" },
              ].map((s) => (
                <div key={s.v} className="flex flex-col items-center py-4">
                  <div className="text-lg font-black text-[#32CD32]">{s.k}</div>
                  <div className="text-[10px] font-semibold text-muted-foreground">{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Info extra */}
          <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-4 flex items-start gap-3">
            <Shield size={18} className="text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Tu cuenta es <strong className="text-secondary">100% gratuita</strong>. Puedes explorar el mapa, ver eventos y canchas sin necesidad de registrarte.
            </p>
          </div>
        </div>
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
  const cha = 10 + carisma;

  if (showClaimSuccess) {
    return (
      <div className="absolute inset-0 z-50 flex h-full flex-col items-center justify-center space-y-6 bg-background px-6 text-center animate-in fade-in zoom-in duration-500">
        <div className="absolute inset-0 sunburst-rays opacity-10 pointer-events-none" />
        <div className="grid h-24 w-24 place-items-center rounded-full bg-primary text-secondary shadow-pop ring-8 ring-primary/20 animate-bounce">
          <Check size={48} strokeWidth={3} className="text-secondary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-secondary uppercase tracking-wide">¡Objeto Canjeado! 💎</h2>
          <p className="text-sm font-bold text-primary">
            {showClaimSuccess.title}
          </p>
          <p className="text-xs text-muted-foreground max-w-[285px] mx-auto leading-relaxed">
            El beneficio de **{showClaimSuccess.discount}** ha sido activado con éxito para tu próxima reserva de cancha o partido.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-background pb-28">
      {/* Hero / RPG Avatar Section */}
      <div className="relative bg-background px-5 pb-6 pt-12 text-secondary">
        <div className="flex items-center justify-between">
          <button
            onClick={onEdit}
            className="grid h-10 w-10 place-items-center rounded-full bg-muted text-primary transition-transform active:scale-95"
          >
            <Edit3 size={16} />
          </button>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary shadow-soft">
            <Sparkles size={11} className="animate-pulse" /> Modo RPG Activo
          </div>
          <button 
            onClick={() => setShowSettings(true)}
            className="grid h-10 w-10 place-items-center rounded-full bg-muted text-secondary hover:bg-muted/80 transition-colors"
          >
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
              <h1 className="text-xl font-black text-secondary flex items-center justify-center sm:justify-start gap-2">
                {displayName}
                {user?.user_metadata?.is_organizer && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-amber-500 shadow-pop border border-amber-500/30">
                    <Star size={9} className="fill-amber-500 text-amber-500" /> Organizador
                  </span>
                )}
              </h1>
              <span
                className={`inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide w-fit mx-auto sm:mx-0 ${rarityColor}`}
              >
                {rarityLabel}
              </span>
            </div>
            
            <p className="text-xs text-muted-foreground font-semibold">{rpgClass}</p>
            <p className="text-[10px] text-muted-foreground/70">{email}</p>
          </div>
        </div>

        {/* Experiencia Progress Bar */}
        <div className="mt-8 space-y-1.5 bg-muted/50 p-3.5 rounded-2xl border border-border">
          <div className="flex items-center justify-between text-xs font-black text-secondary">
            <span className="flex items-center gap-1.5">
              <Trophy size={13} className="text-primary animate-pulse" /> Puntos de Experiencia
            </span>
            <span className="font-mono text-muted-foreground">{xp} / {xpNeeded} XP</span>
          </div>
          <div className="h-3.5 w-full rounded-full bg-muted shadow-inner overflow-hidden border border-border">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${xpPercentage}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[9px] text-muted-foreground font-semibold">
            <span>Nivel {level}</span>
            <span>+{xpNeeded - xp} XP para Nivel {level + 1}</span>
          </div>
        </div>

        {/* PlayStation-style Trophies Card (Clickable Banner) */}
        <div 
          onClick={() => setActiveTab("achievements")}
          className="mt-3.5 bg-card p-3.5 rounded-2xl border border-border hover:bg-muted/50 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-between shadow-soft select-none animate-fade-in"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-[#ffd700] via-[#c0c0c0] to-[#cd7f32] p-[1.5px] flex items-center justify-center shadow-md">
              <div className="h-full w-full rounded-full bg-background flex items-center justify-center text-lg">
                🏆
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-secondary">Logros Obtenidos</h4>
                <span className="text-[9px] font-black text-primary bg-primary/10 px-1.5 rounded-full border border-primary/20">
                  {unlockedCount} / {ACHIEVEMENTS.length}
                </span>
              </div>
              {/* PlayStation-style tiny trophy counters */}
              <div className="flex items-center gap-3 mt-1.5 text-[10px] font-bold text-muted-foreground">
                <span className="flex items-center gap-0.5">🏆 <span className="text-secondary">{platinumCount}</span></span>
                <span className="flex items-center gap-0.5">🥇 <span className="text-secondary">{goldCount}</span></span>
                <span className="flex items-center gap-0.5">🥈 <span className="text-secondary">{silverCount}</span></span>
                <span className="flex items-center gap-0.5">🥉 <span className="text-secondary">{bronzeCount}</span></span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <span className="text-xs font-black text-secondary">{completionPercentage}%</span>
              <p className="text-[8px] text-muted-foreground uppercase font-black tracking-wider">Progreso</p>
            </div>
            <ArrowRight size={13} className="text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs (RPG Character Sheet Style) */}
      <div className="px-5">
        <div className="grid grid-cols-4 gap-1 rounded-2xl bg-card p-1 shadow-pop border border-border">
          {[
            { id: "stats", label: "Stats", icon: Shield },
            { id: "achievements", label: "Logros", icon: Award },
            { id: "inventory", label: "Cofre", icon: Trophy },
            { id: "history", label: "Aventuras", icon: BookOpen },
          ].map((t) => {
            const ActiveIcon = t.icon;
            const isSelected = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex flex-col items-center gap-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-wide transition-all active:scale-95 ${
                  isSelected
                    ? "bg-secondary text-primary shadow-sm"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-secondary"
                }`}
              >
                <ActiveIcon size={13} className={isSelected ? "text-primary" : ""} />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabs Content */}
      <div className="mt-6 px-5">
        {/* TAB Logros */}
        {activeTab === "achievements" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Award size={14} className="text-primary" /> Lista de Logros y Trofeos
            </h3>
            
            <div className="grid gap-3">
              {ACHIEVEMENTS.map((ach) => {
                const isUnlocked = unlockedAchievements ? unlockedAchievements.includes(ach.id) : false;
                
                const rarityStyles = {
                  bronze: {
                    border: isUnlocked ? "border-[#cd7f32]/30" : "border-border/60",
                    glow: "from-[#a05a2c] to-[#cd7f32]",
                    rarityName: "Bronce 🥉",
                    color: "text-[#cd7f32]",
                  },
                  silver: {
                    border: isUnlocked ? "border-[#c0c0c0]/30" : "border-border/60",
                    glow: "from-[#718096] to-[#cbd5e0]",
                    rarityName: "Plata 🥈",
                    color: "text-[#cbd5e0]",
                  },
                  gold: {
                    border: isUnlocked ? "border-[#ffd700]/30" : "border-border/60",
                    glow: "from-[#d69e2e] to-[#ecc94b]",
                    rarityName: "Oro 🥇",
                    color: "text-[#ecc94b]",
                  },
                  platinum: {
                    border: isUnlocked ? "border-[#e5e4e2]/40 shadow-[0_0_10px_rgba(229,228,226,0.1)]" : "border-border/60",
                    glow: "from-[#4a5568] via-[#cbd5e0] to-[#e2e8f0]",
                    rarityName: "Platino 🏆",
                    color: "text-[#e5e4e2] font-black",
                  },
                };
                
                const style = rarityStyles[ach.rarity];
                
                return (
                  <div
                    key={ach.id}
                    className={`rounded-2xl p-3.5 border transition-all duration-300 flex items-center gap-3.5 bg-card ${style.border} ${
                      !isUnlocked ? "opacity-60 grayscale bg-muted/20" : "shadow-soft border-l-4"
                    }`}
                  >
                    <div className={`h-11 w-11 shrink-0 rounded-full p-[1.5px] bg-gradient-to-br ${
                      isUnlocked ? style.glow : "from-muted to-muted-foreground/30"
                    } flex items-center justify-center shadow-md relative`}>
                      <div className="h-full w-full rounded-full bg-[#0d0f14] flex items-center justify-center text-lg select-none">
                        {isUnlocked ? ach.icon : "🔒"}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs font-black text-secondary truncate">
                          {ach.title}
                        </h4>
                        <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-[#0d0f14]/5 ${style.color}`}>
                          {style.rarityName}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-normal pr-2">
                        {ach.description}
                      </p>
                      {renderAchievementProgress(ach, isUnlocked)}
                    </div>
                    
                    <div className="text-right shrink-0 flex flex-col justify-center">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                        isUnlocked 
                          ? "text-primary bg-primary/10 border-primary/20" 
                          : "text-muted-foreground bg-muted border-border"
                      }`}>
                        +{ach.xpReward} XP
                      </span>
                      <span className="text-[8px] text-muted-foreground font-semibold mt-1">
                        {isUnlocked ? "Obtenido" : "Bloqueado"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

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

            {/* Información Personal (Edad, Ubicación, Género, Deportes, Bio) */}
            <div className="rounded-2xl border border-border bg-card p-4 shadow-soft space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-secondary flex items-center gap-1.5 border-b border-border pb-2">
                <Sparkles size={14} className="text-primary animate-pulse" /> Información de Perfil
              </h4>
              
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-muted/40 p-2.5 rounded-xl border border-border/50">
                  <span className="text-[10px] text-muted-foreground block font-bold">Edad</span>
                  <span className="font-black text-secondary">{user.user_metadata?.age ? `${user.user_metadata.age} años` : "—"}</span>
                </div>
                <div className="bg-muted/40 p-2.5 rounded-xl border border-border/50">
                  <span className="text-[10px] text-muted-foreground block font-bold">Género</span>
                  <span className="font-black text-secondary">{user.user_metadata?.gender || "—"}</span>
                </div>
                <div className="bg-muted/40 p-2.5 rounded-xl border border-border/50">
                  <span className="text-[10px] text-muted-foreground block font-bold">Ubicación</span>
                  <span className="font-black text-secondary truncate block" title={user.user_metadata?.location || ""}>
                    {user.user_metadata?.location || "—"}
                  </span>
                </div>
              </div>

              {user.user_metadata?.description && (
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground font-bold">Sobre mí</span>
                  <p className="text-xs leading-relaxed text-secondary-foreground/80 bg-muted/20 p-3 rounded-xl border border-border/30">
                    {user.user_metadata.description}
                  </p>
                </div>
              )}

              {user.user_metadata?.preferred_sports && user.user_metadata.preferred_sports.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] text-muted-foreground font-bold block">Deportes favoritos</span>
                  <div className="flex flex-wrap gap-1.5">
                    {user.user_metadata.preferred_sports.map((sport: string) => (
                      <span key={sport} className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                        {sport}
                      </span>
                    ))}
                  </div>
                </div>
              )}
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
                                setShowClaimSuccess({ title: c.title, discount: c.discount });
                                setTimeout(() => setShowClaimSuccess(null), 3000);
                              }}
                              className="rounded-xl gradient-primary px-3 py-1.5 text-[10px] font-black text-secondary transition-all active:scale-95 shadow-sm cursor-pointer"
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

      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
        onLogout={handleLogout}
      />
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
