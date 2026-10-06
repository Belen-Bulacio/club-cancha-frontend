import { useState } from "react";
import { Container, Table, Badge, Button, Form, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import { canchas, horarios } from "../data/datosIniciales";
import {
  estadoDelTurno, fechaDeHoy, colorDelEstado, formatearFecha,
} from "../data/funciones";

const Horarios = ({ reservas = [] }) => {
  // Permite mirar la grilla de otro día, no solo la de hoy
  const [fecha, setFecha] = useState(fechaDeHoy());

  return (
    <>
      <Hero
        titulo="Horarios y disponibilidad"
        texto="Grilla de turnos por cancha. El club abre de 8 a 00 h."
      />

      <Container className="py-5">
        <h2 className="titulo-cal">Grilla del día</h2>

        <Row className="align-items-end g-3 mb-4">
          <Col xs={12} md={4}>
            <Form.Label>Ver el día</Form.Label>
            <Form.Control
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </Col>
          <Col xs={12} md={8}>
            <p className="text-secondary text-capitalize mb-0">
              {formatearFecha(fecha)} — hacé clic en un turno libre para reservarlo.
            </p>
          </Col>
        </Row>

        <Table responsive bordered hover className="align-middle bg-white">
          <thead>
            <tr>
              <th>Hora</th>
              {canchas.map((cancha) => (
                <th key={cancha.id} className="text-center">
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
                <th className="text-nowrap">{hora}</th>

                {canchas.map((cancha) => {
                  const estado = estadoDelTurno(reservas, cancha.id, fecha, hora);

                  return (
                    <td key={cancha.id} className="text-center">
                      {estado === "libre" ? (
                        <Button
                          as={Link}
                          to={"/reservar?cancha=" + cancha.id + "&hora=" + hora + "&fecha=" + fecha}
                          size="sm"
                          variant="outline-success"
                        >
                          Libre
                        </Button>
                      ) : (
                        <Badge bg={colorDelEstado[estado]}>{estado}</Badge>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default Horarios;