import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapScreen } from "@/components/teammatch/MapScreen";
import { EventDetailScreen } from "@/components/teammatch/EventDetailScreen";
import { CreateEventScreen } from "@/components/teammatch/CreateEventScreen";
import { MyEventsScreen } from "@/components/teammatch/MyEventsScreen";
import { ProfileScreen } from "@/components/teammatch/ProfileScreen";
import { WelcomeScreen } from "@/components/teammatch/WelcomeScreen";
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

function Index() {
  const [started, setStarted] = useState(false);
  const [screen, setScreen] = useState<Screen>("map");
  const [selected, setSelected] = useState<SportEvent | null>(null);
  const [creating, setCreating] = useState(false);

  const openDetail = (e: SportEvent) => {
    setSelected(e);
    setScreen("detail");
  };

  const renderScreen = () => {
    if (!started) return <WelcomeScreen onStart={() => setStarted(true)} />;
    if (creating) return <CreateEventScreen onClose={() => setCreating(false)} />;
    if (screen === "detail" && selected)
      return <EventDetailScreen event={selected} onBack={() => setScreen("map")} />;
    if (screen === "events") return <MyEventsScreen onSelect={openDetail} />;
    if (screen === "profile") return <ProfileScreen />;
    return <MapScreen onSelect={openDetail} />;
  };

  return (
    <main className="min-h-screen w-full bg-secondary">
      {/* Desktop side panel */}
      <div className="mx-auto flex min-h-screen max-w-[1200px] items-center gap-12 px-6 py-10">
        <aside className="hidden flex-1 text-primary-foreground lg:block">
          <Logo size={36} />
          <h1 className="mt-8 text-5xl font-bold leading-tight tracking-tight">
            Encuentra tu próximo
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              partido en Caracas.
            </span>
          </h1>
          <p className="mt-4 max-w-md text-base text-primary-foreground/70">
            Crea eventos deportivos o únete a partidos cerca de ti. Mapa en vivo, jugadores verificados
            y matchmaking por nivel.
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

          <div className="mt-10 flex items-center gap-3 text-xs text-primary-foreground/50">
            <span>👉</span> Navega el prototipo en el teléfono →
          </div>
        </aside>

        {/* Phone frame */}
        <div className="mx-auto flex-shrink-0">
          <div className="relative h-[820px] w-[390px] overflow-hidden rounded-[3rem] border-[10px] border-secondary bg-background shadow-pop ring-1 ring-primary-foreground/10">
            {/* Notch */}
            <div className="absolute left-1/2 top-2 z-50 h-6 w-32 -translate-x-1/2 rounded-full bg-secondary" />
            {/* Screen */}
            <div className="relative h-full w-full overflow-hidden">
              {renderScreen()}
              {started && !creating && screen !== "detail" && (
                <BottomNav
                  current={screen}
                  onChange={setScreen}
                  onCreate={() => setCreating(true)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
