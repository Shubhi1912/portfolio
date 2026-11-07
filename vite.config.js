import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' makes every asset path relative, so the same build works on
//   • a user site      → https://username.github.io/
//   • a project site   → https://username.github.io/repo-name/
// The site only uses #hash links (no path routing), so no 404 fallback is needed.
export default defineConfig({
  plugins: [react()],
  base: './'
})
