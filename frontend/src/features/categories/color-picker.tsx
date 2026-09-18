import type { UseFormRegisterReturn } from 'react-hook-form'

import { CATEGORY_COLORS } from '@/lib/category-appearance'
import { cn } from '@/lib/utils'

interface ColorPickerProps {
  registration: UseFormRegisterReturn
  error?: string
}

/** Escolha unica entre as sete cores, pelo mesmo mecanismo do seletor de icone. */
export function ColorPicker({ registration, error }: ColorPickerProps) {
  return (
    <fieldset className="space-y-2">
      <legend className="mb-2 font-medium text-secondary-foreground text-sm leading-5">
        Cor
      </legend>

      <div className="flex gap-2">
        {CATEGORY_COLORS.map((cor) => (
          <label
            className="flex-1 cursor-pointer"
            key={cor.value}
            title={cor.label}
          >
            <input
              className="peer sr-only"
              type="radio"
              value={cor.value}
              {...registration}
            />
            <span className="flex rounded-lg border border-input p-1.25 transition-colors hover:bg-accent peer-checked:border-primary peer-checked:bg-muted peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50">
              <span className={cn('h-5 w-full rounded-sm', cor.swatch)} />
            </span>
            <span className="sr-only">{cor.label}</span>
          </label>
        ))}
      </div>

      {error && (
        <p className="text-destructive text-xs leading-4" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  )
}
