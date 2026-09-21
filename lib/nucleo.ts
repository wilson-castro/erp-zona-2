import 'server-only'
import { cookies } from 'next/headers'
import { acessoHttp, criarNucleo, sessaoArquivo } from '@erp/nucleo'

/** Raiz de composição da zona 2. Sessão só em leitura (N3); um domínio de negócio (C). */
export const nucleo = criarNucleo({
  app: 'zona2',
  sessao: sessaoArquivo({ dir: process.env.SESSAO_DIR ?? '/tmp/erp-sessoes' }),
  lerCookieDeSessao: async () => (await cookies()).get('__Host-session')?.value,
  acesso: acessoHttp({ destino: 'gestao-acesso' }),
  destinos: {
    'dominio-c': {
      origem: process.env.DOMINIO_C_URL ?? 'http://127.0.0.1:4003',
      caminhos: ['/v1/tarefas', '/v1/tarefas/:id/concluir'], metodos: ['GET', 'POST'],
      credencial: 'usuario', timeoutMs: 2000,
    },
    'gestao-acesso': {
      origem: process.env.ACESSO_URL ?? 'http://127.0.0.1:4010',
      caminhos: ['/v1/modulos-permitidos'], metodos: ['GET'], credencial: 'usuario', timeoutMs: 1000,
    },
  },
})
