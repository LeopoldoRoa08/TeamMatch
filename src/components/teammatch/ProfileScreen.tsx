import { Settings, Trophy, Star, Calendar, Edit3, LogOut, Loader2, ArrowLeft, MapPin, Clock, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { SportEvent } from "./types";



export function ProfileScreen({
  onEdit,
  onSelectEvent,
}: {
  onEdit?: () => void;
  onSelectEvent?: (e: SportEvent) => void;
}) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        setUser(user);
      }
      setLoading(false);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Usuario";
  const email = user?.email || "";
  const initials = name.substring(0, 2).toUpperCase();

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const stats = [
    { label: "Rating", value: "4.9", icon: Star },
    { label: "Trofeos", value: "7", icon: Trophy },
  ];



  // ── Vista principal del perfil ────────────────────────────────────────────
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
