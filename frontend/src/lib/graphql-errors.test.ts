import { CombinedGraphQLErrors } from '@apollo/client'
import { describe, expect, it } from 'vitest'

import { toApiError } from './graphql-errors'

describe('toApiError', () => {
  it('extrai codigo, mensagem e erros por campo do GraphQL', () => {
    const erro = new CombinedGraphQLErrors({
      errors: [
        {
          message: 'Dados inválidos',
          extensions: {
            code: 'BAD_USER_INPUT',
            fields: { title: ['Informe o título'] },
          },
        },
      ],
    })

    expect(toApiError(erro)).toEqual({
      code: 'BAD_USER_INPUT',
      message: 'Dados inválidos',
      fields: { title: ['Informe o título'] },
    })
  })

  it('usa a mensagem de erros comuns, como falha de rede', () => {
    expect(toApiError(new Error('Failed to fetch'))).toEqual({
      message: 'Failed to fetch',
    })
  })

  it('tem uma mensagem padrao para o que nao e Error', () => {
    expect(toApiError('???').message).toBe(
      'Não foi possível concluir a operação',
    )
  })
})
