import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface AuthSwitchProps {
  question: string
  label: string
  to: string
  icon: LucideIcon
}

/** Divisor "ou" seguido do convite para a outra tela de acesso. */
export function AuthSwitch({
  question,
  label,
  to,
  icon: Icone,
}: AuthSwitchProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Separator className="flex-1 bg-input" />
        <span className="text-gray-500 text-sm leading-5">ou</span>
        <Separator className="flex-1 bg-input" />
      </div>

      <div className="space-y-4">
        <p className="text-center text-muted-foreground text-sm leading-5">
          {question}
        </p>

        {/* asChild faz o Button emprestar o estilo ao Link, em vez de envolver
            um <a> com um <button> — o que seria HTML invalido. */}
        <Button asChild className="w-full" variant="outline">
          <Link to={to}>
            <Icone aria-hidden className="size-4.5" />
            {label}
          </Link>
        </Button>
      </div>
    </div>
  )
}
