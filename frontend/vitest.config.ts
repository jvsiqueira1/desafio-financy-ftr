import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

/**
 * Configuracao separada do vite.config.ts: os testes nao precisam do
 * Tailwind nem dos plugins de build, so do React e do alias "@".
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['src/test/setup.ts'],
    env: {
      VITE_BACKEND_URL: 'http://localhost:3333/graphql',
    },
  },
})
