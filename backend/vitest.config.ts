import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    globalSetup: ['test/global-setup.ts'],
    /**
     * Valores fixos de teste. O dotenv nao sobrescreve variaveis ja
     * definidas, entao estes vencem o .env de desenvolvimento e os testes
     * nunca tocam o banco dev.db.
     */
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: 'file:./test.db',
      JWT_SECRET: 'segredo-usado-apenas-nos-testes-automatizados',
      JWT_EXPIRES_IN: '1h',
    },
    // Todos os arquivos usam o mesmo SQLite: rodar em paralelo faria um
    // teste apagar os dados do outro.
    fileParallelism: false,
  },
})
