import { GraphQLError, GraphQLScalarType, Kind } from 'graphql'

function exigirInteiroSeguro(valor: unknown): number {
  if (typeof valor !== 'number' || !Number.isSafeInteger(valor)) {
    throw new GraphQLError(
      `SafeInt precisa ser um inteiro seguro: ${String(valor)}`,
    )
  }

  return valor
}

/**
 * Inteiro de ate 2^53 - 1, o maior que o JavaScript representa sem perda.
 *
 * O `Int` do GraphQL tem 32 bits: o maior valor e 2.147.483.647, ou
 * R$ 21.474.836,47 em centavos. Uma transacao isolada cabe nisso, mas a soma
 * de varias ao longo do tempo nao necessariamente — e os totais do dashboard
 * falhariam ao ultrapassar esse limite.
 */
export const safeIntScalar = new GraphQLScalarType<number, number>({
  name: 'SafeInt',
  description:
    'Inteiro de ate 2^53 - 1. Usado em somas de valores em centavos.',

  serialize: exigirInteiroSeguro,
  parseValue: exigirInteiroSeguro,

  parseLiteral(node) {
    if (node.kind !== Kind.INT) {
      throw new GraphQLError('SafeInt precisa ser um numero inteiro')
    }

    return exigirInteiroSeguro(Number(node.value))
  },
})
