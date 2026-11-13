# Style Guide

Como a aba **Style Guide** do [Figma](https://www.figma.com/design/9xSylqSSq2Fun4jsXdBrI8/Financy--Community-)
virou código. Leia antes de criar um componente ou uma tela: quase tudo que
uma interface nova precisa já existe como token ou componente.

## Onde cada coisa mora

| O quê                          | Arquivo                                   |
| ------------------------------ | ----------------------------------------- |
| Cores, fonte e raios (tokens)  | `frontend/src/index.css`                  |
| Paleta e ícones das categorias | `frontend/src/lib/category-appearance.ts` |
| Componentes base (shadcn/ui)   | `frontend/src/components/ui/`             |
| Componentes do Financy         | `frontend/src/components/`                |
| Componentes de uma feature     | `frontend/src/features/<feature>/`        |

## Tokens

O Tailwind v4 lê os tokens do bloco `@theme` no `index.css`. Cada
`--color-<nome>` vira as classes `bg-<nome>`, `text-<nome>`, `border-<nome>` e
assim por diante.

### Cores semânticas

Os componentes nunca usam um hexadecimal direto: usam o **papel** da cor. As
classes apontam para variáveis em `:root`, então trocar um valor não exige
mexer em nenhum componente.

| Token                     | Valor     | Figma                | Uso                                   |
| ------------------------- | --------- | -------------------- | ------------------------------------- |
| `background`              | `#F8F9FA` | Grayscale/gray-100   | Fundo das páginas                     |
| `foreground`              | `#111827` | Grayscale/gray-800   | Texto principal                       |
| `card` / `popover`        | `#FFFFFF` | —                    | Cards, dialogs e menus                |
| `primary`                 | `#1F6F43` | Brand/brand-base     | Ação principal, links, foco           |
| `secondary-foreground`    | `#374151` | Grayscale/gray-700   | Texto do botão secundário             |
| `muted-foreground`        | `#4B5563` | Grayscale/gray-600   | Rótulos e textos de apoio             |
| `destructive`             | `#DC2626` | Red/red-base         | Excluir, erros                        |
| `border`                  | `#E5E7EB` | Grayscale/gray-200   | Borda de cards                        |
| `input`                   | `#D1D5DB` | Grayscale/gray-300   | Borda de campos                       |
| `ring`                    | `#1F6F43` | Brand/brand-base     | Anel de foco (navegação por teclado)  |
| `income` / `expense`      | verde / vermelho | —             | Entrada e saída nas transações        |

`accent` (hover) não existe no Figma; foi derivado da escala de cinzas.

### Tipografia

Fonte **Inter Variable**, carregada pelo `@fontsource-variable/inter` (sai no
próprio bundle, sem CDN). Os tamanhos do layout coincidem com a escala padrão
do Tailwind, então não foi preciso criar tokens:

| Figma   | Classe      |
| ------- | ----------- |
| 14 / 20 | `text-sm`   |
| 16 / 24 | `text-base` |
| 20 / 28 | `text-xl`   |

### Raios

| Token          | Valor | Onde                       |
| -------------- | ----- | -------------------------- |
| `rounded-sm`   | 4px   | Checkbox                   |
| `rounded-lg`   | 8px   | Campos e botões            |
| `rounded-xl`   | 12px  | Cards                      |

`md` (6px) e `2xl` (16px) são interpolações para completar a escala.

## Categorias

Cada uma das 7 cores do seletor tem **três tons**, todos tirados do Figma:

- **base** (`text-category-green`): o ícone da categoria
- **soft** (`bg-category-green-soft`): fundo do chip e do quadro do ícone
- **strong** (`text-category-green-strong`): o nome dentro do chip, escuro o
  bastante para contrastar com o fundo claro

O banco grava o hexadecimal base (ex: `#16A34A`), e a API recusa qualquer cor
fora da paleta. `category-appearance.ts` liga esse valor às classes.

> **Por que as classes estão escritas por extenso?** O Tailwind só gera CSS
> para nomes de classe que encontra literalmente no código. Montar
> `` `bg-category-${cor}` `` em tempo de execução produziria uma classe que o
> compilador nunca viu, e o estilo não existiria.

Os ícones seguem a mesma ideia: o banco grava um identificador
(`shopping-cart`) e o front-end o traduz para o componente do Lucide. Cada ícone
tem um rótulo em português (`Carrinho de compras`) usado pelos leitores de
tela no seletor.

## Componentes

### Base (`components/ui`)

Gerados pela CLI do [shadcn/ui](https://ui.shadcn.com) sobre o Radix UI, que
cuida de foco, teclado e atributos ARIA. Já usam os tokens acima. Ficam fora do
lint do Biome por serem código gerado; para atualizar um deles, rode a CLI de
novo em vez de editar à mão:

```bash
cd frontend
npx shadcn@latest add button
```

### Do Financy (`components/`)

Compostos a partir dos base, com o comportamento específico do layout:

| Componente      | O que resolve                                                 |
| --------------- | ------------------------------------------------------------- |
| `IconInput`     | Campo com ícone à esquerda e conteúdo opcional à direita      |
| `PasswordInput` | Senha com botão de mostrar/ocultar (`aria-pressed`)           |
| `CurrencyInput` | Valor em centavos, preenchido como caixa registradora         |
| `DatePicker`    | Calendário em UTC, para a data não mudar com o fuso           |
| `FormField`     | Rótulo, campo e dica ou erro, sem o layout pular de altura    |
| `CategoryTag`   | Chip da categoria nas três tonalidades                        |
| `CategoryIcon`  | Quadro com o ícone da categoria                               |
| `StatCard`      | Card de indicador (dashboard e categorias)                    |
| `PageShell`     | Cabeçalho da aplicação + área de conteúdo                     |
| `Pagination`    | Paginação da tabela de transações                             |
| `EmptyState`    | Mensagem quando uma lista está vazia                          |

## Checklist para uma tela nova

1. Procure o componente em `components/` antes de criar um.
2. Use tokens semânticos (`text-muted-foreground`), nunca hexadecimal.
3. Use os tamanhos de texto e os raios da tabela acima.
4. Todo campo tem `<label>` (via `FormField`), e todo botão só com ícone tem
   `aria-label`.
5. Confira o foco navegando com `Tab`: o anel `ring` deve aparecer.
