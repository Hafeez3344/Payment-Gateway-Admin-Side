import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Binds to all network interfaces
    port: 3000,        // You can change the port if needed
    open: true,        // Automatically opens the app in the default browser
  }
})
