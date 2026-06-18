import React, { useState, useEffect } from "react";
import { X, Moon, Sun, Monitor, Globe, Bell, Shield, MapPin, Zap, LogOut, Check, Palette, Sparkles, ChevronRight } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void;
}

export function SettingsModal({ isOpen, onClose, onLogout }: SettingsModalProps) {
  const [theme, setTheme] = useState<string>("light");
  const [language, setLanguage] = useState<string>("es");
  const [rpgMode, setRpgMode] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<boolean>(true);
  const [unit, setUnit] = useState<"km" | "mi">("km");

  // Initial load
  useEffect(() => {
    setTheme(localStorage.getItem("app-theme") || "light");
    setLanguage(localStorage.getItem("app-language") || "es");
    setRpgMode(localStorage.getItem("app-rpg") !== "false");
  }, []);

  // Apply theme
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("dark", "theme-neon", "theme-nature", "theme-ocean");
    
    let activeTheme = theme;
    if (theme === "system") {
      activeTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    
    if (activeTheme !== "light" && activeTheme !== "system") {
      if (activeTheme === "dark") html.classList.add("dark");
      else html.classList.add(`theme-${activeTheme}`);
    }
    
    localStorage.setItem("app-theme", theme);
  }, [theme]);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem("app-language", lang);
    // En un proyecto real aquí llamaríamos a i18n.changeLanguage(lang)
  };

  if (!isOpen) return null;

  const themes = [
    { id: "light", name: "Claro", icon: Sun, color: "bg-[#f8f9fa] border-gray-200 text-gray-800" },
    { id: "dark", name: "Oscuro", icon: Moon, color: "bg-[#111827] border-gray-700 text-gray-200" },
    { id: "neon", name: "Neón", icon: Sparkles, color: "bg-[#2e0536] border-[#ff00a0] text-[#ff00a0]" },
    { id: "nature", name: "Naturaleza", icon: Palette, color: "bg-[#f0fdf4] border-[#22c55e] text-[#15803d]" },
    { id: "ocean", name: "Océano", icon: Palette, color: "bg-[#eff6ff] border-[#3b82f6] text-[#1d4ed8]" },
  ];

  const languages = [
    { id: "es", name: "Español", flag: "🇪🇸" },
    { id: "en", name: "English", flag: "🇺🇸" },
    { id: "pt", name: "Português", flag: "🇧🇷" },
    { id: "fr", name: "Français", flag: "🇫🇷" },
    { id: "it", name: "Italiano", flag: "🇮🇹" },
    { id: "de", name: "Deutsch", flag: "🇩🇪" },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card w-full max-h-[90vh] rounded-t-3xl border-t border-border shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)] flex flex-col animate-in slide-in-from-bottom-full duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-lg font-black text-secondary">Configuración</h2>
          <button onClick={onClose} className="p-2 rounded-full bg-muted text-muted-foreground hover:text-secondary hover:bg-muted/80 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-8 pb-20">
          
          {/* Estética / Tema */}
          <section className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Palette size={14} className="text-primary" /> Estética de la App
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-2 snap-x hide-scrollbar">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`snap-center shrink-0 w-24 aspect-square rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all active:scale-95 ${t.color} ${theme === t.id ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : 'opacity-70 grayscale-[0.3]'}`}
                >
                  <t.icon size={24} />
                  <span className="text-[10px] font-black">{t.name}</span>
                  {theme === t.id && (
                    <div className="absolute top-2 right-2 bg-primary text-secondary rounded-full p-0.5 shadow-sm">
                      <Check size={10} strokeWidth={4} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Idioma */}
          <section className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Globe size={14} className="text-primary" /> Idioma
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((l) => (
                <button
                  key={l.id}
                  onClick={() => handleLanguageChange(l.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    language === l.id 
                      ? 'bg-primary/10 border-primary/30 text-primary font-bold shadow-soft' 
                      : 'bg-muted/30 border-border/50 text-secondary hover:bg-muted/50'
                  }`}
                >
                  <span className="flex items-center gap-2 text-sm">
                    <span className="text-lg leading-none">{l.flag}</span> {l.name}
                  </span>
                  {language === l.id && <Check size={16} />}
                </button>
              ))}
            </div>
          </section>

          {/* Preferencias de Juego */}
          <section className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Zap size={14} className="text-primary" /> Preferencias de Juego
            </h3>
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="p-4 flex items-center justify-between border-b border-border">
                <div>
                  <h4 className="text-sm font-bold text-secondary">Modo RPG Activo</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Muestra niveles, XP, cofres y stats. Apágalo para una vista más deportiva.</p>
                </div>
                <button 
                  onClick={() => {
                    setRpgMode(!rpgMode);
                    localStorage.setItem("app-rpg", (!rpgMode).toString());
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative ${rpgMode ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${rpgMode ? 'left-6' : 'left-0.5'}`} />
                </button>
              </div>

              <div className="p-4 flex items-center justify-between border-b border-border">
                <div>
                  <h4 className="text-sm font-bold text-secondary">Notificaciones Push</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Avisos de partidos e invitaciones de clanes.</p>
                </div>
                <button 
                  onClick={() => setNotifications(!notifications)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${notifications ? 'left-6' : 'left-0.5'}`} />
                </button>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-secondary">Unidad de Distancia</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Para buscar eventos cercanos.</p>
                </div>
                <div className="flex bg-muted rounded-lg p-1">
                  <button 
                    onClick={() => setUnit("km")}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${unit === "km" ? 'bg-card text-secondary shadow-sm' : 'text-muted-foreground'}`}
                  >
                    Km
                  </button>
                  <button 
                    onClick={() => setUnit("mi")}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${unit === "mi" ? 'bg-card text-secondary shadow-sm' : 'text-muted-foreground'}`}
                  >
                    Mi
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Cuenta */}
          <section className="space-y-3 pt-4">
            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive font-black active:scale-95 transition-all"
            >
              <LogOut size={16} /> Cerrar Sesión
            </button>
          </section>

        </div>
      </div>
    </div>
  );
}
