import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut, User, Zap } from "lucide-react";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import LoginTecnico from "./LoginTecnico.jsx";
import Parear from "./Parear.jsx";
import { useTecnico } from "../hooks/useTecnico.js";

function ProfessionalLayout({ children }) {
  const navigate = useNavigate();
  const { tecnico, logout } = useTecnico();

  const handleLogout = () => {
    logout();
    navigate("/professional");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-card px-4 py-3 flex items-center justify-between shadow-sm border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <Zap className="w-4 h-4 text-primary-foreground" fill="currentColor" />
            </div>
            <span className="font-bold text-foreground">Avisa Energisa</span>
          </div>
        </div>

        {tecnico && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Sair</span>
          </button>
        )}
      </header>

      {tecnico && (
        <div className="bg-muted/50 border-b border-border px-4 py-2 shrink-0">
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              <span className="font-medium text-foreground">{tecnico.nome}</span>
              <span className="text-muted-foreground ml-1">({tecnico.email})</span>
            </span>
          </div>
        </div>
      )}

      <main className="flex-1">{children}</main>
    </div>
  );
}

export default function Professional() {
  return (
    <ProfessionalLayout>
      <Routes>
        <Route path="/" element={<LoginTecnico />} />
        <Route path="/parear" element={<Parear />} />
        <Route path="*" element={<Navigate to="/professional" replace />} />
      </Routes>
    </ProfessionalLayout>
  );
}
