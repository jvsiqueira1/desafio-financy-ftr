import { describe, expect, it } from 'vitest'

import {
  formatCentsForInput,
  formatCurrency,
  formatDate,
  formatItemCount,
  formatSignedCurrency,
  getInitials,
  parseCurrencyToCents,
} from './format'

// O Intl separa "R$" do valor com espaco nao separavel (U+00A0).
const normalizar = (texto: string) => texto.replace(/ /g, ' ')

describe('formatCurrency', () => {
  it('converte centavos em reais', () => {
    expect(normalizar(formatCurrency(123_456))).toBe('R$ 1.234,56')
    expect(normalizar(formatCurrency(5))).toBe('R$ 0,05')
  })

  it('acrescenta o sinal conforme o tipo', () => {
    expect(normalizar(formatSignedCurrency(8950, 'EXPENSE'))).toBe('- R$ 89,50')
    expect(normalizar(formatSignedCurrency(425_000, 'INCOME'))).toBe(
      '+ R$ 4.250,00',
    )
  })
})

describe('parseCurrencyToCents', () => {
  it('considera apenas os digitos', () => {
    expect(parseCurrencyToCents('R$ 1.234,56')).toBe(123_456)
    expect(parseCurrencyToCents('123456')).toBe(123_456)
  })

  it('devolve zero sem digitos', () => {
    expect(parseCurrencyToCents('')).toBe(0)
    expect(parseCurrencyToCents('abc')).toBe(0)
  })

  it('faz o caminho de volta do valor exibido no campo', () => {
    expect(parseCurrencyToCents(formatCentsForInput(98_765))).toBe(98_765)
  })
})

describe('formatDate', () => {
  it('nao desloca o dia pelo fuso horario local', () => {
    // Meia-noite UTC: no Brasil (UTC-3) ainda seria 29/11.
    expect(formatDate('2025-11-30T00:00:00.000Z')).toBe('30/11/25')
  })
})

describe('getInitials', () => {
  it('usa a primeira e a ultima palavra', () => {
    expect(getInitials('Conta teste')).toBe('CT')
    expect(getInitials('  ana maria souza ')).toBe('AS')
    expect(getInitials('Ana')).toBe('A')
    expect(getInitials('   ')).toBe('')
  })
})

describe('formatItemCount', () => {
  it('flexiona singular e plural', () => {
    expect(formatItemCount(0)).toBe('0 itens')
    expect(formatItemCount(1)).toBe('1 item')
    expect(formatItemCount(12)).toBe('12 itens')
  })
})
