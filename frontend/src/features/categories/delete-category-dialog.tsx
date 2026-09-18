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
import {
  CATEGORIES_QUERY,
  type Category,
  DELETE_CATEGORY_MUTATION,
} from '@/graphql/categories'
import { formatItemCount } from '@/lib/format'
import { toApiError } from '@/lib/graphql-errors'

interface DeleteCategoryDialogProps {
  /** Categoria a excluir. Null mantem o dialogo fechado. */
  category: Category | null
  onClose: () => void
}

export function DeleteCategoryDialog({
  category,
  onClose,
}: DeleteCategoryDialogProps) {
  const [excluir, { loading }] = useMutation(DELETE_CATEGORY_MUTATION, {
    refetchQueries: [CATEGORIES_QUERY],
    awaitRefetchQueries: true,
  })

  // A interface ja sabe se ha transacoes, entao nem oferece a exclusao. O
  // back-end continua recusando com Restrict: aqui e conveniencia, la e a
  // garantia.
  const emUso = (category?.transactionsCount ?? 0) > 0

  async function confirmar() {
    if (!category) {
      return
    }

    try {
      await excluir({ variables: { id: category.id } })
      toast.success('Categoria excluída')
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
      open={category !== null}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {emUso ? 'Não é possível excluir' : 'Excluir categoria'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {emUso
              ? `"${category?.title}" possui ${formatItemCount(category?.transactionsCount ?? 0)} vinculados. Mova-os para outra categoria antes de excluí-la.`
              : `Tem certeza que deseja excluir "${category?.title}"? Essa ação não pode ser desfeita.`}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>
            {emUso ? 'Entendi' : 'Cancelar'}
          </AlertDialogCancel>

          {!emUso && (
            <AlertDialogAction
              disabled={loading}
              onClick={(evento) => {
                // O AlertDialogAction fecha o dialogo ao ser clicado. Aqui
                // queremos fechar so depois que a exclusao terminar.
                evento.preventDefault()
                confirmar()
              }}
              variant="destructive"
            >
              {loading ? 'Excluindo…' : 'Excluir'}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
