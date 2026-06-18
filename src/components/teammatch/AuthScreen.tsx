import { useState } from "react";
import {
  ArrowLeft,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Logo } from "./Logo";
import { useSettings } from "@/lib/SettingsContext";

// ─── Tipos ────────────────────────────────────────────────────────────────────
export type AuthMode = "login" | "register";

interface Props {
  initialMode?: AuthMode;
  onSuccess: () => void;
  onClose: () => void;
}

// ─── Componente principal ─────────────────────────────────────────────────────
export function AuthScreen({ initialMode = "login", onSuccess, onClose }: Props) {
  const { t } = useSettings();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [error, setError] = useState<string | null>(null);

  // ── Limpiar estado al cambiar de modo ─────────────────────────────────────
  function switchMode(next: AuthMode) {
    setMode(next);
    setError(null);
    setStatus("idle");
  }

  // ── Traducir errores de Supabase ──────────────────────────────────────────
  function translateError(msg: string): string {
    if (msg.includes("Invalid login credentials"))
      return t("auth.err.invalidLogin") || "Correo o contraseña incorrectos. Revisa tus datos.";
    if (msg.includes("Email not confirmed"))
      return t("auth.err.emailNotConfirmed") || "Confirma tu correo antes de iniciar sesión.";
    if (msg.includes("User already registered"))
      return t("auth.err.alreadyRegistered") || "Ya existe una cuenta con ese correo. Intenta iniciar sesión.";
    if (msg.includes("Password should be at least"))
      return t("auth.err.weakPassword") || "La contraseña debe tener al menos 6 caracteres.";
    if (msg.includes("Unable to validate email"))
      return t("auth.err.invalidEmail") || "Ingresa un correo electrónico válido.";
    if (msg.includes("Email rate limit exceeded"))
      return t("auth.err.rateLimit") || "Demasiados intentos. Espera unos minutos e intenta de nuevo.";
    return msg;
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  async function handleSubmit() {
    setError(null);

    // Validación básica
    if (!email.trim() || !password.trim()) {
      setError(t("auth.fillFields") || "Completa todos los campos obligatorios.");
      return;
    }
    if (mode === "register" && !name.trim()) {
      setError(t("auth.enterName") || "Ingresa tu nombre para continuar.");
      return;
    }
    if (password.length < 6) {
      setError(t("auth.minPassword") || "La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setStatus("loading");

    try {
      if (mode === "login") {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (authError) throw authError;
      } else {
        const { error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { full_name: name.trim(), is_organizer: isOrganizer },
          },
        });
        if (authError) throw authError;
      }

      setStatus("success");
      // Pequeña pausa para mostrar el estado de éxito
      setTimeout(() => onSuccess(), 900);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error inesperado. Intenta de nuevo.";
      setError(translateError(msg));
      setStatus("idle");
    }
  }

  const isLoading = status === "loading";
  const isSuccess = status === "success";

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden gradient-dark text-secondary-foreground">
      {/* Glows decorativos */}
      <div className="pointer-events-none absolute -top-24 -left-20 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-40 -right-24 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />

      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 px-5 pt-12 pb-4">
        <button
          id="auth-back-btn"
          onClick={onClose}
          className="grid h-10 w-10 place-items-center rounded-full bg-primary-foreground/10 backdrop-blur transition-all active:scale-95"
          aria-label="Volver"
        >
          <ArrowLeft size={18} className="text-secondary-foreground" />
        </button>
        <Logo size={22} />
      </div>

      {/* Títulos */}
      <div className="relative z-10 px-7 pt-6">
        <h1 className="text-3xl font-bold leading-tight tracking-tight">
          {mode === "login" ? (
            <>
              {t("auth.welcomeBack") || "Bienvenido"}
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {t("auth.welcomeBackEmoji") || "de vuelta 👋"}
              </span>
            </>
          ) : (
            <>
              {t("auth.createAccount") || "Crea tu cuenta"}
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {t("auth.createAccountEmoji") || "y entra a jugar ⚡"}
              </span>
            </>
          )}
        </h1>
        <p className="mt-2 text-sm text-secondary-foreground/60">
          {mode === "login"
            ? (t("auth.loginSubtitle") || "Inicia sesión para ver y unirte a eventos.")
            : (t("auth.registerSubtitle") || "Regístrate gratis. En segundos estás dentro.")}
        </p>
      </div>

      {/* Formulario */}
      <div className="relative z-10 flex-1 overflow-y-auto px-7 pt-8 pb-6 space-y-4">
        {/* Nombre (solo registro) */}
        {mode === "register" && (
          <>
            <InputField
              id="auth-name-input"
              label={t("auth.fullName") || "Nombre completo"}
              type="text"
              placeholder={t("auth.namePlaceholder") || "Ej: Diego Ramírez"}
              value={name}
              onChange={setName}
              icon={<User size={16} className="text-muted-foreground" />}
              disabled={isLoading}
            />
            
            <label className="flex items-center gap-3 rounded-2xl border border-primary-foreground/15 bg-primary-foreground/8 px-4 py-3.5 backdrop-blur cursor-pointer transition-colors hover:border-primary/50">
              <input
                type="checkbox"
                checked={isOrganizer}
                onChange={(e) => setIsOrganizer(e.target.checked)}
                className="h-4 w-4 rounded border-primary-foreground/30 text-primary accent-primary"
                disabled={isLoading}
              />
              <span className="text-sm font-medium text-secondary-foreground">
                {t("auth.registerAsOrganizer") || "Quiero registrarme como Organizador"}
              </span>
            </label>
          </>
        )}

        {/* Email */}
        <InputField
          id="auth-email-input"
          label={t("auth.email") || "Correo electrónico"}
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={setEmail}
          icon={<Mail size={16} className="text-muted-foreground" />}
          disabled={isLoading}
        />

        {/* Contraseña */}
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-secondary-foreground/50">
            {t("auth.password") || "Contraseña"}
          </label>
          <div
            className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 backdrop-blur transition-colors focus-within:border-primary ${error ? "border-destructive/60" : "border-primary-foreground/15 bg-primary-foreground/8"
              }`}
          >
            <Lock size={16} className="shrink-0 text-muted-foreground" />
            <input
              id="auth-password-input"
              type={showPassword ? "text" : "password"}
              placeholder={mode === "register" ? (t("auth.minChars") || "Mín. 6 caracteres") : (t("auth.yourPassword") || "Tu contraseña")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="flex-1 bg-transparent text-sm font-medium text-secondary-foreground outline-none placeholder:text-secondary-foreground/30 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="text-secondary-foreground/40 hover:text-secondary-foreground transition-colors"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {mode === "login" && (
            <button className="mt-1.5 text-[11px] text-primary hover:underline">
              {t("auth.forgotPassword") || "¿Olvidaste tu contraseña?"}
            </button>
          )}
        </div>

        {/* Banner de error */}
        {error && (
          <div className="flex items-start gap-2.5 rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3">
            <AlertCircle size={15} className="mt-0.5 shrink-0 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Banner de éxito */}
        {isSuccess && (
          <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3">
            <CheckCircle2 size={15} className="shrink-0 text-emerald-400" />
            <p className="text-sm font-medium text-emerald-300">
              {mode === "login" ? (t("auth.loggedInMsg") || "¡Sesión iniciada! Entrando...") : (t("auth.accountCreatedMsg") || "¡Cuenta creada! Bienvenido...")}
            </p>
          </div>
        )}

        {/* Botón principal */}
        <button
          id="auth-submit-btn"
          onClick={handleSubmit}
          disabled={isLoading || isSuccess}
          className={`group mt-2 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold transition-all active:scale-[0.98] disabled:cursor-not-allowed ${isSuccess
              ? "bg-emerald-500 text-white"
              : "gradient-primary text-foreground shadow-pop hover:shadow-lg disabled:opacity-70"
            }`}
        >
          {isLoading && <Loader2 size={16} className="animate-spin" />}
          {isSuccess && <CheckCircle2 size={16} />}
          {!isLoading && !isSuccess && (
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          )}
          {isLoading
            ? mode === "login"
              ? (t("auth.loggingIn") || "Iniciando sesión...")
              : (t("auth.creatingAccount") || "Creando cuenta...")
            : isSuccess
              ? mode === "login"
                ? (t("auth.loggedIn") || "¡Sesión iniciada!")
                : (t("auth.accountCreated") || "¡Cuenta creada!")
              : mode === "login"
                ? (t("auth.login") || "Iniciar sesión")
                : (t("auth.createFree") || "Crear cuenta gratis")}
        </button>

        {/* Divisor */}
        <div className="flex items-center gap-3 py-1">
          <div className="h-px flex-1 bg-primary-foreground/10" />
          <span className="text-[11px] text-secondary-foreground/40">{t("auth.or") || "o"}</span>
          <div className="h-px flex-1 bg-primary-foreground/10" />
        </div>

        {/* Cambio de modo */}
        <button
          id="auth-switch-mode-btn"
          onClick={() => switchMode(mode === "login" ? "register" : "login")}
          disabled={isLoading}
          className="w-full rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 py-3.5 text-sm font-medium text-secondary-foreground/80 transition-all hover:bg-primary-foreground/10 active:scale-[0.98] disabled:opacity-50"
        >
          {mode === "login" ? (t("auth.noAccount") || "¿No tienes cuenta? Regístrate") : (t("auth.hasAccount") || "¿Ya tienes cuenta? Inicia sesión")}
        </button>

        <p className="pt-1 text-center text-[10px] text-secondary-foreground/30">
          {t("auth.terms") || "Al continuar aceptas los Términos de Uso y la Política de Privacidad de TeamMatch."}
        </p>
      </div>
    </div>
  );
}

// ─── Helper: Input estilizado ──────────────────────────────────────────────────
function InputField({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  icon,
  disabled,
}: {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-secondary-foreground/50"
      >
        {label}
      </label>
      <div className="flex items-center gap-3 rounded-2xl border border-primary-foreground/15 bg-primary-foreground/8 px-4 py-3.5 backdrop-blur transition-colors focus-within:border-primary">
        {icon}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="flex-1 bg-transparent text-sm font-medium text-secondary-foreground outline-none placeholder:text-secondary-foreground/30 disabled:opacity-50"
        />
      </div>
    </div>
  );
}
