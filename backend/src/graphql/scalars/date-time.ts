import { GraphQLError, GraphQLScalarType, Kind } from 'graphql'

/** Rejeita qualquer coisa que nao seja uma data real. */
function toDate(value: string): Date {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    throw new GraphQLError(`Data invalida: ${value}`)
  }

  return date
}

/**
 * GraphQL nao possui tipo de data nativo. Este scalar define a traducao entre
 * o `Date` usado no servidor e a string ISO-8601 trafegada no JSON.
 */
export const dateTimeScalar = new GraphQLScalarType<Date, string>({
  name: 'DateTime',
  description:
    'Data e hora no formato ISO-8601, sempre em UTC. Exemplo: 2025-11-30T00:00:00.000Z',

  /** Servidor -> cliente. */
  serialize(value) {
    if (!(value instanceof Date)) {
      throw new GraphQLError('DateTime precisa ser uma instancia de Date')
    }

    return value.toISOString()
  },

  /** Cliente -> servidor, quando o valor chega por variavel. */
  parseValue(value) {
    if (typeof value !== 'string') {
      throw new GraphQLError('DateTime precisa ser uma string ISO-8601')
    }

    return toDate(value)
  },

  /** Cliente -> servidor, quando o valor esta escrito na propria query. */
  parseLiteral(node) {
    if (node.kind !== Kind.STRING) {
      throw new GraphQLError('DateTime precisa ser uma string ISO-8601')
    }

    return toDate(node.value)
  },
})
