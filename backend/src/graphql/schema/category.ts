export const categoryTypeDefs = `#graphql
  """Categoria usada para classificar transacoes. Pertence a um unico usuario."""
  type Category {
    id: ID!
    title: String!
    description: String
    icon: String!
    color: String!
    """Quantas transacoes usam esta categoria. Exibido como "N itens"."""
    transactionsCount: Int!
  }

  input CreateCategoryInput {
    title: String!
    description: String
    """Identificador do icone, em minusculas."""
    icon: String!
    """Valor hexadecimal, restrito a paleta do Style Guide."""
    color: String!
  }

  input UpdateCategoryInput {
    id: ID!
    title: String
    description: String
    icon: String
    color: String
  }

  extend type Query {
    """Categorias do usuario autenticado, em ordem alfabetica."""
    categories: [Category!]!

    """Uma categoria do usuario autenticado."""
    category(id: ID!): Category!
  }

  extend type Mutation {
    createCategory(input: CreateCategoryInput!): Category!
    updateCategory(input: UpdateCategoryInput!): Category!

    """Falha se a categoria possuir transacoes."""
    deleteCategory(id: ID!): Boolean!
  }
`
