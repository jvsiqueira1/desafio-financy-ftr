import { baseResolvers } from './base.js'
import { categoryResolvers } from './category.js'
import { userResolvers } from './user.js'

/**
 * Os resolvers de cada modulo sao combinados por tipo raiz.
 * Novos modulos entram somando suas chaves de Query e Mutation.
 */
export const resolvers = {
  Query: {
    ...baseResolvers.Query,
    ...userResolvers.Query,
    ...categoryResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...categoryResolvers.Mutation,
  },
}
