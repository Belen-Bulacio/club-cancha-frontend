import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { reservasIniciales } from "./data/datosIniciales";
import Clientes from "./pages/Clientes";
import Inicio from "./pages/Inicio";
import Error404 from "./pages/Error404";
import "./App.css";

function EnConstruccion({ titulo }) {
  return (
    <main className="container py-5">
      <h1 className="titulo-cal">{titulo}</h1>
      <p className="text-secondary">Esta sección está en desarrollo.</p>
    </main>
  );
}

function App() {
  const [reservas, setReservas] = useState(reservasIniciales);

  function cancelarReserva(id) {
    setReservas(
      reservas.map(function (reserva) {
        if (reserva.id === id) {
          return { ...reserva, estado: "cancelada" };
        }
        return reserva;
      }),
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={<Inicio reservas={reservas} cancelar={cancelarReserva} />}
        />
        <Route path="/canchas" element={<EnConstruccion titulo="Canchas" />} />
        <Route
          path="/horarios"
          element={<EnConstruccion titulo="Horarios" />}
        />
        <Route
          path="/reservar"
          element={<EnConstruccion titulo="Cargar reserva" />}
        />
        <Route path="/clientes" element={<Clientes reservas={reservas} />} />
        <Route path="*" element={<Error404 />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
