import { useState, useEffect } from "react";
import { Shield, Plus, Users, Search, UserPlus, Check, X, Loader2, Trophy, ArrowLeft, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useCurrentUser } from "@/lib/UserContext";
import type { Clan, ClanMember, Sport } from "./types";
import { SportBadge } from "./SportBadge";

export function ClansScreen({
  onNavigateToProfile,
  onSelectEvent
}: {
  onNavigateToProfile?: () => void;
  onSelectEvent?: (e: any) => void;
}) {
  const { user } = useCurrentUser();
  const [activeTab, setActiveTab] = useState<"mis-clanes" | "crear" | "unirse">("mis-clanes");
  
  const [clans, setClans] = useState<Clan[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Selected Clan View
  const [selectedClan, setSelectedClan] = useState<Clan | null>(null);
  const [clanMembers, setClanMembers] = useState<ClanMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [friends, setFriends] = useState<any[]>([]);

  // Create Form
  const [createData, setCreateData] = useState({ name: "", sport: "Pádel" as Sport, primary: "#32CD32", secondary: "#1a1a1a" });
  const [creating, setCreating] = useState(false);

  // Join Form
  const [inviteCode, setInviteCode] = useState("");
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (user?.id) fetchMyClans();
  }, [user]);

  useEffect(() => {
    if (selectedClan) fetchClanMembers(selectedClan.id);
  }, [selectedClan]);

  async function fetchMyClans() {
    if (!user?.id) return;
    setLoading(true);
    try {
      // Clanes donde soy capitán
      const { data: capClans } = await supabase.from('clans').select('*').eq('captain_id', user.id);
      
      // Clanes donde soy miembro
      const { data: memberRows } = await supabase.from('clan_members').select('clan_id').eq('user_id', user.id).eq('status', 'approved');
      
      let allClans = [...(capClans || [])] as Clan[];
      
      if (memberRows && memberRows.length > 0) {
        const clanIds = memberRows.map((r: any) => r.clan_id);
        const { data: memberClans } = await supabase.from('clans').select('*').in('id', clanIds);
        if (memberClans) {
          memberClans.forEach(mc => {
            if (!allClans.find(c => c.id === mc.id)) allClans.push(mc);
          });
        }
      }
      setClans(allClans);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  async function fetchClanMembers(clanId: string) {
    setLoadingMembers(true);
    try {
      const { data } = await supabase
        .from('clan_members')
        .select(`*, profiles:user_id(username, avatar_url, rating, full_name)`)
        .eq('clan_id', clanId);
      
      if (data) setClanMembers(data as any);
    } catch (e) {
      console.error(e);
    }
    setLoadingMembers(false);
  }

  async function handleCreateClan(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.id) return;
    setCreating(true);
    
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    try {
      const { data: clan, error } = await supabase.from('clans').insert({
        name: createData.name,
        sport: createData.sport,
        captain_id: user.id,
        invite_code: code,
        hex_primary: createData.primary,
        hex_secondary: createData.secondary
      }).select().single();
      
      if (error) throw error;
      
      await supabase.from('clan_members').insert({
        clan_id: clan.id,
        user_id: user.id,
        status: 'approved'
      });
      
      alert("¡Clan creado exitosamente!");
      setCreateData({ name: "", sport: "Pádel", primary: "#32CD32", secondary: "#1a1a1a" });
      setActiveTab("mis-clanes");
      fetchMyClans();
    } catch (err: any) {
      if (err.code === '23505') alert("Ya existe un clan con ese nombre");
      else alert("Error al crear clan");
    }
    setCreating(false);
  }

  async function handleJoinClan(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.id || !inviteCode) return;
    setJoining(true);
    try {
      const { data: clan } = await supabase.from('clans').select('id').eq('invite_code', inviteCode.toUpperCase()).single();
      if (!clan) {
        alert("Código inválido");
        setJoining(false);
        return;
      }
      
      const { error } = await supabase.from('clan_members').insert({
        clan_id: clan.id,
        user_id: user.id,
        status: 'pending'
      });
      
      if (error && error.code === '23505') alert("Ya enviaste una solicitud a este clan");
      else if (error) throw error;
      else alert("Solicitud enviada al capitán del clan");
      
      setInviteCode("");
    } catch (err) {
      alert("Error al unirse al clan");
    }
    setJoining(false);
  }

  async function handleApproveMember(memberId: string) {
    await supabase.from('clan_members').update({ status: 'approved' }).eq('id', memberId);
    if (selectedClan) fetchClanMembers(selectedClan.id);
  }

  async function handleRejectMember(memberId: string) {
    await supabase.from('clan_members').update({ status: 'rejected' }).eq('id', memberId);
    if (selectedClan) fetchClanMembers(selectedClan.id);
  }

  async function fetchFriendsToInvite() {
    if (!user?.id) return;
    try {
      const { data: requestsData } = await supabase
        .from('friend_requests')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .eq('status', 'accepted');

      const friendIds = (requestsData || []).map((r: any) =>
        r.sender_id === user.id ? r.receiver_id : r.sender_id
      );

      if (friendIds.length > 0) {
        const { data: profiles } = await supabase.from('profiles').select('*').in('id', friendIds);
        setFriends(profiles || []);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleInviteFriend(friendId: string) {
    if (!selectedClan || !user?.id) return;
    try {
      await supabase.from('clan_members').insert({
        clan_id: selectedClan.id,
        user_id: friendId,
        status: 'approved' // Amigos se unen de una vez si los invita el capi
      });
      alert("Amigo añadido al clan");
      fetchClanMembers(selectedClan.id);
      setShowInviteModal(false);
    } catch (e: any) {
      if (e.code === '23505') alert("Ya está en el clan");
      else alert("Error al añadir");
    }
  }

  // --- RENDERS ---

  if (selectedClan) {
    const isCaptain = selectedClan.captain_id === user?.id;
    const approvedMembers = clanMembers.filter(m => m.status === 'approved');
    const pendingMembers = clanMembers.filter(m => m.status === 'pending');

    return (
      <div className="h-full flex flex-col bg-background relative overflow-y-auto pb-24">
        <header className="sticky top-0 z-10 flex items-center gap-3 bg-background/90 px-5 py-4 backdrop-blur-md border-b border-border">
          <button onClick={() => setSelectedClan(null)} className="h-10 w-10 grid place-items-center rounded-full glass">
            <ArrowLeft size={18} className="text-secondary" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-secondary">{selectedClan.name}</h1>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <SportBadge sport={selectedClan.sport} />
            </div>
          </div>
        </header>

        <div className="p-5 space-y-6">
          <div className="flex flex-col items-center p-6 bg-card rounded-3xl border border-border shadow-soft relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ background: `linear-gradient(45deg, ${selectedClan.hex_primary}, ${selectedClan.hex_secondary})` }} />
            <div 
              className="h-24 w-24 rounded-full flex items-center justify-center text-4xl shadow-pop z-10"
              style={{ background: `linear-gradient(135deg, ${selectedClan.hex_primary}, ${selectedClan.hex_secondary})` }}
            >
              🛡️
            </div>
            <h2 className="text-2xl font-black text-secondary mt-4 z-10">{selectedClan.name}</h2>
            {isCaptain && (
              <div className="mt-2 text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20 z-10">
                Código Invitación: <span className="font-mono text-secondary">{selectedClan.invite_code}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-card border border-border rounded-2xl p-3 text-center shadow-soft">
              <div className="text-2xl font-black text-secondary">{selectedClan.matches_played}</div>
              <div className="text-[10px] text-muted-foreground font-bold uppercase">Jugados</div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-3 text-center shadow-soft">
              <div className="text-2xl font-black text-emerald-500">{selectedClan.matches_won}</div>
              <div className="text-[10px] text-emerald-500/70 font-bold uppercase">Ganados</div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-3 text-center shadow-soft">
              <div className="text-2xl font-black text-rose-500">{selectedClan.matches_lost}</div>
              <div className="text-[10px] text-rose-500/70 font-bold uppercase">Perdidos</div>
            </div>
          </div>

          {isCaptain && pendingRequestsSection()}

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-secondary flex items-center gap-2">
                <Users size={16} className="text-primary"/> Miembros ({approvedMembers.length})
              </h3>
              {isCaptain && (
                <button 
                  onClick={() => { fetchFriendsToInvite(); setShowInviteModal(true); }}
                  className="text-xs font-black text-primary bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors"
                >
                  + Invitar Amigos
                </button>
              )}
            </div>
            
            <div className="space-y-2">
              {loadingMembers ? (
                 <div className="text-center py-4"><Loader2 className="animate-spin text-primary inline" /></div>
              ) : (
                approvedMembers.map(m => (
                  <div key={m.id} className="flex items-center gap-3 bg-card p-3 rounded-2xl border border-border shadow-soft">
                    {m.profiles?.avatar_url ? (
                      <img src={m.profiles.avatar_url} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full gradient-primary grid place-items-center font-bold text-secondary">
                         {m.profiles?.username?.substring(0, 2).toUpperCase() || "U"}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="text-sm font-bold text-secondary flex items-center gap-2">
                        {m.profiles?.full_name || m.profiles?.username?.split('@')[0]}
                        {m.user_id === selectedClan.captain_id && <span className="text-[10px] bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded-full font-black uppercase">Capitán</span>}
                      </div>
                      <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Star size={10} className="fill-accent text-accent" /> {m.profiles?.rating || "5.0"}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modal de Amigos */}
        {showInviteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
             <div className="bg-secondary p-5 rounded-3xl border border-border w-full max-w-sm max-h-[80vh] flex flex-col">
                <h3 className="text-lg font-bold text-white mb-4">Invitar Amigos</h3>
                <div className="flex-1 overflow-y-auto space-y-2">
                   {friends.length === 0 ? (
                     <div className="text-center text-white/50 text-xs py-4">No tienes amigos para invitar.</div>
                   ) : (
                     friends.map(f => (
                       <div key={f.id} className="flex items-center justify-between bg-card p-3 rounded-2xl border border-border">
                          <span className="text-sm font-bold text-secondary truncate max-w-[150px]">{f.full_name || f.username}</span>
                          <button onClick={() => handleInviteFriend(f.id)} className="bg-primary text-secondary text-xs font-black px-3 py-1.5 rounded-full">Agregar</button>
                       </div>
                     ))
                   )}
                </div>
                <button onClick={() => setShowInviteModal(false)} className="mt-4 w-full bg-muted text-muted-foreground py-3 rounded-2xl font-bold">Cerrar</button>
             </div>
          </div>
        )}
      </div>
    );

    function pendingRequestsSection() {
      if (pendingMembers.length === 0) return null;
      return (
        <div className="bg-card border border-border p-4 rounded-2xl shadow-soft space-y-3">
          <h3 className="text-xs font-black uppercase text-secondary flex items-center gap-2">
             <span className="bg-rose-500 text-white px-2 py-0.5 rounded-full">{pendingMembers.length}</span>
             Solicitudes de Unión
          </h3>
          <div className="space-y-2">
            {pendingMembers.map(req => (
               <div key={req.id} className="flex items-center justify-between bg-muted/30 p-2 rounded-xl">
                  <span className="text-xs font-bold text-secondary truncate max-w-[120px]">{req.profiles?.full_name || req.profiles?.username}</span>
                  <div className="flex gap-1">
                     <button onClick={() => handleRejectMember(req.id)} className="w-8 h-8 rounded-full bg-rose-500/10 text-rose-500 grid place-items-center"><X size={14}/></button>
                     <button onClick={() => handleApproveMember(req.id)} className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 grid place-items-center"><Check size={14}/></button>
                  </div>
               </div>
            ))}
          </div>
        </div>
      );
    }
  }

  // --- MAIN VIEW ---
  return (
    <div className="h-full flex flex-col bg-background relative overflow-hidden pb-24">
      <header className="px-5 pt-12 pb-3">
        <h1 className="text-2xl font-bold text-secondary">Clanes</h1>
        <p className="text-sm text-muted-foreground">Tu equipo permanente</p>
      </header>

      <div className="px-5 pb-4">
        <div className="flex gap-1 rounded-full bg-muted p-1 border border-border/40">
          <button onClick={() => setActiveTab("mis-clanes")} className={`flex-1 rounded-full py-2.5 text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${activeTab === "mis-clanes" ? "bg-card text-secondary shadow-soft border border-border/20" : "text-muted-foreground"}`}>
            <Shield size={14} className={activeTab === "mis-clanes" ? "text-primary" : ""} /> Mis Clanes
          </button>
          <button onClick={() => setActiveTab("crear")} className={`flex-1 rounded-full py-2.5 text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${activeTab === "crear" ? "bg-card text-secondary shadow-soft border border-border/20" : "text-muted-foreground"}`}>
            <Plus size={14} className={activeTab === "crear" ? "text-primary" : ""} /> Crear Clan
          </button>
          <button onClick={() => setActiveTab("unirse")} className={`flex-1 rounded-full py-2.5 text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${activeTab === "unirse" ? "bg-card text-secondary shadow-soft border border-border/20" : "text-muted-foreground"}`}>
            <Search size={14} className={activeTab === "unirse" ? "text-primary" : ""} /> Unirse
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5">
        {activeTab === "mis-clanes" && (
          <div className="space-y-3">
             {loading ? (
                <div className="text-center py-10"><Loader2 className="animate-spin text-primary mx-auto" /></div>
             ) : clans.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-3xl border border-dashed border-border mt-4">
                   <Shield size={48} className="mx-auto text-muted-foreground/30 mb-3" />
                   <p className="text-sm font-bold text-secondary">No perteneces a ningún clan</p>
                   <button onClick={() => setActiveTab("crear")} className="mt-4 text-xs font-black text-primary bg-primary/10 px-4 py-2 rounded-full">Crea tu primer clan</button>
                </div>
             ) : (
                clans.map(clan => (
                   <div key={clan.id} onClick={() => setSelectedClan(clan)} className="bg-card p-4 rounded-3xl border border-border shadow-soft flex items-center gap-4 cursor-pointer hover:border-primary/30 transition-colors">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-inner shrink-0" style={{ background: `linear-gradient(135deg, ${clan.hex_primary}, ${clan.hex_secondary})` }}>
                        🛡️
                      </div>
                      <div className="flex-1 min-w-0">
                         <h3 className="text-lg font-black text-secondary truncate">{clan.name}</h3>
                         <div className="text-xs text-muted-foreground flex gap-2 items-center mt-1">
                           <SportBadge sport={clan.sport} />
                           {clan.captain_id === user?.id && <span className="bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded-full font-black text-[9px] uppercase">Capitán</span>}
                         </div>
                      </div>
                   </div>
                ))
             )}
          </div>
        )}

        {activeTab === "crear" && (
          <form onSubmit={handleCreateClan} className="space-y-4 bg-card p-5 rounded-3xl border border-border shadow-soft">
             <div>
                <label className="text-xs font-black uppercase text-muted-foreground mb-1 block">Nombre del Clan</label>
                <input required value={createData.name} onChange={e => setCreateData({...createData, name: e.target.value})} placeholder="Ej: Los Invencibles" className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm text-secondary outline-none focus:border-primary" />
             </div>
             <div>
                <label className="text-xs font-black uppercase text-muted-foreground mb-1 block">Deporte Principal</label>
                <select value={createData.sport} onChange={e => setCreateData({...createData, sport: e.target.value as Sport})} className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm text-secondary outline-none focus:border-primary">
                   <option value="Pádel">Pádel</option>
                   <option value="Fútbol">Fútbol</option>
                   <option value="Tenis">Tenis</option>
                   <option value="Running">Running</option>
                   <option value="Vóleibol">Vóleibol</option>
                </select>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="text-xs font-black uppercase text-muted-foreground mb-1 block">Color Primario</label>
                   <div className="flex items-center gap-2">
                     <input type="color" value={createData.primary} onChange={e => setCreateData({...createData, primary: e.target.value})} className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0 p-0" />
                     <span className="text-xs font-mono text-secondary">{createData.primary}</span>
                   </div>
                </div>
                <div>
                   <label className="text-xs font-black uppercase text-muted-foreground mb-1 block">Color Secundario</label>
                   <div className="flex items-center gap-2">
                     <input type="color" value={createData.secondary} onChange={e => setCreateData({...createData, secondary: e.target.value})} className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0 p-0" />
                     <span className="text-xs font-mono text-secondary">{createData.secondary}</span>
                   </div>
                </div>
             </div>
             
             <button disabled={creating} type="submit" className="w-full mt-4 gradient-primary text-secondary py-3.5 rounded-xl font-black uppercase shadow-pop active:scale-95 transition-all">
                {creating ? "Creando..." : "Crear Clan"}
             </button>
          </form>
        )}

        {activeTab === "unirse" && (
          <form onSubmit={handleJoinClan} className="space-y-4 bg-card p-5 rounded-3xl border border-border shadow-soft text-center py-8">
             <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <Search size={28} />
             </div>
             <h3 className="text-lg font-black text-secondary">Unirse a un Clan</h3>
             <p className="text-xs text-muted-foreground">Pídele al capitán de tu equipo el código de invitación e ingrésalo abajo.</p>
             <input required value={inviteCode} onChange={e => setInviteCode(e.target.value)} placeholder="Ej: A4F9K2" className="w-full max-w-[200px] mx-auto text-center font-mono text-xl tracking-widest uppercase bg-muted/50 border border-border rounded-xl px-4 py-3 text-secondary outline-none focus:border-primary" />
             <button disabled={joining} type="submit" className="w-full gradient-primary text-secondary py-3.5 rounded-xl font-black uppercase shadow-pop active:scale-95 transition-all">
                {joining ? "Enviando..." : "Solicitar Unión"}
             </button>
          </form>
        )}
      </div>
    </div>
  );
}
