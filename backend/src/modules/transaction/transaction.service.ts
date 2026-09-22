import type { Prisma, PrismaClient } from '@prisma/client'
import { z } from 'zod'

import { invalidInput, notFound } from '../../lib/errors.js'
import { toFieldErrors } from '../../lib/validations.js'
import { categorySelect, toCategory } from '../category/category.service.js'

const idSchema = z.uuid('Identificador inválido')

const descriptionSchema = z
  .string()
  .trim()
  .min(1, 'Informe a descrição')
  .max(120, 'A descrição deve ter no máximo 120 caracteres')

const amountSchema = z
  .number()
  .int('O valor deve ser informado em centavos, sem casas decimais')
  .positive('O valor deve ser maior que zero')
  .max(1_000_000_000, 'O valor deve ser de no máximo R$ 10.000.000,00')

const typeSchema = z.enum(['INCOME', 'EXPENSE'], {
  error: 'O tipo deve ser INCOME ou EXPENSE',
})

const dateSchema = z.date({ error: 'Informe uma data válida' })

const createTransactionSchema = z.object({
  description: descriptionSchema,
  amountInCents: amountSchema,
  type: typeSchema,
  date: dateSchema,
  categoryId: idSchema,
})

const updateTransactionSchema = z.object({
  id: idSchema,
  description: descriptionSchema.optional(),
  amountInCents: amountSchema.optional(),
  type: typeSchema.optional(),
  date: dateSchema.optional(),
  categoryId: idSchema.optional(),
})

const filtersSchema = z
  .object({
    search: z.string().trim().max(120).optional(),
    type: typeSchema.optional(),
    categoryId: idSchema.optional(),
    month: z.number().int().min(1).max(12).optional(),
    year: z.number().int().min(1970).max(2200).optional(),
  })
  .nullish()

const paginationSchema = z.object({
  page: z.number().int().min(1, 'A página deve ser maior que zero').default(1),
  pageSize: z
    .number()
    .int()
    .min(1, 'O tamanho da página deve ser maior que zero')
    .max(100, 'O tamanho da página deve ser no máximo 100')
    .default(10),
})

const transactionSelect = {
  id: true,
  description: true,
  amount: true,
  type: true,
  date: true,
  category: { select: categorySelect },
} as const

interface TransactionRow {
  id: string
  description: string
  amount: number
  type: 'INCOME' | 'EXPENSE'
  date: Date
  category: Parameters<typeof toCategory>[0]
}

function toTransaction(transaction: TransactionRow) {
  return {
    id: transaction.id,
    description: transaction.description,
    // O banco guarda centavos e a API tambem os expoe: converter para reais
    // aqui reintroduziria ponto flutuante no transporte.
    amountInCents: transaction.amount,
    type: transaction.type,
    date: transaction.date,
    category: toCategory(transaction.category),
  }
}

/**
 * A chave estrangeira garante apenas que a categoria EXISTE. Sem esta
 * verificacao, um usuario conseguiria criar transacoes apontando para a
 * categoria de outro, corrompendo a contagem e a listagem alheias.
 */
async function assertCategoryBelongsToUser(
  prisma: PrismaClient,
  userId: string,
  categoryId: string,
) {
  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId },
    select: { id: true },
  })

  if (!category) {
    throw notFound('Categoria não encontrada')
  }
}

