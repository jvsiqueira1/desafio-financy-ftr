export const dashboardTypeDefs = `#graphql
  """Quanto foi movimentado em uma categoria, em todo o periodo."""
  type CategorySpending {
    category: Category!
    totalAmountInCents: SafeInt!
  }

  type DashboardSummary {
    """Receitas menos despesas, considerando todas as transacoes."""
    balanceInCents: SafeInt!
    monthIncomeInCents: SafeInt!
    monthExpenseInCents: SafeInt!
    """As categorias com maior valor movimentado, da maior para a menor."""
    categories: [CategorySpending!]!
  }

  extend type Query {
    """
    Indicadores do dashboard. O mes e informado pelo cliente, que conhece o
    fuso horario do usuario.
    """
    dashboardSummary(month: Int!, year: Int!): DashboardSummary!
  }
`
