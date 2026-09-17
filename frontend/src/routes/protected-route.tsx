import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import { FullScreenLoader } from '@/components/full-screen-loader'
import { useAuth } from '@/features/auth/use-auth'

/**
 * Impede o acesso as telas internas sem sessao.
 *
 * Isto e conveniencia de navegacao, NAO seguranca: quem conhecer a rota pode
 * chegar nela de qualquer forma. A protecao real esta no back-end, que recusa
 * toda operacao sem token valido.
 *
 * O `replace` evita que a rota protegida fique no historico — senao o botao
 * voltar do navegador devolveria o usuario a uma tela que ele nao pode ver.
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <FullScreenLoader />
  }

  if (!user) {
    return <Navigate replace to="/" />
  }

  return children
}
