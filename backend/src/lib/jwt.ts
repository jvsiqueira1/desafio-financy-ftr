import jwt, { type SignOptions } from 'jsonwebtoken'

import { env } from './env.js'

/**
 * Emite um token para o usuario informado.
 *
 * O id vai na claim padrao `sub` (subject), que significa "de quem e este
 * token". Nada alem disso entra no payload: as duas primeiras partes de um JWT
 * sao apenas Base64, legiveis por qualquer um que tenha o token. A assinatura
 * garante integridade, nao sigilo.
 */
export function signToken(userId: string): string {
  return jwt.sign({}, env.JWT_SECRET, {
    subject: userId,
    // A tipagem da biblioteca espera um literal ('7d', '15m'...), e o valor vem
    // de variavel de ambiente, que e string generica. A conversao apenas
    // reconcilia isso; o formato ja foi validado ao carregar o ambiente.
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  })
}

/**
 * Valida a assinatura e a expiracao do token.
 *
 * Retorna o id do usuario, ou null se o token for invalido, expirado ou
 * assinado com outra chave. Nao lanca: quem chama decide o que fazer com a
 * ausencia de usuario.
 */
export function verifyToken(token: string): string | null {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET)

    if (typeof payload === 'string' || !payload.sub) {
      return null
    }

    return payload.sub
  } catch {
    // Assinatura invalida, token expirado ou malformado: tudo resulta em
    // "sem usuario autenticado".
    return null
  }
}
