import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'
// https://vitejs.dev/config/
export default defineConfig({
  // Cho phép thằng Vite sử dụng được, mặc định thì không mà sẽ phải dùng import.meta.env
  optimizeDeps: { include: ['@mui/material/Tooltip'] },
  define:{
    'process.env': process.env
  },
  plugins: [
    react(),
    svgr()
  ],
  resolve: {
    alias: [
      { find: '~', replacement: '/src' }
    ]
  }
  // base: './'
})
