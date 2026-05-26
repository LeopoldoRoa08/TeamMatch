/**
 * COMBINED SOURCE FILES FROM: C:\Users\yilup\teammatch\TeamMatch
 * Generated on: 2026-05-23T03:57:53.205Z
 * 
 * This file contains all JavaScript files from the src directory combined into a single file.
 * Each file is clearly marked with separators and includes the original file path.
 * 
 * TABLE OF CONTENTS:
 */

 * 1. src\components\teammatch\AuthScreen.tsx
 * 2. src\components\teammatch\BottomNav.tsx
 * 3. src\components\teammatch\CanchasScreen.tsx
 * 4. src\components\teammatch\CreateEventForm.tsx
 * 5. src\components\teammatch\EditProfileScreen.tsx
 * 6. src\components\teammatch\EventCard.tsx
 * 7. src\components\teammatch\EventDetailScreen.tsx
 * 8. src\components\teammatch\LeafletMap.tsx
 * 9. src\components\teammatch\Logo.tsx
 * 10. src\components\teammatch\MapScreen.tsx
 * 11. src\components\teammatch\MyEventsScreen.tsx
 * 12. src\components\teammatch\ProfileScreen.tsx
 * 13. src\components\teammatch\SportBadge.tsx
 * 14. src\components\teammatch\WelcomeScreen.tsx
 * 15. src\components\teammatch\data.ts
 * 16. src\components\teammatch\types-nav.ts
 * 17. src\components\teammatch\types.ts
 * 18. src\components\ui\accordion.tsx
 * 19. src\components\ui\alert-dialog.tsx
 * 20. src\components\ui\alert.tsx
 * 21. src\components\ui\aspect-ratio.tsx
 * 22. src\components\ui\avatar.tsx
 * 23. src\components\ui\badge.tsx
 * 24. src\components\ui\breadcrumb.tsx
 * 25. src\components\ui\button.tsx
 * 26. src\components\ui\calendar.tsx
 * 27. src\components\ui\card.tsx
 * 28. src\components\ui\carousel.tsx
 * 29. src\components\ui\chart.tsx
 * 30. src\components\ui\checkbox.tsx
 * 31. src\components\ui\collapsible.tsx
 * 32. src\components\ui\command.tsx
 * 33. src\components\ui\context-menu.tsx
 * 34. src\components\ui\dialog.tsx
 * 35. src\components\ui\drawer.tsx
 * 36. src\components\ui\dropdown-menu.tsx
 * 37. src\components\ui\form.tsx
 * 38. src\components\ui\hover-card.tsx
 * 39. src\components\ui\input-otp.tsx
 * 40. src\components\ui\input.tsx
 * 41. src\components\ui\label.tsx
 * 42. src\components\ui\menubar.tsx
 * 43. src\components\ui\navigation-menu.tsx
 * 44. src\components\ui\pagination.tsx
 * 45. src\components\ui\popover.tsx
 * 46. src\components\ui\progress.tsx
 * 47. src\components\ui\radio-group.tsx
 * 48. src\components\ui\resizable.tsx
 * 49. src\components\ui\scroll-area.tsx
 * 50. src\components\ui\select.tsx
 * 51. src\components\ui\separator.tsx
 * 52. src\components\ui\sheet.tsx
 * 53. src\components\ui\sidebar.tsx
 * 54. src\components\ui\skeleton.tsx
 * 55. src\components\ui\slider.tsx
 * 56. src\components\ui\sonner.tsx
 * 57. src\components\ui\switch.tsx
 * 58. src\components\ui\table.tsx
 * 59. src\components\ui\tabs.tsx
 * 60. src\components\ui\textarea.tsx
 * 61. src\components\ui\toggle-group.tsx
 * 62. src\components\ui\toggle.tsx
 * 63. src\components\ui\tooltip.tsx
 * 64. src\hooks\use-mobile.tsx
 * 65. src\lib\error-capture.ts
 * 66. src\lib\error-page.ts
 * 67. src\lib\supabase.ts
 * 68. src\lib\utils.ts
 * 69. src\routeTree.gen.ts
 * 70. src\router.tsx
 * 71. src\routes\__root.tsx
 * 72. src\routes\index.tsx
 * 73. src\server.ts
 * 74. src\start.ts
 * 75. src\vite-env.d.ts
 * 76. vite.config.ts
 */


================================================================================
// FILE 1 of 76
// PATH: src\components\teammatch\AuthScreen.tsx
// SIZE: 13427 characters
================================================================================

/**
 * FILE: AuthScreen.tsx
 * DIRECTORY: teammatch
 * 
 * PURPOSE: This file is located in teammatch directory.
 * TYPE: React component file
 * HOOKS: Uses React hooks for state and effects
 */

export type AuthMode = "login" | "register";

interface Props {
  initialMode?: AuthMode;
  onSuccess: () => void;
  onClose: () => void;
}

