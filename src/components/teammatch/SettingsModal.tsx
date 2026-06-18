import { X, Moon, Sun, Globe, LogOut, Check, Palette, Sparkles, Zap, Bell } from "lucide-react";
import { useSettings, type Language, type Theme } from "@/lib/SettingsContext";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void;
}

export function SettingsModal({ isOpen, onClose, onLogout }: SettingsModalProps) {
  const { language, setLanguage, theme, setTheme, rpgMode, setRpgMode, notifications, setNotifications, unit, setUnit, t } = useSettings();

  if (!isOpen) return null;

  const themes: { id: Theme; icon: any; color: string }[] = [
    { id: "light", icon: Sun, color: "bg-[#f8f9fa] border-gray-300 text-gray-800" },
    { id: "dark", icon: Moon, color: "bg-[#111827] border-gray-600 text-gray-100" },
    { id: "neon", icon: Sparkles, color: "bg-[#2e0536] border-[#ff00a0] text-[#ff00a0]" },
    { id: "nature", icon: Palette, color: "bg-[#f0fdf4] border-[#22c55e] text-[#15803d]" },
    { id: "ocean", icon: Palette, color: "bg-[#eff6ff] border-[#3b82f6] text-[#1d4ed8]" },
  ];

  const languages: { id: Language; name: string; flag: string }[] = [
    { id: "es", name: "Español", flag: "🇪🇸" },
    { id: "en", name: "English", flag: "🇺🇸" },
    { id: "pt", name: "Português", flag: "🇧🇷" },
    { id: "fr", name: "Français", flag: "🇫🇷" },
    { id: "it", name: "Italiano", flag: "🇮🇹" },
    { id: "de", name: "Deutsch", flag: "🇩🇪" },
  ];

  const themeNames: Record<Theme, string> = {
    light: t("themes.light"),
    dark: t("themes.dark"),
    neon: t("themes.neon"),
    nature: t("themes.nature"),
    ocean: t("themes.ocean"),
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card w-full max-h-[90vh] rounded-t-3xl border-t border-border shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)] flex flex-col animate-in slide-in-from-bottom-full duration-300">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
          <h2 className="text-lg font-black text-foreground">{t("settings.title")}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-muted text-muted-foreground hover:text-secondary hover:bg-muted/80 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-8 pb-24">

          {/* ── Estética / Tema ── */}
          <section className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Palette size={14} className="text-primary" /> {t("settings.aesthetics")}
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
              {themes.map((themeObj) => (
                <button
                  key={themeObj.id}
                  onClick={() => setTheme(themeObj.id)}
                  className={`relative snap-center shrink-0 w-24 h-24 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all active:scale-95 ${themeObj.color} ${theme === themeObj.id ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-105" : "opacity-60"}`}
                >
                  <themeObj.icon size={24} />
                  <span className="text-[10px] font-black">{themeNames[themeObj.id]}</span>
                  {theme === themeObj.id && (
                    <span className="absolute top-1.5 right-1.5 bg-primary text-secondary rounded-full p-0.5 shadow-sm">
                      <Check size={10} strokeWidth={4} />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* ── Idioma ── */}
          <section className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Globe size={14} className="text-primary" /> {t("settings.language")}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLanguage(l.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    language === l.id
                      ? "bg-primary/10 border-primary/30 text-primary font-bold shadow-soft"
                      : "bg-muted/30 border-border/50 text-secondary hover:bg-muted/50"
                  }`}
                >
                  <span className="flex items-center gap-2 text-sm">
                    <span className="text-lg leading-none">{l.flag}</span>
                    {l.name}
                  </span>
                  {language === l.id && <Check size={14} />}
                </button>
              ))}
            </div>
          </section>

          {/* ── Preferencias ── */}
          <section className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Zap size={14} className="text-primary" /> {t("settings.gamePrefs")}
            </h3>

            <div className="rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border">

              {/* RPG Mode */}
              <div className="p-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-foreground">{t("settings.rpgMode")}</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{t("settings.rpgModeDesc")}</p>
                </div>
                <button
                  onClick={() => setRpgMode(!rpgMode)}
                  className={`w-12 h-6 rounded-full transition-all duration-300 relative shrink-0 ${rpgMode ? "bg-primary shadow-pop" : "bg-muted-foreground/30"}`}
                >
                  <span className={`block w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all duration-300 ${rpgMode ? "left-[calc(100%-1.375rem)]" : "left-0.5"}`} />
                </button>
              </div>

              {/* Notifications */}
              <div className="p-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-foreground">{t("settings.pushNotif")}</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{t("settings.pushNotifDesc")}</p>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`w-12 h-6 rounded-full transition-all duration-300 relative shrink-0 ${notifications ? "bg-primary shadow-pop" : "bg-muted-foreground/30"}`}
                >
                  <span className={`block w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all duration-300 ${notifications ? "left-[calc(100%-1.375rem)]" : "left-0.5"}`} />
                </button>
              </div>

              {/* Distance Unit */}
              <div className="p-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-foreground">{t("settings.distance")}</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{t("settings.distanceDesc")}</p>
                </div>
                <div className="flex bg-muted rounded-lg p-1 shrink-0">
                  <button
                    onClick={() => setUnit("km")}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${unit === "km" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
                  >
                    Km
                  </button>
                  <button
                    onClick={() => setUnit("mi")}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${unit === "mi" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
                  >
                    Mi
                  </button>
                </div>
              </div>

            </div>
          </section>

          {/* ── Cuenta ── */}
          <section className="pt-2">
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive font-black active:scale-95 transition-all hover:bg-destructive/20"
            >
              <LogOut size={16} /> {t("settings.logout")}
            </button>
          </section>

        </div>
      </div>
    </div>
  );
}
