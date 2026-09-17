import type { GraphQLContext } from '../context.js'

/**
 * Implementacao de cada campo declarado no schema.
 *
 * A assinatura de um resolver e sempre (parent, args, context, info):
 *   parent  - resultado do resolver do nivel acima
 *   args    - argumentos recebidos no campo
 *   context - objeto criado por requisicao (banco, usuario autenticado...)
 *   info    - metadados da consulta, raramente necessario
 *
 * Argumentos nao utilizados sao prefixados com _ por convencao.
 */
export const resolvers = {
  Query: {
    hello: (): string => 'Financy API no ar',

    usersCount: (
      _parent: unknown,
      _args: unknown,
      context: GraphQLContext,
    ): Promise<number> => context.prisma.user.count(),
  },

  Mutation: {
    // Temporario: substituido por signUp/signIn na etapa de autenticacao.
    echo: (_parent: unknown, args: { message: string }): string =>
      `voce disse: ${args.message}`,
  },
}
