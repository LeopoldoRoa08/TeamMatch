import { useState, useEffect } from "react";
import { 
  Users, 
  UserPlus, 
  Sparkles, 
  MapPin, 
  Heart, 
  X, 
  Search, 
  MessageSquare, 
  UserCheck, 
  UserX,
  Flame,
  Check,
  Loader2
} from "lucide-react";
import { useCurrentUser } from "@/lib/UserContext";
import { SportBadge } from "./SportBadge";
import { supabase } from "@/lib/supabase";


interface Friend {
  id: string;
  name: string;
  age: number;
  location: string;
  bio: string;
  sports: string[];
  emoji: string;
  gradient: string;
}

const initialCandidates: Friend[] = [];
const initialReceivedRequests: Friend[] = [];
const initialFriends: Friend[] = [];


export function FriendsScreen({ 
  onNavigateToProfile,
  onSelectEvent 
}: { 
  onNavigateToProfile?: () => void;
  onSelectEvent?: (e: any) => void;
}) {
  const { user, addXp } = useCurrentUser();
  const [activeSubTab, setActiveSubTab] = useState<"tinder" | "friends">("tinder");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Storage states
  const [candidates, setCandidates] = useState<Friend[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<Friend[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  
  // Tinder state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchProgress, setMatchProgress] = useState<null | "sending" | "accepted" | "rejected">(null);
  const [activeRequestUser, setActiveRequestUser] = useState<Friend | null>(null);


  // Save changes helper
  const saveToStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Initialize from LocalStorage and fetch profiles from Supabase profiles table
  useEffect(() => {
    // 1. Cargar amigos y solicitudes recibidas guardadas y limpiar cuentas falsas previas
    const storedFriends = localStorage.getItem("teammatch_friends");
    const storedRequests = localStorage.getItem("teammatch_received_requests");

    let loadedFriends: Friend[] = storedFriends ? JSON.parse(storedFriends) : [];
    loadedFriends = loadedFriends.filter(
      (f: any) => !f.id.startsWith("friend_default_") && !f.id.startsWith("req_") && !f.id.startsWith("cand_")
    );
    setFriends(loadedFriends);
    localStorage.setItem("teammatch_friends", JSON.stringify(loadedFriends));

    let loadedRequests: Friend[] = storedRequests ? JSON.parse(storedRequests) : [];
    loadedRequests = loadedRequests.filter(
      (r: any) => !r.id.startsWith("friend_default_") && !r.id.startsWith("req_") && !r.id.startsWith("cand_")
    );
    setReceivedRequests(loadedRequests);
    localStorage.setItem("teammatch_received_requests", JSON.stringify(loadedRequests));


    // 2. Consultar perfiles reales registrados de public.profiles en Supabase
    async function fetchRealProfiles() {
      try {
        setLoadingProfiles(true);
        const { data: dbProfiles, error } = await supabase
          .from("profiles")
          .select("*");

        if (error) throw error;

        // Filtrar al propio usuario logueado
        const filtered = (dbProfiles || []).filter(
          (p: any) => p.username !== user?.email && p.id !== user?.id
        );

        // Mapear a formato Tinder candidate con fallbacks deterministas
        const mappedCandidates: Friend[] = filtered.map((p: any, index: number) => {
          // Generar datos deterministas basados en el ID para complementar campos vacíos
          const idHash = p.id ? p.id.split("-").join("") : p.username;
          let charCodeSum = 0;
          for (let i = 0; i < idHash.length; i++) {
            charCodeSum += idHash.charCodeAt(i);
          }

          const age = p.age || (20 + (charCodeSum % 15)); // Edad 20-34
          
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

          const emojis = ["🏃‍♂️", "🎾", "🥾", "🏐", "👩‍🚀", "🧔", "🦁", "🦊", "🐯", "🐼"];
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
            "Subo al Ávila todos los fines de semana. ¡Acompáñame!",
            "Running y entrenamiento funcional. Busco motivar y que me motiven.",
            "Jugador recreativo de vóleibol y fútbol. Buena vibra."
          ];
          const bio = p.description || bios[charCodeSum % bios.length];

          // Formatear el username para mostrar un nombre amigable si es un correo
          const name = p.username.includes("@") 
            ? p.username.split("@")[0].split(".").map((n: string) => n.charAt(0).toUpperCase() + n.slice(1)).join(" ") 
            : p.username;

          return {
            id: p.id || `profile_${index}`,
            name: name || "Deportista",
            age,
            location,
            bio,
            sports,
            emoji,
            gradient
          };
        });

        // Filtrar candidatos para no mostrar a los que ya son tus amigos en localStorage
        const currentFriends: Friend[] = storedFriends ? JSON.parse(storedFriends) : initialFriends;
        const currentFriendNames = new Set(currentFriends.map(f => f.name.toLowerCase()));
        const finalCandidates = mappedCandidates.filter(c => !currentFriendNames.has(c.name.toLowerCase()));

        setCandidates(finalCandidates);
        saveToStorage("teammatch_candidates", finalCandidates);
      } catch (err) {
        console.error("Error loading profiles from Supabase profiles:", err);
      } finally {
        setLoadingProfiles(false);
      }
    }

    if (user) {
      fetchRealProfiles();
    } else {
      setLoadingProfiles(false);
    }
  }, [user]);


  // Get user preferred sports for compatibility check
  const userSports = user?.user_metadata?.preferred_sports || [];

  // Compatibility score calculation
  const getCompatibilityScore = (candidateSports: string[]) => {
    if (userSports.length === 0) {
      // Retornar un número determinista basado en el nombre para variedad
      return 75 + (candidateSports.length * 3) % 15;
    }
    const common = candidateSports.filter(s => userSports.includes(s)).length;
    const score = Math.round(50 + (common / Math.max(1, userSports.length)) * 48);
    return Math.min(99, score);
  };

  // Handle Tinder match (Like/Heart click)
  const handleLike = async (candidate: Friend) => {
    setActiveRequestUser(candidate);
    setMatchProgress("sending");
    
    // Simular tiempo de espera del mensaje enviado (2 segundos)
    setTimeout(async () => {
      // 60% probabilidad de aceptación, 40% de rechazo
      const isAccepted = Math.random() > 0.4;
      
      if (isAccepted) {
        // Añadir a amigos
        const updatedFriends = [candidate, ...friends];
        setFriends(updatedFriends);
        saveToStorage("teammatch_friends", updatedFriends);

        // Remover de candidatos
        const updatedCandidates = candidates.filter(c => c.id !== candidate.id);
        setCandidates(updatedCandidates);
        saveToStorage("teammatch_candidates", updatedCandidates);

        setMatchProgress("accepted");
        
        // XP Reward
        await addXp(15, `¡Match deportivo con ${candidate.name}! ⚡`);
      } else {
        setMatchProgress("rejected");
      }
    }, 2000);
  };

  // Handle Tinder Reject (X click)
  const handleReject = () => {
    setCurrentIndex(prev => prev + 1);
  };


  // Handle Accept received match request
  const handleAcceptRequest = async (request: Friend) => {
    // Remover de solicitudes recibidas
    const updatedRequests = receivedRequests.filter(r => r.id !== request.id);
    setReceivedRequests(updatedRequests);
    saveToStorage("teammatch_received_requests", updatedRequests);

    // Agregar a amigos
    const updatedFriends = [request, ...friends];
    setFriends(updatedFriends);
    saveToStorage("teammatch_friends", updatedFriends);

    // XP Reward
    await addXp(10, `¡Aceptaste a ${request.name} como amigo! 🤝`);
  };

  // Handle Reject received match request
  const handleRejectRequest = (request: Friend) => {
    const updatedRequests = receivedRequests.filter(r => r.id !== request.id);
    setReceivedRequests(updatedRequests);
    saveToStorage("teammatch_received_requests", updatedRequests);
  };

  // Filter friends list by search query
  const filteredFriends = friends.filter(friend => 
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.sports.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeCandidate = candidates[currentIndex];

  return (
    <div className="h-full flex flex-col bg-background relative overflow-hidden pb-24">
      {/* Overlay para flujo de Match (Envío, Aceptación o Rechazo) */}
      {matchProgress && activeRequestUser && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-6 text-center animate-in fade-in duration-300">
          <div className="absolute inset-0 sunburst-rays opacity-20 pointer-events-none" />
          
          {matchProgress === "sending" && (
            <div className="space-y-6 max-w-sm flex flex-col items-center animate-in zoom-in-95 duration-300">
              <div className="relative flex items-center justify-center h-24 w-24">
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping duration-1000" />
                <div className="h-16 w-16 rounded-full bg-primary/10 border border-primary/30 text-primary grid place-items-center animate-pulse">
                  <Heart size={32} className="fill-current text-primary animate-bounce" />
                </div>
              </div>
              
              <div className="space-y-2">
                <span className="inline-flex rounded-full bg-primary/20 px-3.5 py-1 text-[10px] font-black uppercase tracking-widest text-primary border border-primary/20">
                  Enviando mensaje de solicitud...
                </span>
                <h3 className="text-xl font-black text-white">Esperando respuesta de {activeRequestUser.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed px-4">
                  Hemos enviado tu solicitud de match. {activeRequestUser.name} está decidiendo en este momento si hacer match contigo...
                </p>
              </div>
            </div>
          )}

          {matchProgress === "accepted" && (
            <div className="space-y-5 max-w-sm flex flex-col items-center animate-in zoom-in-95 duration-500">
              <span className="inline-flex rounded-full bg-emerald-500/25 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-emerald-400 border border-emerald-500/30 animate-pulse">
                ¡SOLICITUD ACEPTADA! 🤝
              </span>
              
              <h2 className="text-4xl font-black text-white tracking-tight drop-shadow-md">
                ¡HICISTE MATCH!
              </h2>
              <p className="text-sm text-white/80">
                ¡Felicidades! {activeRequestUser.name} ha aceptado tu solicitud de match y se ha guardado en tu lista de amigos.
              </p>

              {/* Avatars comparison */}
              <div className="flex items-center justify-center gap-8 py-8 relative">
                <div className="relative h-20 w-20 rounded-full border-4 border-primary bg-secondary grid place-items-center text-4xl shadow-pop animate-in slide-in-from-left duration-500">
                  {(user?.user_metadata?.full_name || "U").substring(0, 2).toUpperCase()}
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-secondary font-black shadow-pop text-lg animate-bounce">
                  ⚡
                </div>
                <div className={`relative h-20 w-20 rounded-full border-4 border-primary bg-gradient-to-tr ${activeRequestUser.gradient} grid place-items-center text-4xl shadow-pop animate-in slide-in-from-right duration-500`}>
                  {activeRequestUser.emoji}
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 w-full text-center space-y-1">
                <div className="text-sm font-bold text-white">{activeRequestUser.name}, {activeRequestUser.age}</div>
                <div className="text-xs text-muted-foreground">{activeRequestUser.location}</div>
                <p className="text-[11px] text-white/70 italic mt-2">"{activeRequestUser.bio}"</p>
              </div>

              <button
                onClick={() => {
                  setMatchProgress(null);
                  setActiveRequestUser(null);
                  setCurrentIndex(prev => prev + 1);
                }}
                className="w-full rounded-2xl gradient-primary py-3.5 text-xs font-black uppercase tracking-wider text-secondary shadow-pop transition-all active:scale-95 mt-4 cursor-pointer"
              >
                ¡Excelente! Continuar buscando
              </button>
            </div>
          )}

          {matchProgress === "rejected" && (
            <div className="space-y-6 max-w-sm flex flex-col items-center animate-in zoom-in-95 duration-500">
              <span className="inline-flex rounded-full bg-red-500/20 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-red-500 border border-red-500/30">
                SOLICITUD RECHAZADA 💔
              </span>
              
              <h2 className="text-3xl font-black text-white tracking-tight">
                Te han rechazado
              </h2>
              
              <div className="h-20 w-20 rounded-full border-4 border-red-500/30 bg-muted/20 grid place-items-center text-4xl shadow-pop">
                😢
              </div>

              <p className="text-xs text-white/80 leading-relaxed px-6 bg-white/5 p-4 rounded-2xl border border-white/5">
                Lo sentimos, **{activeRequestUser.name}** ha rechazado tu solicitud de match en esta ocasión y no se añadirá a tu lista de amigos. <br/>
                <span className="text-[10px] text-white/50 block mt-2">
                  ¡No te desanimes, sigue intentándolo con otros jugadores en la zona!
                </span>
              </p>

              <button
                onClick={() => {
                  setMatchProgress(null);
                  setActiveRequestUser(null);
                  setCurrentIndex(prev => prev + 1);
                }}
                className="w-full rounded-2xl bg-red-500 hover:bg-red-600 text-white py-3.5 text-xs font-black uppercase tracking-wider shadow-pop transition-all active:scale-95 cursor-pointer"
              >
                Seguir Buscando
              </button>
            </div>
          )}
        </div>
      )}


      {/* Header */}
      <header className="flex items-center justify-between px-5 pb-3 pt-12">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Amigos</h1>
          <p className="text-sm text-muted-foreground">Conecta con jugadores afines</p>
        </div>
        <button 
          onClick={onNavigateToProfile}
          className="h-10 w-10 rounded-full bg-card shadow-soft border border-border grid place-items-center text-secondary transition-transform active:scale-95"
        >
          <Users size={18} />
        </button>
      </header>

      {/* Navigation Sub-Tabs */}
      <div className="px-5 pb-3 pt-1">
        <div className="flex gap-1 rounded-full bg-muted p-1 border border-border/40">
          <button
            onClick={() => setActiveSubTab("tinder")}
            className={`flex-1 rounded-full py-2 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              activeSubTab === "tinder" 
                ? "bg-card text-secondary shadow-soft border border-border/20" 
                : "text-muted-foreground"
            }`}
          >
            <Flame size={14} className={activeSubTab === "tinder" ? "text-primary" : ""} />
            Para ti
          </button>
          <button
            onClick={() => setActiveSubTab("friends")}
            className={`flex-1 rounded-full py-2 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              activeSubTab === "friends" 
                ? "bg-card text-secondary shadow-soft border border-border/20" 
                : "text-muted-foreground"
            }`}
          >
            <UserCheck size={14} className={activeSubTab === "friends" ? "text-primary" : ""} />
            Mis amigos ({friends.length})
          </button>
        </div>
      </div>

      {/* Sub-Tab content */}
      <div className="flex-1 overflow-y-auto px-5 pt-3">
        {activeSubTab === "tinder" ? (
          <div className="h-full flex flex-col items-center justify-center pb-4 relative">
            {/* El cargando y el progreso de match unificados se manejan en el overlay de pantalla completa */}


            {loadingProfiles ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider animate-pulse">Cargando perfiles reales...</p>
              </div>
            ) : activeCandidate ? (

              <div className="w-full max-w-sm h-full max-h-[460px] flex flex-col justify-between rounded-3xl bg-card border border-border shadow-pop relative overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Image / Header Gradient block */}
                <div className={`h-40 shrink-0 bg-gradient-to-tr ${activeCandidate.gradient} flex items-center justify-center relative`}>
                  <div className="text-6xl drop-shadow-md select-none">{activeCandidate.emoji}</div>
                  
                  {/* Compatibility Badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-black/40 backdrop-blur-md px-3 py-1 text-[10px] font-black text-white border border-white/10 shadow-pop">
                    <Sparkles size={10} className="text-primary animate-pulse" />
                    <span>{getCompatibilityScore(activeCandidate.sports)}% Compatible</span>
                  </div>

                  {/* Location floating tag */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-1 rounded-full bg-card/90 px-3 py-1.5 text-[10px] font-bold text-secondary border border-border shadow-soft">
                    <MapPin size={10} className="text-primary" />
                    <span>{activeCandidate.location}</span>
                  </div>
                </div>

                {/* Profile Card Body */}
                <div className="flex-1 p-5 space-y-3.5 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-lg font-black text-secondary">{activeCandidate.name}</h3>
                      <span className="text-sm font-bold text-muted-foreground">{activeCandidate.age} años</span>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      "{activeCandidate.bio}"
                    </p>
                  </div>

                  {/* Sports tags */}
                  <div className="space-y-1.5 border-t border-dashed border-border/80 pt-3">
                    <span className="text-[10px] text-muted-foreground font-black uppercase tracking-wider block">Deportes</span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeCandidate.sports.map(sport => (
                        <SportBadge key={sport} sport={sport as any} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tinder Buttons row */}
                <div className="p-4 border-t border-border/60 bg-muted/20 flex justify-center gap-6">
                  {/* Reject button */}
                  <button
                    onClick={handleReject}
                    className="grid h-12 w-12 place-items-center rounded-full bg-card border border-border text-muted-foreground hover:text-rose-500 hover:border-rose-200 active:scale-90 transition-all shadow-soft"
                    title="Descartar"
                  >
                    <X size={20} strokeWidth={2.5} />
                  </button>

                  {/* Like/Match button */}
                  <button
                    onClick={() => handleLike(activeCandidate)}
                    className="grid h-12 w-12 place-items-center rounded-full gradient-primary text-secondary hover:shadow-lg active:scale-90 transition-all shadow-pop"
                    title="¡Hacer Match!"
                  >
                    <Heart size={20} strokeWidth={2.5} className="fill-current" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-border bg-card p-8 text-center space-y-4 max-w-sm w-full py-12">
                <div className="text-5xl">⚡</div>
                <h3 className="text-base font-black text-secondary">¡Eso es todo por hoy!</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Has revisado todos los candidatos cercanos en Caracas. Configura más deportes favoritos en tu perfil para encontrar nuevos partidos y amigos.
                </p>
                <button
                  onClick={() => setCurrentIndex(0)}
                  className="rounded-2xl bg-secondary hover:bg-secondary/90 text-primary py-3 px-6 text-xs font-black uppercase tracking-wider transition-all active:scale-95 shadow-soft border border-primary/20"
                >
                  Reiniciar Lista 🔄
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-5 pb-8">
            {/* Received Requests block */}
            {receivedRequests.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <UserPlus size={14} className="text-primary" /> Solicitudes de Match Recibidas
                </h3>

                <div className="space-y-2">
                  {receivedRequests.map(req => (
                    <div key={req.id} className="rounded-2xl border border-border bg-card p-3 shadow-soft flex items-center justify-between gap-3 animate-in slide-in-from-top duration-300">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Avatar */}
                        <div className={`h-11 w-11 shrink-0 rounded-full bg-gradient-to-tr ${req.gradient} grid place-items-center text-xl shadow-soft`}>
                          {req.emoji}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-sm font-bold text-secondary truncate">{req.name}</span>
                            <span className="text-xs text-muted-foreground">{req.age}</span>
                          </div>
                          <div className="text-[10px] text-primary font-extrabold">{req.location}</div>
                          <p className="text-[10px] text-muted-foreground truncate max-w-[160px]">{req.bio}</p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-1.5 shrink-0">
                        <button
                          onClick={() => handleRejectRequest(req)}
                          className="grid h-8 w-8 place-items-center rounded-xl bg-muted/60 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
                          title="Rechazar"
                        >
                          <UserX size={15} />
                        </button>
                        <button
                          onClick={() => handleAcceptRequest(req)}
                          className="grid h-8 w-8 place-items-center rounded-xl gradient-primary text-secondary shadow-sm"
                          title="Aceptar Match"
                        >
                          <UserCheck size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Friends list block */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <UserCheck size={14} className="text-primary" /> Mis Amigos Guardados
                </h3>
                <span className="text-[10px] font-bold text-muted-foreground">{filteredFriends.length} amigos</span>
              </div>

              {/* Search bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar amigo por nombre, deporte..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-card pl-10 pr-4 py-2.5 text-xs text-secondary outline-none transition-colors focus:border-primary"
                />
                <Search size={14} className="absolute left-3.5 top-3.5 text-muted-foreground" />
              </div>

              {/* Friends list */}
              {filteredFriends.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-card/40 p-8 text-center text-xs text-muted-foreground">
                  {searchQuery ? "No se encontraron amigos con ese criterio" : "Aún no tienes amigos agregados. ¡Busca conexiones en la pestaña 'Para ti'!"}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredFriends.map(friend => (
                    <div key={friend.id} className="rounded-2xl border border-border bg-card p-3 shadow-soft flex items-center justify-between gap-3 hover:border-primary/20 transition-all">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Avatar */}
                        <div className={`h-11 w-11 shrink-0 rounded-full bg-gradient-to-tr ${friend.gradient} grid place-items-center text-xl shadow-soft`}>
                          {friend.emoji}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-sm font-bold text-secondary truncate">{friend.name}</span>
                            <span className="text-xs text-muted-foreground">{friend.age} años</span>
                          </div>
                          <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <MapPin size={9} className="text-primary" />
                            <span>{friend.location}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {friend.sports.map(s => (
                              <span key={s} className="rounded-full bg-muted px-2 py-0.5 text-[8px] font-bold text-muted-foreground border border-border/50">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Chat action button */}
                      <button
                        className="grid h-9 w-9 place-items-center rounded-full bg-secondary/10 text-secondary hover:bg-secondary/20 active:scale-95 transition-all shadow-soft shrink-0 border border-secondary/10"
                        title="Enviar Mensaje"
                      >
                        <MessageSquare size={14} className="text-primary" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
