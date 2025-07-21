import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 環境変数で NODE_ENV を確認
const isDevelopment = process.env.NODE_ENV !== 'production'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    ...(isDevelopment && {
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    }),
  },
})
