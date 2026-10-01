import { useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { reservasIniciales } from './data/datosIniciales'
import './App.css'

function App() {
  const [reservas, setReservas] = useState(reservasIniciales)

  return (
    <>
      <Navbar />

      <main className="container py-5">
        <h1>Club Cancha</h1>
        <p>Sistema de gestión de turnos</p>

        <p>Reservas cargadas: {reservas.length}</p>
      </main>

      <Footer />
    </>
  )
}

export default App
