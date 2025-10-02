import React from 'react';
import './Dashboard.css';

export default function Dashboard({ lotes = [], loteActivo, procesosFinalizados = [] }) {
  
  // Lógica para agrupar los procesos finalizados por el ID de su lote original
  const lotesFinalizados = procesosFinalizados.reduce((acc, proceso) => {
    const idLote = proceso.idLoteOriginal;
    if (!acc[idLote]) {
      acc[idLote] = [];
    }
    acc[idLote].push(proceso);
    return acc;
  }, {});

  return (
    <div className="dboard">

      {/* PROCESOS INACTIVOS */}
      <div className={`procesos-section ${lotes.length === 0 ? 'empty' : ''}`}>
        <label className="section-title">Procesos Pendientes</label>
        {lotes.length === 0 && <label className="empty-text">No hay lotes pendientes.</label>}
        {lotes.map((lote) => (
          <div key={lote.idLote} className="lote-card">
            <label className="lote-title">Lote {lote.idLote}</label>
            <div className="procesos-list">
              {lote.procesos?.map((proceso) => (
                <div key={proceso.id} className="proceso-item">
                  <label>Proceso #{proceso.id}</label>
                  <label>Tiempo máximo: {proceso.tiempoMaximo}s</label>
                  <label>Tiempo restante: {proceso.tiempoRestante}s</label>
                  <label>Operación: {proceso.operation.operacionTexto}</label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* PROCESO EN EJECUCIÓN */}
      <div className={`procesos-section ${!loteActivo ? 'empty' : 'activo'}`}>
        <label className="section-title">Proceso en Ejecución</label>
        {!loteActivo && <label className="empty-text">No hay procesos en ejecución.</label>}
        {loteActivo && loteActivo.procesos.length > 0 && (
          <div className="lote-card activo">
            <label className="lote-title">Lote {loteActivo.idLote} (Activo)</label>
            <div className="procesos-list">
              {/* Proceso actual en ejecución */}
              <div className="proceso-item en-ejecucion">
                <label>Proceso #{loteActivo.procesos[0].id}</label>
                <label>Tiempo maximo: {loteActivo.procesos[0].tiempoMaximo}s</label>
                <label>Tiempo Restante: {loteActivo.procesos[0].tiempoRestante}s</label>
                <label>Operación: {loteActivo.procesos[0].operation.operacionTexto}</label>
              </div>
              {/* Siguientes procesos del lote */}
              {loteActivo.procesos.slice(1).map((proceso) => (
                <div key={proceso.id} className="proceso-item">
                  <label>Proceso #{proceso.id}</label>
                  <label>Tiempo máximo: {proceso.tiempoMaximo}s</label>
                  <label>Tiempo restante: {proceso.tiempoRestante}s</label>
                  <label>Operación: {proceso.operation.operacionTexto}</label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* PROCESOS FINALIZADOS */}
      <div className={`procesos-section ${procesosFinalizados.length === 0 ? 'empty' : ''}`}>
        <label className="section-title">Procesos Finalizados</label>
        {procesosFinalizados.length === 0 && <label className="empty-text">No hay procesos finalizados.</label>}
        
        {Object.entries(lotesFinalizados).map(([idLote, procesos]) => (
          <div key={`lote-finalizado-${idLote}`} className="lote-card finalizado">
            <label className="lote-title">Lote {idLote}</label>
            <div className="procesos-list">
              {procesos.map((proceso) => (
                <div key={proceso.id} className="proceso-item">
                  <label>Proceso #{proceso.id}</label>
                  <label>Tiempo maximo: {proceso.tiempoMaximo}s</label>
                  <label>Tiempo restante: {proceso.tiempoRestante}s</label>
                  <label>{proceso.resultadoFinal}</label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}