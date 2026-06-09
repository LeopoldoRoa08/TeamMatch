import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Clock, Calendar, Users, Share2, Star, Check, X, Loader2, CheckCircle2 } from "lucide-react";
import type { SportEvent } from "./types";
import { SportBadge } from "./SportBadge";
import { supabase } from "@/lib/supabase";
import { useCurrentUser } from "@/lib/UserContext";
import { LoginPromptModal } from "./LoginPromptModal";

export function EventDetailScreen({
  event,
  onBack,
  userLocation,
  onOpenAuth,
}: {
  event: SportEvent;
  onBack: () => void;
  userLocation?: { lat: number; lng: number } | null;
  onOpenAuth?: () => void;
}) {
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFloatXp, setShowFloatXp] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { addXp, coupons, claimCoupon, avatarUrl: currentUserAvatar } = useCurrentUser();
  const [selectedCouponCode, setSelectedCouponCode] = useState<string>("");

  const [hostProfile, setHostProfile] = useState<any>(null);

  const renderAvatar = (username: string, sizeClass = "h-10 w-10", explicitAvatarUrl?: string | null) => {
    const isCurrentUser = currentUser?.email === username || (currentUser?.user_metadata?.full_name === username);
    const url = isCurrentUser ? (currentUserAvatar || explicitAvatarUrl) : explicitAvatarUrl;
    if (url) {
      return (
        <img 
          src={url} 
          alt={username}
          className={`${sizeClass} rounded-full object-cover shadow-soft ring-2 ring-primary/30`} 
        />
      );
    }
    return (
      <div className={`${sizeClass} grid place-items-center rounded-full gradient-primary text-sm font-bold text-secondary shadow-soft ring-2 ring-primary/30`}>
        {(username || "U").substring(0, 2).toUpperCase()}
      </div>
    );
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setCurrentUser(data.user));
    fetchParticipants();
    fetchHostProfile();

    // Suscripción a cambios en tiempo real
    const channel = supabase
      .channel(`participants_${event.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "event_participants", filter: `event_id=eq.${event.id}` },
        () => fetchParticipants()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [event.id]);

  async function fetchHostProfile() {
    try {
      const { data } = await supabase
        .from("profiles")
        .select("avatar_url, rating")
        .eq("username", event.host)
        .maybeSingle();
      if (data) {
        setHostProfile(data);
      }
    } catch (e) {
      console.error("Error fetching host profile:", e);
    }
  }

  async function fetchParticipants() {
    setLoading(true);
    // Asumimos que la tabla event_participants tiene una columna 'status' (pending, approved, rejected)
    const { data, error } = await supabase
      .from("event_participants")
      .select("*, profiles(username, rating, avatar_url)")
      .eq("event_id", event.id);

    if (!error && data) {
      setParticipants(data);
    }
    setLoading(false);
  }

  async function handleJoin() {
    // Si no hay usuario autenticado, mostrar modal de login
    if (!currentUser || !currentUser.email) {
      setShowLoginPrompt(true);
      return;
    }
    setJoining(true);

    // Insertamos solicitud con status 'pending'
    const { error } = await supabase.from("event_participants").insert({
      event_id: event.id,
      user_username: currentUser.email,
      status: "pendiente" // Adaptado a tu enum request_status
    });

    if (error) {
      console.error("Error al unirse:", error);
      if (error.code === '23505') alert("Ya enviaste una solicitud");
      else alert(`Error al solicitar unirse: ${error.message || JSON.stringify(error)}`);
    } else {
      setShowSuccess(true);
      if (selectedCouponCode) {
        await claimCoupon(selectedCouponCode);
      }
      fetchParticipants();
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    }
    setJoining(false);
  }

  async function handleAction(participantId: number, status: "aceptado" | "rechazado") {
    if (!currentUser?.email || (currentUser.email !== event.host && currentUser.email !== (event as any).hostName)) {
      alert("Solo el creador del evento puede aceptar o rechazar solicitudes.");
      return;
    }

    setActionLoading(participantId.toString());
    const { error } = await supabase
      .from("event_participants")
      .update({ status })
      .eq("id", participantId);

    if (!error) {
      // Simular la notificación al usuario
      alert(`Has ${status === "aceptado" ? "aceptado" : "rechazado"} la solicitud.`);
      fetchParticipants();
    } else {
      alert("Error al actualizar la solicitud");
    }
    setActionLoading(null);
  }

  const approvedPlayers = participants.filter(p => p.status === "approved" || p.status === "aceptado" || p.status === "aprobado" || !p.status); // Fallback si status no existe
  const pendingRequests = participants.filter(p => p.status === "pending" || p.status === "pendiente");
  const emptySpots = Math.max(0, event.spots - approvedPlayers.length);

  const activeCoupons = coupons.filter((c: any) => !c.claimed);
  let finalPrice = event.price;
  let appliedDiscountText = "";
  if (selectedCouponCode) {
    const coupon = coupons.find((c: any) => c.code === selectedCouponCode);
    if (coupon) {
      if (coupon.code === "FIDELIDAD5") {
        finalPrice = Math.max(0, event.price - 5);
        appliedDiscountText = "-$5 USD";
      } else if (coupon.code === "ASPIRANTE2") {
        finalPrice = Math.max(0, event.price * 0.9);
        appliedDiscountText = "-10%";
      } else if (coupon.code === "GUERRERO3") {
        finalPrice = Math.max(0, event.price * 0.85);
        appliedDiscountText = "-15%";
      } else if (coupon.code === "LEYENDA5") {
        finalPrice = 0;
        appliedDiscountText = "-100%";
      }
    }
  }

  const isHost = currentUser && (event.host === currentUser.email || (event as any).hostName === currentUser.email);
  const isUserPending = participants.some(p => p.user_username === currentUser?.email && (p.status === "pending" || p.status === "pendiente"));
  const isUserApproved = participants.some(p => p.user_username === currentUser?.email && (p.status === "approved" || p.status === "aceptado" || p.status === "aprobado" || !p.status)) || isHost;

  if (showSuccess) {
    return (
      <div className="absolute inset-0 z-50 flex h-full flex-col items-center justify-center space-y-6 bg-background px-6 text-center animate-in fade-in zoom-in duration-500">
        <div className="grid h-24 w-24 place-items-center rounded-full bg-emerald-500 text-white shadow-pop ring-8 ring-emerald-500/20">
          <CheckCircle2 size={48} strokeWidth={2.5} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-secondary">¡Solicitud enviada!</h2>
          <p className="text-sm text-muted-foreground">
            Tu solicitud para unirte al partido de {event.sport} ha sido enviada con éxito.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full overflow-y-auto bg-background">
      {/* Modal de login para invitados */}
      <LoginPromptModal
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        onLogin={() => {
          setShowLoginPrompt(false);
          onOpenAuth?.();
        }}
        onRegister={() => {
          setShowLoginPrompt(false);
          onOpenAuth?.();
        }}
        actionContext="unirte al partido"
      />
      {/* Hero */}
      <div className="relative h-64 w-full overflow-hidden">
        <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-secondary/40" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-12">
          <button
            onClick={onBack}
            className="grid h-10 w-10 place-items-center rounded-full glass shadow-soft"
          >
            <ArrowLeft size={18} className="text-secondary" />
          </button>
          <button className="grid h-10 w-10 place-items-center rounded-full glass shadow-soft">
            <Share2 size={16} className="text-secondary" />
          </button>
        </div>
        <div className="absolute inset-x-0 bottom-4 px-5">
          <div className="mb-2 flex items-center gap-2">
            <SportBadge sport={event.sport} />
            <span className="rounded-full bg-card/90 px-2.5 py-1 text-[11px] font-bold text-secondary">
              {event.level}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-primary-foreground drop-shadow">
            {event.title}
          </h1>
        </div>
      </div>

      <div className="space-y-4 p-5 pb-32">
        {/* Host */}
        <div className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-soft">
          {renderAvatar(event.host, "h-11 w-11", hostProfile?.avatar_url)}
          <div className="flex-1">
            <div className="text-[11px] font-medium text-muted-foreground">Organizador</div>
            <div className="text-sm font-bold text-secondary">{event.host}</div>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-secondary">
            <Star size={14} className="fill-accent text-accent" /> 4.8
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-3">
          <InfoTile icon={Calendar} label="Fecha" value={event.date} />
          <InfoTile icon={Clock} label="Hora" value={event.time} />
          <InfoTile 
            icon={MapPin} 
            label="Lugar" 
            value={event.location} 
            onClick={() => {
              const origin = userLocation ? `${userLocation.lat},${userLocation.lng}` : '';
              const destination = `${event.lat},${event.lng}`;
              const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
              window.open(url, '_blank');
            }}
          />
          <InfoTile icon={Users} label="Cupos" value={`${approvedPlayers.length}/${event.spots}`} />
        </div>

        {/* Botón de Google Maps */}
        <button
          onClick={() => {
            const origin = userLocation ? `${userLocation.lat},${userLocation.lng}` : '';
            const destination = `${event.lat},${event.lng}`;
            const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
            window.open(url, '_blank');
          }}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-secondary/10 hover:bg-secondary/20 active:scale-[0.98] py-3 text-xs font-bold text-secondary transition-all border border-secondary/20 shadow-soft"
        >
          <MapPin size={16} className="text-primary" />
          <span>Cómo llegar con Google Maps</span>
          {userLocation ? (
            <span className="ml-1 rounded-full bg-primary/20 px-2 py-0.5 text-[9px] font-bold text-primary animate-pulse">
              En tiempo real
            </span>
          ) : (
            <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-[9px] font-medium text-muted-foreground">
              Desde tu ubicación
            </span>
          )}
        </button>

        {/* Description */}
        <div>
          <h3 className="mb-2 text-sm font-bold text-secondary">Descripción</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {event.description_after_arrival || 
              "Partido amistoso, cancha sintética con luces. Trae ropa cómoda y agua. Se aceptan jugadores con experiencia, ambiente respetuoso y competitivo."}
          </p>
        </div>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && currentUser?.email && (currentUser.email === event.host || currentUser.email === (event as any).hostName) && (
          <div>
            <h3 className="mb-3 text-sm font-bold text-secondary flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] text-white">
                {pendingRequests.length}
              </span>
              Solicitudes pendientes
            </h3>
            <div className="space-y-2">
              {pendingRequests.map(req => (
                <div key={req.id} className="flex items-center justify-between rounded-2xl border border-border bg-card p-3 shadow-soft">
                  <div className="flex items-center gap-3">
                    {renderAvatar(req.user_username || "Usuario", "h-10 w-10", req.profiles?.avatar_url)}
                    <div>
                      <div className="text-sm font-bold text-secondary">
                        {req.user_username?.split('@')[0] || "Usuario"}
                      </div>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Star size={10} className="fill-accent text-accent" />
                        {req.profiles?.rating || "5.00"}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      disabled={actionLoading === req.id.toString()}
                      onClick={() => handleAction(req.id, "rechazado")}
                      className="grid h-9 w-9 place-items-center rounded-full bg-destructive/10 text-destructive transition-colors hover:bg-destructive/20 disabled:opacity-50"
                    >
                      <X size={16} strokeWidth={2.5} />
                    </button>
                    <button
                      disabled={actionLoading === req.id.toString()}
                      onClick={() => handleAction(req.id, "aceptado")}
                      className="grid h-9 w-9 place-items-center rounded-full bg-emerald-50 text-emerald-600 transition-colors hover:bg-emerald-100 disabled:opacity-50"
                    >
                      {actionLoading === req.id.toString() ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} strokeWidth={2.5} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Players */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-bold text-secondary">Jugadores aprobados</h3>
            <span className="text-xs text-muted-foreground">{emptySpots} cupos disponibles</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {loading ? (
              <div className="text-xs text-muted-foreground">Cargando jugadores...</div>
            ) : (
              <>
                {approvedPlayers.map((p, i) => (
                  <div key={p.id || i} title={p.user_username}>
                    {renderAvatar(p.user_username || "Usuario", "h-10 w-10", p.profiles?.avatar_url)}
                  </div>
                ))}
                {Array.from({ length: emptySpots }).map((_, i) => (
                  <div
                    key={`e-${i}`}
                    className="grid h-10 w-10 place-items-center rounded-full border-2 border-dashed border-border text-muted-foreground"
                  >
                    +
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="absolute inset-x-0 bottom-0 z-20 glass border-t border-border px-5 py-4 relative">
        {showFloatXp && (
          <div className="float-xp absolute left-1/2 -translate-x-1/2 -top-12 z-50">
            +15 XP ⚡
          </div>
        )}
        
        {/* Selector de cupones si el evento es de pago */}
        {event.price > 0 && activeCoupons.length > 0 && (
          <div className="mb-3 flex items-center justify-between gap-2 border-b border-border/60 pb-3">
            <span className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-1">
              📜 Aplicar Cupón RPG:
            </span>
            <select
              value={selectedCouponCode}
              onChange={(e) => setSelectedCouponCode(e.target.value)}
              className="text-xs font-bold text-secondary border border-border bg-card/85 rounded-xl px-2 py-1 outline-none focus:border-primary shrink-0 max-w-[200px]"
            >
              <option value="">-- Sin cupón --</option>
              {activeCoupons.map((c: any) => (
                <option key={c.code} value={c.code}>
                  {c.title} ({c.discount})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-center gap-3">
          <div>
            <div className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
              Aporte {selectedCouponCode && <span className="text-[9px] font-extrabold text-primary bg-primary/10 px-1 rounded-full">{appliedDiscountText}</span>}
            </div>
            <div className="text-lg font-bold text-secondary">
              {finalPrice === 0 ? "Gratis" : `$${finalPrice.toFixed(2)} USD`}
              {selectedCouponCode && <span className="text-[10px] text-muted-foreground line-through ml-1.5">${event.price}</span>}
            </div>
          </div>
          <button
            disabled={joining || emptySpots === 0 || isUserPending || isUserApproved}
            onClick={handleJoin}
            className={`ml-auto flex-1 rounded-2xl py-3.5 text-sm font-bold shadow-pop active:scale-[0.98] transition-all disabled:opacity-90 ${
              isUserApproved
                ? "bg-primary text-secondary"
                : isUserPending
                  ? "bg-amber-500/20 text-amber-500 border border-amber-500/30"
                  : emptySpots === 0
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "gradient-primary text-secondary"
            }`}
          >
            {joining 
              ? "Enviando..." 
              : isUserApproved 
                ? "Ya estás dentro" 
                : isUserPending 
                  ? "Esperando solicitud" 
                  : emptySpots === 0 
                    ? "Evento Lleno" 
                    : "Solicitar unirme"}
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoTile({
  icon: Icon,
  label,
  value,
  onClick,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
  onClick?: () => void;
}) {
  return (
    <div 
      onClick={onClick}
      className={`rounded-2xl bg-card p-3 shadow-soft transition-all ${
        onClick ? "cursor-pointer hover:border-primary/20 active:scale-95 border border-transparent hover:bg-card/90" : ""
      }`}
    >
      <div className="mb-1 flex items-center justify-between">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-muted">
          <Icon size={15} className="text-primary" />
        </div>
        {onClick && (
          <span className="text-[9px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
            Ver Ruta
          </span>
        )}
      </div>
      <div className="text-[11px] font-medium text-muted-foreground">{label}</div>
      <div className="text-sm font-bold text-secondary truncate">{value}</div>
    </div>
  );
}
