import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Reportar from "./pages/Reportar";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        <Routes>
          {/* Rota da Home com Header */}
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
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
