import { ApolloServer } from '@apollo/server'
import type { Request } from 'express'
import { afterAll, beforeEach } from 'vitest'

import { createContext, type GraphQLContext } from '../src/graphql/context.js'
import { resolvers } from '../src/graphql/resolvers/index.js'
import { typeDefs } from '../src/graphql/schema/index.js'
import { prisma } from '../src/lib/prisma.js'

/**
 * Mesmo schema e resolvers do servidor real, sem a camada HTTP. O contexto
 * e montado pelo createContext de verdade, entao o token percorre o mesmo
 * caminho de uma requisicao real.
 */
const server = new ApolloServer<GraphQLContext>({ typeDefs, resolvers })

export interface GraphQLResult<T> {
  data?: T | null
  errors?: readonly {
    message: string
    extensions?: Record<string, unknown>
  }[]
}

export async function execute<T = Record<string, unknown>>(
  query: string,
  variables: Record<string, unknown> = {},
  token?: string,
): Promise<GraphQLResult<T>> {
  const req = {
    headers: token ? { authorization: `Bearer ${token}` } : {},
  } as Request

  const response = await server.executeOperation<T>(
    { query, variables },
    { contextValue: await createContext({ req }) },
  )

  if (response.body.kind !== 'single') {
    throw new Error('Resposta incremental inesperada')
  }

  return response.body.singleResult as GraphQLResult<T>
}

/** Codigo do primeiro erro, ou undefined se a operacao deu certo. */
export function errorCode(result: GraphQLResult<unknown>) {
  return result.errors?.[0]?.extensions?.code
}

const SIGN_UP = `
  mutation ($input: SignUpInput!) {
    signUp(input: $input) { token user { id name email } }
  }
`

let sequence = 0

/** Cria um usuario novo e devolve o token da sessao. */
export async function createUser(name = 'Pessoa Teste') {
  sequence += 1
  const email = `pessoa${sequence}@teste.com`
  const password = 'senha-forte-123'

  const result = await execute<{
    signUp: { token: string; user: { id: string } }
  }>(SIGN_UP, { input: { name, email, password } })

  if (!result.data) {
    throw new Error(`Falha ao criar usuario: ${result.errors?.[0]?.message}`)
  }

  return { ...result.data.signUp, email, password }
}

const CREATE_CATEGORY = `
  mutation ($input: CreateCategoryInput!) {
    createCategory(input: $input) { id title transactionsCount }
  }
`

export async function createCategory(token: string, title = 'Mercado') {
  const result = await execute<{ createCategory: { id: string } }>(
    CREATE_CATEGORY,
    { input: { title, icon: 'shopping-cart', color: '#16A34A' } },
    token,
  )

  if (!result.data) {
    throw new Error(`Falha ao criar categoria: ${result.errors?.[0]?.message}`)
  }

  return result.data.createCategory.id
}

/** Cada teste comeca com o banco vazio e independe da ordem de execucao. */
beforeEach(async () => {
  await prisma.transaction.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()
})

afterAll(async () => {
  await prisma.$disconnect()
})
