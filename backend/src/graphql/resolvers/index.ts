import { dateTimeScalar } from '../scalars/date-time.js'
import { safeIntScalar } from '../scalars/safe-int.js'
import { baseResolvers } from './base.js'
import { categoryResolvers } from './category.js'
import { dashboardResolvers } from './dashboard.js'
import { transactionResolvers } from './transaction.js'
import { userResolvers } from './user.js'

/**
 * Os resolvers de cada modulo sao combinados por tipo raiz.
 * Scalars customizados entram como chaves de primeiro nivel, com o mesmo nome
 * declarado no SDL.
 */
export const resolvers = {
  DateTime: dateTimeScalar,
  SafeInt: safeIntScalar,

  Query: {
    ...baseResolvers.Query,
    ...userResolvers.Query,
    ...categoryResolvers.Query,
    ...transactionResolvers.Query,
    ...dashboardResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...categoryResolvers.Mutation,
    ...transactionResolvers.Mutation,
  },
}
