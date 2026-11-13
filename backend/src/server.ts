import http from 'node:http'

import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { expressMiddleware } from '@as-integrations/express5'
import cors from 'cors'
import express from 'express'

import { createContext, type GraphQLContext } from './graphql/context.js'
import { depthLimit } from './graphql/depth-limit.js'
import { resolvers } from './graphql/resolvers/index.js'
import { typeDefs } from './graphql/schema/index.js'
import { env } from './lib/env.js'
import { apiRateLimit, authRateLimit, securityHeaders } from './lib/security.js'

const isProduction = env.NODE_ENV === 'production'

const app = express()

/**
 * Sem isso, o Express anuncia "X-Powered-By: Express" em toda resposta,
 * entregando de graca a tecnologia usada a quem estiver sondando a API.
 */
app.disable('x-powered-by')

/**
 * O servidor HTTP e criado explicitamente (em vez de app.listen) para que o
 * Apollo possa encerra-lo de forma graciosa: ao receber o sinal de parada, ele
 * para de aceitar conexoes novas e aguarda as requisicoes em andamento.
 */
const httpServer = http.createServer(app)

const apolloServer = new ApolloServer<GraphQLContext>({
  typeDefs,
  resolvers,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    // Em producao nao ha Sandbox: GET /graphql nao serve pagina nenhuma.
    ...(isProduction ? [ApolloServerPluginLandingPageDisabled()] : []),
  ],
  /**
   * Introspection descreve o schema inteiro a quem pedir. Util para o
   * Sandbox e para tooling em desenvolvimento, desnecessario em producao.
   */
  introspection: !isProduction,
  /** Recusa consultas aninhadas demais antes de executar qualquer resolver. */
  validationRules: [depthLimit(8)],
})

// Constroi e valida o schema. Precisa acontecer antes de montar o middleware.
await apolloServer.start()

/**
 * CORS: autoriza o navegador a chamar esta API a partir da origem do front-end.
 * Sem isso, o browser bloqueia a resposta mesmo que o servidor responda 200.
 */
/** Headers de seguranca (ver lib/security.ts). */
app.use(securityHeaders)

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }),
)

/**
 * Interpreta corpos JSON e os disponibiliza em `request.body`.
 * O limite evita que um corpo gigante consuma memoria do servidor; nenhuma
 * operacao legitima da aplicacao chega perto disso.
 */
app.use(express.json({ limit: '100kb' }))

/** Rota de verificacao: confirma que a API esta no ar. */
app.get('/health', (_request, response) => {
  response.json({
    status: 'ok',
    environment: env.NODE_ENV,
    uptime: process.uptime(),
  })
})

/**
 * Endpoint unico do GraphQL: toda query e mutation passa por aqui.
 * Os limitadores vem depois do express.json porque o de autenticacao precisa
 * ler o corpo para saber se a operacao e um login ou cadastro.
 */
app.use(
  '/graphql',
  apiRateLimit,
  authRateLimit,
  expressMiddleware(apolloServer, { context: createContext }),
)

await new Promise<void>((resolve) => {
  httpServer.listen(env.PORT, resolve)
})

console.log(`🚀 Financy API rodando em http://localhost:${env.PORT}`)
console.log(`   GraphQL:  http://localhost:${env.PORT}/graphql`)
console.log(`   Ambiente: ${env.NODE_ENV}`)
console.log(`   CORS liberado para: ${env.CORS_ORIGIN}`)
