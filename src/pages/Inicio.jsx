import { useState } from "react";
import { Container,Row,Col,Card,Table,Badge,Button,Modal,Form,} from "react-bootstrap";
import Swal from "sweetalert2";
import Hero from "../components/Hero";
import { canchas, horarios, duracionesPorTipo } from "../data/datosIniciales";
import {fechaDeHoy,formatearFecha,estadoReal,colorDelEstado,calcularPrecio,senaMinima,formatearPrecio,} from "../data/funciones";

const Inicio = ({ reservas = [], editar, cancelar, borrar }) => {
  const hoy = fechaDeHoy();

  const [editando, setEditando] = useState(null);
  const [formulario, setFormulario] = useState({
    cliente: "",
    telefono: "",
    hora: "",
    duracion: 1,
    sena: 0,
  });

  const reservasDeHoy = reservas.filter((reserva) => reserva.fecha === hoy);

  const contar = (estado) => {
    return reservasDeHoy.filter((reserva) => estadoReal(reserva) === estado)
      .length;
  };

  const nombreDeCancha = (canchaId) => {
    const cancha = canchas.find((unaCancha) => unaCancha.id === canchaId);
    return cancha ? cancha.nombre : "—";
  };

  const tipoDeCancha = (canchaId) => {
    const cancha = canchas.find((unaCancha) => unaCancha.id === canchaId);
    return cancha ? cancha.tipo : "";
  };

  const abrirEdicion = (reserva) => {
    setEditando(reserva);
    setFormulario({
      cliente: reserva.cliente,
      telefono: reserva.telefono,
      hora: reserva.hora,
      duracion: reserva.duracion,
      sena: reserva.sena,
    });
  };

  const guardarEdicion = () => {
    editar(editando.id, {
      cliente: formulario.cliente,
      telefono: formulario.telefono,
      hora: formulario.hora,
      duracion: Number(formulario.duracion),
      sena: Number(formulario.sena),
    });
    setEditando(null);
  };

  const pedirBorrado = (reserva) => {
    Swal.fire({
      title: "¿Borrar la reserva?",
      text: reserva.cliente + " · " + reserva.hora,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, borrar",
      cancelButtonText: "No",
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        borrar(reserva.id);
        Swal.fire("Borrada", "La reserva se eliminó del sistema.", "success");
      }
    });
  };

  const precioEditado = editando
    ? calcularPrecio(
        tipoDeCancha(editando.canchaId),
        Number(formulario.duracion),
        formulario.hora,
      )
    : 0;

  return (
    <>
      <Hero
        titulo="Sistema de Gestión de Turnos"
        texto="Herramienta de uso interno para la administración del club."
      />

      <Container className="py-5">
        <h2 className="titulo-cal">Hoy</h2>
        <p className="text-secondary text-capitalize mb-4">
          {formatearFecha(hoy)}
        </p>

        <Row className="g-3 mb-4">
          <Col xs={12} md={3}>
            <Card className="text-center h-100 shadow-sm">
              <Card.Body>
                <p className="display-6 fw-bold mb-0">{contar("reservada")}</p>
                <p className="text-secondary mb-0">Reservadas</p>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={3}>
            <Card className="text-center h-100 shadow-sm">
              <Card.Body>
                <p className="display-6 fw-bold mb-0">{contar("en curso")}</p>
                <p className="text-secondary mb-0">En curso</p>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={3}>
            <Card className="text-center h-100 shadow-sm">
              <Card.Body>
                <p className="display-6 fw-bold mb-0">{contar("finalizada")}</p>
                <p className="text-secondary mb-0">Finalizadas</p>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={3}>
            <Card className="text-center h-100 shadow-sm">
              <Card.Body>
                <p className="display-6 fw-bold mb-0">{contar("cancelada")}</p>
                <p className="text-secondary mb-0">Canceladas</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <h3 className="h5">Reservas de hoy</h3>

        {reservasDeHoy.length === 0 ? (
          <p className="text-secondary">No hay reservas cargadas para hoy.</p>
        ) : (
          <Table responsive hover className="align-middle bg-white">
            <thead>
              <tr>
                <th>Hora</th>
                <th>Cliente</th>
                <th>Cancha</th>
                <th>Duración</th>
                <th>Precio</th>
                <th>Seña</th>
                <th>Estado</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservasDeHoy.map((reserva) => {
                const estado = estadoReal(reserva);
                const precio = calcularPrecio(
                  tipoDeCancha(reserva.canchaId),
                  reserva.duracion,
                  reserva.hora,
                );

                return (
                  <tr key={reserva.id}>
                    <td>{reserva.hora}</td>
                    <td>{reserva.cliente}</td>
                    <td>{nombreDeCancha(reserva.canchaId)}</td>
                    <td>{reserva.duracion} h</td>
                    <td>{formatearPrecio(precio)}</td>
                    <td>{formatearPrecio(reserva.sena)}</td>
                    <td>
                      <Badge bg={colorDelEstado[estado]}>{estado}</Badge>
                    </td>
                    <td className="text-end text-nowrap">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        className="me-1"
                        onClick={() => abrirEdicion(reserva)}
                      >
                        Editar
                      </Button>

                      {estado === "reservada" && (
                        <Button
                          size="sm"
                          variant="outline-warning"
                          className="me-1"
                          onClick={() => cancelar(reserva.id)}
                        >
                          Cancelar
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => pedirBorrado(reserva)}
                      >
                        Borrar
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Container>

      <Modal show={editando !== null} onHide={() => setEditando(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar reserva</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Cliente</Form.Label>
              <Form.Control
                value={formulario.cliente}
                onChange={(e) =>
                  setFormulario({ ...formulario, cliente: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                value={formulario.telefono}
                onChange={(e) =>
                  setFormulario({ ...formulario, telefono: e.target.value })
                }
              />
            </Form.Group>

            <Row>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Hora</Form.Label>
                  <Form.Select
                    value={formulario.hora}
                    onChange={(e) =>
                      setFormulario({ ...formulario, hora: e.target.value })
                    }
                  >
                    {horarios.map((hora) => (
                      <option value={hora} key={hora}>
                        {hora}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Duración</Form.Label>
                  <Form.Select
                    value={formulario.duracion}
                    onChange={(e) =>
                      setFormulario({ ...formulario, duracion: e.target.value })
                    }
                  >
                    {editando &&
                      duracionesPorTipo[tipoDeCancha(editando.canchaId)].map(
                        (d) => (
                          <option value={d} key={d}>
                            {d} h
                          </option>
                        ),
                      )}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group>
              <Form.Label>
                Seña — el turno sale {formatearPrecio(precioEditado)}, mínimo{" "}
                {formatearPrecio(senaMinima(precioEditado))}
              </Form.Label>
              <Form.Control
                type="number"
                min={senaMinima(precioEditado)}
                value={formulario.sena}
                onChange={(e) =>
                  setFormulario({ ...formulario, sena: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditando(null)}>
            Cancelar
          </Button>
          <Button className="btn-club" onClick={guardarEdicion}>
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Inicio;
