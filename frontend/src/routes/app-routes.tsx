import { Route, Routes } from 'react-router-dom'

import { AccountPage } from '@/pages/account'
import { CategoriesPage } from '@/pages/categories'
import { NotFoundPage } from '@/pages/not-found'
import { SignUpPage } from '@/pages/sign-up'
import { TransactionsPage } from '@/pages/transactions'

import { ProtectedRoute } from './protected-route'
import { RootRoute } from './root-route'

export function AppRoutes() {
  return (
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
  )
}
