import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { X, ChevronRight, Copy, Check } from "lucide-react";

interface Coupon {
  id: string | number;
  idCupon?: string;
  nombre: string;
  descripcion: string;
  duracion: string;
  "Imagen de Fondo"?: string;
  imagen_de_fondo?: string;
  codigo?: string;
  code?: string;
}

export function CouponPopup() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // 1. Verificar si el usuario ya cerró el popup en esta sesión
    const hasSeen = sessionStorage.getItem("teamMatch_hasSeenCoupons");
    if (hasSeen === "true") {
      return;
    }

    // 2. Cargar los cupones activos desde Supabase
    async function loadActiveCoupons() {
      try {
        const todayDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        const { data, error } = await supabase
          .from("cupones")
          .select("*")
          .gte("duracion", todayDate);

        if (error) {
          console.error("Error al obtener cupones:", error.message);
          return;
        }

        if (data && data.length > 0) {
          setCoupons(data);
          setIsOpen(true);
        }
      } catch (err) {
        console.error("Error inesperado al cargar cupones:", err);
      }
    }

    loadActiveCoupons();
  }, []);

  if (!isOpen || coupons.length === 0) {
    return null;
  }

  const currentCoupon = coupons[activeIdx];

  // Mapear los campos de forma robusta
  const couponTitle = currentCoupon.nombre || "¡Descuento Especial!";
  const couponDesc = currentCoupon.descripcion || "Disfruta de este beneficio exclusivo en tus próximos eventos.";
  const couponImg = currentCoupon["Imagen de Fondo"] || currentCoupon.imagen_de_fondo || "https://images.unsplash.com/photo-1540747737956-37872404797a?q=80&w=800";
  const couponCode = currentCoupon.idCupon || currentCoupon.codigo || currentCoupon.code || String(currentCoupon.id);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("teamMatch_hasSeenCoupons", "true");
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevenir interacciones no deseadas
    setCopied(false);
    setActiveIdx((prev) => (prev + 1) % coupons.length);
  };

  const handleCopyCode = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("No se pudo copiar el código:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in">
      <div 
        className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-secondary border border-white/10 shadow-2xl transition-all duration-300 animate-in zoom-in-95 slide-in-from-bottom-8 aspect-[3/4.2] flex flex-col justify-between"
        style={{
          backgroundImage: `url(${couponImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Capa oscura superpuesta para legibilidad del texto */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/95 z-0" />

        {/* Botón de Cierre "X" */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 border border-white/20 text-white/80 hover:text-white hover:bg-black/60 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Cerrar anuncio"
        >
          <X size={18} />
        </button>

        {/* Contenido del Cupón */}
        <div className="relative z-10 flex flex-col h-full justify-between p-6 pt-12 pb-8 text-center text-white">
          
          {/* Parte Superior: Título */}
          <div key={`title-${activeIdx}`} className="animate-in fade-in slide-in-from-top-3 duration-500">
            <span className="inline-flex rounded-full bg-primary/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary border border-primary/30 animate-pulse mb-3">
              Anuncio Especial 📣
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {couponTitle}
            </h2>
          </div>

          {/* Parte Central: Descripción */}
          <div key={`desc-${activeIdx}`} className="px-2 py-4 animate-in fade-in duration-500 max-h-[140px] overflow-y-auto">
            <p className="text-sm md:text-base text-gray-200 font-medium leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
              {couponDesc}
            </p>
          </div>

          {/* Parte Inferior: Código de Cupón y Botones */}
          <div className="flex flex-col items-center gap-4 w-full">
            <div 
              key={`code-${activeIdx}`}
              onClick={handleCopyCode}
              className="group relative flex w-full max-w-[280px] cursor-pointer items-center justify-between gap-2 rounded-2xl border-2 border-dashed border-primary/60 bg-primary/10 backdrop-blur-md px-4 py-3 text-center transition-all hover:border-primary hover:bg-primary/20 hover:scale-102 active:scale-98 animate-in fade-in slide-in-from-bottom-3 duration-500"
              title="Click para copiar código"
            >
              <div className="flex-1 font-mono text-lg font-black tracking-wider text-primary select-all">
                {couponCode}
              </div>
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/25 text-primary transition-transform group-hover:scale-110">
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </div>

              {copied && (
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-md animate-bounce">
                  ¡Copiado!
                </span>
              )}
            </div>

            <p className="text-[10px] text-white/50">
              *Haz clic en el código para copiarlo al portapapeles.
            </p>
          </div>
        </div>

        {/* Flecha de Navegación a la Derecha (Slider) */}
        {coupons.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-black/40 border border-white/20 text-white/80 hover:text-white hover:bg-black/60 hover:scale-110 hover:border-primary active:scale-90 transition-all shadow-lg cursor-pointer"
            aria-label="Siguiente cupón"
          >
            <ChevronRight size={24} className="translate-x-[1px]" />
          </button>
        )}

        {/* Indicadores de Páginas (Puntos) en la parte inferior */}
        {coupons.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 z-30 flex justify-center gap-1.5 pb-1">
            {coupons.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCopied(false);
                  setActiveIdx(index);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeIdx === index ? "bg-primary w-4" : "bg-white/30 w-1.5"
                }`}
                aria-label={`Ir al cupón ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
