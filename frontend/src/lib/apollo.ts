import {
  ApolloClient,
  ApolloLink,
  CombinedGraphQLErrors,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'
import { SetContextLink } from '@apollo/client/link/context'
import { ErrorLink } from '@apollo/client/link/error'

import { getStoredToken } from './auth-storage'
import { env } from './env'
import { emitSessionExpired } from './session-events'

/** Link terminal: e quem de fato dispara a requisicao HTTP. */
const httpLink = new HttpLink({ uri: env.backendUrl })

/**
 * Injeta o token em toda requisicao.
 *
 * A leitura acontece a cada operacao, e nao uma unica vez na criacao do
 * cliente: assim, ao fazer login, a mesma instancia do Apollo passa a enviar
 * o token novo sem precisar ser recriada.
 */
const authLink = new SetContextLink((prevContext) => {
  const token = getStoredToken()

  if (!token) {
    return prevContext
  }

  return {
    ...prevContext,
    headers: {
      ...prevContext.headers,
      authorization: `Bearer ${token}`,
    },
  }
})

/**
 * Observa as respostas em busca de token recusado.
 *
 * Sem isto, um token expirado deixaria a aplicacao em um limbo: a interface
 * acreditaria que ha sessao e toda consulta falharia.
 */
const errorLink = new ErrorLink(({ error }) => {
  if (!CombinedGraphQLErrors.is(error)) {
    return
  }

  const sessaoRecusada = error.errors.some(
    (falha) => falha.extensions?.code === 'UNAUTHENTICATED',
  )

  if (sessaoRecusada) {
    emitSessionExpired()
  }
})

export const apolloClient = new ApolloClient({
  // A ordem importa: cada link processa e repassa ao seguinte, e o HttpLink
  // e terminal — precisa ser o ultimo da cadeia.
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
})
