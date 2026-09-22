import { useState } from 'react'
import { ptBR } from 'react-day-picker/locale'

import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { toUtcDateOnly } from '@/lib/dates'
import { formatFullDate } from '@/lib/format'
import { cn } from '@/lib/utils'

interface DatePickerProps {
  id?: string
  value?: Date
  onChange: (data: Date) => void
  invalid?: boolean
  placeholder?: string
}

/** Campo com aparencia de input que abre um calendario em portugues. */
export function DatePicker({
  id,
  value,
  onChange,
  invalid,
  placeholder = 'Selecione',
}: DatePickerProps) {
  const [aberto, setAberto] = useState(false)

  return (
    <Popover onOpenChange={setAberto} open={aberto}>
      <PopoverTrigger asChild>
        <button
          aria-invalid={invalid}
          className={cn(
            'flex h-12 w-full items-center rounded-lg border border-input bg-card px-3.25 text-left text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive',
            value ? 'text-foreground' : 'text-gray-400',
          )}
          id={id}
          type="button"
        >
          {value ? formatFullDate(value.toISOString()) : placeholder}
        </button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          autoFocus
          defaultMonth={value}
          locale={ptBR}
          mode="single"
          onSelect={(dia) => {
            onChange(toUtcDateOnly(dia))
            setAberto(false)
          }}
          // Sem `required`, clicar no dia ja selecionado o desmarca.
          required
          selected={value}
          // A API grava a meia-noite UTC. Sem isto, em Cuiaba (UTC-4) uma
          // transacao do dia 30 apareceria selecionada no dia 29.
          timeZone="UTC"
        />
      </PopoverContent>
    </Popover>
  )
}
