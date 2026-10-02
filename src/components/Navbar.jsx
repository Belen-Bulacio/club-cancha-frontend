function Navbar() {
  return (
    <header className="sticky-top">
      <nav className="navbar navbar-expand-lg navbar-club" data-bs-theme="dark">
        <div className="container">

          <a className="navbar-brand d-flex align-items-center gap-2" href="#">
            <span>Club Cancha</span>
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#menuPrincipal"
            aria-controls="menuPrincipal"
            aria-expanded="false"
            aria-label="Abrir el menu"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="menuPrincipal">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" href="#">Inicio</a>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="#">Canchas</a>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="#">Horarios</a>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="#">Contacto</a>
              </li>
            </ul>

            <a className="btn btn-club ms-lg-3 mt-2 mt-lg-0" href="#">
              Cargar Reserva
            </a>
          </div>

        </div>
      </nav>
    </header>
  )
}

export default Navbar