export async function listTransactions(
  prisma: PrismaClient,
  userId: string,
  rawFilters: unknown,
  rawPagination: unknown,
) {
  const parsedFilters = filtersSchema.safeParse(rawFilters)
  const parsedPagination = paginationSchema.safeParse(rawPagination)

  if (!parsedFilters.success) {
    throw invalidInput('Filtros inválidos', toFieldErrors(parsedFilters.error))
  }

  if (!parsedPagination.success) {
    throw invalidInput(
      'Paginação inválida',
      toFieldErrors(parsedPagination.error),
    )
  }

  const filters = parsedFilters.data ?? {}
  const { page, pageSize } = parsedPagination.data

  // O userId abre o filtro e nao e opcional: nao existe listagem sem dono.
  const where: Prisma.TransactionWhereInput = { userId }

  if (filters.search) {
    // O LIKE do SQLite ja ignora maiusculas para caracteres ASCII.
    // Palavras acentuadas continuam sensiveis a caixa.
    where.description = { contains: filters.search }
  }

  if (filters.type) {
    where.type = filters.type
  }

  if (filters.categoryId) {
    where.categoryId = filters.categoryId
  }

  const temMes = filters.month !== undefined
  const temAno = filters.year !== undefined

  if (temMes !== temAno) {
    throw invalidInput('Informe mês e ano juntos para filtrar por período')
  }

  if (temMes && temAno) {
    const month = filters.month as number
    const year = filters.year as number

    // Intervalo fechado no inicio e aberto no fim: pega o mes inteiro sem
    // depender da quantidade de dias nem do horario das transacoes.
    where.date = {
      gte: new Date(Date.UTC(year, month - 1, 1)),
      lt: new Date(Date.UTC(year, month, 1)),
    }
  }

  /**
   * As duas consultas vao na mesma transacao de banco para que a contagem
   * corresponda exatamente a pagina retornada.
   */
  const [items, total] = await prisma.$transaction([
    prisma.transaction.findMany({
      where,
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: transactionSelect,
    }),
    prisma.transaction.count({ where }),
  ])

  return {
    items: items.map(toTransaction),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  }
}

export async function getTransaction(
  prisma: PrismaClient,
  userId: string,
  id: string,
) {
  const transaction = await prisma.transaction.findFirst({
    where: { id, userId },
    select: transactionSelect,
  })

  if (!transaction) {
    throw notFound('Transação não encontrada')
  }

  return toTransaction(transaction)
}

export async function createTransaction(
  prisma: PrismaClient,
  userId: string,
  input: unknown,
) {
  const parsed = createTransactionSchema.safeParse(input)

  if (!parsed.success) {
    throw invalidInput('Dados inválidos', toFieldErrors(parsed.error))
  }

  const { amountInCents, categoryId, ...rest } = parsed.data

  await assertCategoryBelongsToUser(prisma, userId, categoryId)

  const transaction = await prisma.transaction.create({
    data: { ...rest, amount: amountInCents, categoryId, userId },
    select: transactionSelect,
  })

  return toTransaction(transaction)
}

export async function updateTransaction(
  prisma: PrismaClient,
  userId: string,
  input: unknown,
) {
  const parsed = updateTransactionSchema.safeParse(input)

  if (!parsed.success) {
    throw invalidInput('Dados inválidos', toFieldErrors(parsed.error))
  }

  const { id, amountInCents, categoryId, ...rest } = parsed.data

  const data: Prisma.TransactionUncheckedUpdateManyInput = { ...rest }

  if (amountInCents !== undefined) {
    data.amount = amountInCents
  }

  if (categoryId !== undefined) {
    // Trocar de categoria tambem exige que a nova pertenca ao usuario.
    await assertCategoryBelongsToUser(prisma, userId, categoryId)
    data.categoryId = categoryId
  }

  if (Object.keys(data).length === 0) {
    throw invalidInput('Informe ao menos um campo para atualizar')
  }

  const result = await prisma.transaction.updateMany({
    where: { id, userId },
    data,
  })

  if (result.count === 0) {
    throw notFound('Transação não encontrada')
  }

  return getTransaction(prisma, userId, id)
}

export async function deleteTransaction(
  prisma: PrismaClient,
  userId: string,
  id: unknown,
) {
  const parsed = idSchema.safeParse(id)

  if (!parsed.success) {
    throw notFound('Transação não encontrada')
  }

  const result = await prisma.transaction.deleteMany({
    where: { id: parsed.data, userId },
  })

  if (result.count === 0) {
    throw notFound('Transação não encontrada')
  }

  return true
}
