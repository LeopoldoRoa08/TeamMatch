import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Language = "es" | "en" | "pt" | "fr" | "it" | "de";
export type Theme = "light" | "dark" | "neon" | "nature" | "ocean";

interface SettingsContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  rpgMode: boolean;
  setRpgMode: (val: boolean) => void;
  notifications: boolean;
  setNotifications: (val: boolean) => void;
  unit: "km" | "mi";
  setUnit: (val: "km" | "mi") => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  es: {
    // Settings
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
    "themes.ocean": "Océano",
    // Navigation
    "nav.events": "Eventos",
    "nav.sports": "Deportes",
    "nav.map": "Mapa",
    "nav.friends": "Amigos",
    "nav.profile": "Perfil",
    "nav.clans": "Clanes",
    // Profile
    "profile.rpgActive": "Modo RPG Activo",
    "profile.level": "Nivel",
    "profile.xpPoints": "Puntos de Experiencia",
    "profile.achievements": "Logros Obtenidos",
    "profile.progress": "Progreso",
    "profile.stats": "Stats",
    "profile.inventory": "Cofre",
    "profile.history": "Aventuras",
    "profile.logout": "Cerrar Sesión del Héroe",
    "profile.editProfile": "Editar Perfil",
    // Events
    "events.joinEvent": "Unirme al Partido",
    "events.createEvent": "Crear Evento",
    "events.noEvents": "No hay eventos disponibles",
    "events.search": "Buscar eventos...",
    "events.participants": "Participantes",
    "events.registerClan": "Inscribir mi Clan",
    "events.tab.upcoming": "Próximos",
    "events.tab.mine": "Mis Partidos",
    "events.tab.requests": "Solicitudes",
    // Friends
    "friends.title": "Amigos",
    "friends.findPlayers": "Buscar Jugadores",
    "friends.myFriends": "Mis Amigos",
    "friends.noFriends": "Aún no tienes amigos",
    "friends.noCandidates": "No hay más jugadores disponibles",
    "friends.findPlayersDescription": "Explora la pestaña 'Para ti' y encuentra jugadores con tus mismos gustos deportivos.",
    "friends.resetList": "Reiniciar Lista",
    "friends.requests": "Solicitudes Recibidas",
    "friends.accept": "Aceptar",
    "friends.reject": "Rechazar",
    "clans.search": "Buscar clanes...",
    // Clans
    "clans.title": "Clanes",
    "clans.createClan": "Crear Clan",
    "clans.joinClan": "Unirme a un Clan",
    "clans.myClan": "Mi Clan",
    "clans.captain": "Capitán",
    "clans.members": "Miembros",
    // Common
    "common.back": "Volver",
    "common.save": "Guardar",
    "common.cancel": "Cancelar",
    "common.loading": "Cargando...",
    "common.error": "Error",
    "common.success": "¡Éxito!",
    "common.search": "Buscar...",
    "common.noResults": "Sin resultados",
    "common.years": "años",
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
    "themes.ocean": "Ocean",
    "nav.events": "Events",
    "nav.sports": "Sports",
    "nav.map": "Map",
    "nav.friends": "Friends",
    "nav.profile": "Profile",
    "nav.clans": "Clans",
    "profile.rpgActive": "RPG Mode Active",
    "profile.level": "Level",
    "profile.xpPoints": "Experience Points",
    "profile.achievements": "Achievements",
    "profile.progress": "Progress",
    "profile.stats": "Stats",
    "profile.inventory": "Chest",
    "profile.history": "History",
    "profile.logout": "Logout",
    "profile.editProfile": "Edit Profile",
    "events.joinEvent": "Join Match",
    "events.createEvent": "Create Event",
    "events.noEvents": "No events available",
    "events.search": "Search events...",
    "events.participants": "Participants",
    "events.registerClan": "Register my Clan",
    "events.tab.upcoming": "Upcoming",
    "events.tab.mine": "My Matches",
    "events.tab.requests": "Requests",
    "clans.title": "Clans",
    "clans.createClan": "Create Clan",
    "clans.joinClan": "Join a Clan",
    "clans.myClan": "My Clan",
    "clans.captain": "Captain",
    "clans.members": "Members",
    "clans.search": "Search clans...",
    "clans.noClans": "No clans available",
    "friends.title": "Friends",
    "friends.findPlayers": "Find Players",
    "friends.myFriends": "My Friends",
    "friends.noFriends": "No friends yet",
    "friends.noCandidates": "No more players available",
    "friends.findPlayersDescription": "Explore the 'For you' tab to find players with similar sports interests.",
    "friends.resetList": "Reset List",
    "friends.requests": "Received Requests",
    "friends.accept": "Accept",
    "friends.reject": "Reject",
    "sports.title": "Sports",
    "sports.search": "Search sports...",
    "common.back": "Back",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success!",
    "common.search": "Search...",
    "common.noResults": "No results",
    "common.years": "years",
  },
  pt: {
    "settings.title": "Configurações",
    "settings.aesthetics": "Estética do App",
    "settings.language": "Idioma",
    "settings.gamePrefs": "Preferências de Jogo",
    "settings.rpgMode": "Modo RPG Ativo",
    "settings.rpgModeDesc": "Mostra níveis, XP, baús e atributos. Desligue para visão esportiva.",
    "settings.pushNotif": "Notificações Push",
    "settings.pushNotifDesc": "Avisos de partidas e convites de clãs.",
    "settings.distance": "Unidade de Distância",
    "settings.distanceDesc": "Para buscar eventos próximos.",
    "settings.logout": "Sair",
    "themes.light": "Claro",
    "themes.dark": "Escuro",
    "themes.neon": "Neon",
    "themes.nature": "Natureza",
    "themes.ocean": "Oceano",
    "nav.events": "Eventos",
    "nav.sports": "Esportes",
    "nav.map": "Mapa",
    "nav.friends": "Amigos",
    "nav.profile": "Perfil",
    "nav.clans": "Clãs",
    "profile.rpgActive": "Modo RPG Ativo",
    "profile.level": "Nível",
    "profile.xpPoints": "Pontos de Experiência",
    "profile.achievements": "Conquistas",
    "profile.progress": "Progresso",
    "profile.stats": "Stats",
    "profile.inventory": "Baú",
    "profile.history": "Histórico",
    "profile.logout": "Sair",
    "profile.editProfile": "Editar Perfil",
    "events.joinEvent": "Entrar na Partida",
    "events.createEvent": "Criar Evento",
    "events.noEvents": "Nenhum evento disponível",
    "events.search": "Buscar eventos...",
    "events.participants": "Participantes",
    "events.registerClan": "Inscrever meu Clã",
    "events.tab.upcoming": "Próximos",
    "events.tab.mine": "Minhas Partidas",
    "events.tab.requests": "Solicitações",
    "clans.title": "Clãs",
    "clans.createClan": "Criar Clã",
    "clans.joinClan": "Entrar num Clã",
    "clans.myClan": "Meu Clã",
    "clans.captain": "Capitão",
    "clans.members": "Membros",
    "common.back": "Voltar",
    "common.save": "Salvar",
    "common.cancel": "Cancelar",
    "common.loading": "Carregando...",
    "common.error": "Erro",
    "common.success": "Sucesso!",
    "common.search": "Buscar...",
    "common.noResults": "Sem resultados",
    "common.years": "anos",
  },
  fr: {
    "settings.title": "Paramètres",
    "settings.aesthetics": "Esthétique",
    "settings.language": "Langue",
    "settings.gamePrefs": "Préférences de Jeu",
    "settings.rpgMode": "Mode RPG Actif",
    "settings.rpgModeDesc": "Affiche niveaux, XP, coffres et stats.",
    "settings.pushNotif": "Notifications Push",
    "settings.pushNotifDesc": "Alertes de matchs et invitations de clan.",
    "settings.distance": "Unité de Distance",
    "settings.distanceDesc": "Pour trouver des événements à proximité.",
    "settings.logout": "Se Déconnecter",
    "themes.light": "Clair",
    "themes.dark": "Sombre",
    "themes.neon": "Néon",
    "themes.nature": "Nature",
    "themes.ocean": "Océan",
    "nav.events": "Événements",
    "nav.sports": "Sports",
    "nav.map": "Carte",
    "nav.friends": "Amis",
    "nav.profile": "Profil",
    "nav.clans": "Clans",
    "profile.rpgActive": "Mode RPG Actif",
    "profile.level": "Niveau",
    "profile.xpPoints": "Points d'Expérience",
    "profile.achievements": "Succès",
    "profile.progress": "Progrès",
    "profile.stats": "Stats",
    "profile.inventory": "Coffre",
    "profile.history": "Historique",
    "profile.logout": "Déconnexion",
    "profile.editProfile": "Modifier le Profil",
    "events.joinEvent": "Rejoindre le Match",
    "events.createEvent": "Créer un Événement",
    "events.noEvents": "Aucun événement disponible",
    "events.search": "Rechercher...",
    "events.participants": "Participants",
    "events.registerClan": "Inscrire mon Clan",
    "clans.title": "Clans",
    "clans.createClan": "Créer un Clan",
    "clans.joinClan": "Rejoindre un Clan",
    "clans.myClan": "Mon Clan",
    "clans.captain": "Capitaine",
    "clans.members": "Membres",
    "common.back": "Retour",
    "common.save": "Sauvegarder",
    "common.cancel": "Annuler",
    "common.loading": "Chargement...",
    "common.error": "Erreur",
    "common.success": "Succès !",
    "common.search": "Rechercher...",
    "common.noResults": "Aucun résultat",
    "common.years": "ans",
  },
  it: {
    "settings.title": "Impostazioni",
    "settings.aesthetics": "Estetica dell'App",
    "settings.language": "Lingua",
    "settings.gamePrefs": "Preferenze di Gioco",
    "settings.rpgMode": "Modalità RPG Attiva",
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
    "themes.ocean": "Oceano",
    "nav.events": "Eventi",
    "nav.sports": "Sport",
    "nav.map": "Mappa",
    "nav.friends": "Amici",
    "nav.profile": "Profilo",
    "nav.clans": "Clan",
    "profile.rpgActive": "Modalità RPG Attiva",
    "profile.level": "Livello",
    "profile.xpPoints": "Punti Esperienza",
    "profile.achievements": "Obiettivi",
    "profile.progress": "Progresso",
    "profile.stats": "Stats",
    "profile.inventory": "Forziere",
    "profile.history": "Cronologia",
    "profile.logout": "Esci",
    "profile.editProfile": "Modifica Profilo",
    "events.joinEvent": "Unisciti alla Partita",
    "events.createEvent": "Crea Evento",
    "events.noEvents": "Nessun evento disponibile",
    "events.search": "Cerca eventi...",
    "events.participants": "Partecipanti",
    "events.registerClan": "Iscrivere il mio Clan",
    "clans.title": "Clan",
    "clans.createClan": "Crea Clan",
    "clans.joinClan": "Unisciti a un Clan",
    "clans.myClan": "Il mio Clan",
    "clans.captain": "Capitano",
    "clans.members": "Membri",
    "common.back": "Indietro",
    "common.save": "Salva",
    "common.cancel": "Annulla",
    "common.loading": "Caricamento...",
    "common.error": "Errore",
    "common.success": "Successo!",
    "common.search": "Cerca...",
    "common.noResults": "Nessun risultato",
    "common.years": "anni",
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
    "themes.ocean": "Ozean",
    "nav.events": "Ereignisse",
    "nav.sports": "Sport",
    "nav.map": "Karte",
    "nav.friends": "Freunde",
    "nav.profile": "Profil",
    "nav.clans": "Clans",
    "profile.rpgActive": "RPG-Modus Aktiv",
    "profile.level": "Level",
    "profile.xpPoints": "Erfahrungspunkte",
    "profile.achievements": "Erfolge",
    "profile.progress": "Fortschritt",
    "profile.stats": "Stats",
    "profile.inventory": "Truhe",
    "profile.history": "Verlauf",
    "profile.logout": "Abmelden",
    "profile.editProfile": "Profil Bearbeiten",
    "events.joinEvent": "Spiel beitreten",
    "events.createEvent": "Ereignis erstellen",
    "events.noEvents": "Keine Ereignisse verfügbar",
    "events.search": "Suche...",
    "events.participants": "Teilnehmer",
    "events.registerClan": "Meinen Clan anmelden",
    "clans.title": "Clans",
    "clans.createClan": "Clan erstellen",
    "clans.joinClan": "Clan beitreten",
    "clans.myClan": "Mein Clan",
    "clans.captain": "Kapitän",
    "clans.members": "Mitglieder",
    "common.back": "Zurück",
    "common.save": "Speichern",
    "common.cancel": "Abbrechen",
    "common.loading": "Laden...",
    "common.error": "Fehler",
    "common.success": "Erfolg!",
    "common.search": "Suchen...",
    "common.noResults": "Keine Ergebnisse",
    "common.years": "Jahre",
  },
};

