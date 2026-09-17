type Listener = () => void

const listeners = new Set<Listener>()

/**
 * Ponte entre a camada de rede e a aplicacao.
 *
 * Um link do Apollo vive fora da arvore do React e nao pode usar hooks. Quando
 * ele detecta que o token foi recusado, emite este evento; o provedor de
 * autenticacao esta inscrito e encerra a sessao.
 *
 * Retorna a funcao de cancelamento, no formato que o useEffect espera.
 */
export function onSessionExpired(listener: Listener): () => void {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

export function emitSessionExpired(): void {
  for (const listener of listeners) {
    listener()
  }
}
