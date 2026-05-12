

import { useState } from "react";
import { Check, X, User, Bell, Calendar, Star, Trophy } from "lucide-react";
import { toast } from "sonner";
import { EventCard } from "./EventCard";
import { events } from "./data";
import { SportEvent } from "./types";

const tabs = ["Próximos", "Solicitudes", "Historial"] as const;

export function MyEventsScreen({ onSelect }: { onSelect: (e: SportEvent) => void }) {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Próximos");

  // Mock de solicitudes pendientes (Basado en la User Story)
  const [pendingRequests, setPendingRequests] = useState([
    { id: "r1", userName: "Juan Martínez", eventTitle: "Pickup amistoso", initials: "JM" },
    { id: "r2", userName: "Carla Gómez", eventTitle: "Pádel Mixto", initials: "CG" },
  ]);

  // Manejador para aprobar o rechazar solicitudes
  const handleAction = (id: string, action: 'accept' | 'reject', name: string) => {
    // 1. Eliminamos la solicitud de la lista visual
    setPendingRequests(prev => prev.filter(r => r.id !== id));

    // 2. Feedback al usuario (Criterio de aceptación 2)
    if (action === 'accept') {
      toast.success(`Solicitud de ${name} aprobada. Se ha sumado al cupo del evento.`);
    } else {
      toast.error(`Solicitud de ${name} rechazada.`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background pb-24">
      {/* Header */}
      <header className="p-6 pt-12">
        <h1 className="text-3xl font-black text-secondary tracking-tight">Mis eventos</h1>
        <p className="text-muted-foreground text-sm">Tu agenda deportiva y gestión de equipo</p>
      </header>

      {/* Tabs Selector */}
      <div className="px-6 mb-4">
        <div className="flex bg-muted/50 p-1 rounded-2xl border border-border/50">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative flex-1 rounded-xl py-2.5 text-xs font-bold transition-all ${
                tab === t 
                  ? "bg-card text-secondary shadow-sm" 
                  : "text-muted-foreground hover:text-secondary/70"
              }`}
            >
              {t}
              {t === "Solicitudes" && pendingRequests.length > 0 && (
                <span className="absolute top-1 right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-6">
        {tab === "Solicitudes" ? (
          <div className="space-y-4 pt-2">
            {pendingRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground/50 text-center">
                <div className="bg-muted rounded-full p-6 mb-4">
                  <Bell size={40} strokeWidth={1.5} />
                </div>
                <p className="font-medium text-sm">No tienes solicitudes pendientes</p>
                <p className="text-xs">Te avisaremos cuando alguien quiera unirse.</p>
              </div>
            ) : (
              pendingRequests.map((req) => (
                <div 
                  key={req.id} 
                  className="bg-card border rounded-2xl p-4 shadow-sm animate-in fade-in slide-in-from-bottom-3 duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    {/* Avatar - Criterio: Visualizar perfil */}
                    <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center text-secondary font-black border-2 border-background shadow-sm">
                      {req.initials}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-sm text-secondary leading-tight">{req.userName}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        Quiere unirse a <span className="text-primary font-semibold">{req.eventTitle}</span>
                      </div>
                    </div>
                    <button className="p-2.5 bg-muted/50 hover:bg-muted rounded-xl transition-colors">
                      <User size={18} className="text-secondary" />
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleAction(req.id, 'reject', req.userName)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-destructive/20 text-destructive text-[11px] font-bold hover:bg-destructive/5 transition-all active:scale-95"
                    >
                      <X size={14} /> Rechazar
                    </button>
                    <button 
                      onClick={() => handleAction(req.id, 'accept', req.userName)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-secondary text-primary-foreground text-[11px] font-bold shadow-pop hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      <Check size={14} /> Aprobar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            {/* Renderizamos eventos reales del mock data */}
            {events.map((e) => (
              <EventCard key={e.id} event={e} onClick={() => onSelect(e)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
