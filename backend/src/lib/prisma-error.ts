/**
 * Identifica erros do Prisma pelo codigo, sem depender da classe concreta.
 *
 * Codigos usados no projeto:
 *   P2002 - violacao de constraint unica
 *   P2003 - violacao de chave estrangeira (o onDelete: Restrict das categorias)
 */
export function isPrismaError(error: unknown, code: string): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === code
  )
}
