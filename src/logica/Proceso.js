import Operacion from './Operacion';

const min = 6;
const max = 20;

class Proceso {
  static ultimoId = 0;

  constructor() {
    this.id = ++Proceso.ultimoId;
    this.tiempoMaximo = Math.floor(Math.random() * (max - min + 1)) + min;
    this.tiempoRestante = this.tiempoMaximo;
    this.operation = new Operacion();
    this.estado = 'pendiente';      // 'pendiente' | 'enEjecucion' | 'finalizado' | 'error'
    this.resultadoFinal = null;     // se llenará al finalizar o con ERROR
    this.idLoteOriginal = null;     // NUEVO: Para saber a qué lote pertenecía
  }
}

export default Proceso;