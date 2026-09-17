import { requireAuthentication } from '../../modules/auth/require-authentication.js'
import {
  createTransaction,
  deleteTransaction,
  getTransaction,
  listTransactions,
  updateTransaction,
} from '../../modules/transaction/transaction.service.js'
import type { GraphQLContext } from '../context.js'

export const transactionResolvers = {
  Query: {
    transactions: (
      _parent: unknown,
      args: { filters?: unknown; page?: number; pageSize?: number },
      context: GraphQLContext,
    ) =>
      listTransactions(
        context.prisma,
        requireAuthentication(context).id,
        args.filters,
        { page: args.page, pageSize: args.pageSize },
      ),

    transaction: (
      _parent: unknown,
      args: { id: string },
      context: GraphQLContext,
    ) =>
      getTransaction(
        context.prisma,
        requireAuthentication(context).id,
        args.id,
      ),
  },

  Mutation: {
    createTransaction: (
      _parent: unknown,
      args: { input: unknown },
      context: GraphQLContext,
    ) =>
      createTransaction(
        context.prisma,
        requireAuthentication(context).id,
        args.input,
      ),

    updateTransaction: (
      _parent: unknown,
      args: { input: unknown },
      context: GraphQLContext,
    ) =>
      updateTransaction(
        context.prisma,
        requireAuthentication(context).id,
        args.input,
      ),

    deleteTransaction: (
      _parent: unknown,
      args: { id: string },
      context: GraphQLContext,
    ) =>
      deleteTransaction(
        context.prisma,
        requireAuthentication(context).id,
        args.id,
      ),
  },
}
