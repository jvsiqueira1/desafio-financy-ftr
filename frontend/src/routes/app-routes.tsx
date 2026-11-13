import { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

import { FullScreenLoader } from '@/components/full-screen-loader'

import {
  AccountPage,
  CategoriesPage,
  NotFoundPage,
  SignUpPage,
  TransactionsPage,
} from './lazy-pages'
import { ProtectedRoute } from './protected-route'
import { RootRoute } from './root-route'

/**
 * Enquanto o arquivo de uma pagina e baixado pela primeira vez, o Suspense
 * exibe o mesmo carregamento usado na restauracao da sessao.
 */
export function AppRoutes() {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <Routes>
        <Route element={<RootRoute />} path="/" />
        <Route element={<SignUpPage />} path="/cadastro" />
        <Route
          element={
            <ProtectedRoute>
              <TransactionsPage />
            </ProtectedRoute>
          }
          path="/transacoes"
        />
        <Route
          element={
            <ProtectedRoute>
              <CategoriesPage />
            </ProtectedRoute>
          }
          path="/categorias"
        />
        <Route
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
          path="/conta"
        />
        <Route element={<NotFoundPage />} path="*" />
      </Routes>
    </Suspense>
  )
}
