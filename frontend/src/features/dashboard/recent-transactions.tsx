import { CircleArrowDown, CircleArrowUp, Plus } from 'lucide-react'

import { CategoryIcon } from '@/components/category-icon'
import { CategoryTag } from '@/components/category-tag'
import type { Transaction } from '@/graphql/transactions'
import { formatDate, formatSignedCurrency } from '@/lib/format'

import { SectionHeader } from './section-header'

interface RecentTransactionsProps {
  transactions: Transaction[]
  loading: boolean
  onNewTransaction: () => void
}

/**
 * As ultimas transacoes, em lista.
 *
 * Diferente da tela de transacoes, aqui nao ha cabecalho de coluna: sao itens
 * de uma lista, e <ul> e a marcacao que descreve isso.
 */
export function RecentTransactions({
  transactions,
  loading,
  onNewTransaction,
}: RecentTransactionsProps) {
  const vazia = transactions.length === 0

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card">
      {/* No layout este cabecalho tem 12px a direita; o de categorias, 24px. */}
      <SectionHeader
        className="pr-3"
        linkLabel="Ver todas"
        linkTo="/transacoes"
        title="Transações recentes"
      />

      {vazia && (
        <p className="border-border border-b px-6 py-10 text-center text-muted-foreground text-sm">
          {loading ? 'Carregando…' : 'Nenhuma transação registrada ainda.'}
        </p>
      )}

      <ul>
        {transactions.map((transacao) => {
          const receita = transacao.type === 'INCOME'
          const Seta = receita ? CircleArrowUp : CircleArrowDown

          return (
            <li
              className="flex h-20 items-center border-border border-b"
              key={transacao.id}
            >
              <div className="flex min-w-0 flex-1 items-center gap-4 px-6">
                <CategoryIcon
                  color={transacao.category.color}
                  icon={transacao.category.icon}
                />
                <div className="min-w-0 space-y-0.5">
                  <p className="truncate font-medium text-base text-foreground">
                    {transacao.description}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {formatDate(transacao.date)}
                  </p>
                </div>
              </div>

              <div className="flex w-40 shrink-0 justify-center px-6">
                <CategoryTag
                  color={transacao.category.color}
                  title={transacao.category.title}
                />
              </div>

              <div className="flex w-40 shrink-0 items-center justify-end gap-2 px-6">
                <span className="whitespace-nowrap font-semibold text-foreground text-sm">
                  {formatSignedCurrency(
                    transacao.amountInCents,
                    transacao.type,
                  )}
                </span>
                <Seta
                  aria-hidden
                  className={
                    receita
                      ? 'size-4 shrink-0 text-category-green'
                      : 'size-4 shrink-0 text-category-red'
                  }
                />
              </div>
            </li>
          )
        })}
      </ul>

      <div className="flex justify-center px-6 py-5">
        <button
          className="flex items-center gap-1 font-medium text-primary text-sm leading-5 hover:underline"
          onClick={onNewTransaction}
          type="button"
        >
          <Plus aria-hidden className="size-5" />
          Nova transação
        </button>
      </div>
    </section>
  )
}
