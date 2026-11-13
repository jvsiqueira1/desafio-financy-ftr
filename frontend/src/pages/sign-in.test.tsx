import { CombinedGraphQLErrors } from '@apollo/client'
import type { MockLink } from '@apollo/client/testing'
import { MockedProvider } from '@apollo/client/testing/react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { AuthProvider } from '@/features/auth/auth-provider'
import { useAuth } from '@/features/auth/use-auth'
import { SIGN_IN_MUTATION } from '@/graphql/session'

import { SignInPage } from './sign-in'

const CREDENCIAIS = { email: 'ana@exemplo.com', password: 'senha-forte-123' }

const loginAceito: MockLink.MockedResponse = {
  request: { query: SIGN_IN_MUTATION, variables: { input: CREDENCIAIS } },
  result: {
    data: {
      signIn: {
        __typename: 'AuthPayload',
        token: 'token-de-teste',
        user: {
          __typename: 'User',
          id: '1',
          name: 'Ana Souza',
          email: CREDENCIAIS.email,
        },
      },
    },
  },
}

const loginRecusado: MockLink.MockedResponse = {
  request: { query: SIGN_IN_MUTATION, variables: { input: CREDENCIAIS } },
  error: new CombinedGraphQLErrors({
    errors: [
      {
        message: 'E-mail ou senha inválidos',
        extensions: { code: 'INVALID_CREDENTIALS' },
      },
    ],
  }),
}

/** Exibe quem esta logado, para o teste observar a sessao pela interface. */
function UsuarioDaSessao() {
  const { user } = useAuth()
  return <p data-testid="sessao">{user?.name ?? 'deslogado'}</p>
}

function renderizar(mocks: MockLink.MockedResponse[]) {
  render(
    <MockedProvider mocks={mocks}>
      <MemoryRouter>
        <AuthProvider>
          <SignInPage />
          <UsuarioDaSessao />
        </AuthProvider>
      </MemoryRouter>
    </MockedProvider>,
  )
}

async function preencherEEnviar(lembrar = false) {
  const usuario = userEvent.setup()

  await usuario.type(screen.getByLabelText('E-mail'), CREDENCIAIS.email)
  await usuario.type(screen.getByLabelText('Senha'), CREDENCIAIS.password)

  if (lembrar) {
    await usuario.click(screen.getByRole('checkbox', { name: 'Lembrar-me' }))
  }

  await usuario.click(screen.getByRole('button', { name: 'Entrar' }))
}

describe('login', () => {
  it('valida os campos antes de chamar a API', async () => {
    renderizar([])

    await userEvent
      .setup()
      .click(screen.getByRole('button', { name: 'Entrar' }))

    expect(
      await screen.findByText('Informe um e-mail válido'),
    ).toBeInTheDocument()
    expect(screen.getByText('Informe sua senha')).toBeInTheDocument()
  })

  it('abre a sessao e guarda o token apenas na aba', async () => {
    renderizar([loginAceito])

    await preencherEEnviar()

    expect(await screen.findByText('Ana Souza')).toBeInTheDocument()
    expect(sessionStorage.getItem('financy:token')).toBe('token-de-teste')
    expect(localStorage.getItem('financy:token')).toBeNull()
  })

  it('com "lembrar-me", o token sobrevive ao fechar o navegador', async () => {
    renderizar([loginAceito])

    await preencherEEnviar(true)

    expect(await screen.findByText('Ana Souza')).toBeInTheDocument()
    expect(localStorage.getItem('financy:token')).toBe('token-de-teste')
  })

  it('exibe o erro da API e continua deslogado', async () => {
    renderizar([loginRecusado])

    await preencherEEnviar()

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'E-mail ou senha inválidos',
    )
    expect(screen.getByTestId('sessao')).toHaveTextContent('deslogado')
    expect(sessionStorage.getItem('financy:token')).toBeNull()
  })
})
