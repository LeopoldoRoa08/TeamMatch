import { useState, useEffect, useRef } from "react";
import { ArrowLeft, MessageSquare, Send, Loader2, AlertCircle, CalendarCheck, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useCurrentUser } from "@/lib/UserContext";
import { useSettings } from "@/lib/SettingsContext";

// Helper function to parse location coordinates
function parseLocation(location: any): { lat: number; lng: number } | null {
  if (!location) return null;
  if (typeof location === "object") {
    if (typeof location.lat === "number" && typeof location.lng === "number") {
      return { lat: location.lat, lng: location.lng };
    }
    if (Array.isArray(location) && location.length >= 2) {
      return { lat: location[0], lng: location[1] };
    }
    if (location.type === "Point" && Array.isArray(location.coordinates) && location.coordinates.length >= 2) {
      return { lat: location.coordinates[1], lng: location.coordinates[0] };
    }
  }
  if (typeof location === "string") {
    if (location.toUpperCase().includes("POINT")) {
      const cleaned = location.toUpperCase().replace("POINT", "").replace("(", "").replace(")", "").trim();
      const coords = cleaned.split(/\s+/);
      if (coords.length >= 2) {
        let lng = parseFloat(coords[0]);
        let lat = parseFloat(coords[1]);
        if (lat < -20 && lng > 0) {
          const temp = lat;
          lat = lng;
          lng = temp;
        }
        return { lat, lng };
      }
    } else if (/^[0-9A-Fa-f]+$/.test(location) && location.length >= 50) {
      try {
        const hex = location;
        const buffer = new Uint8Array(hex.match(/../g)!.map((h: string) => parseInt(h, 16))).buffer;
        const view = new DataView(buffer);
        let lng = view.getFloat64(9, true);
        let lat = view.getFloat64(17, true);
        if (lat < -20 && lng > 0) {
          const temp = lat;
          lat = lng;
          lng = temp;
        }
        return { lat, lng };
      } catch (err) {
        console.error("Error decodificando WKB Hex de PostGIS en CanchaCommentsScreen:", err);
      }
    }
  }
  return null;
}

interface CanchaCommentsScreenProps {
  cancha: any;
  onBack: () => void;
  onOpenAuth?: () => void;
}

