# Financy

Aplicação Full Stack de gerenciamento de finanças pessoais, desenvolvida como desafio
prático da Pós-Graduação Full Stack (Rocketseat).

Permite cadastro e login de usuário, com gestão de **categorias** e **transações**
isoladas por usuário.

## Stack

### Backend
- TypeScript
- Apollo Server (GraphQL, schema-first)
- Prisma ORM
- SQLite
- JWT para autenticação

### Frontend
- TypeScript
- React
- Vite
- Apollo Client (GraphQL)

## Estrutura do repositório

```text
.
├── backend/    # API GraphQL
└── frontend/   # Aplicação React
```

## Como rodar

### Pré-requisitos

- Node.js 20 ou superior
- npm

### 1. Back-end

```bash
cd backend
npm install
cp .env.example .env
```

Gere a `JWT_SECRET` e grave no `.env`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Crie o banco SQLite e gere o Prisma Client:

```bash
npx prisma migrate deploy
npx prisma generate
```

Suba a API:

```bash
npm run dev
```

Sobe em `http://localhost:3333` — GraphQL em `/graphql` e verificação de saúde
em `/health`. O `prisma/dev.db` é criado pelo migrate e não entra no repositório.

### 2. Front-end

Em outro terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

O `.env.example` já aponta `VITE_BACKEND_URL` para `http://localhost:3333/graphql`,
o padrão do back-end. A aplicação abre em `http://localhost:5173` — cadastre um
usuário para começar.

### Scripts

| Script              | Back-end                   | Front-end                    |
| ------------------- | -------------------------- | ---------------------------- |
| `npm run dev`       | API com recarga automática | Vite com recarga automática  |
| `npm run build`     | Compila para `dist/`       | Type-check + bundle estático |
| `npm run start`     | Roda a compilação          | —                            |
| `npm run preview`   | —                          | Serve o bundle de produção   |
| `npm run typecheck` | TypeScript sem emitir      | TypeScript sem emitir        |
| `npm run lint`      | Biome                      | Biome                        |
| `npm test`          | Testes de integração       | Testes unitários e de tela   |

### Testes

Os testes do back-end (`backend/test`) usam Vitest e passam pela camada GraphQL
real: o token percorre o mesmo `createContext` de uma requisição, e as operações
chegam ao Prisma. Rodam em um SQLite próprio (`prisma/test.db`), recriado a cada
execução, então não tocam o banco de desenvolvimento. Cobrem cadastro, login,
sessão, CRUD de categorias e transações, filtros, paginação e o isolamento entre
usuários.

Os do front-end usam Vitest e Testing Library em jsdom, ao lado do código que
testam (`*.test.ts(x)`). Cobrem os utilitários de formatação, período e
armazenamento do token, os campos de valor e senha, e o fluxo de login com o
Apollo simulado pelo `MockedProvider`: validação, sessão aberta, "lembrar-me" e
erro da API.

## Segurança

### Back-end
- **Isolamento por usuário:** o `userId` vem sempre do token, nunca do cliente.
  Recurso de outro dono responde `NOT_FOUND`, sem confirmar que ele existe.
- **Senhas:** hash com argon2id. O login gasta o mesmo tempo para um e-mail
  inexistente e responde a mesma mensagem genérica, para não permitir
  enumerar contas.
- **Headers HTTP** (`helmet`): `X-Content-Type-Options`, `X-Frame-Options`,
  `Strict-Transport-Security`, `Referrer-Policy` e, em produção, uma CSP que
  bloqueia tudo (a API só devolve JSON). O `X-Powered-By` é removido.
- **Rate limiting** (`express-rate-limit`): 300 requisições a cada 15 min por IP
  no `/graphql` e 20 tentativas de login/cadastro no mesmo intervalo. O excesso
  recebe `429` com o código `TOO_MANY_REQUESTS`, que o front-end exibe.
- **GraphQL:** consultas com mais de 8 níveis de aninhamento são recusadas
  antes de executar. Em produção, introspection e o Sandbox ficam desligados.
- **Corpo da requisição** limitado a 100 kB.

### Front-end
- **Content Security Policy** injetada no `index.html` do build: só roda script
  da própria origem e só faz requisições para a API (`VITE_BACKEND_URL`). Fica
  fora do `npm run dev` porque o React Refresh depende de um script inline.
- **XSS:** o React escapa todo texto renderizado e o projeto não usa
  `dangerouslySetInnerHTML`, por isso não há HTML do usuário a sanitizar com
  DOMPurify. Os dados são validados com Zod nos dois lados.
- **CSRF:** não se aplica. O token vai no header `Authorization`, não em
  cookie, então o navegador não o envia sozinho em requisições de outros sites.
- **SRI:** não se aplica. Nenhum recurso é carregado de CDN; fontes e
  bibliotecas saem do próprio bundle.

## Design

Layout de referência (Figma):
https://www.figma.com/design/9xSylqSSq2Fun4jsXdBrI8/Financy--Community-

## Convenções de desenvolvimento

- **Branches:** `main` (estável) · `develop` (integração) · `feature/*` (trabalho)
- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/)
  (`feat`, `fix`, `chore`, `docs`, `refactor`, `test`)
