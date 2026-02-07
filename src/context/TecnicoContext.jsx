import React, { createContext, useState, useEffect, useCallback } from "react";
import { generateUUID } from "../utils/helpers.js";

const STORAGE_KEY = "@energisa_ideathon:tecnico";

const TecnicoContext = createContext(null);

export function TecnicoProvider({ children }) {
  const [tecnico, setTecnico] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setTecnico(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Erro ao carregar técnico do localStorage:", error);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    if (!carregando && tecnico) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tecnico));
      } catch (error) {
        console.error("Erro ao salvar técnico no localStorage:", error);
      }
    }
  }, [tecnico, carregando]);

  const login = useCallback((email, nome = "Técnico Avisa Energisa") => {
    const novoTecnico = {
      id: generateUUID(),
      email,
      nome,
      funcao: "Técnico de Segurança",
      loginEm: new Date().toISOString(),
      dispositivo: null,
    };
    setTecnico(novoTecnico);
    return novoTecnico;
  }, []);

  const logout = useCallback(() => {
    setTecnico(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Erro ao remover técnico do localStorage:", error);
    }
  }, []);

  const conectarDispositivo = useCallback((dadosDispositivo) => {
    setTecnico((prev) => {
      if (!prev) return prev;
      const tecnicoAtualizado = {
        ...prev,
        dispositivo: {
          ...dadosDispositivo,
          conectadoEm: new Date().toISOString(),
          status: "conectado",
        },
      };
      return tecnicoAtualizado;
    });
  }, []);

  const desconectarDispositivo = useCallback(() => {
    setTecnico((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        dispositivo: null,
      };
    });
  }, []);

  return (
    <TecnicoContext.Provider
      value={{
        tecnico,
        carregando,
        login,
        logout,
        conectarDispositivo,
        desconectarDispositivo,
        isAutenticado: !!tecnico,
      }}
    >
      {children}
    </TecnicoContext.Provider>
  );
}

export default TecnicoContext;
