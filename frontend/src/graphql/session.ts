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

export interface AuthPayload {
  token: string
  user: AuthenticatedUser
}

export const SIGN_IN_MUTATION = gql`
  mutation SignIn($input: SignInInput!) {
    signIn(input: $input) {
      token
      user {
        id
        name
        email
      }
    }
  }
`

export interface SignInMutationData {
  signIn: AuthPayload
}

export const SIGN_UP_MUTATION = gql`
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      token
      user {
        id
        name
        email
      }
    }
  }
`

export interface SignUpMutationData {
  signUp: AuthPayload
}
