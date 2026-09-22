import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

import type { TransactionType } from '@/graphql/transactions'

export interface TransactionFiltersState {
  search: string
  type: TransactionType | ''
  categoryId: string
  /** "2025-11", ou vazio para todos os periodos. */
  period: string
  page: number
}

/** Nome de cada filtro na URL. */
const CHAVES: Record<keyof TransactionFiltersState, string> = {
  search: 'busca',
  type: 'tipo',
  categoryId: 'categoria',
  period: 'periodo',
  page: 'pagina',
}

function lerTipo(valor: string | null): TransactionType | '' {
  return valor === 'INCOME' || valor === 'EXPENSE' ? valor : ''
}

function lerPagina(valor: string | null): number {
  const numero = Number(valor)

  return Number.isInteger(numero) && numero > 0 ? numero : 1
}

/**
 * Os filtros vivem na URL, e nao em estado do componente.
 *
 * Assim sobrevivem ao F5, o botao voltar do navegador funciona, e um link
 * filtrado pode ser compartilhado. A URL e a unica fonte da verdade.
 */
export function useTransactionFilters() {
  const [params, setParams] = useSearchParams()

  const filters = useMemo<TransactionFiltersState>(
    () => ({
      search: params.get(CHAVES.search) ?? '',
      type: lerTipo(params.get(CHAVES.type)),
      categoryId: params.get(CHAVES.categoryId) ?? '',
      period: params.get(CHAVES.period) ?? '',
      page: lerPagina(params.get(CHAVES.page)),
    }),
    [params],
  )

  const update = useCallback(
    (mudancas: Partial<TransactionFiltersState>) => {
      setParams(
        (atuais) => {
          const proximos = new URLSearchParams(atuais)

          for (const [campo, valor] of Object.entries(mudancas)) {
            const chave = CHAVES[campo as keyof TransactionFiltersState]
            const vazio = valor === '' || valor === 1 || valor === undefined

            // Valores padrao saem da URL, para que ela fique limpa.
            if (vazio) {
              proximos.delete(chave)
            } else {
              proximos.set(chave, String(valor))
            }
          }

          // Mudar qualquer filtro volta para a primeira pagina: a pagina 3
          // de um resultado filtrado pode nem existir.
          if (!('page' in mudancas)) {
            proximos.delete(CHAVES.page)
          }

          return proximos
        },
        // Substitui em vez de empilhar no historico: sem isso, cada letra
        // digitada na busca viraria uma entrada do botao voltar.
        { replace: true },
      )
    },
    [setParams],
  )

  const hasActiveFilters = Boolean(
    filters.search || filters.type || filters.categoryId || filters.period,
  )

  return { filters, update, hasActiveFilters }
}
