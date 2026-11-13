import { describe, expect, it } from 'vitest'

import { createUser, errorCode, execute } from './helpers.js'

const SIGN_UP = `
  mutation ($input: SignUpInput!) {
    signUp(input: $input) { token user { id name email } }
  }
`

const SIGN_IN = `
  mutation ($input: SignInInput!) {
    signIn(input: $input) { token user { email } }
  }
`

const ME = '{ me { id name email } }'

describe('cadastro', () => {
  it('cria a conta, normaliza o e-mail e ja devolve uma sessao valida', async () => {
    const result = await execute<{
      signUp: { token: string; user: { name: string; email: string } }
    }>(SIGN_UP, {
      input: {
        name: 'Ana Souza',
        email: '  Ana@Exemplo.COM ',
        password: 'senha-forte-123',
      },
    })

    expect(result.errors).toBeUndefined()
    expect(result.data?.signUp.user).toMatchObject({
      name: 'Ana Souza',
      email: 'ana@exemplo.com',
    })

    const me = await execute(ME, {}, result.data?.signUp.token)
    expect(me.data).toMatchObject({ me: { email: 'ana@exemplo.com' } })
  })

  it('recusa e-mail ja cadastrado', async () => {
    const { email } = await createUser()

    const result = await execute(SIGN_UP, {
      input: { name: 'Outra Pessoa', email, password: 'senha-forte-123' },
    })

    expect(errorCode(result)).toBe('CONFLICT')
  })

  it('valida os campos e informa o erro de cada um', async () => {
    const result = await execute(SIGN_UP, {
      input: { name: 'Al', email: 'nao-e-email', password: 'curta' },
    })

    expect(errorCode(result)).toBe('BAD_USER_INPUT')
    expect(result.errors?.[0]?.extensions?.fields).toMatchObject({
      name: expect.any(Array),
      email: expect.any(Array),
      password: expect.any(Array),
    })
  })
})

describe('login', () => {
  it('autentica com as credenciais corretas', async () => {
    const { email, password } = await createUser()

    const result = await execute<{ signIn: { token: string } }>(SIGN_IN, {
      input: { email: email.toUpperCase(), password },
    })

    expect(result.errors).toBeUndefined()
    expect(result.data?.signIn.token).toEqual(expect.any(String))
  })

  it('responde igual para senha errada e e-mail inexistente', async () => {
    const { email } = await createUser()

    const senhaErrada = await execute(SIGN_IN, {
      input: { email, password: 'senha-errada-000' },
    })
    const emailInexistente = await execute(SIGN_IN, {
      input: { email: 'ninguem@teste.com', password: 'senha-errada-000' },
    })

    expect(errorCode(senhaErrada)).toBe('INVALID_CREDENTIALS')
    expect(emailInexistente.errors).toEqual(senhaErrada.errors)
  })
})

describe('sessao', () => {
  it('recusa operacoes protegidas sem token', async () => {
    expect(errorCode(await execute(ME))).toBe('UNAUTHENTICATED')
  })

  it('recusa token adulterado', async () => {
    const { token } = await createUser()
    const adulterado = `${token.slice(0, -2)}xx`

    expect(errorCode(await execute(ME, {}, adulterado))).toBe('UNAUTHENTICATED')
  })
})
