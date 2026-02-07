import { useContext } from "react";
import ReportesContext from "../context/ReportesContext.jsx";

export function useReportes() {
  const context = useContext(ReportesContext);
  if (!context) {
    throw new Error("useReportes deve ser usado dentro de ReportesProvider");
  }
  return context;
}

export default useReportes;
