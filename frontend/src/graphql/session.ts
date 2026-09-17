import { gql } from '@apollo/client'

/** Query publica: confirma que a API responde, sem exigir autenticacao. */
export const HELLO_QUERY = gql`
  query Hello {
    hello
  }
`

export interface HelloQueryData {
  hello: string
}

export interface AuthenticatedUser {
  id: string
  name: string
  email: string
}

/** Usuario da sessao atual. Exige token valido. */
export const ME_QUERY = gql`
  query Me {
    me {
      id
      name
      email
    }
  }
`

export interface MeQueryData {
  me: AuthenticatedUser
}
