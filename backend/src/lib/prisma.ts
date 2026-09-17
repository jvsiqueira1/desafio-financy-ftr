import { PrismaClient } from '@prisma/client'

import { env } from './env.js'

/**
 * Instancia unica do Prisma Client para toda a aplicacao.
 *
 * Um modulo ESM e avaliado uma unica vez e o resultado fica em cache. Entao
 * todo arquivo que importar `prisma` recebe o MESMO objeto, e a aplicacao
 * mantem um unico pool de conexoes.
 *
 * Criar um PrismaClient por requisicao abriria uma conexao nova a cada chamada
 * e esgotaria o banco sob carga.
 */
export const prisma = new PrismaClient({
  // Em desenvolvimento, imprime o SQL de cada consulta: util para entender
  // o que o Prisma realmente executa por tras das chamadas.
  log: env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
})
