import { useEffect, useState } from 'react'

/**
 * Devolve o valor recebido so depois que ele para de mudar por `delay` ms.
 *
 * Cada nova digitacao cancela o timer anterior no retorno do efeito. So o
 * ultimo valor sobrevive ate o fim da espera.
 */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [atrasado, setAtrasado] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setAtrasado(value), delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return atrasado
}
