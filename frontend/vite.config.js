import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Redirige todas las peticiones /api a nuestro backend en Node
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
