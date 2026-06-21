import React from "react";
import { useCurrentUser } from "@/lib/UserContext";

interface PremiumFeatureProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  featureName?: string;
  renderDisabled?: boolean;
}

export function PremiumFeature({
  children,
  fallback,
  featureName = "Esta función",
  renderDisabled = false,
}: PremiumFeatureProps) {
  // @ts-ignore
  const { isPremium, isLoading } = useCurrentUser();

  if (isLoading || isPremium === null) {
    return null; // Evita el parpadeo visual antes de resolver el estatus real
  }

  if (isPremium) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (renderDisabled) {
    return React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        const element = child as React.ReactElement<any>;
        return React.cloneElement(element, {
          disabled: true,
          onClick: (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            alert(
              `Membresía Premium Requerida: "${featureName}" está reservada exclusivamente para usuarios Premium.`
            );
          },
          className: `${element.props.className || ""} opacity-50 cursor-not-allowed filter grayscale pointer-events-auto`,
          title: `Requiere membresía Premium para acceder a: ${featureName}`,
        });
      }
      return child;
    });
  }

  return null;
}
export default PremiumFeature;
