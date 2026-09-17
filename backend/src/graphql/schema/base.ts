/**
 * Tipos raiz do schema.
 *
 * `type Query` e declarado aqui e os demais modulos o estendem com
 * `extend type Query`. `type Mutation` e declarado pelo modulo de autenticacao,
 * o primeiro a precisar dele.
 */
export const baseTypeDefs = `#graphql
  type Query {
    """Verifica se a API GraphQL esta respondendo."""
    hello: String!
  }
`
