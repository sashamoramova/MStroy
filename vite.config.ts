import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, 'src') },
      { find: '@/app', replacement: resolve(__dirname, 'src/app') },
      { find: '@/pages', replacement: resolve(__dirname, 'src/pages') },
      { find: '@/widgets', replacement: resolve(__dirname, 'src/widgets') },
      { find: '@/entities', replacement: resolve(__dirname, 'src/entities') },
      { find: '@/shared', replacement: resolve(__dirname, 'src/shared') }
    ]
  },
  test: {
    globals: true,
    environment: 'jsdom'
  }
})