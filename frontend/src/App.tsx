import { ApolloProvider } from '@apollo/client/react'

import { AuthProvider } from '@/features/auth/auth-provider'
import { apolloClient } from '@/lib/apollo'
import { AppRoutes } from '@/routes/app-routes'

/**
 * A ordem dos provedores importa: o AuthProvider usa hooks do Apollo,
 * entao precisa estar dentro do ApolloProvider.
 */
export function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ApolloProvider>
  )
}
