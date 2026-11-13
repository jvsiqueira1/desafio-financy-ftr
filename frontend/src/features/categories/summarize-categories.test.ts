import { describe, expect, it } from 'vitest'

import type { Category } from '@/graphql/categories'

import { summarizeCategories } from './summarize-categories'

function categoria(title: string, transactionsCount: number): Category {
  return {
    id: title,
    title,
    description: null,
    icon: 'tag',
    color: '#16A34A',
    transactionsCount,
  }
}

describe('summarizeCategories', () => {
  it('soma as transacoes e aponta a categoria mais usada', () => {
    const resumo = summarizeCategories([
      categoria('Aluguel', 1),
      categoria('Mercado', 5),
      categoria('Lazer', 2),
    ])

    expect(resumo.totalCategories).toBe(3)
    expect(resumo.totalTransactions).toBe(8)
    expect(resumo.mostUsed?.title).toBe('Mercado')
  })

  it('em empate, mantem a primeira da lista', () => {
    const resumo = summarizeCategories([
      categoria('Aluguel', 3),
      categoria('Mercado', 3),
    ])

    expect(resumo.mostUsed?.title).toBe('Aluguel')
  })

  it('nao aponta categoria sem transacoes', () => {
    expect(summarizeCategories([categoria('Vazia', 0)]).mostUsed).toBeNull()
    expect(summarizeCategories([])).toEqual({
      totalCategories: 0,
      totalTransactions: 0,
      mostUsed: null,
    })
  })
})
