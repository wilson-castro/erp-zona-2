'use server'

import { Desatualizado, ErroDeAplicacao } from '@erp/nucleo'
import { MENSAGENS } from '@erp/contratos'
import { nucleo } from '@/lib/nucleo'
import { exigirNaAcao, flash } from '@/lib/pagina'

/**
 * Conclui a tarefa e devolve para ONDE o navegador deve ir. O toast vai num cookie de flash,
 * porque a navegação entre zonas troca o documento e um evento em memória se perderia.
 *
 * Não usa `redirect()`: numa action chamada pelo cliente, o Next busca o payload RSC do
 * destino no PRÓPRIO processo (`http://<esta zona>/zona1`), que não tem a rota, e o
 * navegador receberia o 404 da zona 2 no endereço da zona 1. Redirecionar para outra zona
 * a partir de uma action é limitação de Multi-Zones; quem troca de documento é a ilha.
 */
export async function concluirTarefa(form: FormData): Promise<{ destino: string }> {
  await exigirNaAcao('zona2.tarefas')   // invariante 5: primeiro bloco
  const id = String(form.get('id') ?? '')
  const versao = String(form.get('versao') ?? '')

  try {
    await nucleo.destino('dominio-c').post('/v1/tarefas/:id/concluir', {
      params: { id }, ifMatch: `"${versao}"`, corpo: {},
    })
  } catch (e) {
    const codigo = e instanceof Desatualizado ? 'REGISTRO_DESATUALIZADO'
      : e instanceof ErroDeAplicacao ? e.codigo : 'ERRO_INTERNO'
    await flash({ tipo: 'erro', texto: MENSAGENS[codigo] })
    return { destino: '/zona2' }
  }
  await flash({ tipo: 'sucesso', texto: 'Tarefa concluída.' })
  return { destino: '/zona1' }
}
