import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ['defaults', 'not IE 11', 'Android >= 9'],
    }),
  ],
  base: './',
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    hmr: {
      clientPort: 443
    },
    watch: {
      usePolling: true
    }
  },
  build: {
    target: 'es2015'
  }
})