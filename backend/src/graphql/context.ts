import type { PrismaClient } from '@prisma/client'

import { prisma } from '../lib/prisma.js'

/**
 * Tudo que os resolvers podem acessar sem receber por argumento.
 *
 * Na etapa de autenticacao este objeto ganha o usuario autenticado, extraido
 * do token enviado no header Authorization.
 */
export interface GraphQLContext {
  prisma: PrismaClient
}

/**
 * Executada a cada requisicao GraphQL, antes dos resolvers.
 *
 * O Prisma e sempre o mesmo objeto, mas o context e recriado toda vez porque
 * passara a conter dados que mudam de requisicao para requisicao.
 */
export async function createContext(): Promise<GraphQLContext> {
  return { prisma }
}
