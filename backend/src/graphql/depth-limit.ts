import {
  type ASTNode,
  type FragmentDefinitionNode,
  GraphQLError,
  Kind,
  type ValidationContext,
  type ValidationRule,
} from 'graphql'

/**
 * Recusa consultas aninhadas alem de `maxDepth` niveis.
 *
 * GraphQL deixa o cliente escolher a forma da resposta. Sem limite, uma query
 * maliciosa pode aninhar campos indefinidamente e forcar o servidor a resolver
 * uma arvore enorme. A checagem roda na validacao, antes de qualquer resolver
 * tocar o banco.
 *
 * Fragmentos sao seguidos ate o fim (com protecao contra ciclos), entao nao da
 * para esconder profundidade dentro deles.
 */
export function depthLimit(maxDepth: number): ValidationRule {
  return (context: ValidationContext) => {
    const fragments = new Map<string, FragmentDefinitionNode>()

    for (const definition of context.getDocument().definitions) {
      if (definition.kind === Kind.FRAGMENT_DEFINITION) {
        fragments.set(definition.name.value, definition)
      }
    }

    function measure(node: ASTNode, depth: number, visited: Set<string>) {
      if (depth > maxDepth) {
        context.reportError(
          new GraphQLError(
            `A consulta excede a profundidade máxima de ${maxDepth} níveis.`,
            { nodes: [node] },
          ),
        )
        return false
      }

      if (
        node.kind === Kind.FIELD ||
        node.kind === Kind.INLINE_FRAGMENT ||
        node.kind === Kind.OPERATION_DEFINITION
      ) {
        const selections = node.selectionSet?.selections ?? []
        // Campos contam um nivel; fragmentos inline so agrupam campos.
        const next = node.kind === Kind.FIELD ? depth + 1 : depth

        for (const selection of selections) {
          if (!measure(selection, next, visited)) return false
        }
      }

      if (node.kind === Kind.FRAGMENT_SPREAD) {
        const name = node.name.value
        const fragment = fragments.get(name)

        if (!fragment || visited.has(name)) return true

        const branch = new Set(visited).add(name)

        for (const selection of fragment.selectionSet.selections) {
          if (!measure(selection, depth, branch)) return false
        }
      }

      return true
    }

    return {
      OperationDefinition(node) {
        measure(node, 0, new Set())
        // A operacao inteira ja foi percorrida; nao precisa descer de novo.
        return false
      },
    }
  }
}
