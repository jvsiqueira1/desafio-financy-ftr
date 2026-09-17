import type { PrismaClient } from '@prisma/client'
import type { Request } from 'express'

import { verifyToken } from '../lib/jwt.js'
import { prisma } from '../lib/prisma.js'
import type { AuthenticatedUserData } from '../modules/auth/auth.service.js'

/**
 * Tudo que os resolvers podem acessar sem receber por argumento.
 *
 * `authenticatedUser` e null quando nao ha token, quando ele e invalido ou
 * quando o usuario nao existe mais. Os resolvers que exigem autenticacao
 * recusam nesse caso; os publicos simplesmente ignoram.
 */
export interface GraphQLContext {
  prisma: PrismaClient
  authenticatedUser: AuthenticatedUserData | null
}

/** Le o token do header `Authorization: Bearer <token>`. */
function extractBearerToken(request: Request): string | null {
  const header = request.headers.authorization

  if (!header) {
    return null
  }

  const [scheme, token] = header.split(' ')

  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return null
  }

  return token
}

/**
 * Executada a cada requisicao GraphQL, antes dos resolvers.
 *
 * A identidade e resolvida aqui, uma unica vez por requisicao, e nunca dentro
 * dos resolvers: assim nenhum resolver pode "esquecer" de verificar o token, e
 * todos enxergam a mesma identidade.
 */
export async function createContext({
  req,
}: {
  req: Request
}): Promise<GraphQLContext> {
  const token = extractBearerToken(req)

  if (!token) {
    return { prisma, authenticatedUser: null }
  }

  const userId = verifyToken(token)

  if (!userId) {
    return { prisma, authenticatedUser: null }
  }

  /**
   * O usuario e buscado no banco em vez de confiar apenas no conteudo do token.
   * Custa uma consulta por requisicao, e em troca um token de usuario excluido
   * para de funcionar imediatamente, sem esperar a expiracao.
   */
  const authenticatedUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true },
  })

  return { prisma, authenticatedUser }
}
