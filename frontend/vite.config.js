import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import flowbiteReact from "flowbite-react/plugin/vite";

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    proxy: {
      '/api': {
        target: 'http://localhost:8000', 
        changeOrigin: true,
        secure: false,
      },
    }
   },
  plugins: [react(), flowbiteReact()],
})