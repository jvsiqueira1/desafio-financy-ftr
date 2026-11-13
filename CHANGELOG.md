# Changelog

Mudanças relevantes do projeto. O formato segue o
[Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/), e as versões
seguem o [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Não lançado]

Melhorias feitas a partir do feedback da correção (nota 49/50).

### Adicionado
- Headers de segurança com `helmet`, rate limiting geral e de login/cadastro,
  limite de profundidade das consultas GraphQL e limite do corpo da requisição
- Content Security Policy no build do front-end
- Testes de integração do back-end e testes unitários e de componente do
  front-end, com Vitest e Testing Library
- Guia do Style Guide (`docs/style-guide.md`), `CONTRIBUTING.md` e este changelog
- Hooks de Git: Biome nos arquivos alterados e validação de Conventional Commits

### Alterado
- Páginas carregadas sob demanda (`React.lazy`), reduzindo o bundle inicial
- TypeScript do front-end alinhado à versão 7, a mesma do back-end
- Introspection e Sandbox do GraphQL desligados em produção

## [1.0.0] - 2026-09-22

Versão entregue para correção.

### Back-end
- API GraphQL com Apollo Server, Prisma e SQLite
- Cadastro e login com senha em argon2id e sessão por JWT
- CRUD de categorias e transações isolado por usuário
- Listagem de transações com busca, filtros por tipo, categoria e mês, e paginação
- Resumo do dashboard: saldo, entradas e saídas do mês e gastos por categoria
- Validação das variáveis de ambiente com Zod e CORS configurável

### Front-end
- Aplicação React + Vite com Apollo Client, React Hook Form, Zod e Tailwind
- Style Guide do Figma aplicado como tokens do Tailwind e componentes shadcn/ui
- Telas de login, cadastro, dashboard, transações, categorias, conta e 404
- Dialogs de criação e edição de transação e de categoria
- Rotas protegidas e sessão com opção "lembrar-me"

[Não lançado]: https://github.com/jvsiqueira1/desafio-financy-ftr/compare/main...develop
[1.0.0]: https://github.com/jvsiqueira1/desafio-financy-ftr/tree/main
