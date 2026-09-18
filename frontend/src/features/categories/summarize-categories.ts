import type { Category } from '@/graphql/categories'

export interface CategorySummary {
  totalCategories: number
  totalTransactions: number
  /** Null quando nenhuma categoria tem transacao. */
  mostUsed: Category | null
}

/**
 * Deriva os indicadores da tela a partir da lista ja carregada.
 *
 * Nao ha consulta propria para isto: tudo sai do `transactionsCount` que a
 * listagem ja traz. Em empate, vence a primeira em ordem alfabetica, que e a
 * ordem em que a API devolve.
 */
export function summarizeCategories(categories: Category[]): CategorySummary {
  let totalTransactions = 0
  let mostUsed: Category | null = null

  for (const categoria of categories) {
    totalTransactions += categoria.transactionsCount

    const superaAtual =
      mostUsed === null ||
      categoria.transactionsCount > mostUsed.transactionsCount

    if (categoria.transactionsCount > 0 && superaAtual) {
      mostUsed = categoria
    }
  }

  return {
    totalCategories: categories.length,
    totalTransactions,
    mostUsed,
  }
}
