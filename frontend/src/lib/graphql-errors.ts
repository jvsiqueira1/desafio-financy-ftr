import { CombinedGraphQLErrors, ServerError } from '@apollo/client'

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

  // Status HTTP fora de 2xx (ex: 429 do limitador de requisicoes). O corpo
  // segue o formato GraphQL, entao a mensagem amigavel do servidor e usada.
  if (ServerError.is(error)) {
    return fromServerError(error)
  }

  if (error instanceof Error) {
    return { message: error.message }
  }

  return { message: 'Não foi possível concluir a operação' }
}

function fromServerError(error: ServerError): ApiError {
  try {
    const body = JSON.parse(error.bodyText) as {
      errors?: { message?: string; extensions?: { code?: unknown } }[]
    }
    const primeiro = body.errors?.[0]

    if (primeiro?.message) {
      const code = primeiro.extensions?.code
      return {
        code: typeof code === 'string' ? code : undefined,
        message: primeiro.message,
      }
    }
  } catch {
    // Corpo nao e JSON: cai na mensagem generica abaixo.
  }

  return { message: 'O servidor recusou a requisição. Tente novamente.' }
}
