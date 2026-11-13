import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'

import { CurrencyInput } from './currency-input'

/** O componente e controlado: o teste precisa guardar o valor em estado. */
function Campo({ inicial = 0 }: { inicial?: number }) {
  const [centavos, setCentavos] = useState(inicial)

  return (
    <>
      <CurrencyInput
        aria-label="Valor"
        onValueChange={setCentavos}
        value={centavos}
      />
      <output>{centavos}</output>
    </>
  )
}

describe('CurrencyInput', () => {
  it('preenche como caixa registradora, da direita para a esquerda', async () => {
    const usuario = userEvent.setup()
    render(<Campo />)

    const campo = screen.getByRole('textbox', { name: 'Valor' })
    await usuario.type(campo, '8950')

    expect(campo).toHaveValue('89,50')
    expect(screen.getByRole('status')).toHaveTextContent('8950')
  })

  it('apagar remove o ultimo digito', async () => {
    const usuario = userEvent.setup()
    render(<Campo inicial={8950} />)

    const campo = screen.getByRole('textbox', { name: 'Valor' })
    await usuario.type(campo, '{Backspace}')

    expect(campo).toHaveValue('8,95')
  })

  it('nao passa do limite aceito pela API', async () => {
    const usuario = userEvent.setup()
    render(<Campo />)

    await usuario.type(
      screen.getByRole('textbox', { name: 'Valor' }),
      '99999999999',
    )

    expect(screen.getByRole('status')).toHaveTextContent('1000000000')
  })
})
