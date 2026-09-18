import { useApolloClient, useMutation, useQuery } from '@apollo/client/react'
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  type AuthenticatedUser,
  ME_QUERY,
  SIGN_IN_MUTATION,
  SIGN_UP_MUTATION,
} from '@/graphql/session'

import {
  clearStoredToken,
  getStoredToken,
  storeToken,
} from '@/lib/auth-storage'
import { onSessionExpired } from '@/lib/session-events'

import {
  AuthContext,
  type AuthContextValue,
  type SignInInput,
  type SignUpInput,
} from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const client = useApolloClient()

  // O token vem do armazenamento ja na primeira renderizacao, e nao em um
  // efeito: assim a aplicacao nunca passa por um instante de "deslogado"
  // antes de descobrir que existe sessao.
  const [token, setToken] = useState<string | null>(() => getStoredToken())

  // Com token, pergunta a API quem e o usuario. Sem token, nem consulta.
  const { data, loading } = useQuery(ME_QUERY, { skip: !token })

  const [executarSignIn] = useMutation(SIGN_IN_MUTATION)
  const [executarSignUp] = useMutation(SIGN_UP_MUTATION)

  useEffect(() => {
    // Encerra a sessao quando a camada de rede avisa que o token foi recusado.
    return onSessionExpired(() => {
      clearStoredToken()
      setToken(null)
    })
  }, [])

  const aplicarSessao = useCallback(
    (novoToken: string, usuario: AuthenticatedUser, lembrar: boolean) => {
      storeToken(novoToken, lembrar)
      setToken(novoToken)

      // Grava o usuario no cache: como `me` acabou de deixar de ser ignorada,
      // ela resolve direto do cache e a interface nao pisca em "carregando".
      client.writeQuery({ query: ME_QUERY, data: { me: usuario } })
    },
    [client],
  )

  const signIn = useCallback(
    async (input: SignInInput) => {
      // `remember` e decisao da interface, nao dado da API: o SignInInput do
      // back-end nao tem esse campo, e envia-lo faria a operacao ser recusada.
      const { remember, ...credenciais } = input

      const resultado = await executarSignIn({
        variables: { input: credenciais },
      })
      const payload = resultado.data?.signIn

      if (!payload) {
        throw new Error('Resposta inesperada do servidor')
      }

      aplicarSessao(payload.token, payload.user, remember)
    },
    [executarSignIn, aplicarSessao],
  )

  const signUp = useCallback(
    async (input: SignUpInput) => {
      const resultado = await executarSignUp({ variables: { input } })
      const payload = resultado.data?.signUp

      if (!payload) {
        throw new Error('Resposta inesperada do servidor')
      }

      // Quem acabou de criar a conta espera continuar dentro dela.
      aplicarSessao(payload.token, payload.user, true)
    },
    [executarSignUp, aplicarSessao],
  )

  const signOut = useCallback(async () => {
    clearStoredToken()
    setToken(null)

    // clearStore apaga o cache SEM refazer as consultas ativas.
    // resetStore refaria — e a primeira seria `me`, que falharia sem token.
    // Limpar o cache e obrigatorio: sem isso, os dados do usuario anterior
    // continuariam visiveis para quem entrasse em seguida.
    await client.clearStore()
  }, [client])

  const value = useMemo<AuthContextValue>(
    () => ({
      user: token ? (data?.me ?? null) : null,
      isLoading: Boolean(token) && loading,
      signIn,
      signUp,
      signOut,
    }),
    [token, data, loading, signIn, signUp, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
