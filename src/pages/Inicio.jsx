function Inicio({ reservas = [], confirmar }) {
  return (
    <main>
          <section className="hero-club">
        <div className="container">
          <h1>Sistema de Gestión de Turnos</h1>
          <p className="lead">
            Herramienta de uso interno para la administración del club.
          </p>
           <p>Hay {reservas.length} reservas cargadas.</p>
        </div>
      </section>
    </main>
  )
}

export default Inicio
