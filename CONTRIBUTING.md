# Contribuindo com o Financy

## Preparando o ambiente

Siga a seção **Como rodar** do [README](README.md) para subir o back-end e o
front-end. Depois, instale as ferramentas da raiz, que ativam os hooks de Git:

```bash
npm install
```

## Fluxo de branches

| Branch      | Papel                                         |
| ----------- | --------------------------------------------- |
| `main`      | Versão estável, a que foi entregue na correção |
| `develop`   | Integração: todo PR entra aqui primeiro        |
| `feature/*` | Funcionalidade nova                            |
| `fix/*`     | Correção de bug                                |
| `test/*`, `docs/*`, `chore/*` | Testes, documentação e manutenção |

1. Crie a branch a partir da `develop` atualizada.
2. Faça commits pequenos, cada um com uma intenção só.
3. Abra o PR para a `develop`, descrevendo **o quê** mudou, **por quê** e
   **como foi verificado**.
4. A `develop` vai para a `main` quando estiver estável.

Funcionalidades além do escopo do desafio (por exemplo, upload de avatar) ficam
em branches próprias e não entram na `main` sem combinar antes: a `main`
precisa continuar refletindo o que foi avaliado.

## Commits

O projeto segue [Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/),
validados pelo hook `commit-msg`:

```text
<tipo>(<escopo opcional>): <descrição no imperativo>

<corpo opcional: por que a mudança foi feita>
```

| Tipo       | Quando usar                                   |
| ---------- | --------------------------------------------- |
| `feat`     | Funcionalidade nova                           |
| `fix`      | Correção de bug                               |
| `perf`     | Melhoria de desempenho                        |
| `refactor` | Mudança de código sem alterar comportamento   |
| `test`     | Testes                                        |
| `docs`     | Documentação                                  |
| `chore`    | Dependências, configuração, tarefas de build  |
| `style`    | Formatação, sem mudança de lógica             |

Escopos usados: `backend`, `frontend`.

```text
feat(frontend): adiciona filtro por categoria na tabela de transacoes
fix(backend): impede mover transacao para categoria de outro usuario
```

## Antes de abrir o PR

O hook `pre-commit` já formata e aplica o lint do Biome nos arquivos alterados.
Antes do PR, rode a verificação completa no projeto que você mexeu:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Padrões de código

- **Formatação e lint:** [Biome](https://biomejs.dev), configurado em
  `biome.json` na raiz. Não há ESLint nem Prettier.
- **TypeScript estrito** nos dois projetos; evite `any` e asserções (`as`)
  sem um comentário explicando por que são seguras.
- **Validação:** toda entrada do usuário passa por um schema Zod. No back-end,
  a validação dos services é a fonte da verdade; a do front-end existe para dar
  retorno rápido.
- **Isolamento por usuário:** toda consulta do back-end filtra pelo `userId`
  da sessão, nunca por um valor enviado pelo cliente. Recurso de outro dono
  responde `NOT_FOUND`.
- **Erros da API:** lance os helpers de `backend/src/lib/errors.ts`. O
  front-end decide o que fazer pelo `extensions.code`, nunca pela mensagem.
- **Interface:** siga o [Style Guide](docs/style-guide.md). Use tokens
  semânticos em vez de cores fixas e os componentes de `components/`.
- **Comentários** explicam o *porquê* de uma decisão, não o que a linha faz.

## Testes

- **Back-end** (`backend/test`): testes de integração que passam pela camada
  GraphQL real, contra um SQLite próprio. Toda regra de acesso nova ganha um
  teste de isolamento entre dois usuários.
- **Front-end** (`*.test.ts(x)` ao lado do código): Vitest + Testing Library.
  Busque elementos como o usuário os encontra (`getByRole`, `getByLabelText`),
  não por classe ou `data-testid`.

## Changelog

Mudanças relevantes entram no [CHANGELOG.md](CHANGELOG.md), na seção
**Não lançado**, agrupadas por tipo.
