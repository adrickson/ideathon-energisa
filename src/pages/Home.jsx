import React from "react";
import {
  Camera,
  MapPin,
  AlertTriangle,
  ChevronRight,
  HardHat,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="pb-24 px-4 max-w-md mx-auto pt-6 font-sans text-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold text-gray-800">Olá, Cidadão.</h2>
        <p className="text-gray-500 text-sm">
          Ajude a manter a energia fluindo com segurança.
        </p>
      </motion.div>

      {/* BOTÃO PRINCIPAL: Gradiente Laranja (Energia) */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate("/reportar")}
        className="w-full bg-linear-to-br from-[#F37021] to-[#FF9E1B] text-white p-6 rounded-3xl shadow-xl shadow-orange-200 flex flex-col items-center gap-3 mb-10 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-20 rounded-full blur-2xl -mr-10 -mt-10"></div>

        <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm border border-white/30">
          <Camera size={32} strokeWidth={2.5} />
        </div>
        <div className="text-center z-10">
          <h3 className="text-xl font-bold">Reportar Ocorrência</h3>
          <p className="text-orange-50 text-sm font-medium">
            Identificar risco na rede
          </p>
        </div>
      </motion.button>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <MapPin size={18} className="text-[#0096D6]" /> Perto de você
          </h3>
          <span className="text-xs text-gray-400 font-medium">
            Camaçari, BA
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-center mb-3">
          <div className="bg-orange-50 p-3 rounded-xl text-[#F37021]">
            <AlertTriangle size={20} />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800 text-sm">Cabo Baixo</h4>
            <p className="text-xs text-gray-500 mt-0.5">
              Há 15 min • Em análise
            </p>
          </div>
          <span className="text-[10px] font-bold text-[#0096D6] bg-cyan-50 px-2 py-1 rounded-full uppercase">
            Verificando
          </span>
        </div>
      </div>

      {/* Botão Profissional */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-6 border-t border-gray-200 pt-6"
      >
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 pl-1">
          Área Técnica
        </p>
        <button className="w-full bg-[#2D3E50] text-white p-4 rounded-xl flex items-center justify-between shadow-lg shadow-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg">
              <HardHat size={20} className="text-[#FF9E1B]" />
            </div>
            <div className="text-left">
              <p className="font-bold text-sm">Modo Profissional</p>
              <p className="text-xs text-gray-400">Conectar dispositivo IoT</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-gray-500" />
        </button>
      </motion.div>
    </div>
  );
};

export default Home;
