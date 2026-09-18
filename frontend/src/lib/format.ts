const formatadorMoeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

/**
 * A data da transacao e gravada a meia-noite UTC.
 *
 * Sem `timeZone: 'UTC'`, o navegador converteria para o fuso local — e no
 * Brasil (UTC-3) uma transacao de 30/11 apareceria como 29/11. E o tipo de
 * bug que passa despercebido ate alguem conferir o extrato.
 */
const formatadorData = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
  timeZone: 'UTC',
})

/** Converte centavos em moeda: 12345 -> "R$ 123,45". */
export function formatCurrency(amountInCents: number): string {
  return formatadorMoeda.format(amountInCents / 100)
}

/** Acrescenta o sinal conforme a natureza: "+ R$ 4.250,00" ou "- R$ 89,50". */
export function formatSignedCurrency(
  amountInCents: number,
  type: 'INCOME' | 'EXPENSE',
): string {
  const sinal = type === 'INCOME' ? '+' : '-'

  return `${sinal} ${formatCurrency(amountInCents)}`
}

/** Converte a data ISO da API em "30/11/25". */
export function formatDate(isoDate: string): string {
  return formatadorData.format(new Date(isoDate))
}

/**
 * Le o que o usuario digitou e devolve centavos.
 *
 * Considera apenas os digitos: "R$ 1.234,56" e "123456" chegam ao mesmo
 * resultado. Assim o campo aceita colar valor formatado sem quebrar.
 */
export function parseCurrencyToCents(valor: string): number {
  const digitos = valor.replace(/\D/g, '')

  if (!digitos) {
    return 0
  }

  return Number.parseInt(digitos, 10)
}

/** Formata centavos para exibicao dentro do campo: 12345 -> "1.234,56". */
export function formatCentsForInput(amountInCents: number): string {
  return (amountInCents / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/** Iniciais usadas no avatar: "Conta teste" -> "CT". */
export function getInitials(name: string): string {
  const partes = name.trim().split(/\s+/).filter(Boolean)

  if (partes.length === 0) {
    return ''
  }

  const primeira = partes[0]?.charAt(0) ?? ''
  const ultima = partes.length > 1 ? (partes.at(-1)?.charAt(0) ?? '') : ''

  return (primeira + ultima).toUpperCase()
}

/** "0 itens", "1 item", "12 itens". */
export function formatItemCount(total: number): string {
  return total === 1 ? '1 item' : `${total} itens`
}
