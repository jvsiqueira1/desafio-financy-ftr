import type { ReactNode } from 'react'

import { Label } from '@/components/ui/label'

interface FormFieldProps {
  id: string
  label: string
  /** Orientacao exibida enquanto nao ha erro. */
  hint?: string
  error?: string
  children: ReactNode
}

/**
 * Rotulo, campo e mensagem, com o espacamento do layout.
 *
 * O erro ocupa o lugar da dica em vez de aparecer abaixo dela, para que o
 * formulario nao pule de altura quando a validacao falha.
 */
export function FormField({
  id,
  label,
  hint,
  error,
  children,
}: FormFieldProps) {
  const mensagem = error ?? hint

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>

      {children}

      {mensagem && (
        <p
          className={
            error
              ? 'text-destructive text-xs leading-4'
              : 'text-gray-500 text-xs leading-4'
          }
          role={error ? 'alert' : undefined}
        >
          {mensagem}
        </p>
      )}
    </div>
  )
}
