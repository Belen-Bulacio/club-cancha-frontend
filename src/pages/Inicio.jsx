import TarjetaDatos from "../components/TarjetaDatos";

function Inicio({ reservas = [], cancelar }) {
  const hoy = new Date().toISOString().slice(0, 10);

  const reservasDeHoy = reservas.filter(function (reserva) {
    return reserva.fecha === hoy;
  });

  const confirmadas = reservasDeHoy.filter(function (reserva) {
    return reserva.estado === "confirmada";
  });

  const enCurso = reservasDeHoy.filter(function (reserva) {
    return reserva.estado === "en curso";
  });

  const canceladas = reservasDeHoy.filter(function (reserva) {
    return reserva.estado === "cancelada";
  });

  return (
    <main>
      <section className="hero-club">
        <div className="container">
          <h1>Sistema de Gestión de Turnos</h1>
          <p className="lead">
            Herramienta de uso interno para la administración del club.
          </p>
        </div>
      </section>

      <section className="container py-5">
        <h2 className="titulo-cal">Hoy</h2>

        <div className="row g-3 mb-4">
          <TarjetaDatos numero={confirmadas.length} texto="Confirmadas" />
          <TarjetaDatos numero={enCurso.length} texto="En curso" />
          <TarjetaDatos numero={canceladas.length} texto="Canceladas" />
        </div>

        <h3 className="h5">Reservas de hoy</h3>

        {reservasDeHoy.length === 0 && (
          <p className="text-secondary">No hay reservas cargadas para hoy.</p>
        )}

        <ul className="list-group">
          {reservasDeHoy.map(function (reserva) {
            return (
              <li
                className="list-group-item d-flex justify-content-between align-items-center flex-wrap gap-2"
                key={reserva.id}
              >
                <span>
                  {reserva.hora} · {reserva.cliente}
                  <span
                    className={
                      "chip-estado chip-" + reserva.estado.replace(" ", "-")
                    }
                  >
                    {reserva.estado}
                  </span>
                </span>

                {reserva.estado === "confirmada" && (
                  <button
                    type="button"
                    className="btn btn-club-linea btn-sm"
                    onClick={function () {
                      cancelar(reserva.id);
                    }}
                  >
                    Cancelar
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}

export default Inicio;
