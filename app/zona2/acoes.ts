'use server'

import { nucleo } from '@/lib/nucleo'
import { acaoProtegida } from '@/lib/pagina'

/**
 * Conclui a tarefa e leva o usuário para OUTRA zona. O toast vai num cookie de flash,
 * porque a navegação entre zonas troca o documento e um evento em memória se perderia.
 * Versão desatualizada vira `REGISTRO_DESATUALIZADO` no toast, de volta a /zona2.
 */
export async function concluirTarefa(form: FormData) {
  return acaoProtegida({ modulo: 'zona2', funcionalidade: 'tarefas.concluir' }, '/zona2', async () => {
    await nucleo.destino('dominio-c').post('/v1/tarefas/:id/concluir', {
      params: { id: String(form.get('id') ?? '') },
      ifMatch: `"${String(form.get('versao') ?? '')}"`,
      corpo: {},
    })
    return { toast: { tipo: 'sucesso', texto: 'Tarefa concluída.' }, destino: '/zona1' }
  })
}
