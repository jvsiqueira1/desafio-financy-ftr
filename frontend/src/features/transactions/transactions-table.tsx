import { SquarePen, Trash } from 'lucide-react'
import { CategoryIcon } from '@/components/category-icon'
import { CategoryTag } from '@/components/category-tag'
import { Button } from '@/components/ui/button'
import type { Transaction } from '@/graphql/transactions'
import { formatDate, formatSignedCurrency } from '@/lib/format'

import { TransactionTypeLabel } from './transaction-type-label'

interface TransactionsTableProps {
  transactions: Transaction[]
  onEdit: (transaction: Transaction) => void
  onDelete: (transaction: Transaction) => void
}

const CABECALHO =
  'px-6 py-5 font-medium text-gray-500 text-xs uppercase leading-4 tracking-[0.6px]'

/**
 * Tabela de verdade, e nao divs: o leitor de tela anuncia "linha 3, coluna
 * Valor", o que um amontoado de divs nao permite.
 */
export function TransactionsTable({
  transactions,
  onEdit,
  onDelete,
}: TransactionsTableProps) {
  return (
    <table className="w-full table-fixed">
      {/* Larguras medidas no layout: 112, 200, 136, 200 e 120px. A descricao
          ocupa o que sobrar. */}
      <colgroup>
        <col />
        <col className="w-28" />
        <col className="w-50" />
        <col className="w-34" />
        <col className="w-50" />
        <col className="w-30" />
      </colgroup>

      <thead className="border-border border-b">
        <tr>
          <th className={`${CABECALHO} text-left`} scope="col">
            Descrição
          </th>
          <th className={`${CABECALHO} text-center`} scope="col">
            Data
          </th>
          <th className={`${CABECALHO} text-center`} scope="col">
            Categoria
          </th>
          <th className={`${CABECALHO} text-center`} scope="col">
            Tipo
          </th>
          <th className={`${CABECALHO} text-right`} scope="col">
            Valor
          </th>
          <th className={`${CABECALHO} text-right`} scope="col">
            Ações
          </th>
        </tr>
      </thead>

      <tbody>
        {transactions.map((transacao) => (
          <tr
            className="h-18 border-border border-b last:border-b-0"
            key={transacao.id}
          >
            <td className="px-6">
              <div className="flex items-center gap-4">
                <CategoryIcon
                  color={transacao.category.color}
                  icon={transacao.category.icon}
                />
                <span className="truncate font-medium text-base text-foreground">
                  {transacao.description}
                </span>
              </div>
            </td>
            <td className="px-6 text-center text-muted-foreground text-sm">
              {formatDate(transacao.date)}
            </td>
            <td className="px-6 text-center">
              <CategoryTag
                color={transacao.category.color}
                title={transacao.category.title}
              />
            </td>
            <td className="px-6 text-center">
              <TransactionTypeLabel type={transacao.type} />
            </td>
            <td className="px-6 text-right font-semibold text-foreground text-sm">
              {formatSignedCurrency(transacao.amountInCents, transacao.type)}
            </td>
            {/* As acoes de editar e excluir entram junto com o modal. */}
            <td className="px-6">
              <div className="flex items-center justify-center gap-2">
                <Button
                  aria-label={`Excluir ${transacao.description}`}
                  onClick={() => onDelete(transacao)}
                  size="icon"
                  type="button"
                  variant="outline"
                >
                  <Trash aria-hidden className="text-red-500" />
                </Button>
                <Button
                  aria-label={`Editar ${transacao.description}`}
                  onClick={() => onEdit(transacao)}
                  size="icon"
                  type="button"
                  variant="outline"
                >
                  <SquarePen aria-hidden className="text-gray-700" />
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
