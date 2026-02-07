import React, { useState } from "react";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import { User, Lock, ArrowRight, Loader2, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTecnico } from "../hooks/useTecnico.js";
import { useToast } from "../context/ToastContext.js";

export default function LoginTecnico() {
  const navigate = useNavigate();
  const { login } = useTecnico();
  const { toastError } = useToast();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !senha.trim()) {
      setErro("Preencha todos os campos");
      toastError({ message: "Preencha todos os campos" });
      return;
    }

    setCarregando(true);
    setErro(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      login(email, "Técnico Avisa Energisa");

      navigate("/professional/parear");
    } catch {
      setErro("Erro ao fazer login. Tente novamente.");
      toastError({ message: "Erro ao fazer login" });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-card rounded-3xl shadow-xl border border-border p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
                <Zap className="w-8 h-8 text-primary-foreground" fill="currentColor" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Área Técnica</h1>
              <p className="text-muted-foreground text-sm mt-2">
                Faça login para acessar
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Email corporativo
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@energisa.com"
                    className="w-full p-4 pl-12 rounded-xl border-2 border-border focus:border-primary outline-none transition-colors bg-background"
                    disabled={carregando}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Senha / PIN
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="••••••••"
                    className="w-full p-4 pl-12 rounded-xl border-2 border-border focus:border-primary outline-none transition-colors bg-background"
                    disabled={carregando}
                  />
                </div>
              </div>

              {erro && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-destructive text-sm text-center"
                >
                  {erro}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={carregando}
                className="w-full bg-primary text-primary-foreground disabled:bg-muted disabled:text-muted-foreground font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {carregando ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  <>
                    Entrar
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <p className="text-xs text-muted-foreground text-center mt-6">
              Para testes, use qualquer email e senha
            </p>
          </div>
        </motion.div>
      </div>

      <div className="bg-card border-t border-border px-6 py-4">
        <button
          onClick={() => navigate("/")}
          className="w-full text-muted-foreground text-sm hover:text-foreground transition-colors"
        >
          ← Voltar para Home
        </button>
      </div>
    </div>
  );
}
