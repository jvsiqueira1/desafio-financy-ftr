import { CircleArrowDown, CircleArrowUp } from 'lucide-react'

import type { TransactionType } from '@/graphql/transactions'
import { cn } from '@/lib/utils'

const APARENCIA = {
  EXPENSE: {
    label: 'Saída',
    icon: CircleArrowDown,
    texto: 'text-category-red-strong',
    icone: 'text-category-red',
  },
  INCOME: {
    label: 'Entrada',
    icon: CircleArrowUp,
    texto: 'text-category-green-strong',
    icone: 'text-category-green',
  },
} as const

/** "Saida" em vermelho ou "Entrada" em verde, com a seta correspondente. */
export function TransactionTypeLabel({ type }: { type: TransactionType }) {
  const { label, icon: Icone, texto, icone } = APARENCIA[type]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 font-medium text-sm leading-5',
        texto,
      )}
    >
      <Icone aria-hidden className={cn('size-4', icone)} />
      {label}
    </span>
  )
}
