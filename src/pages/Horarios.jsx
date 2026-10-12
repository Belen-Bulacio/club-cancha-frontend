import { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Badge, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import { canchas, horarios } from '../data/datosIniciales';
import {estadoDelTurno, fechaDeHoy, colorDelEstado, formatearFecha, turnoPasado,} from '../data/funciones';

const TITULO = 'Horarios y disponibilidad | Club Cancha';

// Cada minuto se vuelve a leer la hora, para que los estados se actualicen

const UN_MINUTO = 60000;

// Arma la dirección de reservar con la cancha, la hora y el día ya elegidos
function linkDeReserva(canchaId, hora, fecha) {
  return `/reservar?cancha=${canchaId}&hora=${hora}&fecha=${fecha}`;
}

// Devuelve la hora en formato '19:42'
function mostrarHora(momento) {
  return momento.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
}


  // Qué día se está mirando. Permite ver la grilla de mañana, no solo la de hoy.
function Horarios({ reservas = [] }) {
  const [fecha, setFecha] = useState(fechaDeHoy());

  // La hora actual. Se actualiza sola cada minuto.
  const [ahora, setAhora] = useState(new Date());

  // El título de la pestaña, para el SEO: cada página tiene el suyo
  useEffect(() => {
    document.title = TITULO;
  }, []);


    // Cada 60 segundos guarda la hora nueva. Eso hace que React vuelva a
    // dibujar la grilla y los estados se actualicen sin recargar.

  useEffect(() => {
    const intervalo = setInterval(() => setAhora(new Date()), UN_MINUTO);

    // Se limpia el intervalo al salir de la página, para que no quede
    // corriendo en el fondo.
    return () => clearInterval(intervalo);
  }, []);

  function manejarCambioDeFecha(evento) {
    setFecha(evento.target.value);
  }

  return (
    <main>
      <Hero titulo="Horarios y disponibilidad" texto="Grilla de turnos por cancha. El club abre de 8 a 00 h."/>

      <Container className="py-5">
        <section>
          <h2 className="titulo-cal">Grilla del día</h2>

          <Row className="align-items-end g-3 mb-4">
            <Col xs={12} md={4}>
              <Form.Group controlId="fecha">
                <Form.Label className="fw-semibold">Ver el día</Form.Label>
                <Form.Control type="date" size="lg" value={fecha} onChange={manejarCambioDeFecha}/>
              </Form.Group>
            </Col>

            <Col xs={12} md={8}>
              <p className="text-secondary mb-0">
                <span className="primera-mayuscula">{formatearFecha(fecha)}</span> — son las {mostrarHora(ahora)}. Hacé clic en un turno libre para reservarlo.
              </p>
            </Col>
          </Row>

          <Table responsive bordered hover className="align-middle bg-white">
            <caption className="text-secondary">
              Estado de cada turno por cancha. Los turnos libres son botones.
            </caption>

            <thead>
              <tr>
                <th scope="col">Hora</th>
                {canchas.map((cancha) => (
                  <th scope="col" key={cancha.id} className="text-center">
                    {cancha.nombre}
                    <br />
                    <small className="fw-normal text-secondary">{cancha.deporte}</small>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {horarios.map((hora) => (
                <tr key={hora}>
                  <th scope="row" className="text-nowrap">
                    {hora}
                  </th>

                  {canchas.map((cancha) => {
                    const estado = estadoDelTurno(reservas, cancha.id, fecha, hora);
                    const pasado = turnoPasado(fecha, hora);

                    return (
                      <td key={cancha.id} className="text-center">
                        {pasado && <small className="text-secondary">—</small>}

                        {!pasado && estado === 'libre' && (
                          <Button as={Link} to={linkDeReserva(cancha.id, hora, fecha)} size="sm" variant="outline-success">
                            Libre
                          </Button>
                        )}

                        {!pasado && estado !== 'libre' && (
                          <Badge bg={colorDelEstado[estado]}>{estado}</Badge>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </Table>
        </section>
      </Container>
    </main>
  );
}

export default Horarios;