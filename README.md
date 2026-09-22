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

## Design

Layout de referência (Figma):
https://www.figma.com/design/9xSylqSSq2Fun4jsXdBrI8/Financy--Community-

## Convenções de desenvolvimento

- **Branches:** `main` (estável) · `develop` (integração) · `feature/*` (trabalho)
- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/)
  (`feat`, `fix`, `chore`, `docs`, `refactor`, `test`)
