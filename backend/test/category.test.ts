import { describe, expect, it } from 'vitest'

import { createCategory, createUser, errorCode, execute } from './helpers.js'

const CATEGORIES = '{ categories { id title } }'

const UPDATE = `
  mutation ($input: UpdateCategoryInput!) {
    updateCategory(input: $input) { id title color }
  }
`

const DELETE = 'mutation ($id: ID!) { deleteCategory(id: $id) }'

const CREATE_TRANSACTION = `
  mutation ($input: CreateTransactionInput!) {
    createTransaction(input: $input) { id }
  }
`

interface CategoriesResult {
  categories: { title: string }[]
}

describe('categorias', () => {
  it('cria, lista em ordem alfabetica, edita e exclui', async () => {
    const { token } = await createUser()
    const mercado = await createCategory(token, 'Mercado')
    await createCategory(token, 'Aluguel')

    const lista = await execute<CategoriesResult>(CATEGORIES, {}, token)
    expect(lista.data?.categories.map((c) => c.title)).toEqual([
      'Aluguel',
      'Mercado',
    ])

    const editada = await execute(
      UPDATE,
      { input: { id: mercado, title: 'Supermercado', color: '#2563EB' } },
      token,
    )
    expect(editada.data).toMatchObject({
      updateCategory: { title: 'Supermercado', color: '#2563EB' },
    })

    const excluida = await execute(DELETE, { id: mercado }, token)
    expect(excluida.data).toEqual({ deleteCategory: true })
  })

  it('recusa titulo repetido para o mesmo usuario', async () => {
    const { token } = await createUser()
    await createCategory(token, 'Mercado')

    await expect(createCategory(token, 'Mercado')).rejects.toThrow(
      'Você já possui uma categoria com esse título',
    )
  })

  it('recusa cor fora da paleta', async () => {
    const { token } = await createUser()
    const id = await createCategory(token)

    const result = await execute(
      UPDATE,
      { input: { id, color: '#000000' } },
      token,
    )

    expect(errorCode(result)).toBe('BAD_USER_INPUT')
  })

  it('nao exclui categoria que possui transacoes', async () => {
    const { token } = await createUser()
    const categoryId = await createCategory(token)

    await execute(
      CREATE_TRANSACTION,
      {
        input: {
          description: 'Compra do mes',
          amountInCents: 25_000,
          type: 'EXPENSE',
          date: '2026-11-01T12:00:00.000Z',
          categoryId,
        },
      },
      token,
    )

    const result = await execute(DELETE, { id: categoryId }, token)
    expect(errorCode(result)).toBe('CONFLICT')
  })
})

describe('isolamento entre usuarios', () => {
  it('cada usuario lista apenas as proprias categorias', async () => {
    const ana = await createUser('Ana')
    const bruno = await createUser('Bruno')
    await createCategory(ana.token, 'Da Ana')
    await createCategory(bruno.token, 'Do Bruno')

    const lista = await execute<CategoriesResult>(CATEGORIES, {}, ana.token)

    expect(lista.data?.categories.map((c) => c.title)).toEqual(['Da Ana'])
  })

  it('nao permite ler, editar nem excluir categoria de outro usuario', async () => {
    const ana = await createUser('Ana')
    const bruno = await createUser('Bruno')
    const daAna = await createCategory(ana.token)

    const leitura = await execute(
      'query ($id: ID!) { category(id: $id) { id } }',
      { id: daAna },
      bruno.token,
    )
    const edicao = await execute(
      UPDATE,
      { input: { id: daAna, title: 'Invadida' } },
      bruno.token,
    )
    const exclusao = await execute(DELETE, { id: daAna }, bruno.token)

    // NOT_FOUND, e nao "sem permissao": nao confirma que o id existe.
    expect(errorCode(leitura)).toBe('NOT_FOUND')
    expect(errorCode(edicao)).toBe('NOT_FOUND')
    expect(errorCode(exclusao)).toBe('NOT_FOUND')

    const intacta = await execute<CategoriesResult>(CATEGORIES, {}, ana.token)
    expect(intacta.data?.categories).toEqual([
      expect.objectContaining({ title: 'Mercado' }),
    ])
  })
})
