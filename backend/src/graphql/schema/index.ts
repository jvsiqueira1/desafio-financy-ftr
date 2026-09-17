import { baseTypeDefs } from './base.js'
import { categoryTypeDefs } from './category.js'
import { transactionTypeDefs } from './transaction.js'
import { userTypeDefs } from './user.js'

/**
 * O Apollo aceita uma lista de documentos SDL e os combina em um unico schema.
 * Cada modulo mantem seus proprios tipos, e novos modulos entram nesta lista.
 */
export const typeDefs = [
  baseTypeDefs,
  userTypeDefs,
  categoryTypeDefs,
  transactionTypeDefs,
]
