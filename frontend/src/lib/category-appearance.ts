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

export interface CategoryAppearance {
  /** Valor gravado no banco; precisa bater com a lista aceita pela API. */
  value: string
  label: string
  /** Amostra solida, usada no seletor de cor. */
  swatch: string
  /** Fundo claro com texto escuro, usado no chip e no quadro do icone. */
  soft: string
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
    soft: 'bg-category-green-soft text-category-green-strong',
  },
  {
    value: '#2563EB',
    label: 'Azul',
    swatch: 'bg-category-blue',
    soft: 'bg-category-blue-soft text-category-blue-strong',
  },
  {
    value: '#9333EA',
    label: 'Roxo',
    swatch: 'bg-category-purple',
    soft: 'bg-category-purple-soft text-category-purple-strong',
  },
  {
    value: '#DB2777',
    label: 'Rosa',
    swatch: 'bg-category-pink',
    soft: 'bg-category-pink-soft text-category-pink-strong',
  },
  {
    value: '#DC2626',
    label: 'Vermelho',
    swatch: 'bg-category-red',
    soft: 'bg-category-red-soft text-category-red-strong',
  },
  {
    value: '#EA580C',
    label: 'Laranja',
    swatch: 'bg-category-orange',
    soft: 'bg-category-orange-soft text-category-orange-strong',
  },
  {
    value: '#CA8A04',
    label: 'Amarelo',
    swatch: 'bg-category-yellow',
    soft: 'bg-category-yellow-soft text-category-yellow-strong',
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
