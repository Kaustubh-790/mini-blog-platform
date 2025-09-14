import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: "./postcss.config.cjs",
  },
  define: {
    global: "globalThis",
  },
  optimizeDeps: {
    include: ["react-quill", "quill"],
  },
  resolve: {
    alias: {
      "react-dom/client": "react-dom/client",
    },
  },
});
