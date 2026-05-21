import { Settings, Trophy, Star, Calendar, Edit3, LogOut, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function ProfileScreen({ onEdit }: { onEdit?: () => void }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mySports, setMySports] = useState<{name: string; count: number}[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        setUser(user);
        
        // Cargar los deportes a los que se unió (buscando en event_participants)
        const { data } = await supabase
          .from("event_participants")
          .select(`events!inner(sport_id)`)
          .eq("user_username", user.email);
          
        if (data && data.length > 0) {
          const sportCounts: Record<number, number> = {};
          data.forEach((p: any) => {
            const sid = p.events?.sport_id;
            if (sid) {
              sportCounts[sid] = (sportCounts[sid] || 0) + 1;
            }
          });
          
          const sportNames: Record<number, string> = {
            1: "Fútbol",
            2: "Tenis",
            3: "Baloncesto",
            4: "Pádel",
            5: "Senderismo",
            6: "Running",
            7: "Vóleibol"
          };
          
          const sportsList = Object.keys(sportCounts).map(id => ({
            name: sportNames[parseInt(id)] || "Deporte",
            count: sportCounts[parseInt(id)]
          }));
          setMySports(sportsList);
        } else {
          // Fallback data if user hasn't joined any real DB events yet
          setMySports([
            { name: "Pádel", count: 2 },
            { name: "Running", count: 1 }
          ]);
        }
      }
      setLoading(false);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Usuario";
  const email = user?.email || "";
  const initials = name.substring(0, 2).toUpperCase();

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalEvents = mySports.reduce((acc, curr) => acc + curr.count, 0);

  const stats = [
    { label: "Eventos", value: totalEvents.toString(), icon: Calendar },
    { label: "Rating", value: "4.9", icon: Star },
    { label: "Trofeos", value: "7", icon: Trophy },
  ];

  return (
    <div className="h-full overflow-y-auto bg-background pb-24">
      {/* Hero */}
      <div className="relative gradient-dark px-5 pb-20 pt-12 text-primary-foreground">
        <div className="flex items-center justify-between">
          <button 
            onClick={onEdit}
            className="grid h-10 w-10 place-items-center rounded-full bg-card/10 text-[#32CD32] transition-transform active:scale-95"
          >
            <Edit3 size={16} />
          </button>
          <button className="grid h-10 w-10 place-items-center rounded-full bg-card/10">
            <Settings size={16} />
          </button>
        </div>
        <div className="mt-4 flex items-center gap-4">
          {user?.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt="Avatar"
              className="h-20 w-20 rounded-full object-cover ring-4 ring-card/20 shadow-pop"
            />
          ) : (
            <div
              className="grid h-20 w-20 place-items-center rounded-full bg-card text-2xl font-bold ring-4 ring-card/20 shadow-pop"
              style={{ color: "#32CD32" }}
            >
              {initials}
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              {name}
              {user?.user_metadata?.is_organizer && (
                <span className="flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-500 shadow-pop">
                  <Star size={10} className="fill-amber-500" /> Organizador
                </span>
              )}
            </h1>
            <p className="text-xs text-white/80">{email}</p>
            <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-primary/20 px-2 py-0.5 text-[11px] font-semibold text-primary">
              <Star size={11} className="fill-primary" /> Jugador verificado
            </div>
          </div>
        </div>
      </div>

      {/* Stats card */}
      <div className="-mt-12 px-5">
        <div className="grid grid-cols-3 gap-2 rounded-2xl bg-card p-4 shadow-pop">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="mx-auto mb-1 grid h-9 w-9 place-items-center rounded-xl bg-muted">
                <s.icon size={16} className="text-primary" />
              </div>
              <div className="text-lg font-bold text-secondary">{s.value}</div>
              <div className="text-[11px] text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sports */}
      <div className="px-5 pt-6">
        <h2 className="mb-3 text-sm font-bold text-secondary">Mis deportes</h2>
        <div className="space-y-2">
          {mySports.length > 0 ? mySports.map((s) => (
            <div
              key={s.name}
              className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-soft"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-muted text-primary">
                <Trophy size={18} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-secondary">{s.name}</div>
                <div className="text-xs text-muted-foreground">
                  {s.count} partido{s.count !== 1 ? 's' : ''}
                </div>
              </div>
              <div className="text-xs font-semibold text-primary">Ver</div>
            </div>
          )) : (
            <div className="text-sm text-muted-foreground p-3 text-center bg-card rounded-2xl shadow-soft">
              Aún no te has unido a ningún evento
            </div>
          )}
        </div>
      </div>

      {/* Logout */}
      <div className="px-5 pt-8">
        <button 
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500/10 py-4 text-sm font-bold text-red-500 transition-colors hover:bg-red-500/20"
        >
          <LogOut size={18} />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
