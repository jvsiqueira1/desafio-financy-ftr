export const userTypeDefs = `#graphql
  """Usuario da aplicacao. A senha nunca e exposta, em nenhuma forma."""
  type User {
    id: ID!
    name: String!
    email: String!
  }

  """Retorno das operacoes de autenticacao."""
  type AuthPayload {
    """Token JWT a ser enviado no header Authorization das proximas chamadas."""
    token: String!
    user: User!
  }

  input SignUpInput {
    name: String!
    email: String!
    """Minimo de 8 caracteres."""
    password: String!
  }

  input SignInInput {
    email: String!
    password: String!
  }

  extend type Query {
    """Usuario da sessao atual. Exige token valido."""
    me: User!
  }

  type Mutation {
    """Cria a conta e ja devolve a sessao autenticada."""
    signUp(input: SignUpInput!): AuthPayload!

    """Autentica com e-mail e senha."""
    signIn(input: SignInInput!): AuthPayload!
  }
`
