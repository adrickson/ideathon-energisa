import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import { Wifi, Shield, Zap, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "../context/ToastContext.js";
import { useTecnico } from "../hooks/useTecnico.js";
import { validateDeviceCode } from "../utils/helpers.js";

const TIPOS_DISPOSITIVO = {
  COLETE: { id: "colete", nome: "Colete de Proteção", icone: Shield },
  MODULO: { id: "modulo", nome: "Módulo para Máquina", icone: Zap },
};

export default function Parear() {
  const navigate = useNavigate();
  const { toastSuccess, toastError } = useToast();
  const { tecnico, conectarDispositivo, desconectarDispositivo } = useTecnico();

  const [codigo, setCodigo] = useState("");
  const [tipoSelecionado, setTipoSelecionado] = useState(TIPOS_DISPOSITIVO.COLETE.id);
  const [conectando, setConectando] = useState(false);
  const [erro, setErro] = useState(null);

  const handleCodigoChange = useCallback((e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, "");
    setCodigo(value);
    setErro(null);
  }, []);

  const handleParear = useCallback(async () => {
    if (!codigo.trim()) {
      setErro("Por favor, insira o código do dispositivo");
      return;
    }

    if (!validateDeviceCode(codigo)) {
      setErro("Código inválido. Formato esperado: ABC123-XYZ");
      return;
    }

    setConectando(true);
    setErro(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      conectarDispositivo({
        codigo,
        tipoDispositivo: tipoSelecionado,
        nome: tipoSelecionado === TIPOS_DISPOSITIVO.COLETE.id ? "Colete Proteger" : "Módulo Máquina",
      });

      toastSuccess({
        title: "Dispositivo conectado!",
        message: "Seu dispositivo está pronto para uso.",
      });

      setTimeout(() => navigate("/"), 1500);
    } catch {
      toastError({ title: "Erro ao conectar", message: "Tente novamente." });
    } finally {
      setConectando(false);
    }
  }, [codigo, tipoSelecionado, conectarDispositivo, navigate, toastSuccess, toastError]);

  const handleDesconectar = useCallback(() => {
    desconectarDispositivo();
    toastSuccess({ message: "Dispositivo desconectado com sucesso." });
    setCodigo("");
  }, [desconectarDispositivo, toastSuccess]);

  if (tecnico?.dispositivo?.status === "conectado") {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md bg-card rounded-3xl shadow-xl border border-border p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-green-500" />
          </motion.div>

          <h2 className="text-2xl font-bold text-foreground mb-2">Dispositivo Conectado</h2>
          <p className="text-muted-foreground mb-6">Seu dispositivo já está pareado e pronto para uso.</p>

          <div className="bg-muted rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Wifi className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground">{tecnico.dispositivo.codigo}</span>
            </div>
            <p className="text-sm text-muted-foreground">{tecnico.dispositivo.nome}</p>
          </div>

          <button
            onClick={handleDesconectar}
            className="w-full bg-destructive/10 text-destructive font-semibold py-3 rounded-xl hover:bg-destructive/20 transition-colors"
          >
            Desconectar Dispositivo
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
          <Wifi className="w-10 h-10 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Conectar Dispositivo</h2>
        <p className="text-muted-foreground">Digite o código do seu dispositivo IoT para pareá-lo.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Tipo de Dispositivo
          </label>
          <div className="grid grid-cols-2 gap-3">
            {Object.values(TIPOS_DISPOSITIVO).map((tipo) => {
              const Icon = tipo.icone;
              const isSelected = tipoSelecionado === tipo.id;
              return (
                <button
                  key={tipo.id}
                  onClick={() => setTipoSelecionado(tipo.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 mx-auto mb-2 ${
                      isSelected ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                  <p
                    className={`text-xs font-medium ${
                      isSelected ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {tipo.nome}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Código do Dispositivo
          </label>
          <input
            type="text"
            value={codigo}
            onChange={handleCodigoChange}
            placeholder="ABC123-XYZ"
            maxLength={10}
            disabled={conectando}
            className={`w-full p-4 rounded-xl border-2 text-center text-xl tracking-widest font-mono placeholder:font-sans ${
              erro
                ? "border-destructive focus:border-destructive"
                : "border-border focus:border-primary"
            } focus:outline-none transition-colors disabled:bg-muted bg-background`}
          />
          {erro && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-destructive text-sm mt-2 flex items-center gap-1"
            >
              <AlertCircle className="w-4 h-4" />
              {erro}
            </motion.p>
          )}
        </div>

        <button
          onClick={handleParear}
          disabled={conectando || !codigo}
          className="w-full bg-primary text-primary-foreground disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          {conectando ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Conectando...
            </>
          ) : (
            <>
              <Wifi className="w-5 h-5" />
              Conectar Dispositivo
            </>
          )}
        </button>

        <p className="text-xs text-muted-foreground text-center mt-4">
          O código está embaixo ou na lateral do dispositivo
        </p>
      </motion.div>
    </div>
  );
}
