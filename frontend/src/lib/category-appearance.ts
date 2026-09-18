import {
  BaggageClaim,
  BookOpen,
  BriefcaseBusiness,
  CarFront,
  Dumbbell,
  Gift,
  HeartPulse,
  House,
  type LucideIcon,
  Mailbox,
  PawPrint,
  PiggyBank,
  ReceiptText,
  ShoppingCart,
  Ticket,
  ToolCase,
  Utensils,
} from 'lucide-react'

/**
 * Os 16 icones do seletor, na ordem em que aparecem no layout.
 *
 * A chave e o identificador gravado no banco; o valor e o componente que o
 * desenha. Guardar o slug, e nao o componente, mantem o banco independente da
 * biblioteca de icones.
 */
export const CATEGORY_ICONS = {
  'briefcase-business': BriefcaseBusiness,
  'car-front': CarFront,
  'heart-pulse': HeartPulse,
  'piggy-bank': PiggyBank,
  'shopping-cart': ShoppingCart,
  ticket: Ticket,
  'tool-case': ToolCase,
  utensils: Utensils,
  'paw-print': PawPrint,
  house: House,
  gift: Gift,
  dumbbell: Dumbbell,
  'book-open': BookOpen,
  'baggage-claim': BaggageClaim,
  mailbox: Mailbox,
  'receipt-text': ReceiptText,
} satisfies Record<string, LucideIcon>

export type CategoryIconName = keyof typeof CATEGORY_ICONS

export const CATEGORY_ICON_NAMES = Object.keys(
  CATEGORY_ICONS,
) as CategoryIconName[]

export function getCategoryIcon(icon: string): LucideIcon {
  return CATEGORY_ICONS[icon as CategoryIconName] ?? Ticket
}

/**
 * Nomes legiveis dos icones, usados como rotulo acessivel no seletor.
 * Sem isto, o leitor de tela anunciaria "briefcase-business".
 */
export const CATEGORY_ICON_LABELS: Record<CategoryIconName, string> = {
  'briefcase-business': 'Maleta',
  'car-front': 'Carro',
  'heart-pulse': 'Saúde',
  'piggy-bank': 'Cofrinho',
  'shopping-cart': 'Carrinho de compras',
  ticket: 'Ingresso',
  'tool-case': 'Caixa de ferramentas',
  utensils: 'Talheres',
  'paw-print': 'Pata',
  house: 'Casa',
  gift: 'Presente',
  dumbbell: 'Haltere',
  'book-open': 'Livro',
  'baggage-claim': 'Bagagem',
  mailbox: 'Caixa de correio',
  'receipt-text': 'Recibo',
}

/**
 * Cada cor do seletor aparece em tres tons no layout:
 *   base   - o icone da categoria
 *   soft   - fundo claro do chip e do quadro do icone
 *   strong - o nome dentro do chip, escuro para contrastar com o fundo
 */
export interface CategoryAppearance {
  /** Valor gravado no banco; precisa bater com a lista aceita pela API. */
  value: string
  label: string
  /** Amostra solida, usada no seletor de cor. */
  swatch: string
  text: string
  soft: string
  strong: string
}

/**
 * As classes sao escritas por extenso de proposito.
 *
 * O Tailwind varre os arquivos em busca de nomes de classe literais. Montar
 * `bg-category-${cor}` em tempo de execucao produziria uma classe que o
 * compilador nunca viu — e o CSS correspondente nao seria gerado.
 */
export const CATEGORY_COLORS: CategoryAppearance[] = [
  {
    value: '#16A34A',
    label: 'Verde',
    swatch: 'bg-category-green',
    text: 'text-category-green',
    soft: 'bg-category-green-soft',
    strong: 'text-category-green-strong',
  },
  {
    value: '#2563EB',
    label: 'Azul',
    swatch: 'bg-category-blue',
    text: 'text-category-blue',
    soft: 'bg-category-blue-soft',
    strong: 'text-category-blue-strong',
  },
  {
    value: '#9333EA',
    label: 'Roxo',
    swatch: 'bg-category-purple',
    text: 'text-category-purple',
    soft: 'bg-category-purple-soft',
    strong: 'text-category-purple-strong',
  },
  {
    value: '#DB2777',
    label: 'Rosa',
    swatch: 'bg-category-pink',
    text: 'text-category-pink',
    soft: 'bg-category-pink-soft',
    strong: 'text-category-pink-strong',
  },
  {
    value: '#DC2626',
    label: 'Vermelho',
    swatch: 'bg-category-red',
    text: 'text-category-red',
    soft: 'bg-category-red-soft',
    strong: 'text-category-red-strong',
  },
  {
    value: '#EA580C',
    label: 'Laranja',
    swatch: 'bg-category-orange',
    text: 'text-category-orange',
    soft: 'bg-category-orange-soft',
    strong: 'text-category-orange-strong',
  },
  {
    value: '#CA8A04',
    label: 'Amarelo',
    swatch: 'bg-category-yellow',
    text: 'text-category-yellow',
    soft: 'bg-category-yellow-soft',
    strong: 'text-category-yellow-strong',
  },
]

/** Cor padrao para dados antigos ou fora da paleta atual. */
const APARENCIA_PADRAO = CATEGORY_COLORS[0] as CategoryAppearance

export function getCategoryAppearance(color: string): CategoryAppearance {
  const normalizada = color.toUpperCase()

  return (
    CATEGORY_COLORS.find((cor) => cor.value === normalizada) ?? APARENCIA_PADRAO
  )
}
