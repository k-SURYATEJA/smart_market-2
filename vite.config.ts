import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      // Proxy /api/* calls to the Java Tomcat backend (port 8080)
      // so the browser never sees a CORS error in development.
      proxy: {
        '/api': {
          target: 'http://localhost:8089',
          changeOrigin: true,
          // Tomcat deploys the WAR as /smart-market, so rewrite the path.
          rewrite: (path: string) => path.replace(/^\/api/, '/smart-market/api'),
        },
      },
    },
  };
});
