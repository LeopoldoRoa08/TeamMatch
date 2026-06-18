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
  CheckCircle2,
  Loader2
} from "lucide-react";
import { useCurrentUser } from "@/lib/UserContext";
import { useSettings } from "@/lib/SettingsContext";
import { SportBadge } from "./SportBadge";
import { supabase } from "@/lib/supabase";

interface Friend {
  id: string;
  name: string;
  username: string;
  age: number | string;
  location: string;
  bio: string;
  sports: string[];
  avatar_url: string | null;
  emoji: string;
  gradient: string;
  request_id?: string;
}

export function FriendsScreen({ 
  onNavigateToProfile,
  onSelectEvent 
}: { 
  onNavigateToProfile?: () => void;
  onSelectEvent?: (e: any) => void;
}) {
  const { user, addXp, incrementCarisma } = useCurrentUser();
  const { t, rpgMode } = useSettings();
  const [activeSubTab, setActiveSubTab] = useState<"tinder" | "friends">("tinder");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [candidates, setCandidates] = useState<Friend[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<Friend[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchProgress, setMatchProgress] = useState<null | "sending" | "sent" | "error">(null);
  const [activeRequestUser, setActiveRequestUser] = useState<Friend | null>(null);
  const [acceptedMatchUser, setAcceptedMatchUser] = useState<Friend | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return;
      try {
        setLoadingProfiles(true);

        const { data: dbProfiles, error: profilesError } = await supabase
          .from("profiles")
          .select("*");
        
        if (profilesError) throw profilesError;

        const { data: requestsData, error: requestsError } = await supabase
          .from("friend_requests")
          .select("*")
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);
          
        if (requestsError && requestsError.code !== '42P01') { 
          console.error("Error fetching requests", requestsError);
        }

        const requests = requestsData || [];
        const myFriends: Friend[] = [];
        const myReceivedReqs: Friend[] = [];
        const existingRelations = new Set<string>();

        requests.forEach((req: any) => {
          const otherUserId = req.sender_id === user.id ? req.receiver_id : req.sender_id;
          existingRelations.add(otherUserId);

          const profile = dbProfiles?.find(p => p.id === otherUserId);
          if (!profile) return;

          const mappedProfile = mapProfile(profile, req.id);

          if (req.status === 'accepted') {
            myFriends.push(mappedProfile);
          } else if (req.status === 'pending' && req.receiver_id === user.id) {
            myReceivedReqs.push(mappedProfile);
          }
        });

        setFriends(myFriends);
        setReceivedRequests(myReceivedReqs);

        const candidatesFiltered = (dbProfiles || [])
          .filter((p: any) => p.id !== user.id && !existingRelations.has(p.id))
          .map((p: any) => mapProfile(p));
          
        setCandidates(candidatesFiltered);

      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoadingProfiles(false);
      }
    }

    if (user) {
      fetchData();
      
      const channel = supabase
        .channel('public:friend_requests')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'friend_requests' }, () => {
          fetchData();
        })
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      setLoadingProfiles(false);
    }
  }, [user]);

  function mapProfile(p: any, requestId?: string): Friend {
    const idHash = p.id ? p.id.split("-").join("") : p.username;
    let charCodeSum = 0;
    for (let i = 0; i < idHash.length; i++) {
      charCodeSum += idHash.charCodeAt(i);
    }
    const emojis = ["🏃‍♂️", "🎯", "🥊", "🏄", "🧗‍♀️", "🛹", "🪼", "🪨", "🐾", "🐺"];
    const emoji = emojis[charCodeSum % emojis.length];
    const gradients = [
      "from-pink-500 to-rose-400", "from-emerald-500 to-teal-400", 
      "from-blue-500 to-cyan-400", "from-purple-500 to-indigo-400",
      "from-amber-500 to-orange-400", "from-sky-500 to-blue-600",
      "from-orange-400 to-red-500"
    ];
    const gradient = gradients[charCodeSum % gradients.length];

    let name = p.full_name || "";
    if (!name) {
      if (p.username && p.username.includes("@")) {
        name = p.username.split("@")[0].split(/[._-]/).map((n: string) => n.charAt(0).toUpperCase() + n.slice(1)).join(" ");
      } else if (p.username) {
        name = p.username;
      }
    }

    return {
      id: p.id,
      name: name || (t("friends.defaultName") || "Deportista"),
      username: p.username,
      age: p.age || "?",
      location: p.location || (t("friends.unknownLocation") || "Ubicación desconocida"),
      bio: p.description || (t("friends.noDescription") || "Sin descripción"),
      sports: p.preferred_sports || [],
      avatar_url: p.avatar_url || null,
      emoji,
      gradient,
      request_id: requestId
    };
  }

  const userSports = user?.user_metadata?.preferred_sports || [];

  const getCompatibilityScore = (candidateSports: string[]) => {
    if (userSports.length === 0 || candidateSports.length === 0) {
      return 50;
    }
    const common = candidateSports.filter(s => userSports.includes(s)).length;
    const score = Math.round(50 + (common / Math.max(1, userSports.length)) * 48);
    return Math.min(99, score);
  };

  const handleLike = async (candidate: Friend) => {
    if (!user?.id) return;
    setActiveRequestUser(candidate);
    setMatchProgress("sending");
    
    try {
      const { error } = await supabase.from('friend_requests').insert({
        sender_id: user.id,
        receiver_id: candidate.id,
        status: 'pending'
      });
      
      if (error) {
         console.error("Error creating friend request:", error);
         setMatchProgress("error");
         return;
      }
      
      setCandidates(candidates.filter(c => c.id !== candidate.id));
      
      setMatchProgress("sent");
      
    } catch (err) {
      console.error(err);
      setMatchProgress("error");
    }
  };

  const handleReject = () => {
    setCurrentIndex(prev => prev + 1);
  };

  const handleAcceptRequest = async (request: Friend) => {
    if (!request.request_id) return;
    try {
      const { error } = await supabase
        .from('friend_requests')
        .update({ status: 'accepted' })
        .eq('id', request.request_id);

      if (error) throw error;
      
      setReceivedRequests(receivedRequests.filter(r => r.id !== request.id));
      setFriends([request, ...friends]);
      
      if (rpgMode) {
        await addXp(15, t("friends.acceptedXp") ? t("friends.acceptedXp").replace("{name}", request.name) : `¡Aceptaste a ${request.name} como amigo! 🤝`);
        if (incrementCarisma) {
          await incrementCarisma(1);
        }
      }
      
      setAcceptedMatchUser(request);
      setTimeout(() => {
        setAcceptedMatchUser(null);
      }, 30000); // 30 seconds
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const handleRejectRequest = async (request: Friend) => {
    if (!request.request_id) return;
    try {
      const { error } = await supabase
        .from('friend_requests')
        .update({ status: 'rejected' })
        .eq('id', request.request_id);

      if (error) throw error;
      
      setReceivedRequests(receivedRequests.filter(r => r.id !== request.id));
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  const filteredFriends = friends.filter(friend => 
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.sports.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeCandidate = candidates[currentIndex];

  const renderAvatar = (friend: Friend, sizeClass: string = "h-11 w-11 text-xl") => {
    if (friend.avatar_url) {
      return (
        <img 
          src={friend.avatar_url} 
          alt={friend.name} 
          className={`${sizeClass} shrink-0 rounded-full object-cover shadow-soft border-2 border-white/10`} 
        />
      );
    }
    return (
      <div className={`${sizeClass} shrink-0 rounded-full bg-gradient-to-tr ${friend.gradient} grid place-items-center shadow-soft`}>
        {friend.emoji}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-background relative overflow-hidden pb-24">
      {matchProgress && activeRequestUser && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-6 text-center animate-in fade-in duration-300">
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 40%, rgba(16,185,129,0.15) 0%, transparent 70%)' }} />
          
          {matchProgress === "sending" && (
            <div className="space-y-6 max-w-sm flex flex-col items-center animate-in zoom-in-95 duration-300 relative z-10">
              <div className="relative flex items-center justify-center h-24 w-24">
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping duration-1000" />
                <div className="h-16 w-16 rounded-full bg-primary/10 border border-primary/30 text-primary grid place-items-center animate-pulse">
                  <Heart size={32} className="fill-current text-primary animate-bounce" />
                </div>
              </div>
              
              <div className="space-y-2">
                <span className="inline-flex rounded-full bg-primary/20 px-3.5 py-1 text-[10px] font-black uppercase tracking-widest text-primary border border-primary/20">
                  {t("friends.sendingRequest") || "Enviando solicitud..."}
                </span>
                <h3 className="text-xl font-black text-white">{t("friends.connectingWith") || "Conectando con"} {activeRequestUser.name}</h3>
              </div>
            </div>
          )}

          {matchProgress === "sent" && (
            <div className="space-y-6 max-w-sm flex flex-col items-center animate-in zoom-in-95 duration-500 relative z-10">
              <span className="inline-flex rounded-full bg-emerald-500/25 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-emerald-400 border border-emerald-500/30 animate-pulse">
                {t("friends.requestSent") || "¡SOLICITUD ENVIADA! 🤝"}
              </span>

              <div className="grid h-24 w-24 place-items-center rounded-full bg-emerald-500 text-white shadow-pop ring-8 ring-emerald-500/20">
                <CheckCircle2 size={48} strokeWidth={2.5} />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-md">
                  {t("friends.sent") || "¡Enviado!"}
                </h2>
                <p className="text-sm text-white/80 px-4 leading-relaxed">
                  {t("friends.requestDesc") ? t("friends.requestDesc").replace("{name}", activeRequestUser.name) : `Has enviado una solicitud de Match a ${activeRequestUser.name}. Ahora debes esperar a que la apruebe para aparecer en tu lista de amigos.`}
                </p>
              </div>

              <div className="flex items-center justify-center gap-8 py-6 relative">
                <div className="relative h-20 w-20 rounded-full border-4 border-primary bg-secondary grid place-items-center text-4xl shadow-pop animate-in slide-in-from-left duration-500 overflow-hidden">
                  {user?.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover" />
                  ) : (
                    (user?.user_metadata?.full_name || "U").substring(0, 2).toUpperCase()
                  )}
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-secondary font-black shadow-pop text-lg animate-bounce">
                  ⚔️
                </div>
                <div className="relative h-20 w-20 shadow-pop animate-in slide-in-from-right duration-500">
                   {renderAvatar(activeRequestUser, "h-20 w-20 text-4xl")}
                </div>
              </div>

              <button
                onClick={() => {
                  setMatchProgress(null);
                  setActiveRequestUser(null);
                  setCurrentIndex(prev => prev + 1);
                }}
                className="w-full rounded-2xl gradient-primary py-3.5 text-xs font-black uppercase tracking-wider text-secondary shadow-pop transition-all active:scale-95 mt-4 cursor-pointer"
              >
                {t("friends.gotIt") || "¡Entendido!"}
              </button>
            </div>
          )}

          {matchProgress === "error" && (
            <div className="space-y-6 max-w-sm flex flex-col items-center animate-in zoom-in-95 duration-500 relative z-10">
              <span className="inline-flex rounded-full bg-red-500/20 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-red-500 border border-red-500/30">
                {(t("common.error") || "ERROR").toUpperCase()} 💔
              </span>
              
              <h2 className="text-3xl font-black text-white tracking-tight">
                {t("friends.problem") || "Hubo un problema"}
              </h2>
              
              <p className="text-xs text-white/80 leading-relaxed px-6 bg-white/5 p-4 rounded-2xl border border-white/5">
                {t("friends.errorDesc") || "No pudimos enviar tu solicitud. Verifica tu conexión o asegúrate de haber creado la tabla de friend_requests."}
              </p>

              <button
                onClick={() => {
                  setMatchProgress(null);
                  setActiveRequestUser(null);
                }}
                className="w-full rounded-2xl bg-red-500 hover:bg-red-600 text-white py-3.5 text-xs font-black uppercase tracking-wider shadow-pop transition-all active:scale-95 cursor-pointer"
              >
                {t("common.close") || "Cerrar"}
              </button>
            </div>
          )}
        </div>
      )}

      {acceptedMatchUser && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-6 text-center animate-in fade-in duration-300 backdrop-blur-sm">
          <div className="absolute inset-0 sunburst-rays opacity-20 pointer-events-none" />
          
          <div className="space-y-6 max-w-sm flex flex-col items-center animate-in zoom-in-95 duration-500">
            <span className="inline-flex rounded-full bg-emerald-500/25 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-emerald-400 border border-emerald-500/30 animate-pulse">
              {t("friends.newMatch") || "¡NUEVO MATCH! 🤝"}
            </span>
            
            <h2 className="text-4xl font-black text-white tracking-tight drop-shadow-md">
              {t("friends.requestAccepted") || "¡SOLICITUD ACEPTADA!"}
            </h2>
            <p className="text-sm text-white/80 px-4">
              {t("friends.nowFriends") ? t("friends.nowFriends").replace("{name}", acceptedMatchUser.name) : `¡Tú y ${acceptedMatchUser.name} ahora son amigos! Han ganado +1 punto de Carisma.`}
            </p>

            <div className="flex items-center justify-center gap-8 py-8 relative">
              <div className="relative h-24 w-24 rounded-full border-4 border-primary bg-secondary grid place-items-center text-5xl shadow-pop animate-in slide-in-from-left duration-500 overflow-hidden">
                {user?.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover" />
                ) : (
                  (user?.user_metadata?.full_name || "U").substring(0, 2).toUpperCase()
                )}
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-secondary font-black shadow-pop text-2xl animate-bounce">
                <Heart className="fill-current" size={24} />
              </div>
              <div className="relative h-24 w-24 shadow-pop animate-in slide-in-from-right duration-500">
                 {renderAvatar(acceptedMatchUser, "h-24 w-24 text-5xl")}
              </div>
            </div>

            <button
              onClick={() => setAcceptedMatchUser(null)}
              className="w-full rounded-2xl gradient-primary py-3.5 text-xs font-black uppercase tracking-wider text-secondary shadow-pop transition-all active:scale-95 mt-4 cursor-pointer"
            >
              {t("common.close") || "Cerrar"}
            </button>
          </div>
        </div>
      )}

      <header className="flex items-center justify-between px-5 pb-3 pt-12">
        <div>
          <h1 className="text-2xl font-bold text-secondary">{t("friends.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("friends.findPlayers")}</p>
        </div>
        <button 
          onClick={onNavigateToProfile}
          className="h-10 w-10 rounded-full bg-card shadow-soft border border-border grid place-items-center text-secondary transition-transform active:scale-95"
        >
          <Users size={18} />
        </button>
      </header>

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
            {t("friends.forYou") || "Para ti"}
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
            {t("friends.myFriends")} ({friends.length})
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-3">
        {activeSubTab === "tinder" ? (
          <div className="h-full flex flex-col items-center justify-center pb-4 relative">
            {loadingProfiles ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider animate-pulse">{t("friends.loadingProfiles") || "Cargando perfiles reales..."}</p>
              </div>
            ) : activeCandidate ? (
              <div className="w-full max-w-sm h-full max-h-[460px] flex flex-col justify-between rounded-3xl bg-card border border-border shadow-pop relative overflow-hidden animate-in zoom-in-95 duration-300">
                <div className={`h-40 shrink-0 flex items-center justify-center relative bg-gradient-to-tr ${activeCandidate.gradient}`}>
                  {activeCandidate.avatar_url ? (
                    <img src={activeCandidate.avatar_url} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="text-6xl drop-shadow-md select-none">{activeCandidate.emoji}</div>
                  )}
                  
                  <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-black/40 backdrop-blur-md px-3 py-1 text-[10px] font-black text-white border border-white/10 shadow-pop">
                    <Sparkles size={10} className="text-primary animate-pulse" />
                    <span>{getCompatibilityScore(activeCandidate.sports)}% {t("friends.compatible") || "Compatible"}</span>
                  </div>

                  <div className="absolute bottom-4 left-4 flex items-center gap-1 rounded-full bg-card/90 px-3 py-1.5 text-[10px] font-bold text-secondary border border-border shadow-soft">
                    <MapPin size={10} className="text-primary" />
                    <span>{activeCandidate.location}</span>
                  </div>
                </div>

                <div className="flex-1 p-5 space-y-3.5 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-lg font-black text-secondary">{activeCandidate.name}</h3>
                      <span className="text-sm font-bold text-muted-foreground">{activeCandidate.age} {t("common.years") || "años"}</span>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      "{activeCandidate.bio}"
                    </p>
                  </div>

                  <div className="space-y-1.5 border-t border-dashed border-border/80 pt-3">
                    <span className="text-[10px] text-muted-foreground font-black uppercase tracking-wider block">{t("sports.title") || "Deportes"}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeCandidate.sports.map(sport => (
                        <SportBadge key={sport} sport={sport as any} />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-border/60 bg-muted/20 flex justify-center gap-6">
                  <button
                    onClick={handleReject}
                    className="grid h-12 w-12 place-items-center rounded-full bg-card border border-border text-muted-foreground hover:text-rose-500 hover:border-rose-200 active:scale-90 transition-all shadow-soft"
                    title={t("friends.reject") || "Descartar"}
                  >
                    <X size={20} strokeWidth={2.5} />
                  </button>

                  <button
                    onClick={() => handleLike(activeCandidate)}
                    className="grid h-12 w-12 place-items-center rounded-full gradient-primary text-secondary hover:shadow-lg active:scale-90 transition-all shadow-pop"
                    title={t("friends.makeMatch") || "¡Hacer Match!"}
                  >
                    <Heart size={20} strokeWidth={2.5} className="fill-current" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-border bg-card p-8 text-center space-y-4 max-w-sm w-full py-12">
                <div className="text-5xl">⚔️</div>
                <h4 className="text-lg font-black text-secondary">{t("friends.noFriends")}</h4>
                <p className="text-sm text-muted-foreground mt-2 max-w-[250px] mx-auto">
                  {t("friends.findPlayersDescription")}
                </p>
                <button
                  onClick={() => setCurrentIndex(0)}
                  className="rounded-2xl bg-secondary hover:bg-secondary/90 text-primary py-3 px-6 text-xs font-black uppercase tracking-wider transition-all active:scale-95 shadow-soft border border-primary/20"
                >
                  {t("friends.resetList")} 🔄
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-5 pb-8">
            {receivedRequests.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <UserPlus size={14} className="text-primary" /> {t("friends.requests")}
                </h3>

                <div className="space-y-2">
                  {receivedRequests.map(req => (
                    <div key={req.id} className="rounded-2xl border border-border bg-card p-3 shadow-soft flex items-center justify-between gap-3 animate-in slide-in-from-top duration-300">
                      <div className="flex items-center gap-3 min-w-0">
                        {renderAvatar(req, "h-11 w-11 text-xl")}
                        <div className="min-w-0">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-sm font-bold text-secondary truncate">{req.name}</span>
                            <span className="text-xs text-muted-foreground">{req.age} {t("common.years")}</span>
                          </div>
                          <div className="text-[10px] text-primary font-extrabold">{req.location}</div>
                          <p className="text-[10px] text-muted-foreground truncate max-w-[160px]">{req.bio}</p>
                        </div>
                      </div>

                      <div className="flex gap-1.5 shrink-0">
                        <button
                          onClick={() => handleRejectRequest(req)}
                          className="grid h-8 w-8 place-items-center rounded-xl bg-muted/60 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
                          title={t("friends.reject")}
                        >
                          <UserX size={15} />
                        </button>
                        <button
                          onClick={() => handleAcceptRequest(req)}
                          className="grid h-8 w-8 place-items-center rounded-xl gradient-primary text-secondary shadow-sm"
                          title={t("friends.accept")}
                        >
                          <UserCheck size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <UserCheck size={14} className="text-primary" /> {t("friends.mySavedFriends") || "Mis Amigos Guardados"}
                </h3>
                <span className="text-[10px] font-bold text-muted-foreground">{filteredFriends.length} {t("friends.friendsCount") || "amigos"}</span>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder={t("friends.searchPlaceholder") || "Buscar amigo por nombre, deporte..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-card pl-10 pr-4 py-2.5 text-xs text-secondary outline-none transition-colors focus:border-primary"
                />
                <Search size={14} className="absolute left-3.5 top-3.5 text-muted-foreground" />
              </div>

              {filteredFriends.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-card/40 p-8 text-center text-xs text-muted-foreground">
                  {searchQuery ? (t("friends.searchEmpty") || "No se encontraron amigos con ese criterio") : (t("friends.noFriendsAdded") || "Aún no tienes amigos agregados. ¡Busca conexiones en la pestaña 'Para ti'!")}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredFriends.map(friend => (
                    <div key={friend.id} className="rounded-2xl border border-border bg-card p-3 shadow-soft flex items-center justify-between gap-3 hover:border-primary/20 transition-all">
                      <div className="flex items-center gap-3 min-w-0">
                        {renderAvatar(friend, "h-11 w-11 text-xl")}
                        <div className="min-w-0">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-sm font-bold text-secondary truncate">{friend.name}</span>
                            <span className="text-xs text-muted-foreground">{friend.age} {t("common.years") || "años"}</span>
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

                      <button
                        className="grid h-9 w-9 place-items-center rounded-full bg-secondary/10 text-secondary hover:bg-secondary/20 active:scale-95 transition-all shadow-soft shrink-0 border border-secondary/10"
                        title={t("friends.sendMessage") || "Enviar Mensaje"}
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
