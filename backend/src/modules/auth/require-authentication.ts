import type { GraphQLContext } from '../../graphql/context.js'
import { unauthenticated } from '../../lib/errors.js'

import type { AuthenticatedUserData } from './auth.service.js'

/**
 * Exige um usuario autenticado e o devolve ja tipado como nao-nulo.
 *
 * Centralizar a checagem em uma funcao evita que cada resolver reimplemente a
 * verificacao — e e uma verificacao que, esquecida uma unica vez, abre a API.
 */
export function requireAuthentication(
  context: GraphQLContext,
): AuthenticatedUserData {
  if (!context.authenticatedUser) {
    throw unauthenticated()
  }

  return context.authenticatedUser
}
