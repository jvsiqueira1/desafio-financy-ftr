import { useMutation, useQuery } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, type DefaultValues, useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { CurrencyInput } from '@/components/currency-input'
import { DatePicker } from '@/components/date-picker'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CATEGORIES_QUERY } from '@/graphql/categories'
import {
  CREATE_TRANSACTION_MUTATION,
  TRANSACTIONS_QUERY,
  type Transaction,
  UPDATE_TRANSACTION_MUTATION,
} from '@/graphql/transactions'
import { toApiError } from '@/lib/graphql-errors'

import { TransactionTypeToggle } from './transaction-type-toggle'

const transactionSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE']),
  description: z
    .string()
    .trim()
    .min(1, 'Informe a descrição')
    .max(120, 'A descrição deve ter no máximo 120 caracteres'),
  date: z.date({ error: 'Selecione a data' }),
  amountInCents: z.number().int().positive('Informe um valor maior que zero'),
  categoryId: z.string().min(1, 'Selecione a categoria'),
})

type TransactionFormData = z.infer<typeof transactionSchema>

// Despesa ja selecionada, como no layout. A data comeca vazia para mostrar
// "Selecione" — DefaultValues permite deixar campos obrigatorios em aberto.
const VALORES_INICIAIS: DefaultValues<TransactionFormData> = {
  type: 'EXPENSE',
  description: '',
  date: undefined,
  amountInCents: 0,
  categoryId: '',
}

const CAMPOS = [
  'type',
  'description',
  'date',
  'amountInCents',
  'categoryId',
] as const

interface TransactionFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Transacao em edicao. Null ao criar. */
  transaction: Transaction | null
  /**
   * Chamado depois de salvar, antes de fechar. Quem abre o modal usa isto para
   * atualizar o que so a sua tela exibe — o modal nao precisa conhecer as telas.
   */
  onSaved?: () => unknown
}

export function TransactionFormDialog({
  open,
  onOpenChange,
  transaction,
  onSaved,
}: TransactionFormDialogProps) {
  const editando = transaction !== null
  const { data } = useQuery(CATEGORIES_QUERY)
  const categorias = data?.categories ?? []

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: VALORES_INICIAIS,
  })

  // Uma transacao muda a propria lista e tambem o `transactionsCount` da
  // categoria: as duas consultas precisam ser refeitas.
  const opcoesDeAtualizacao = {
    refetchQueries: [TRANSACTIONS_QUERY, CATEGORIES_QUERY],
    awaitRefetchQueries: true,
  }

  const [criar] = useMutation(CREATE_TRANSACTION_MUTATION, opcoesDeAtualizacao)
  const [atualizar] = useMutation(
    UPDATE_TRANSACTION_MUTATION,
    opcoesDeAtualizacao,
  )

  useEffect(() => {
    if (!open) {
      return
    }

    reset(
      transaction
        ? {
            type: transaction.type,
            description: transaction.description,
            date: new Date(transaction.date),
            amountInCents: transaction.amountInCents,
            categoryId: transaction.category.id,
          }
        : VALORES_INICIAIS,
    )
  }, [open, transaction, reset])

  async function aoEnviar(dados: TransactionFormData) {
    const input = { ...dados, date: dados.date.toISOString() }

    try {
      if (transaction) {
        await atualizar({
          variables: { input: { id: transaction.id, ...input } },
        })
        toast.success('Transação atualizada')
      } else {
        await criar({ variables: { input } })
        toast.success('Transação criada')
      }

      await onSaved?.()
      onOpenChange(false)
    } catch (erro) {
      const apiError = toApiError(erro)

      // A categoria pode ter sido excluida em outra aba desde que o modal abriu.
      if (apiError.code === 'NOT_FOUND') {
        setError('categoryId', { message: apiError.message })
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
            {editando ? 'Editar transação' : 'Nova transação'}
          </DialogTitle>
          <DialogDescription>Registre sua despesa ou receita</DialogDescription>
        </DialogHeader>

        <form
          className="space-y-6"
          noValidate
          onSubmit={handleSubmit(aoEnviar)}
        >
          <TransactionTypeToggle
            registration={register('type')}
            value={watch('type')}
          />

          <div className="space-y-4">
            <FormField
              error={errors.description?.message}
              id="transaction-description"
              label="Descrição"
            >
              <Input
                aria-invalid={Boolean(errors.description)}
                id="transaction-description"
                placeholder="Ex. Almoço no restaurante"
                {...register('description')}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                error={errors.date?.message}
                id="transaction-date"
                label="Data"
              >
                <Controller
                  control={control}
                  name="date"
                  render={({ field }) => (
                    <DatePicker
                      id="transaction-date"
                      invalid={Boolean(errors.date)}
                      onChange={field.onChange}
                      value={field.value}
                    />
                  )}
                />
              </FormField>

              <FormField
                error={errors.amountInCents?.message}
                id="transaction-amount"
                label="Valor"
              >
                <Controller
                  control={control}
                  name="amountInCents"
                  render={({ field }) => (
                    <CurrencyInput
                      aria-invalid={Boolean(errors.amountInCents)}
                      id="transaction-amount"
                      onBlur={field.onBlur}
                      onValueChange={field.onChange}
                      value={field.value}
                    />
                  )}
                />
              </FormField>
            </div>

            <FormField
              error={errors.categoryId?.message}
              id="transaction-category"
              label="Categoria"
            >
              <Controller
                control={control}
                name="categoryId"
                render={({ field }) => (
                  <Select
                    disabled={categorias.length === 0}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger
                      aria-invalid={Boolean(errors.categoryId)}
                      id="transaction-category"
                    >
                      <SelectValue
                        placeholder={
                          categorias.length === 0
                            ? 'Nenhuma categoria cadastrada'
                            : 'Selecione'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map((categoria) => (
                        <SelectItem key={categoria.id} value={categoria.id}>
                          {categoria.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>

            {categorias.length === 0 && (
              <p className="text-muted-foreground text-sm">
                Toda transação precisa de uma categoria.{' '}
                <Link
                  className="font-medium text-primary underline"
                  to="/categorias"
                >
                  Criar uma categoria
                </Link>
              </p>
            )}
          </div>

          <Button className="w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Salvando…' : 'Salvar'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
