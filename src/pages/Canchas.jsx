import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import { canchas, duracionesPorTipo } from '../data/datosIniciales';
import {estadoDelTurno, fechaDeHoy, colorDelEstado, calcularPrecio, formatearPrecio, formatearFecha, numeroEnHora,} from '../data/funciones';

const TITULO = 'Canchas y tarifas | Club Cancha';

// Los botones del filtro
const deportes = ['Todos', 'Fútbol', 'Pádel'];

// Las dos franjas, con una hora de ejemplo de cada una para pedir el precio
const franjas = [
  { titulo: '8 a 17 h', horaEjemplo: '10:00' },
  { titulo: '17 a 00 h', horaEjemplo: '19:00' },
];

// Las canchas del deporte elegido. 'Todos' devuelve las tres.
function filtrarPorDeporte(deporte) {
  if (deporte === 'Todos') {
    return canchas;
  }
  return canchas.filter((cancha) => cancha.tipo === deporte);
}

// La hora actual redondeada, por ejemplo '19:00'
function horaDeAhora() {
  return numeroEnHora(new Date().getHours());
}

function Canchas({ reservas = [] }) {
  // Guarda qué deporte se está mirando. Arranca mostrando todos.
  const [deporte, setDeporte] = useState('Todos');

  // El título de la pestaña, para el SEO: cada página tiene el suyo
  useEffect(() => {
    document.title = TITULO;
  }, []);

  const hoy = fechaDeHoy();
  const ahora = horaDeAhora();
  const canchasVisibles = filtrarPorDeporte(deporte);

  return (
    <main>
      <Hero titulo="Canchas del club"texto="Estado actual de cada cancha y tarifas vigentes."/>

      <Container className="py-5">
        <section>
          <h2 className="titulo-cal">Nuestras canchas</h2>
          <p className="text-secondary primera-mayuscula mb-3">{formatearFecha(hoy)}</p>

          <ButtonGroup className="mb-4" aria-label="Filtrar por deporte">
            {deportes.map((opcion) => (<Button key={opcion} variant={deporte === opcion ? 'success' : 'outline-success'} onClick={() => setDeporte(opcion)}>
                {opcion}
              </Button>
            ))}
          </ButtonGroup>

          <Row className="g-4">
            {canchasVisibles.map((cancha) => {
              const estado = estadoDelTurno(reservas, cancha.id, hoy, ahora);
              const duraciones = duracionesPorTipo[cancha.tipo];

              return (
                <Col xs={12} md={6} lg={4} key={cancha.id}>
                  <Card as="article" className="h-100 shadow-sm overflow-hidden">
                    <Card.Img
                      variant="top"
                      src={cancha.imagen}
                      alt={`Vista de la ${cancha.nombre}, de ${cancha.deporte}`}
                      style={{ height: '180px', objectFit: 'cover' }}
                    />

                    <Card.Body className="d-flex flex-column">
                      <Card.Title as="h3" className="h5">
                        {cancha.nombre}
                      </Card.Title>
                      <Card.Subtitle className="mb-3 text-secondary">
                        {cancha.deporte}
                      </Card.Subtitle>

                      <p className="mb-3">
                        Ahora: <Badge bg={colorDelEstado[estado]}>{estado}</Badge>
                      </p>

                      <Table size="sm" borderless className="mb-3">
                        <caption className="text-secondary small">
                          Tarifas por hora de {cancha.deporte}.
                        </caption>
                        <thead>
                          <tr>
                            <th scope="col">Turno</th>
                            {franjas.map((franja) => (
                              <th scope="col" key={franja.titulo}>
                                {franja.titulo}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {duraciones.map((duracion) => (
                            <tr key={duracion}>
                              <th scope="row">{duracion} h</th>
                              {franjas.map((franja) => (
                                <td key={franja.titulo}>
                                  {formatearPrecio(calcularPrecio(cancha.deporte, duracion, franja.horaEjemplo))}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </Table>

                      <Button
                        as={Link}
                        to={`/reservar?cancha=${cancha.id}`}
                        className="btn-club mt-auto"
                      >
                        Cargar reserva
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </section>
      </Container>
    </main>
  );
}

export default Canchas;