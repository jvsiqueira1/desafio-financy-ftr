import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description: string
  action?: ReactNode
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-6">
      <div className="space-y-0.5">
        <h1 className="font-bold text-2xl text-foreground">{title}</h1>
        <p className="text-base text-muted-foreground">{description}</p>
      </div>

      {action}
    </header>
  )
}
