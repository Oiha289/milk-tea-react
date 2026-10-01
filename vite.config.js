import { defineConfig } from 'vite'

export default defineConfig(({ command }) => ({
  // GitHub Pages serves this project from /milk-tea-react/.
  base: command === 'build' ? '/milk-tea-react/' : '/',
}))
