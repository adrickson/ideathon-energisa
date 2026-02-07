import React, { useState } from "react";
import {
  X,
  Camera,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Reportar = () => {
  const navigate = useNavigate();

  // Estados do fluxo
  const [image, setImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleUpload = () => {
    // Simula upload com uma imagem de exemplo estável (Poste com fios)
    setImage(
      "https://images.unsplash.com/photo-1563267926-2e90c2fb3b30?auto=format&fit=crop&q=80&w=400",
    );
    setImgError(false);
    setIsAnalyzing(true);

    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 2500);
  };

  const handleSend = () => {
    navigate("/");
    alert("Reporte enviado com sucesso!");
  };

  return (
    <div className="fixed inset-0 bg-gray-200 z-50 flex justify-center font-sans text-gray-900">
      <div className="w-full max-w-md h-full bg-gray-50 flex flex-col shadow-2xl relative overflow-hidden">
        {/* Barra Superior */}
        <div className="bg-white px-6 py-4 flex justify-between items-center shadow-sm z-10 shrink-0">
          <h2 className="text-gray-800 font-bold text-lg">Nova Solicitação</h2>
          <button
            onClick={() => navigate("/")}
            className="bg-gray-100 p-2 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* UPLOAD */}
        {!image && (
          <div className="flex-1 p-6 flex flex-col justify-center items-center overflow-y-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Identificar Problema
              </h3>
              <p className="text-gray-500">Tire uma foto para a IA analisar.</p>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleUpload}
              className="w-full aspect-4/5 max-h-400px bg-white border-2 border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center gap-4 shadow-sm hover:border-[#F37021] hover:bg-orange-50 transition-colors group cursor-pointer"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
                <Camera
                  size={32}
                  className="text-gray-400 group-hover:text-[#F37021]"
                />
              </div>
              <div className="text-center">
                <p className="font-bold text-[#F37021] text-lg">Tirar Foto</p>
                <p className="text-xs text-gray-400 mt-1">
                  ou selecione da galeria
                </p>
              </div>
            </motion.button>
          </div>
        )}

        {/*  LOADING  */}
        {isAnalyzing && (
          <div className="flex-1 flex flex-col justify-center items-center p-8 bg-white">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="mb-6"
            >
              <Loader2 size={48} className="text-[#F37021]" />
            </motion.div>
            <h3 className="text-xl font-bold text-gray-800">
              Analisando Imagem...
            </h3>
            <p className="text-gray-500 text-sm mt-2 text-center">
              Identificando riscos na rede elétrica.
            </p>
          </div>
        )}

        {/* RESULTADO */}
        {analysisComplete && (
          <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6">
              {/* Card da Imagem com Tratamento de Erro */}
              <div className="flex gap-4 mb-6 items-center bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                {/* Se der erro na imagem, mostra icone, senão mostra a foto */}
                {imgError ? (
                  <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400">
                    <ImageIcon size={24} />
                  </div>
                ) : (
                  <img
                    src={image}
                    onError={() => setImgError(true)} // Se quebrar, ativa o fallback
                    alt="Problema identificado"
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}

                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">
                    Status
                  </p>
                  <div className="flex items-center gap-1 text-green-600 font-bold text-sm">
                    <CheckCircle size={14} /> Análise Concluída
                  </div>
                </div>
              </div>

              <h3 className="font-bold text-gray-800 mb-4">
                Dados Identificados
              </h3>

              <div className="space-y-4">
                {/* Tipo */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#F37021]"></div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">
                    Tipo de Ocorrência
                  </label>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-800">
                      Cabo Rompido
                    </span>
                    <AlertTriangle size={18} className="text-[#F37021]" />
                  </div>
                </div>

                {/* Local */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">
                    Localização Automática
                  </label>
                  <div className="flex items-center gap-2 text-gray-800">
                    <MapPin size={18} className="text-gray-400" />
                    <input
                      type="text"
                      value="Rua das Acácias, 120 - Centro"
                      className="w-full bg-transparent outline-none font-medium"
                      readOnly
                    />
                  </div>
                </div>

                {/* Observação */}
                <div>
                  <label className="text-xs text-gray-500 font-bold ml-1">
                    Observações (Opcional)
                  </label>
                  <textarea
                    className="w-full mt-2 p-3 rounded-xl border border-gray-200 bg-white text-sm focus:border-[#0096D6] outline-none"
                    rows={2}
                    placeholder="Descreva mais detalhes..."
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border-t border-gray-100 shrink-0">
              <button
                onClick={handleSend}
                className="w-full bg-[#0096D6] hover:bg-[#007bb0] text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-100 transition-all active:scale-95 flex justify-center items-center gap-2 text-lg"
              >
                Confirmar Solicitação
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reportar;
