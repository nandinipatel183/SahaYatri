import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  appType: 'spa', // ✅ Tells Vite this is a Single Page Application (SPA)
  server: {
    port: 5173,
  },
});
