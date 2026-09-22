const TOKEN_KEY = 'financy:token'

/**
 * Persistencia do token de sessao.
 *
 * "Lembrar-me" decide onde o token mora:
 *   localStorage   - sobrevive ao fechamento do navegador
 *   sessionStorage - sobrevive a recarregar a pagina, some ao fechar a aba
 *
 * Nos dois casos o token fica acessivel a qualquer script da pagina, entao uma
 * falha de XSS o expoe. A alternativa mais segura seria um cookie httpOnly,
 * mas ela exigiria que o back-end emitisse e lesse o cookie, trazendo CSRF
 * junto.
 */
export function getStoredToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY) ?? localStorage.getItem(TOKEN_KEY)
}

export function storeToken(token: string, remember: boolean): void {
  // Limpa os dois antes de gravar: se o usuario entrar uma vez lembrando e
  // outra nao, nao pode sobrar um token antigo no outro armazenamento.
  clearStoredToken()

  const armazenamento = remember ? localStorage : sessionStorage
  armazenamento.setItem(TOKEN_KEY, token)
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(TOKEN_KEY)
}
