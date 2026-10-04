import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <header className="sticky-top">
      <nav className="navbar navbar-expand-lg navbar-club" data-bs-theme="dark">
        <div className="container">
          <NavLink
            className="navbar-brand d-flex align-items-center gap-2"
            to="/"
          >
            <span>Club Cancha</span>
          </NavLink>

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
                <NavLink className="nav-link" to="/">
                  Inicio
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link" to="/canchas">
                  Canchas
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link" to="/horarios">
                  Horarios
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link" to="/clientes">
                  Clientes
                </NavLink>
              </li>
            </ul>

            <NavLink className="btn btn-club ms-lg-3" to="/reservar">
              Cargar reserva
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
