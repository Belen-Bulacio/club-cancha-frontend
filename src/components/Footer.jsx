function Footer() {
  return (
    <footer className="pie-club">
      <div className="container">
        <div className="row g-4">

          <div className="col-12 col-md-5">
            <h3 className="h5">Club Cancha</h3>
            <p className="mb-0">
              Sistema de gestión de turnos para canchas de fútbol 5,
              fútbol 7 y pádel.
            </p>
          </div>

          <div className="col-6 col-md-3">
            <h3 className="h6 text-uppercase">Secciones</h3>
            <ul className="list-unstyled mb-0">
              <li><a href="#">Canchas</a></li>
              <li><a href="#">Horarios</a></li>
              <li><a href="#">Reservar</a></li>
              <li><a href="#">Clientes</a></li>
            </ul>
          </div>

          <div className="col-6 col-md-4">
            <h3 className="h6 text-uppercase">Contacto</h3>
            <ul className="list-unstyled mb-0">
              <li>
                <a href="tel:+543884000000">+54 388 400-0000</a>
              </li>
              <li>
                <a href="mailto:administracion@clubcancha.com.ar">
                  administracion@clubcancha.com.ar
                </a>
              </li>
              <li>Lunes a domingo, 8 a 23 h</li>
            </ul>
          </div>

        </div>

        <hr className="border-secondary my-4" />

        <p className="text-center small mb-0">
          Copyright 2026 · Grupo 6 · Sistema del club
        </p>
      </div>
    </footer>
  )
}

export default Footer