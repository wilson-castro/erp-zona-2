import { criarProxy } from '@erp/nucleo/proxy'

// Sem esta fábrica, cada zona reimplementaria cookie e CSP e divergiria (limitação 4).
export default criarProxy({ prefixo: '/zona2', rotaLogin: '/login' })

export const config = { matcher: ['/zona2', '/zona2/:caminho*'] }
