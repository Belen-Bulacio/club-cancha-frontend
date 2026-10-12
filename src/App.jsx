import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Rutas from './components/routes/Rutas';
import { reservasIniciales } from './data/datosIniciales';

// Lee las reservas que el navegador tenga guardadas.
// Si no hay ninguna, arranca con las de ejemplo.
function leerReservasGuardadas() {
  const guardadas = localStorage.getItem('reservas');
  if (guardadas === null) {
    return reservasIniciales;
  }
  return JSON.parse(guardadas);
}

function App() {
  // La única lista de reservas del sistema. Todas las páginas la leen.
  const [reservas, setReservas] = useState(leerReservasGuardadas);

  // Cada vez que la lista cambia, se vuelve a guardar en el navegador.
  // Por eso los cambios no se pierden al recargar la página.
  useEffect(() => {
    localStorage.setItem('reservas', JSON.stringify(reservas));
  }, [reservas]);

  // CREATE
  function agregarReserva(datos) {
    const nueva = { ...datos, id: Date.now(), estado: 'reservada' };
    setReservas([...reservas, nueva]);
  }

  // UPDATE
  function editarReserva(id, cambios) {
    setReservas(
      reservas.map((reserva) =>
        reserva.id === id ? { ...reserva, ...cambios } : reserva,
      ),
    );
  }

  // UPDATE (caso especial: cancelar)
  function cancelarReserva(id) {
    editarReserva(id, { estado: 'cancelada' });
  }

  // DELETE
  function borrarReserva(id) {
    setReservas(reservas.filter((reserva) => reserva.id !== id));
  }

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
}

export default App;
