import { useMutation } from '@apollo/client/react'
import { toast } from 'sonner'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { CATEGORIES_QUERY } from '@/graphql/categories'
import {
  DELETE_TRANSACTION_MUTATION,
  TRANSACTIONS_QUERY,
  type Transaction,
} from '@/graphql/transactions'
import { formatSignedCurrency } from '@/lib/format'
import { toApiError } from '@/lib/graphql-errors'

interface DeleteTransactionDialogProps {
  transaction: Transaction | null
  onClose: () => void
}

export function DeleteTransactionDialog({
  transaction,
  onClose,
}: DeleteTransactionDialogProps) {
  const [excluir, { loading }] = useMutation(DELETE_TRANSACTION_MUTATION, {
    refetchQueries: [TRANSACTIONS_QUERY, CATEGORIES_QUERY],
    awaitRefetchQueries: true,
  })

  async function confirmar() {
    if (!transaction) {
      return
    }

    try {
      await excluir({ variables: { id: transaction.id } })
      toast.success('Transação excluída')
      onClose()
    } catch (erro) {
      toast.error(toApiError(erro).message)
    }
  }

  return (
    <AlertDialog
      onOpenChange={(aberto) => {
        if (!aberto) {
          onClose()
        }
      }}
      open={transaction !== null}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir transação</AlertDialogTitle>
          <AlertDialogDescription>
            {transaction &&
              `Tem certeza que deseja excluir "${transaction.description}" (${formatSignedCurrency(transaction.amountInCents, transaction.type)})? Essa ação não pode ser desfeita.`}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={(evento) => {
              // Fecha so depois que a exclusao terminar.
              evento.preventDefault()
              confirmar()
            }}
            variant="destructive"
          >
            {loading ? 'Excluindo…' : 'Excluir'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
