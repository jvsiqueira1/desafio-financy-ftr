import {
  type AuthenticatedUserData,
  type AuthResult,
  signIn,
  signUp,
} from '../../modules/auth/auth.service.js'
import { requireAuthentication } from '../../modules/auth/require-authentication.js'
import type { GraphQLContext } from '../context.js'

/**
 * Resolvers finos: traduzem a requisicao GraphQL em uma chamada de servico e
 * devolvem o resultado. Nenhuma regra de negocio mora aqui — assim a mesma
 * regra poderia ser exposta por outro transporte sem ser reescrita.
 */
export const userResolvers = {
  Query: {
    me: (
      _parent: unknown,
      _args: unknown,
      context: GraphQLContext,
    ): AuthenticatedUserData => requireAuthentication(context),
  },

  Mutation: {
    signUp: (
      _parent: unknown,
      args: { input: unknown },
      context: GraphQLContext,
    ): Promise<AuthResult> => signUp(context.prisma, args.input),

    signIn: (
      _parent: unknown,
      args: { input: unknown },
      context: GraphQLContext,
    ): Promise<AuthResult> => signIn(context.prisma, args.input),
  },
}
