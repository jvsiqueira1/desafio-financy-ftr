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

> Em construção. As instruções completas de instalação, variáveis de ambiente,
> migrations e execução serão documentadas ao final do desenvolvimento.

## Design

Layout de referência (Figma):
https://www.figma.com/design/9xSylqSSq2Fun4jsXdBrI8/Financy--Community-

## Convenções de desenvolvimento

- **Branches:** `main` (estável) · `develop` (integração) · `feature/*` (trabalho)
- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/)
  (`feat`, `fix`, `chore`, `docs`, `refactor`, `test`)
