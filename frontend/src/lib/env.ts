/**
 * Variaveis de ambiente da aplicacao.
 *
 * O Vite substitui `import.meta.env.VITE_*` pelo valor literal durante o build.
 * Por isso so variaveis com o prefixo VITE_ chegam ao navegador — e por isso
 * nenhum segredo pode ser colocado aqui: tudo vira texto no bundle publico.
 */
const backendUrl = import.meta.env.VITE_BACKEND_URL

if (!backendUrl) {
  throw new Error(
    'VITE_BACKEND_URL nao esta definida. Copie o arquivo .env.example para .env.',
  )
}

export const env = {
  backendUrl,
}
