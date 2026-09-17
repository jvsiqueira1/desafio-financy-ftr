export const transactionTypeDefs = `#graphql
  """Natureza da transacao: entrada ou saida de dinheiro."""
  enum TransactionType {
    INCOME
    EXPENSE
  }

  """Lancamento financeiro. Pertence a um unico usuario e a uma categoria dele."""
  type Transaction {
    id: ID!
    description: String!
    """Valor em CENTAVOS. R$ 123,45 trafega como 12345."""
    amountInCents: Int!
    type: TransactionType!
    date: DateTime!
    category: Category!
  }

  """Uma pagina de resultados, com o total para montar a paginacao."""
  type TransactionPage {
    items: [Transaction!]!
    total: Int!
    page: Int!
    pageSize: Int!
    totalPages: Int!
  }

  input TransactionFiltersInput {
    """Busca por trecho da descricao."""
    search: String
    type: TransactionType
    categoryId: ID
    """Mes de 1 a 12. Deve ser informado junto com o ano."""
    month: Int
    """Ano com quatro digitos. Deve ser informado junto com o mes."""
    year: Int
  }

  input CreateTransactionInput {
    description: String!
    """Valor em centavos, inteiro e positivo."""
    amountInCents: Int!
    type: TransactionType!
    date: DateTime!
    categoryId: ID!
  }

  input UpdateTransactionInput {
    id: ID!
    description: String
    amountInCents: Int
    type: TransactionType
    date: DateTime
    categoryId: ID
  }

  extend type Query {
    """Transacoes do usuario autenticado, das mais recentes para as mais antigas."""
    transactions(
      filters: TransactionFiltersInput
      page: Int = 1
      pageSize: Int = 10
    ): TransactionPage!

    """Uma transacao do usuario autenticado."""
    transaction(id: ID!): Transaction!
  }

  extend type Mutation {
    createTransaction(input: CreateTransactionInput!): Transaction!
    updateTransaction(input: UpdateTransactionInput!): Transaction!
    deleteTransaction(id: ID!): Boolean!
  }
`
