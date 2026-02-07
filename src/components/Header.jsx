import { useState } from "react";
import { Menu, X, User, Settings, LogOut, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";
import logoUrl from '../assets/icone.svg';


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toggleTheme, isDark } = useTheme();

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border shadow-sm font-sans">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between relative">
        <div className="flex items-center gap-2">
          <div className=" p-1.5 rounded-lg shadow-md shadow-primary/20">
            <img className="w-10 h-10" src={logoUrl} alt="Logo" />
          </div>

          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-foreground leading-none tracking-tight">
              Avisa Energisa
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={toggleTheme}
            className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors active:bg-muted"
            title={isDark ? "Mudar para modo claro" : "Mudar para modo escuro"}
          >
            {isDark ? <Sun size={22} /> : <Moon size={22} />}
          </button>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors active:bg-muted"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="absolute top-16 right-4 w-56 bg-card rounded-xl shadow-2xl border border-border p-2 flex flex-col gap-1 z-50">
            <div className="px-4 py-3 border-b border-border mb-1">
              <p className="text-sm font-bold text-foreground">Usuário Teste</p>
              <p className="text-xs text-muted-foreground">cidadao@email.com</p>
            </div>

            <button className="flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:bg-accent/10 hover:text-accent rounded-lg transition-colors text-left w-full">
              <User size={18} /> Meu Perfil
            </button>
            <button className="flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:bg-accent/10 hover:text-accent rounded-lg transition-colors text-left w-full">
              <Settings size={18} /> Configurações
            </button>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:bg-accent/10 hover:text-accent rounded-lg transition-colors text-left w-full"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
              {isDark ? "Modo Claro" : "Modo Escuro"}
            </button>

            <div className="border-t border-border mt-1 pt-1">
              <button className="flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:bg-muted rounded-lg transition-colors text-left w-full font-medium">
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
