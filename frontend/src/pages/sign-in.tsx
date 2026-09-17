import { ApiStatus } from '@/components/api-status'

export function SignInPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-muted p-6">
      <h1 className="font-semibold text-2xl">Fazer login</h1>
      <ApiStatus />
    </main>
  )
}
