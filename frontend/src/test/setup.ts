import '@testing-library/jest-dom/vitest'

import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

/**
 * O jsdom nao implementa ResizeObserver, e componentes do Radix (como o
 * Checkbox) o usam para medir elementos. Nos testes nada e medido de fato,
 * entao basta uma versao que nao faz nada.
 */
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
}

afterEach(() => {
  // Desmonta o que foi renderizado e zera o armazenamento: cada teste
  // comeca sem sessao, independente da ordem de execucao.
  cleanup()
  localStorage.clear()
  sessionStorage.clear()
})
