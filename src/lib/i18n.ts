export const translations: Record<string, Record<string, string>> = {
  es: {
    "settings.title": "Configuración",
    "settings.aesthetics": "Estética de la App",
    "settings.language": "Idioma",
    "settings.gamePrefs": "Preferencias de Juego",
    "settings.rpgMode": "Modo RPG Activo",
    "settings.rpgModeDesc": "Muestra niveles, XP, cofres y stats. Apágalo para una vista más deportiva.",
    "settings.pushNotif": "Notificaciones Push",
    "settings.pushNotifDesc": "Avisos de partidos e invitaciones de clanes.",
    "settings.distance": "Unidad de Distancia",
    "settings.distanceDesc": "Para buscar eventos cercanos.",
    "settings.logout": "Cerrar Sesión",
    "themes.light": "Claro",
    "themes.dark": "Oscuro",
    "themes.neon": "Neón",
    "themes.nature": "Naturaleza",
    "themes.ocean": "Océano"
  },
  en: {
    "settings.title": "Settings",
    "settings.aesthetics": "App Aesthetics",
    "settings.language": "Language",
    "settings.gamePrefs": "Game Preferences",
    "settings.rpgMode": "RPG Mode Active",
    "settings.rpgModeDesc": "Shows levels, XP, chests and stats. Turn off for a cleaner sports view.",
    "settings.pushNotif": "Push Notifications",
    "settings.pushNotifDesc": "Match alerts and clan invitations.",
    "settings.distance": "Distance Unit",
    "settings.distanceDesc": "For finding nearby events.",
    "settings.logout": "Log Out",
    "themes.light": "Light",
    "themes.dark": "Dark",
    "themes.neon": "Neon",
    "themes.nature": "Nature",
    "themes.ocean": "Ocean"
  },
  pt: {
    "settings.title": "Configurações",
    "settings.aesthetics": "Estética do App",
    "settings.language": "Idioma",
    "settings.gamePrefs": "Preferências de Jogo",
    "settings.rpgMode": "Modo RPG Ativo",
    "settings.rpgModeDesc": "Mostra níveis, XP, baús e atributos. Desligue para uma visão mais esportiva.",
    "settings.pushNotif": "Notificações Push",
    "settings.pushNotifDesc": "Avisos de partidas e convites de clãs.",
    "settings.distance": "Unidade de Distância",
    "settings.distanceDesc": "Para buscar eventos próximos.",
    "settings.logout": "Sair",
    "themes.light": "Claro",
    "themes.dark": "Escuro",
    "themes.neon": "Neon",
    "themes.nature": "Natureza",
    "themes.ocean": "Oceano"
  },
  fr: {
    "settings.title": "Paramètres",
    "settings.aesthetics": "Esthétique de l'App",
    "settings.language": "Langue",
    "settings.gamePrefs": "Préférences de Jeu",
    "settings.rpgMode": "Mode RPG Actif",
    "settings.rpgModeDesc": "Affiche les niveaux, l'XP, les coffres et les stats.",
    "settings.pushNotif": "Notifications Push",
    "settings.pushNotifDesc": "Alertes de matchs et invitations de clan.",
    "settings.distance": "Unité de Distance",
    "settings.distanceDesc": "Pour trouver des événements à proximité.",
    "settings.logout": "Se Déconnecter",
    "themes.light": "Clair",
    "themes.dark": "Sombre",
    "themes.neon": "Néon",
    "themes.nature": "Nature",
    "themes.ocean": "Océan"
  },
  it: {
    "settings.title": "Impostazioni",
    "settings.aesthetics": "Estetica dell'App",
    "settings.language": "Lingua",
    "settings.gamePrefs": "Preferenze di Gioco",
    "settings.rpgMode": "Modo RPG Attivo",
    "settings.rpgModeDesc": "Mostra livelli, XP, forzieri e statistiche.",
    "settings.pushNotif": "Notifiche Push",
    "settings.pushNotifDesc": "Avvisi di partite e inviti ai clan.",
    "settings.distance": "Unità di Distanza",
    "settings.distanceDesc": "Per trovare eventi vicini.",
    "settings.logout": "Esci",
    "themes.light": "Chiaro",
    "themes.dark": "Scuro",
    "themes.neon": "Neon",
    "themes.nature": "Natura",
    "themes.ocean": "Oceano"
  },
  de: {
    "settings.title": "Einstellungen",
    "settings.aesthetics": "App-Ästhetik",
    "settings.language": "Sprache",
    "settings.gamePrefs": "Spieleinstellungen",
    "settings.rpgMode": "RPG-Modus Aktiv",
    "settings.rpgModeDesc": "Zeigt Level, XP, Truhen und Stats an.",
    "settings.pushNotif": "Push-Benachrichtigungen",
    "settings.pushNotifDesc": "Spielbenachrichtigungen und Clan-Einladungen.",
    "settings.distance": "Entfernungseinheit",
    "settings.distanceDesc": "Um Ereignisse in der Nähe zu finden.",
    "settings.logout": "Abmelden",
    "themes.light": "Hell",
    "themes.dark": "Dunkel",
    "themes.neon": "Neon",
    "themes.nature": "Natur",
    "themes.ocean": "Ozean"
  }
};

export function t(key: string, lang: string = "es"): string {
  if (translations[lang] && translations[lang][key]) {
    return translations[lang][key];
  }
  // Fallback to spanish
  return translations["es"][key] || key;
}
