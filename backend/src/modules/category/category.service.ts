import type { PrismaClient } from '@prisma/client'
import { z } from 'zod'

import { conflict, invalidInput, notFound } from '../../lib/errors.js'
import { isPrismaError } from '../../lib/prisma-error.js'
import { toFieldErrors } from '../../lib/validations.js'

/**
 * Cores disponiveis no seletor de categoria.
 * Correspondem aos tokens *-base do Style Guide do Figma.
 */
export const CATEGORY_COLORS = [
  '#16A34A', // verde
  '#2563EB', // azul
  '#9333EA', // roxo
  '#DB2777', // rosa
  '#DC2626', // vermelho
  '#EA580C', // laranja
  '#CA8A04', // amarelo
] as const

const titleSchema = z
  .string()
  .trim()
  .min(1, 'Informe o título da categoria')
  .max(60, 'O título deve ter no máximo 60 caracteres')

const descriptionSchema = z
  .string()
  .trim()
  .max(200, 'A descrição deve ter no máximo 200 caracteres')

const iconSchema = z
  .string()
  .trim()
  .min(1, 'Informe o ícone')
  .max(40, 'Identificador de ícone muito longo')
  .regex(/^[a-z0-9-]+$/, 'O ícone deve ser um identificador em minúsculas')

const colorSchema = z.enum(CATEGORY_COLORS, {
  error: 'Cor fora da paleta disponível',
})

const idSchema = z.uuid('Identificador inválido')

const createCategorySchema = z.object({
  title: titleSchema,
  description: descriptionSchema.nullish(),
  icon: iconSchema,
  color: colorSchema,
})

const updateCategorySchema = z.object({
  id: idSchema,
  title: titleSchema.optional(),
  description: descriptionSchema.nullish(),
  icon: iconSchema.optional(),
  color: colorSchema.optional(),
})

/**
 * Campos devolvidos pela API.
 *
 * `_count` traz a quantidade de transacoes na mesma consulta. Contar em um
 * resolver de campo geraria uma consulta por categoria (problema N+1).
 */
const categorySelect = {
  id: true,
  title: true,
  description: true,
  icon: true,
  color: true,
  _count: { select: { transactions: true } },
} as const

interface CategoryRow {
  id: string
  title: string
  description: string | null
  icon: string
  color: string
  _count: { transactions: number }
}

function toCategory(category: CategoryRow) {
  return {
    id: category.id,
    title: category.title,
    description: category.description,
    icon: category.icon,
    color: category.color,
    transactionsCount: category._count.transactions,
  }
}

export async function listCategories(prisma: PrismaClient, userId: string) {
  const categories = await prisma.category.findMany({
    where: { userId },
    orderBy: { title: 'asc' },
    select: categorySelect,
  })

  return categories.map(toCategory)
}

export async function getCategory(
  prisma: PrismaClient,
  userId: string,
  id: string,
) {
  /**
   * `findFirst` com userId no filtro, e nao `findUnique` pelo id seguido de
   * conferencia: o dono faz parte do criterio de busca, entao nao existe
   * caminho no codigo que pule a verificacao.
   */
  const category = await prisma.category.findFirst({
    where: { id, userId },
    select: categorySelect,
  })

  if (!category) {
    throw notFound('Categoria não encontrada')
  }

  return toCategory(category)
}

export async function createCategory(
  prisma: PrismaClient,
  userId: string,
  input: unknown,
) {
  const parsed = createCategorySchema.safeParse(input)

  if (!parsed.success) {
    throw invalidInput('Dados inválidos', toFieldErrors(parsed.error))
  }

  try {
    const category = await prisma.category.create({
      // O userId vem da sessao, nunca do input: o cliente nao tem como
      // criar uma categoria no nome de outra pessoa.
      data: { ...parsed.data, userId },
      select: categorySelect,
    })

    return toCategory(category)
  } catch (error) {
    if (isPrismaError(error, 'P2002')) {
      throw conflict('Você já possui uma categoria com esse título')
    }

    throw error
  }
}

export async function updateCategory(
  prisma: PrismaClient,
  userId: string,
  input: unknown,
) {
  const parsed = updateCategorySchema.safeParse(input)

  if (!parsed.success) {
    throw invalidInput('Dados inválidos', toFieldErrors(parsed.error))
  }

  const { id, ...changes } = parsed.data

  if (!Object.values(changes).some((value) => value !== undefined)) {
    throw invalidInput('Informe ao menos um campo para atualizar')
  }

  try {
    /**
     * `updateMany` aceita filtro livre, entao o userId entra na mesma
     * instrucao SQL. `update` so aceita campo unico no where, o que obrigaria
     * a buscar antes e conferir depois — deixando uma janela entre as duas.
     */
    const result = await prisma.category.updateMany({
      where: { id, userId },
      data: changes,
    })

    if (result.count === 0) {
      throw notFound('Categoria não encontrada')
    }
  } catch (error) {
    if (isPrismaError(error, 'P2002')) {
      throw conflict('Você já possui uma categoria com esse título')
    }

    throw error
  }

  return getCategory(prisma, userId, id)
}

export async function deleteCategory(
  prisma: PrismaClient,
  userId: string,
  id: unknown,
) {
  const parsed = idSchema.safeParse(id)

  // Id malformado recebe a mesma resposta de id inexistente: nao ha motivo
  // para distinguir os dois casos para quem chama.
  if (!parsed.success) {
    throw notFound('Categoria não encontrada')
  }

  try {
    const result = await prisma.category.deleteMany({
      where: { id: parsed.data, userId },
    })

    if (result.count === 0) {
      throw notFound('Categoria não encontrada')
    }

    return true
  } catch (error) {
    // O onDelete: Restrict definido no schema se manifesta aqui.
    if (isPrismaError(error, 'P2003')) {
      throw conflict('Esta categoria possui transações e não pode ser excluída')
    }

    throw error
  }
}
