import { lazy } from 'react'

/**
 * Paginas carregadas sob demanda.
 *
 * Cada `import()` dinamico vira um arquivo separado no build: quem abre o
 * login nao baixa o codigo da tela de transacoes, e vice-versa. O `.then`
 * adapta os exports nomeados das paginas ao formato `default` que o
 * React.lazy espera.
 */
export const SignInPage = lazy(() =>
  import('@/pages/sign-in').then((module) => ({ default: module.SignInPage })),
)

export const SignUpPage = lazy(() =>
  import('@/pages/sign-up').then((module) => ({ default: module.SignUpPage })),
)

export const DashboardPage = lazy(() =>
  import('@/pages/dashboard').then((module) => ({
    default: module.DashboardPage,
  })),
)

export const TransactionsPage = lazy(() =>
  import('@/pages/transactions').then((module) => ({
    default: module.TransactionsPage,
  })),
)

export const CategoriesPage = lazy(() =>
  import('@/pages/categories').then((module) => ({
    default: module.CategoriesPage,
  })),
)

export const AccountPage = lazy(() =>
  import('@/pages/account').then((module) => ({ default: module.AccountPage })),
)

export const NotFoundPage = lazy(() =>
  import('@/pages/not-found').then((module) => ({
    default: module.NotFoundPage,
  })),
)
