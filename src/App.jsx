import { useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { reservasIniciales } from './data/datosIniciales'
import Clientes from './pages/Clientes'
import './App.css'

function App() {
  const [reservas, setReservas] = useState(reservasIniciales)

  return (
    <>
      <Navbar />
      
      <Clientes />

      <Footer />
    </>
  )
}

export default App
