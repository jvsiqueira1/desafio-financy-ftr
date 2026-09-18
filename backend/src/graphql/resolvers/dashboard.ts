import { requireAuthentication } from '../../modules/auth/require-authentication.js'
import { getDashboardSummary } from '../../modules/dashboard/dashboard.service.js'
import type { GraphQLContext } from '../context.js'

export const dashboardResolvers = {
  Query: {
    dashboardSummary: (
      _parent: unknown,
      args: { month: number; year: number },
      context: GraphQLContext,
    ) =>
      getDashboardSummary(
        context.prisma,
        requireAuthentication(context).id,
        args,
      ),
  },
}
