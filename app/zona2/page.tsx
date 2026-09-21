import { nucleo } from '@/lib/nucleo'
import { exigirModulo } from '@/lib/pagina'
import { FormularioConcluir } from './FormularioConcluir'

type Tarefa = { id: string; titulo: string; concluida: boolean; versao: number }

export default async function Tarefas() {
  await exigirModulo('zona2.tarefas')
  const tarefas = (await nucleo.destino('dominio-c').get<Tarefa[]>('/v1/tarefas')).body ?? []
  return (
    <>
      <h1>Tarefas</h1>
      <ul>
        {tarefas.map((t) => (
          <li key={t.id}>
            {t.titulo} — {t.concluida ? 'concluída' : 'pendente'}
            {!t.concluida && (
              <FormularioConcluir id={t.id} versao={String(t.versao)} />
            )}
          </li>
        ))}
      </ul>
    </>
  )
}
