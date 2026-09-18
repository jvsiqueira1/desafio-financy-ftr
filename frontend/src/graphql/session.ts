import { gql, type TypedDocumentNode } from '@apollo/client'

export interface AuthenticatedUser {
  id: string
  name: string
  email: string
}

export interface MeQueryData {
  me: AuthenticatedUser
}

/**
 * Usuario da sessao atual. Exige token valido.
 *
 * O tipo vai no proprio documento, e nao em cada chamada do hook: assim e
 * impossivel parear a query com o tipo errado, e o hook infere sozinho.
 */
export const ME_QUERY: TypedDocumentNode<MeQueryData> = gql`
  query Me {
    me {
      id
      name
      email
    }
  }
`

export interface AuthPayload {
  token: string
  user: AuthenticatedUser
}

export interface SignInMutationData {
  signIn: AuthPayload
}

export interface SignInMutationVariables {
  input: { email: string; password: string }
}

export const SIGN_IN_MUTATION: TypedDocumentNode<
  SignInMutationData,
  SignInMutationVariables
> = gql`
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

export interface SignUpMutationData {
  signUp: AuthPayload
}

export interface SignUpMutationVariables {
  input: { name: string; email: string; password: string }
}

export const SIGN_UP_MUTATION: TypedDocumentNode<
  SignUpMutationData,
  SignUpMutationVariables
> = gql`
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

export interface UpdateProfileMutationData {
  updateProfile: AuthenticatedUser
}

export interface UpdateProfileMutationVariables {
  input: { name: string }
}

/**
 * Edicao do nome do proprio usuario.
 *
 * Devolver o usuario com o mesmo `id` faz o cache normalizado do Apollo
 * atualizar `me` sozinho: o avatar do cabecalho e a tela de conta leem o
 * nome novo sem refetch e sem `writeQuery` manual.
 */
export const UPDATE_PROFILE_MUTATION: TypedDocumentNode<
  UpdateProfileMutationData,
  UpdateProfileMutationVariables
> = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      name
      email
    }
  }
`
