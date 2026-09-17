import { baseTypeDefs } from './base.js'
import { userTypeDefs } from './user.js'

/**
 * O Apollo aceita uma lista de documentos SDL e os combina em um unico schema.
 * Cada modulo mantem seus proprios tipos, e novos modulos entram nesta lista.
 */
export const typeDefs = [baseTypeDefs, userTypeDefs]
