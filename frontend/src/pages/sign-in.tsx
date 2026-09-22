import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, UserRoundPlus } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { AuthLayout } from '@/components/auth-layout'
import { AuthSwitch } from '@/components/auth-switch'
import { FormField } from '@/components/form-field'
import { IconInput } from '@/components/icon-input'
import { PasswordInput } from '@/components/password-input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/features/auth/use-auth'
import { toApiError } from '@/lib/graphql-errors'

const signInSchema = z.object({
  email: z.email('Informe um e-mail válido'),
  password: z.string().min(1, 'Informe sua senha'),
  remember: z.boolean(),
})

type SignInFormData = z.infer<typeof signInSchema>

export function SignInPage() {
  const { signIn } = useAuth()
  const [erroGeral, setErroGeral] = useState<string | null>(null)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    // Desmarcado por padrao, como no layout.
    defaultValues: { email: '', password: '', remember: false },
  })

  async function aoEnviar(dados: SignInFormData) {
    setErroGeral(null)

    try {
      await signIn(dados)
      // Sem navegacao: estamos em "/", e a raiz passa a renderizar o
      // dashboard assim que a sessao existe.
    } catch (erro) {
      setErroGeral(toApiError(erro).message)
    }
  }

  function avisarRecuperacaoIndisponivel() {
    toast.info('A recuperação de senha não está disponível nesta versão.')
  }

  return (
    <AuthLayout
      description="Entre na sua conta para continuar"
      title="Fazer login"
    >
      <div className="space-y-6">
        <form
          className="space-y-6"
          noValidate
          onSubmit={handleSubmit(aoEnviar)}
        >
          <div className="space-y-4">
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
              id="password"
              label="Senha"
            >
              <PasswordInput
                aria-invalid={Boolean(errors.password)}
                autoComplete="current-password"
                id="password"
                placeholder="Digite sua senha"
                {...register('password')}
              />
            </FormField>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* O Checkbox do Radix e um <button role="checkbox">, nao um
                    <input>: o `register` nao consegue se ligar a ele. */}
                <Controller
                  control={control}
                  name="remember"
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      id="remember"
                      onCheckedChange={(marcado) =>
                        field.onChange(marcado === true)
                      }
                    />
                  )}
                />
                <Label className="font-normal" htmlFor="remember">
                  Lembrar-me
                </Label>
              </div>

              <button
                className="font-medium text-primary text-sm leading-5 hover:underline"
                onClick={avisarRecuperacaoIndisponivel}
                type="button"
              >
                Recuperar senha
              </button>
            </div>
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
            {isSubmitting ? 'Entrando…' : 'Entrar'}
          </Button>
        </form>

        <AuthSwitch
          icon={UserRoundPlus}
          label="Criar conta"
          question="Ainda não tem uma conta?"
          to="/cadastro"
        />
      </div>
    </AuthLayout>
  )
}
