const TOKEN_KEY = 'financy:token'

/**
 * Persistencia do token de sessao.
 *
 * localStorage sobrevive ao fechamento da aba, o que permite continuar logado
 * ao reabrir a aplicacao. A contrapartida: qualquer script executado na pagina
 * consegue ler o token, entao uma falha de XSS o expoe.
 *
 * A alternativa mais segura seria um cookie httpOnly, invisivel para o
 * JavaScript — mas ela exige que o back-end emita e leia o cookie, e traz o
 * problema de CSRF junto. Para o escopo deste projeto, o token no
 * localStorage e a escolha usual e consciente.
 */
export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function storeToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}
