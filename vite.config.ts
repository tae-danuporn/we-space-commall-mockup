import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/we-space-commall-mockup/',
  plugins: [tailwindcss(), react()],
})
