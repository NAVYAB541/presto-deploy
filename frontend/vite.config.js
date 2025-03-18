import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setup.js',
  },
  server: {
    host: '0.0.0.0',  // Allows external access
    port: 3000
  },
})
