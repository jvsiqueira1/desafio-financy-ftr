import { createContext } from 'react'

import type { AuthenticatedUser } from '@/graphql/session'

export interface SignInInput {
  email: string
  password: string
}

export interface SignUpInput {
  name: string
  email: string
  password: string
}

export interface AuthContextValue {
  /** Usuario da sessao, ou null quando nao ha sessao. */
  user: AuthenticatedUser | null
  /** Verdadeiro enquanto a sessao esta sendo restaurada a partir do token. */
  isLoading: boolean
  signIn: (input: SignInInput) => Promise<void>
  signUp: (input: SignUpInput) => Promise<void>
  signOut: () => Promise<void>
}

/**
 * O valor inicial e null de proposito: permite que o hook detecte uso fora do
 * provedor e falhe com uma mensagem util, em vez de devolver um objeto vazio.
 */
export const AuthContext = createContext<AuthContextValue | null>(null)
