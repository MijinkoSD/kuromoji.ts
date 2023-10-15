import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: './src/kuromoji.js',
      name: 'Counter',
      fileName: 'counter'
    }
  }
})
