import 'server-only'
import { cookies, headers } from 'next/headers'
import { acessoHttp, criarNucleo, sessaoArquivo, sessaoRedis } from '@erp/nucleo'
import { clienteRedis } from './redis'

/** Raiz de composição da zona 2. Sessão só em leitura (N3); um domínio de negócio (C). */
export const nucleo = criarNucleo({
  app: 'zona2',
  // REDIS_URL definido: Redis (showcase, produção); senão, arquivo de desenvolvimento
  sessao: clienteRedis ? sessaoRedis({ cliente: clienteRedis }) : sessaoArquivo({ dir: process.env.SESSAO_DIR ?? '/tmp/erp-sessoes' }),
  lerCookieDeSessao: async () => (await cookies()).get('__Host-session')?.value,
  // núcleo 8: o proxy pôs um traceparent na requisição; cada chamada ao domínio leva um filho
  lerTraceparent: async () => (await headers()).get('traceparent') ?? undefined,
  acesso: acessoHttp({ destino: 'gestao-acesso' }),
  destinos: {
    'dominio-c': {
      origem: process.env.DOMINIO_C_URL ?? 'http://127.0.0.1:4003',
      caminhos: ['/v1/tarefas', '/v1/tarefas/:id/concluir'], metodos: ['GET', 'POST'],
      credencial: 'usuario', timeoutMs: 2000,
    },
    'gestao-acesso': {
      origem: process.env.ACESSO_URL ?? 'http://127.0.0.1:4010',
      caminhos: ['/v1/modulos-permitidos', '/v2/eu'], metodos: ['GET'], credencial: 'usuario', timeoutMs: 1000,
    },
  },
})
