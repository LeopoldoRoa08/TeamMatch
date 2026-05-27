import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface UserContextValue {
  user: any | null;
  avatarUrl: string | null;
  displayName: string;
  initials: string;
}

const UserContext = createContext<UserContextValue>({
  user: null,
  avatarUrl: null,
  displayName: "",
  initials: "",
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Usuario";
  const initials = displayName.substring(0, 2).toUpperCase();
  const avatarUrl = user?.user_metadata?.avatar_url ?? null;

  return (
    <UserContext.Provider value={{ user, avatarUrl, displayName, initials }}>
      {children}
    </UserContext.Provider>
  );
}

export function useCurrentUser() {
  return useContext(UserContext);
}