export function CanchaCommentsScreen({ cancha, onBack, onOpenAuth }: CanchaCommentsScreenProps) {
  const { user } = useCurrentUser();
  const { t } = useSettings();
  const [comments, setComments] = useState<any[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [canComment, setCanComment] = useState(false);
  const [checkingPermission, setCheckingPermission] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const commentsEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new comments are loaded
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  // Fetch comments and subscribe to updates
  useEffect(() => {
    fetchComments();

    // Subscribe to comments updates
    const channel = supabase
      .channel(`public:comentarios_Canchas:id_Cancha=eq.${cancha.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comentarios_Canchas",
          filter: `id_Cancha=eq.${cancha.id}`,
        },
        () => {
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [cancha.id]);

  // Check commenting permission based on event participation
  useEffect(() => {
    if (!user || !user.email) {
      setCanComment(false);
      setCheckingPermission(false);
      return;
    }

    async function checkPermission() {
      setCheckingPermission(true);
      const lat = cancha.lat ?? parseLocation(cancha.location)?.lat;
      const lng = cancha.lng ?? parseLocation(cancha.location)?.lng;

      if (!lat || !lng) {
        setCanComment(false);
        setCheckingPermission(false);
        return;
      }

      try {
        // Fetch user's approved participations in events
        const { data: participations, error: partError } = await supabase
          .from("event_participants")
          .select(`
            status,
            events (
              location
            )
          `)
          .eq("user_username", user.email)
          .in("status", ["approved", "aceptado", "aprobado"]);

        if (partError) {
          console.error("Error checking participations:", partError);
        }

        // Fetch events created by user
        const { data: createdEvents, error: createdError } = await supabase
          .from("events")
          .select("location")
          .eq("creator_username", user.email);

        if (createdError) {
          console.error("Error checking created events:", createdError);
        }

        let hasParticipated = false;

        // Check inside approved participations
        if (participations && participations.length > 0) {
          hasParticipated = participations.some((p: any) => {
            const event = p.events;
            if (!event) return false;
            const eventCoords = parseLocation(event.location);
            if (!eventCoords) return false;
            const diffLat = Math.abs(eventCoords.lat - lat);
            const diffLng = Math.abs(eventCoords.lng - lng);
            return diffLat < 0.0001 && diffLng < 0.0001;
          });
        }

        // Check inside created events (if not already true)
        if (!hasParticipated && createdEvents && createdEvents.length > 0) {
          hasParticipated = createdEvents.some((event: any) => {
            const eventCoords = parseLocation(event.location);
            if (!eventCoords) return false;
            const diffLat = Math.abs(eventCoords.lat - lat);
            const diffLng = Math.abs(eventCoords.lng - lng);
            return diffLat < 0.0001 && diffLng < 0.0001;
          });
        }

        setCanComment(hasParticipated);
      } catch (error) {
        console.error("Error determining commenting permission:", error);
        setCanComment(false);
      } finally {
        setCheckingPermission(false);
      }
    }

    checkPermission();
  }, [user, cancha]);

  async function fetchComments() {
    try {
      const { data, error } = await supabase
        .from("comentarios_Canchas")
        .select("*")
        .eq("id_Cancha", cancha.id)
        .order("hora", { ascending: true });

      if (error) throw error;
      if (data) setComments(data);
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setLoadingComments(false);
    }
  }

  async function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const { error } = await supabase.from("comentarios_Canchas").insert({
        id_Cancha: cancha.id,
        comentario: newComment.trim(),
        hora: new Date().toISOString(),
      });

      if (error) throw error;

      setNewComment("");
      fetchComments();
    } catch (err: any) {
      console.error("Error posting comment:", err);
      setErrorMessage(err.message || t("comments.submitError") || "Error al enviar el comentario.");
    } finally {
      setSubmitting(false);
    }
  }

  function formatTime(timestamp: string) {
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString("es-VE", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return timestamp;
    }
  }

  return (
    <div className="relative flex h-full flex-col bg-background">
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/90 px-4 pb-3 pt-12 backdrop-blur">
        <button
          onClick={onBack}
          className="grid h-10 w-10 place-items-center rounded-full bg-muted transition-all active:scale-95"
          aria-label={t("common.back") || "Volver"}
        >
          <ArrowLeft size={18} className="text-secondary" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-secondary">{t("comments.title") || "Comentarios"}</h1>
          <p className="text-[11px] text-muted-foreground truncate max-w-[280px]">
            {cancha.name}
          </p>
        </div>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 pb-36">
        {loadingComments ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
            <Loader2 className="animate-spin text-primary" size={24} />
            <span className="text-xs font-semibold">{t("comments.loading") || "Cargando comentarios…"}</span>
          </div>
        ) : comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-muted text-4xl">
              💬
            </div>
            <div>
              <p className="text-base font-bold text-secondary">{t("comments.noComments") || "Sin comentarios aún"}</p>
              <p className="mt-1 text-sm text-muted-foreground max-w-[220px]">
                {canComment
                  ? (t("comments.beFirst") || "Sé el primero en dejar un comentario sobre las condiciones o accesibilidad de esta cancha.")
                  : (t("comments.noCommentsYet") || "Nadie ha comentado en esta cancha todavía.")}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((c) => (
              <div
                key={c.id}
                className="flex flex-col gap-1.5 rounded-2xl bg-card border border-border p-4 shadow-soft"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="grid h-7 w-7 place-items-center rounded-full bg-secondary/15 text-[11px] font-bold text-secondary">
                      JD
                    </div>
                    <div>
                      <span className="text-xs font-extrabold text-secondary flex items-center gap-1">
                        {t("comments.player") || "Jugador"}
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[8px] font-bold text-emerald-700 ring-1 ring-emerald-200">
                          <ShieldCheck size={9} /> {t("comments.verified") || "Verificado"}
                        </span>
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {formatTime(c.hora)}
                  </span>
                </div>
                <p className="text-sm text-secondary leading-relaxed pl-1">
                  {c.comentario}
                </p>
              </div>
            ))}
            <div ref={commentsEndRef} />
          </div>
        )}
      </div>

      {/* Footer / Writing Area */}
      <div className="absolute inset-x-0 bottom-0 z-20 glass border-t border-border px-5 py-4">
        {checkingPermission ? (
          <div className="flex items-center justify-center gap-2 py-2">
            <Loader2 className="animate-spin text-primary" size={14} />
            <span className="text-xs font-semibold text-muted-foreground">
              {t("comments.checkingAccess") || "Comprobando acceso…"}
            </span>
          </div>
        ) : !user ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-muted/30 p-5 border border-dashed border-border">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-muted text-lg">💬</div>
            <div className="text-center space-y-1">
              <p className="text-sm font-bold text-secondary">{t("comments.loginToComment") || "Inicia sesión para comentar"}</p>
              <p className="text-xs text-muted-foreground">
                {t("comments.shareOpinion") || "Comparte tu opinión sobre esta cancha con la comunidad."}
              </p>
            </div>
            <button
              id="comments-login-btn"
              onClick={onOpenAuth}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#32CD32] to-[#22a822] px-5 py-2.5 text-xs font-black text-[#0f1117] shadow-pop shadow-green-500/20 transition-all active:scale-95 hover:shadow-green-500/30"
            >
              {t("comments.loginRegister") || "Iniciar Sesión / Registrarse"}
            </button>
          </div>
        ) : !canComment ? (
          <div className="flex gap-2.5 items-start rounded-2xl bg-amber-500/5 border border-amber-500/20 p-3.5">
            <AlertCircle size={16} className="text-amber-600 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-amber-800">{t("comments.restricted") || "Acceso restringido"}</h4>
              <p className="text-[11px] leading-relaxed text-amber-700">
                {t("comments.restrictedDesc") || "Solo puedes comentar si has participado o estás participando en un evento en esta cancha. ¡Únete a un partido o crea uno aquí primero!"}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitComment} className="space-y-3">
            <div className="flex items-end gap-2.5 bg-card border border-border rounded-2xl p-3 focus-within:border-primary transition-colors">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={t("comments.placeholder") || "Escribe tu opinión sobre la cancha (iluminación, estado, etc.)…"}
                maxLength={300}
                rows={2}
                className="w-full bg-transparent text-sm font-medium text-secondary outline-none placeholder:text-muted-foreground/45 resize-none py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                disabled={submitting}
              />
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl gradient-primary text-secondary shadow-pop transition-all active:scale-95 disabled:opacity-50 disabled:scale-100"
                aria-label={t("common.save") || "Enviar"}
              >
                {submitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </div>
            <div className="flex items-center justify-between text-[10px] text-muted-foreground px-1">
              <span className="flex items-center gap-1">
                <CalendarCheck size={11} className="text-primary" />
                {t("comments.readyToComment") || "Listo para comentar"}
              </span>
              <span>{newComment.length}/300</span>
            </div>
            {errorMessage && (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-destructive px-1">
                <AlertCircle size={13} /> {errorMessage}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
