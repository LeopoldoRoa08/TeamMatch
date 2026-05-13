import { useState } from "react";
import { Search, SlidersHorizontal, Bell, Plus } from "lucide-react";
import { CreateEventForm } from "./CreateEventForm";
import mapImg from "@/assets/caracas-map.jpg";
import { events } from "./data";
import { EventCard } from "./EventCard";
import type { SportEvent } from "./types";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import "leaflet/dist/leaflet.css";

const sports = ["Todos", "Running", "Senderismo", "Pádel", "Vóleibol"] as const;

const getCustomIcon = (event: SportEvent, isSelected: boolean) => {
  const emoji =
    event.sport === "Running"
      ? "🏃"
      : event.sport === "Senderismo"
      ? "🥾"
      : event.sport === "Pádel"
      ? "🎾"
      : "🏐";

  const iconHtml = renderToStaticMarkup(
    <div
      className={`relative grid h-11 w-11 place-items-center rounded-full ring-4 transition-all ${
        isSelected
          ? "gradient-primary scale-110 ring-background shadow-pop"
          : "bg-secondary ring-card/80"
      }`}
    >
      <span className="text-lg">{emoji}</span>
      <div
        className={`absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 ${
          isSelected ? "bg-primary" : "bg-secondary"
        }`}
      />
    </div>
  );

  return L.divIcon({
    className: "custom-leaflet-icon bg-transparent border-none",
    html: iconHtml,
    iconSize: [44, 44],
    iconAnchor: [22, 44],
  });
};

export function MapScreen({ onSelect }: { onSelect: (e: SportEvent) => void }) {
  const [active, setActive] = useState<(typeof sports)[number]>("Todos");
  const [selectedId, setSelectedId] = useState(events[0].id);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const filtered = active === "Todos" ? events : events.filter((e) => e.sport === active);

  return (
    <div className="relative h-full overflow-hidden bg-muted">
      {/* Map */}
      <div className="absolute inset-0 z-0">
        <MapContainer
          center={[10.49, -66.87]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filtered.map((e) => (
            <Marker
              key={e.id}
              position={[e.lat, e.lng]}
              icon={getCustomIcon(e, e.id === selectedId)}
              eventHandlers={{
                click: () => setSelectedId(e.id),
              }}
            />
          ))}
        </MapContainer>
      </div>

      {/* Top bar */}
      <div className="absolute inset-x-0 top-0 z-20 px-4 pt-12 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex flex-1 items-center gap-2 rounded-2xl glass px-4 py-3 shadow-soft">
            <Search size={18} className="text-muted-foreground" />
            <input
              placeholder="Buscar deporte, zona…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <button className="grid h-7 w-7 place-items-center rounded-lg bg-secondary text-primary-foreground">
              <SlidersHorizontal size={14} />
            </button>
          </div>
          <button className="relative grid h-12 w-12 place-items-center rounded-2xl glass shadow-soft">
            <Bell size={18} className="text-secondary" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-accent" />
          </button>
        </div>

        {/* Sport filters */}
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 pointer-events-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {sports.map((s) => (
            <button
              key={s}
              onClick={() => setActive(s)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold shadow-soft transition-all ${
                active === s
                  ? "bg-secondary text-primary-foreground"
                  : "glass text-secondary"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom sheet */}
      <div className="absolute inset-x-0 bottom-16 z-20 pb-4 pointer-events-none">
        <div className="pointer-events-auto">
          <div className="px-4 pb-2">
            <div className="mx-auto h-1 w-10 rounded-full bg-card/70" />
          </div>
          <div className="mb-2 flex items-center justify-between px-5">
            <h2 className="text-sm font-bold text-secondary">
              {filtered.length} eventos cerca de ti
            </h2>
            <button className="text-xs font-semibold text-primary">Ver todos</button>
          </div>
          <div className="flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filtered.map((e) => (
              <div key={e.id} className="w-[78%] flex-shrink-0">
                <EventCard event={e} onClick={() => onSelect(e)} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAB — Crear evento */}
      <button
        id="fab-create-event-btn"
        onClick={() => setShowCreateForm(true)}
        className="absolute bottom-24 right-4 z-30 flex items-center gap-2 rounded-2xl gradient-primary px-4 py-3 text-sm font-bold text-secondary shadow-pop transition-all active:scale-95 hover:scale-105"
        aria-label="Crear evento"
      >
        <Plus size={18} strokeWidth={2.5} />
        Crear
      </button>

      {/* Panel de creación de evento (pantalla completa sobre el mapa) */}
      {showCreateForm && (
        <div className="absolute inset-0 z-40 bg-background">
          <CreateEventForm
            onClose={() => setShowCreateForm(false)}
            onEventCreated={() => setShowCreateForm(false)}
          />
        </div>
      )}
    </div>
  );
}
