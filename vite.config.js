import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// For a repository URL like username.github.io/portfolio, set base to '/portfolio/'.
export default defineConfig({
  plugins: [react()],
  base: '/portfolio/'
})
