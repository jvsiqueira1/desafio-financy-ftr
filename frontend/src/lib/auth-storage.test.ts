import { describe, expect, it } from 'vitest'

import { clearStoredToken, getStoredToken, storeToken } from './auth-storage'

describe('auth-storage', () => {
  it('"lembrar-me" grava no localStorage', () => {
    storeToken('token-a', true)

    expect(localStorage.getItem('financy:token')).toBe('token-a')
    expect(sessionStorage.getItem('financy:token')).toBeNull()
    expect(getStoredToken()).toBe('token-a')
  })

  it('sem "lembrar-me", grava so na sessao da aba', () => {
    storeToken('token-b', false)

    expect(sessionStorage.getItem('financy:token')).toBe('token-b')
    expect(localStorage.getItem('financy:token')).toBeNull()
  })

  it('um login novo nao deixa token antigo no outro armazenamento', () => {
    storeToken('antigo', true)
    storeToken('novo', false)

    expect(localStorage.getItem('financy:token')).toBeNull()
    expect(getStoredToken()).toBe('novo')
  })

  it('clearStoredToken encerra a sessao nos dois', () => {
    storeToken('token-c', true)
    clearStoredToken()

    expect(getStoredToken()).toBeNull()
  })
})
