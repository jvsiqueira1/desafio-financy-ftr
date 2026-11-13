import { describe, expect, it } from 'vitest'

import { createCategory, createUser, errorCode, execute } from './helpers.js'

const CREATE = `
  mutation ($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      id description amountInCents type date
      category { id transactionsCount }
    }
  }
`

const UPDATE = `
  mutation ($input: UpdateTransactionInput!) {
    updateTransaction(input: $input) { id description amountInCents type }
  }
`

const DELETE = 'mutation ($id: ID!) { deleteTransaction(id: $id) }'

const LIST = `
  query ($filters: TransactionFiltersInput, $page: Int, $pageSize: Int) {
    transactions(filters: $filters, page: $page, pageSize: $pageSize) {
      items { description }
      total page pageSize totalPages
    }
  }
`

interface ListResult {
  transactions: {
    items: { description: string }[]
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

function transactionInput(
  categoryId: string,
  overrides: Record<string, unknown> = {},
) {
  return {
    description: 'Salario',
    amountInCents: 500_000,
    type: 'INCOME',
    date: '2026-11-05T12:00:00.000Z',
    categoryId,
    ...overrides,
  }
}

async function create(token: string, input: Record<string, unknown>) {
  const result = await execute<{ createTransaction: { id: string } }>(
    CREATE,
    { input },
    token,
  )

  if (!result.data) {
    throw new Error(`Falha ao criar transacao: ${result.errors?.[0]?.message}`)
  }

  return result.data.createTransaction.id
}

describe('transacoes', () => {
  it('cria com o valor em centavos e atualiza a contagem da categoria', async () => {
    const { token } = await createUser()
    const categoryId = await createCategory(token)

    const result = await execute(
      CREATE,
      { input: transactionInput(categoryId) },
      token,
    )

    expect(result.errors).toBeUndefined()
    expect(result.data).toMatchObject({
      createTransaction: {
        description: 'Salario',
        amountInCents: 500_000,
        type: 'INCOME',
        date: '2026-11-05T12:00:00.000Z',
        category: { id: categoryId, transactionsCount: 1 },
      },
    })
  })

  it('valida descricao e valor', async () => {
    const { token } = await createUser()
    const categoryId = await createCategory(token)

    const result = await execute(
      CREATE,
      {
        input: transactionInput(categoryId, {
          description: '   ',
          amountInCents: -10,
        }),
      },
      token,
    )

    expect(errorCode(result)).toBe('BAD_USER_INPUT')
    expect(result.errors?.[0]?.extensions?.fields).toMatchObject({
      description: expect.any(Array),
      amountInCents: expect.any(Array),
    })
  })

  it('edita apenas os campos enviados e exclui', async () => {
    const { token } = await createUser()
    const categoryId = await createCategory(token)
    const id = await create(token, transactionInput(categoryId))

    const editada = await execute(
      UPDATE,
      { input: { id, amountInCents: 650_000 } },
      token,
    )
    expect(editada.data).toMatchObject({
      updateTransaction: { description: 'Salario', amountInCents: 650_000 },
    })

    const excluida = await execute(DELETE, { id }, token)
    expect(excluida.data).toEqual({ deleteTransaction: true })

    const lista = await execute<ListResult>(LIST, {}, token)
    expect(lista.data?.transactions.total).toBe(0)
  })

  it('filtra por busca, tipo e periodo', async () => {
    const { token } = await createUser()
    const categoryId = await createCategory(token)

    await create(token, transactionInput(categoryId))
    await create(
      token,
      transactionInput(categoryId, {
        description: 'Aluguel',
        type: 'EXPENSE',
        amountInCents: 150_000,
      }),
    )
    await create(
      token,
      transactionInput(categoryId, {
        description: 'Salario de outubro',
        date: '2026-10-05T12:00:00.000Z',
      }),
    )

    const busca = await execute<ListResult>(
      LIST,
      { filters: { search: 'salario' } },
      token,
    )
    expect(busca.data?.transactions.total).toBe(2)

    const despesas = await execute<ListResult>(
      LIST,
      { filters: { type: 'EXPENSE' } },
      token,
    )
    expect(despesas.data?.transactions.items).toEqual([
      { description: 'Aluguel' },
    ])

    const novembro = await execute<ListResult>(
      LIST,
      { filters: { month: 11, year: 2026 } },
      token,
    )
    expect(novembro.data?.transactions.total).toBe(2)
  })

  it('pagina os resultados, mais recentes primeiro', async () => {
    const { token } = await createUser()
    const categoryId = await createCategory(token)

    for (let dia = 1; dia <= 5; dia++) {
      await create(
        token,
        transactionInput(categoryId, {
          description: `Dia ${dia}`,
          date: `2026-11-0${dia}T12:00:00.000Z`,
        }),
      )
    }

    const segunda = await execute<ListResult>(
      LIST,
      { page: 2, pageSize: 2 },
      token,
    )

    expect(segunda.data?.transactions).toEqual({
      items: [{ description: 'Dia 3' }, { description: 'Dia 2' }],
      total: 5,
      page: 2,
      pageSize: 2,
      totalPages: 3,
    })
  })
})

describe('isolamento entre usuarios', () => {
  it('nao permite criar transacao na categoria de outro usuario', async () => {
    const ana = await createUser('Ana')
    const bruno = await createUser('Bruno')
    const categoriaDaAna = await createCategory(ana.token)

    const result = await execute(
      CREATE,
      { input: transactionInput(categoriaDaAna) },
      bruno.token,
    )

    expect(errorCode(result)).toBe('NOT_FOUND')
  })

  it('nao permite mover a propria transacao para a categoria de outro', async () => {
    const ana = await createUser('Ana')
    const bruno = await createUser('Bruno')
    const categoriaDaAna = await createCategory(ana.token)
    const categoriaDoBruno = await createCategory(bruno.token)
    const id = await create(bruno.token, transactionInput(categoriaDoBruno))

    const result = await execute(
      UPDATE,
      { input: { id, categoryId: categoriaDaAna } },
      bruno.token,
    )

    expect(errorCode(result)).toBe('NOT_FOUND')
  })

  it('nao lista, edita nem exclui transacoes de outro usuario', async () => {
    const ana = await createUser('Ana')
    const bruno = await createUser('Bruno')
    const id = await create(
      ana.token,
      transactionInput(await createCategory(ana.token)),
    )

    const lista = await execute<ListResult>(LIST, {}, bruno.token)
    const edicao = await execute(
      UPDATE,
      { input: { id, description: 'Invadida' } },
      bruno.token,
    )
    const exclusao = await execute(DELETE, { id }, bruno.token)

    expect(lista.data?.transactions.total).toBe(0)
    expect(errorCode(edicao)).toBe('NOT_FOUND')
    expect(errorCode(exclusao)).toBe('NOT_FOUND')

    const daAna = await execute<ListResult>(LIST, {}, ana.token)
    expect(daAna.data?.transactions.items).toEqual([{ description: 'Salario' }])
  })
})
