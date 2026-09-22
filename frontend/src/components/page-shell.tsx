import type { ReactNode } from 'react'

import { AppHeader } from './app-header'

/** Estrutura comum das telas internas: cabecalho fixo e area de conteudo. */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-background">
      <AppHeader />
      <main className="mx-auto max-w-7xl px-12 py-12">{children}</main>
    </div>
  )
}
