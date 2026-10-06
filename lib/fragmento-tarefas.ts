import 'server-only'

type Tarefa = { titulo: string; concluida: boolean }

const ENTIDADES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }
const escapar = (texto: string) => texto.replace(/[&<>"']/g, (c) => ENTIDADES[c] ?? c)

/**
 * Bloco "Tarefas pendentes" que a zona 2 entrega como fragmento (ADR-0011). HTML inerte (`02-zonas.md` §2.3): sem
 * script, sem manipulador, só o título de cada tarefa, escapado. Lista vazia ainda é bloco: "não há" não é "não pode".
 */
export function htmlDasTarefasPendentes(tarefas: readonly Tarefa[]): string {
  const pendentes = tarefas.filter((t) => !t.concluida)
  const corpo = pendentes.length > 0
    ? `<ul>${pendentes.map((t) => `<li>${escapar(t.titulo)}</li>`).join('')}</ul>`
    : '<p>Nenhuma tarefa pendente.</p>'
  return '<section data-fragmento="zona2/tarefas" aria-labelledby="fragmento-zona2-tarefas">'
    + '<h2 id="fragmento-zona2-tarefas">Tarefas pendentes (zona 2)</h2>'
    + `${corpo}<p><a href="/zona2">Abrir as tarefas</a></p></section>`
}
