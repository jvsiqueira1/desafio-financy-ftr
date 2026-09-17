import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'
import { SetContextLink } from '@apollo/client/link/context'

import { getStoredToken } from './auth-storage'
import { env } from './env'

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

export const apolloClient = new ApolloClient({
  // A ordem importa: cada link processa e repassa ao seguinte, e o HttpLink
  // e terminal — precisa ser o ultimo da cadeia.
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache(),
})
