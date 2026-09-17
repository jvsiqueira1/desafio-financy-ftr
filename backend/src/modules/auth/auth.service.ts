import type { PrismaClient } from '@prisma/client'
import argon2 from 'argon2'
import { z } from 'zod'
import { conflict, invalidCredentials, invalidInput } from '../../lib/errors.js'
import { signToken } from '../../lib/jwt.js'
import { isPrismaError } from '../../lib/prisma-error.js'
import { toFieldErrors } from '../../lib/validations.js'

/**
 * Hash valido de uma senha que ninguem conhece.
 *
 * Usado quando o login falha por e-mail inexistente: verificar contra ele faz
 * a requisicao gastar o mesmo tempo de um e-mail que existe. Sem isso, uma
 * resposta rapida significaria "esse e-mail nao esta cadastrado", permitindo
 * enumerar usuarios pelo cronometro.
 */
const DUMMY_HASH =
  '$argon2id$v=19$m=65536,p=4,t=3$KBA2gMymxL0IKRP8tiCITQ$I0+5jbKLZrbF5T97Gx14W80MpawdzcbNKmgKlpFFPwg'

/** Normaliza antes de validar: espacos nas pontas e caixa nao devem importar. */
const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email({ error: 'Informe um e-mail válido' }))

const signUpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'O nome deve ter no mínimo 3 caracteres')
    .max(120, 'O nome deve ter no máximo 120 caracteres'),
  email: emailSchema,
  password: z
    .string()
    .min(8, 'A senha deve ter no mínimo 8 caracteres')
    .max(72, 'A senha deve ter no máximo 72 caracteres'),
})

const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Informe a senha'),
})

export interface AuthenticatedUserData {
  id: string
  name: string
  email: string
}

export interface AuthResult {
  token: string
  user: AuthenticatedUserData
}

export async function signUp(
  prisma: PrismaClient,
  input: unknown,
): Promise<AuthResult> {
  const parsed = signUpSchema.safeParse(input)

  if (!parsed.success) {
    throw invalidInput('Dados inválidos', toFieldErrors(parsed.error))
  }

  const { name, email, password } = parsed.data

  const alreadyRegistered = await prisma.user.findUnique({ where: { email } })

  if (alreadyRegistered) {
    throw conflict('Este e-mail já está cadastrado')
  }

  // A senha nunca e armazenada: guardamos o hash, que e um caminho so.
  // O argon2 embute o salt no proprio hash, entao nao existe coluna separada.
  const passwordHash = await argon2.hash(password)

  try {
    const user = await prisma.user.create({
      data: { name, email, passwordHash },
      select: { id: true, name: true, email: true },
    })

    return { token: signToken(user.id), user }
  } catch (error) {
    if (isPrismaError(error, 'P2002')) {
      throw conflict('Este e-mail já está cadastrado')
    }

    throw error
  }
}

export async function signIn(
  prisma: PrismaClient,
  input: unknown,
): Promise<AuthResult> {
  const parsed = signInSchema.safeParse(input)

  if (!parsed.success) {
    throw invalidCredentials()
  }

  const { email, password } = parsed.data

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    // Gasta o mesmo tempo de uma verificacao real antes de recusar.
    await argon2.verify(DUMMY_HASH, password)
    throw invalidCredentials()
  }

  const passwordMatches = await argon2.verify(user.passwordHash, password)

  if (!passwordMatches) {
    throw invalidCredentials()
  }

  return {
    token: signToken(user.id),
    user: { id: user.id, name: user.name, email: user.email },
  }
}
