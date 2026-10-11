import { canchas, reservasIniciales } from '../data/datosIniciales'

function obtenerEstado(canchaId) {
  const reserva = reservasIniciales.find(
    (reserva) => reserva.canchaId === canchaId
  )

  if (!reserva) {
    return 'Libre'
  }

  if (reserva.estado === 'a confirmar') {
    return 'Pendiente'
  }

  return 'Ocupada'
}

function CanchaCard({ cancha, estado }) {
  let claseEstado = 'chip-libre'

  if (estado === 'Pendiente') {
    claseEstado = 'chip-pendiente'
  }

  if (estado === 'Ocupada') {
    claseEstado = 'chip-ocupado'
  }

  return (
    <div className="col-12 col-md-6 col-lg-4">
      <div className="card h-100">
        <div className="card-body">

          <h3 className="card-title">
            {cancha.nombre}
          </h3>

          <p className="card-text">
            Deporte: {cancha.deporte}
          </p>

          <p className="precio">
            ${cancha.tarifa} <span>/ hora</span>
          </p>

          <p>Vestuarios: Sí</p>

          <p>Iluminación: Sí</p>

          <p>
            Estado:{' '}
            <span className={`chip-estado ${claseEstado}`}>
              {estado}
            </span>
          </p>

          <button className="btn btn-club">
            Cargar Reserva
          </button>

        </div>
      </div>
    </div>
  )
}

function Canchas() {
  return (
    <>
      <main>

        <section className="hero-club">
          <div className="container">
            <h1>Canchas del club</h1>

            <p>
              Conocé nuestras canchas y sus tarifas.
            </p>
          </div>
        </section>

        <section className="container py-5">

          <div className="text-center mb-4">
            <h2 className="titulo-cal">
              Catálogo de canchas
            </h2>

            <p>
              Tarifas vigentes por hora de juego.
              Los turnos se cargan desde la sección Reservar.
            </p>
          </div>

          <div className="row g-4">

            {canchas.map((cancha) => (
              <CanchaCard
                key={cancha.id}
                cancha={cancha}
                estado={obtenerEstado(cancha.id)}
              />
            ))}

          </div>

        </section>

        <section className="container pb-5">

          <div className="text-center mb-4">
            <h2>Servicios incluidos</h2>
          </div>

          <div className="row g-4">

            <div className="col-12 col-md-6 col-lg-4">
              <div className="card h-100">
                <div className="card-body text-center">

                  <h3 className="card-title">
                    Vestuarios con duchas
                  </h3>

                  <p className="card-text">
                    Vestuarios climatizados y lockers
                    sin costo adicional.
                  </p>

                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="card h-100">
                <div className="card-body text-center">

                  <h3 className="card-title">
                    Iluminación LED
                  </h3>

                  <p className="card-text">
                    Todas las canchas se pueden usar
                    hasta las 23 h.
                  </p>

                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="card h-100">
                <div className="card-body text-center">

                  <h3 className="card-title">
                    Estacionamiento
                  </h3>

                  <p className="card-text">
                    Playa de estacionamiento propia
                    y gratuita para socios.
                  </p>

                </div>
              </div>
            </div>

          </div>

        </section>

      </main>
    </>
  )
}

export default Canchas