import React, { useState } from "react";
import {
  Camera,
  MapPin,
  AlertTriangle,
  ChevronRight,
  HardHat,
  Wifi,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import { useNavigate } from "react-router-dom";
import { useReportes } from "../hooks/useReportes.js";
import { useTecnico } from "../hooks/useTecnico.js";
import { formatRelativeTime } from "../utils/helpers.js";

const STATUS_LABELS = {
  pendente: { label: "Pendente", className: "bg-muted text-muted-foreground" },
  em_analise: { label: "Em análise", className: "bg-yellow-500/20 text-yellow-600" },
  verificando: { label: "Verificando", className: "bg-primary/10 text-primary" },
  resolvido: { label: "Resolvido", className: "bg-green-500/20 text-green-600" },
};

const STATUS_ICONS = {
  pendente: AlertTriangle,
  em_analise: AlertTriangle,
  verificando: MapPin,
  resolvido: CheckCircle,
};

const TIPO_LABELS = {
  cabo_rompido: "Cabo Rompido",
  cabo_baixo: "Cabo Baixo",
  poste_danificado: "Poste Danificado",
  transformador_queimado: "Transformador",
  falta_energia: "Falta de Energia",
  outro: "Outro",
};

function CheckCircle(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

const Home = () => {
  const navigate = useNavigate();
  const { reportes, dispositivo: dispositivoReportes, removerReporte } = useReportes();
  const { tecnico } = useTecnico();
  const [showHistory, setShowHistory] = useState(false);

  const dispositivo = tecnico?.dispositivo || dispositivoReportes;

  return (
    <div className="pb-24 px-4 max-w-md mx-auto pt-6 font-sans text-foreground">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold text-foreground">Olá, Cidadão.</h2>
        <p className="text-muted-foreground text-sm">
          Ajude a manter a energia fluindo com segurança.
        </p>
      </motion.div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate("/reportar")}
        className="w-full bg-gradient-to-r from-[#019ac5] to-[#caee74] text-white p-6 rounded-3xl shadow-xl shadow-primary/20 flex flex-col items-center gap-3 mb-10 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-20 rounded-full blur-2xl -mr-10 -mt-10"></div>

        <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm border border-white/30">
          <Camera size={32} strokeWidth={2.5} />
        </div>
        <div className="text-center z-10">
          <h3 className="text-xl font-bold">Reportar Ocorrência</h3>
          <p className="text-primary-foreground/80 text-sm font-medium">
            Identificar risco na rede
          </p>
        </div>
      </motion.button>

      {dispositivo && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-green-500/10 border border-green-500/20 rounded-xl p-3 flex items-center gap-3"
        >
          <div className="bg-green-500/20 p-2 rounded-full">
            <Wifi className="w-4 h-4 text-green-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-green-500">
              {dispositivo.nome}
            </p>
            <p className="text-xs text-green-500/80">
              Código: {dispositivo.codigo}
            </p>
          </div>
          <span className="text-xs font-bold text-green-500 bg-green-500/20 px-2 py-1 rounded-full">
            Ativo
          </span>
        </motion.div>
      )}

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <MapPin size={18} className="text-primary" />{" "}
            {showHistory ? "Histórico" : "Perto de você"}
          </h3>
          {reportes.length > 0 && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-xs text-primary font-medium hover:underline"
            >
              {showHistory ? "Ver próximos" : "Ver todos"}
            </button>
          )}
        </div>

        {reportes.length === 0 ? (
          <div className="bg-card p-4 rounded-2xl shadow-sm border border-border flex gap-4 items-center">
            <div className="bg-accent/10 p-3 rounded-xl text-accent">
              <AlertTriangle size={20} />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground text-sm">
                Nenhuma ocorrência
              </h4>
              <p className="text-muted-foreground text-xs mt-0.5">
                Seja o primeiro a reportar
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {reportes.slice(0, showHistory ? reportes.length : 3).map((reporte) => {
              const StatusIcon =
                STATUS_ICONS[reporte.status] || AlertTriangle;
              const statusInfo =
                STATUS_LABELS[reporte.status] || STATUS_LABELS.pendente;
              return (
                <motion.div
                  key={reporte.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-card p-4 rounded-2xl shadow-sm border border-border flex gap-4 items-center group"
                >
                  <div className="bg-accent/10 p-3 rounded-xl text-accent">
                    <StatusIcon size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground text-sm">
                      {TIPO_LABELS[reporte.tipo] || reporte.tipo || "Problema"}
                    </h4>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      {formatRelativeTime(reporte.timestamp)} •{" "}
                      {reporte.endereco || "Localização automática"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${statusInfo.className}`}
                    >
                      {statusInfo.label}
                    </span>
                    <button
                      onClick={() => removerReporte(reporte.id)}
                      className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {reportes.length > 3 && !showHistory && (
          <p className="text-xs text-muted-foreground text-center mt-3">
            +{reportes.length - 3} ocorrências próximas
          </p>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-6 border-t border-border pt-6"
      >
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 pl-1">
          Área Técnica
        </p>
        <button
          onClick={() => navigate("/professional")}
          className="w-full bg-secondary text-secondary-foreground p-4 rounded-xl flex items-center justify-between shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg">
              <HardHat size={20} className="text-accent" />
            </div>
            <div className="text-left">
              <p className="font-bold text-sm">
                {dispositivo ? "Dispositivo Conectado" : "Modo Profissional"}
              </p>
              <p className="text-xs text-secondary-foreground/70">
                {dispositivo
                  ? `${dispositivo.codigo}`
                  : "Conectar dispositivo IoT"}
              </p>
            </div>
          </div>
          <ChevronRight size={20} className="text-secondary-foreground/50" />
        </button>
      </motion.div>
    </div>
  );
};

export default Home;
