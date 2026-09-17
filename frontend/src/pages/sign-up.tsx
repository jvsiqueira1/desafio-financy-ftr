import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { useAuth } from '@/features/auth/use-auth'
import { toApiError } from '@/lib/graphql-errors'

// As mesmas regras do back-end, repetidas aqui de proposito: o front valida
// para dar resposta imediata, o back valida porque e quem realmente protege.
const signUpSchema = z.object({
  name: z.string().trim().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  email: z.email('Informe um e-mail válido'),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
})

type SignUpFormData = z.infer<typeof signUpSchema>

const CAMPOS = ['name', 'email', 'password'] as const

export function SignUpPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [erroGeral, setErroGeral] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', email: '', password: '' },
  })

  async function aoEnviar(dados: SignUpFormData) {
    setErroGeral(null)

    try {
      await signUp(dados)
      navigate('/', { replace: true })
    } catch (erro) {
      const apiError = toApiError(erro)

      // O back-end devolve os erros de validacao com o campo identificado.
      // Aproveitamos isso para destacar o input certo, em vez de exibir uma
      // mensagem solta que nao diz o que corrigir.
      if (apiError.fields) {
        for (const campo of CAMPOS) {
          const mensagem = apiError.fields[campo]?.[0]

          if (mensagem) {
            setError(campo, { message: mensagem })
          }
        }

        return
      }

      setErroGeral(apiError.message)
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
          <h1 className="font-semibold text-xl">Criar conta</h1>
          <p className="text-muted-foreground text-sm">
            Comece a controlar suas finanças ainda hoje
          </p>
        </div>

        <div className="space-y-1">
          <label className="font-medium text-sm" htmlFor="name">
            Nome completo
          </label>
          <input
            aria-invalid={Boolean(errors.name)}
            className="w-full rounded-md border px-3 py-2 text-sm"
            id="name"
            placeholder="Seu nome completo"
            {...register('name')}
          />
          {errors.name && (
            <p className="text-destructive text-xs">{errors.name.message}</p>
          )}
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
          <p className="text-muted-foreground text-xs">
            A senha deve ter no mínimo 8 caracteres
          </p>
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
          {isSubmitting ? 'Cadastrando…' : 'Cadastrar'}
        </button>

        <p className="text-center text-muted-foreground text-sm">
          Já tem uma conta?{' '}
          <Link className="text-primary underline" to="/">
            Fazer login
          </Link>
        </p>
      </form>
    </main>
  )
}
