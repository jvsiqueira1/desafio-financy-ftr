import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { LogOut } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { FormField } from '@/components/form-field'
import { PageHeader } from '@/components/page-header'
import { PageShell } from '@/components/page-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/features/auth/use-auth'
import { UPDATE_PROFILE_MUTATION } from '@/graphql/session'
import { getInitials } from '@/lib/format'
import { toApiError } from '@/lib/graphql-errors'

// As mesmas regras do back-end, repetidas aqui de proposito: o front valida
// para dar resposta imediata, o back valida porque e quem realmente protege.
const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'O nome deve ter no mínimo 3 caracteres')
    .max(120, 'O nome deve ter no máximo 120 caracteres'),
})

type ProfileFormData = z.infer<typeof profileSchema>

export function AccountPage() {
  const { user, signOut } = useAuth()

  const [atualizarPerfil] = useMutation(UPDATE_PROFILE_MUTATION)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    // ProtectedRoute so libera esta tela com a sessao carregada, entao o nome
    // ja esta disponivel na primeira renderizacao — nao ha o que esperar.
    defaultValues: { name: user?.name ?? '' },
  })

  async function aoEnviar(dados: ProfileFormData) {
    try {
      await atualizarPerfil({ variables: { input: { name: dados.name } } })
      toast.success('Perfil atualizado')
    } catch (erro) {
      const apiError = toApiError(erro)

      // Erro de validacao destaca o campo, nao vira um toast generico.
      if (apiError.fields?.name?.[0]) {
        setError('name', { message: apiError.fields.name[0] })
        return
      }

      toast.error(apiError.message)
    }
  }

  return (
    <PageShell>
      <div className="space-y-8">
        <PageHeader
          description="Gerencie os dados da sua conta"
          title="Conta"
        />

        <div className="mx-auto max-w-md space-y-6 rounded-xl border border-border bg-card p-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <div
              aria-hidden
              className="flex size-16 items-center justify-center rounded-full bg-gray-300 font-medium text-foreground text-xl"
            >
              {user ? getInitials(user.name) : ''}
            </div>

            <div>
              <p className="font-semibold text-foreground text-xl">
                {user?.name}
              </p>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <form
            className="space-y-6"
            noValidate
            onSubmit={handleSubmit(aoEnviar)}
          >
            <FormField
              error={errors.name?.message}
              id="profile-name"
              label="Nome completo"
            >
              <Input
                aria-invalid={Boolean(errors.name)}
                autoComplete="name"
                id="profile-name"
                {...register('name')}
              />
            </FormField>

            <Button className="w-full" disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Salvando…' : 'Salvar'}
            </Button>
          </form>

          <Separator />

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
      </div>
    </PageShell>
  )
}
