import Proceso from './Proceso';
import Lote from './Lote';

export default function generarLotes(n) {
  const procesos = Array.from({ length: n }, () => new Proceso());
  const lotes = [];

  for (let i = 0; i < procesos.length; i += 4) {
    const grupo = procesos.slice(i, i + 4);
    lotes.push(new Lote(grupo));
  }

  return lotes;
}
