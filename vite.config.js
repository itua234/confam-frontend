import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true, // or '0.0.0.0' if needed
    allowedHosts: ['1b8e-102-88-109-76.ngrok-free.app'], // 👈 add your domain here
    port: 5173,
  },
})