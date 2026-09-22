import { gql, type TypedDocumentNode } from '@apollo/client'

export interface Category {
  id: string
  title: string
  description: string | null
  icon: string
  color: string
  transactionsCount: number
}

export interface CategoryInput {
  title: string
  description: string | null
  icon: string
  color: string
}

/**
 * Campos de categoria, declarados uma unica vez.
 *
 * Toda operacao que devolve categoria usa este fragmento: assim o cache do
 * Apollo sempre recebe o objeto no mesmo formato, e acrescentar um campo
 * exige mudar um lugar so.
 */
export const CATEGORY_FIELDS = gql`
  fragment CategoryFields on Category {
    id
    title
    description
    icon
    color
    transactionsCount
  }
`

export interface CategoriesQueryData {
  categories: Category[]
}

export const CATEGORIES_QUERY: TypedDocumentNode<CategoriesQueryData> = gql`
  query Categories {
    categories {
      ...CategoryFields
    }
  }
  ${CATEGORY_FIELDS}
`

export interface CreateCategoryMutationData {
  createCategory: Category
}

export interface CreateCategoryMutationVariables {
  input: CategoryInput
}

export const CREATE_CATEGORY_MUTATION: TypedDocumentNode<
  CreateCategoryMutationData,
  CreateCategoryMutationVariables
> = gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      ...CategoryFields
    }
  }
  ${CATEGORY_FIELDS}
`

export interface UpdateCategoryMutationData {
  updateCategory: Category
}

/** Na edicao so o id e obrigatorio: os demais campos sao opcionais na API. */
export interface UpdateCategoryMutationVariables {
  input: Partial<CategoryInput> & { id: string }
}

export const UPDATE_CATEGORY_MUTATION: TypedDocumentNode<
  UpdateCategoryMutationData,
  UpdateCategoryMutationVariables
> = gql`
  mutation UpdateCategory($input: UpdateCategoryInput!) {
    updateCategory(input: $input) {
      ...CategoryFields
    }
  }
  ${CATEGORY_FIELDS}
`

export interface DeleteCategoryMutationData {
  deleteCategory: boolean
}

export interface DeleteCategoryMutationVariables {
  id: string
}

export const DELETE_CATEGORY_MUTATION: TypedDocumentNode<
  DeleteCategoryMutationData,
  DeleteCategoryMutationVariables
> = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`
