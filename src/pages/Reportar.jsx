import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  X,
  Camera,
  MapPin,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Loader2,
  Unlink,
  ArrowBigDown,
  Construction,
  Cpu,
  LightbulbOff,
  HelpCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; // eslint-disable-line no-unused-vars
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext.js";
import { useReportes } from "../hooks/useReportes.js";

const TIPOS_OCORRENCIA = [
  { id: "cabo_rompido", label: "Cabo Rompido", icon: Unlink },
  { id: "cabo_baixo", label: "Cabo Baixo", icon: ArrowBigDown },
  { id: "poste_danificado", label: "Poste Danificado", icon: Construction },
  { id: "transformador_queimado", label: "Transformador", icon: Cpu },
  { id: "falta_energia", label: "Falta de Energia", icon: LightbulbOff },
  { id: "outro", label: "Outro", icon: HelpCircle },
];

const Reportar = () => {
  const navigate = useNavigate();
  const { toastSuccess, toastError } = useToast();
  const { adicionarReporte } = useReportes();


  const [step, setStep] = useState("foto");
  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [tipoSelecionado, setTipoSelecionado] = useState(null);
  const [observacoes, setObservacoes] = useState("");
  const [endereco, setEndereco] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erroCamera, setErroCamera] = useState(null);
  const [cameraAtiva, setCameraAtiva] = useState(false);
  const [stream, setStream] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const cameraSuportado = !!(
    typeof navigator !== "undefined" &&
    navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia
  );

  const iniciarCamera = useCallback(async () => {
    if (!cameraSuportado) {
      toastError({
        title: "Câmera indisponível",
        message: "Seu navegador não suporta acesso à câmera. Use a galeria.",
      });
      return;
    }

    try {
      setErroCamera(null);
      let mediaStream = null;
      
      // Tentativa 1: Sem constraints específicas (mais compatível)
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      } catch {
        console.log("Tentativa 1 falhou, tentando com facingMode...");
      }
      
      // Tentativa 2: Com câmera traseira (mobile)
      if (!mediaStream) {
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },
            audio: false,
          });
        } catch {
          console.log("Tentativa 2 falhou, tentando câmera frontal...");
        }
      }

      // Tentativa 3: Com câmera frontal
      if (!mediaStream) {
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" },
            audio: false,
          });
        } catch {
          console.log("Tentativa 3 falhou...");
        }
      }
      
      if (!mediaStream) {
        throw new Error("Não foi possível acessar nenhuma câmera");
      }
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCameraAtiva(true);
    } catch (error) {
      console.error("Erro ao acessar câmera:", error);
      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        setErroCamera(
          "Permissão de câmera negada. Para permitir: 1) Toque no ícone de cadeado na barra de endereço 2) Clique em 'Permitir' para Câmera 3) Recarregue a página"
        );
        toastError({
          title: "Permissão negada",
          message: "Toque no cadeado na barra de endereço e permita o acesso à câmera.",
        });
      } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
        setErroCamera("Nenhuma câmera encontrada no dispositivo. Use a galeria abaixo.");
        toastError({
          title: "Câmera não encontrada",
          message: "Seu dispositivo não possui câmera disponível. Use a galeria.",
        });
      } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
        setErroCamera("Câmera está em uso por outro aplicativo. Feche outros apps e tente novamente.");
        toastError({
          title: "Câmera em uso",
          message: "Feche outros aplicativos que estejam usando a câmera.",
        });
      } else if (error.name === "OverconstrainedError") {
        setErroCamera("Configuração de câmera não suportada. Use a galeria abaixo.");
        toastError({
          title: "Câmera não suportada",
          message: "Tente usar a galeria para enviar a foto.",
        });
      } else {
        setErroCamera("Erro ao iniciar câmera. Use a galeria como alternativa.");
        toastError({
          title: "Erro ao acessar câmera",
          message: "Tente usar a galeria para enviar a foto.",
        });
      }
      setCameraAtiva(false);
    }
  }, [cameraSuportado, toastError]);

  const pararCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCameraAtiva(false);
  }, [stream]);

  const capturarFoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
      setFoto(dataUrl);
      setFotoPreview(dataUrl);
      pararCamera();
      setStep("tipo");
    }
  }, [pararCamera]);

  const usarFotoGaleria = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (file) {
        if (!file.type.startsWith("image/")) {
          toastError({
            title: "Arquivo inválido",
            message: "Por favor, selecione uma imagem.",
          });
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          setFotoPreview(reader.result);
          setFoto(reader.result);
          setStep("tipo");
          toastSuccess({ message: "Foto selecionada com sucesso!" });
        };
        reader.onerror = () => {
          toastError({
            title: "Erro ao ler arquivo",
            message: "Tente selecionar outra imagem.",
          });
        };
        reader.readAsDataURL(file);
      }
    },
    [toastSuccess, toastError]
  );

  const [showTicket, setShowTicket] = useState(false);
  const [ticketData, setTicketData] = useState(null);

  const enviarReporte = useCallback(async () => {
    if (!foto || !tipoSelecionado || !endereco.trim()) {
      toastError({
        title: "Erro",
        message: "Preencha todos os campos obrigatórios (foto, tipo e endereço).",
      });
      return;
    }

    setEnviando(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const protocolo = `AV-${Date.now().toString(36).toUpperCase()}`;
      const dataEnvio = new Date().toLocaleString('pt-BR');

      const reporteData = {
        tipo: tipoSelecionado,
        latitude: null,
        longitude: null,
        endereco: endereco.trim(),
        foto: foto,
        observacoes: observacoes || null,
        status: "pendente",
        protocolo: protocolo,
        dataEnvio: dataEnvio,
      };

      adicionarReporte(reporteData);

      setTicketData(reporteData);
      setShowTicket(true);

      toastSuccess({
        title: "Reporte enviado!",
        message: `Protocolo: ${protocolo}`,
      });

    } catch {
      toastError({
        title: "Erro",
        message: "Falha ao enviar reporte. Tente novamente.",
      });
    } finally {
      setEnviando(false);
    }
  }, [
    foto,
    tipoSelecionado,
    endereco,
    observacoes,
    adicionarReporte,
    toastSuccess,
    toastError,
  ]);

  const redefinirFluxo = useCallback(() => {
    setStep("foto");
    setFoto(null);
    setFotoPreview(null);
    setTipoSelecionado(null);
    setObservacoes("");
    setEndereco("");
    pararCamera();
  }, [pararCamera]);

  useEffect(() => {
    return () => {
      pararCamera();
    };
  }, [pararCamera]);

  // Verificar permissões da câmera ao montar o componente
  useEffect(() => {
    const verificarPermissoes = async () => {
      if (cameraSuportado && navigator.permissions) {
        try {
          const result = await navigator.permissions.query({ name: "camera" });
          if (result.state === "denied") {
            setErroCamera(
              "Permissão de câmera bloqueada. Para desbloquear: 1) Vá em Configurações do navegador > Privacidade e Segurança > Câmera 2) Remova este site da lista bloqueada 3) Recarregue a página"
            );
          }
        } catch (e) {
          // Alguns navegadores não suportam query de permissões
          console.log("Não foi possível verificar permissões:", e);
        }
      }
    };
    verificarPermissoes();
  }, [cameraSuportado]);

  const renderizarStepFoto = () => (
    <div className="flex-1 p-6 flex flex-col overflow-hidden">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Identificar Problema
        </h3>
        <p className="text-muted-foreground">
          Tire uma foto ou selecione da galeria.
        </p>
      </div>

      {!cameraAtiva && !fotoPreview && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="w-full space-y-3">
            {cameraSuportado ? (
              <button
                onClick={iniciarCamera}
                className="w-full aspect-4/5 max-h-[300px] bg-gradient-to-br from-[#019ac5] to-[#caee74] border-2 border-white/20 rounded-3xl flex flex-col items-center justify-center gap-4 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer"
              >
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all">
                  <Camera
                    size={32}
                    className="text-white"
                  />
                </div>
                <div className="text-center">
                  <p className="font-bold text-white text-lg">Tirar Foto</p>
                  <p className="text-xs text-white/80 mt-1">
                    Use a câmera do dispositivo
                  </p>
                </div>
              </button>
            ) : (
              <div className="w-full aspect-4/5 max-h-[300px] bg-card border-2 border-border rounded-3xl flex flex-col items-center justify-center gap-4">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                  <Camera size={32} className="text-muted-foreground" />
                </div>
                <div className="text-center px-6">
                  <p className="font-bold text-muted-foreground text-lg">
                    Câmera indisponível
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Use a galeria para enviar sua foto
                  </p>
                </div>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              capture={cameraSuportado ? "environment" : undefined}
              onChange={usarFotoGaleria}
              className="hidden"
              id="galeria-input"
            />
            <label
              htmlFor="galeria-input"
              className={`block text-center py-3 px-4 rounded-xl cursor-pointer transition-all ${
                erroCamera 
                  ? "bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:opacity-90" 
                  : "text-primary font-medium hover:underline"
              }`}
            >
              {erroCamera ? "📷 Usar Galeria/Câmera do Sistema" : "Selecionar da galeria"}
            </label>
            {erroCamera && (
              <p className="text-xs text-muted-foreground text-center mt-2">
                Toque acima para abrir a câmera nativa do seu dispositivo
              </p>
            )}
          </div>
        </div>
      )}

      {erroCamera && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 mb-4"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-destructive">Erro na câmera</p>
              <p className="text-xs text-destructive/80 mt-1">{erroCamera}</p>
            </div>
          </div>
          <button
            onClick={iniciarCamera}
            className="mt-3 w-full bg-destructive text-white text-sm font-semibold py-2 rounded-lg hover:bg-destructive/90 transition-colors"
          >
            Tentar Novamente
          </button>
        </motion.div>
      )}

      {cameraAtiva && (
        <div className="flex-1 flex flex-col">
          <div className="flex-1 bg-black rounded-2xl overflow-hidden relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={pararCamera}
              className="flex-1 bg-muted text-muted-foreground font-semibold py-3 rounded-xl hover:bg-muted/80 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={capturarFoto}
              className="flex-1 bg-primary text-primary-foreground font-semibold py-3 rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Camera size={20} />
              Capturar
            </button>
          </div>
        </div>
      )}

      {fotoPreview && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col"
        >
          <div className="flex-1 bg-muted rounded-2xl overflow-hidden relative">
            <img
              src={fotoPreview}
              alt="Foto capturada"
              className="w-full h-full object-contain"
            />
          </div>
          <button
            onClick={redefinirFluxo}
            className="absolute top-4 right-4 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-white" />
          </button>
        </motion.div>
      )}
    </div>
  );

  const renderizarStepLocalizacao = () => (
    <div className="flex-1 p-6 flex flex-col">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">Localização</h3>
        <p className="text-muted-foreground text-sm">
          Informe o endereço completo do problema.
        </p>
      </div>

      <div className="flex-1">
        <label className="block text-sm font-medium text-foreground mb-2">
          Endereço *
        </label>
        <input
          type="text"
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
          placeholder="Rua, número, bairro, cidade..."
          className="w-full p-4 rounded-xl border border-border bg-card text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
        />
        <p className="text-xs text-muted-foreground mt-2">
          Ex: Av. Paulista, 1000 - Bela Vista, São Paulo
        </p>
      </div>

      <button
        onClick={() => {
          if (!endereco.trim()) {
            toastError({
              title: "Endereço obrigatório",
              message: "Por favor, informe o endereço do problema."
            });
            return;
          }
          setStep("tipo");
        }}
        className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 mt-4"
      >
        Continuar
      </button>
    </div>
  );

  const renderizarStepTipo = () => (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-foreground mb-2">
          Tipo de Ocorrência
        </h3>
        <p className="text-muted-foreground text-sm">
          Selecione o tipo de problema identificado.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {TIPOS_OCORRENCIA.map((tipo) => {
          const isSelected = tipoSelecionado === tipo.id;
          return (
            <button
              key={tipo.id}
              onClick={() => setTipoSelecionado(tipo.id)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              <div className="mb-2">
                <tipo.icon size={24} className="text-foreground" />
              </div>
              <span
                className={`text-sm font-medium ${
                  isSelected ? "text-primary" : "text-foreground"
                }`}
              >
                {tipo.label}
              </span>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => setStep("confirmar")}
        disabled={!tipoSelecionado}
        className="w-full bg-primary text-primary-foreground disabled:bg-muted disabled:text-muted-foreground font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95"
      >
        Continuar
      </button>
    </div>
  );

  const renderizarTicketModal = () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card w-full max-w-md rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="bg-green-500 p-6 text-center">
          <CheckCircle className="w-16 h-16 text-white mx-auto mb-2" />
          <h2 className="text-2xl font-bold text-white">Reporte Enviado!</h2>
          <p className="text-white/80 text-sm">Protocolo: {ticketData.protocolo}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="bg-muted rounded-xl overflow-hidden">
            <img
              src={ticketData.foto}
              alt="Problema reportado"
              className="w-full h-48 object-cover"
            />
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground uppercase font-bold">Tipo</p>
            <p className="text-lg font-bold text-foreground">
              {TIPOS_OCORRENCIA.find(t => t.id === ticketData.tipo)?.label}
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground uppercase font-bold">Endereço</p>
            <p className="text-foreground">{ticketData.endereco}</p>
          </div>

          {ticketData.observacoes && (
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-xs text-muted-foreground uppercase font-bold">Observações</p>
              <p className="text-foreground text-sm">{ticketData.observacoes}</p>
            </div>
          )}

          <div className="flex gap-3">
            <div className="flex-1 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
              <p className="text-xs text-yellow-600 font-bold uppercase">Status</p>
              <p className="text-yellow-700 font-semibold">Pendente</p>
            </div>
            <div className="flex-1 bg-muted rounded-xl p-3">
              <p className="text-xs text-muted-foreground font-bold uppercase">Data</p>
              <p className="text-foreground text-sm">{ticketData.dataEnvio}</p>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border">
          <button
            onClick={() => navigate("/")}
            className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl shadow-lg"
          >
            Voltar para Home
          </button>
        </div>
      </motion.div>
    </div>
  );

  const renderizarStepConfirmar = () => (
    <div className="flex-1 flex flex-col bg-background overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex gap-4 mb-6 items-center bg-card p-3 rounded-xl border border-border">
          <img
            src={fotoPreview}
            alt="Problema identificado"
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase">
              Status
            </p>
            <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
              <AlertTriangle size={14} /> Aguardando envio
            </div>
          </div>
        </div>

        <h3 className="font-bold text-foreground mb-4">Dados do Reporte</h3>

        <div className="space-y-4">
          <div className="bg-card p-4 rounded-xl border border-border shadow-sm relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent"></div>
            <label className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block mb-1">
              Tipo de Ocorrência
            </label>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-foreground">
                {TIPOS_OCORRENCIA.find((t) => t.id === tipoSelecionado)
                  ?.label || tipoSelecionado}
              </span>
              <AlertTriangle size={18} className="text-accent" />
            </div>
          </div>

          <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
            <label className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block mb-1">
              Localização
            </label>
            <div className="flex items-center gap-2 text-foreground">
              <MapPin size={18} className="text-muted-foreground" />
              <input
                type="text"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                placeholder="Digite o endereço..."
                className="w-full bg-transparent outline-none font-medium text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground font-bold ml-1">
              Observações (Opcional)
            </label>
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="w-full mt-2 p-3 rounded-xl border border-border bg-card text-sm focus:border-primary outline-none"
              rows={2}
              placeholder="Descreva mais detalhes..."
            ></textarea>
          </div>
        </div>
      </div>

      <div className="p-4 bg-background border-t border-border shrink-0">
        <button
          onClick={enviarReporte}
          disabled={enviando}
          className="w-full bg-primary text-primary-foreground disabled:bg-muted disabled:text-muted-foreground hover:bg-primary/90 font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 flex justify-center items-center gap-2"
        >
          {enviando ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Enviando...
            </>
          ) : (
            "Enviar Reporte"
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col font-sans text-foreground">
      {showTicket && ticketData && renderizarTicketModal()}

      <div className="bg-card px-6 py-4 flex justify-between items-center border-b border-border shadow-sm z-10 shrink-0">
        <button
          onClick={() => {
            if (step === "foto") navigate("/");
            else if (step === "tipo") setStep("localizacao");
            else if (step === "localizacao") setStep("foto");
            else if (step === "confirmar") setStep("tipo");
          }}
          className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
        >
          <X size={20} />
        </button>
        <h2 className="font-bold text-lg">Nova Solicitação</h2>
        <div className="w-10" />
      </div>

      <div className="flex gap-1 px-4 py-2 bg-muted/30 border-b border-border shrink-0">
        {["foto", "localizacao", "tipo", "confirmar"].map(
          (s, i) => {
            const steps = [
              "foto",
              "localizacao",
              "tipo",
              "confirmar",
            ];
            const currentIndex = steps.indexOf(step);
            return (
              <div
                key={s}
                className={`flex-1 h-1 rounded-full transition-colors ${
                  i <= currentIndex ? "bg-primary" : "bg-border"
                }`}
              />
            );
          }
        )}
      </div>

      <AnimatePresence mode="wait">
        {step === "foto" && renderizarStepFoto()}
        {step === "localizacao" && renderizarStepLocalizacao()}
        {step === "tipo" && renderizarStepTipo()}
        {step === "confirmar" && renderizarStepConfirmar()}
      </AnimatePresence>
    </div>
  );
};

export default Reportar;
