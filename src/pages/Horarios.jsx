```jsx
import { useEffect, useState } from "react";

function Horarios() {

  // ============================
  // 1. Fecha actual
  // ============================

  const [fechaActual, setFechaActual] = useState(new Date());

  // ============================
  // 2. Mostrar solo turnos libres
  // ============================

  const [soloLibres, setSoloLibres] = useState(false);

  // ============================
  // 3. Horario actual
  // ============================

  const [horaActual, setHoraActual] = useState("");

  useEffect(() => {

    const actualizarHora = () => {
      const ahora = new Date();

      let hora = ahora.getHours();

      if (hora < 10) {
        hora = "0" + hora;
      }

      setHoraActual(hora + ":00");
      setFechaActual(ahora);
    };

    actualizarHora();

    // Actualiza la hora cada minuto
    const intervalo = setInterval(actualizarHora, 60000);

    return () => clearInterval(intervalo);

  }, []);

  // ============================
  // 4. Formato de fecha
  // ============================

  const formatoFecha = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  };

  const fechaFormateada = fechaActual.toLocaleDateString(
    "es-AR",
    formatoFecha
  );

  // ============================
  // 5. Datos de las canchas
  // ============================

  const canchas = [
    {
      id: "f5",
      nombre: "Fútbol 5",
      numero: "Cancha 1",
      turnos: [
        { hora: "08:00", estado: "libre" },
        { hora: "09:00", estado: "ocupado" },
        { hora: "10:00", estado: "libre" },
        { hora: "11:00", estado: "pendiente" },
        { hora: "12:00", estado: "libre" },
        { hora: "13:00", estado: "ocupado" },
        { hora: "14:00", estado: "libre" },
        { hora: "15:00", estado: "libre" },
        { hora: "16:00", estado: "ocupado" },
        { hora: "17:00", estado: "libre" },
        { hora: "18:00", estado: "pendiente" },
        { hora: "19:00", estado: "libre" },
        { hora: "20:00", estado: "ocupado" },
        { hora: "21:00", estado: "libre" },
        { hora: "22:00", estado: "libre" }
      ]
    },

    {
      id: "f7",
      nombre: "Fútbol 7",
      numero: "Cancha 2",
      turnos: [
        { hora: "08:00", estado: "libre" },
        { hora: "09:00", estado: "libre" },
        { hora: "10:00", estado: "ocupado" },
        { hora: "11:00", estado: "libre" },
        { hora: "12:00", estado: "pendiente" },
        { hora: "13:00", estado: "libre" },
        { hora: "14:00", estado: "ocupado" },
        { hora: "15:00", estado: "libre" },
        { hora: "16:00", estado: "libre" },
        { hora: "17:00", estado: "ocupado" },
        { hora: "18:00", estado: "libre" },
        { hora: "19:00", estado: "pendiente" },
        { hora: "20:00", estado: "libre" },
        { hora: "21:00", estado: "ocupado" },
        { hora: "22:00", estado: "libre" }
      ]
    },

    {
      id: "padel",
      nombre: "Pádel",
      numero: "Cancha 3",
      turnos: [
        { hora: "08:00", estado: "ocupado" },
        { hora: "09:00", estado: "libre" },
        { hora: "10:00", estado: "libre" },
        { hora: "11:00", estado: "ocupado" },
        { hora: "12:00", estado: "libre" },
        { hora: "13:00", estado: "pendiente" },
        { hora: "14:00", estado: "libre" },
        { hora: "15:00", estado: "ocupado" },
        { hora: "16:00", estado: "libre" },
        { hora: "17:00", estado: "libre" },
        { hora: "18:00", estado: "ocupado" },
        { hora: "19:00", estado: "libre" },
        { hora: "20:00", estado: "pendiente" },
        { hora: "21:00", estado: "libre" },
        { hora: "22:00", estado: "ocupado" }
      ]
    }
  ];

  // ============================
  // 6. Cantidad de turnos libres
  // ============================

  const contarLibres = (turnos) => {
    return turnos.filter(
      (turno) => turno.estado === "libre"
    ).length;
  };

  // ============================
  // 7. Renderizado
  // ============================

  return (
    <main className="container py-4">

      {/* HERO */}

      <section className="hero-club mb-4">
        <div className="container">

          <h1>Horarios y disponibilidad</h1>

          <p>
            Consultá los horarios disponibles para reservar
            nuestras canchas.
          </p>

          <p className="fw-semibold mb-0">
            Hoy es {fechaFormateada}
          </p>

        </div>
      </section>


      {/* BOTÓN SOLO LIBRES */}

      <button
        type="button"
        className="btn btn-club-linea btn-sm mb-3"
        onClick={() => setSoloLibres(!soloLibres)}
      >
        {soloLibres
          ? "Ver todos los turnos"
          : "Ver solo turnos libres"
        }
      </button>


      {/* CANCHAS */}

      <div id="contenido-canchas">

        {canchas.map((cancha) => {

          const cantidadLibres = contarLibres(cancha.turnos);

          return (
            <section
              key={cancha.id}
              className="mb-5"
            >

              {/* TÍTULO DE LA CANCHA */}

              <h3>
                {cancha.nombre} - {cancha.numero}

                <span className="chip-estado chip-libre ms-2">
                  {cantidadLibres} libres
                </span>
              </h3>


              {/* GRILLA DE TURNOS */}

              <div className="row row-cols-2 row-cols-md-4 row-cols-lg-6 g-2">

                {cancha.turnos.map((turno) => {

                  // Si está activado "solo libres"
                  // no mostramos los demás turnos.

                  if (
                    soloLibres &&
                    turno.estado !== "libre"
                  ) {
                    return null;
                  }


                  // Comprobamos si es el horario actual.

                  const esHoraActual =
                    turno.hora === horaActual;


                  return (
                    <div
                      className="col"
                      key={turno.hora}
                    >

                      <div
                       className={`
                     turno
                       turno--;{turno.estado}
                      {esHoraActual ? "turno-actual" : ""}
`                       }

                      >

                        {/* HORA */}

                        <span className="fw-bold">
                          {turno.hora}
                        </span>


                        {/* ESTADO */}

                        <span className="chip-estado">

                          {turno.estado === "libre" &&
                            "Libre"
                          }

                          {turno.estado === "ocupado" &&
                            "Ocupado"
                          }

                          {turno.estado === "pendiente" &&
                            "A confirmar"
                          }

                        </span>

                      </div>

                    </div>
                  );

                })}

              </div>

            </section>
          );

        })}

      </div>

    </main>
  );
}

export default Horarios;
```