// ─── Componente principal ─────────────────────────────────────────────────────
export function AuthScreen({ initialMode = "login", onSuccess, onClose }: Props) {
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
      return "Correo o contraseña incorrectos. Revisa tus datos.";
    if (msg.includes("Email not confirmed"))
      return "Confirma tu correo antes de iniciar sesión.";
    if (msg.includes("User already registered"))
      return "Ya existe una cuenta con ese correo. Intenta iniciar sesión.";
    if (msg.includes("Password should be at least"))
      return "La contraseña debe tener al menos 6 caracteres.";
    if (msg.includes("Unable to validate email"))
      return "Ingresa un correo electrónico válido.";
    if (msg.includes("Email rate limit exceeded"))
      return "Demasiados intentos. Espera unos minutos e intenta de nuevo.";
    return msg;
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  async function handleSubmit() {
    setError(null);

    // Validación básica
    if (!email.trim() || !password.trim()) {
      setError("Completa todos los campos obligatorios.");
      return;
    }
    if (mode === "register" && !name.trim()) {
      setError("Ingresa tu nombre para continuar.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
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
    <div className="[TAILWIND_CLASSES_REMOVED]">
      {/* Glows decorativos */}
      <div className="[TAILWIND_CLASSES_REMOVED]" />
      <div className="[TAILWIND_CLASSES_REMOVED]" />

      {/* Header */}
      <div className="[TAILWIND_CLASSES_REMOVED]">
        <button
          id="auth-back-btn"
          onClick={onClose}
          className="[TAILWIND_CLASSES_REMOVED]"
          aria-label="Volver"
        >
          <ArrowLeft size={18} className="text-secondary-foreground" />
        </button>
        <Logo size={22} />
      </div>

      {/* Títulos */}
      <div className="[TAILWIND_CLASSES_REMOVED]">
        <h1 className="[TAILWIND_CLASSES_REMOVED]">
          {mode === "login" ? (
            <>
              Bienvenido
              <br />
              <span className="[TAILWIND_CLASSES_REMOVED]">
                de vuelta 👋
              </span>
            </>
          ) : (
            <>
              Crea tu cuenta
              <br />
              <span className="[TAILWIND_CLASSES_REMOVED]">
                y entra a jugar ⚡
              </span>
            </>
          )}
        </h1>
        <p className="[TAILWIND_CLASSES_REMOVED]">
          {mode === "login"
            ? "Inicia sesión para ver y unirte a eventos."
            : "Regístrate gratis. En segundos estás dentro."}
        </p>
      </div>

      {/* Formulario */}
      <div className="[TAILWIND_CLASSES_REMOVED]">
        {/* Nombre (solo registro) */}
        {mode === "register" && (
          <>
            <InputField
              id="auth-name-input"
              label="Nombre completo"
              type="text"
              placeholder="Ej: Diego Ramírez"
              value={name}
              onChange={setName}
              icon={<User size={16} className="text-muted-foreground" />}
              disabled={isLoading}
            />
            
            <label className="[TAILWIND_CLASSES_REMOVED]">
              <input
                type="checkbox"
                checked={isOrganizer}
                onChange={(e) => setIsOrganizer(e.target.checked)}
                className="[TAILWIND_CLASSES_REMOVED]"
                disabled={isLoading}
              />
              <span className="[TAILWIND_CLASSES_REMOVED]">
                Quiero registrarme como Organizador
              </span>
            </label>
          </>
        )}

        {/* Email */}
        <InputField
          id="auth-email-input"
          label="Correo electrónico"
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={setEmail}
          icon={<Mail size={16} className="text-muted-foreground" />}
          disabled={isLoading}
        />

        {/* Contraseña */}
        <div>
          <label className="[TAILWIND_CLASSES_REMOVED]">
            Contraseña
          </label>
          <div
            className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 backdrop-blur transition-colors focus-within:border-primary ${error ? "border-destructive/60" : "border-primary-foreground/15 bg-primary-foreground/8"
              }`}
          >
            <Lock size={16} className="[TAILWIND_CLASSES_REMOVED]" />
            <input
              id="auth-password-input"
              type={showPassword ? "text" : "password"}
              placeholder={mode === "register" ? "Mín. 6 caracteres" : "Tu contraseña"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="[TAILWIND_CLASSES_REMOVED]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="[TAILWIND_CLASSES_REMOVED]"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {mode === "login" && (
            <button className="[TAILWIND_CLASSES_REMOVED]">
              ¿Olvidaste tu contraseña?
            </button>
          )}
        </div>

        {/* Banner de error */}
        {error && (
          <div className="[TAILWIND_CLASSES_REMOVED]">
            <AlertCircle size={15} className="[TAILWIND_CLASSES_REMOVED]" />
            <p className="[TAILWIND_CLASSES_REMOVED]">{error}</p>
          </div>
        )}

        {/* Banner de éxito */}
        {isSuccess && (
          <div className="[TAILWIND_CLASSES_REMOVED]">
            <CheckCircle2 size={15} className="[TAILWIND_CLASSES_REMOVED]" />
            <p className="[TAILWIND_CLASSES_REMOVED]">
              {mode === "login" ? "¡Sesión iniciada! Entrando..." : "¡Cuenta creada! Bienvenido..."}
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
              : "gradient-primary text-secondary shadow-pop hover:shadow-lg disabled:opacity-70"
            }`}
        >
          {isLoading && <Loader2 size={16} className="animate-spin" />}
          {isSuccess && <CheckCircle2 size={16} />}
          {!isLoading && !isSuccess && (
            <ArrowRight
              size={16}
              className="[TAILWIND_CLASSES_REMOVED]"
            />
          )}
          {isLoading
            ? mode === "login"
              ? "Iniciando sesión..."
              : "Creando cuenta..."
            : isSuccess
              ? mode === "login"
                ? "¡Sesión iniciada!"
                : "¡Cuenta creada!"
              : mode === "login"
                ? "Iniciar sesión"
                : "Crear cuenta gratis"}
        </button>

        {/* Divisor */}
        <div className="[TAILWIND_CLASSES_REMOVED]">
          <div className="[TAILWIND_CLASSES_REMOVED]" />
          <span className="[TAILWIND_CLASSES_REMOVED]">o</span>
          <div className="[TAILWIND_CLASSES_REMOVED]" />
        </div>

        {/* Cambio de modo */}
        <button
          id="auth-switch-mode-btn"
          onClick={() => switchMode(mode === "login" ? "register" : "login")}
          disabled={isLoading}
          className="[TAILWIND_CLASSES_REMOVED]"
        >
          {mode === "login" ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
        </button>

        <p className="[TAILWIND_CLASSES_REMOVED]">
          Al continuar aceptas los Términos de Uso y la Política de Privacidad de TeamMatch.
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
        className="[TAILWIND_CLASSES_REMOVED]"
      >
        {label}
      </label>
      <div className="[TAILWIND_CLASSES_REMOVED]">
        {icon}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="[TAILWIND_CLASSES_REMOVED]"
        />
      </div>
    </div>
  );
}


================================================================================
// END OF FILE: src\components\teammatch\AuthScreen.tsx
================================================================================


================================================================================
// FILE 2 of 76
// PATH: src\components\teammatch\BottomNav.tsx
// SIZE: 1463 characters
================================================================================

/**
 * FILE: BottomNav.tsx
 * DIRECTORY: teammatch
 * 
 * PURPOSE: This file is located in teammatch directory.
 */

interface Props {
  current: Screen;
  onChange: (s: Screen) => void;
}

export function BottomNav({ current, onChange }: Props) {
  const items: { id: Screen; label: string; icon: typeof Map }[] = [
    { id: "map", label: "Explorar", icon: Map },
    { id: "events", label: "Eventos", icon: CalendarCheck },
    { id: "profile", label: "Perfil", icon: User as any },
  ];

  const Btn = ({ id, label, Icon }: { id: Screen; label: string; Icon: typeof Map }) => {
    const active = current === id;
    return (
      <button
        onClick={() => onChange(id)}
        className="[TAILWIND_CLASSES_REMOVED]"
      >
        <Icon
          className={active ? "text-primary" : "text-muted-foreground"}
          size={22}
          strokeWidth={active ? 2.5 : 2}
        />
        <span className={`text-[10px] font-semibold ${active ? "text-secondary" : "text-muted-foreground"}`}>
          {label}
        </span>
      </button>
    );
  };

  return (
    <nav className="[TAILWIND_CLASSES_REMOVED]">
      <div className="[TAILWIND_CLASSES_REMOVED]">
        {items.map((it) => (
          <Btn key={it.id} id={it.id} label={it.label} Icon={it.icon} />
        ))}

        <div className="flex-1" />
      </div>
    </nav>
  );
}


================================================================================
// END OF FILE: src\components\teammatch\BottomNav.tsx
================================================================================


================================================================================
// FILE 3 of 76
// PATH: src\components\teammatch\CanchasScreen.tsx
// SIZE: 16616 characters
================================================================================

/**
 * FILE: CanchasScreen.tsx
 * DIRECTORY: teammatch
 * 
 * PURPOSE: This file is located in teammatch directory.
 * TYPE: React component file
 * HOOKS: Uses React hooks for state and effects
 */

const LeafletMap = lazy(() =>
  import("./LeafletMap").then((m) => ({ default: m.default }))
);

function MapSkeleton() {
  return (
    <div className="[TAILWIND_CLASSES_REMOVED]">
      <div className="[TAILWIND_CLASSES_REMOVED]">
        <div className="[TAILWIND_CLASSES_REMOVED]" />
        <span className="[TAILWIND_CLASSES_REMOVED]">Cargando mapa…</span>
      </div>
    </div>
  );
}

const SPORTS = [
  { id: 1, label: "Fútbol", emoji: "⚽" },
  { id: 2, label: "Tenis", emoji: "🎾" },
  { id: 3, label: "Golf", emoji: "⛳" },
  { id: 4, label: "Pádel", emoji: "🏓" },
] as const;

type SportId = (typeof SPORTS)[number]["id"];

export interface Cancha {
  id: number;
  name: string;
  sport_id: SportId;
  description?: string;
  price?: number;
  created_by?: string;
}

// ── AddCanchaForm ─────────────────────────────────────────────────────────────
function AddCanchaForm({ onBack, onSaved }: { onBack: () => void; onSaved: () => void }) {
  const [name, setName] = useState("");
  const [sportId, setSportId] = useState<SportId | null>(null);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleMapClick(lat: number, lng: number) {
    setLatitude(lat.toString());
    setLongitude(lng.toString());
    setAddress("Buscando dirección...");
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      if (data?.display_name) {
        const n = data.address?.road || data.address?.suburb || data.display_name.split(",")[0];
        setAddress(n);
      } else {
        setAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      }
    } catch {
      setAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    }
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "El nombre es obligatorio";
    if (!sportId) e.sportId = "Selecciona un deporte";
    if (!latitude || !longitude) e.location = "Elige la ubicación en el mapa";
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setStatus("loading");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const location = `POINT(${parseFloat(longitude)} ${parseFloat(latitude)})`;

    const { error } = await supabase.from("canchas").insert({
      name: name.trim(),
      sport_id: sportId,
      location,
      description: description.trim() || null,
      price: price ? parseFloat(price) : null,
      created_by: user?.email,
    });

    if (error) {
      console.error(error);
      setErrors({ submit: error.message });
      setStatus("error");
    } else {
      setStatus("success");
      setTimeout(onSaved, 1200);
    }
  }

  if (status === "success") {
    return (
      <div className="[TAILWIND_CLASSES_REMOVED]">
        <div className="[TAILWIND_CLASSES_REMOVED]">
          <CheckCircle2 size={48} strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="[TAILWIND_CLASSES_REMOVED]">¡Cancha añadida!</h2>
          <p className="[TAILWIND_CLASSES_REMOVED]">Ya aparece en el listado de canchas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="[TAILWIND_CLASSES_REMOVED]">
      {/* Header */}
      <div className="[TAILWIND_CLASSES_REMOVED]">
        <button
          onClick={onBack}
          className="[TAILWIND_CLASSES_REMOVED]"
          aria-label="Volver"
        >
          <ArrowLeft size={18} className="text-secondary" />
        </button>
        <div>
          <h1 className="[TAILWIND_CLASSES_REMOVED]">Añadir cancha</h1>
          <p className="[TAILWIND_CLASSES_REMOVED]">Registra una nueva cancha deportiva</p>
        </div>
      </div>

      {/* Body */}
      <div className="[TAILWIND_CLASSES_REMOVED]">
        {/* Nombre */}
        <div className="space-y-2">
          <label className="[TAILWIND_CLASSES_REMOVED]">
            🏟️ Nombre <span className="text-primary">*</span>
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Cancha San Bernardino"
            className={`w-full rounded-2xl border bg-card px-4 py-3 text-sm font-medium text-secondary outline-none transition-colors focus:border-primary ${
              errors.name ? "border-destructive" : "border-border"
            }`}
          />
          {errors.name && (
            <p className="[TAILWIND_CLASSES_REMOVED]">
              <AlertCircle size={11} /> {errors.name}
            </p>
          )}
        </div>

        {/* Deporte */}
        <div className="space-y-2">
          <label className="[TAILWIND_CLASSES_REMOVED]">
            ⚡ Deporte <span className="text-primary">*</span>
          </label>
          <div className="[TAILWIND_CLASSES_REMOVED]">
            {SPORTS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSportId(s.id)}
                className={`flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-sm font-semibold transition-all active:scale-[0.97] ${
                  sportId === s.id
                    ? "gradient-primary border-transparent text-secondary shadow-pop"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40"
                }`}
              >
                <span className="text-xl">{s.emoji}</span>
                {s.label}
              </button>
            ))}
          </div>
          {errors.sportId && (
            <p className="[TAILWIND_CLASSES_REMOVED]">
              <AlertCircle size={11} /> {errors.sportId}
            </p>
          )}
        </div>

        {/* Ubicación */}
        <div className="space-y-2">
          <label className="[TAILWIND_CLASSES_REMOVED]">
            📍 Ubicación <span className="text-primary">*</span>
          </label>
          <div className="[TAILWIND_CLASSES_REMOVED]">
            <div className="[TAILWIND_CLASSES_REMOVED]">
              <MapPin size={16} className="[TAILWIND_CLASSES_REMOVED]" />
              <span className="[TAILWIND_CLASSES_REMOVED]">
                {address || "Toca el mapa para elegir la ubicación"}
              </span>
            </div>
            <div className="[TAILWIND_CLASSES_REMOVED]">
              <Suspense fallback={<MapSkeleton />}>
                <LeafletMap events={[]} onLocationSelect={handleMapClick} />
              </Suspense>
            </div>
            {latitude && longitude && (
              <div className="[TAILWIND_CLASSES_REMOVED]">
                <CheckCircle2 size={12} className="text-emerald-600" />
                <span className="[TAILWIND_CLASSES_REMOVED]">Ubicación seleccionada</span>
              </div>
            )}
          </div>
          {errors.location && (
            <p className="[TAILWIND_CLASSES_REMOVED]">
              <AlertCircle size={11} /> {errors.location}
            </p>
          )}
        </div>

        {/* Descripción */}
        <div className="space-y-2">
          <label className="[TAILWIND_CLASSES_REMOVED]">
            📝 Descripción
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Iluminación nocturna, vestuarios, estacionamiento..."
            rows={3}
            className="[TAILWIND_CLASSES_REMOVED]"
          />
        </div>

        {/* Precio */}
        <div className="space-y-2">
          <label className="[TAILWIND_CLASSES_REMOVED]">
            💰 Precio por hora (Bs.)
          </label>
          <div className="[TAILWIND_CLASSES_REMOVED]">
            <span className="[TAILWIND_CLASSES_REMOVED]">Bs.</span>
            <input
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Ej: 50 (opcional)"
              className="[TAILWIND_CLASSES_REMOVED]"
            />
          </div>
        </div>

        {errors.submit && (
          <div className="[TAILWIND_CLASSES_REMOVED]">
            <AlertCircle size={16} className="[TAILWIND_CLASSES_REMOVED]" />
            <p className="[TAILWIND_CLASSES_REMOVED]">{errors.submit}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="[TAILWIND_CLASSES_REMOVED]">
        <button
          onClick={handleSubmit}
          disabled={status === "loading"}
          className="[TAILWIND_CLASSES_REMOVED]"
        >
          {status === "loading" ? (
            <span className="[TAILWIND_CLASSES_REMOVED]">
              <Loader2 size={16} className="animate-spin" />
              Guardando cancha…
            </span>
          ) : (
            "Guardar cancha"
          )}
        </button>
      </div>
    </div>
  );
}

// ── CanchasScreen ─────────────────────────────────────────────────────────────
interface CanchasScreenProps {
  onBack: () => void;
  onSelect?: (cancha: Cancha) => void;
  isOrganizer: boolean;
}

export function CanchasScreen({ onBack, onSelect, isOrganizer }: CanchasScreenProps) {
  const [view, setView] = useState<"list" | "add">("list");
  const [canchas, setCanchas] = useState<Cancha[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCanchas();
  }, []);

  async function fetchCanchas() {
    setLoading(true);
    const { data, error } = await supabase
      .from("canchas")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setCanchas(data as Cancha[]);
    setLoading(false);
  }

  if (view === "add") {
    return (
      <AddCanchaForm
        onBack={() => setView("list")}
        onSaved={() => {
          setView("list");
          fetchCanchas();
        }}
      />
    );
  }

  const sportLabel = (id: number) => SPORTS.find((s) => s.id === id)?.label ?? "Deporte";
  const sportEmoji = (id: number) => SPORTS.find((s) => s.id === id)?.emoji ?? "🏟️";

  return (
    <div className="[TAILWIND_CLASSES_REMOVED]">
      {/* Header */}
      <div className="[TAILWIND_CLASSES_REMOVED]">
        <button
          onClick={onBack}
          className="[TAILWIND_CLASSES_REMOVED]"
          aria-label="Volver"
        >
          <ArrowLeft size={18} className="text-secondary" />
        </button>
        <div className="flex-1">
          <h1 className="[TAILWIND_CLASSES_REMOVED]">Canchas</h1>
          <p className="[TAILWIND_CLASSES_REMOVED]">
            {onSelect ? "Selecciona una cancha para tu evento" : "Canchas disponibles"}
          </p>
        </div>
        {isOrganizer && (
          <button
            onClick={() => setView("add")}
            className="[TAILWIND_CLASSES_REMOVED]"
          >
            <Plus size={14} strokeWidth={2.5} />
            Añadir
          </button>
        )}
      </div>

      {/* Content */}
      <div className="[TAILWIND_CLASSES_REMOVED]">
        {loading ? (
          <div className="[TAILWIND_CLASSES_REMOVED]">
            <Loader2 className="[TAILWIND_CLASSES_REMOVED]" />
          </div>
        ) : canchas.length === 0 ? (
          <div className="[TAILWIND_CLASSES_REMOVED]">
            <div className="[TAILWIND_CLASSES_REMOVED]">
              🏟️
            </div>
            <div>
              <p className="[TAILWIND_CLASSES_REMOVED]">No hay canchas por ahora</p>
              {isOrganizer && (
                <p className="[TAILWIND_CLASSES_REMOVED]">
                  Sé el primero en añadir una cancha
                </p>
              )}
            </div>
            {isOrganizer && (
              <button
                onClick={() => setView("add")}
                className="[TAILWIND_CLASSES_REMOVED]"
              >
                <Plus size={16} strokeWidth={2.5} />
                Añadir primera cancha
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {canchas.map((c) => (
              <button
                key={c.id}
                onClick={() => onSelect?.(c)}
                className="[TAILWIND_CLASSES_REMOVED]"
              >
                <div className="[TAILWIND_CLASSES_REMOVED]">
                  <div className="[TAILWIND_CLASSES_REMOVED]">
                    {sportEmoji(c.sport_id)}
                  </div>
                  <div className="[TAILWIND_CLASSES_REMOVED]">
                    <div className="[TAILWIND_CLASSES_REMOVED]">{c.name}</div>
                    <div className="[TAILWIND_CLASSES_REMOVED]">{sportLabel(c.sport_id)}</div>
                    {c.price != null && c.price > 0 && (
                      <div className="[TAILWIND_CLASSES_REMOVED]">
                        Bs. {c.price}/hora
                      </div>
                    )}
                  </div>
                  <MapPin size={16} className="[TAILWIND_CLASSES_REMOVED]" />
                </div>
                {c.description && (
                  <p className="[TAILWIND_CLASSES_REMOVED]">
                    {c.description}
                  </p>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


================================================================================
// END OF FILE: src\components\teammatch\CanchasScreen.tsx
================================================================================


================================================================================
// FILE 4 of 76
// PATH: src\components\teammatch\CreateEventForm.tsx
// SIZE: 21365 characters
================================================================================

/**
 * FILE: CreateEventForm.tsx
 * DIRECTORY: teammatch
 * 
 * PURPOSE: This file is located in teammatch directory.
 * TYPE: React component file
 * HOOKS: Uses React hooks for state and effects
 */

const LeafletMap = lazy(() => import("./LeafletMap").then((m) => ({ default: m.default })));

function MapSkeleton() {
  return (
    <div className="[TAILWIND_CLASSES_REMOVED]">
      <div className="[TAILWIND_CLASSES_REMOVED]">
        <div className="[TAILWIND_CLASSES_REMOVED]" />
        <span className="[TAILWIND_CLASSES_REMOVED]">Cargando mapa…</span>
      </div>
    </div>
  );
}

// ─── Catálogo de deportes ───────────────────────────────────────────────────
const SPORTS = [
  { id: 1, label: "Fútbol", emoji: "⚽" },
  { id: 2, label: "Tenis", emoji: "🎾" },
  { id: 3, label: "Golf", emoji: "⛳" },
  { id: 4, label: "Pádel", emoji: "🏓" },
] as const;

type SportId = (typeof SPORTS)[number]["id"];

// ─── Intensidades ────────────────────────────────────────────────────────────
const INTENSITIES = ["Principiante", "Intermedio", "Pro"] as const;
type Intensity = (typeof INTENSITIES)[number];

// ─── Colores por intensidad ──────────────────────────────────────────────────
const INTENSITY_STYLE: Record<Intensity, string> = {
  Principiante: "bg-emerald-50 text-emerald-700 ring-emerald-300",
  Intermedio: "bg-amber-50 text-amber-700 ring-amber-300",
  Pro: "bg-red-50 text-red-700 ring-red-300",
};

// ─── Props ───────────────────────────────────────────────────────────────────
interface Props {
  onClose: () => void;
  onEventCreated: () => void;
}

// ─── Estado inicial del formulario ───────────────────────────────────────────
const INITIAL_FORM = {
  sportId: null as SportId | null,
  intensity: null as Intensity | null,
  date: "",
  time: "",
  latitude: "",
  longitude: "",
  address: "",
  maxCapacity: "",
};

type FormState = typeof INITIAL_FORM;
type FieldError = Partial<Record<keyof FormState, string>>;

// ─── Componente principal ────────────────────────────────────────────────────
export function CreateEventForm({ onClose, onEventCreated }: Props) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FieldError>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [selectedCancha, setSelectedCancha] = useState<Cancha | null>(null);
  const [showCanchas, setShowCanchas] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setIsOrganizer(data.user.user_metadata?.is_organizer === true);
      }
    });
  }, []);

  // ── Actualizar campo ──────────────────────────────────────────────────────
  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    // limpiar error individual al editar
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  // ── Manejar click en el mapa ──────────────────────────────────────────────
  async function handleMapClick(lat: number, lng: number) {
    setField("latitude", lat.toString());
    setField("longitude", lng.toString());
    setField("address", "Buscando dirección...");

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      if (data && data.display_name) {
        // Extraemos un nombre amigable: calle, barrio, o la primera parte del display_name
        const name = data.address?.road || data.address?.suburb || data.display_name.split(',')[0];
        setField("address", name);
      } else {
        setField("address", `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      }
    } catch (e) {
      console.error("Geocoding error:", e);
      setField("address", `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    }
  }

  // ── Validación ────────────────────────────────────────────────────────────
  function validate(): boolean {
    const newErrors: FieldError = {};

    if (!form.sportId) newErrors.sportId = "Selecciona un deporte";
    if (!form.intensity) newErrors.intensity = "Selecciona la intensidad";
    if (!form.date) newErrors.date = "La fecha es obligatoria";
    if (!form.time) newErrors.time = "La hora es obligatoria";
    if (!form.latitude || !form.longitude) {
      newErrors.latitude = "Ingresa latitud y longitud";
    } else {
      const lat = parseFloat(form.latitude);
      const lng = parseFloat(form.longitude);
      if (isNaN(lat) || lat < -90 || lat > 90)
        newErrors.latitude = "Latitud inválida (-90 a 90)";
      if (isNaN(lng) || lng < -180 || lng > 180)
        newErrors.longitude = "Longitud inválida (-180 a 180)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  async function handleSubmit() {
    if (!validate()) return;

    setStatus("loading");
    setServerError(null);

    try {
      // Combinar fecha y hora en ISO 8601
      const eventDate = new Date(`${form.date}T${form.time}:00`).toISOString();

      // Formatear ubicación como WKT POINT para PostGIS / columna text
      const location = `POINT(${parseFloat(form.longitude)} ${parseFloat(form.latitude)})`;

      // Obtener usuario autenticado
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setServerError("Debes iniciar sesión para crear un evento.");
        setStatus("error");
        return;
      }


      // ── Payload del insert (esquema real de la tabla events) ────────────
      // Columnas: id, creator_username, sport_id, location (geography),
      //           event_date, max_capacity, status (enum), intensity (enum),
      //           description_after_arrival, created_at
      // creator_username debe coincidir exactamente con el registro en la tabla profiles
      // Usamos user.email como fuente de verdad (FK estricta)
      if (!user.email) {
        setServerError("No se pudo obtener el email del usuario. Intenta cerrar sesión y volver a entrar.");
        setStatus("error");
        return;
      }

      const payload = {
        // creator_username: email exacto del usuario (Foreign Key → tabla profiles)
        creator_username: user.email,

        // sport_id: entero — form.sportId ya viene del catálogo numérico (1-4)
        sport_id: form.sportId,

        // location: geography Point — formato WKT aceptado por PostGIS/Supabase
        location,

        // event_date: timestamp ISO 8601
        event_date: eventDate,

        // max_capacity: entero opcional
        max_capacity: form.maxCapacity ? parseInt(form.maxCapacity, 10) : null,

        // intensity: enum intensity_level — 'Principiante' | 'Intermedio' | 'Pro'
        intensity: form.intensity,

        // status: enum event_status — 'abierto' | 'lleno' | 'cancelado' | 'finalizado'
        status: "abierto",
      };

      // 🔍 Debug: verificar el payload exacto antes de enviarlo a Supabase
      console.log("Payload a enviar:", payload);

      const { error: insertError } = await supabase.from("events").insert(payload);

      if (insertError) throw insertError;

      setStatus("success");

      // Limpiar formulario tras éxito
      setTimeout(() => {
        setForm(INITIAL_FORM);
        setStatus("idle");
        onEventCreated();
        onClose();
      }, 1500);
    } catch (err: unknown) {
      // Loggear el error completo de Supabase (PostgrestError) para diagnóstico
      if (err && typeof err === "object" && "message" in err) {
        const pgErr = err as { message: string; details?: string; hint?: string; code?: string };
        console.error("❌ Supabase insert error:", {
          message: pgErr.message,
          details: pgErr.details,
          hint: pgErr.hint,
          code: pgErr.code,
        });
        setServerError(
          `Error al crear el evento: ${pgErr.message}${pgErr.hint ? ` — ${pgErr.hint}` : ""}`,
        );
      } else {
        console.error("❌ Error inesperado:", err);
        setServerError("Error inesperado al crear el evento. Revisa la consola para más detalles.");
      }
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="[TAILWIND_CLASSES_REMOVED]">
        <div className="[TAILWIND_CLASSES_REMOVED]">
          <CheckCircle2 size={48} strokeWidth={2.5} />
        </div>
        <div className="space-y-2">
          <h2 className="[TAILWIND_CLASSES_REMOVED]">¡Evento publicado!</h2>
          <p className="[TAILWIND_CLASSES_REMOVED]">
            Tu partido ya está en el mapa, listo para que otros jugadores se unan.
          </p>
        </div>
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="[TAILWIND_CLASSES_REMOVED]">
      {/* ── Panel de canchas (overlay) ── */}
      {showCanchas && (
        <div className="[TAILWIND_CLASSES_REMOVED]">
          <CanchasScreen
            isOrganizer={isOrganizer}
            onBack={() => setShowCanchas(false)}
            onSelect={(cancha) => {
              setSelectedCancha(cancha);
              setShowCanchas(false);
            }}
          />
        </div>
      )}
      {/* ── Header ── */}
      <div className="[TAILWIND_CLASSES_REMOVED]">
        <button
          onClick={onClose}
          className="[TAILWIND_CLASSES_REMOVED]"
          aria-label="Cerrar formulario"
        >
          <ArrowLeft size={18} className="text-secondary" />
        </button>
        <div>
          <h1 className="[TAILWIND_CLASSES_REMOVED]">Nuevo evento</h1>
          <p className="[TAILWIND_CLASSES_REMOVED]">
            Completa los datos para publicar tu evento
          </p>
        </div>
      </div>

      {/* ── Cuerpo del formulario ── */}
      <div className="[TAILWIND_CLASSES_REMOVED]">

        {/* Deporte */}
        <FormSection
          title="Deporte"
          icon={<Zap size={13} />}
          error={errors.sportId}
          required
        >
          <div className="[TAILWIND_CLASSES_REMOVED]">
            {SPORTS.map((s) => (
              <button
                key={s.id}
                id={`sport-btn-${s.id}`}
                onClick={() => setField("sportId", s.id)}
                className={`flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-sm font-semibold transition-all active:scale-[0.97] ${
                  form.sportId === s.id
                    ? "gradient-primary border-transparent text-secondary shadow-pop"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40"
                }`}
              >
                <span className="text-xl">{s.emoji}</span>
                {s.label}
              </button>
            ))}
          </div>
        </FormSection>

        {/* Intensidad */}
        <FormSection
          title="Intensidad"
          icon={<Zap size={13} />}
          error={errors.intensity}
          required
        >
          <div className="[TAILWIND_CLASSES_REMOVED]">
            {INTENSITIES.map((lvl) => (
              <button
                key={lvl}
                id={`intensity-btn-${lvl.toLowerCase()}`}
                onClick={() => setField("intensity", lvl)}
                className={`rounded-xl py-2.5 text-xs font-bold ring-1 transition-all active:scale-95 ${
                  form.intensity === lvl
                    ? `${INTENSITY_STYLE[lvl]} ring-current shadow-sm`
                    : "bg-muted text-muted-foreground ring-transparent"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </FormSection>

        {/* Fecha y Hora */}
        <div className="[TAILWIND_CLASSES_REMOVED]">
          <FormSection
            title="Fecha"
            icon={<Calendar size={13} />}
            error={errors.date}
            required
          >
            <input
              id="event-date-input"
              type="date"
              value={form.date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setField("date", e.target.value)}
              className={`w-full rounded-2xl border bg-card px-3 py-3 text-sm font-medium text-secondary outline-none transition-colors focus:border-primary ${
                errors.date ? "border-destructive" : "border-border"
              }`}
            />
          </FormSection>

          <FormSection
            title="Hora"
            icon={<Clock size={13} />}
            error={errors.time}
            required
          >
            <input
              id="event-time-input"
              type="time"
              value={form.time}
              onChange={(e) => setField("time", e.target.value)}
              className={`w-full rounded-2xl border bg-card px-3 py-3 text-sm font-medium text-secondary outline-none transition-colors focus:border-primary ${
                errors.time ? "border-destructive" : "border-border"
              }`}
            />
          </FormSection>
        </div>

        {/* Ubicación */}
        <FormSection
          title="Ubicación"
          icon={<MapPin size={13} />}
          error={errors.latitude || errors.longitude}
          required
        >
          <div className="[TAILWIND_CLASSES_REMOVED]">
            <div className="[TAILWIND_CLASSES_REMOVED]">
              <MapPin size={16} className="[TAILWIND_CLASSES_REMOVED]" />
              <span className="[TAILWIND_CLASSES_REMOVED]">
                {form.address || "Toca el mapa para elegir el lugar"}
              </span>
            </div>
            
            {/* Mapa Leaflet interactivo */}
            <div className="[TAILWIND_CLASSES_REMOVED]">
              <Suspense fallback={<MapSkeleton />}>
                <LeafletMap 
                  events={[]} 
                  onLocationSelect={handleMapClick}
                />
              </Suspense>
            </div>

            {(form.latitude || form.longitude) && !errors.latitude && !errors.longitude && (
              <div className="[TAILWIND_CLASSES_REMOVED]">
                <CheckCircle2 size={12} className="text-emerald-600" />
                <span className="[TAILWIND_CLASSES_REMOVED]">
                  Guardará como: POINT({parseFloat(form.longitude).toFixed(4)} {parseFloat(form.latitude).toFixed(4)})
                </span>
              </div>
            )}
          </div>
        </FormSection>

        {/* Cancha (opcional) */}
        <FormSection title="Cancha" icon={<Trophy size={13} />}>
          <button
            id="select-cancha-btn"
            type="button"
            onClick={() => setShowCanchas(true)}
            className={`w-full flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-sm font-semibold transition-all active:scale-[0.97] ${
              selectedCancha
                ? "border-primary/40 bg-primary/5 text-secondary"
                : "border-border bg-card text-muted-foreground hover:border-primary/40"
            }`}
          >
            <Trophy size={16} className="[TAILWIND_CLASSES_REMOVED]" />
            <span className="[TAILWIND_CLASSES_REMOVED]">
              {selectedCancha ? selectedCancha.name : "Seleccionar cancha (opcional)"}
            </span>
            {selectedCancha && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setSelectedCancha(null); }}
                className="[TAILWIND_CLASSES_REMOVED]"
              >
                ✕
              </button>
            )}
            <ChevronRight size={16} className="[TAILWIND_CLASSES_REMOVED]" />
          </button>
        </FormSection>

        {/* Capacidad máxima (opcional) */}
        <FormSection
          title="Capacidad máxima"
          icon={<Users size={13} />}
        >
          <div className="[TAILWIND_CLASSES_REMOVED]">
            <Users size={16} className="[TAILWIND_CLASSES_REMOVED]" />
            <input
              id="event-capacity-input"
              type="number"
              min={1}
              max={100}
              placeholder="Ej: 12 jugadores (opcional)"
              value={form.maxCapacity}
              onChange={(e) => setField("maxCapacity", e.target.value)}
              className="[TAILWIND_CLASSES_REMOVED]"
            />
          </div>
        </FormSection>

        {/* Error del servidor */}
        {status === "error" && serverError && (
          <div className="[TAILWIND_CLASSES_REMOVED]">
            <AlertCircle size={16} className="[TAILWIND_CLASSES_REMOVED]" />
            <p className="[TAILWIND_CLASSES_REMOVED]">{serverError}</p>
          </div>
        )}
      </div>

      {/* ── Footer con botón de acción ── */}
      <div className="[TAILWIND_CLASSES_REMOVED]">
        {/* Resumen rápido */}
        {form.sportId && form.intensity && (
          <div className="[TAILWIND_CLASSES_REMOVED]">
            <span className="[TAILWIND_CLASSES_REMOVED]">
              {SPORTS.find((s) => s.id === form.sportId)?.emoji}{" "}
              {SPORTS.find((s) => s.id === form.sportId)?.label}
            </span>
            <span>·</span>
            <span>{form.intensity}</span>
            {form.date && form.time && (
              <>
                <span>·</span>
                <span>
                  {new Date(`${form.date}T${form.time}`).toLocaleString("es-VE", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </>
            )}
          </div>
        )}

        <button
          id="publish-event-btn"
          onClick={handleSubmit}
          disabled={status === "loading"}
          className={`w-full rounded-2xl py-3.5 text-sm font-bold transition-all active:scale-[0.98] ${
            status === "loading"
              ? "gradient-primary cursor-not-allowed opacity-70 text-secondary"
              : "gradient-primary text-secondary shadow-pop hover:shadow-lg"
          }`}
        >
          {status === "loading" ? (
            <span className="[TAILWIND_CLASSES_REMOVED]">
              <Loader2 size={16} className="animate-spin" />
              Publicando evento…
            </span>
          ) : (
            "Publicar evento"
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Helper: Sección de formulario ──────────────────────────────────────────
function FormSection({
  title,
  icon,
  error,
  required,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="[TAILWIND_CLASSES_REMOVED]">
        {icon}
        {title}
        {required && <span className="text-primary">*</span>}
      </label>
      {children}
      {error && (
        <p className="[TAILWIND_CLASSES_REMOVED]">
          <AlertCircle size={11} />
          {error}
        </p>
      )}
    </div>
  );
}


================================================================================
// END OF FILE: src\components\teammatch\CreateEventForm.tsx
================================================================================


================================================================================
// FILE 5 of 76
// PATH: src\components\teammatch\EditProfileScreen.tsx
// SIZE: 7077 characters
================================================================================

/**
 * FILE: EditProfileScreen.tsx
 * DIRECTORY: teammatch
 * 
 * PURPOSE: This file is located in teammatch directory.
 * TYPE: React component file
 * HOOKS: Uses React hooks for state and effects
 */

interface Props {
  onBack: () => void;
}

export function EditProfileScreen({ onBack }: Props) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
        setName(user.user_metadata?.full_name || user.email?.split('@')[0] || "");
        setEmail(user.email || "");
        setAvatarUrl(user.user_metadata?.avatar_url || null);
      }
      setLoading(false);
    });
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadingImage(true);
      setError("");

      if (!e.target.files || e.target.files.length === 0) {
        throw new Error('Debes seleccionar una imagen.');
      }

      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      setAvatarUrl(data.publicUrl);
    } catch (error: any) {
      setError(error.message || 'Error al subir la imagen');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      // Update metadata (name and avatar)
      const { error: updateError } = await supabase.auth.updateUser({
        data: { full_name: name, avatar_url: avatarUrl },
        // If email is different, we also update it, but it sends a confirmation email.
        ...(email !== user.email && { email })
      });

      if (updateError) throw updateError;
      
      setSuccess("Perfil actualizado correctamente");
      setTimeout(() => {
        onBack();
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Error al actualizar el perfil");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="[TAILWIND_CLASSES_REMOVED]">
        <Loader2 className="[TAILWIND_CLASSES_REMOVED]" />
      </div>
    );
  }

  return (
    <div className="[TAILWIND_CLASSES_REMOVED]">
      <header className="[TAILWIND_CLASSES_REMOVED]">
        <button
          onClick={onBack}
          className="[TAILWIND_CLASSES_REMOVED]"
        >
          <ArrowLeft size={20} className="text-secondary" />
        </button>
        <h1 className="[TAILWIND_CLASSES_REMOVED]">Editar Perfil</h1>
      </header>

      <form onSubmit={handleSave} className="[TAILWIND_CLASSES_REMOVED]">
        {error && (
          <div className="[TAILWIND_CLASSES_REMOVED]">
            {error}
          </div>
        )}
        {success && (
          <div className="[TAILWIND_CLASSES_REMOVED]">
            {success}
          </div>
        )}

        <div className="[TAILWIND_CLASSES_REMOVED]">
          <div className="[TAILWIND_CLASSES_REMOVED]">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="[TAILWIND_CLASSES_REMOVED]" />
            ) : (
              <div className="[TAILWIND_CLASSES_REMOVED]">
                {(name || "U").substring(0, 2).toUpperCase()}
              </div>
            )}
            <label className="[TAILWIND_CLASSES_REMOVED]">
              {uploadingImage ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageUpload} 
                disabled={uploadingImage}
              />
            </label>
          </div>
          <p className="[TAILWIND_CLASSES_REMOVED]">Foto de perfil</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="[TAILWIND_CLASSES_REMOVED]">Nombre completo</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="[TAILWIND_CLASSES_REMOVED]"
              placeholder="Tu nombre"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="[TAILWIND_CLASSES_REMOVED]">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="[TAILWIND_CLASSES_REMOVED]"
              placeholder="tu@email.com"
              required
            />
            <p className="[TAILWIND_CLASSES_REMOVED]">
              Al cambiar el correo electrónico, se enviará un mensaje de confirmación.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="[TAILWIND_CLASSES_REMOVED]"
        >
          {saving ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <>
              <Save size={18} />
              Guardar Cambios
            </>
          )}
        </button>
      </form>
    </div>
  );
}


================================================================================
// END OF FILE: src\components\teammatch\EditProfileScreen.tsx
================================================================================


================================================================================
// FILE 6 of 76
// PATH: src\components\teammatch\EventCard.tsx
// SIZE: 5270 characters
================================================================================

/**
 * FILE: EventCard.tsx
 * DIRECTORY: teammatch
 * 
 * PURPOSE: This file is located in teammatch directory.
 * TYPE: React component file
 * HOOKS: Uses React hooks for state and effects
 */

export function EventCard({
  event,
  onClick,
  variant = "full",
}: {
  event: SportEvent;
  onClick?: () => void;
  variant?: "full" | "compact";
}) {
  const [joining, setJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const pct = (event.joined / event.spots) * 100;
  const isFull = event.joined >= event.spots;

  async function handleJoin(e: React.MouseEvent) {
    e.stopPropagation(); // Evitar click en la card
    
    if (isFull || hasJoined) return;

    // Obtener sesión actual (opcional pero buena práctica)
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Inicia sesión", { description: "Debes iniciar sesión para unirte." });
      return;
    }

    setJoining(true);

    try {
      const { error } = await supabase
        .from("events")
        .update({ joined: event.joined + 1 })
        .eq("id", event.id);

      if (error) throw error;

      setHasJoined(true);
      toast.success("¡Estás dentro!", {
        description: "Te has unido al evento exitosamente.",
        icon: "🎉",
      });
    } catch (err: any) {
      console.error("Error al unirse:", err);
      toast.error("Error al unirse", {
        description: err.message || "No pudimos procesar tu solicitud.",
      });
    } finally {
      setJoining(false);
    }
  }
  return (
    <button
      onClick={onClick}
      className="[TAILWIND_CLASSES_REMOVED]"
    >
      <div className="[TAILWIND_CLASSES_REMOVED]">
        <img
          src={event.image}
          alt={event.title}
          loading="lazy"
          className="[TAILWIND_CLASSES_REMOVED]"
        />
        <div className="[TAILWIND_CLASSES_REMOVED]" />
        <div className="[TAILWIND_CLASSES_REMOVED]">
          <SportBadge sport={event.sport} />
        </div>
        <div className="[TAILWIND_CLASSES_REMOVED]">
          {event.price === 0 ? "Gratis" : `$${event.price}`}
        </div>
        <div className="[TAILWIND_CLASSES_REMOVED]">
          <div>
            <div className="[TAILWIND_CLASSES_REMOVED]">{event.date}</div>
            <div className="[TAILWIND_CLASSES_REMOVED]">{event.title}</div>
          </div>
        </div>
      </div>

      <div className="[TAILWIND_CLASSES_REMOVED]">
        <div className="[TAILWIND_CLASSES_REMOVED]">
          <span className="[TAILWIND_CLASSES_REMOVED]">
            <Clock size={12} /> {event.time}
          </span>
          <span className="[TAILWIND_CLASSES_REMOVED]">
            <MapPin size={12} /> {event.zone}
          </span>
          <span className="[TAILWIND_CLASSES_REMOVED]">
            {event.distanceKm} km
          </span>
        </div>

        {variant === "full" && (
          <>
            <div className="[TAILWIND_CLASSES_REMOVED]">
              <div className="[TAILWIND_CLASSES_REMOVED]">
                <div
                  className="[TAILWIND_CLASSES_REMOVED]"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="[TAILWIND_CLASSES_REMOVED]">
                <Users size={12} /> {event.joined}/{event.spots}
              </span>
            </div>

            <button
              onClick={handleJoin}
              disabled={isFull || hasJoined || joining}
              className={`mt-2 w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all active:scale-95 ${
                hasJoined
                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                  : isFull
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : joining
                      ? "bg-secondary text-primary-foreground opacity-70 cursor-wait"
                      : "bg-secondary text-primary-foreground shadow-pop hover:bg-secondary/90"
              }`}
            >
              {joining ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Cargando...
                </>
              ) : hasJoined ? (
                <>
                  <CheckCircle2 size={14} /> ¡Estás dentro!
                </>
              ) : isFull ? (
                "Evento lleno"
              ) : (
                "Unirse al evento"
              )}
            </button>
          </>
        )}
      </div>
    </button>
  );
}


================================================================================
// END OF FILE: src\components\teammatch\EventCard.tsx
================================================================================


================================================================================
// FILE 7 of 76
// PATH: src\components\teammatch\EventDetailScreen.tsx
// SIZE: 12375 characters
================================================================================

/**
 * FILE: EventDetailScreen.tsx
 * DIRECTORY: teammatch
 * 
 * PURPOSE: This file is located in teammatch directory.
 * TYPE: React component file
 * HOOKS: Uses React hooks for state and effects
 */

export function EventDetailScreen({ event, onBack }: { event: SportEvent; onBack: () => void }) {
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setCurrentUser(data.user));
    fetchParticipants();
    
    // Suscripción a cambios en tiempo real
    const channel = supabase
      .channel(`participants_${event.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "event_participants", filter: `event_id=eq.${event.id}` },
        () => fetchParticipants()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [event.id]);

  async function fetchParticipants() {
    setLoading(true);
    // Asumimos que la tabla event_participants tiene una columna 'status' (pending, approved, rejected)
    const { data, error } = await supabase
      .from("event_participants")
      .select("*, profiles(username, rating)")
      .eq("event_id", event.id);
    
    if (!error && data) {
      setParticipants(data);
    }
    setLoading(false);
  }

  async function handleJoin() {
    if (!currentUser || !currentUser.email) return alert("Debes iniciar sesión");
    setJoining(true);
    
    // Insertamos solicitud con status 'pending'
    const { error } = await supabase.from("event_participants").insert({
      event_id: event.id,
      user_username: currentUser.email,
      status: "pendiente" // Adaptado a tu enum request_status
    });

    if (error) {
      console.error("Error al unirse:", error);
      if (error.code === '23505') alert("Ya enviaste una solicitud");
      else alert(`Error al solicitar unirse: ${error.message || JSON.stringify(error)}`);
    } else {
      alert("Solicitud enviada al organizador");
      fetchParticipants();
    }
    setJoining(false);
  }

  async function handleAction(participantId: number, status: "aceptado" | "rechazado") {
    setActionLoading(participantId.toString());
    const { error } = await supabase
      .from("event_participants")
      .update({ status })
      .eq("id", participantId);
    
    if (!error) {
      // Simular la notificación al usuario
      alert(`Has ${status === "aceptado" ? "aceptado" : "rechazado"} la solicitud.`);
      fetchParticipants();
    } else {
      alert("Error al actualizar la solicitud");
    }
    setActionLoading(null);
  }

  const approvedPlayers = participants.filter(p => p.status === "approved" || p.status === "aceptado" || p.status === "aprobado" || !p.status); // Fallback si status no existe
  const pendingRequests = participants.filter(p => p.status === "pending" || p.status === "pendiente");
  const emptySpots = Math.max(0, event.spots - approvedPlayers.length);

  const isUserPending = participants.some(p => p.user_username === currentUser?.email && (p.status === "pending" || p.status === "pendiente"));
  const isUserApproved = participants.some(p => p.user_username === currentUser?.email && (p.status === "approved" || p.status === "aceptado" || p.status === "aprobado" || !p.status));

  return (
    <div className="[TAILWIND_CLASSES_REMOVED]">
      {/* Hero */}
      <div className="[TAILWIND_CLASSES_REMOVED]">
        <img src={event.image} alt={event.title} className="[TAILWIND_CLASSES_REMOVED]" />
        <div className="[TAILWIND_CLASSES_REMOVED]" />
        <div className="[TAILWIND_CLASSES_REMOVED]">
          <button
            onClick={onBack}
            className="[TAILWIND_CLASSES_REMOVED]"
          >
            <ArrowLeft size={18} className="text-secondary" />
          </button>
          <button className="[TAILWIND_CLASSES_REMOVED]">
            <Share2 size={16} className="text-secondary" />
          </button>
        </div>
        <div className="[TAILWIND_CLASSES_REMOVED]">
          <div className="[TAILWIND_CLASSES_REMOVED]">
            <SportBadge sport={event.sport} />
            <span className="[TAILWIND_CLASSES_REMOVED]">
              {event.level}
            </span>
          </div>
          <h1 className="[TAILWIND_CLASSES_REMOVED]">
            {event.title}
          </h1>
        </div>
      </div>

      <div className="[TAILWIND_CLASSES_REMOVED]">
        {/* Host */}
        <div className="[TAILWIND_CLASSES_REMOVED]">
          <div className="[TAILWIND_CLASSES_REMOVED]">
            {event.hostAvatar}
          </div>
          <div className="flex-1">
            <div className="[TAILWIND_CLASSES_REMOVED]">Organizador</div>
            <div className="[TAILWIND_CLASSES_REMOVED]">{event.host}</div>
          </div>
          <div className="[TAILWIND_CLASSES_REMOVED]">
            <Star size={14} className="[TAILWIND_CLASSES_REMOVED]" /> 4.8
          </div>
        </div>

        {/* Info grid */}
        <div className="[TAILWIND_CLASSES_REMOVED]">
          <InfoTile icon={Calendar} label="Fecha" value={event.date} />
          <InfoTile icon={Clock} label="Hora" value={event.time} />
          <InfoTile icon={MapPin} label="Lugar" value={event.location} />
          <InfoTile icon={Users} label="Cupos" value={`${approvedPlayers.length}/${event.spots}`} />
        </div>

        {/* Description */}
        <div>
          <h3 className="[TAILWIND_CLASSES_REMOVED]">Descripción</h3>
          <p className="[TAILWIND_CLASSES_REMOVED]">
            Partido amistoso, cancha sintética con luces. Trae ropa cómoda y agua. Se aceptan jugadores
            con experiencia, ambiente respetuoso y competitivo.
          </p>
        </div>

        {/* Pending Requests (Mocked as Organizer) */}
        {pendingRequests.length > 0 && (
          <div>
            <h3 className="[TAILWIND_CLASSES_REMOVED]">
              <span className="[TAILWIND_CLASSES_REMOVED]">
                {pendingRequests.length}
              </span>
              Solicitudes pendientes
            </h3>
            <div className="space-y-2">
              {pendingRequests.map(req => (
                <div key={req.id} className="[TAILWIND_CLASSES_REMOVED]">
                  <div className="[TAILWIND_CLASSES_REMOVED]">
                    <div className="[TAILWIND_CLASSES_REMOVED]">
                      {(req.user_username || "U").substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="[TAILWIND_CLASSES_REMOVED]">
                        {req.user_username?.split('@')[0] || "Usuario"}
                      </div>
                      <div className="[TAILWIND_CLASSES_REMOVED]">
                        <Star size={10} className="[TAILWIND_CLASSES_REMOVED]" />
                        {req.profiles?.rating || "5.00"}
                      </div>
                    </div>
                  </div>
                  <div className="[TAILWIND_CLASSES_REMOVED]">
                    <button 
                      disabled={actionLoading === req.id.toString()}
                      onClick={() => handleAction(req.id, "rejected")}
                      onClick={() => handleAction(req.id, "rechazado")}
                      className="[TAILWIND_CLASSES_REMOVED]"
                    >
                      <X size={16} strokeWidth={2.5} />
                    </button>
                    <button 
                      disabled={actionLoading === req.id.toString()}
                      onClick={() => handleAction(req.id, "aceptado")}
                      className="[TAILWIND_CLASSES_REMOVED]"
                    >
                      {actionLoading === req.id.toString() ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} strokeWidth={2.5} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Players */}
        <div>
          <div className="[TAILWIND_CLASSES_REMOVED]">
            <h3 className="[TAILWIND_CLASSES_REMOVED]">Jugadores aprobados</h3>
            <span className="[TAILWIND_CLASSES_REMOVED]">{emptySpots} cupos disponibles</span>
          </div>
          <div className="[TAILWIND_CLASSES_REMOVED]">
            {loading ? (
              <div className="[TAILWIND_CLASSES_REMOVED]">Cargando jugadores...</div>
            ) : (
              <>
                {approvedPlayers.map((p, i) => (
                  <div
                    key={p.id || i}
                    title={p.user_username}
                    className="[TAILWIND_CLASSES_REMOVED]"
                  >
                    {(p.user_username || "U").substring(0, 2).toUpperCase()}
                  </div>
                ))}
                {Array.from({ length: emptySpots }).map((_, i) => (
                  <div
                    key={`e-${i}`}
                    className="[TAILWIND_CLASSES_REMOVED]"
                  >
                    +
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="[TAILWIND_CLASSES_REMOVED]">
        <div className="[TAILWIND_CLASSES_REMOVED]">
          <div>
            <div className="[TAILWIND_CLASSES_REMOVED]">Aporte</div>
            <div className="[TAILWIND_CLASSES_REMOVED]">
              {event.price === 0 ? "Gratis" : `$${event.price} USD`}
            </div>
          </div>
          <button 
            disabled={joining || emptySpots === 0 || isUserPending || isUserApproved}
            onClick={handleJoin}
            className="[TAILWIND_CLASSES_REMOVED]"
          >
            {joining ? "Enviando..." : isUserApproved ? "Ya estás dentro" : isUserPending ? "Solicitud enviada" : emptySpots === 0 ? "Evento Lleno" : "Solicitar unirme"}
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="[TAILWIND_CLASSES_REMOVED]">
      <div className="[TAILWIND_CLASSES_REMOVED]">
        <Icon size={15} className="text-primary" />
      </div>
      <div className="[TAILWIND_CLASSES_REMOVED]">{label}</div>
      <div className="[TAILWIND_CLASSES_REMOVED]">{value}</div>
    </div>
  );
}


================================================================================
// END OF FILE: src\components\teammatch\EventDetailScreen.tsx
================================================================================


================================================================================
// FILE 8 of 76
// PATH: src\components\teammatch\LeafletMap.tsx
// SIZE: 4912 characters
================================================================================

/**
 * FILE: LeafletMap.tsx
 * DIRECTORY: teammatch
 * 
 * PURPOSE: This file is located in teammatch directory.
 * EXPORTS: This file exports module(s) for use in other parts of the application.
 * TYPE: React component file
 * HOOKS: Uses React hooks for state and effects
 */

function MapFlyTo({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    if (typeof lat === "number" && typeof lng === "number" && !isNaN(lat) && !isNaN(lng)) {
      map.flyTo([lat, lng], 15, { animate: true, duration: 0.8 });
    }
  }, [lat, lng, map]);
  return null;
}

// ── Marcador temporal para selección de ubicación ──────────────────────────────
function LocationMarker({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      if (onSelect) onSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  if (!position) return null;
  // Bloqueo estricto de SSR para Leaflet globals
  if (typeof window === "undefined" || !(window as any).L) return null;

  const html = renderToStaticMarkup(
    <div className="[TAILWIND_CLASSES_REMOVED]">
      <span className="text-lg">📍</span>
      <div className="[TAILWIND_CLASSES_REMOVED]" />
    </div>
  );

  const L = (window as any).L;
  const redIcon = L.divIcon({
    className: "custom-leaflet-icon bg-transparent border-none",
    html,
    iconSize: [44, 44],
    iconAnchor: [22, 44],
  });

  return (
    <Marker position={position} icon={redIcon}>
      <Popup>Ubicación seleccionada</Popup>
    </Marker>
  );
}

// ── Componente exportado: el mapa Leaflet real ────────────────────────────────
export default function LeafletMap({ events = [], selectedId, onSelect, onLocationSelect }: any) {
  // BLOQUEO ABSOLUTO DE SSR
  if (typeof window === "undefined") return null;

  const selected = events.length > 0 ? (events.find((e: any) => e.id === selectedId) ?? events[0]) : null;

  // buildIcon se mueve dentro para asegurar que no se evalúa al cargar el módulo
  function buildIcon(event: any, isSelected: boolean) {
    if (typeof window === "undefined" || !(window as any).L) return null;

    const emoji =
      event.sport === "Running"
        ? "🏃"
        : event.sport === "Senderismo"
          ? "🥾"
          : event.sport === "Pádel"
            ? "🎾"
            : "🏐";

    const html = renderToStaticMarkup(
      <div
        className={`relative grid h-11 w-11 place-items-center rounded-full ring-4 transition-all ${
          isSelected
            ? "gradient-primary scale-110 ring-background shadow-pop"
            : "bg-secondary ring-card/80"
        }`}
      >
        <span className="text-lg">{emoji}</span>
        <div
          className={`absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 ${
            isSelected ? "bg-primary" : "bg-secondary"
          }`}
        />
      </div>
    );

    const L = (window as any).L;
    return L.divIcon({
      className: "custom-leaflet-icon bg-transparent border-none",
      html,
      iconSize: [44, 44],
      iconAnchor: [22, 44],
    });
  }

  return (
    <MapContainer
      center={[10.49, -66.87]}
      zoom={13}
      style={{[INLINE_STYLES_REMOVED]}}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Marcador de selección de ubicación */}
      {onLocationSelect && <LocationMarker onSelect={onLocationSelect} />}

      {/* Vuela suavemente al marcador seleccionado */}
      {selected && <MapFlyTo lat={selected.lat} lng={selected.lng} />}

      {events.map((e: any) => {
        if (typeof e.lat !== "number" || typeof e.lng !== "number" || isNaN(e.lat) || isNaN(e.lng)) return null;

        const icon = buildIcon(e, e.id === selectedId);
        if (!icon) return null;

        return (
          <Marker
            key={e.id}
            position={[e.lat, e.lng]}
            icon={icon}
            eventHandlers={{
              click: () => {
                if (onSelect) onSelect(e.id);
              },
            }}
          >
            <Popup>
              <div className="[TAILWIND_CLASSES_REMOVED]">{e.title}</div>
              <div className="[TAILWIND_CLASSES_REMOVED]">{e.sport || e.sport_id}</div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}


================================================================================
// END OF FILE: src\components\teammatch\LeafletMap.tsx
================================================================================


================================================================================
// FILE 9 of 76
// PATH: src\components\teammatch\Logo.tsx
// SIZE: 597 characters
================================================================================

/**
 * FILE: Logo.tsx
 * DIRECTORY: teammatch
 * 
 * PURPOSE: This file is located in teammatch directory.
 */

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <div className="[TAILWIND_CLASSES_REMOVED]">
      <div
        className="[TAILWIND_CLASSES_REMOVED]"
        style={{[INLINE_STYLES_REMOVED]}}
      >
        <Trophy className="text-secondary" style={{[INLINE_STYLES_REMOVED]}} strokeWidth={2.5} />
      </div>
      <span className="[TAILWIND_CLASSES_REMOVED]" style={{[INLINE_STYLES_REMOVED]}}>
        Teammatch
      </span>
    </div>
  );
}


================================================================================
// END OF FILE: src\components\teammatch\Logo.tsx
================================================================================


================================================================================
// FILE 10 of 76
// PATH: src\components\teammatch\MapScreen.tsx
// SIZE: 10460 characters
================================================================================

/**
 * FILE: MapScreen.tsx
 * DIRECTORY: teammatch
 * 
 * PURPOSE: This file is located in teammatch directory.
 * TYPE: React component file
 * HOOKS: Uses React hooks for state and effects
 */

const LeafletMap = lazy(() => import("./LeafletMap").then((m) => ({ default: m.default })));

// ── Esqueleto mientras carga el mapa ─────────────────────────────────────────
function MapSkeleton() {
  return (
    <div className="[TAILWIND_CLASSES_REMOVED]">
      <div className="[TAILWIND_CLASSES_REMOVED]">
        <div className="[TAILWIND_CLASSES_REMOVED]">
          <div className="[TAILWIND_CLASSES_REMOVED]" />
          <span className="[TAILWIND_CLASSES_REMOVED]">Cargando mapa…</span>
        </div>
      </div>
    </div>
  );
}

// ── Filtros de deporte ────────────────────────────────────────────────────────
const sports = ["Todos", "Running", "Senderismo", "Pádel", "Vóleibol"] as const;

// ── Componente principal ──────────────────────────────────────────────────────
export function MapScreen({ onSelect }: { onSelect: (e: any) => void }) {
  const [active, setActive] = useState<string>("Todos");
  const [events, setEvents] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<any>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchEvents = useCallback(async () => {
    const { data, error } = await supabase.from("events").select("*").order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching events:", error);
      return;
    }
    
    if (data) {
      const processed = data.map((row: any) => {
        let lat = 0;
        let lng = 0;
        if (row.location) {
          if (typeof row.location === "string") {
            if (row.location.toUpperCase().includes("POINT")) {
              // Limpiamos la cadena WKT y hacemos split por espacio
              const cleaned = row.location.toUpperCase().replace("POINT", "").replace("(", "").replace(")", "").trim();
              const coords = cleaned.split(/\s+/);
              if (coords.length >= 2) {
                lng = parseFloat(coords[0]); // Longitud
                lat = parseFloat(coords[1]); // Latitud
              }
            } else if (/^[0-9A-Fa-f]+$/.test(row.location) && row.location.length >= 50) {
              // Supabase / PostGIS devuelve un WKB Hex String nativo
              // Ej: 0101000020E6100000 + 8 bytes X + 8 bytes Y
              try {
                const hex = row.location;
                const buffer = new Uint8Array(hex.match(/../g)!.map((h: string) => parseInt(h, 16))).buffer;
                const view = new DataView(buffer);
                lng = view.getFloat64(9, true); // true para Little Endian
                lat = view.getFloat64(17, true);
              } catch (err) {
                console.error("Error decodificando WKB Hex de PostGIS:", err);
              }
            }

            // Parche inteligente: Si lat y lng están invertidos en la DB vieja
            // (por ej: lat = -66.87, lng = 10.49 en lugar de lat = 10.49, lng = -66.87)
            // como sabemos que Caracas está en Lat 10, Lng -66, los intercambiamos.
            if (lat < -20 && lng > 0) {
              const temp = lat;
              lat = lng;
              lng = temp;
            }
          } else if (typeof row.location === "object" && row.location.type === "Point") {
            lng = row.location.coordinates[0];
            lat = row.location.coordinates[1];
          }
        }

        // Fallbacks básicos para que la UI no se rompa (EventCard, iconos)
        const sportName = row.sport_id === 1 ? "Fútbol" : row.sport_id === 2 ? "Tenis" : row.sport_id === 3 ? "Golf" : row.sport_id === 4 ? "Pádel" : "Otro";

        return {
          ...row,
          lat,
          lng,
          sport: sportName,
          title: row.title || `Evento de ${sportName}`,
          hostName: row.creator_username || "Usuario",
          hostAvatar: (row.creator_username || "U").substring(0, 2).toUpperCase(),
          time: row.event_date ? new Date(row.event_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "00:00",
          date: row.event_date ? new Date(row.event_date).toLocaleDateString("es-VE", { weekday: "short", day: "numeric", month: "short" }) : "Próximamente",
          image: "https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&q=80&w=800",
          distanceKm: 2.5,
          joined: row.joined ?? 1,
          spots: row.max_capacity || 10,
          price: 0,
          zone: "Caracas",
        };
      });
      
      console.log('Eventos cargados:', processed);
      setEvents(processed);
      if (processed.length > 0) setSelectedId(processed[0].id);
    }
  }, []);

  useEffect(() => {
    fetchEvents();

    // ── Supabase Realtime: Escuchar nuevos eventos ─────────────────────────
    const channel = supabase
      .channel("public:events")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "events" },
        (payload) => {
          console.log("¡Nuevo evento en tiempo real detectado!", payload);
          // Refrescamos la lista para todos
          fetchEvents();
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "events" },
        (payload) => {
          console.log("¡Evento actualizado en tiempo real detectado!", payload);
          fetchEvents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchEvents]);

  const filtered = active === "Todos" ? events : events.filter((e) => e.sport === active);

  return (
    <div className="[TAILWIND_CLASSES_REMOVED]">

      {/* ── Mapa Leaflet (lazy, solo client) ── */}
      <div className="[TAILWIND_CLASSES_REMOVED]">
        <Suspense fallback={<MapSkeleton />}>
          <LeafletMap
            events={filtered}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </Suspense>
      </div>

      {/* ── Top bar ── */}
      <div className="[TAILWIND_CLASSES_REMOVED]">
        <div className="[TAILWIND_CLASSES_REMOVED]">
          <div className="[TAILWIND_CLASSES_REMOVED]">
            <Search size={18} className="text-muted-foreground" />
            <input
              placeholder="Buscar deporte, zona…"
              className="[TAILWIND_CLASSES_REMOVED]"
            />
            <button className="[TAILWIND_CLASSES_REMOVED]">
              <SlidersHorizontal size={14} />
            </button>
          </div>
          <button className="[TAILWIND_CLASSES_REMOVED]">
            <Bell size={18} className="text-secondary" />
            <span className="[TAILWIND_CLASSES_REMOVED]" />
          </button>
        </div>

        {/* Filtros de deporte */}
        <div className="[TAILWIND_CLASSES_REMOVED]">
          {sports.map((s) => (
            <button
              key={s}
              onClick={() => setActive(s)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold shadow-soft transition-all ${
                active === s
                  ? "bg-secondary text-primary-foreground"
                  : "glass text-secondary"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Bottom sheet con cards de eventos ── */}
      <div className="[TAILWIND_CLASSES_REMOVED]">
        <div className="pointer-events-auto">
          <div className="[TAILWIND_CLASSES_REMOVED]">
            <div className="[TAILWIND_CLASSES_REMOVED]" />
          </div>
          <div className="[TAILWIND_CLASSES_REMOVED]">
            <h2 className="[TAILWIND_CLASSES_REMOVED]">
              {filtered.length} eventos cerca de ti
            </h2>
            <button className="[TAILWIND_CLASSES_REMOVED]">Ver todos</button>
          </div>
          <div className="[TAILWIND_CLASSES_REMOVED]">
            {filtered.map((e) => (
              <div
                key={e.id}
                className="[TAILWIND_CLASSES_REMOVED]"
                onClick={() => setSelectedId(e.id)}
              >
                <EventCard event={e} onClick={() => onSelect(e)} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FAB — Crear evento ── */}
      <button
        id="fab-create-event-btn"
        onClick={() => setShowCreateForm(true)}
        className="[TAILWIND_CLASSES_REMOVED]"
        aria-label="Crear evento"
      >
        <Plus size={18} strokeWidth={2.5} />
        Crear
      </button>

      {/* ── Panel de creación (pantalla completa sobre el mapa) ── */}
      {showCreateForm && (
        <div className="[TAILWIND_CLASSES_REMOVED]">
          <CreateEventForm
            onClose={() => setShowCreateForm(false)}
            onEventCreated={fetchEvents}
          />
        </div>
      )}
    </div>
  );
}


================================================================================
// END OF FILE: src\components\teammatch\MapScreen.tsx
================================================================================


================================================================================
// FILE 11 of 76
// PATH: src\components\teammatch\MyEventsScreen.tsx
// SIZE: 8667 characters
================================================================================

/**
 * FILE: MyEventsScreen.tsx
 * DIRECTORY: teammatch
 * 
 * PURPOSE: This file is located in teammatch directory.
 * TYPE: React component file
 * HOOKS: Uses React hooks for state and effects
 */

const tabs = ["Próximos", "Solicitudes", "Historial"] as const;

export function MyEventsScreen({ onSelect }: { onSelect: (e: SportEvent) => void }) {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Próximos");
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [createdEvents, setCreatedEvents] = useState<any[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const formatEvent = (row: any) => {
    if (!row) return null;
    const sportName = row.sport_id === 1 ? "Fútbol" : row.sport_id === 2 ? "Tenis" : row.sport_id === 3 ? "Golf" : row.sport_id === 4 ? "Pádel" : "Otro";
    return {
      ...row,
      sport: sportName,
      title: row.title || `Evento de ${sportName}`,
      hostName: row.creator_username || "Usuario",
      hostAvatar: (row.creator_username || "U").substring(0, 2).toUpperCase(),
      time: row.event_date ? new Date(row.event_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "00:00",
      date: row.event_date ? new Date(row.event_date).toLocaleDateString("es-VE", { weekday: "short", day: "numeric", month: "short" }) : "Próximamente",
      image: "https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&q=80&w=800",
      distanceKm: 2.5,
      joined: row.joined ?? 1,
      spots: row.max_capacity || 10,
      price: 0,
      zone: "Caracas",
    };
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUser(data.user);
      if (data.user) {
        fetchRequests(data.user.email);
        fetchCreated(data.user.email);
        fetchJoined(data.user.email);
      }
    });
  }, []);

  async function fetchCreated(email: string | undefined) {
    if (!email) return;
    const { data } = await supabase.from("events").select("*").eq("creator_username", email).order("created_at", { ascending: false });
    if (data) setCreatedEvents(data.map(formatEvent).filter(Boolean));
  }

  async function fetchJoined(email: string | undefined) {
    if (!email) return;
    const { data } = await supabase.from("event_participants").select("events(*)").eq("user_username", email);
    if (data) setJoinedEvents(data.map((d: any) => formatEvent(d.events)).filter(Boolean));
  }

  async function fetchRequests(email: string | undefined) {
    if (!email) return;
    setLoading(true);
    // Fetch pending requests for events owned by the user
    const { data, error } = await supabase
      .from("event_participants")
      .select(`
        id, 
        user_username, 
        status,
        events!inner(id, creator_username, sport_id),
        profiles(is_premium, rating)
      `)
      .eq("status", "pendiente")
      .eq("events.creator_username", email);
      
    if (!error && data) {
      setPendingRequests(data);
    }
    setLoading(false);
  }

  async function handleAction(participantId: number, status: "aceptado" | "rechazado") {
    setActionLoading(participantId.toString());
    const { error } = await supabase
      .from("event_participants")
      .update({ status })
      .eq("id", participantId);
      
    if (!error) {
      setPendingRequests(prev => prev.filter(r => r.id !== participantId));
    } else {
      console.error(error);
      alert("Error al procesar la solicitud: " + error.message);
    }
    setActionLoading(null);
  }

  return (
    <div className="[TAILWIND_CLASSES_REMOVED]">
      <header className="[TAILWIND_CLASSES_REMOVED]">
        <h1 className="[TAILWIND_CLASSES_REMOVED]">Mis eventos</h1>
        <p className="[TAILWIND_CLASSES_REMOVED]">Tu agenda deportiva</p>
      </header>

      <div className="[TAILWIND_CLASSES_REMOVED]">
        <div className="[TAILWIND_CLASSES_REMOVED]">
          {tabs.map((t) => {
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 rounded-full py-2 text-xs font-semibold transition-all ${
                  tab === t ? "bg-card text-secondary shadow-soft" : "text-muted-foreground"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {tab === "Solicitudes" ? (
        <div className="[TAILWIND_CLASSES_REMOVED]">
          {loading ? (
            <div className="[TAILWIND_CLASSES_REMOVED]"><Loader2 className="[TAILWIND_CLASSES_REMOVED]" /></div>
          ) : pendingRequests.length === 0 ? (
            <div className="[TAILWIND_CLASSES_REMOVED]">No tienes solicitudes pendientes nuevas</div>
          ) : (
            pendingRequests.map((req) => {
              const isPremium = req.profiles?.is_premium;
              const sportName = req.events?.sport_id === 1 ? "Fútbol" : req.events?.sport_id === 2 ? "Tenis" : req.events?.sport_id === 4 ? "Pádel" : "Evento";
              
              return (
              <div key={req.id} className="[TAILWIND_CLASSES_REMOVED]">
                <div className="[TAILWIND_CLASSES_REMOVED]">
                  <div className="[TAILWIND_CLASSES_REMOVED]">
                    {(req.user_username || "U").substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="[TAILWIND_CLASSES_REMOVED]">
                      <div className="[TAILWIND_CLASSES_REMOVED]">
                        {req.user_username?.split('@')[0] || "Usuario"}
                      </div>
                      {isPremium ? (
                        <span className="[TAILWIND_CLASSES_REMOVED]">
                          <Star size={8} className="fill-amber-500" /> Premium
                        </span>
                      ) : (
                        <span className="[TAILWIND_CLASSES_REMOVED]">
                          Básica
                        </span>
                      )}
                    </div>
                    <div className="[TAILWIND_CLASSES_REMOVED]">quiere unirse a tu partido de {sportName}</div>
                  </div>
                </div>
                <div className="[TAILWIND_CLASSES_REMOVED]">
                  <button 
                    disabled={actionLoading === req.id.toString()}
                    onClick={() => handleAction(req.id, "rechazado")}
                    className="[TAILWIND_CLASSES_REMOVED]"
                  >
                    Rechazar
                  </button>
                  <button 
                    disabled={actionLoading === req.id.toString()}
                    onClick={() => handleAction(req.id, "aceptado")}
                    className="[TAILWIND_CLASSES_REMOVED]"
                  >
                    {actionLoading === req.id.toString() ? <Loader2 size={14} className="animate-spin" /> : "Aceptar"}
                  </button>
                </div>
              </div>
            )})
          )}
        </div>
      ) : (
        <div className="[TAILWIND_CLASSES_REMOVED]">
          {(tab === "Próximos" ? createdEvents : joinedEvents).map((e) => (
            <EventCard key={e.id} event={e} onClick={() => onSelect(e)} />
          ))}
          {(tab === "Próximos" ? createdEvents : joinedEvents).length === 0 && (
            <div className="[TAILWIND_CLASSES_REMOVED]">
              {tab === "Próximos" 
                ? "No hay eventos disponibles" 
                : "No te has unido a ningún evento todavía."}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


================================================================================
// END OF FILE: src\components\teammatch\MyEventsScreen.tsx
================================================================================


================================================================================
// FILE 12 of 76
// PATH: src\components\teammatch\ProfileScreen.tsx
// SIZE: 11445 characters
================================================================================

/**
 * FILE: ProfileScreen.tsx
 * DIRECTORY: teammatch
 * 
 * PURPOSE: This file is located in teammatch directory.
 * TYPE: React component file
 * HOOKS: Uses React hooks for state and effects
 */

const SPORT_NAMES: Record<number, string> = {
  1: "Fútbol",
  2: "Tenis",
  3: "Baloncesto",
  4: "Pádel",
  5: "Senderismo",
  6: "Running",
  7: "Vóleibol",
};

const SPORT_EMOJIS: Record<number, string> = {
  1: "⚽",
  2: "🎾",
  3: "🏀",
  4: "🏓",
  5: "🥾",
  6: "🏃",
  7: "🏐",
};

interface SportGroup {
  sportId: number;
  name: string;
  emoji: string;
  count: number;
  events: any[];
}

function formatEvent(row: any): any {
  if (!row) return null;
  const sportName = SPORT_NAMES[row.sport_id] || "Deporte";
  return {
    ...row,
    sport: sportName,
    title: row.title || `Partido de ${sportName}`,
    hostName: row.creator_username || "Usuario",
    hostAvatar: (row.creator_username || "U").substring(0, 2).toUpperCase(),
    time: row.event_date
      ? new Date(row.event_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "00:00",
    date: row.event_date
      ? new Date(row.event_date).toLocaleDateString("es-VE", {
          weekday: "short",
          day: "numeric",
          month: "short",
        })
      : "Próximamente",
    image: "https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&q=80&w=800",
    distanceKm: 2.5,
    joined: row.joined ?? 1,
    spots: row.max_capacity || 10,
    price: 0,
    zone: "Caracas",
  };
}

export function ProfileScreen({
  onEdit,
  onSelectEvent,
}: {
  onEdit?: () => void;
  onSelectEvent?: (e: SportEvent) => void;
}) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sportGroups, setSportGroups] = useState<SportGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<SportGroup | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        setUser(user);

        // Traer eventos completos en los que el usuario participa
        const { data } = await supabase
          .from("event_participants")
          .select(`events!inner(*)`)
          .eq("user_username", user.email);

        if (data && data.length > 0) {
          // Agrupar por deporte
          const groups: Record<number, SportGroup> = {};
          data.forEach((p: any) => {
            const ev = p.events;
            if (!ev) return;
            const sid: number = ev.sport_id;
            if (!groups[sid]) {
              groups[sid] = {
                sportId: sid,
                name: SPORT_NAMES[sid] || "Deporte",
                emoji: SPORT_EMOJIS[sid] || "🏅",
                count: 0,
                events: [],
              };
            }
            groups[sid].count += 1;
            groups[sid].events.push(formatEvent(ev));
          });
          setSportGroups(Object.values(groups));
        }
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
      <div className="[TAILWIND_CLASSES_REMOVED]">
        <Loader2 className="[TAILWIND_CLASSES_REMOVED]" />
      </div>
    );
  }

  const totalEvents = sportGroups.reduce((acc, g) => acc + g.count, 0);

  const stats = [
    { label: "Eventos", value: totalEvents.toString(), icon: Calendar },
    { label: "Rating", value: "4.9", icon: Star },
    { label: "Trofeos", value: "7", icon: Trophy },
  ];

  // ── Vista: eventos de un deporte ──────────────────────────────────────────
  if (selectedGroup) {
    return (
      <div className="[TAILWIND_CLASSES_REMOVED]">
        {/* Header */}
        <div className="[TAILWIND_CLASSES_REMOVED]">
          <button
            onClick={() => setSelectedGroup(null)}
            className="[TAILWIND_CLASSES_REMOVED]"
          >
            <ArrowLeft size={18} className="text-secondary" />
          </button>
          <div>
            <h1 className="[TAILWIND_CLASSES_REMOVED]">
              {selectedGroup.emoji} {selectedGroup.name}
            </h1>
            <p className="[TAILWIND_CLASSES_REMOVED]">
              {selectedGroup.count} partido{selectedGroup.count !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Event list */}
        <div className="[TAILWIND_CLASSES_REMOVED]">
          {selectedGroup.events.map((ev) => (
            <button
              key={ev.id}
              onClick={() => onSelectEvent?.(ev as SportEvent)}
              className="[TAILWIND_CLASSES_REMOVED]"
            >
              <div className="[TAILWIND_CLASSES_REMOVED]">
                <div className="[TAILWIND_CLASSES_REMOVED]">
                  {selectedGroup.emoji}
                </div>
                <div className="[TAILWIND_CLASSES_REMOVED]">
                  <div className="[TAILWIND_CLASSES_REMOVED]">{ev.title}</div>
                  <div className="[TAILWIND_CLASSES_REMOVED]">
                    <span className="[TAILWIND_CLASSES_REMOVED]">
                      <Calendar size={11} />
                      {ev.date}
                    </span>
                    <span className="[TAILWIND_CLASSES_REMOVED]">
                      <Clock size={11} />
                      {ev.time}
                    </span>
                    {ev.intensity && (
                      <span className="[TAILWIND_CLASSES_REMOVED]">
                        {ev.intensity}
                      </span>
                    )}
                  </div>
                  <div className="[TAILWIND_CLASSES_REMOVED]">
                    <MapPin size={11} />
                    <span className="truncate">{ev.zone}</span>
                  </div>
                </div>
                <ChevronRight size={16} className="[TAILWIND_CLASSES_REMOVED]" />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Vista principal del perfil ────────────────────────────────────────────
  return (
    <div className="[TAILWIND_CLASSES_REMOVED]">
      {/* Hero */}
      <div className="[TAILWIND_CLASSES_REMOVED]">
        <div className="[TAILWIND_CLASSES_REMOVED]">
          <button
            onClick={onEdit}
            className="[TAILWIND_CLASSES_REMOVED]"
          >
            <Edit3 size={16} />
          </button>
          <button className="[TAILWIND_CLASSES_REMOVED]">
            <Settings size={16} />
          </button>
        </div>
        <div className="[TAILWIND_CLASSES_REMOVED]">
          {user?.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt="Avatar"
              className="[TAILWIND_CLASSES_REMOVED]"
            />
          ) : (
            <div
              className="[TAILWIND_CLASSES_REMOVED]"
              style={{[INLINE_STYLES_REMOVED]}}
            >
              {initials}
            </div>
          )}
          <div>
            <h1 className="[TAILWIND_CLASSES_REMOVED]">
              {name}
              {user?.user_metadata?.is_organizer && (
                <span className="[TAILWIND_CLASSES_REMOVED]">
                  <Star size={10} className="fill-amber-500" /> Organizador
                </span>
              )}
            </h1>
            <p className="[TAILWIND_CLASSES_REMOVED]">{email}</p>
            <div className="[TAILWIND_CLASSES_REMOVED]">
              <Star size={11} className="fill-primary" /> Jugador verificado
            </div>
          </div>
        </div>
      </div>

      {/* Stats card */}
      <div className="[TAILWIND_CLASSES_REMOVED]">
        <div className="[TAILWIND_CLASSES_REMOVED]">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="[TAILWIND_CLASSES_REMOVED]">
                <s.icon size={16} className="text-primary" />
              </div>
              <div className="[TAILWIND_CLASSES_REMOVED]">{s.value}</div>
              <div className="[TAILWIND_CLASSES_REMOVED]">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sports */}
      <div className="[TAILWIND_CLASSES_REMOVED]">
        <h2 className="[TAILWIND_CLASSES_REMOVED]">Mis deportes</h2>
        <div className="space-y-2">
          {sportGroups.length > 0 ? (
            sportGroups.map((g) => (
              <button
                key={g.sportId}
                onClick={() => setSelectedGroup(g)}
                className="[TAILWIND_CLASSES_REMOVED]"
              >
                <div className="[TAILWIND_CLASSES_REMOVED]">
                  {g.emoji}
                </div>
                <div className="[TAILWIND_CLASSES_REMOVED]">
                  <div className="[TAILWIND_CLASSES_REMOVED]">{g.name}</div>
                  <div className="[TAILWIND_CLASSES_REMOVED]">
                    {g.count} partido{g.count !== 1 ? "s" : ""}
                  </div>
                </div>
                <ChevronRight size={16} className="[TAILWIND_CLASSES_REMOVED]" />
              </button>
            ))
          ) : (
            <div className="[TAILWIND_CLASSES_REMOVED]">
              No has escogido ningún deporte
            </div>
          )}
        </div>
      </div>

      {/* Logout */}
      <div className="[TAILWIND_CLASSES_REMOVED]">
        <button
          onClick={handleLogout}
          className="[TAILWIND_CLASSES_REMOVED]"
        >
          <LogOut size={18} />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}


================================================================================
// END OF FILE: src\components\teammatch\ProfileScreen.tsx
================================================================================


================================================================================
// FILE 13 of 76
// PATH: src\components\teammatch\SportBadge.tsx
// SIZE: 976 characters
================================================================================

/**
 * FILE: SportBadge.tsx
 * DIRECTORY: teammatch
 * 
 * PURPOSE: This file is located in teammatch directory.
 */

const map: Record<string, { bg: string; label: string }> = {
  Running: { bg: "bg-primary text-secondary", label: "🏃" },
  Senderismo: { bg: "bg-accent text-secondary", label: "🥾" },
  Pádel: { bg: "bg-secondary text-primary-foreground", label: "🎾" },
  Tenis: { bg: "bg-warning text-warning-foreground", label: "🎾" },
  Vóleibol: { bg: "bg-chart-3 text-secondary-foreground", label: "🏐" },
  Fútbol: { bg: "bg-emerald-500 text-white", label: "⚽" },
  Golf: { bg: "bg-emerald-700 text-white", label: "⛳" },
  Otro: { bg: "bg-muted text-muted-foreground", label: "🏅" },
};

export function SportBadge({ sport, withEmoji = true }: { sport: string; withEmoji?: boolean }) {
  const m = map[sport] || map["Otro"];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${m.bg}`}>
      {withEmoji && <span>{m.label}</span>}
      {sport}
    </span>
  );
}


================================================================================
// END OF FILE: src\components\teammatch\SportBadge.tsx
================================================================================


================================================================================
// FILE 14 of 76
// PATH: src\components\teammatch\WelcomeScreen.tsx
// SIZE: 4224 characters
================================================================================

/**
 * FILE: WelcomeScreen.tsx
 * DIRECTORY: teammatch
 * 
 * PURPOSE: This file is located in teammatch directory.
 */

export function WelcomeScreen({
  onRegister,
  onLogin,
}: {
  onRegister: () => void;
  onLogin: () => void;
}) {
  return (
    <div className="[TAILWIND_CLASSES_REMOVED]">
      {/* Background map */}
      <div className="[TAILWIND_CLASSES_REMOVED]">
        <img src={caracasMap} alt="Mapa de Caracas" className="[TAILWIND_CLASSES_REMOVED]" />
        <div className="[TAILWIND_CLASSES_REMOVED]" />
      </div>

      {/* Floating glows */}
      <div className="[TAILWIND_CLASSES_REMOVED]" />
      <div className="[TAILWIND_CLASSES_REMOVED]" />

      <div className="[TAILWIND_CLASSES_REMOVED]">
        <div className="[TAILWIND_CLASSES_REMOVED]">
          <Logo size={32} />
        </div>

        <div className="[TAILWIND_CLASSES_REMOVED]">
          <span className="[TAILWIND_CLASSES_REMOVED]">
            <span className="[TAILWIND_CLASSES_REMOVED]" /> Disponible en Caracas
          </span>

          <h1 className="[TAILWIND_CLASSES_REMOVED]">
            Tu próximo
            <br />
            <span className="[TAILWIND_CLASSES_REMOVED]">
              partido te espera.
            </span>
          </h1>
          <p className="[TAILWIND_CLASSES_REMOVED]">
            Encuentra eventos deportivos cerca de ti, únete con un toque o crea el tuyo y arma equipo.
          </p>

          <div className="[TAILWIND_CLASSES_REMOVED]">
            {[
              { icon: MapPin, title: "Mapa en vivo", desc: "Eventos cerca en tiempo real" },
              { icon: Users, title: "Únete fácil", desc: "Solicita un cupo en segundos" },
              { icon: Trophy, title: "Por nivel", desc: "Juega con gente a tu altura" },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="[TAILWIND_CLASSES_REMOVED]"
              >
                <div className="[TAILWIND_CLASSES_REMOVED]">
                  <Icon className="[TAILWIND_CLASSES_REMOVED]" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <div className="[TAILWIND_CLASSES_REMOVED]">{title}</div>
                  <div className="[TAILWIND_CLASSES_REMOVED]">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="[TAILWIND_CLASSES_REMOVED]">
          <button
            id="welcome-register-btn"
            onClick={onRegister}
            className="[TAILWIND_CLASSES_REMOVED]"
          >
            Empezar a jugar
            <ArrowRight className="[TAILWIND_CLASSES_REMOVED]" strokeWidth={2.5} />
          </button>
          <button
            id="welcome-login-btn"
            onClick={onLogin}
            className="[TAILWIND_CLASSES_REMOVED]"
          >
            Ya tengo cuenta
          </button>
          <p className="[TAILWIND_CLASSES_REMOVED]">
            Al continuar aceptas los Términos y la Política de Privacidad
          </p>
        </div>
      </div>
    </div>
  );
}


================================================================================
// END OF FILE: src\components\teammatch\WelcomeScreen.tsx
================================================================================


================================================================================
// FILE 15 of 76
// PATH: src\components\teammatch\data.ts
// SIZE: 1808 characters
================================================================================

/**
 * FILE: data.ts
 * DIRECTORY: teammatch
 * 
 * PURPOSE: This file is located in teammatch directory.
 */

export const events: SportEvent[] = [
  {
    id: "1",
    title: "Running grupal en Chacao",
    sport: "Running",
    level: "Intermedio",
    location: "Parque El Bosque",
    zone: "Chacao",
    date: "Hoy",
    time: "18:00 – 19:30",
    price: 8,
    spots: 14,
    joined: 11,
    host: "Diego R.",
    hostAvatar: "DR",
    image: running,
    distanceKm: 1.2,
    lat: 10.4939,
    lng: -66.8522,
  },
  {
    id: "2",
    title: "Senderismo al Ávila",
    sport: "Senderismo",
    level: "Avanzado",
    location: "Sabas Nieves",
    zone: "Altamira",
    date: "Hoy",
    time: "06:00 – 09:00",
    price: 0,
    spots: 10,
    joined: 6,
    host: "Andrea M.",
    hostAvatar: "AM",
    image: hiking,
    distanceKm: 2.4,
    lat: 10.5100,
    lng: -66.8500,
  },
  {
    id: "3",
    title: "Pádel mixto nivel medio",
    sport: "Pádel",
    level: "Intermedio",
    location: "Padel Club Las Mercedes",
    zone: "Las Mercedes",
    date: "Mañana",
    time: "07:00 – 08:30",
    price: 12,
    spots: 4,
    joined: 3,
    host: "Carlos P.",
    hostAvatar: "CP",
    image: padel,
    distanceKm: 3.1,
    lat: 10.4815,
    lng: -66.8615,
  },
  {
    id: "4",
    title: "Vóleibol playa",
    sport: "Vóleibol",
    level: "Principiante",
    location: "Parque Los Caobos",
    zone: "Los Caobos",
    date: "Sáb 10",
    time: "16:00 – 18:00",
    price: 5,
    spots: 12,
    joined: 4,
    host: "María L.",
    hostAvatar: "ML",
    image: running,
    distanceKm: 4.8,
    lat: 10.4988,
    lng: -66.8967,
  },
];


================================================================================
// END OF FILE: src\components\teammatch\data.ts
================================================================================


================================================================================
// FILE 16 of 76
// PATH: src\components\teammatch\types-nav.ts
// SIZE: 90 characters
================================================================================

/**
 * FILE: types-nav.ts
 * DIRECTORY: teammatch
 * 
 * PURPOSE: This file is located in teammatch directory.
 */

export type Screen = "map" | "events" | "create" | "detail" | "profile" | "editProfile";


================================================================================
// END OF FILE: src\components\teammatch\types-nav.ts
================================================================================


================================================================================
// FILE 17 of 76
// PATH: src\components\teammatch\types.ts
// SIZE: 488 characters
================================================================================

/**
 * FILE: types.ts
 * DIRECTORY: teammatch
 * 
 * PURPOSE: This file is located in teammatch directory.
 */

export type Sport = "Running" | "Senderismo" | "Pádel" | "Tenis" | "Vóleibol";
export type Level = "Principiante" | "Intermedio" | "Avanzado";

export interface SportEvent {
  id: string;
  title: string;
  sport: Sport;
  level: Level;
  location: string;
  zone: string;
  date: string;
  time: string;
  price: number;
  spots: number;
  joined: number;
  host: string;
  hostAvatar: string;
  image: string;
  distanceKm: number;
  lat: number;
  lng: number;
}


================================================================================
// END OF FILE: src\components\teammatch\types.ts
================================================================================


================================================================================
// FILE 18 of 76
// PATH: src\components\ui\accordion.tsx
// SIZE: 2051 characters
================================================================================

/**
 * FILE: accordion.tsx
 * DIRECTORY: ui
 * 
 * PURPOSE: This file is located in ui directory.
 * TYPE: React component file
 */

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn("border-b", className)} {...props} />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown className="[TAILWIND_CLASSES_REMOVED]" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="[TAILWIND_CLASSES_REMOVED]"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };


================================================================================
// END OF FILE: src\components\ui\accordion.tsx
================================================================================


================================================================================
// FILE 19 of 76
// PATH: src\components\ui\alert-dialog.tsx
// SIZE: 4466 characters
================================================================================

/**
 * FILE: alert-dialog.tsx
 * DIRECTORY: ui
 * 
 * PURPOSE: This file is located in ui directory.
 * TYPE: React component file
 */

const AlertDialog = AlertDialogPrimitive.Root;

const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

const AlertDialogPortal = AlertDialogPrimitive.Portal;

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
    ref={ref}
  />
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className,
      )}
      {...props}
    />
  </AlertDialogPortal>
));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

const AlertDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
);
AlertDialogHeader.displayName = "AlertDialogHeader";

const AlertDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props}
  />
);
AlertDialogFooter.displayName = "AlertDialogFooter";

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action ref={ref} className={cn(buttonVariants(), className)} {...props} />
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className)}
    {...props}
  />
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};


================================================================================
// END OF FILE: src\components\ui\alert-dialog.tsx
================================================================================


================================================================================
// FILE 20 of 76
// PATH: src\components\ui\alert.tsx
// SIZE: 1638 characters
================================================================================

/**
 * FILE: alert.tsx
 * DIRECTORY: ui
 * 
 * PURPOSE: This file is located in ui directory.
 * TYPE: React component file
 */

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn("mb-1 font-medium leading-none tracking-tight", className)}
      {...props}
    />
  ),
);
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };


================================================================================
// END OF FILE: src\components\ui\alert.tsx
================================================================================


================================================================================
// FILE 21 of 76
// PATH: src\components\ui\aspect-ratio.tsx
// SIZE: 148 characters
================================================================================

/**
 * FILE: aspect-ratio.tsx
 * DIRECTORY: ui
 * 
 * PURPOSE: This file is located in ui directory.
 */

const AspectRatio = AspectRatioPrimitive.Root;

export { AspectRatio };


================================================================================
// END OF FILE: src\components\ui\aspect-ratio.tsx
================================================================================


================================================================================
// FILE 22 of 76
// PATH: src\components\ui\avatar.tsx
// SIZE: 1460 characters
================================================================================

/**
 * FILE: avatar.tsx
 * DIRECTORY: ui
 * 
 * PURPOSE: This file is located in ui directory.
 * TYPE: React component file
 */

"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className,
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };


================================================================================
// END OF FILE: src\components\ui\avatar.tsx
================================================================================


================================================================================
// FILE 23 of 76
// PATH: src\components\ui\badge.tsx
// SIZE: 1155 characters
================================================================================

/**
 * FILE: badge.tsx
 * DIRECTORY: ui
 * 
 * PURPOSE: This file is located in ui directory.
 * TYPE: React component file
 */

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };


================================================================================
// END OF FILE: src\components\ui\badge.tsx
================================================================================


================================================================================
// FILE 24 of 76
// PATH: src\components\ui\breadcrumb.tsx
// SIZE: 2850 characters
================================================================================

/**
 * FILE: breadcrumb.tsx
 * DIRECTORY: ui
 * 
 * PURPOSE: This file is located in ui directory.
 * TYPE: React component file
 */

const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav"> & {
    separator?: React.ReactNode;
  }
>(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />);
Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbList = React.forwardRef<HTMLOListElement, React.ComponentPropsWithoutRef<"ol">>(
  ({ className, ...props }, ref) => (
    <ol
      ref={ref}
      className={cn(
        "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
        className,
      )}
      {...props}
    />
  ),
);
BreadcrumbList.displayName = "BreadcrumbList";

const BreadcrumbItem = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<"li">>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn("inline-flex items-center gap-1.5", className)} {...props} />
  ),
);
BreadcrumbItem.displayName = "BreadcrumbItem";

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & {
    asChild?: boolean;
  }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      ref={ref}
      className={cn("transition-colors hover:text-foreground", className)}
      {...props}
    />
  );
});
BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbPage = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<"span">>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("font-normal text-foreground", className)}
      {...props}
    />
  ),
);
BreadcrumbPage.displayName = "BreadcrumbPage";

const BreadcrumbSeparator = ({ children, className, ...props }: React.ComponentProps<"li">) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn("[&>svg]:w-3.5 [&>svg]:h-3.5", className)}
    {...props}
  >
    {children ?? <ChevronRight />}
  </li>
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

const BreadcrumbEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="[TAILWIND_CLASSES_REMOVED]" />
    <span className="sr-only">More</span>
  </span>
);
BreadcrumbEllipsis.displayName = "BreadcrumbElipssis";

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};


================================================================================
// END OF FILE: src\components\ui\breadcrumb.tsx
================================================================================


================================================================================
// FILE 25 of 76
// PATH: src\components\ui\button.tsx
// SIZE: 1900 characters
================================================================================

/**
 * FILE: button.tsx
 * DIRECTORY: ui
 * 
 * PURPOSE: This file is located in ui directory.
 * TYPE: React component file
 */

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };


================================================================================
// END OF FILE: src\components\ui\button.tsx
================================================================================


================================================================================
// FILE 26 of 76
// PATH: src\components\ui\calendar.tsx
// SIZE: 7387 characters
================================================================================

/**
 * FILE: calendar.tsx
 * DIRECTORY: ui
 * 
 * PURPOSE: This file is located in ui directory.
 * TYPE: React component file
 * HOOKS: Uses React hooks for state and effects
 */

"use client";

import * as React from "react";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
}) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-background group/calendar p-3 [--cell-size:2rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className,
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) => date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn("relative flex flex-col gap-4 md:flex-row", defaultClassNames.months),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-(--cell-size) w-(--cell-size) select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-(--cell-size) w-(--cell-size) select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaultClassNames.month_caption,
        ),
        dropdowns: cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns,
        ),
        dropdown_root: cn(
          "has-focus:border-ring border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] relative rounded-md border",
          defaultClassNames.dropdown_root,
        ),
        dropdown: cn("bg-popover absolute inset-0 opacity-0", defaultClassNames.dropdown),
        caption_label: cn(
          "select-none font-medium",
          captionLayout === "label"
            ? "text-sm"
            : "[&>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-md pl-2 pr-1 text-sm [&>svg]:size-3.5",
          defaultClassNames.caption_label,
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-muted-foreground flex-1 select-none rounded-md text-[0.8rem] font-normal",
          defaultClassNames.weekday,
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        week_number_header: cn("w-(--cell-size) select-none", defaultClassNames.week_number_header),
        week_number: cn(
          "text-muted-foreground select-none text-[0.8rem]",
          defaultClassNames.week_number,
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full select-none p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md",
          defaultClassNames.day,
        ),
        range_start: cn("bg-accent rounded-l-md", defaultClassNames.range_start),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn("bg-accent rounded-r-md", defaultClassNames.range_end),
        today: cn(
          "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
          defaultClassNames.today,
        ),
        outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground",
          defaultClassNames.outside,
        ),
        disabled: cn("text-muted-foreground opacity-50", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return <div data-slot="calendar" ref={rootRef} className={cn(className)} {...props} />;
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return <ChevronLeftIcon className={cn("size-4", className)} {...props} />;
          }

          if (orientation === "right") {
            return <ChevronRightIcon className={cn("size-4", className)} {...props} />;
          }

          return <ChevronDownIcon className={cn("size-4", className)} {...props} />;
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="[TAILWIND_CLASSES_REMOVED]">
                {children}
              </div>
            </td>
          );
        },
        ...components,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();

  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 flex aspect-square h-auto w-full min-w-(--cell-size) flex-col gap-1 font-normal leading-none data-[range-end=true]:rounded-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className,
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };


================================================================================
// END OF FILE: src\components\ui\calendar.tsx
================================================================================


================================================================================
// FILE 27 of 76
// PATH: src\components\ui\card.tsx
// SIZE: 1872 characters
================================================================================

/**
 * FILE: card.tsx
 * DIRECTORY: ui
 * 
 * PURPOSE: This file is located in ui directory.
 * TYPE: React component file
 */

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-xl border bg-card text-card-foreground shadow", className)}
      {...props}
    />
  ),
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  ),
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };


================================================================================
// END OF FILE: src\components\ui\card.tsx
================================================================================


================================================================================
// FILE 28 of 76
// PATH: src\components\ui\carousel.tsx
// SIZE: 6440 characters
================================================================================

/**
 * FILE: carousel.tsx
 * DIRECTORY: ui
 * 
 * PURPOSE: This file is located in ui directory.
 * TYPE: React component file
 * HOOKS: Uses React hooks for state and effects
 */

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(({ orientation = "horizontal", opts, setApi, plugins, className, children, ...props }, ref) => {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins,
  );
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) {
      return;
    }

    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = React.useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext],
  );

  React.useEffect(() => {
    if (!api || !setApi) {
      return;
    }

    setApi(api);
  }, [api, setApi]);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);

    return () => {
      api?.off("select", onSelect);
    };
  }, [api, onSelect]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        opts,
        orientation: orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div
        ref={ref}
        onKeyDownCapture={handleKeyDown}
        className={cn("relative", className)}
        role="region"
        aria-roledescription="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
});
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { carouselRef, orientation } = useCarousel();

    return (
      <div ref={carouselRef} className="overflow-hidden">
        <div
          ref={ref}
          className={cn(
            "flex",
            orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { orientation } = useCarousel();

    return (
      <div
        ref={ref}
        role="group"
        aria-roledescription="slide"
        className={cn(
          "min-w-0 shrink-0 grow-0 basis-full",
          orientation === "horizontal" ? "pl-4" : "pt-4",
          className,
        )}
        {...props}
      />
    );
  },
);
CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
  ({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel();

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "absolute  h-8 w-8 rounded-full",
          orientation === "horizontal"
            ? "-left-12 top-1/2 -translate-y-1/2"
            : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
          className,
        )}
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        {...props}
      >
        <ArrowLeft className="[TAILWIND_CLASSES_REMOVED]" />
        <span className="sr-only">Previous slide</span>
      </Button>
    );
  },
);
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
  ({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollNext, canScrollNext } = useCarousel();

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "absolute h-8 w-8 rounded-full",
          orientation === "horizontal"
            ? "-right-12 top-1/2 -translate-y-1/2"
            : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
          className,
        )}
        disabled={!canScrollNext}
        onClick={scrollNext}
        {...props}
      >
        <ArrowRight className="[TAILWIND_CLASSES_REMOVED]" />
        <span className="sr-only">Next slide</span>
      </Button>
    );
  },
);
CarouselNext.displayName = "CarouselNext";

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
};


================================================================================
// END OF FILE: src\components\ui\carousel.tsx
================================================================================


================================================================================
// FILE 29 of 76
// PATH: src\components\ui\chart.tsx
// SIZE: 10901 characters
================================================================================

/**
 * FILE: chart.tsx
 * DIRECTORY: ui
 * 
 * PURPOSE: This file is located in ui directory.
 * TYPE: React component file
 */

const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig;
    children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"];
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = "Chart";

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(([, config]) => config.theme || config.color);

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color = itemConfig.theme?.[theme as keyof typeof itemConfig.theme] || itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join("\n")}
}
`,
          )
          .join("\n"),
      }}
    />
  );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<"div"> & {
      hideLabel?: boolean;
      hideIndicator?: boolean;
      indicator?: "line" | "dot" | "dashed";
      nameKey?: string;
      labelKey?: string;
    }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref,
  ) => {
    const { config } = useChart();

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null;
      }

      const [item] = payload;
      const key = `${labelKey || item?.dataKey || item?.name || "value"}`;
      const itemConfig = getPayloadConfigFromPayload(config, item, key);
      const value =
        !labelKey && typeof label === "string"
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label;

      if (labelFormatter) {
        return (
          <div className={cn("font-medium", labelClassName)}>{labelFormatter(value, payload)}</div>
        );
      }

      if (!value) {
        return null;
      }

      return <div className={cn("font-medium", labelClassName)}>{value}</div>;
    }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey]);

    if (!active || !payload?.length) {
      return null;
    }

    const nestLabel = payload.length === 1 && indicator !== "dot";

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className,
        )}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="[TAILWIND_CLASSES_REMOVED]">
          {payload
            .filter((item) => item.type !== "none")
            .map((item, index) => {
              const key = `${nameKey || item.name || item.dataKey || "value"}`;
              const itemConfig = getPayloadConfigFromPayload(config, item, key);
              const indicatorColor = color || item.payload.fill || item.color;

              return (
                <div
                  key={item.dataKey}
                  className={cn(
                    "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                    indicator === "dot" && "items-center",
                  )}
                >
                  {formatter && item?.value !== undefined && item.name ? (
                    formatter(item.value, item.name, item, index, item.payload)
                  ) : (
                    <>
                      {itemConfig?.icon ? (
                        <itemConfig.icon />
                      ) : (
                        !hideIndicator && (
                          <div
                            className={cn(
                              "shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)",
                              {
                                "h-2.5 w-2.5": indicator === "dot",
                                "w-1": indicator === "line",
                                "w-0 border-[1.5px] border-dashed bg-transparent":
                                  indicator === "dashed",
                                "my-0.5": nestLabel && indicator === "dashed",
                              },
                            )}
                            style={
                              {
                                "--color-bg": indicatorColor,
                                "--color-border": indicatorColor,
                              } as React.CSSProperties
                            }
                          />
                        )
                      )}
                      <div
                        className={cn(
                          "flex flex-1 justify-between leading-none",
                          nestLabel ? "items-end" : "items-center",
                        )}
                      >
                        <div className="[TAILWIND_CLASSES_REMOVED]">
                          {nestLabel ? tooltipLabel : null}
                          <span className="text-muted-foreground">
                            {itemConfig?.label || item.name}
                          </span>
                        </div>
                        {item.value && (
                          <span className="[TAILWIND_CLASSES_REMOVED]">
                            {item.value.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    );
  },
);
ChartTooltipContent.displayName = "ChartTooltip";

const ChartLegend = RechartsPrimitive.Legend;

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
    Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
      hideIcon?: boolean;
      nameKey?: string;
    }
>(({ className, hideIcon = false, payload, verticalAlign = "bottom", nameKey }, ref) => {
  const { config } = useChart();

  if (!payload?.length) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className,
      )}
    >
      {payload
        .filter((item) => item.type !== "none")
        .map((item) => {
          const key = `${nameKey || item.dataKey || "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);

          return (
            <div
              key={item.value}
              className={cn(
                "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground",
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="[TAILWIND_CLASSES_REMOVED]"
                  style={{[INLINE_STYLES_REMOVED]}}
                />
              )}
              {itemConfig?.label}
            </div>
          );
        })}
    </div>
  );
});
ChartLegendContent.displayName = "ChartLegend";

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(config: ChartConfig, payload: unknown, key: string) {
  if (typeof payload !== "object" || payload === null) {
    return undefined;
  }

  const payloadPayload =
    "payload" in payload && typeof payload.payload === "object" && payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey: string = key;

  if (key in payload && typeof payload[key as keyof typeof payload] === "string") {
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[key as keyof typeof payloadPayload] as string;
  }

  return configLabelKey in config ? config[configLabelKey] : config[key as keyof typeof config];
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};


================================================================================
// END OF FILE: src\components\ui\chart.tsx
================================================================================


================================================================================
// FILE 30 of 76
// PATH: src\components\ui\checkbox.tsx
// SIZE: 1054 characters
================================================================================

/**
 * FILE: checkbox.tsx
 * DIRECTORY: ui
 * 
 * PURPOSE: This file is located in ui directory.
 * TYPE: React component file
 */

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn("grid place-content-center text-current")}>
      <Check className="[TAILWIND_CLASSES_REMOVED]" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };


================================================================================
// END OF FILE: src\components\ui\checkbox.tsx
================================================================================


================================================================================
// FILE 31 of 76
// PATH: src\components\ui\collapsible.tsx
// SIZE: 346 characters
================================================================================

/**
 * FILE: collapsible.tsx
 * DIRECTORY: ui
 * 
 * PURPOSE: This file is located in ui directory.
 */

"use client";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;

export { Collapsible, CollapsibleTrigger, CollapsibleContent };


================================================================================
// END OF FILE: src\components\ui\collapsible.tsx
================================================================================


================================================================================
// FILE 32 of 76
// PATH: src\components\ui\command.tsx
// SIZE: 5019 characters
================================================================================

/**
 * FILE: command.tsx
 * DIRECTORY: ui
 * 
 * PURPOSE: This file is located in ui directory.
 * TYPE: React component file
 */

"use client";

import * as React from "react";
import { type DialogProps } from "@radix-ui/react-dialog";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
      className,
    )}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

const CommandDialog = ({ children, ...props }: DialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="[TAILWIND_CLASSES_REMOVED]">
        <Command className="[TAILWIND_CLASSES_REMOVED]">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
};

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="[TAILWIND_CLASSES_REMOVED]" cmdk-input-wrapper="">
    <Search className="[TAILWIND_CLASSES_REMOVED]" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  </div>
));

CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
    {...props}
  />
));

CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty ref={ref} className="[TAILWIND_CLASSES_REMOVED]" {...props} />
));

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className,
    )}
    {...props}
  />
));

CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 h-px bg-border", className)}
    {...props}
  />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      className,
    )}
    {...props}
  />
));

CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)}
      {...props}
    />
  );
};
CommandShortcut.displayName = "CommandShortcut";

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};


================================================================================
// END OF FILE: src\components\ui\command.tsx
================================================================================


================================================================================
// FILE 33 of 76
// PATH: src\components\ui\context-menu.tsx
// SIZE: 7578 characters
================================================================================

/**
 * FILE: context-menu.tsx
 * DIRECTORY: ui
 * 
 * PURPOSE: This file is located in ui directory.
 * TYPE: React component file
 */

const ContextMenu = ContextMenuPrimitive.Root;

const ContextMenuTrigger = ContextMenuPrimitive.Trigger;

const ContextMenuGroup = ContextMenuPrimitive.Group;

const ContextMenuPortal = ContextMenuPrimitive.Portal;

const ContextMenuSub = ContextMenuPrimitive.Sub;

const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;

const ContextMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <ContextMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      inset && "pl-8",
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRight className="[TAILWIND_CLASSES_REMOVED]" />
  </ContextMenuPrimitive.SubTrigger>
));
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName;

const ContextMenuSubContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-context-menu-content-transform-origin)",
      className,
    )}
    {...props}
  />
));
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName;

const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      ref={ref}
      className={cn(
        "z-50 max-h-(--radix-context-menu-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-context-menu-content-transform-origin)",
        className,
      )}
      {...props}
    />
  </ContextMenuPrimitive.Portal>
));
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName;

const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName;

const ContextMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <ContextMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    checked={checked}
    {...props}
  >
    <span className="[TAILWIND_CLASSES_REMOVED]">
      <ContextMenuPrimitive.ItemIndicator>
        <Check className="[TAILWIND_CLASSES_REMOVED]" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.CheckboxItem>
));
ContextMenuCheckboxItem.displayName = ContextMenuPrimitive.CheckboxItem.displayName;

const ContextMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <ContextMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <span className="[TAILWIND_CLASSES_REMOVED]">
      <ContextMenuPrimitive.ItemIndicator>
        <Circle className="[TAILWIND_CLASSES_REMOVED]" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.RadioItem>
));
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName;

const ContextMenuLabel = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold text-foreground", inset && "pl-8", className)}
    {...props}
  />
));
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName;

const ContextMenuSeparator = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
));
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName;

const ContextMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)}
      {...props}
    />
  );
};
ContextMenuShortcut.displayName = "ContextMenuShortcut";

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};


================================================================================
// END OF FILE: src\components\ui\context-menu.tsx
================================================================================


================================================================================
// FILE 34 of 76
// PATH: src\components\ui\dialog.tsx
// SIZE: 3905 characters
================================================================================

/**
 * FILE: dialog.tsx
 * DIRECTORY: ui
 * 
 * PURPOSE: This file is located in ui directory.
 * TYPE: React component file
 */

"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="[TAILWIND_CLASSES_REMOVED]">
        <X className="[TAILWIND_CLASSES_REMOVED]" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};


================================================================================
// END OF FILE: src\components\ui\dialog.tsx
================================================================================


================================================================================
// FILE 35 of 76
// PATH: src\components\ui\drawer.tsx
// SIZE: 3071 characters
================================================================================

/**
 * FILE: drawer.tsx
 * DIRECTORY: ui
 * 
 * PURPOSE: This file is located in ui directory.
 * TYPE: React component file
 */

const Drawer = ({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root shouldScaleBackground={shouldScaleBackground} {...props} />
);
Drawer.displayName = "Drawer";

const DrawerTrigger = DrawerPrimitive.Trigger;

const DrawerPortal = DrawerPrimitive.Portal;

const DrawerClose = DrawerPrimitive.Close;

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-black/80", className)}
    {...props}
  />
));
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background",
        className,
      )}
      {...props}
    >
      <div className="[TAILWIND_CLASSES_REMOVED]" />
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
));
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)} {...props} />
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...props} />
);
DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};


================================================================================
// END OF FILE: src\components\ui\drawer.tsx
================================================================================


================================================================================
// FILE 36 of 76
// PATH: src\components\ui\dropdown-menu.tsx
// SIZE: 7784 characters
================================================================================

/**
 * FILE: dropdown-menu.tsx
 * DIRECTORY: ui
 * 
 * PURPOSE: This file is located in ui directory.
 * TYPE: React component file
 */

"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight, Circle } from "lucide-react";

import { cn } from "@/lib/utils";

const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuSub = DropdownMenuPrimitive.Sub;

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto" />
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)",
      className,
    )}
    {...props}
  />
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)",
        className,
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    checked={checked}
    {...props}
  >
    <span className="[TAILWIND_CLASSES_REMOVED]">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="[TAILWIND_CLASSES_REMOVED]" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <span className="[TAILWIND_CLASSES_REMOVED]">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="[TAILWIND_CLASSES_REMOVED]" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span className={cn("ml-auto text-xs tracking-widest opacity-60", className)} {...props} />
  );
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};


================================================================================
// END OF FILE: src\components\ui\dropdown-menu.tsx
================================================================================


================================================================================
// FILE 37 of 76
// PATH: src\components\ui\form.tsx
// SIZE: 4372 characters
================================================================================

/**
 * FILE: form.tsx
 * DIRECTORY: ui
 * 
 * PURPOSE: This file is located in ui directory.
 * TYPE: React component file
 */

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  if (!itemContext) {
    throw new Error("useFormField should be used within <FormItem>");
  }

  const fieldState = getFieldState(fieldContext.name, formState);

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue | null>(null);

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const id = React.useId();

    return (
      <FormItemContext.Provider value={{ id }}>
        <div ref={ref} className={cn("space-y-2", className)} {...props} />
      </FormItemContext.Provider>
    );
  },
);
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
});
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-[0.8rem] text-muted-foreground", className)}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message ?? "") : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-[0.8rem] font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  );
});
FormMessage.displayName = "FormMessage";

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};


================================================================================
// END OF FILE: src\components\ui\form.tsx
================================================================================


================================================================================
// FILE 38 of 76
// PATH: src\components\ui\hover-card.tsx
// SIZE: 1273 characters
================================================================================

/**
 * FILE: hover-card.tsx
 * DIRECTORY: ui
 * 
 * PURPOSE: This file is located in ui directory.
 * TYPE: React component file
 */

const HoverCard = HoverCardPrimitive.Root;

const HoverCardTrigger = HoverCardPrimitive.Trigger;

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      "z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-hover-card-content-transform-origin)",
      className,
    )}
    {...props}
  />
));
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;

export { HoverCard, HoverCardTrigger, HoverCardContent };


================================================================================
// END OF FILE: src\components\ui\hover-card.tsx
================================================================================


================================================================================
// FILE 39 of 76
// PATH: src\components\ui\input-otp.tsx
// SIZE: 2230 characters
================================================================================

/**
 * FILE: input-otp.tsx
 * DIRECTORY: ui
 * 
 * PURPOSE: This file is located in ui directory.
 * TYPE: React component file
 */

const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn(
      "flex items-center gap-2 has-[:disabled]:opacity-50",
      containerClassName,
    )}
    className={cn("disabled:cursor-not-allowed", className)}
    {...props}
  />
));
InputOTP.displayName = "InputOTP";

const InputOTPGroup = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
));
InputOTPGroup.displayName = "InputOTPGroup";

const InputOTPSlot = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & { index: number }
>(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-9 w-9 items-center justify-center border-y border-r border-input text-sm shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
        isActive && "z-10 ring-1 ring-ring",
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="[TAILWIND_CLASSES_REMOVED]">
          <div className="[TAILWIND_CLASSES_REMOVED]" />
        </div>
      )}
    </div>
  );
});
InputOTPSlot.displayName = "InputOTPSlot";

const InputOTPSeparator = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    <Minus />
  </div>
));
InputOTPSeparator.displayName = "InputOTPSeparator";

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };


================================================================================
// END OF FILE: src\components\ui\input-otp.tsx
================================================================================


================================================================================
// FILE 40 of 76
// PATH: src\components\ui\input.tsx
// SIZE: 798 characters
================================================================================

/**
 * FILE: input.tsx
 * DIRECTORY: ui
 * 
 * PURPOSE: This file is located in ui directory.
 * TYPE: React component file
 */

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };


================================================================================
// END OF FILE: src\components\ui\input.tsx
================================================================================


================================================================================
// FILE 41 of 76
// PATH: src\components\ui\label.tsx
// SIZE: 737 characters
================================================================================

/**
 * FILE: label.tsx
 * DIRECTORY: ui
 * 
 * PURPOSE: This file is located in ui directory.
 * TYPE: React component file
 */

"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };


================================================================================
// END OF FILE: src\components\ui\label.tsx
================================================================================


================================================================================
// FILE 42 of 76
// PATH: src\components\ui\menubar.tsx
// SIZE: 8775 characters
================================================================================

/**
 * FILE: menubar.tsx
 * DIRECTORY: ui
 * 
 * PURPOSE: This file is located in ui directory.
 * TYPE: React component file
 */

function MenubarMenu({ ...props }: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu {...props} />;
}

function MenubarGroup({ ...props }: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group {...props} />;
}

function MenubarPortal({ ...props }: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal {...props} />;
}

function MenubarRadioGroup({ ...props }: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return <MenubarPrimitive.RadioGroup {...props} />;
}

function MenubarSub({ ...props }: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />;
}

const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root
    ref={ref}
    className={cn(
      "flex h-9 items-center space-x-1 rounded-md border bg-background p-1 shadow-sm",
      className,
    )}
    {...props}
  />
));
Menubar.displayName = MenubarPrimitive.Root.displayName;

const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-3 py-1 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      className,
    )}
    {...props}
  />
));
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName;

const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      inset && "pl-8",
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRight className="[TAILWIND_CLASSES_REMOVED]" />
  </MenubarPrimitive.SubTrigger>
));
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName;

const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-menubar-content-transform-origin)",
      className,
    )}
    {...props}
  />
));
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName;

const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(({ className, align = "start", alignOffset = -4, sideOffset = 8, ...props }, ref) => (
  <MenubarPrimitive.Portal>
    <MenubarPrimitive.Content
      ref={ref}
      align={align}
      alignOffset={alignOffset}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-menubar-content-transform-origin)",
        className,
      )}
      {...props}
    />
  </MenubarPrimitive.Portal>
));
MenubarContent.displayName = MenubarPrimitive.Content.displayName;

const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));
MenubarItem.displayName = MenubarPrimitive.Item.displayName;

const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    checked={checked}
    {...props}
  >
    <span className="[TAILWIND_CLASSES_REMOVED]">
      <MenubarPrimitive.ItemIndicator>
        <Check className="[TAILWIND_CLASSES_REMOVED]" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.CheckboxItem>
));
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName;

const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <span className="[TAILWIND_CLASSES_REMOVED]">
      <MenubarPrimitive.ItemIndicator>
        <Circle className="[TAILWIND_CLASSES_REMOVED]" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.RadioItem>
));
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName;

const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
    {...props}
  />
));
MenubarLabel.displayName = MenubarPrimitive.Label.displayName;

const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName;

const MenubarShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)}
      {...props}
    />
  );
};
MenubarShortcut.displayname = "MenubarShortcut";

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
};


================================================================================
// END OF FILE: src\components\ui\menubar.tsx
================================================================================


================================================================================
// FILE 43 of 76
// PATH: src\components\ui\navigation-menu.tsx
// SIZE: 5229 characters
================================================================================

/**
 * FILE: navigation-menu.tsx
 * DIRECTORY: ui
 * 
 * PURPOSE: This file is located in ui directory.
 * TYPE: React component file
 */

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn("relative z-10 flex max-w-max flex-1 items-center justify-center", className)}
    {...props}
  >
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
));
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn("group flex flex-1 list-none items-center justify-center space-x-1", className)}
    {...props}
  />
));
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;

const NavigationMenuItem = NavigationMenuPrimitive.Item;

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=open]:text-accent-foreground data-[state=open]:bg-accent/50 data-[state=open]:hover:bg-accent data-[state=open]:focus:bg-accent",
);

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navigationMenuTriggerStyle(), "group", className)}
    {...props}
  >
    {children}{" "}
    <ChevronDown
      className="[TAILWIND_CLASSES_REMOVED]"
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
));
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;

const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto ",
      className,
    )}
    {...props}
  />
));
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;

const NavigationMenuLink = NavigationMenuPrimitive.Link;

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className={cn("absolute left-0 top-full flex justify-center")}>
    <NavigationMenuPrimitive.Viewport
      className={cn(
        "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",
        className,
      )}
      ref={ref}
      {...props}
    />
  </div>
));
NavigationMenuViewport.displayName = NavigationMenuPrimitive.Viewport.displayName;

const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
      className,
    )}
    {...props}
  >
    <div className="[TAILWIND_CLASSES_REMOVED]" />
  </NavigationMenuPrimitive.Indicator>
));
NavigationMenuIndicator.displayName = NavigationMenuPrimitive.Indicator.displayName;

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
};


================================================================================
// END OF FILE: src\components\ui\navigation-menu.tsx
================================================================================


================================================================================
// FILE 44 of 76
// PATH: src\components\ui\pagination.tsx
// SIZE: 2837 characters
================================================================================

/**
 * FILE: pagination.tsx
 * DIRECTORY: ui
 * 
 * PURPOSE: This file is located in ui directory.
 * TYPE: React component file
 */

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn("flex flex-row items-center gap-1", className)} {...props} />
  ),
);
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(
  ({ className, ...props }, ref) => <li ref={ref} className={cn("", className)} {...props} />,
);
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">;

const PaginationLink = ({ className, isActive, size = "icon", ...props }: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      className,
    )}
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    {...props}
  >
    <ChevronLeft className="[TAILWIND_CLASSES_REMOVED]" />
    <span>Previous</span>
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5", className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="[TAILWIND_CLASSES_REMOVED]" />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="[TAILWIND_CLASSES_REMOVED]" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};


================================================================================
// END OF FILE: src\components\ui\pagination.tsx
================================================================================


================================================================================
// FILE 45 of 76
// PATH: src\components\ui\popover.tsx
// SIZE: 1383 characters
================================================================================

/**
 * FILE: popover.tsx
 * DIRECTORY: ui
 * 
 * PURPOSE: This file is located in ui directory.
 * TYPE: React component file
 */

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverAnchor = PopoverPrimitive.Anchor;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)",
        className,
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };


================================================================================
// END OF FILE: src\components\ui\popover.tsx
================================================================================


================================================================================
// FILE 46 of 76
// PATH: src\components\ui\progress.tsx
// SIZE: 806 characters
================================================================================

/**
 * FILE: progress.tsx
 * DIRECTORY: ui
 * 
 * PURPOSE: This file is located in ui directory.
 * TYPE: React component file
 */

"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="[TAILWIND_CLASSES_REMOVED]"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };


================================================================================
// END OF FILE: src\components\ui\progress.tsx
================================================================================


================================================================================
// FILE 47 of 76
// PATH: src\components\ui\radio-group.tsx
// SIZE: 1426 characters
================================================================================

/**
 * FILE: radio-group.tsx
 * DIRECTORY: ui
 * 
 * PURPOSE: This file is located in ui directory.
 * TYPE: React component file
 */

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return <RadioGroupPrimitive.Root className={cn("grid gap-2", className)} {...props} ref={ref} />;
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="[TAILWIND_CLASSES_REMOVED]">
        <Circle className="[TAILWIND_CLASSES_REMOVED]" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };


================================================================================
// END OF FILE: src\components\ui\radio-group.tsx
================================================================================


================================================================================
// FILE 48 of 76
// PATH: src\components\ui\resizable.tsx
// SIZE: 1589 characters
================================================================================

/**
 * FILE: resizable.tsx
 * DIRECTORY: ui
 * 
 * PURPOSE: This file is located in ui directory.
 */

const ResizablePanelGroup = ({ className, ...props }: React.ComponentProps<typeof Group>) => (
  <Group
    className={cn("flex h-full w-full data-[panel-group-direction=vertical]:flex-col", className)}
    {...props}
  />
);

const ResizablePanel = Panel;

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof Separator> & {
  withHandle?: boolean;
}) => (
  <Separator
    className={cn(
      "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90",
      className,
    )}
    {...props}
  >
    {withHandle && (
      <div className="[TAILWIND_CLASSES_REMOVED]">
        <GripVertical className="[TAILWIND_CLASSES_REMOVED]" />
      </div>
    )}
  </Separator>
);

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };


================================================================================
// END OF FILE: src\components\ui\resizable.tsx
================================================================================


================================================================================
// FILE 49 of 76
// PATH: src\components\ui\scroll-area.tsx
// SIZE: 1679 characters
================================================================================

/**
 * FILE: scroll-area.tsx
 * DIRECTORY: ui
 * 
 * PURPOSE: This file is located in ui directory.
 * TYPE: React component file
 */

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="[TAILWIND_CLASSES_REMOVED]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className,
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="[TAILWIND_CLASSES_REMOVED]" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };


================================================================================
// END OF FILE: src\components\ui\scroll-area.tsx
================================================================================


================================================================================
// FILE 50 of 76
// PATH: src\components\ui\select.tsx
// SIZE: 5886 characters
================================================================================

/**
 * FILE: select.tsx
 * DIRECTORY: ui
 * 
 * PURPOSE: This file is located in ui directory.
 * TYPE: React component file
 */

"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="[TAILWIND_CLASSES_REMOVED]" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronUp className="[TAILWIND_CLASSES_REMOVED]" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronDown className="[TAILWIND_CLASSES_REMOVED]" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className,
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <span className="[TAILWIND_CLASSES_REMOVED]">
      <SelectPrimitive.ItemIndicator>
        <Check className="[TAILWIND_CLASSES_REMOVED]" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};


================================================================================
// END OF FILE: src\components\ui\select.tsx
================================================================================


================================================================================
// FILE 51 of 76
// PATH: src\components\ui\separator.tsx
// SIZE: 747 characters
================================================================================

/**
 * FILE: separator.tsx
 * DIRECTORY: ui
 * 
 * PURPOSE: This file is located in ui directory.
 * TYPE: React component file
 */

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn(
      "shrink-0 bg-border",
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      className,
    )}
    {...props}
  />
));
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };


================================================================================
// END OF FILE: src\components\ui\separator.tsx
================================================================================


================================================================================
// FILE 52 of 76
// PATH: src\components\ui\sheet.tsx
// SIZE: 4355 characters
================================================================================

/**
 * FILE: sheet.tsx
 * DIRECTORY: ui
 * 
 * PURPOSE: This file is located in ui directory.
 * TYPE: React component file
 */

"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const SheetClose = SheetPrimitive.Close;

const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
    ref={ref}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  },
);

interface SheetContentProps
  extends
    React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content ref={ref} className={cn(sheetVariants({ side }), className)} {...props}>
      <SheetPrimitive.Close className="[TAILWIND_CLASSES_REMOVED]">
        <X className="[TAILWIND_CLASSES_REMOVED]" />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
      {children}
    </SheetPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props}
  />
);
SheetFooter.displayName = "SheetFooter";

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};


================================================================================
// END OF FILE: src\components\ui\sheet.tsx
================================================================================


================================================================================
// FILE 53 of 76
// PATH: src\components\ui\sidebar.tsx
// SIZE: 24603 characters
================================================================================

/**
 * FILE: sidebar.tsx
 * DIRECTORY: ui
 * 
 * PURPOSE: This file is located in ui directory.
 * TYPE: React component file
 * HOOKS: Uses React hooks for state and effects
 */

const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const isMobile = useIsMobile();
    const [openMobile, setOpenMobile] = React.useState(false);

    // This is the internal state of the sidebar.
    // We use openProp and setOpenProp for control from outside the component.
    const [_open, _setOpen] = React.useState(defaultOpen);
    const open = openProp ?? _open;
    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value;
        if (setOpenProp) {
          setOpenProp(openState);
        } else {
          _setOpen(openState);
        }

        // This sets the cookie to keep the sidebar state.
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
      },
      [setOpenProp, open],
    );

    // Helper to toggle the sidebar.
    const toggleSidebar = React.useCallback(() => {
      return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
    }, [isMobile, setOpen, setOpenMobile]);

    // Adds a keyboard shortcut to toggle the sidebar.
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
          event.preventDefault();
          toggleSidebar();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [toggleSidebar]);

    // We add a state so that we can do data-state="expanded" or "collapsed".
    // This makes it easier to style the sidebar with Tailwind classes.
    const state = open ? "expanded" : "collapsed";

    const contextValue = React.useMemo<SidebarContextProps>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar],
    );

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH,
                "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
              className,
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    );
  },
);
SidebarProvider.displayName = "SidebarProvider";

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right";
    variant?: "sidebar" | "floating" | "inset";
    collapsible?: "offcanvas" | "icon" | "none";
  }
>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "offcanvas",
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

    if (collapsible === "none") {
      return (
        <div
          className={cn(
            "flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground",
            className,
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      );
    }

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            className="[TAILWIND_CLASSES_REMOVED]"
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
              } as React.CSSProperties
            }
            side={side}
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Sidebar</SheetTitle>
              <SheetDescription>Displays the mobile sidebar.</SheetDescription>
            </SheetHeader>
            <div className="[TAILWIND_CLASSES_REMOVED]">{children}</div>
          </SheetContent>
        </Sheet>
      );
    }

    return (
      <div
        ref={ref}
        className="[TAILWIND_CLASSES_REMOVED]"
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        data-variant={variant}
        data-side={side}
      >
        {/* This is what handles the sidebar gap on desktop */}
        <div
          className={cn(
            "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
            "group-data-[collapsible=offcanvas]:w-0",
            "group-data-[side=right]:rotate-180",
            variant === "floating" || variant === "inset"
              ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]"
              : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)",
          )}
        />
        <div
          className={cn(
            "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",
            side === "left"
              ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
              : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
            // Adjust the padding for floating and inset variants.
            variant === "floating" || variant === "inset"
              ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]"
              : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
            className,
          )}
          {...props}
        >
          <div
            data-sidebar="sidebar"
            className="[TAILWIND_CLASSES_REMOVED]"
          >
            {children}
          </div>
        </div>
      </div>
    );
  },
);
Sidebar.displayName = "Sidebar";

const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7", className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <PanelLeft />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
});
SidebarTrigger.displayName = "SidebarTrigger";

const SidebarRail = React.forwardRef<HTMLButtonElement, React.ComponentProps<"button">>(
  ({ className, ...props }, ref) => {
    const { toggleSidebar } = useSidebar();

    return (
      <button
        ref={ref}
        data-sidebar="rail"
        aria-label="Toggle Sidebar"
        tabIndex={-1}
        onClick={toggleSidebar}
        title="Toggle Sidebar"
        className={cn(
          "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
          "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
          "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
          "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar",
          "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
          "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
          className,
        )}
        {...props}
      />
    );
  },
);
SidebarRail.displayName = "SidebarRail";

const SidebarInset = React.forwardRef<HTMLDivElement, React.ComponentProps<"main">>(
  ({ className, ...props }, ref) => {
    return (
      <main
        ref={ref}
        className={cn(
          "relative flex w-full flex-1 flex-col bg-background",
          "md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
          className,
        )}
        {...props}
      />
    );
  },
);
SidebarInset.displayName = "SidebarInset";

const SidebarInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      data-sidebar="input"
      className={cn(
        "h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        className,
      )}
      {...props}
    />
  );
});
SidebarInput.displayName = "SidebarInput";

const SidebarHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-sidebar="header"
        className={cn("flex flex-col gap-2 p-2", className)}
        {...props}
      />
    );
  },
);
SidebarHeader.displayName = "SidebarHeader";

const SidebarFooter = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-sidebar="footer"
        className={cn("flex flex-col gap-2 p-2", className)}
        {...props}
      />
    );
  },
);
SidebarFooter.displayName = "SidebarFooter";

const SidebarSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentProps<typeof Separator>
>(({ className, ...props }, ref) => {
  return (
    <Separator
      ref={ref}
      data-sidebar="separator"
      className={cn("mx-2 w-auto bg-sidebar-border", className)}
      {...props}
    />
  );
});
SidebarSeparator.displayName = "SidebarSeparator";

const SidebarContent = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-sidebar="content"
        className={cn(
          "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
          className,
        )}
        {...props}
      />
    );
  },
);
SidebarContent.displayName = "SidebarContent";

const SidebarGroup = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-sidebar="group"
        className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
        {...props}
      />
    );
  },
);
SidebarGroup.displayName = "SidebarGroup";

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      ref={ref}
      data-sidebar="group-label"
      className={cn(
        "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className,
      )}
      {...props}
    />
  );
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";

const SidebarGroupAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      ref={ref}
      data-sidebar="group-action"
      className={cn(
        "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  );
});
SidebarGroupAction.displayName = "SidebarGroupAction";

const SidebarGroupContent = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-sidebar="group-content"
      className={cn("w-full text-sm", className)}
      {...props}
    />
  ),
);
SidebarGroupContent.displayName = "SidebarGroupContent";

const SidebarMenu = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      data-sidebar="menu"
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      {...props}
    />
  ),
);
SidebarMenu.displayName = "SidebarMenu";

const SidebarMenuItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(
  ({ className, ...props }, ref) => (
    <li
      ref={ref}
      data-sidebar="menu-item"
      className={cn("group/menu-item relative", className)}
      {...props}
    />
  ),
);
SidebarMenuItem.displayName = "SidebarMenuItem";

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_var(--sidebar-border)] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_var(--sidebar-accent)]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean;
    isActive?: boolean;
    tooltip?: string | React.ComponentProps<typeof TooltipContent>;
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(
  (
    {
      asChild = false,
      isActive = false,
      variant = "default",
      size = "default",
      tooltip,
      className,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const { isMobile, state } = useSidebar();

    const button = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
        {...props}
      />
    );

    if (!tooltip) {
      return button;
    }

    if (typeof tooltip === "string") {
      tooltip = {
        children: tooltip,
      };
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          hidden={state !== "collapsed" || isMobile}
          {...tooltip}
        />
      </Tooltip>
    );
  },
);
SidebarMenuButton.displayName = "SidebarMenuButton";

const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean;
    showOnHover?: boolean;
  }
>(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-action"
      className={cn(
        "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover &&
          "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0",
        className,
      )}
      {...props}
    />
  );
});
SidebarMenuAction.displayName = "SidebarMenuAction";

const SidebarMenuBadge = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-sidebar="menu-badge"
      className={cn(
        "pointer-events-none absolute right-1 flex h-5 min-w-5 select-none items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground",
        "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  ),
);
SidebarMenuBadge.displayName = "SidebarMenuBadge";

const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    showIcon?: boolean;
  }
>(({ className, showIcon = false, ...props }, ref) => {
  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  }, []);

  return (
    <div
      ref={ref}
      data-sidebar="menu-skeleton"
      className={cn("flex h-8 items-center gap-2 rounded-md px-2", className)}
      {...props}
    >
      {showIcon && <Skeleton className="[TAILWIND_CLASSES_REMOVED]" data-sidebar="menu-skeleton-icon" />}
      <Skeleton
        className="[TAILWIND_CLASSES_REMOVED]"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  );
});
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton";

const SidebarMenuSub = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      data-sidebar="menu-sub"
      className={cn(
        "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  ),
);
SidebarMenuSub.displayName = "SidebarMenuSub";

const SidebarMenuSubItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(
  ({ ...props }, ref) => <li ref={ref} {...props} />,
);
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";

const SidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a"> & {
    asChild?: boolean;
    size?: "sm" | "md";
    isActive?: boolean;
  }
>(({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  );
});
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};


================================================================================
// END OF FILE: src\components\ui\sidebar.tsx
================================================================================


================================================================================
// FILE 54 of 76
// PATH: src\components\ui\skeleton.tsx
// SIZE: 246 characters
================================================================================

/**
 * FILE: skeleton.tsx
 * DIRECTORY: ui
 * 
 * PURPOSE: This file is located in ui directory.
 */

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-primary/10", className)} {...props} />;
}

export { Skeleton };


================================================================================
// END OF FILE: src\components\ui\skeleton.tsx
================================================================================


================================================================================
// FILE 55 of 76
// PATH: src\components\ui\slider.tsx
// SIZE: 1048 characters
================================================================================

/**
 * FILE: slider.tsx
 * DIRECTORY: ui
 * 
 * PURPOSE: This file is located in ui directory.
 * TYPE: React component file
 */

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center", className)}
    {...props}
  >
    <SliderPrimitive.Track className="[TAILWIND_CLASSES_REMOVED]">
      <SliderPrimitive.Range className="[TAILWIND_CLASSES_REMOVED]" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="[TAILWIND_CLASSES_REMOVED]" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };


================================================================================
// END OF FILE: src\components\ui\slider.tsx
================================================================================


================================================================================
// FILE 56 of 76
// PATH: src\components\ui\sonner.tsx
// SIZE: 757 characters
================================================================================

/**
 * FILE: sonner.tsx
 * DIRECTORY: ui
 * 
 * PURPOSE: This file is located in ui directory.
 */

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };


================================================================================
// END OF FILE: src\components\ui\sonner.tsx
================================================================================


================================================================================
// FILE 57 of 76
// PATH: src\components\ui\switch.tsx
// SIZE: 1183 characters
================================================================================

/**
 * FILE: switch.tsx
 * DIRECTORY: ui
 * 
 * PURPOSE: This file is located in ui directory.
 * TYPE: React component file
 */

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };


================================================================================
// END OF FILE: src\components\ui\switch.tsx
================================================================================


================================================================================
// FILE 58 of 76
// PATH: src\components\ui\table.tsx
// SIZE: 2914 characters
================================================================================

/**
 * FILE: table.tsx
 * DIRECTORY: ui
 * 
 * PURPOSE: This file is located in ui directory.
 * TYPE: React component file
 */

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="[TAILWIND_CLASSES_REMOVED]">
      <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  ),
);
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className)}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        className,
      )}
      {...props}
    />
  ),
);
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className,
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className,
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption ref={ref} className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />
));
TableCaption.displayName = "TableCaption";

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };


================================================================================
// END OF FILE: src\components\ui\table.tsx
================================================================================


================================================================================
// FILE 59 of 76
// PATH: src\components\ui\tabs.tsx
// SIZE: 1944 characters
================================================================================

/**
 * FILE: tabs.tsx
 * DIRECTORY: ui
 * 
 * PURPOSE: This file is located in ui directory.
 * TYPE: React component file
 */

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };


================================================================================
// END OF FILE: src\components\ui\tabs.tsx
================================================================================


================================================================================
// FILE 60 of 76
// PATH: src\components\ui\textarea.tsx
// SIZE: 698 characters
================================================================================

/**
 * FILE: textarea.tsx
 * DIRECTORY: ui
 * 
 * PURPOSE: This file is located in ui directory.
 * TYPE: React component file
 */

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };


================================================================================
// END OF FILE: src\components\ui\textarea.tsx
================================================================================


================================================================================
// FILE 61 of 76
// PATH: src\components\ui\toggle-group.tsx
// SIZE: 1809 characters
================================================================================

/**
 * FILE: toggle-group.tsx
 * DIRECTORY: ui
 * 
 * PURPOSE: This file is located in ui directory.
 * TYPE: React component file
 */

"use client";

import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { toggleVariants } from "@/components/ui/toggle";

const ToggleGroupContext = React.createContext<VariantProps<typeof toggleVariants>>({
  size: "default",
  variant: "default",
});

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn("flex items-center justify-center gap-1", className)}
    {...props}
  >
    <ToggleGroupContext.Provider value={{ variant, size }}>{children}</ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
));

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
    VariantProps<typeof toggleVariants>
>(({ className, children, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className,
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
});

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { ToggleGroup, ToggleGroupItem };


================================================================================
// END OF FILE: src\components\ui\toggle-group.tsx
================================================================================


================================================================================
// FILE 62 of 76
// PATH: src\components\ui\toggle.tsx
// SIZE: 1533 characters
================================================================================

/**
 * FILE: toggle.tsx
 * DIRECTORY: ui
 * 
 * PURPOSE: This file is located in ui directory.
 * TYPE: React component file
 */

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-9 px-2 min-w-9",
        sm: "h-8 px-1.5 min-w-8",
        lg: "h-10 px-2.5 min-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };


================================================================================
// END OF FILE: src\components\ui\toggle.tsx
================================================================================


================================================================================
// FILE 63 of 76
// PATH: src\components\ui\tooltip.tsx
// SIZE: 1310 characters
================================================================================

/**
 * FILE: tooltip.tsx
 * DIRECTORY: ui
 * 
 * PURPOSE: This file is located in ui directory.
 * TYPE: React component file
 */

"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-tooltip-content-transform-origin)",
        className,
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };


================================================================================
// END OF FILE: src\components\ui\tooltip.tsx
================================================================================


================================================================================
// FILE 64 of 76
// PATH: src\hooks\use-mobile.tsx
// SIZE: 595 characters
================================================================================

/**
 * FILE: use-mobile.tsx
 * DIRECTORY: hooks
 * 
 * PURPOSE: This file is located in hooks directory.
 * TYPE: React component file
 * HOOKS: Uses React hooks for state and effects
 */

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}


================================================================================
// END OF FILE: src\hooks\use-mobile.tsx
================================================================================


================================================================================
// FILE 65 of 76
// PATH: src\lib\error-capture.ts
// SIZE: 933 characters
================================================================================

/**
 * FILE: error-capture.ts
 * DIRECTORY: lib
 * 
 * PURPOSE: This file is located in lib directory.
 */

let lastCapturedError: { error: unknown; at: number } | undefined;
const TTL_MS = 5_000;

function record(error: unknown) {
  lastCapturedError = { error, at: Date.now() };
}

if (typeof globalThis.addEventListener === "function") {
  globalThis.addEventListener("error", (event) => record((event as ErrorEvent).error ?? event));
  globalThis.addEventListener("unhandledrejection", (event) =>
    record((event as PromiseRejectionEvent).reason),
  );
}

export function consumeLastCapturedError(): unknown {
  if (!lastCapturedError) return undefined;
  if (Date.now() - lastCapturedError.at > TTL_MS) {
    lastCapturedError = undefined;
    return undefined;
  }
  const { error } = lastCapturedError;
  lastCapturedError = undefined;
  return error;
}


================================================================================
// END OF FILE: src\lib\error-capture.ts
================================================================================


================================================================================
// FILE 66 of 76
// PATH: src\lib\error-page.ts
// SIZE: 1401 characters
================================================================================

/**
 * FILE: error-page.ts
 * DIRECTORY: lib
 * 
 * PURPOSE: This file is located in lib directory.
 */

export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #4b5563; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.375rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #111; color: #fff; }
      .secondary { background: #fff; color: #111; border-color: #d1d5db; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>This page didn't load</h1>
      <p>Something went wrong on our end. You can try refreshing or head back home.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
      </div>
    </div>
  </body>
</html>`;
}


================================================================================
// END OF FILE: src\lib\error-page.ts
================================================================================


================================================================================
// FILE 67 of 76
// PATH: src\lib\supabase.ts
// SIZE: 497 characters
================================================================================

/**
 * FILE: supabase.ts
 * DIRECTORY: lib
 * 
 * PURPOSE: This file is located in lib directory.
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Faltan las variables de entorno VITE_SUPABASE_URL y/o VITE_SUPABASE_ANON_KEY. ' +
    'Asegúrate de que el archivo .env.local existe y está configurado correctamente.',
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


================================================================================
// END OF FILE: src\lib\supabase.ts
================================================================================


================================================================================
// FILE 68 of 76
// PATH: src\lib\utils.ts
// SIZE: 175 characters
================================================================================

/**
 * FILE: utils.ts
 * DIRECTORY: lib
 * 
 * PURPOSE: This file is located in lib directory.
 * TYPE: Utility/helper functions
 */

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


================================================================================
// END OF FILE: src\lib\utils.ts
================================================================================


================================================================================
// FILE 69 of 76
// PATH: src\routeTree.gen.ts
// SIZE: 1797 characters
================================================================================

/**
 * FILE: routeTree.gen.ts
 * DIRECTORY: src
 * 
 * PURPOSE: This file is located in src directory.
 */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { Route as rootRouteImport } from './routes/__root'
import { Route as IndexRouteImport } from './routes/index'

const IndexRoute = IndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRouteImport,
} as any)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
}
export interface FileRoutesByTo {
  '/': typeof IndexRoute
}
export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/': typeof IndexRoute
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/'
  fileRoutesByTo: FileRoutesByTo
  to: '/'
  id: '__root__' | '/'
  fileRoutesById: FileRoutesById
}
export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexRouteImport
      parentRoute: typeof rootRouteImport
    }
  }
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
}
export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

import type { getRouter } from './router.tsx'
import type { startInstance } from './start.ts'
declare module '@tanstack/react-start' {
  interface Register {
    ssr: true
    router: Awaited<ReturnType<typeof getRouter>>
    config: Awaited<ReturnType<typeof startInstance.getOptions>>
  }
}


================================================================================
// END OF FILE: src\routeTree.gen.ts
================================================================================


================================================================================
// FILE 70 of 76
// PATH: src\router.tsx
// SIZE: 410 characters
================================================================================

/**
 * FILE: router.tsx
 * DIRECTORY: src
 * 
 * PURPOSE: This file is located in src directory.
 */

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};


================================================================================
// END OF FILE: src\router.tsx
================================================================================


================================================================================
// FILE 71 of 76
// PATH: src\routes\__root.tsx
// SIZE: 3781 characters
================================================================================

/**
 * FILE: __root.tsx
 * DIRECTORY: routes
 * 
 * PURPOSE: This file is located in routes directory.
 */

function NotFoundComponent() {
  return (
    <div className="[TAILWIND_CLASSES_REMOVED]">
      <div className="[TAILWIND_CLASSES_REMOVED]">
        <h1 className="[TAILWIND_CLASSES_REMOVED]">404</h1>
        <h2 className="[TAILWIND_CLASSES_REMOVED]">Page not found</h2>
        <p className="[TAILWIND_CLASSES_REMOVED]">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="[TAILWIND_CLASSES_REMOVED]"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="[TAILWIND_CLASSES_REMOVED]">
      <div className="[TAILWIND_CLASSES_REMOVED]">
        <h1 className="[TAILWIND_CLASSES_REMOVED]">
          This page didn't load
        </h1>
        <p className="[TAILWIND_CLASSES_REMOVED]">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="[TAILWIND_CLASSES_REMOVED]">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="[TAILWIND_CLASSES_REMOVED]"
          >
            Try again
          </button>
          <a
            href="/"
            className="[TAILWIND_CLASSES_REMOVED]"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lovable App" },
      { name: "description", content: "Lovable Generated Project" },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Lovable App" },
      { property: "og:description", content: "Lovable Generated Project" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}


================================================================================
// END OF FILE: src\routes\__root.tsx
================================================================================


================================================================================
// FILE 72 of 76
// PATH: src\routes\index.tsx
// SIZE: 6770 characters
================================================================================

/**
 * FILE: index.tsx
 * DIRECTORY: routes
 * 
 * PURPOSE: This file is located in routes directory.
 * TYPE: React component file
 * HOOKS: Uses React hooks for state and effects
 */

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Teammatch — Encuentra tu próximo partido en Caracas" },
      {
        name: "description",
        content:
          "Teammatch conecta jugadores y organizadores de eventos deportivos en Caracas. Encuentra partidos cercanos en el mapa y únete en segundos.",
      },
    ],
  }),
});

type AppState = "checking" | "welcome" | "auth" | "app";

function Index() {
  const [appState, setAppState] = useState<AppState>("checking");
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  
  const [screen, setScreen] = useState<Screen>("map");
  const [selected, setSelected] = useState<SportEvent | null>(null);


  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAppState(session ? "app" : "welcome");
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAppState(session ? "app" : "welcome");
    });

    return () => subscription.unsubscribe();
  }, []);

  const openDetail = (e: SportEvent) => {
    setSelected(e);
    setScreen("detail");
  };

  const renderScreen = () => {
    if (appState === "checking") {
      return (
        <div className="[TAILWIND_CLASSES_REMOVED]">
          <div className="[TAILWIND_CLASSES_REMOVED]" />
        </div>
      );
    }
    
    if (appState === "welcome") {
      return (
        <WelcomeScreen 
          onLogin={() => { setAuthMode("login"); setAppState("auth"); }}
          onRegister={() => { setAuthMode("register"); setAppState("auth"); }}
        />
      );
    }
    
    if (appState === "auth") {
      return (
        <AuthScreen 
          initialMode={authMode}
          onSuccess={() => setAppState("app")}
          onClose={() => setAppState("welcome")}
        />
      );
    }


    if (screen === "detail" && selected)
      return <EventDetailScreen event={selected} onBack={() => setScreen("map")} />;
    if (screen === "events") return <MyEventsScreen onSelect={openDetail} />;
    if (screen === "editProfile") return <EditProfileScreen onBack={() => setScreen("profile")} />;
    if (screen === "profile") return <ProfileScreen onEdit={() => setScreen("editProfile")} onSelectEvent={openDetail} />;
    return <MapScreen onSelect={openDetail} />;
  };

  return (
    <main className="[TAILWIND_CLASSES_REMOVED]"> 
      <div className="[TAILWIND_CLASSES_REMOVED]">
        {/* Panel lateral solo en desktop */}
        {appState !== "app" && (
        <aside className="[TAILWIND_CLASSES_REMOVED]">
          <div className="[TAILWIND_CLASSES_REMOVED]" />
          <div className="[TAILWIND_CLASSES_REMOVED]" />

          <div className="relative">
            <Logo size={36} />
          </div>

          <div className="relative">
            <span className="[TAILWIND_CLASSES_REMOVED]">
              <span className="[TAILWIND_CLASSES_REMOVED]" /> Disponible en Caracas
            </span>
            <h1 className="[TAILWIND_CLASSES_REMOVED]">
              Encuentra tu próximo
              <br />
              <span className="[TAILWIND_CLASSES_REMOVED]">
                partido en Caracas.
              </span>
            </h1>
            <p className="[TAILWIND_CLASSES_REMOVED]">
              Crea eventos deportivos o únete a partidos cerca de ti. Mapa en vivo, jugadores
              verificados y matchmaking por nivel.
            </p>

            <div className="[TAILWIND_CLASSES_REMOVED]">
              {[
                { k: "1.2k", v: "Jugadores" },
                { k: "320", v: "Eventos/mes" },
                { k: "4.9★", v: "Rating" },
              ].map((s) => (
                <div
                  key={s.v}
                  className="[TAILWIND_CLASSES_REMOVED]"
                >
                  <div className="[TAILWIND_CLASSES_REMOVED]">{s.k}</div>
                  <div className="[TAILWIND_CLASSES_REMOVED]">{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="[TAILWIND_CLASSES_REMOVED]">
            👉 ¡A jugar ya!
          </div>
        </aside>
        )}

        {/* Área de la app: pantalla completa en móvil, columna derecha en desktop */}
        <section 
          className={`relative flex min-h-[100dvh] w-full flex-col overflow-hidden bg-background ${
            appState !== "app" 
              ? "lg:max-w-[520px] lg:border-l lg:border-primary-foreground/10 lg:shadow-pop" 
              : "flex-1"
          }`}
        >
          <div className="[TAILWIND_CLASSES_REMOVED]">
            {renderScreen()}
            {appState === "app" && screen !== "detail" && screen !== "editProfile" && (
              <BottomNav
                current={screen}
                onChange={setScreen}
              />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}


================================================================================
// END OF FILE: src\routes\index.tsx
================================================================================


================================================================================
// FILE 73 of 76
// PATH: src\server.ts
// SIZE: 2569 characters
================================================================================

/**
 * FILE: server.ts
 * DIRECTORY: src
 * 
 * PURPOSE: This file is located in src directory.
 * EXPORTS: This file exports module(s) for use in other parts of the application.
 */

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => ((m as { default?: ServerEntry }).default ?? (m as unknown as ServerEntry)),
    );
  }
  return serverEntryPromise;
}

function brandedErrorResponse(): Response {
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isCatastrophicSsrErrorBody(body: string, responseStatus: number): boolean {
  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return false;
  }

  if (!payload || Array.isArray(payload) || typeof payload !== "object") {
    return false;
  }

  const fields = payload as Record<string, unknown>;
  const expectedKeys = new Set(["message", "status", "unhandled"]);
  if (!Object.keys(fields).every((key) => expectedKeys.has(key))) {
    return false;
  }

  return (
    fields.unhandled === true &&
    fields.message === "HTTPError" &&
    (fields.status === undefined || fields.status === responseStatus)
  );
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isCatastrophicSsrErrorBody(body, response.status)) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return brandedErrorResponse();
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return brandedErrorResponse();
    }
  },
};


================================================================================
// END OF FILE: src\server.ts
================================================================================


================================================================================
// FILE 74 of 76
// PATH: src\start.ts
// SIZE: 641 characters
================================================================================

/**
 * FILE: start.ts
 * DIRECTORY: src
 * 
 * PURPOSE: This file is located in src directory.
 */

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

export const startInstance = createStart(() => ({
  requestMiddleware: [errorMiddleware],
}));


================================================================================
// END OF FILE: src\start.ts
================================================================================


================================================================================
// FILE 75 of 76
// PATH: src\vite-env.d.ts
// SIZE: 45 characters
================================================================================

/**
 * FILE: vite-env.d.ts
 * DIRECTORY: src
 * 
 * PURPOSE: This file is located in src directory.
 */



================================================================================
// END OF FILE: src\vite-env.d.ts
================================================================================


================================================================================
// FILE 76 of 76
// PATH: vite.config.ts
// SIZE: 867 characters
================================================================================

/**
 * FILE: vite.config.ts
 * DIRECTORY: TeamMatch
 * 
 * PURPOSE: This file is located in TeamMatch directory.
 * EXPORTS: This file exports module(s) for use in other parts of the application.
 */

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
});

// Force Vite cache clear (1)


================================================================================
// END OF FILE: vite.config.ts
================================================================================



/**
 * END OF COMBINED FILES
 * Total files processed: 76
 * Total size: 316540 characters
 */
