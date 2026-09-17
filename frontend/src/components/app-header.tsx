import { NavLink } from 'react-router-dom'

import logoUrl from '@/assets/logo.svg'
import { useAuth } from '@/features/auth/use-auth'
import { getInitials } from '@/lib/format'
import { cn } from '@/lib/utils'

const LINKS = [
  { to: '/', label: 'Dashboard' },
  { to: '/transacoes', label: 'Transações' },
  { to: '/categorias', label: 'Categorias' },
]

export function AppHeader() {
  const { user } = useAuth()

  return (
    <header className="border-border border-b bg-card">
      <div className="relative mx-auto flex h-17 max-w-7xl items-center justify-between px-12">
        <img alt="Financy" className="h-6 w-25" src={logoUrl} />

        {/* A navegacao e centralizada na largura total, e nao entre o logo e o
            avatar: e assim que ela aparece no layout. */}
        <nav className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 flex gap-5 text-sm">
          {LINKS.map((link) => (
            <NavLink
              className={({ isActive }) =>
                cn(
                  'leading-5 transition-colors',
                  isActive
                    ? 'font-semibold text-primary'
                    : 'text-muted-foreground hover:text-foreground',
                )
              }
              // Sem `end`, a raiz ficaria ativa em todas as rotas, porque
              // "/" e prefixo de qualquer caminho.
              end={link.to === '/'}
              key={link.to}
              to={link.to}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <NavLink
          aria-label="Conta"
          className="flex size-9 items-center justify-center rounded-full bg-gray-300 font-medium text-foreground text-sm"
          to="/conta"
        >
          {user ? getInitials(user.name) : ''}
        </NavLink>
      </div>
    </header>
  )
}
