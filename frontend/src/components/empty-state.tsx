import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
}

/** Exibido quando uma listagem nao tem nenhum registro. */
export function EmptyState({
  icon: Icone,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-muted">
        <Icone aria-hidden className="size-5 text-muted-foreground" />
      </span>

      <div className="space-y-1">
        <p className="font-medium text-base">{title}</p>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </div>

      {action}
    </div>
  )
}
