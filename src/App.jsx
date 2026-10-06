import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Rutas from "./components/routes/Rutas";
import { reservasIniciales } from "./data/datosIniciales";
import "./App.css";

const App = () => {
  const guardadas = localStorage.getItem("reservas");
  const inicial = guardadas ? JSON.parse(guardadas) : reservasIniciales;

  const [reservas, setReservas] = useState(inicial);

  useEffect(() => {
    localStorage.setItem("reservas", JSON.stringify(reservas));
  }, [reservas]);

  // CREATE
  const agregarReserva = (nueva) => {
    const reserva = { ...nueva, id: Date.now(), estado: "reservada" };
    setReservas([...reservas, reserva]);
  };

  // UPDATE
  const editarReserva = (id, cambios) => {
    setReservas(
      reservas.map((reserva) => {
        if (reserva.id === id) {
          return { ...reserva, ...cambios };
        }
        return reserva;
      }),
    );
  };

  // UPDATE (caso especial: cancelar)
  const cancelarReserva = (id) => {
    editarReserva(id, { estado: "cancelada" });
  };

  // DELETE
  const borrarReserva = (id) => {
    setReservas(reservas.filter((reserva) => reserva.id !== id));
  };

  return (
    <>
      <Navbar />
      <Rutas
        reservas={reservas}
        agregar={agregarReserva}
        editar={editarReserva}
        cancelar={cancelarReserva}
        borrar={borrarReserva}
      />
      <Footer />
    </>
  );
};

export default App;
