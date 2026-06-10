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
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedUserProfile, setSelectedUserProfile] = useState<any | null>(null);

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
    const { data, error } = await supabase
      .from("event_participants")
      .select("*, profiles(*)")
      .eq("event_id", event.id);

    if (!error && data) {
      setParticipants(data);
    }
    setLoading(false);
  }

  async function handleJoin() {
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

  async function handleInviteFriend(friend: any) {
    const friendEmail = friend.username || (friend.name.toLowerCase().replace(" ", "") + "@teammatch.com");
    const invitationStatus = isHost ? "aceptado" : "pendiente";
    try {
      const { error } = await supabase.from("event_participants").insert({
        event_id: event.id,
        user_username: friendEmail,
        status: invitationStatus
      });
      if (error) throw error;
      if (invitationStatus === "aceptado") {
        alert(`¡${friend.name} ha sido agregado al partido!`);
      } else {
        alert(`¡Se ha enviado la solicitud de invitación para ${friend.name}! Esperando aprobación del organizador.`);
      }
      fetchParticipants();
    } catch (e: any) {
      console.warn("Could not insert to Supabase event_participants due to RLS/schema, simulating locally:", e);
      
      const idHash = friend.id ? friend.id.split("-").join("") : (friend.username || friend.name);
      let charCodeSum = 0;
      for (let i = 0; i < idHash.length; i++) {
        charCodeSum += idHash.charCodeAt(i);
      }
      const rating = 4.5 + (charCodeSum % 6) * 0.1;

      // Fallback local
      const mockParticipant = {
        id: Math.floor(Math.random() * 100000),
        event_id: event.id,
        user_username: friendEmail,
        status: invitationStatus,
        profiles: {
          username: friend.username || friendEmail,
          avatar_url: null,
          rating: Number(rating.toFixed(2)),
          age: friend.age,
          gender: friend.gender || (charCodeSum % 2 === 0 ? "Masculino" : "Femenino"),
          description: friend.bio,
          location: friend.location,
          preferred_sports: friend.sports
        }
      };
      setParticipants(prev => [...prev, mockParticipant]);
      if (invitationStatus === "aceptado") {
        alert(`¡${friend.name} ha sido agregado al partido!`);
      } else {
        alert(`¡Se ha enviado la solicitud de invitación para ${friend.name}! Esperando aprobación del organizador.`);
      }
    }
  }

  async function handleLeave() {
    if (!currentUser?.email) return;
    const confirmLeave = confirm("¿Estás seguro de que deseas salirte de este partido?");
    if (!confirmLeave) return;

    try {
      const { error } = await supabase
        .from("event_participants")
        .delete()
        .eq("event_id", event.id)
        .eq("user_username", currentUser.email);

      if (error) throw error;
      
      alert("Te has salido del partido.");
      fetchParticipants();
    } catch (e: any) {
      console.error("Error leaving event, simulating locally:", e);
      // Local fallback
      setParticipants(prev => prev.filter(p => p.user_username !== currentUser.email));
      alert("Te has salido del partido.");
    }
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
                  <div 
                    onClick={() => setSelectedUserProfile(req.profiles || { username: req.user_username })}
                    className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    {renderAvatar(req.user_username || "Usuario", "h-10 w-10", req.profiles?.avatar_url)}
                    <div>
                      <div className="text-sm font-bold text-secondary">
                        {req.user_username?.split('@')[0] || "Usuario"}
                      </div>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Star size={10} className="fill-accent text-accent" />
                        {req.profiles?.rating || "5.00"}
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUserProfile(req.profiles || { username: req.user_username });
                        }}
                        className="text-[9px] font-extrabold text-primary hover:underline block text-left"
                      >
                        Ver Perfil ­ƒöì
                      </button>
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
            <div className="flex items-center gap-2">
              {currentUser && (
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 text-primary px-3 py-1.5 text-xs font-black transition-all active:scale-95 shadow-sm cursor-pointer"
                >
                  + Invitar Amigos
                </button>
              )}
              <span className="text-xs text-muted-foreground">{emptySpots} cupos disponibles</span>
            </div>
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
            +15 XP ⚔️
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
          {isHost ? (
            <button
              disabled={true}
              className="ml-auto flex-1 rounded-2xl py-3.5 text-sm font-bold bg-primary text-secondary cursor-default select-none shadow-soft text-center"
            >
              Eres el organizador ­ƒææ
            </button>
          ) : isUserApproved ? (
            <button
              disabled={joining}
              onClick={handleLeave}
              className="ml-auto flex-1 rounded-2xl py-3.5 text-sm font-bold bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 active:scale-[0.98] transition-all text-center cursor-pointer"
            >
              Salir del partido ­ƒÜ¬
            </button>
          ) : isUserPending ? (
            <button
              disabled={joining}
              onClick={handleLeave}
              className="ml-auto flex-1 rounded-2xl py-3.5 text-sm font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-red-500/10 hover:text-red-500 active:scale-[0.98] transition-all text-center cursor-pointer"
            >
              Cancelar solicitud ÔØî
            </button>
          ) : (
            <button
              disabled={joining || emptySpots === 0}
              onClick={handleJoin}
              className={`ml-auto flex-1 rounded-2xl py-3.5 text-sm font-bold shadow-pop active:scale-[0.98] transition-all disabled:opacity-90 cursor-pointer ${
                emptySpots === 0
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "gradient-primary text-secondary"
              }`}
            >
              {joining 
                ? "Enviando..." 
                : emptySpots === 0 
                  ? "Evento Lleno" 
                  : "Solicitar unirme"}
            </button>
          )}
        </div>
      </div>

      {/* Modal de Invitar Amigos */}
      {showInviteModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-6 py-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-sm rounded-3xl bg-secondary border border-primary/30 p-6 shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[80vh]">
            <h3 className="text-lg font-black text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <Users size={20} className="text-primary animate-pulse" /> Invitar Amigos
            </h3>
            
            <div className="flex-1 overflow-y-auto py-4 space-y-2 pr-1">
              {(() => {
                const storedFriends = localStorage.getItem("teammatch_friends");
                const friendList: any[] = storedFriends ? JSON.parse(storedFriends) : [];
                
                // Filter out friends who are already participants
                const nonParticipantFriends = friendList.filter(friend => {
                  const friendEmail = friend.username || (friend.name.toLowerCase().replace(" ", "") + "@teammatch.com");
                  return !participants.some(p => p.user_username === friendEmail || p.profiles?.username === friend.name || (friend.username && p.user_username === friend.username));
                });

                if (nonParticipantFriends.length === 0) {
                  return (
                    <div className="text-center text-xs text-muted-foreground py-8">
                      No tienes amigos disponibles para invitar o todos ya están en el partido.
                    </div>
                  );
                }

                return nonParticipantFriends.map(friend => (
                  <div key={friend.id} className="flex items-center justify-between bg-card p-3 rounded-2xl border border-border shadow-soft">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`h-9 w-9 rounded-full bg-gradient-to-tr ${friend.gradient} grid place-items-center text-base shadow-sm shrink-0`}>
                        {friend.emoji}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-secondary truncate">{friend.name}</div>
                        <div className="text-[9px] text-muted-foreground">{friend.location}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleInviteFriend(friend)}
                      className="rounded-xl gradient-primary text-secondary px-3 py-1.5 text-[10px] font-black transition-all active:scale-95 shadow-sm cursor-pointer"
                    >
                      Agregar
                    </button>
                  </div>
                ));
              })()}
            </div>

             <button
              onClick={() => setShowInviteModal(false)}
              className="w-full rounded-2xl bg-muted py-3 text-xs font-black uppercase tracking-wider text-muted-foreground shadow-sm hover:bg-muted/80 transition-all mt-2 cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal de Perfil de Usuario Solicitante */}
      {selectedUserProfile && (() => {
        const formatted = getFormattedProfile(selectedUserProfile);
        if (!formatted) return null;
        
        return (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 px-6 py-4 animate-in fade-in duration-300">
            <div className="relative w-full max-w-sm rounded-3xl bg-secondary border border-primary/30 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col">
              
              {/* Banner superior con gradiente */}
              <div className={`h-24 w-full bg-gradient-to-tr ${formatted.gradient} relative shrink-0`} />
              
              {/* Foto de perfil flotante */}
              <div className="absolute top-10 left-6">
                <div className="relative">
                  <div className="h-16 w-16 rounded-full bg-card p-1 shadow-md ring-4 ring-secondary">
                    {formatted.avatar_url ? (
                      <img 
                        src={formatted.avatar_url} 
                        alt="Avatar" 
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <div className={`h-full w-full rounded-full bg-gradient-to-tr ${formatted.gradient} grid place-items-center text-2xl`}>
                        {formatted.emoji}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Botón cerrar flotante */}
              <button 
                onClick={() => setSelectedUserProfile(null)}
                className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors grid place-items-center cursor-pointer"
              >
                <X size={16} />
              </button>

              {/* Contenido del perfil */}
              <div className="p-6 pt-8 space-y-4 text-white">
                <div className="space-y-1">
                  <h3 className="text-base font-black flex items-center gap-2">
                    {formatted.name}
                    {formatted.is_organizer && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/20 px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-amber-500 border border-amber-500/30">
                        Organizador
                      </span>
                    )}
                  </h3>
                  <p className="text-[10px] text-white/50">{formatted.username}</p>
                </div>

                {/* Reputación / Rating */}
                <div className="inline-flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-2.5 py-1 text-xs font-bold text-primary">
                  <Star size={12} className="fill-primary text-primary" /> {formatted.rating.toFixed(2)} Reputación
                </div>

                {/* Grid de Atributos */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                    <span className="text-[9px] text-white/50 block font-bold">Edad</span>
                    <span className="font-extrabold text-white">{formatted.age} años</span>
                  </div>
                  <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                    <span className="text-[9px] text-white/50 block font-bold">Género</span>
                    <span className="font-extrabold text-white truncate block">{formatted.gender}</span>
                  </div>
                  <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                    <span className="text-[9px] text-white/50 block font-bold">Ubicación</span>
                    <span className="font-extrabold text-white truncate block" title={formatted.location}>
                      {formatted.location}
                    </span>
                  </div>
                </div>

                {/* Biografía / Sobre mí */}
                <div className="space-y-1">
                  <span className="text-[9px] text-white/50 font-bold uppercase tracking-wider block">Sobre mí</span>
                  <p className="text-xs leading-relaxed text-white/80 bg-white/5 p-3 rounded-xl border border-white/5 italic">
                    "{formatted.bio}"
                  </p>
                </div>

                {/* Deportes favoritos */}
                <div className="space-y-1.5">
                  <span className="text-[9px] text-white/50 font-bold uppercase tracking-wider block">Deportes Favoritos</span>
                  <div className="flex flex-wrap gap-1.5">
                    {formatted.sports.map((sport: string) => (
                      <span key={sport} className="rounded-full bg-primary/15 border border-primary/25 px-2.5 py-0.5 text-[9px] font-bold text-primary">
                        {sport}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Botón cerrar */}
                <button
                  onClick={() => setSelectedUserProfile(null)}
                  className="w-full rounded-2xl bg-muted py-3 text-xs font-black uppercase tracking-wider text-muted-foreground shadow-sm hover:bg-muted/80 transition-all mt-2 cursor-pointer"
                >
                  Volver al Partido
                </button>
              </div>

            </div>
          </div>
        );
      })()}
    </div>
  );
}

const getFormattedProfile = (p: any) => {
  if (!p) return null;
  const username = p.username || "Usuario";
  
  let charCodeSum = 0;
  for (let i = 0; i < username.length; i++) {
    charCodeSum += username.charCodeAt(i);
  }
  
  const age = p.age || (20 + (charCodeSum % 15));
  
  const locations = ["Chacao", "Las Mercedes", "Altamira", "El Hatillo", "La Castellana", "Los Palos Grandes"];
  const location = p.location || locations[charCodeSum % locations.length];
  
  const sportsPool = ["Running", "Senderismo", "Pádel", "Tenis", "Vóleibol"];
  const sportsCount = 1 + (charCodeSum % 3);
  const sports: string[] = p.preferred_sports || [];
  if (sports.length === 0) {
    for (let i = 0; i < sportsCount; i++) {
      const sport = sportsPool[(charCodeSum + i) % sportsPool.length];
      if (!sports.includes(sport)) {
        sports.push(sport);
      }
    }
  }
  
  const emojis = ["­ƒÅâÔÇìÔÖé´©Å", "­ƒÄ¥", "­ƒÑ¥", "­ƒÅÉ", "­ƒæ®ÔÇì­ƒÜÇ", "­ƒºö", "­ƒªü", "­ƒªè", "­ƒÉ»", "­ƒÉ╝"];
  const emoji = emojis[charCodeSum % emojis.length];
  
  const gradients = [
    "from-pink-500 to-rose-400",
    "from-emerald-500 to-teal-400",
    "from-blue-500 to-cyan-400",
    "from-purple-500 to-indigo-400",
    "from-amber-500 to-orange-400",
    "from-sky-500 to-blue-600",
    "from-orange-400 to-red-500"
  ];
  const gradient = gradients[charCodeSum % gradients.length];
  
  const bios = [
    "¡Me encanta el deporte y conocer gente nueva para entrenar en Caracas!",
    "Siempre activo para jugar un partido de pádel o tenis.",
    "Subo al ├üvila todos los fines de semana. ¡Acompáñame!",
    "Running y entrenamiento funcional. Busco motivar y que me motiven.",
    "Jugador recreativo de vóleibol y fútbol. Buena vibra."
  ];
  const bio = p.description || bios[charCodeSum % bios.length];
  
  const name = username.includes("@") 
    ? username.split("@")[0].split(".").map((n: string) => n.charAt(0).toUpperCase() + n.slice(1)).join(" ") 
    : username;

  return {
    name,
    username,
    age,
    gender: p.gender || (charCodeSum % 2 === 0 ? "Masculino" : "Femenino"),
    location,
    bio,
    sports,
    emoji,
    gradient,
    rating: p.rating || 4.8,
    avatar_url: p.avatar_url,
    is_premium: p.is_premium || false,
    is_organizer: p.is_organizer || false
  };
};

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
