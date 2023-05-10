import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'level/try-out': resolve(__dirname, 'level/try-out/index.html'),
        'level/one': resolve(__dirname, 'level/one/index.html'),
        'level/two': resolve(__dirname, 'level/two/index.html'),
        'level/three': resolve(__dirname, 'level/three/index.html'),
        'level/random': resolve(__dirname, 'level/random/index.html'),
      },
    },
  },
})