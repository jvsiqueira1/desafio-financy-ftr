/**
 * Converte o dia escolhido no calendario em meia-noite UTC, como um Date comum.
 *
 * O calendario trabalha em UTC para exibir corretamente as datas vindas da
 * API. O objeto que ele devolve e um TZDate, cujo toISOString produz
 * "+00:00" em vez de "Z". Recriar a partir dos componentes do dia gera um
 * Date comum, no mesmo formato de todas as outras datas da aplicacao.
 */
export function toUtcDateOnly(data: Date): Date {
  return new Date(Date.UTC(data.getFullYear(), data.getMonth(), data.getDate()))
}
