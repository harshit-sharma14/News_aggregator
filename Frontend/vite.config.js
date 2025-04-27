import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      // any request to /api will be forwarded to your Express server
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
