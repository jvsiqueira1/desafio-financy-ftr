import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { FormField } from '@/components/form-field'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  CATEGORIES_QUERY,
  type Category,
  CREATE_CATEGORY_MUTATION,
  UPDATE_CATEGORY_MUTATION,
} from '@/graphql/categories'
import { toApiError } from '@/lib/graphql-errors'

import { ColorPicker } from './color-picker'
import { IconPicker } from './icon-picker'

const categorySchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Informe o título')
    .max(60, 'O título deve ter no máximo 60 caracteres'),
  description: z
    .string()
    .trim()
    .max(200, 'A descrição deve ter no máximo 200 caracteres'),
  icon: z.string().min(1, 'Escolha um ícone'),
  color: z.string().min(1, 'Escolha uma cor'),
})

type CategoryFormData = z.infer<typeof categorySchema>

// Primeiro icone e primeira cor ja selecionados, como no layout.
const VALORES_INICIAIS: CategoryFormData = {
  title: '',
  description: '',
  icon: 'briefcase-business',
  color: '#16A34A',
}

const CAMPOS = ['title', 'description', 'icon', 'color'] as const

interface CategoryFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Categoria em edicao. Ausente ao criar. */
  category: Category | null
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
}: CategoryFormDialogProps) {
  const editando = category !== null

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: VALORES_INICIAIS,
  })

  // Esperar o refetch faz o modal fechar so quando a lista ja mostra o
  // resultado — sem isso, a categoria nova apareceria um instante depois.
  const opcoesDeAtualizacao = {
    refetchQueries: [CATEGORIES_QUERY],
    awaitRefetchQueries: true,
  }

  const [criar] = useMutation(CREATE_CATEGORY_MUTATION, opcoesDeAtualizacao)
  const [atualizar] = useMutation(UPDATE_CATEGORY_MUTATION, opcoesDeAtualizacao)

  // A cada abertura o formulario recomeca: vazio ao criar, preenchido ao
  // editar. Sem isso, abrir "Nova categoria" depois de editar mostraria os
  // dados da categoria anterior.
  useEffect(() => {
    if (!open) {
      return
    }

    reset(
      category
        ? {
            title: category.title,
            description: category.description ?? '',
            icon: category.icon,
            color: category.color,
          }
        : VALORES_INICIAIS,
    )
  }, [open, category, reset])

  async function aoEnviar(dados: CategoryFormData) {
    // O back-end guarda descricao vazia como null, nao como string vazia.
    const input = { ...dados, description: dados.description || null }

    try {
      if (category) {
        await atualizar({ variables: { input: { id: category.id, ...input } } })
        toast.success('Categoria atualizada')
      } else {
        await criar({ variables: { input } })
        toast.success('Categoria criada')
      }

      onOpenChange(false)
    } catch (erro) {
      const apiError = toApiError(erro)

      // Titulo repetido e erro do campo titulo, nao do formulario inteiro.
      if (apiError.code === 'CONFLICT') {
        setError('title', { message: apiError.message })
        return
      }

      if (apiError.fields) {
        for (const campo of CAMPOS) {
          const mensagem = apiError.fields[campo]?.[0]

          if (mensagem) {
            setError(campo, { message: mensagem })
          }
        }

        return
      }

      toast.error(apiError.message)
    }
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editando ? 'Editar categoria' : 'Nova categoria'}
          </DialogTitle>
          <DialogDescription>
            Organize suas transações com categorias
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-6"
          noValidate
          onSubmit={handleSubmit(aoEnviar)}
        >
          <div className="space-y-4">
            <FormField
              error={errors.title?.message}
              id="category-title"
              label="Título"
            >
              <Input
                aria-invalid={Boolean(errors.title)}
                id="category-title"
                placeholder="Ex. Alimentação"
                {...register('title')}
              />
            </FormField>

            <FormField
              error={errors.description?.message}
              hint="Opcional"
              id="category-description"
              label="Descrição"
            >
              <Input
                aria-invalid={Boolean(errors.description)}
                id="category-description"
                placeholder="Descrição da categoria"
                {...register('description')}
              />
            </FormField>

            <IconPicker
              error={errors.icon?.message}
              registration={register('icon')}
            />
            <ColorPicker
              error={errors.color?.message}
              registration={register('color')}
            />
          </div>

          <Button className="w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Salvando…' : 'Salvar'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
