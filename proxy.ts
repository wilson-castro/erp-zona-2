import { criarProxy } from '@erp/nucleo/proxy'

export default criarProxy({ prefixo: '/zona2', rotaLogin: '/login', publicos: ['/zona2/api/health'] })

export const config = { matcher: ['/zona2', '/zona2/:caminho*'] }
