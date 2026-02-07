import React, { createContext, useState, useEffect, useCallback } from "react";
import { generateUUID, calcularDistancia } from "../utils/helpers.js";

const STORAGE_KEY = "@energisa_ideathon:reportes";
const DISPOSITIVO_KEY = "@energisa_ideathon:dispositivo";

const ReportesContext = createContext(null);

export function ReportesProvider({ children }) {
  const [reportes, setReportes] = useState([]);
  const [dispositivo, setDispositivo] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    try {
      const storedReportes = localStorage.getItem(STORAGE_KEY);
      const storedDispositivo = localStorage.getItem(DISPOSITIVO_KEY);

      if (storedReportes) {
        setReportes(JSON.parse(storedReportes));
      }

      if (storedDispositivo) {
        setDispositivo(JSON.parse(storedDispositivo));
      }
    } catch (error) {
      console.error("Erro ao carregar dados do localStorage:", error);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    if (!carregando) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reportes));
      } catch (error) {
        console.error("Erro ao salvar reportes no localStorage:", error);
      }
    }
  }, [reportes, carregando]);

  useEffect(() => {
    if (!carregando && dispositivo) {
      try {
        localStorage.setItem(DISPOSITIVO_KEY, JSON.stringify(dispositivo));
      } catch (error) {
        console.error("Erro ao salvar dispositivo no localStorage:", error);
      }
    }
  }, [dispositivo, carregando]);

  const adicionarReporte = useCallback((dadosReporte) => {
    const novoReporte = {
      id: generateUUID(),
      timestamp: new Date().toISOString(),
      status: "pendente",
      ...dadosReporte,
    };

    setReportes((prev) => [novoReporte, ...prev]);
    return novoReporte;
  }, []);

  const atualizarStatusReporte = useCallback((id, novoStatus) => {
    setReportes((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: novoStatus } : r
      )
    );
  }, []);

  const removerReporte = useCallback((id) => {
    setReportes((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const limparTodosReportes = useCallback(() => {
    setReportes([]);
  }, []);

  const conectarDispositivo = useCallback((dadosDispositivo) => {
    const dispositivoConectado = {
      ...dadosDispositivo,
      conectadoEm: new Date().toISOString(),
      status: "conectado",
    };
    setDispositivo(dispositivoConectado);
    return dispositivoConectado;
  }, []);

  const desconectarDispositivo = useCallback(() => {
    setDispositivo(null);
  }, []);

  const getReportesPorStatus = useCallback((status) => {
    return reportes.filter((r) => r.status === status);
  }, [reportes]);

  const getReportesProximos = useCallback((lat, lng, raioKm = 5) => {
    return reportes.filter((r) => {
      if (!r.latitude || !r.longitude) return false;
      const distancia = calcularDistancia(lat, lng, r.latitude, r.longitude);
      return distancia <= raioKm;
    });
  }, [reportes]);

  const value = {
    reportes,
    dispositivo,
    carregando,
    adicionarReporte,
    atualizarStatusReporte,
    removerReporte,
    limparTodosReportes,
    conectarDispositivo,
    desconectarDispositivo,
    getReportesPorStatus,
    getReportesProximos,
  };

  return (
    <ReportesContext.Provider value={value}>
      {children}
    </ReportesContext.Provider>
  );
}

export default ReportesContext;
