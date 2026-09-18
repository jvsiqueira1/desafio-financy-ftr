import { CircleArrowDown, CircleArrowUp } from 'lucide-react'
import type { UseFormRegisterReturn } from 'react-hook-form'

import type { TransactionType } from '@/graphql/transactions'
import { cn } from '@/lib/utils'

const OPCOES = [
  {
    value: 'EXPENSE',
    label: 'Despesa',
    icon: CircleArrowDown,
    borda: 'border-category-red',
    icone: 'text-category-red',
  },
  {
    value: 'INCOME',
    label: 'Receita',
    icon: CircleArrowUp,
    borda: 'border-category-green',
    icone: 'text-category-green',
  },
] as const

interface TransactionTypeToggleProps {
  registration: UseFormRegisterReturn
  /** Valor atual, para destacar a opcao escolhida na cor dela. */
  value: TransactionType
}

/**
 * Escolha entre despesa e receita.
 *
 * Os radios nativos continuam sendo a fonte da verdade (teclado e leitor de
 * tela funcionam sem codigo extra); o destaque visual le o valor atual porque
 * cada opcao tem uma cor propria.
 */
export function TransactionTypeToggle({
  registration,
  value,
}: TransactionTypeToggleProps) {
  return (
    <fieldset className="flex rounded-xl border border-border p-2">
      <legend className="sr-only">Tipo da transação</legend>

      {OPCOES.map((opcao) => {
        const selecionada = value === opcao.value
        const Icone = opcao.icon

        return (
          <label className="flex-1 cursor-pointer" key={opcao.value}>
            <input
              className="peer sr-only"
              type="radio"
              value={opcao.value}
              {...registration}
            />
            <span
              className={cn(
                'flex items-center justify-center gap-3 rounded-lg border px-3 py-3.5 text-base leading-4.5 transition-colors peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50',
                selecionada
                  ? cn('bg-muted font-medium text-foreground', opcao.borda)
                  : 'border-transparent text-muted-foreground hover:bg-accent',
              )}
            >
              <Icone
                aria-hidden
                className={cn(
                  'size-4',
                  selecionada ? opcao.icone : 'text-gray-400',
                )}
              />
              {opcao.label}
            </span>
          </label>
        )
      })}
    </fieldset>
  )
}
