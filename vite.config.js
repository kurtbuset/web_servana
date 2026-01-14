import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  server: {
    open: true,
    host:true,
  },
})


// for port forwarding with ngrok ::::: ngrok http 5173  :::
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   server: {
//     host: true, // Allow access from network (required)
//     port: 5173, // Ensure this matches the port ngrok is tunneling
//     strictPort: true, // Prevent fallback to a random port
//     allowedHosts: ['.ngrok-free.app'], // Allow any ngrok subdomain
//   },
// })
