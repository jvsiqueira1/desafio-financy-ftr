import { zodResolver } from '@hookform/resolvers/zod'
import { LogIn, Mail, UserRound } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { AuthLayout } from '@/components/auth-layout'
import { AuthSwitch } from '@/components/auth-switch'
import { FormField } from '@/components/form-field'
import { IconInput } from '@/components/icon-input'
import { PasswordInput } from '@/components/password-input'
import { Button } from '@/components/ui/button'
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

      // O back-end devolve os erros de validacao com o campo identificado:
      // destacar o input certo diz ao usuario o que corrigir.
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
    <AuthLayout
      description="Comece a controlar suas finanças ainda hoje"
      title="Criar conta"
    >
      <div className="space-y-6">
        <form
          className="space-y-6"
          noValidate
          onSubmit={handleSubmit(aoEnviar)}
        >
          <div className="space-y-4">
            <FormField
              error={errors.name?.message}
              id="name"
              label="Nome completo"
            >
              <IconInput
                aria-invalid={Boolean(errors.name)}
                autoComplete="name"
                icon={UserRound}
                id="name"
                placeholder="Seu nome completo"
                {...register('name')}
              />
            </FormField>

            <FormField error={errors.email?.message} id="email" label="E-mail">
              <IconInput
                aria-invalid={Boolean(errors.email)}
                autoComplete="email"
                icon={Mail}
                id="email"
                placeholder="mail@exemplo.com"
                type="email"
                {...register('email')}
              />
            </FormField>

            <FormField
              error={errors.password?.message}
              hint="A senha deve ter no mínimo 8 caracteres"
              id="password"
              label="Senha"
            >
              <PasswordInput
                aria-invalid={Boolean(errors.password)}
                autoComplete="new-password"
                id="password"
                placeholder="Digite sua senha"
                {...register('password')}
              />
            </FormField>
          </div>

          {erroGeral && (
            <p
              className="rounded-lg bg-destructive/10 px-3 py-2 text-destructive text-sm"
              role="alert"
            >
              {erroGeral}
            </p>
          )}

          <Button className="w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Cadastrando…' : 'Cadastrar'}
          </Button>
        </form>

        <AuthSwitch
          icon={LogIn}
          label="Fazer login"
          question="Já tem uma conta?"
          to="/"
        />
      </div>
    </AuthLayout>
  )
}
