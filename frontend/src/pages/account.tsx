import { LogOut } from 'lucide-react'

import { PageShell } from '@/components/page-shell'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/use-auth'

/**
 * Provisoria: a tela completa, com edicao do nome, entra no proximo PR.
 * Existe agora para que o logout, que saiu do dashboard, continue acessivel.
 */
export function AccountPage() {
  const { user, signOut } = useAuth()

  return (
    <PageShell>
      <div className="mx-auto max-w-md space-y-4 rounded-xl border border-border bg-card p-8 text-center">
        <p className="font-semibold text-foreground text-xl">{user?.name}</p>
        <p className="text-muted-foreground">{user?.email}</p>

        <Button
          className="w-full"
          onClick={signOut}
          type="button"
          variant="outline"
        >
          <LogOut aria-hidden className="text-red-500" />
          Sair da conta
        </Button>
      </div>
    </PageShell>
  )
}