const SettingsContext = createContext<SettingsContextValue>({
  language: "es",
  setLanguage: () => {},
  theme: "light",
  setTheme: () => {},
  rpgMode: true,
  setRpgMode: () => {},
  notifications: true,
  setNotifications: () => {},
  unit: "km",
  setUnit: () => {},
  t: (key) => key,
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("es");
  const [theme, setThemeState] = useState<Theme>("light");
  const [rpgMode, setRpgModeState] = useState(true);
  const [notifications, setNotificationsState] = useState(true);
  const [unit, setUnitState] = useState<"km" | "mi">("km");

  // Load from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem("app-language") as Language;
    if (savedLang && translations[savedLang]) setLanguageState(savedLang);

    const savedTheme = localStorage.getItem("app-theme") as Theme;
    if (savedTheme) setThemeState(savedTheme);

    const savedRpg = localStorage.getItem("app-rpg");
    if (savedRpg !== null) setRpgModeState(savedRpg !== "false");

    const savedNotif = localStorage.getItem("app-notifications");
    if (savedNotif !== null) setNotificationsState(savedNotif !== "false");

    const savedUnit = localStorage.getItem("app-unit") as "km" | "mi";
    if (savedUnit) setUnitState(savedUnit);
  }, []);

  // Apply theme to <html>
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("dark", "theme-neon", "theme-nature", "theme-ocean");
    if (theme === "dark") html.classList.add("dark");
    else if (theme !== "light") html.classList.add(`theme-${theme}`);
    localStorage.setItem("app-theme", theme);
  }, [theme]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("app-language", lang);
  };

  const setTheme = (t: Theme) => {
    setThemeState(t);
  };

  const setRpgMode = (val: boolean) => {
    setRpgModeState(val);
    localStorage.setItem("app-rpg", val.toString());
  };

  const setNotifications = (val: boolean) => {
    setNotificationsState(val);
    localStorage.setItem("app-notifications", val.toString());
  };

  const setUnit = (val: "km" | "mi") => {
    setUnitState(val);
    localStorage.setItem("app-unit", val);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] ?? translations["es"][key] ?? key;
  };

  return (
    <SettingsContext.Provider value={{ language, setLanguage, theme, setTheme, rpgMode, setRpgMode, notifications, setNotifications, unit, setUnit, t }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
