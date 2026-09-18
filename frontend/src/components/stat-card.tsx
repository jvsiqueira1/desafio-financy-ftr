import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface StatCardProps {
  icon: LucideIcon
  iconClassName?: string
  value: ReactNode
  label: string
}

export function StatCard({
  icon: Icone,
  iconClassName,
  value,
  label,
}: StatCardProps) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-6">
      <span className="flex size-8 shrink-0 items-center justify-center">
        <Icone aria-hidden className={cn('size-6', iconClassName)} />
      </span>

      <div className="min-w-0 space-y-2">
        {/* 28px nao existe na escala do Tailwind (30px seria text-3xl): e o
            unico tamanho do layout que precisa de valor arbitrario. */}
        <p className="truncate font-bold text-[28px] text-foreground leading-8">
          {value}
        </p>
        <p className="font-medium text-gray-500 text-xs uppercase leading-4 tracking-[0.6px]">
          {label}
        </p>
      </div>
    </div>
  )
}
