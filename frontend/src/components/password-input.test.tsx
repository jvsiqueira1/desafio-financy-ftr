import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { PasswordInput } from './password-input'

describe('PasswordInput', () => {
  it('alterna entre ocultar e mostrar a senha', async () => {
    const usuario = userEvent.setup()
    render(<PasswordInput aria-label="Senha" />)

    const campo = screen.getByLabelText('Senha')
    expect(campo).toHaveAttribute('type', 'password')

    const botao = screen.getByRole('button', { name: 'Mostrar senha' })
    await usuario.click(botao)

    expect(campo).toHaveAttribute('type', 'text')
    expect(botao).toHaveAccessibleName('Ocultar senha')
    expect(botao).toHaveAttribute('aria-pressed', 'true')
  })

  it('mostrar a senha nao envia o formulario', async () => {
    const usuario = userEvent.setup()
    const aoEnviar = vi.fn()

    render(
      <form
        onSubmit={(evento) => {
          evento.preventDefault()
          aoEnviar()
        }}
      >
        <PasswordInput aria-label="Senha" />
      </form>,
    )

    await usuario.click(screen.getByRole('button', { name: 'Mostrar senha' }))

    expect(aoEnviar).not.toHaveBeenCalled()
  })
})
