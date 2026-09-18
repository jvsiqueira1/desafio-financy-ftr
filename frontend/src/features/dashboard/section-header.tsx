import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  title: string
  linkTo: string
  linkLabel: string
  className?: string
}

/** Cabecalho das secoes do dashboard: titulo a esquerda, atalho a direita. */
export function SectionHeader({
  title,
  linkTo,
  linkLabel,
  className,
}: SectionHeaderProps) {
  return (
    <header
      className={cn(
        'flex items-center justify-between border-border border-b px-6 py-5',
        className,
      )}
    >
      <h2 className="font-medium text-gray-500 text-xs uppercase leading-4 tracking-[0.6px]">
        {title}
      </h2>

      <Link
        className="flex items-center gap-1 font-medium text-primary text-sm leading-5 hover:underline"
        to={linkTo}
      >
        {linkLabel}
        <ChevronRight aria-hidden className="size-5" />
      </Link>
    </header>
  )
}
