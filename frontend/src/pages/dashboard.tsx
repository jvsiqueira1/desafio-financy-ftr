import { Link } from 'react-router-dom'

import { useAuth } from '@/features/auth/use-auth'

export function DashboardPage() {
  const { user, signOut } = useAuth()

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-muted p-6">
      <div className="w-full max-w-md space-y-4 rounded-lg border bg-card p-6">
        <h1 className="font-semibold text-xl">Dashboard</h1>

        <p className="text-muted-foreground text-sm">
          Sessão ativa:{' '}
          <strong className="text-foreground">{user?.name}</strong> (
          {user?.email})
        </p>

        <nav className="flex gap-4 text-sm">
          <Link className="text-primary underline" to="/transacoes">
            Transações
          </Link>
          <Link className="text-primary underline" to="/categorias">
            Categorias
          </Link>
          <Link className="text-primary underline" to="/conta">
            Conta
          </Link>
        </nav>

        <button
          className="w-full rounded-md border px-4 py-2 font-medium text-sm"
          onClick={signOut}
          type="button"
        >
          Sair da conta
        </button>
      </div>
    </main>
  )
}
