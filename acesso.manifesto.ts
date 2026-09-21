import { definirManifesto } from '@erp/contratos'

export default definirManifesto({
  zona: 'zona2',
  modulos: [{ id: 'zona2.tarefas', rotulo: 'Tarefas', prefixo: '/zona2', restritoPorPadrao: true }],
  perfis: [{ id: 'zona2.operador', rotulo: 'Operador da zona 2' }],
  concessoes: { 'zona2.operador': ['zona2.tarefas'] },
})
