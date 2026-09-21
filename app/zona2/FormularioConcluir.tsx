'use client'

import { concluirTarefa } from './acoes'

/**
 * Recebe só id e versão (invariante 2). Depois da action, troca o documento inteiro:
 * `location.assign` e não o roteador, porque o destino é outra zona.
 */
export function FormularioConcluir({ id, versao }: { id: string; versao: string }) {
  return (
    <form action={async (dados) => { window.location.assign((await concluirTarefa(dados)).destino) }}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="versao" value={versao} />
      <button type="submit">Concluir e ir para a zona 1</button>
    </form>
  )
}
