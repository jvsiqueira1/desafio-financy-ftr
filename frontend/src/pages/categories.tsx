import { useQuery } from '@apollo/client/react'
import { ArrowUpDown, Plus, Tag } from 'lucide-react'
import { useMemo, useState } from 'react'

import { EmptyState } from '@/components/empty-state'
import { PageHeader } from '@/components/page-header'
import { PageShell } from '@/components/page-shell'
import { StatCard } from '@/components/stat-card'
import { Button } from '@/components/ui/button'
import { CategoryCard } from '@/features/categories/category-card'
import { CategoryFormDialog } from '@/features/categories/category-form-dialog'
import { DeleteCategoryDialog } from '@/features/categories/delete-category-dialog'
import { summarizeCategories } from '@/features/categories/summarize-categories'
import { CATEGORIES_QUERY, type Category } from '@/graphql/categories'
import {
  getCategoryAppearance,
  getCategoryIcon,
} from '@/lib/category-appearance'

export function CategoriesPage() {
  const { data, loading, error, refetch } = useQuery(CATEGORIES_QUERY)

  const [formularioAberto, setFormularioAberto] = useState(false)
  const [emEdicao, setEmEdicao] = useState<Category | null>(null)
  const [paraExcluir, setParaExcluir] = useState<Category | null>(null)

  const categorias = useMemo(() => data?.categories ?? [], [data])
  const resumo = useMemo(() => summarizeCategories(categorias), [categorias])

  function abrirCriacao() {
    setEmEdicao(null)
    setFormularioAberto(true)
  }

  function abrirEdicao(categoria: Category) {
    setEmEdicao(categoria)
    setFormularioAberto(true)
  }

  const botaoNova = (
    <Button onClick={abrirCriacao} size="md" type="button">
      <Plus aria-hidden />
      Nova categoria
    </Button>
  )

  const maisUsada = resumo.mostUsed

  return (
    <PageShell>
      <div className="space-y-8">
        <PageHeader
          action={botaoNova}
          description="Organize suas transações por categorias"
          title="Categorias"
        />

        {loading && (
          <p className="py-16 text-center text-muted-foreground text-sm">
            Carregando categorias…
          </p>
        )}

        {error && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <p className="text-destructive text-sm">
              Não foi possível carregar as categorias.
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

        {data && (
          <>
            <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <StatCard
                icon={Tag}
                iconClassName="text-gray-700"
                label="Total de categorias"
                value={resumo.totalCategories}
              />
              <StatCard
                icon={ArrowUpDown}
                iconClassName="text-category-purple"
                label="Total de transações"
                value={resumo.totalTransactions}
              />
              {/* O terceiro card mostra o icone da categoria mais usada, na
                  cor dela — nao e um icone fixo. */}
              <StatCard
                icon={maisUsada ? getCategoryIcon(maisUsada.icon) : Tag}
                iconClassName={
                  maisUsada
                    ? getCategoryAppearance(maisUsada.color).text
                    : 'text-gray-400'
                }
                label="Categoria mais utilizada"
                value={maisUsada?.title ?? '—'}
              />
            </section>

            {categorias.length === 0 ? (
              <EmptyState
                action={botaoNova}
                description="Crie a primeira para organizar suas transações."
                icon={Tag}
                title="Nenhuma categoria ainda"
              />
            ) : (
              <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {categorias.map((categoria) => (
                  <CategoryCard
                    category={categoria}
                    key={categoria.id}
                    onDelete={setParaExcluir}
                    onEdit={abrirEdicao}
                  />
                ))}
              </section>
            )}
          </>
        )}
      </div>

      <CategoryFormDialog
        category={emEdicao}
        onOpenChange={setFormularioAberto}
        open={formularioAberto}
      />

      <DeleteCategoryDialog
        category={paraExcluir}
        onClose={() => setParaExcluir(null)}
      />
    </PageShell>
  )
}
