import { useState, useEffect } from "react";
import { ArrowLeft, Loader2, Save, Camera } from "lucide-react";
import { supabase } from "@/lib/supabase";

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
      <div className="flex h-full w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-background">
      <header className="flex items-center gap-3 px-5 py-4">
        <button
          onClick={onBack}
          className="grid h-10 w-10 place-items-center rounded-full bg-card shadow-soft transition-transform active:scale-95"
        >
          <ArrowLeft size={20} className="text-secondary" />
        </button>
        <h1 className="text-xl font-bold text-secondary">Editar Perfil</h1>
      </header>

      <form onSubmit={handleSave} className="flex-1 px-5 pt-4 space-y-6">
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
          <div className="relative h-24 w-24">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="h-full w-full rounded-full object-cover border-4 border-card shadow-soft" />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-secondary text-3xl font-bold text-[#32CD32] shadow-soft">
                {(name || "U").substring(0, 2).toUpperCase()}
              </div>
            )}
            <label className="absolute bottom-0 right-0 grid h-8 w-8 cursor-pointer place-items-center rounded-full bg-primary text-secondary shadow-pop transition-transform hover:scale-105 active:scale-95">
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
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Foto de perfil</p>
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
        </div>

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
      </form>
    </div>
  );
}
