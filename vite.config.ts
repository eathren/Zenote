import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { VitePWA } from "vite-plugin-pwa"
// const manifestForPlugin: Partial<VitePWAOptions> = {
//   manifest: {
//     name: "Zenote",
//     short_name: "Zenote",
//     description:
//       "Zenote is a note-taking app designed to mimic how your brain works.",
//     theme_color: "#141414",
//     display: "standalone",
//     icons: [
//       {
//         src: "/public/Zenote.svg",
//         sizes: "192x192",
//         type: "image/svg+xml",
//       },
//       {
//         src: "/public/Zenote.svg",
//         sizes: "512x512",
//         type: "image/svg+xml",
//       },
//     ],
//   },
// }

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({ registerType: "autoUpdate" })],
  resolve: {
    alias: {
      src: "/src",
    },
  },
})
