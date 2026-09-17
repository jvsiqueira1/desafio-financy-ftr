import http from 'node:http'

import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { expressMiddleware } from '@as-integrations/express5'
import cors from 'cors'
import express from 'express'

import { createContext, type GraphQLContext } from './graphql/context.js'
import { resolvers } from './graphql/resolvers/index.js'
import { typeDefs } from './graphql/schema/index.js'
import { env } from './lib/env.js'

const app = express()

/**
 * O servidor HTTP e criado explicitamente (em vez de app.listen) para que o
 * Apollo possa encerra-lo de forma graciosa: ao receber o sinal de parada, ele
 * para de aceitar conexoes novas e aguarda as requisicoes em andamento.
 */
const httpServer = http.createServer(app)

const apolloServer = new ApolloServer<GraphQLContext>({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
})

// Constroi e valida o schema. Precisa acontecer antes de montar o middleware.
await apolloServer.start()

/**
 * CORS: autoriza o navegador a chamar esta API a partir da origem do front-end.
 * Sem isso, o browser bloqueia a resposta mesmo que o servidor responda 200.
 */
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }),
)

/** Interpreta corpos JSON e os disponibiliza em `request.body`. */
app.use(express.json())

/** Rota de verificacao: confirma que a API esta no ar. */
app.get('/health', (_request, response) => {
  response.json({
    status: 'ok',
    environment: env.NODE_ENV,
    uptime: process.uptime(),
  })
})

/** Endpoint unico do GraphQL: toda query e mutation passa por aqui. */
app.use('/graphql', expressMiddleware(apolloServer, { context: createContext }))

await new Promise<void>((resolve) => {
  httpServer.listen(env.PORT, resolve)
})

console.log(`🚀 Financy API rodando em http://localhost:${env.PORT}`)
console.log(`   GraphQL:  http://localhost:${env.PORT}/graphql`)
console.log(`   Ambiente: ${env.NODE_ENV}`)
console.log(`   CORS liberado para: ${env.CORS_ORIGIN}`)
