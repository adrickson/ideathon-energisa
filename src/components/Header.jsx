import React, { useState } from "react";
import { Zap, Menu, X, User, Settings, HelpCircle, LogOut } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm font-sans">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between relative">
        {/* Logo: Fundo Ciano/Azul com raio Branco */}
        <div className="flex items-center gap-2">
          <div className="bg-[#0096D6] p-1.5 rounded-lg shadow-md shadow-cyan-100">
            <Zap className="text-white w-5 h-5" fill="currentColor" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-gray-800 leading-none tracking-tight">
              Energisa
            </h1>

            {/* NOME DO APP (A DECIDIR COM A EQUIPE)
            <span className="text-[10px] text-[#0096D6] font-bold uppercase tracking-widest">
              Shield
            </span>
            */}
          </div>
        </div>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors active:bg-gray-200"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Menu Dropdown */}
        {isMenuOpen && (
          <div className="absolute top-16 right-4 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 p-2 flex flex-col gap-1 z-50">
            <div className="px-4 py-3 border-b border-gray-100 mb-1">
              <p className="text-sm font-bold text-gray-800">Usuário Teste</p>
              <p className="text-xs text-gray-500">cidadao@email.com</p>
            </div>

            <button className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-orange-50 hover:text-[#F37021] rounded-lg transition-colors text-left w-full">
              <User size={18} /> Meu Perfil
            </button>
            <button className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-orange-50 hover:text-[#F37021] rounded-lg transition-colors text-left w-full">
              <Settings size={18} /> Configurações
            </button>

            <div className="border-t border-gray-100 mt-1 pt-1">
              <button className="flex items-center gap-3 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 rounded-lg transition-colors text-left w-full font-medium">
                <LogOut size={18} /> Sair
              </button>
            </div>
          </div>
        )}
      </div>
      {isMenuOpen && (
        <div
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 top-16 bg-black/20 z-40"
        ></div>
      )}
    </header>
  );
};

export default Header;
