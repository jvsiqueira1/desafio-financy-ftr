import { Route, Routes } from 'react-router-dom'

import { AccountPage } from '@/pages/account'
import { CategoriesPage } from '@/pages/categories'
import { NotFoundPage } from '@/pages/not-found'
import { SignInPage } from '@/pages/sign-in'
import { SignUpPage } from '@/pages/sign-up'
import { TransactionsPage } from '@/pages/transactions'
/**
 * Tabela de rotas da aplicacao.
 *
 * A raiz deve exibir o login quando nao ha sessao e o dashboard quando ha.
 * Enquanto a autenticacao nao existe, ela renderiza o login — que e o estado
 * de quem acabou de abrir a aplicacao.
 *
 * A rota "*" captura qualquer caminho nao declarado acima.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<SignInPage />} path="/" />
      <Route element={<SignUpPage />} path="/cadastro" />
      <Route element={<TransactionsPage />} path="/transacoes" />
      <Route element={<CategoriesPage />} path="/categorias" />
      <Route element={<AccountPage />} path="/conta" />
      <Route element={<NotFoundPage />} path="*" />
    </Routes>
  )
}
