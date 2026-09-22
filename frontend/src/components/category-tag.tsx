import { getCategoryAppearance } from '@/lib/category-appearance'
import { cn } from '@/lib/utils'

interface CategoryTagProps {
  title: string
  color: string
  className?: string
}

/** Chip com o nome da categoria, em fundo claro e texto escuro da mesma cor. */
export function CategoryTag({ title, color, className }: CategoryTagProps) {
  const { soft, strong } = getCategoryAppearance(color)

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 font-medium text-sm leading-5',
        soft,
        strong,
        className,
      )}
    >
      {title}
    </span>
  )
}
