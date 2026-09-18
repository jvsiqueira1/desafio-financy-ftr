import type { UseFormRegisterReturn } from 'react-hook-form'

import {
  CATEGORY_ICON_LABELS,
  CATEGORY_ICON_NAMES,
  CATEGORY_ICONS,
} from '@/lib/category-appearance'

interface IconPickerProps {
  registration: UseFormRegisterReturn
  error?: string
}

/**
 * Escolha unica entre os 16 icones.
 *
 * Cada opcao e um <input type="radio"> escondido atras do visual. Isso da de
 * graca a navegacao pelas setas do teclado, o anuncio "3 de 16, selecionado"
 * no leitor de tela, e o `register` do React Hook Form sem Controller.
 */
export function IconPicker({ registration, error }: IconPickerProps) {
  return (
    <fieldset className="space-y-2">
      <legend className="mb-2 font-medium text-secondary-foreground text-sm leading-5">
        Ícone
      </legend>

      <div className="flex flex-wrap gap-2">
        {CATEGORY_ICON_NAMES.map((nome) => {
          const Icone = CATEGORY_ICONS[nome]

          return (
            <label
              className="cursor-pointer"
              key={nome}
              title={CATEGORY_ICON_LABELS[nome]}
            >
              <input
                className="peer sr-only"
                type="radio"
                value={nome}
                {...registration}
              />
              <span className="flex size-10.5 items-center justify-center rounded-lg border border-input text-gray-500 transition-colors hover:bg-accent peer-checked:border-primary peer-checked:bg-muted peer-checked:text-foreground peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50">
                <Icone aria-hidden className="size-5" />
              </span>
              <span className="sr-only">{CATEGORY_ICON_LABELS[nome]}</span>
            </label>
          )
        })}
      </div>

      {error && (
        <p className="text-destructive text-xs leading-4" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  )
}
