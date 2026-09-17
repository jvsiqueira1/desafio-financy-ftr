import { GraphQLError } from 'graphql'

/**
 * Erros de dominio: situacoes previstas que o cliente precisa distinguir.
 *
 * Qualquer excecao nao tratada e mascarada pelo Apollo como
 * INTERNAL_SERVER_ERROR, com a mensagem omitida, para nao vazar detalhes de
 * implementacao. Lancar GraphQLError com um `code` explicito e a forma de
 * dizer "este erro e intencional e faz parte do contrato da API".
 *
 * O cliente decide o que fazer lendo `extensions.code`, nunca a mensagem:
 * texto e para humano, codigo e para maquina.
 */

/** Dados enviados pelo cliente nao passaram na validacao. */
export function invalidInput(
  message: string,
  fields?: Record<string, string[]>,
) {
  return new GraphQLError(message, {
    extensions: { code: 'BAD_USER_INPUT', fields },
  })
}

/** A operacao conflita com o estado atual (ex: e-mail ja cadastrado). */
export function conflict(message: string) {
  return new GraphQLError(message, {
    extensions: { code: 'CONFLICT' },
  })
}

/** Falta token, ou o token e invalido/expirado. */
export function unauthenticated(message = 'Autenticacao necessaria') {
  return new GraphQLError(message, {
    extensions: { code: 'UNAUTHENTICATED' },
  })
}

/**
 * Credenciais de login incorretas.
 *
 * A mensagem e deliberadamente generica: dizer "e-mail nao encontrado" revela
 * quais e-mails estao cadastrados, permitindo enumerar usuarios.
 */
export function invalidCredentials() {
  return new GraphQLError('E-mail ou senha invalidos', {
    extensions: { code: 'INVALID_CREDENTIALS' },
  })
}
