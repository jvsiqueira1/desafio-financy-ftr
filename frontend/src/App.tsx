import { ApolloProvider } from '@apollo/client/react'

import { apolloClient } from '@/lib/apollo'
import { AppRoutes } from '@/routes/app-routes'

/**
 * Raiz da aplicacao.
 *
 * O ApolloProvider disponibiliza o cliente para toda a arvore via contexto do
 * React: qualquer componente abaixo pode usar useQuery e useMutation sem
 * receber o cliente por prop.
 */
export function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <AppRoutes />
    </ApolloProvider>
  )
}
