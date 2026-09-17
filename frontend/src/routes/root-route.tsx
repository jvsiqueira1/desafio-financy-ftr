import { FullScreenLoader } from '@/components/full-screen-loader'
import { useAuth } from '@/features/auth/use-auth'
import { DashboardPage } from '@/pages/dashboard'
import { SignInPage } from '@/pages/sign-in'

/**
 * A raiz exibe o login quando nao ha sessao e o dashboard quando ha.
 *
 * Enquanto a sessao esta sendo restaurada, nenhuma das duas pode ser exibida:
 * mostrar o login para quem esta logado causaria um piscar indevido.
 */
export function RootRoute() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <FullScreenLoader />
  }

  return user ? <DashboardPage /> : <SignInPage />
}
