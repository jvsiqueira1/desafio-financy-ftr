import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-muted">
      <h1 className="font-semibold text-2xl">Página não encontrada</h1>
      <Link className="text-primary underline" to="/">
        Voltar para o início
      </Link>
    </main>
  )
}
