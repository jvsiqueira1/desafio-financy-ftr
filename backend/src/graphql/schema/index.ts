/**
 * Schema da API em SDL (Schema Definition Language).
 *
 * O prefixo `#graphql` na primeira linha faz editores com suporte a GraphQL
 * reconhecerem o conteudo da template string e aplicarem realce de sintaxe.
 *
 * O SDL fica em TypeScript, e nao em arquivos .graphql, para que o `tsc` leve
 * tudo para `dist/` sem precisar de um passo extra copiando arquivos.
 */
export const typeDefs = `#graphql
  type Query {
    """Verifica se a API GraphQL esta respondendo."""
    hello: String!

    """Quantidade de usuarios cadastrados. Prova que o resolver alcanca o banco."""
    usersCount: Int!
  }

  type Mutation {
    """
    Temporario: existe apenas para demonstrar o fluxo de uma mutation.
    Sera substituido por signUp e signIn na etapa de autenticacao.
    """
    echo(message: String!): String!
  }
`
