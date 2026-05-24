import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { createCharacterSyncMiddleware } from "./server/characterSyncMiddleware.js"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: "character-sync-api",
      configureServer(server) {
        server.middlewares.use(createCharacterSyncMiddleware())
      },
      configurePreviewServer(server) {
        server.middlewares.use(createCharacterSyncMiddleware())
      },
    },
  ],
})
