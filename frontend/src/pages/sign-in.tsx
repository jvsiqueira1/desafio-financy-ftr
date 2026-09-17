import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'

import { useAuth } from '@/features/auth/use-auth'
import { toApiError } from '@/lib/graphql-errors'

const signInSchema = z.object({
  email: z.email('Informe um e-mail válido'),
  password: z.string().min(1, 'Informe sua senha'),
})

type SignInFormData = z.infer<typeof signInSchema>

export function SignInPage() {
  const { signIn } = useAuth()
  const [erroGeral, setErroGeral] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  })

  async function aoEnviar(dados: SignInFormData) {
    setErroGeral(null)

    try {
      await signIn(dados)
      // Nao ha navegacao: estamos em "/", e a raiz passa a renderizar o
      // dashboard assim que a sessao existe.
    } catch (erro) {
      setErroGeral(toApiError(erro).message)
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-muted p-6">
      <form
        className="w-full max-w-sm space-y-4 rounded-lg border bg-card p-6"
        noValidate
        onSubmit={handleSubmit(aoEnviar)}
      >
        <div className="space-y-1 text-center">
          <h1 className="font-semibold text-xl">Fazer login</h1>
          <p className="text-muted-foreground text-sm">
            Entre na sua conta para continuar
          </p>
        </div>

        <div className="space-y-1">
          <label className="font-medium text-sm" htmlFor="email">
            E-mail
          </label>
          <input
            aria-invalid={Boolean(errors.email)}
            className="w-full rounded-md border px-3 py-2 text-sm"
            id="email"
            placeholder="mail@exemplo.com"
            type="email"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-destructive text-xs">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="font-medium text-sm" htmlFor="password">
            Senha
          </label>
          <input
            aria-invalid={Boolean(errors.password)}
            className="w-full rounded-md border px-3 py-2 text-sm"
            id="password"
            placeholder="Digite sua senha"
            type="password"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-destructive text-xs">
              {errors.password.message}
            </p>
          )}
        </div>

        {erroGeral && (
          <p className="rounded-md bg-destructive/10 p-2 text-destructive text-sm">
            {erroGeral}
          </p>
        )}

        <button
          className="w-full rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? 'Entrando…' : 'Entrar'}
        </button>

        <p className="text-center text-muted-foreground text-sm">
          Ainda não tem uma conta?{' '}
          <Link className="text-primary underline" to="/cadastro">
            Criar conta
          </Link>
        </p>
      </form>
    </main>
  )
}
