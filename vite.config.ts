import https from 'node:https'
import path from 'node:path'
import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { reachableLookup } from './vite/reachable-lookup.ts'

const API_TARGET = 'https://crm-omuz-bekend.onrender.com'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // Bind on every interface (incl. 127.0.0.1) — binding only to ::1 breaks the
    // HMR websocket in browsers that resolve `localhost` to IPv4.
    host: true,
    // The backend resolves to two Cloudflare IPs and one of them is unreachable
    // from here, so the browser's direct request dies with ERR_CONNECTION_CLOSED.
    // Proxying through the dev server keeps the API same-origin and lets the
    // agent below pick an address that actually answers.
    proxy: {
      '/api': {
        target: API_TARGET,
        changeOrigin: true,
        agent: new https.Agent({
          keepAlive: true,
          maxSockets: 6,
          lookup: reachableLookup(443),
        }),
        // Render's free tier can take ~60s to wake up from a cold start.
        timeout: 120000,
        proxyTimeout: 120000,
      },
    },
  },
})
