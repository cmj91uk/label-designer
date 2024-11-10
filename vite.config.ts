import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePluginRadar, VitePluginRadarOptions } from 'vite-plugin-radar'

const radarOptions: VitePluginRadarOptions = {
  enableDev: false,
  analytics: {
    id: 'G-EZWT2P78W7',
    config: {
      cookie_flags: '{ \'cookieFlags\': \'SameSite=None; Secure\' }'
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      react(),
      VitePluginRadar(radarOptions)
  ],
  base: '/label-designer',
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern'
      }
    }
  }
})
