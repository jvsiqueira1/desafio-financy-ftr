import type { ReactNode } from 'react'

import logoUrl from '@/assets/logo.svg'

interface AuthLayoutProps {
  title: string
  description: string
  children: ReactNode
}

/** Estrutura das telas de acesso: logo centralizado sobre um card de 448px. */
export function AuthLayout({ title, description, children }: AuthLayoutProps) {
  return (
    <main className="flex min-h-dvh flex-col items-center bg-background px-4 py-12">
      <img alt="Financy" className="h-8 w-33.5" src={logoUrl} />

      <section className="mt-8 w-full max-w-md rounded-xl border border-border bg-card p-8">
        <header className="mb-8 space-y-1 text-center">
          <h1 className="font-bold text-foreground text-xl">{title}</h1>
          <p className="text-base text-muted-foreground">{description}</p>
        </header>

        {children}
      </section>
    </main>
  )
}
