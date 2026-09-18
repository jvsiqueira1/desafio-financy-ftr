const MESES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

export interface PeriodOption {
  /** Formato da URL: "2025-11". */
  value: string
  /** Formato do layout: "Novembro / 2025". */
  label: string
}

/** Os ultimos `quantidade` meses, do atual para tras. */
export function buildPeriodOptions(
  referencia = new Date(),
  quantidade = 12,
): PeriodOption[] {
  const opcoes: PeriodOption[] = []

  for (let i = 0; i < quantidade; i++) {
    // Date.UTC normaliza meses negativos: mes -1 vira dezembro do ano anterior.
    const data = new Date(
      Date.UTC(referencia.getUTCFullYear(), referencia.getUTCMonth() - i, 1),
    )
    const ano = data.getUTCFullYear()
    const mes = data.getUTCMonth() + 1

    opcoes.push({
      value: `${ano}-${String(mes).padStart(2, '0')}`,
      label: `${MESES[mes - 1]} / ${ano}`,
    })
  }

  return opcoes
}

/** "2025-11" -> { month: 11, year: 2025 }. Valor invalido -> null. */
export function parsePeriod(
  valor: string,
): { month: number; year: number } | null {
  const encontrado = /^(\d{4})-(\d{2})$/.exec(valor)

  if (!encontrado) {
    return null
  }

  const year = Number(encontrado[1])
  const month = Number(encontrado[2])

  if (month < 1 || month > 12) {
    return null
  }

  return { month, year }
}
