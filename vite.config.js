import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
// `npm run build` writes ONE self-contained dist/index.html (works by double-click or any static host)
export default defineConfig({ plugins: [react(), viteSingleFile()], build: { assetsInlineLimit: 100000000, chunkSizeWarningLimit: 4000 } })
