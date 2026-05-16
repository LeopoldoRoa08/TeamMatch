import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { MapScreen } from "@/components/teammatch/MapScreen";
import { EventDetailScreen } from "@/components/teammatch/EventDetailScreen";

import { MyEventsScreen } from "@/components/teammatch/MyEventsScreen";
import { ProfileScreen } from "@/components/teammatch/ProfileScreen";
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
  const [appState, setAppState] = useState<AppState>("checking");
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  
  const [screen, setScreen] = useState<Screen>("map");
  const [selected, setSelected] = useState<SportEvent | null>(null);


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
      return <EventDetailScreen event={selected} onBack={() => setScreen("map")} />;
    if (screen === "events") return <MyEventsScreen onSelect={openDetail} />;
    if (screen === "profile") return <ProfileScreen />;
    return <MapScreen onSelect={openDetail} />;
  };

  return (
    <main className="fixed inset-0 w-full h-[100dvh] flex flex-col bg-background overflow-hidden"> 
      <div className="flex-1 overflow-y-auto overscroll-none pt-[env(safe-area-inset-top)] relative flex">
        {/* Panel lateral solo en desktop */}
        <aside className="relative hidden flex-1 flex-col justify-between overflow-hidden bg-secondary p-12 text-primary-foreground lg:flex">
          <div className="pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
          <div className="pointer-events-none absolute bottom-10 -right-16 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />

          <div className="relative">
            <Logo size={36} />
          </div>

          <div className="relative">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Disponible en Caracas
            </span>
            <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight xl:text-6xl">
              Encuentra tu próximo
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                partido en Caracas.
              </span>
            </h1>
            <p className="mt-5 max-w-md text-base text-primary-foreground/70">
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
                  <div className="text-xs text-primary-foreground/60">{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative text-xs text-primary-foreground/50">
            👉 Usa la app a la derecha — totalmente responsive.
          </div>
        </aside>

        {/* Área de la app: pantalla completa en móvil, columna derecha en desktop */}
        <section className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden bg-background lg:max-w-[520px] lg:border-l lg:border-primary-foreground/10 lg:shadow-pop">
          <div className="relative h-[100dvh] w-full overflow-hidden">
            {renderScreen()}
            {appState === "app" && screen !== "detail" && (
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
