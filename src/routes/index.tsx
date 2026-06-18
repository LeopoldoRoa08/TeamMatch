import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { UserProvider, useCurrentUser } from "@/lib/UserContext";
import { SettingsProvider, useSettings } from "@/lib/SettingsContext";
import { Sparkles, CheckCircle2, XCircle, Zap, X, Award } from "lucide-react";
import { MapScreen } from "@/components/teammatch/MapScreen";
import { EventDetailScreen } from "@/components/teammatch/EventDetailScreen";
import { ProfileScreen } from "@/components/teammatch/ProfileScreen";
import { EditProfileScreen } from "@/components/teammatch/EditProfileScreen";
import { CanchaCommentsScreen } from "@/components/teammatch/CanchaCommentsScreen";

import { MyEventsScreen } from "@/components/teammatch/MyEventsScreen";
import { MySportsScreen } from "@/components/teammatch/MySportsScreen";
import { WelcomeScreen } from "@/components/teammatch/WelcomeScreen";
import { FriendsScreen } from "@/components/teammatch/FriendsScreen";
import { ClansScreen } from "@/components/teammatch/ClansScreen";
import { AuthScreen, type AuthMode } from "@/components/teammatch/AuthScreen";
import { BottomNav } from "@/components/teammatch/BottomNav";
import { Logo } from "@/components/teammatch/Logo";
import type { Screen } from "@/components/teammatch/types-nav";
import type { SportEvent } from "@/components/teammatch/types";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Teammatch — Encuentra tu próximo partido en Caracas" },
      {
        name: "description",
        content:
          "Teammatch conecta jugadores y organizadores de eventos deportivos en Caracas. Encuentra partidos cercanos en el mapa y únete en segundos.",
      },
    ],
  }),
});

type AppState = "checking" | "auth" | "app";

function Index() {
  return (
    <SettingsProvider>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </SettingsProvider>
  );
}

