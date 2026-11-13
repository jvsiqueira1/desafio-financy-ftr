import type { Request, RequestHandler } from 'express'
import { rateLimit } from 'express-rate-limit'
import helmet from 'helmet'

import { env } from './env.js'

const isProduction = env.NODE_ENV === 'production'

/**
 * Headers de seguranca (X-Content-Type-Options, X-Frame-Options,
 * Strict-Transport-Security, Referrer-Policy, entre outros).
 *
 * A API so devolve JSON, entao a CSP pode bloquear tudo em producao. Em
 * desenvolvimento ela fica desligada para que o Apollo Sandbox, servido em
 * GET /graphql e carregado de um CDN, continue funcionando.
 */
export const securityHeaders: RequestHandler = helmet({
  contentSecurityPolicy: isProduction
    ? {
        directives: {
          defaultSrc: ["'none'"],
          frameAncestors: ["'none'"],
        },
      }
    : false,
  crossOriginEmbedderPolicy: false,
})

/**
 * Limite geral por IP no endpoint GraphQL. Folgado o bastante para o uso
 * normal da interface, mas corta scripts que disparam requisicoes em loop.
 */
export const apiRateLimit: RequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: rateLimitResponse(
    'Muitas requisições. Aguarde alguns minutos e tente de novo.',
  ),
})

/** Detecta as mutations de autenticacao pelo nome do campo na query. */
const AUTH_FIELD = /\bsign(?:In|Up)\s*\(/

function isAuthOperation(request: Request): boolean {
  const query: unknown = request.body?.query
  return typeof query === 'string' && AUTH_FIELD.test(query)
}

/**
 * Limite estrito para login e cadastro: dificulta tentar senhas por forca
 * bruta e criar contas em massa.
 *
 * Como todo o GraphQL passa por uma unica rota, o filtro olha o texto da
 * query. Usar um alias nao burla a regra: o nome do campo continua la.
 *
 * Todas as tentativas contam, inclusive as bem-sucedidas: no GraphQL a falha
 * de credencial volta com HTTP 200, entao o limitador nao consegue separar
 * acerto de erro pelo status. O teto acomoda o uso normal com folga.
 */
export const authRateLimit: RequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  skip: (request) => !isAuthOperation(request),
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: rateLimitResponse(
    'Muitas tentativas de acesso. Aguarde alguns minutos e tente de novo.',
  ),
})

/**
 * Corpo no formato de resposta GraphQL, para que o cliente trate o bloqueio
 * pelo mesmo caminho dos outros erros (lendo `extensions.code`).
 */
function rateLimitResponse(message: string) {
  return {
    errors: [{ message, extensions: { code: 'TOO_MANY_REQUESTS' } }],
  }
}
