import { useQuery } from '@apollo/client/react'

import {
  HELLO_QUERY,
  type HelloQueryData,
  ME_QUERY,
  type MeQueryData,
} from '@/graphql/session'

interface LinhaProps {
  rotulo: string
  carregando: boolean
  erro?: string
  valor?: string
}

function Linha({ rotulo, carregando, erro, valor }: LinhaProps) {
  let conteudo = valor ?? '—'

  if (carregando) {
    conteudo = 'consultando...'
  } else if (erro) {
    conteudo = erro
  }

  return (
    <p>
      <span className="text-muted-foreground">{rotulo}: </span>
      <span className={erro ? 'text-destructive' : 'text-foreground'}>
        {conteudo}
      </span>
    </p>
  )
}

/**
 * Temporario: valida o caminho React -> Apollo -> API -> cache -> render.
 *
 * `hello` e publica e prova a conexao. `me` exige token e, sem sessao, deve
 * falhar com "Autenticacao necessaria" — o que tambem prova que o link de
 * autenticacao esta na cadeia.
 *
 * Sai daqui quando a tela de login real entrar no lugar.
 */
export function ApiStatus() {
  const conexao = useQuery<HelloQueryData>(HELLO_QUERY)
  const sessao = useQuery<MeQueryData>(ME_QUERY)

  return (
    <div className="w-full max-w-md space-y-2 rounded-lg border bg-card p-6 text-sm">
      <h2 className="font-semibold text-base">Diagnóstico da API</h2>

      <Linha
        carregando={conexao.loading}
        erro={conexao.error?.message}
        rotulo="Conexão"
        valor={conexao.data?.hello}
      />

      <Linha
        carregando={sessao.loading}
        erro={sessao.error?.message}
        rotulo="Sessão"
        valor={
          sessao.data
            ? `${sessao.data.me.name} (${sessao.data.me.email})`
            : undefined
        }
      />
    </div>
  )
}
