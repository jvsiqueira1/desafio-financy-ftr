import type { ComponentProps } from 'react'

import { Input } from '@/components/ui/input'
import { formatCentsForInput, parseCurrencyToCents } from '@/lib/format'
import { cn } from '@/lib/utils'

/** O mesmo teto aceito pela API: R$ 10.000.000,00. */
const LIMITE_EM_CENTAVOS = 1_000_000_000

interface CurrencyInputProps
  extends Omit<
    ComponentProps<typeof Input>,
    'value' | 'onChange' | 'type' | 'inputMode'
  > {
  /** Valor em centavos. */
  value: number
  onValueChange: (centavos: number) => void
}

/**
 * Entrada de valor no estilo caixa registradora.
 *
 * O estado e sempre em centavos; o campo apenas o exibe formatado. Cada tecla
 * recalcula a partir de todos os digitos: "8", "9", "5", "0" resulta em
 * 0,08 -> 0,89 -> 8,95 -> 89,50. Nao ha virgula para o usuario errar.
 */
export function CurrencyInput({
  value,
  onValueChange,
  className,
  ...props
}: CurrencyInputProps) {
  return (
    <div className="relative">
      <span
        aria-hidden
        className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3.25 font-medium text-foreground text-sm"
      >
        R$
      </span>
      <Input
        {...props}
        className={cn('pl-11', className)}
        // Teclado numerico no celular.
        inputMode="numeric"
        onChange={(evento) =>
          onValueChange(
            Math.min(
              parseCurrencyToCents(evento.target.value),
              LIMITE_EM_CENTAVOS,
            ),
          )
        }
        value={formatCentsForInput(value)}
      />
    </div>
  )
}
