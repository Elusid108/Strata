import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/Strata/',
  plugins: [react(), tailwindcss()],
  server: {
    port: 5175,
  },
})
