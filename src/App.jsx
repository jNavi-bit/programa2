import React, { useState, useEffect } from "react";
import Header from "./Header";
import Dashboard from "./Dashboard";
import useContador from './logica/Contador';

export default function App() {
  const [iniciado, setIniciado] = useState(false);
  const [pausado, setPausado] = useState(false);

  const [lotes, setLotes] = useState([]);
  const [loteActivo, setLoteActivo] = useState(null);
  const [procesosFinalizados, setProcesosFinalizados] = useState([]);

  const segundos = useContador(iniciado, pausado);

  // Lógica para las interrupciones por teclado
  useEffect(() => {
    const handleKeyPress = (event) => {
      const key = event.key.toLowerCase();
      
      if (key === "p") setPausado(true);
      if (key === "c") setPausado(false);

      if (!iniciado || pausado || !loteActivo || loteActivo.procesos.length === 0) return;

      const copiaLote = JSON.parse(JSON.stringify(loteActivo));

      if (key === 'w') {
        const procesoInterrumpido = copiaLote.procesos.shift();
        procesoInterrumpido.resultadoFinal = 'ERROR';
        procesoInterrumpido.estado = 'error';
        setProcesosFinalizados(prev => [...prev, procesoInterrumpido]);
        // AÑADIMOS LA MISMA VERIFICACIÓN DE FIN AQUÍ
        if (copiaLote.procesos.length === 0 && lotes.length === 0) {
          setIniciado(false);
          setLoteActivo(copiaLote);
        } else {
          setLoteActivo(copiaLote);
        }
      }

      if (key === 'e') {
        const procesoBloqueado = copiaLote.procesos.shift();
        copiaLote.procesos.push(procesoBloqueado);
        setLoteActivo(copiaLote);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [iniciado, pausado, loteActivo, lotes]); // Añadimos 'lotes' a las dependencias

  // Función para activar el siguiente lote
  const setearLoteActivo = () => {
    if (lotes.length === 0) {
      setLoteActivo(null);
      // Detenemos la simulación si ya no hay más lotes que procesar
      setIniciado(false);
      return;
    }
    const copiaLotes = [...lotes];
    const siguienteLote = copiaLotes.shift();
    setLoteActivo(siguienteLote);
    setLotes(copiaLotes);
  };

  // Al iniciar, activamos automáticamente el primer lote
  useEffect(() => {
    if (iniciado && !loteActivo && lotes.length > 0) {
      setearLoteActivo();
    }
  }, [iniciado]);

  // BUCLE PRINCIPAL DE EJECUCIÓN
  useEffect(() => {
    if (!iniciado || pausado || !loteActivo) return;

    if (loteActivo.procesos.length === 0) {
      setearLoteActivo();
      return;
    }
    
    const copiaLoteActivo = JSON.parse(JSON.stringify(loteActivo));
    const procesoActual = copiaLoteActivo.procesos[0];
    procesoActual.tiempoRestante -= 1;

    if (procesoActual.tiempoRestante <= 0) {
      procesoActual.tiempoRestante = 0;
      const procesoTerminado = copiaLoteActivo.procesos.shift();
      procesoTerminado.resultadoFinal = `${procesoTerminado.operation.operacionTexto} = ${procesoTerminado.operation.resultado}`;
      procesoTerminado.estado = 'finalizado';
      setProcesosFinalizados(prev => [...prev, procesoTerminado]);
      
      // ***** CAMBIO CLAVE *****
      // Si el lote actual ahora está vacío Y no hay más lotes en espera,
      // detenemos la simulación INMEDIATAMENTE.
      if (copiaLoteActivo.procesos.length === 0 && lotes.length === 0) {
        setIniciado(false);
      }
    }
    
    setLoteActivo(copiaLoteActivo);

  }, [segundos]);
  
  

  return (
    <>
      <Header
        segundos={segundos}
        iniciado={iniciado}
        setIniciado={setIniciado}
        pausado={pausado}
        setPausado={setPausado}
        setLotes={setLotes}
        lotes={lotes}
      />
      <Dashboard
        lotes={lotes}
        loteActivo={loteActivo}
        procesosFinalizados={procesosFinalizados}
      />
    </>
  );
}