function AppContent() {
  const { isLoading } = useCurrentUser();
  const [appState, setAppState] = useState<AppState>("checking");
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  const [screen, setScreen] = useState<Screen>("events");
  const [selected, setSelected] = useState<SportEvent | null>(null);
  const [selectedCancha, setSelectedCancha] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Siempre va a "app" (con o sin sesión activa — Modo Invitado habilitado)
  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(() => {
      if (mounted) {
        setAppState("app");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Cuando se cierra sesión desde la app, volver a "app" como invitado
      // Cuando se inicia sesión, cerrar el AuthScreen y volver a "app"
      setAppState((prev) => {
        if (prev === "checking") return prev; // Prevenir condición de carrera inicial
        if (session) return "app";
        if (prev !== "auth") return "app";
        return prev;
      });
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /** Abre el flujo de autenticación desde cualquier pantalla */
  const openAuth = (mode: AuthMode = "login") => {
    setAuthMode(mode);
    setAppState("auth");
  };

  const openDetail = (e: SportEvent) => {
    setSelected(e);
    setScreen("detail");
  };

  const renderScreen = () => {
    if (appState === "auth") {
      return (
        <AuthScreen
          initialMode={authMode}
          onSuccess={() => setAppState("app")}
          onClose={() => setAppState("app")}
        />
      );
    }

    if (screen === "detail" && selected)
      return (
        <EventDetailScreen
          event={selected}
          onBack={() => setScreen("events")}
          userLocation={userLocation}
          onOpenAuth={() => openAuth("login")}
        />
      );
    if (screen === "events") return <MyEventsScreen onSelect={openDetail} onNavigateToProfile={() => setScreen("profile")} />;
    if (screen === "sports") return <MySportsScreen onSelectEvent={openDetail} onNavigateToProfile={() => setScreen("profile")} />;
    if (screen === "friends") return <FriendsScreen onNavigateToProfile={() => setScreen("profile")} onSelectEvent={openDetail} />;
    if (screen === "clans") return <ClansScreen onNavigateToProfile={() => setScreen("profile")} onSelectEvent={openDetail} />;
    if (screen === "editProfile") return <EditProfileScreen onBack={() => setScreen("profile")} />;
    if (screen === "profile")
      return (
        <ProfileScreen
          onEdit={() => setScreen("editProfile")}
          onSelectEvent={openDetail}
          onOpenAuth={() => openAuth("login")}
          onOpenRegister={() => openAuth("register")}
        />
      );
    if (screen === "comments" && selectedCancha)
      return (
        <CanchaCommentsScreen
          cancha={selectedCancha}
          onBack={() => setScreen("map")}
          onOpenAuth={() => openAuth("login")}
        />
      );
    return (
      <MapScreen
        onSelect={openDetail}
        userLocation={userLocation}
        setUserLocation={setUserLocation}
        onNavigateToProfile={() => setScreen("profile")}
        onNavigateToComments={(cancha) => {
          setSelectedCancha(cancha);
          setScreen("comments");
        }}
      />
    );
  };

  if (appState === "checking" || (appState === "app" && isLoading)) {
    return (
      <div className="flex h-[100dvh] w-full items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <main className="fixed inset-0 w-full h-[100dvh] flex flex-col bg-background lg:bg-muted/30 overflow-hidden">
      <div className="flex-1 overflow-y-auto overscroll-none pt-[env(safe-area-inset-top)] relative flex mx-auto w-full lg:max-w-7xl lg:shadow-2xl lg:bg-background">
        {/* Panel lateral solo en desktop — visible en AuthScreen */}
        {appState === "auth" && (
          <aside className="relative hidden flex-1 flex-col justify-between overflow-hidden bg-secondary p-12 text-[#32CD32] lg:flex">
            <div className="pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
            <div className="pointer-events-none absolute bottom-10 -right-16 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />

            <div className="relative">
              <Logo size={36} />
            </div>

            <div className="relative">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Disponible en Caracas
              </span>
              <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight xl:text-6xl text-primary-foreground">
                Encuentra tu próximo
                <br />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  partido en Caracas.
                </span>
              </h1>
              <p className="mt-5 max-w-md text-base text-[#32CD32]">
                Crea eventos deportivos o únete a partidos cerca de ti. Mapa en vivo, jugadores
                verificados y matchmaking por nivel.
              </p>

              <div className="mt-10 grid max-w-md grid-cols-3 gap-3">
                {[
                  { k: "1.2k", v: "Jugadores" },
                  { k: "320", v: "Eventos/mes" },
                  { k: "4.9★", v: "Rating" },
                ].map((s) => (
                  <div
                    key={s.v}
                    className="rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-4"
                  >
                    <div className="text-2xl font-bold text-primary">{s.k}</div>
                    <div className="text-xs text-[#32CD32]">{s.v}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative text-xs text-[#32CD32]">
              👉 ¡A jugar ya!
            </div>
          </aside>
        )}

        {/* Área de la app: pantalla completa en móvil, columna derecha en desktop */}
        <section
          className={`relative flex min-h-[100dvh] w-full flex-col overflow-hidden bg-background ${appState === "auth"
              ? "lg:max-w-[520px] lg:border-l lg:border-primary-foreground/10 lg:shadow-pop"
              : "flex-1 lg:border-x lg:border-border/50"
            }`}
        >
          <div className="relative h-[100dvh] w-full overflow-hidden">
            {renderScreen()}
            {appState !== "auth" && <RpgNotificationManager />}
            {appState !== "auth" && <EventNotificationBanner />}
            {appState !== "auth" && <AchievementNotificationBanner />}
            {appState !== "auth" && screen !== "detail" && screen !== "editProfile" && screen !== "comments" && (
              <BottomNav
                current={screen}
                onChange={setScreen}
              />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function RpgNotificationManager() {
  const { xpNotification, clearNotification } = useCurrentUser();
  const { rpgMode } = useSettings();
  const [chestState, setChestState] = useState<"closed" | "opening" | "opened">("closed");

  useEffect(() => {
    if (xpNotification) {
      setChestState("closed");
    }
  }, [xpNotification]);

  const { xp, reason, isLevelUp, newLevel, newCoupon } = xpNotification || {};

  // Timed dismiss for normal XP gain toast
  useEffect(() => {
    if (xpNotification && !xpNotification.isLevelUp && !xpNotification.newCoupon) {
      const timer = setTimeout(() => {
        clearNotification();
      }, 6500);
      return () => clearTimeout(timer);
    }
  }, [xpNotification, clearNotification]);

  // When RPG mode is off, silently clear any pending notification and render nothing
  useEffect(() => {
    if (!rpgMode && xpNotification) {
      clearNotification();
    }
  }, [rpgMode, xpNotification, clearNotification]);

  if (!rpgMode) return null;
  if (!xpNotification) return null;

  // Si es subida de nivel
  if (isLevelUp) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 px-6 py-4 animate-in fade-in duration-300">
        <div className="absolute inset-0 sunburst-rays opacity-25 pointer-events-none" />

        <div className="relative w-full max-w-sm rounded-3xl bg-secondary border border-primary/30 p-6 text-center shadow-2xl animate-in zoom-in-95 duration-500 flex flex-col items-center">
          <div className="absolute -top-12 flex h-24 w-24 items-center justify-center rounded-full bg-primary text-secondary neon-border-legendary animate-bounce">
            <Sparkles size={48} className="animate-spin duration-3000" />
          </div>

          <div className="mt-12 space-y-4 w-full">
            <span className="inline-flex rounded-full bg-primary/20 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-primary animate-pulse border border-primary/30">
              ¡Hazaña Lograda!
            </span>

            <div className="space-y-1">
              <h2 className="text-3xl font-black tracking-tight text-white drop-shadow">
                ¡SUBISTE DE NIVEL!
              </h2>
              <p className="text-sm font-bold text-primary">
                Has alcanzado el Nivel {newLevel} 🏆
              </p>
            </div>

            <p className="text-xs text-secondary-foreground/85 leading-relaxed bg-white/5 p-3.5 rounded-2xl border border-white/5">
              "{reason}" <br />
              <span className="text-[10px] text-white/50 block mt-1">
                ¡Tus atributos físicos y mágicos STR, WIS, CON y CHA han aumentado!
              </span>
            </p>

            {newCoupon && (
              <div className="rounded-2xl border border-dashed border-amber-500/40 bg-amber-500/5 p-3.5 space-y-2 animate-in slide-in-from-bottom duration-500">
                <span className="inline-flex rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-amber-500 border border-amber-500/30">
                  ¡Recompensa de Nivel Desbloqueada! 🎁
                </span>
                <h4 className="text-xs font-black text-white">{newCoupon.title}</h4>
                <p className="text-[10px] text-amber-500 font-extrabold">{newCoupon.discount}</p>
                <div className="font-mono text-[9px] font-bold text-white/70 bg-white/5 py-1 rounded">
                  Código: {newCoupon.code}
                </div>
              </div>
            )}

            <button
              onClick={clearNotification}
              className="w-full rounded-2xl gradient-primary py-3.5 text-xs font-black uppercase tracking-wider text-secondary shadow-pop transition-all active:scale-95 hover:shadow-lg"
            >
              Cerrar y Continuar Aventura ⚔️
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Si no es subida de nivel, pero tiene un nuevo cupón (Cofre del Tesoro del 5to uso)
  if (newCoupon) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 px-6 py-4 animate-in fade-in duration-300">
        <div className="absolute inset-0 sunburst-rays opacity-25 pointer-events-none" />

        <div className="relative w-full max-w-sm rounded-3xl bg-secondary border border-primary/20 p-6 text-center shadow-2xl animate-in zoom-in-95 duration-500 flex flex-col items-center">

          {chestState === "closed" && (
            <div className="space-y-6 py-6 w-full flex flex-col items-center">
              <span className="inline-flex rounded-full bg-amber-500/25 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-amber-500 border border-amber-500/20 animate-pulse">
                ¡FIDELIDAD RECOMPENSADA! 📜
              </span>

              <div className="text-7xl chest-shake cursor-pointer">
                🎁
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-black text-white">¡Has ganado un Cofre del Tesoro!</h3>
                <p className="text-xs text-secondary-foreground/75 px-4">
                  Por tu excelente fidelidad usando TeamMatch, has obtenido un cofre de recompensa.
                </p>
              </div>

              <button
                onClick={() => setChestState("opening")}
                className="w-full rounded-2xl bg-amber-500 hover:bg-amber-600 text-secondary py-3.5 text-xs font-black uppercase tracking-wider shadow-pop transition-all active:scale-95"
              >
                Abrir Cofre 🔓
              </button>
            </div>
          )}

          {chestState === "opening" && (
            <div className="space-y-6 py-12 flex flex-col items-center justify-center w-full">
              <div className="text-7xl animate-ping opacity-75">
                🌟
              </div>
              <p className="text-xs font-bold text-primary animate-pulse uppercase tracking-widest mt-4">
                Desbloqueando magia...
              </p>
              {(() => {
                setTimeout(() => setChestState("opened"), 1000);
                return null;
              })()}
            </div>
          )}

          {chestState === "opened" && (
            <div className="space-y-5 w-full flex flex-col items-center chest-open-effect">
              <span className="inline-flex rounded-full bg-emerald-500/20 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-400 border border-emerald-500/20">
                ¡OBJETO OBTENIDO! 💎
              </span>

              <div className="text-6xl animate-bounce">
                📜
              </div>

              <div className="space-y-1.5 w-full">
                <h4 className="text-sm font-black text-white">{newCoupon.title}</h4>
                <p className="text-[10px] text-secondary-foreground/80 leading-relaxed px-2">
                  {newCoupon.description}
                </p>
                <div className="mt-3 p-3 rounded-2xl bg-white/5 border border-white/5 space-y-2 w-full">
                  <div className="text-base font-black text-primary">{newCoupon.discount}</div>
                  <div className="font-mono text-xs font-bold text-white/70 py-1 bg-white/5 rounded-xl select-all text-center">
                    CÓDIGO: {newCoupon.code}
                  </div>
                </div>
              </div>

              <button
                onClick={clearNotification}
                className="w-full rounded-2xl gradient-primary py-3.5 text-xs font-black uppercase tracking-wider text-secondary shadow-pop transition-all active:scale-95"
              >
                Equipar en Inventario y Cerrar 💼
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[9999] w-[92%] max-w-[360px] rounded-2xl xp-toast-glass px-4 py-3.5 flex flex-col shadow-pop animate-in fade-in slide-in-from-bottom duration-500 overflow-hidden">
      {/* Timer progress bar at the bottom */}
      <div className="xp-toast-progress" />

      {/* Main content row */}
      <div className="flex items-center gap-3">
        {/* Animated icon container */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/30 text-primary xp-pulse-icon">
          <Zap size={18} className="fill-current text-[#32CD32]" />
        </div>

        {/* Text Area */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[11px] font-black text-[#32CD32] tracking-wide uppercase drop-shadow-[0_0_6px_rgba(50,205,50,0.5)]">
              +{xp} XP GANADO!
            </span>
            <span className="text-[8px] text-white/50 font-bold uppercase tracking-wider">
              ¡Logro!
            </span>
          </div>
          <p className="text-[11px] text-white/95 font-semibold truncate mt-0.5" title={reason}>
            {reason}
          </p>
        </div>

        {/* Manual Close Button */}
        <button
          onClick={clearNotification}
          className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors active:scale-95"
          aria-label="Cerrar notificación"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  );
}

function EventNotificationBanner() {
  const { eventNotification, clearEventNotification } = useCurrentUser();

  if (!eventNotification) return null;

  const isAccepted = eventNotification.type === "accepted";

  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center space-y-6 bg-background/98 backdrop-blur-md px-6 text-center animate-in fade-in zoom-in duration-500">
      {/* Decorative Glows */}
      <div className={`pointer-events-none absolute top-1/4 h-72 w-72 rounded-full blur-3xl opacity-20 ${isAccepted ? "bg-emerald-500" : "bg-red-500"}`} />

      <div
        className={`grid h-24 w-24 place-items-center rounded-full text-white shadow-pop ring-8 animate-bounce ${isAccepted ? "bg-emerald-500 ring-emerald-500/20" : "bg-red-500 ring-red-500/20"
          }`}
      >
        {isAccepted ? <CheckCircle2 size={48} strokeWidth={2.5} /> : <XCircle size={48} strokeWidth={2.5} />}
      </div>

      <div className="space-y-2 max-w-xs relative z-10">
        <h2 className="text-2xl font-bold text-secondary">
          {isAccepted ? "¡Has sido aceptado!" : "No has sido aceptado"}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {isAccepted
            ? `Tu solicitud para unirte al partido "${eventNotification.eventTitle}" ha sido aprobada. ¡Prepárate para jugar!`
            : `Tu solicitud para unirte al partido "${eventNotification.eventTitle}" ha sido rechazada. El evento ha sido removido de tus deportes.`}
        </p>
      </div>

      <button
        onClick={clearEventNotification}
        className={`relative z-10 mt-4 min-w-[140px] rounded-2xl py-3.5 px-6 text-sm font-black text-white shadow-pop transition-all active:scale-95 ${isAccepted ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20" : "bg-red-500 hover:bg-red-600 shadow-red-500/20"
          }`}
      >
        Entendido
      </button>

      {/* Auto-dismiss fallback */}
      {(() => {
        setTimeout(clearEventNotification, 8000);
        return null;
      })()}
    </div>
  );
}

function playPlayStationTrophySound() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // Chime note 1 (higher pitch bell sound)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(880, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.15);
    gain1.gain.setValueAtTime(0.3, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
    
    // Chime note 2 (sparkly third)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1108.73, ctx.currentTime);
    gain2.gain.setValueAtTime(0.15, ctx.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);

    // Low warm pad underneath
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = "triangle";
    osc3.frequency.setValueAtTime(220, ctx.currentTime);
    gain3.gain.setValueAtTime(0.1, ctx.currentTime);
    gain3.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc3.connect(gain3);
    gain3.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc3.start();

    osc1.stop(ctx.currentTime + 2.0);
    osc2.stop(ctx.currentTime + 2.0);
    osc3.stop(ctx.currentTime + 2.0);
  } catch (e) {
    console.warn("Failed to play audio:", e);
  }
}

function AchievementNotificationBanner() {
  const { achievementNotification, clearAchievementNotification } = useCurrentUser();

  useEffect(() => {
    if (achievementNotification) {
      playPlayStationTrophySound();
      
      const timer = setTimeout(() => {
        clearAchievementNotification();
      }, 5500);
      return () => clearTimeout(timer);
    }
  }, [achievementNotification, clearAchievementNotification]);

  if (!achievementNotification) return null;

  const { title, rarity, icon } = achievementNotification;

  const rarityColors = {
    bronze: {
      border: "border-[#cd7f32]/40 shadow-[0_0_10px_rgba(205,127,50,0.15)]",
      text: "text-[#cd7f32] font-black",
      badge: "from-[#a05a2c] to-[#cd7f32]",
      label: "BRONCE",
      emoji: "🥉"
    },
    silver: {
      border: "border-[#c0c0c0]/40 shadow-[0_0_10px_rgba(192,192,192,0.15)]",
      text: "text-[#cbd5e0] font-black",
      badge: "from-[#718096] to-[#cbd5e0]",
      label: "PLATA",
      emoji: "🥈"
    },
    gold: {
      border: "border-[#ffd700]/40 shadow-[0_0_10px_rgba(255,215,0,0.2)]",
      text: "text-[#ecc94b] font-black",
      badge: "from-[#d69e2e] to-[#ecc94b]",
      label: "ORO",
      emoji: "🥇"
    },
    platinum: {
      border: "border-[#e5e4e2]/50 shadow-[0_0_15px_rgba(229,228,226,0.3)]",
      text: "text-[#e5e4e2] font-extrabold tracking-wider animate-pulse",
      badge: "from-[#4a5568] via-[#cbd5e0] to-[#e2e8f0]",
      label: "PLATINO",
      emoji: "🏆"
    },
  };

  const style = rarityColors[rarity] || rarityColors.bronze;

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[99999] w-[90%] max-w-[380px] rounded-full bg-[#0a0c10]/95 border border-white/10 px-4 py-2.5 flex items-center gap-3.5 shadow-2xl animate-in slide-in-from-top-12 duration-500 overflow-hidden select-none">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[reflection_3s_infinite]" />
      
      <div className={`h-11 w-11 shrink-0 rounded-full bg-gradient-to-br ${style.badge} p-[1.5px] flex items-center justify-center shadow-lg relative`}>
        <div className="h-full w-full rounded-full bg-[#0a0c10] flex items-center justify-center text-xl">
          {icon}
        </div>
        <span className="absolute -bottom-1 -right-1 text-[10px] bg-[#0a0c10] border border-white/10 rounded-full px-0.5">
          {style.emoji}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className={`text-[8px] font-black tracking-widest uppercase ${style.text}`}>
            TROFEO DE {style.label} OBTENIDO
          </span>
        </div>
        <h4 className="text-xs font-black text-white truncate leading-tight mt-0.5">
          {title}
        </h4>
        <p className="text-[9px] text-white/50 truncate mt-0.5 font-medium">
          ¡Has desbloqueado un logro!
        </p>
      </div>

      <div className="h-6 w-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
        <Award size={12} className={style.text} />
      </div>
    </div>
  );
}
