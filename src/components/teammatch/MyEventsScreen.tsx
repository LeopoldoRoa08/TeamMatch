import { useState } from "react";
import { events } from "./data";
import { EventCard } from "./EventCard";
import type { SportEvent } from "./types";

const tabs = ["Próximos", "Solicitudes", "Historial"] as const;

export function MyEventsScreen({ onSelect }: { onSelect: (e: SportEvent) => void }) {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Próximos");
  return (
    <div className="h-full overflow-y-auto bg-background pb-24">
      <header className="px-5 pb-3 pt-12">
        <h1 className="text-2xl font-bold text-secondary">Mis eventos</h1>
        <p className="text-sm text-muted-foreground">Tu agenda deportiva</p>
      </header>

      <div className="sticky top-0 z-10 bg-background/80 px-5 pb-3 pt-1 backdrop-blur">
        <div className="flex gap-1 rounded-full bg-muted p-1">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 rounded-full py-2 text-xs font-semibold transition-all ${
                tab === t ? "bg-card text-secondary shadow-soft" : "text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {tab === "Solicitudes" ? (
        <div className="space-y-3 px-5 pt-3">
          {[events[0], events[2]].map((e) => (
            <div key={e.id} className="rounded-2xl bg-card p-4 shadow-soft">
              <div className="mb-2 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full gradient-primary text-sm font-bold text-secondary">
                  JM
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-secondary">Juan Martínez</div>
                  <div className="text-xs text-muted-foreground">quiere unirse a {e.title}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 rounded-xl bg-muted py-2 text-xs font-semibold text-muted-foreground">
                  Rechazar
                </button>
                <button className="flex-1 rounded-xl gradient-primary py-2 text-xs font-bold text-secondary shadow-pop">
                  Aceptar
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3 px-5 pt-3">
          {events.map((e) => (
            <EventCard key={e.id} event={e} onClick={() => onSelect(e)} />
          ))}
        </div>
      )}
    </div>
  );
}
