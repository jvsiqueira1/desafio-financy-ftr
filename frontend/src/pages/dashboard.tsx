import { useQuery } from '@apollo/client/react'
import { CircleArrowDown, CircleArrowUp, Wallet } from 'lucide-react'
import { useState } from 'react'

import { PageShell } from '@/components/page-shell'
import { Button } from '@/components/ui/button'
import { CategorySpendingPanel } from '@/features/dashboard/category-spending-panel'
import { RecentTransactions } from '@/features/dashboard/recent-transactions'
import { SummaryCard } from '@/features/dashboard/summary-card'
import { TransactionFormDialog } from '@/features/transactions/transaction-form-dialog'
import { DASHBOARD_QUERY } from '@/graphql/dashboard'
import { TRANSACTIONS_QUERY } from '@/graphql/transactions'
import { formatCurrency } from '@/lib/format'

function valor(centavos: number | undefined): string {
  return centavos === undefined ? '—' : formatCurrency(centavos)
}

export function DashboardPage() {
  // O mes e o do relogio do usuario, calculado uma vez ao abrir a tela.
  const [periodo] = useState(() => {
    const hoje = new Date()

    return { month: hoje.getMonth() + 1, year: hoje.getFullYear() }
  })

  const [formularioAberto, setFormularioAberto] = useState(false)

  // `cache-and-network`: mostra o que ja esta no cache e busca o valor atual
  // em seguida. Com o padrao (cache-first), uma transacao criada em outra tela
  // deixaria o saldo desatualizado aqui.
  const resumo = useQuery(DASHBOARD_QUERY, {
    variables: periodo,
    fetchPolicy: 'cache-and-network',
  })

  const recentes = useQuery(TRANSACTIONS_QUERY, {
    variables: { page: 1, pageSize: 5 },
    fetchPolicy: 'cache-and-network',
  })

  const dados = resumo.data?.dashboardSummary

  return (
    <PageShell>
      <div className="space-y-6">
        {resumo.error && !dados && (
          <div className="flex items-center justify-between rounded-xl border border-border bg-card px-6 py-4">
            <p className="text-destructive text-sm">
              Não foi possível carregar os indicadores.
            </p>
            <Button
              onClick={() => resumo.refetch()}
              size="md"
              type="button"
              variant="outline"
            >
              Tentar novamente
            </Button>
          </div>
        )}

        <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <SummaryCard
            icon={Wallet}
            iconClassName="text-category-purple"
            label="Saldo total"
            value={valor(dados?.balanceInCents)}
          />
          <SummaryCard
            icon={CircleArrowUp}
            iconClassName="text-category-green"
            label="Receitas do mês"
            value={valor(dados?.monthIncomeInCents)}
          />
          <SummaryCard
            icon={CircleArrowDown}
            iconClassName="text-category-red"
            label="Despesas do mês"
            value={valor(dados?.monthExpenseInCents)}
          />
        </section>

        {/* O painel de categorias nao estica ate a altura da lista: e assim
            que ele aparece no layout. */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentTransactions
              loading={recentes.loading}
              onNewTransaction={() => setFormularioAberto(true)}
              transactions={recentes.data?.transactions.items ?? []}
            />
          </div>

          <CategorySpendingPanel
            items={dados?.categories ?? []}
            loading={resumo.loading}
          />
        </div>
      </div>

      <TransactionFormDialog
        // A lista de recentes ja e atualizada pelo proprio modal; o resumo e
        // exclusivo desta tela, entao e ela quem pede.
        onOpenChange={setFormularioAberto}
        onSaved={() => resumo.refetch()}
        open={formularioAberto}
        transaction={null}
      />
    </PageShell>
  )
}
