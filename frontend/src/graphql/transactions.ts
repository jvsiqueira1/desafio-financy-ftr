import { gql, type TypedDocumentNode } from '@apollo/client'

import { CATEGORY_FIELDS, type Category } from './categories'

export type TransactionType = 'INCOME' | 'EXPENSE'

export interface Transaction {
  id: string
  description: string
  amountInCents: number
  type: TransactionType
  /** ISO-8601 em UTC, vindo do scalar DateTime. */
  date: string
  category: Category
}

export interface TransactionFilters {
  search?: string
  type?: TransactionType
  categoryId?: string
  month?: number
  year?: number
}

export interface TransactionPage {
  items: Transaction[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/**
 * Campos de transacao. A categoria reaproveita o fragmento de categorias:
 * assim, editar uma categoria atualiza o chip em todas as linhas da tabela
 * pelo cache normalizado, sem nova consulta.
 */
export const TRANSACTION_FIELDS = gql`
  fragment TransactionFields on Transaction {
    id
    description
    amountInCents
    type
    date
    category {
      ...CategoryFields
    }
  }
  ${CATEGORY_FIELDS}
`

export interface TransactionsQueryData {
  transactions: TransactionPage
}

export interface TransactionsQueryVariables {
  filters?: TransactionFilters
  page?: number
  pageSize?: number
}

export const TRANSACTIONS_QUERY: TypedDocumentNode<
  TransactionsQueryData,
  TransactionsQueryVariables
> = gql`
  query Transactions(
    $filters: TransactionFiltersInput
    $page: Int
    $pageSize: Int
  ) {
    transactions(filters: $filters, page: $page, pageSize: $pageSize) {
      items {
        ...TransactionFields
      }
      total
      page
      pageSize
      totalPages
    }
  }
  ${TRANSACTION_FIELDS}
`

export interface TransactionInput {
  description: string
  amountInCents: number
  type: TransactionType
  /** ISO-8601 a meia-noite UTC. */
  date: string
  categoryId: string
}

export const CREATE_TRANSACTION_MUTATION: TypedDocumentNode<
  { createTransaction: Transaction },
  { input: TransactionInput }
> = gql`
  mutation CreateTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      ...TransactionFields
    }
  }
  ${TRANSACTION_FIELDS}
`

export const UPDATE_TRANSACTION_MUTATION: TypedDocumentNode<
  { updateTransaction: Transaction },
  { input: Partial<TransactionInput> & { id: string } }
> = gql`
  mutation UpdateTransaction($input: UpdateTransactionInput!) {
    updateTransaction(input: $input) {
      ...TransactionFields
    }
  }
  ${TRANSACTION_FIELDS}
`

export const DELETE_TRANSACTION_MUTATION: TypedDocumentNode<
  { deleteTransaction: boolean },
  { id: string }
> = gql`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id)
  }
`
