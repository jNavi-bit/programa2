import React, { useState, useRef, useEffect } from 'react';
import './Header.css';
import Proceso from './logica/Proceso';
import Lote from './logica/Lote';

export default function Header({ segundos, iniciado, setIniciado, pausado, setPausado, setLotes, lotes }) {
  const [mostrar, setMostrar] = useState(false);
  const [numeroProcesos, setNumeroProcesos] = useState("");
  const [cantidadProcesos, setCantidadProcesos] = useState(0);
  const formRef = useRef(null);

  const valorNumerico = Number(numeroProcesos);
  const numeroValido = valorNumerico > 0;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setMostrar(false);
      }
    };
    if (mostrar) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mostrar]);

  const crearLotes = (cantidad, lotesExistentes = []) => {
    const lotesGenerados = [...lotesExistentes];
    let loteActual = lotesGenerados.length > 0 ? lotesGenerados[lotesGenerados.length - 1] : new Lote();

    for (let i = 0; i < cantidad; i++) {
      const proceso = new Proceso();

      if (!loteActual.agregarProceso(proceso)) {
        loteActual = new Lote();
        loteActual.agregarProceso(proceso);
        lotesGenerados.push(loteActual);
      } else if (!lotesGenerados.includes(loteActual)) {
        lotesGenerados.push(loteActual);
      }
      
      // MODIFICACIÓN: Asignamos el ID del lote al proceso
      proceso.idLoteOriginal = loteActual.idLote;
    }

    return lotesGenerados;
  };

  return (
    <header className="Header">
      <div className="header-content">
        <button onClick={() => setMostrar(true)} className="btnAgregarProceso">
          Añadir procesos
        </button>
        <label className="lblTiempo">
          Tiempo transcurrido: <span>{segundos}s</span>
          {pausado && <span className="paused-text">(Pausado)</span>}
        </label>
        <button onClick={() => setIniciado(true)} disabled={lotes.length <= 0 || iniciado} className="btnIniciar">
          Iniciar
        </button>
      </div>

      {mostrar && (
        <div className="modal-overlay">
          <div ref={formRef} className="modal-content">
            <input
              type="number"
              value={numeroProcesos}
              onChange={(e) => setNumeroProcesos(e.target.value)}
              placeholder="Número de procesos"
            />

            {!numeroValido && numeroProcesos !== "" && (
              <div className="error-message">El número debe ser mayor a 0</div>
            )}

            <button
              onClick={() => {
                setMostrar(false);
                setCantidadProcesos(prev => prev + valorNumerico);
                const lotesCreados = crearLotes(valorNumerico, lotes);
                setLotes(lotesCreados);
                setNumeroProcesos("");
              }}
              disabled={!numeroValido}
            >
              Agregar procesos
            </button>
          </div>
        </div>
      )}
    </header>
  );
}