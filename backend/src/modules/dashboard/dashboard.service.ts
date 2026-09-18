import type { PrismaClient, TransactionType } from '@prisma/client'
import { z } from 'zod'

import { invalidInput } from '../../lib/errors.js'
import { toFieldErrors } from '../../lib/validations.js'
import { categorySelect, toCategory } from '../category/category.service.js'

/** Quantas categorias o painel do dashboard exibe. */
const CATEGORIAS_NO_PAINEL = 5

const periodoSchema = z.object({
  month: z.number().int().min(1, 'Mês inválido').max(12, 'Mês inválido'),
  year: z.number().int().min(1970, 'Ano inválido').max(2200, 'Ano inválido'),
})

interface SomaPorTipo {
  type: TransactionType
  _sum: { amount: number | null }
}

function somaDoTipo(grupos: SomaPorTipo[], tipo: TransactionType): number {
  return grupos.find((grupo) => grupo.type === tipo)?._sum.amount ?? 0
}

/**
 * Indicadores do dashboard, calculados no banco.
 *
 * O saldo depende de TODAS as transacoes, nao so das que a tela carrega.
 * Somar no navegador exigiria baixar o historico inteiro a cada visita; no
 * banco, e uma unica agregacao por grupo.
 *
 * O mes vem do cliente, e nao do relogio do servidor: o "mes atual" e o do
 * usuario. Na virada do mes, o servidor em UTC ja estaria no mes seguinte
 * enquanto o usuario no Brasil ainda nao.
 */
export async function getDashboardSummary(
  prisma: PrismaClient,
  userId: string,
  input: unknown,
) {
  const parsed = periodoSchema.safeParse(input)

  if (!parsed.success) {
    throw invalidInput('Período inválido', toFieldErrors(parsed.error))
  }

  const { month, year } = parsed.data
  const inicioDoMes = new Date(Date.UTC(year, month - 1, 1))
  const inicioDoProximoMes = new Date(Date.UTC(year, month, 1))

  // As tres agregacoes na mesma transacao de banco: saldo, mes e categorias
  // enxergam o mesmo estado, sem uma insercao concorrente no meio.
  const [geral, doMes, porCategoria] = await prisma.$transaction([
    prisma.transaction.groupBy({
      by: ['type'],
      where: { userId },
      _sum: { amount: true },
      orderBy: { type: 'asc' },
    }),
    prisma.transaction.groupBy({
      by: ['type'],
      where: { userId, date: { gte: inicioDoMes, lt: inicioDoProximoMes } },
      _sum: { amount: true },
      orderBy: { type: 'asc' },
    }),
    prisma.transaction.groupBy({
      by: ['categoryId'],
      where: { userId },
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } },
      take: CATEGORIAS_NO_PAINEL,
    }),
  ])

  const ids = porCategoria.map((grupo) => grupo.categoryId)

  const categorias = await prisma.category.findMany({
    where: { id: { in: ids }, userId },
    select: categorySelect,
  })

  const porId = new Map(
    categorias.map((categoria) => [categoria.id, categoria]),
  )

  return {
    balanceInCents: somaDoTipo(geral, 'INCOME') - somaDoTipo(geral, 'EXPENSE'),
    monthIncomeInCents: somaDoTipo(doMes, 'INCOME'),
    monthExpenseInCents: somaDoTipo(doMes, 'EXPENSE'),
    // O findMany nao preserva a ordem dos ids: a ordem vem do groupBy, que ja
    // esta do maior total para o menor.
    categories: porCategoria.flatMap((grupo) => {
      const categoria = porId.get(grupo.categoryId)

      return categoria
        ? [
            {
              category: toCategory(categoria),
              totalAmountInCents: grupo._sum.amount ?? 0,
            },
          ]
        : []
    }),
  }
}
