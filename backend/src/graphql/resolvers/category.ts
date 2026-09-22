import { requireAuthentication } from '../../modules/auth/require-authentication.js'
import {
  createCategory,
  deleteCategory,
  getCategory,
  listCategories,
  updateCategory,
} from '../../modules/category/category.service.js'
import type { GraphQLContext } from '../context.js'

/**
 * Toda operacao passa por requireAuthentication e repassa o id da sessao.
 * Nenhuma delas aceita userId vindo do cliente.
 */
export const categoryResolvers = {
  Query: {
    categories: (_parent: unknown, _args: unknown, context: GraphQLContext) =>
      listCategories(context.prisma, requireAuthentication(context).id),

    category: (
      _parent: unknown,
      args: { id: string },
      context: GraphQLContext,
    ) =>
      getCategory(context.prisma, requireAuthentication(context).id, args.id),
  },

  Mutation: {
    createCategory: (
      _parent: unknown,
      args: { input: unknown },
      context: GraphQLContext,
    ) =>
      createCategory(
        context.prisma,
        requireAuthentication(context).id,
        args.input,
      ),

    updateCategory: (
      _parent: unknown,
      args: { input: unknown },
      context: GraphQLContext,
    ) =>
      updateCategory(
        context.prisma,
        requireAuthentication(context).id,
        args.input,
      ),

    deleteCategory: (
      _parent: unknown,
      args: { id: string },
      context: GraphQLContext,
    ) =>
      deleteCategory(
        context.prisma,
        requireAuthentication(context).id,
        args.id,
      ),
  },
}
