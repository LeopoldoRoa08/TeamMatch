import { useState, useEffect } from "react";
import { ArrowLeft, Loader2, Save, Camera } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useCurrentUser } from "@/lib/UserContext";

interface Props {
  onBack: () => void;
}

export function EditProfileScreen({ onBack }: Props) {
  const { user: currentUser, updateProfile } = useCurrentUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Nuevos campos de perfil
  const [age, setAge] = useState<number | undefined>(undefined);
  const [gender, setGender] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [preferredSports, setPreferredSports] = useState<string[]>([]);

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
      setName(currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || "");
      setEmail(currentUser.email || "");
      setAvatarUrl(currentUser.user_metadata?.avatar_url || null);
      setIsOrganizer(!!currentUser.user_metadata?.is_organizer);
      
      setAge(currentUser.user_metadata?.age || undefined);
      setGender(currentUser.user_metadata?.gender || "");
      setDescription(currentUser.user_metadata?.description || "");
      setLocation(currentUser.user_metadata?.location || "");
      setPreferredSports(currentUser.user_metadata?.preferred_sports || []);
      
      setLoading(false);
    } else {
      // Fallback in case context hasn't loaded yet
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          setUser(user);
          setName(user.user_metadata?.full_name || user.email?.split('@')[0] || "");
          setEmail(user.email || "");
          setAvatarUrl(user.user_metadata?.avatar_url || null);
          setIsOrganizer(!!user.user_metadata?.is_organizer);
          
          setAge(user.user_metadata?.age || undefined);
          setGender(user.user_metadata?.gender || "");
          setDescription(user.user_metadata?.description || "");
          setLocation(user.user_metadata?.location || "");
          setPreferredSports(user.user_metadata?.preferred_sports || []);
        }
        setLoading(false);
      });
    }
  }, [currentUser]);


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
      await updateProfile({
        name,
        avatarUrl,
        isOrganizer,
        email: email !== user?.email ? email : undefined,
        age,
        gender,
        description,
        location,
        preferredSports
      });
      
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
      <div className="flex h-full w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-background">
      <header className="flex items-center gap-3 px-5 py-4 shrink-0">
        <button
          onClick={onBack}
          className="grid h-10 w-10 place-items-center rounded-full bg-card shadow-soft transition-transform active:scale-95"
        >
          <ArrowLeft size={20} className="text-secondary" />
        </button>
        <h1 className="text-xl font-bold text-secondary">Editar Perfil</h1>
      </header>

      <form onSubmit={handleSave} className="flex flex-1 flex-col overflow-hidden">
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 pt-4 pb-4 space-y-6">
          {error && (
            <div className="rounded-xl bg-destructive/10 p-3 text-sm font-semibold text-destructive">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-xl bg-primary/10 p-3 text-sm font-semibold text-primary">
              {success}
            </div>
          )}

          <div className="flex flex-col items-center justify-center space-y-3 pb-2">
            <div className="relative">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="h-24 w-24 rounded-full object-cover border-2 border-primary/30" />
              ) : (
                <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
                  {name.substring(0, 2).toUpperCase()}
                </div>
              )}
              <label className="absolute bottom-0 right-0 grid h-8 w-8 cursor-pointer place-items-center rounded-full bg-primary text-secondary shadow-pop transition-transform active:scale-90">
                {uploadingImage ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImage} />
              </label>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Foto de perfil</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground">Nombre completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-secondary outline-none transition-colors focus:border-primary"
                placeholder="Tu nombre"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-secondary outline-none transition-colors focus:border-primary"
                placeholder="tu@email.com"
                required
              />
              <p className="text-[10px] text-muted-foreground">
                Al cambiar el correo electrónico, se enviará un mensaje de confirmación.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground">Edad</label>
                <input
                  type="number"
                  value={age ?? ""}
                  onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-secondary outline-none transition-colors focus:border-primary"
                  placeholder="Ej. 25"
                  min="1"
                  max="120"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground">Género</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-secondary outline-none transition-colors focus:border-primary"
                >
                  <option value="">Seleccionar...</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground">Ubicación (Municipio/Zona)</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-secondary outline-none transition-colors focus:border-primary"
                placeholder="Ej. Chacao, Caracas"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground">Sobre mí (Descripción)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-secondary outline-none transition-colors focus:border-primary resize-none"
                placeholder="Cuéntanos un poco sobre ti, tu nivel de juego, etc."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground block">Deportes preferidos</label>
              <div className="flex flex-wrap gap-2">
                {["Running", "Senderismo", "Pádel", "Tenis", "Vóleibol"].map((sport) => {
                  const isSelected = preferredSports.includes(sport);
                  return (
                    <button
                      key={sport}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setPreferredSports(preferredSports.filter((s) => s !== sport));
                        } else {
                          setPreferredSports([...preferredSports, sport]);
                        }
                      }}
                      className={`rounded-full px-3 py-1.5 text-xs font-bold border transition-all ${
                        isSelected
                          ? "bg-primary/20 text-primary border-primary"
                          : "bg-card text-muted-foreground border-border hover:border-muted-foreground"
                      }`}
                    >
                      {sport}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 cursor-pointer transition-all hover:border-primary/50 active:scale-[0.99]">
                <input
                  type="checkbox"
                  checked={isOrganizer}
                  onChange={(e) => setIsOrganizer(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary accent-primary"
                />
                <div className="text-left">
                  <span className="text-sm font-bold text-secondary block">
                    Modo Organizador
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Te permite registrar y gestionar tus propias instalaciones y canchas
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Fixed save button at bottom */}
        <div className="shrink-0 px-5 py-4 border-t border-border bg-background">
          <button
            type="submit"
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-2xl gradient-primary py-4 text-sm font-bold text-secondary shadow-pop transition-transform active:scale-[0.98] disabled:opacity-70"
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
        </div>
      </form>
    </div>
  );
}
