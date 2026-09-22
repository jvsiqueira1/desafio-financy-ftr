import { Eye, EyeClosed, Lock } from 'lucide-react'
import { type ComponentProps, useState } from 'react'

import type { Input } from '@/components/ui/input'

import { IconInput } from './icon-input'

type PasswordInputProps = Omit<ComponentProps<typeof Input>, 'type'>

export function PasswordInput(props: PasswordInputProps) {
  const [visivel, setVisivel] = useState(false)
  const Icone = visivel ? Eye : EyeClosed

  return (
    <IconInput
      {...props}
      icon={Lock}
      trailing={
        <button
          aria-label={visivel ? 'Ocultar senha' : 'Mostrar senha'}
          aria-pressed={visivel}
          className="text-gray-700 transition-colors hover:text-foreground"
          onClick={() => setVisivel((atual) => !atual)}
          // Dentro de um <form>, todo botao e "submit" por padrao: sem isto,
          // mostrar a senha enviaria o formulario.
          type="button"
        >
          <Icone aria-hidden className="size-4" />
        </button>
      }
      type={visivel ? 'text' : 'password'}
    />
  )
}
