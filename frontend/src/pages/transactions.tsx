import { useQuery } from '@apollo/client/react'
import { ArrowUpDown, Plus, SearchX } from 'lucide-react'
import { useEffect, useState } from 'react'

import { EmptyState } from '@/components/empty-state'
import { PageHeader } from '@/components/page-header'
import { PageShell } from '@/components/page-shell'
import { Pagination } from '@/components/pagination'
import { Button } from '@/components/ui/button'
import { DeleteTransactionDialog } from '@/features/transactions/delete-transaction-dialog'
import { parsePeriod } from '@/features/transactions/period-options'
import { TransactionFilters } from '@/features/transactions/transaction-filters'
import { TransactionFormDialog } from '@/features/transactions/transaction-form-dialog'
import { TransactionsTable } from '@/features/transactions/transactions-table'
import { useTransactionFilters } from '@/features/transactions/use-transaction-filters'
import { TRANSACTIONS_QUERY, type Transaction } from '@/graphql/transactions'

const ITENS_POR_PAGINA = 10

export function TransactionsPage() {
  const { filters, update, hasActiveFilters } = useTransactionFilters()
  const periodo = parsePeriod(filters.period)

  const [formularioAberto, setFormularioAberto] = useState(false)
  const [emEdicao, setEmEdicao] = useState<Transaction | null>(null)
  const [paraExcluir, setParaExcluir] = useState<Transaction | null>(null)

  function abrirCriacao() {
    setEmEdicao(null)
    setFormularioAberto(true)
  }

  function abrirEdicao(transacao: Transaction) {
    setEmEdicao(transacao)
    setFormularioAberto(true)
  }

  const botaoNova = (
    <Button onClick={abrirCriacao} size="md" type="button">
      <Plus aria-hidden />
      Nova transação
    </Button>
  )

  const { data, previousData, loading, error, refetch } = useQuery(
    TRANSACTIONS_QUERY,
    {
      variables: {
        filters: {
          // `undefined` some do JSON enviado: a API recebe so o que foi
          // preenchido, e nao strings vazias que ela teria de ignorar.
          search: filters.search || undefined,
          type: filters.type || undefined,
          categoryId: filters.categoryId || undefined,
          month: periodo?.month,
          year: periodo?.year,
        },
        page: filters.page,
        pageSize: ITENS_POR_PAGINA,
      },
    },
  )

  // Enquanto a proxima pagina carrega, a anterior continua na tela: sem
  // isso, a tabela piscaria vazia a cada troca de pagina ou de filtro.
  const resultado = (data ?? previousData)?.transactions

  // Um link antigo pode apontar para uma pagina que nao existe mais.
  useEffect(() => {
    if (
      resultado &&
      resultado.total > 0 &&
      filters.page > resultado.totalPages
    ) {
      update({ page: resultado.totalPages })
    }
  }, [resultado, filters.page, update])

  return (
    <PageShell>
      <div className="space-y-8">
        <PageHeader
          action={botaoNova}
          description="Gerencie todas as suas transações financeiras"
          title="Transações"
        />

        <TransactionFilters filters={filters} onChange={update} />

        <section className="overflow-hidden rounded-xl border border-border bg-card">
          {error && !resultado && (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <p className="text-destructive text-sm">
                Não foi possível carregar as transações.
              </p>
              <Button
                onClick={() => refetch()}
                size="md"
                type="button"
                variant="outline"
              >
                Tentar novamente
              </Button>
            </div>
          )}

          {loading && !resultado && (
            <p className="py-16 text-center text-muted-foreground text-sm">
              Carregando transações…
            </p>
          )}

          {resultado &&
            resultado.total === 0 &&
            (hasActiveFilters ? (
              <EmptyState
                action={
                  <Button
                    onClick={() =>
                      update({
                        search: '',
                        type: '',
                        categoryId: '',
                        period: '',
                      })
                    }
                    size="md"
                    type="button"
                    variant="outline"
                  >
                    Limpar filtros
                  </Button>
                }
                description="Tente ajustar ou limpar os filtros."
                icon={SearchX}
                title="Nenhuma transação encontrada"
              />
            ) : (
              <EmptyState
                action={botaoNova}
                description="Registre a primeira para começar a acompanhar suas finanças."
                icon={ArrowUpDown}
                title="Nenhuma transação ainda"
              />
            ))}

          {resultado && resultado.total > 0 && (
            <>
              <TransactionsTable
                onDelete={setParaExcluir}
                onEdit={abrirEdicao}
                transactions={resultado.items}
              />
              <div className="border-border border-t">
                <Pagination
                  onPageChange={(pagina) => update({ page: pagina })}
                  page={resultado.page}
                  pageSize={resultado.pageSize}
                  total={resultado.total}
                  totalPages={resultado.totalPages}
                />
              </div>
            </>
          )}
        </section>
      </div>

      <TransactionFormDialog
        onOpenChange={setFormularioAberto}
        open={formularioAberto}
        transaction={emEdicao}
      />

      <DeleteTransactionDialog
        onClose={() => setParaExcluir(null)}
        transaction={paraExcluir}
      />
    </PageShell>
  )
}
