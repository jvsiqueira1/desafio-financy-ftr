import cors from 'cors'
import express from 'express'

import { env } from './lib/env.js'

const app = express()

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

app.listen(env.PORT, () => {
  console.log(`🚀 Financy API rodando em http://localhost:${env.PORT}`)
  console.log(`   Ambiente: ${env.NODE_ENV}`)
  console.log(`   CORS liberado para: ${env.CORS_ORIGIN}`)
})
