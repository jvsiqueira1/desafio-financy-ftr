import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PaginationProps {
  page: number
  totalPages: number
  total: number
  pageSize: number
  onPageChange: (page: number) => void
}

/**
 * No maximo cinco numeros visiveis, centralizados na pagina atual.
 * Com 40 paginas, mostrar todos os botoes seria inutilizavel.
 */
function janelaDePaginas(atual: number, total: number, tamanho = 5): number[] {
  const inicio = Math.max(
    1,
    Math.min(atual - Math.floor(tamanho / 2), total - tamanho + 1),
  )
  const fim = Math.min(total, inicio + tamanho - 1)

  return Array.from({ length: fim - inicio + 1 }, (_, i) => inicio + i)
}

export function Pagination({
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const primeiro = total === 0 ? 0 : (page - 1) * pageSize + 1
  const ultimo = Math.min(page * pageSize, total)

  return (
    <nav
      aria-label="Paginação"
      className="flex items-center justify-between px-6 py-5"
    >
      <p className="text-secondary-foreground text-sm leading-5">
        <span className="font-medium">{primeiro}</span> a{' '}
        <span className="font-medium">{ultimo}</span> |{' '}
        <span className="font-medium">{total}</span> resultados
      </p>

      <div className="flex items-center gap-2">
        <Button
          aria-label="Página anterior"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          size="icon"
          type="button"
          variant="outline"
        >
          <ChevronLeft aria-hidden />
        </Button>

        {janelaDePaginas(page, totalPages).map((numero) => {
          const atual = numero === page

          return (
            <Button
              aria-current={atual ? 'page' : undefined}
              aria-label={`Página ${numero}`}
              className={cn(!atual && 'text-secondary-foreground')}
              key={numero}
              onClick={() => onPageChange(numero)}
              size="icon"
              type="button"
              variant={atual ? 'default' : 'outline'}
            >
              {numero}
            </Button>
          )
        })}

        <Button
          aria-label="Próxima página"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          size="icon"
          type="button"
          variant="outline"
        >
          <ChevronRight aria-hidden />
        </Button>
      </div>
    </nav>
  )
}
