import type { z } from 'zod'

/**
 * Converte as falhas do zod no formato { campo: [mensagens] }.
 *
 * O cliente precisa saber QUAL campo falhou para destacar o input certo no
 * formulario, e nao apenas que "algo deu errado".
 */
export function toFieldErrors(error: z.ZodError): Record<string, string[]> {
  const fields: Record<string, string[]> = {}

  for (const issue of error.issues) {
    const field = issue.path.join('.') || '_'
    fields[field] = [...(fields[field] ?? []), issue.message]
  }

  return fields
}
