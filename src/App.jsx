import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./components/Toast.jsx";
import { ReportesProvider } from "./context/ReportesContext.jsx";
import { TecnicoProvider } from "./context/TecnicoContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import Header from "./components/Header";
import Home from "./pages/Home";
import Reportar from "./pages/Reportar";
import Professional from "./pages/Professional.jsx";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <TecnicoProvider>
          <ReportesProvider>
            <ToastProvider>
              <div className="min-h-screen bg-background font-sans text-foreground transition-colors duration-300" suppressHydrationWarning>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <>
                        <Header />
                        <Home />
                      </>
                    }
                  />

                  <Route path="/reportar" element={<Reportar />} />

                  <Route path="/professional/*" element={<Professional />} />
                </Routes>
              </div>
            </ToastProvider>
          </ReportesProvider>
        </TecnicoProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
