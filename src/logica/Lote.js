import Proceso from './Proceso';

const MAX_PROCESOS = 4;

class Lote {
  static ultimoId = 0;

  constructor(procesos = []) {
    this.idLote = ++Lote.ultimoId;
    this.procesos = procesos.slice(0, MAX_PROCESOS);
    this.procesosFinalizados = [];  // nueva propiedad para procesos terminados
  }

  agregarProceso(proceso) {
    if (this.procesos.length < MAX_PROCESOS) {
      this.procesos.push(proceso);
      return true;
    }
    return false;
  }

  estaLleno() {
    return this.procesos.length >= MAX_PROCESOS;
  }

  finalizarProceso(proceso, resultado) {
    const index = this.procesos.findIndex(p => p.id === proceso.id);
    if (index !== -1) {
      proceso.resultadoFinal = resultado;
      proceso.estado = resultado === 'ERROR' ? 'error' : 'finalizado';
      this.procesosFinalizados.push(proceso);
      this.procesos.splice(index, 1);
    }
  }

  moverProcesoAlFinal(proceso) {
    const index = this.procesos.findIndex(p => p.id === proceso.id);
    if (index !== -1) {
      this.procesos.splice(index, 1);  // quitar de la posición actual
      this.procesos.push(proceso);     // agregar al final
    }
  }
}

export default Lote;
