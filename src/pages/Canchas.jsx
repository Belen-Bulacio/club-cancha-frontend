import { Container, Row, Col, Card, Badge, Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import { canchas, duracionesPorTipo } from "../data/datosIniciales";
import {
  estadoDelTurno, fechaDeHoy, colorDelEstado,
  calcularPrecio, formatearPrecio, formatearFecha,
} from "../data/funciones";

const Canchas = ({ reservas = [] }) => {
  const hoy = fechaDeHoy();
  const horaAhora = new Date().getHours();
  const ahora = (horaAhora < 10 ? "0" + horaAhora : horaAhora) + ":00";

  return (
    <>
      <Hero
        titulo="Canchas del club"
        texto="Estado actual de cada cancha y tarifas vigentes."
      />

      <Container className="py-5">
        <h2 className="titulo-cal">Nuestras canchas</h2>
        <p className="text-secondary text-capitalize mb-4">{formatearFecha(hoy)}</p>

        <Row className="g-4">
          {canchas.map((cancha) => {
            const estado = estadoDelTurno(reservas, cancha.id, hoy, ahora);
            const duraciones = duracionesPorTipo[cancha.tipo];

            return (
              <Col xs={12} md={6} lg={4} key={cancha.id}>
                <Card className="h-100 shadow-sm">
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{cancha.nombre}</Card.Title>
                    <Card.Subtitle className="mb-3 text-secondary">
                      {cancha.deporte}
                    </Card.Subtitle>

                    <p className="mb-3">
                      Ahora: <Badge bg={colorDelEstado[estado]}>{estado}</Badge>
                    </p>

                    <Table size="sm" borderless className="mb-3">
                      <thead>
                        <tr>
                          <th>Turno</th>
                          <th>8 a 17 h</th>
                          <th>17 a 00 h</th>
                        </tr>
                      </thead>
                      <tbody>
                        {duraciones.map((duracion) => (
                          <tr key={duracion}>
                            <td>{duracion} h</td>
                            <td>{formatearPrecio(calcularPrecio(cancha.tipo, duracion, "10:00"))}</td>
                            <td>{formatearPrecio(calcularPrecio(cancha.tipo, duracion, "19:00"))}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>

                    <Button
                      as={Link}
                      to={"/reservar?cancha=" + cancha.id}
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
      </Container>
    </>
  );
};

export default Canchas;