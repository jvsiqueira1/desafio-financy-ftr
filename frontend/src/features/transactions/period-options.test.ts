import { describe, expect, it } from 'vitest'

import { buildPeriodOptions, parsePeriod } from './period-options'

describe('buildPeriodOptions', () => {
  it('lista os meses do atual para tras, atravessando a virada do ano', () => {
    const opcoes = buildPeriodOptions(new Date(Date.UTC(2026, 1, 15)), 3)

    expect(opcoes).toEqual([
      { value: '2026-02', label: 'Fevereiro / 2026' },
      { value: '2026-01', label: 'Janeiro / 2026' },
      { value: '2025-12', label: 'Dezembro / 2025' },
    ])
  })
})

describe('parsePeriod', () => {
  it('le o formato da URL', () => {
    expect(parsePeriod('2025-11')).toEqual({ month: 11, year: 2025 })
  })

  it('recusa valores invalidos', () => {
    expect(parsePeriod('2025-13')).toBeNull()
    expect(parsePeriod('2025-00')).toBeNull()
    expect(parsePeriod('nov/2025')).toBeNull()
    expect(parsePeriod('')).toBeNull()
  })
})
