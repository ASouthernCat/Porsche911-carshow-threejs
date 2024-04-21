import { defineConfig } from 'vite'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    
  ],
  
  resolve: {
    // 路径别名
    alias: {
      '@': resolve(__dirname, './src')
    }
  },

  server: {
    host: '0.0.0.0',
  }
})
