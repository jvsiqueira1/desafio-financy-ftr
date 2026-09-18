/**
 * Tipos raiz do schema e scalars compartilhados.
 *
 * `type Query` e declarado aqui e os demais modulos o estendem com
 * `extend type Query`. `type Mutation` e declarado pelo modulo de autenticacao,
 * o primeiro a precisar dele.
 */
export const baseTypeDefs = `#graphql
  """Data e hora no formato ISO-8601, sempre em UTC."""
  scalar DateTime
  """Inteiro de ate 2^53 - 1. Usado em somas de valores em centavos."""
  scalar SafeInt

  type Query {
    """Verifica se a API GraphQL esta respondendo."""
    hello: String!
  }
`
