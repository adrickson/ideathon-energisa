import { useContext } from "react";
import TecnicoContext from "../context/TecnicoContext.jsx";

export function useTecnico() {
  const context = useContext(TecnicoContext);
  if (!context) {
    throw new Error("useTecnico deve ser usado dentro de TecnicoProvider");
  }
  return context;
}

export default useTecnico;
