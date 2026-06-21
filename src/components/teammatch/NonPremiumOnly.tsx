import React from "react";
import { useCurrentUser } from "@/lib/UserContext";

interface NonPremiumOnlyProps {
  children: React.ReactNode;
}

export function NonPremiumOnly({ children }: NonPremiumOnlyProps) {
  // @ts-ignore
  const { isPremium, isLoading } = useCurrentUser();

  if (isLoading || isPremium === null) {
    return null; // Evita el parpadeo de anuncios durante la carga
  }

  if (isPremium) {
    return null;
  }

  return <>{children}</>;
}
export default NonPremiumOnly;
