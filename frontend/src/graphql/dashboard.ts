import { gql, type TypedDocumentNode } from '@apollo/client'

import { CATEGORY_FIELDS, type Category } from './categories'

export interface CategorySpending {
  category: Category
  totalAmountInCents: number
}

export interface DashboardSummary {
  balanceInCents: number
  monthIncomeInCents: number
  monthExpenseInCents: number
  categories: CategorySpending[]
}

export const DASHBOARD_QUERY: TypedDocumentNode<
  { dashboardSummary: DashboardSummary },
  { month: number; year: number }
> = gql`
  query Dashboard($month: Int!, $year: Int!) {
    dashboardSummary(month: $month, year: $year) {
      balanceInCents
      monthIncomeInCents
      monthExpenseInCents
      categories {
        totalAmountInCents
        category {
          ...CategoryFields
        }
      }
    }
  }
  ${CATEGORY_FIELDS}
`
