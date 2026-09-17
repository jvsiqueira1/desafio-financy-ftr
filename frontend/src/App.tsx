import { AppRoutes } from '@/routes/app-routes'

/**
 * Raiz da aplicacao.
 *
 * Os providers (Apollo Client, sessao do usuario) entram aqui, envolvendo as
 * rotas. Hoje o componente so repassa, mas e o lugar onde esse contexto nasce.
 */
export function App() {
  return <AppRoutes />
}
