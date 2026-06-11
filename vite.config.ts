import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { nitro } from 'nitro/vite';

// Detectamos si el código se está construyendo en los servidores de Vercel
const isVercel = process.env.VERCEL === "1";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  // Inyectamos la configuración de Vercel SOLO cuando se necesita,
  // para no romper la vista previa (preview) dentro del editor de Lovable.
  vite: {
    plugins: isVercel ? [
      nitro({ preset: "vercel" })
    ] : [],
  }
});
