import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { UserProvider, useCurrentUser } from "@/lib/UserContext";
import { Sparkles } from "lucide-react";
import { MapScreen } from "@/components/teammatch/MapScreen";
import { EventDetailScreen } from "@/components/teammatch/EventDetailScreen";
import { ProfileScreen } from "@/components/teammatch/ProfileScreen";
import { EditProfileScreen } from "@/components/teammatch/EditProfileScreen";
import { CanchaCommentsScreen } from "@/components/teammatch/CanchaCommentsScreen";

import { MyEventsScreen } from "@/components/teammatch/MyEventsScreen";
import { MySportsScreen } from "@/components/teammatch/MySportsScreen";
import { WelcomeScreen } from "@/components/teammatch/WelcomeScreen";
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

type AppState = "checking" | "welcome" | "auth" | "app";

function Index() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

function AppContent() {
  const [appState, setAppState] = useState<AppState>("checking");
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  
  const [screen, setScreen] = useState<Screen>("map");
  const [selected, setSelected] = useState<SportEvent | null>(null);
  const [selectedCancha, setSelectedCancha] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);


  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAppState(session ? "app" : "welcome");
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAppState(session ? "app" : "welcome");
    });

    return () => subscription.unsubscribe();
  }, []);

  const openDetail = (e: SportEvent) => {
    setSelected(e);
    setScreen("detail");
  };

  const renderScreen = () => {
    if (appState === "checking") {
      return (
        <div className="flex h-full w-full items-center justify-center bg-background">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      );
    }
    
    if (appState === "welcome") {
      return (
        <WelcomeScreen 
          onLogin={() => { setAuthMode("login"); setAppState("auth"); }}
          onRegister={() => { setAuthMode("register"); setAppState("auth"); }}
        />
      );
    }
    
    if (appState === "auth") {
      return (
        <AuthScreen 
          initialMode={authMode}
          onSuccess={() => setAppState("app")}
          onClose={() => setAppState("welcome")}
        />
      );
    }


    if (screen === "detail" && selected)
      return <EventDetailScreen event={selected} onBack={() => setScreen("map")} userLocation={userLocation} />;
    if (screen === "events") return <MyEventsScreen onSelect={openDetail} />;
    if (screen === "sports") return <MySportsScreen onSelectEvent={openDetail} />;
    if (screen === "editProfile") return <EditProfileScreen onBack={() => setScreen("profile")} />;
    if (screen === "profile") return <ProfileScreen onEdit={() => setScreen("editProfile")} onSelectEvent={openDetail} />;
    if (screen === "comments" && selectedCancha)
      return <CanchaCommentsScreen cancha={selectedCancha} onBack={() => setScreen("map")} />;
    return (
      <MapScreen
        onSelect={openDetail}
        userLocation={userLocation}
        setUserLocation={setUserLocation}
        onNavigateToComments={(cancha) => {
          setSelectedCancha(cancha);
          setScreen("comments");
        }}
      />
    );
  };

  return (
    <main className="fixed inset-0 w-full h-[100dvh] flex flex-col bg-background overflow-hidden"> 
      <div className="flex-1 overflow-y-auto overscroll-none pt-[env(safe-area-inset-top)] relative flex">
        {/* Panel lateral solo en desktop */}
        {appState !== "app" && (
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
          className={`relative flex min-h-[100dvh] w-full flex-col overflow-hidden bg-background ${
            appState !== "app" 
              ? "lg:max-w-[520px] lg:border-l lg:border-primary-foreground/10 lg:shadow-pop" 
              : "flex-1"
          }`}
        >
          <div className="relative h-[100dvh] w-full overflow-hidden">
            {renderScreen()}
            {appState === "app" && <RpgNotificationManager />}
            {appState === "app" && screen !== "detail" && screen !== "editProfile" && screen !== "comments" && (
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
  const [chestState, setChestState] = useState<"closed" | "opening" | "opened">("closed");

  useEffect(() => {
    if (xpNotification) {
      setChestState("closed");
    }
  }, [xpNotification]);

  if (!xpNotification) return null;

  const { xp, reason, isLevelUp, newLevel, newCoupon } = xpNotification;

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
              "{reason}" <br/>
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
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[9999] bg-secondary/95 border border-primary/20 backdrop-blur px-4 py-2.5 rounded-full flex items-center gap-2 shadow-pop animate-in fade-in slide-in-from-bottom duration-300">
      <span className="text-xs text-primary font-black animate-pulse">⚡ +{xp} XP</span>
      <span className="text-[10px] text-white font-medium">"{reason}"</span>
      {(() => {
        setTimeout(clearNotification, 2500);
        return null;
      })()}
    </div>
  );
}
