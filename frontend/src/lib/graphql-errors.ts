import { CombinedGraphQLErrors } from '@apollo/client'

export interface ApiError {
  /** Codigo definido pelo back-end: CONFLICT, BAD_USER_INPUT, NOT_FOUND... */
  code?: string
  message: string
  /** Erros por campo, quando a falha e de validacao. */
  fields?: Record<string, string[]>
}

/**
 * Normaliza o que o Apollo lanca em um formato unico.
 *
 * Erros de GraphQL chegam agrupados em CombinedGraphQLErrors; falhas de rede
 * chegam como Error comum. Quem chama nao deveria precisar saber a diferenca.
 */
export function toApiError(error: unknown): ApiError {
  if (CombinedGraphQLErrors.is(error)) {
    const primeiro = error.errors[0]
    const extensions = primeiro?.extensions ?? {}

    return {
      code: typeof extensions.code === 'string' ? extensions.code : undefined,
      message: primeiro?.message ?? 'Erro inesperado',
      fields: extensions.fields as Record<string, string[]> | undefined,
    }
  }

  if (error instanceof Error) {
    return { message: error.message }
  }

  return { message: 'Não foi possível concluir a operação' }
}
