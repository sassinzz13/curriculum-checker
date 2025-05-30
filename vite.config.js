import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,       // 👈 Ensure Electron loads the correct URL in dev
    strictPort: true  // 👈 Prevent Vite from switching ports if 5173 is taken
  },
  build: {
    outDir: 'dist',   // 👈 Must match what your Electron main.cjs expects
  }
});
