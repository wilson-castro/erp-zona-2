import { responderFragmento } from '@erp/nucleo'
import { nucleo } from '@/lib/nucleo'
import { htmlDasTarefasPendentes } from '@/lib/fragmento-tarefas'

type Tarefa = { id: string; titulo: string; concluida: boolean }

/**
 * Fragmento `tarefas` da zona 2 (ADR-0011): a zona 1 o embute no painel. URL `/zona2/_fragmento/tarefas/{id}`; a pasta
 * é `%5Ffragmento` porque pasta com `_` é privada no App Router. Sessão e módulo são verificados aqui; cache, navegação
 * direta, versão do contrato e HTML inerte ficam com o helper do núcleo. Negado, sem sessão ou chave desconhecida: 204.
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
  return responderFragmento(req, async () => {
    await nucleo.acesso.exigirModulo('zona2', 'tarefas.ver')
    const { id } = await params
    if (id !== 'pendentes') return null
    const tarefas = (await nucleo.destino('dominio-c').get<Tarefa[]>('/v1/tarefas')).body ?? []
    return htmlDasTarefasPendentes(tarefas)
  })
}
