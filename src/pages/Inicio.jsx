import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Modal, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import Hero from '../components/Hero';
import ProximosFeriados from '../components/ProximosFeriados';
import { canchas, horarios, duracionesPorTipo } from '../data/datosIniciales';
import {fechaDeHoy, formatearFecha, estadoReal, colorDelEstado, calcularPrecio, senaMinima, formatearPrecio, soloLetras, soloNumeros, contarNumeros, avisar,} from '../data/funciones';

const TITULO = 'Panel del día | Club Cancha';


const resumen = [
  { estado: 'reservada', titulo: 'Reservadas' },
  { estado: 'en curso', titulo: 'En curso' },
  { estado: 'finalizada', titulo: 'Finalizadas' },
  { estado: 'cancelada', titulo: 'Canceladas' },
];

const datosIniciales = {
  cliente: '',
  telefono: '',
  hora: '',
  duracion: 1,
};

// Las reservas de un día
function reservasDelDia(reservas, fecha) {
  return reservas.filter((reserva) => reserva.fecha === fecha);
}

function contarPorEstado(reservas, estado) {
  return reservas.filter((reserva) => estadoReal(reserva) === estado).length;
}

function buscarCancha(canchaId) {
  const encontrada = canchas.find((cancha) => cancha.id === canchaId);
  return encontrada || null;
}

function precioDeLaReserva(reserva) {
  const cancha = buscarCancha(reserva.canchaId);
  if (cancha === null) {
    return 0;
  }
  return calcularPrecio(cancha.deporte, reserva.duracion, reserva.hora);
}

// Revisa los datos del modal y devuelve un objeto con los errores.

function validar(datos) {
  const errores = {};

  if (datos.cliente.trim().length < 3) {
    errores.cliente = 'El nombre del cliente tiene que tener al menos 3 letras.';
  }

  if (contarNumeros(datos.telefono) < 8) {
    errores.telefono = 'El teléfono tiene que tener al menos 8 números.';
  }

  return errores;
}

function Inicio({ reservas = [], editar, cancelar, borrar }) {
  // La reserva que se está editando. null = el modal está cerrado.
  const [editando, setEditando] = useState(null);

  // Lo que la persona escribió en el modal, antes de guardar
  const [datos, setDatos] = useState(datosIniciales);

  // Qué campos están mal. Se llena recién al apretar Guardar.
  const [errores, setErrores] = useState({});

  // El título de la pestaña, para el SEO: cada página tiene el suyo
  useEffect(() => {
    document.title = TITULO;
  }, []);

  const hoy = fechaDeHoy();
  const reservasDeHoy = reservasDelDia(reservas, hoy);

  // Datos de la cancha que se edita, para saber qué duraciones y qué precio
  const cancha = editando === null ? null : buscarCancha(editando.canchaId);
  const tipo = cancha === null ? '' : cancha.tipo;
  const duraciones = tipo === '' ? [1] : duracionesPorTipo[tipo];
  const deporte = cancha === null ? '' : cancha.deporte;
  const precio = calcularPrecio(deporte, Number(datos.duracion), datos.hora);
  const sena = senaMinima(precio);

  function abrirModal(reserva) {
    setEditando(reserva);
    setErrores({});
    setDatos({
      cliente: reserva.cliente,
      telefono: reserva.telefono,
      hora: reserva.hora,
      duracion: reserva.duracion,
    });
  }

  function cerrarModal() {
    setEditando(null);
    setErrores({});
    setDatos(datosIniciales);
  }

  // Un solo manejador para todos los campos del modal.

  function manejarCambio(evento) {
    const { name, value } = evento.target;

    if (name === 'cliente') {
      const limpio = soloLetras(value);
      if (limpio !== value) {
        avisar('En el nombre del cliente solo se pueden escribir letras.');
      }
      setDatos({ ...datos, cliente: limpio });
      return;
    }

    if (name === 'telefono') {
      const limpio = soloNumeros(value);
      if (limpio !== value) {
        avisar('En el teléfono solo se pueden escribir números.');
      }
      setDatos({ ...datos, telefono: limpio });
      return;
    }

    setDatos({ ...datos, [name]: value });
  }

  function guardarCambios() {
    const nuevosErrores = validar(datos);
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      return;
    }

    editar(editando.id, {
      cliente: datos.cliente.trim(),
      telefono: datos.telefono,
      hora: datos.hora,
      duracion: Number(datos.duracion),
      sena: sena,
    });
    cerrarModal();
  }

  function pedirBorrado(reserva) {
    Swal.fire({
      title: '¿Borrar la reserva?',
      text: `${reserva.cliente} · ${reserva.hora}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'No',
    }).then((respuesta) => {
      if (respuesta.isConfirmed) {
        borrar(reserva.id);
        Swal.fire('Borrada', 'La reserva se eliminó del sistema.', 'success');
      }
    });
  }

  return (
    <main>
      <Hero
        titulo="Sistema de Gestión de Turnos"
        texto="Herramienta de uso interno para la administración del club."
      />

      <Container className="py-5">
        <section className="mb-5">
          <h2 className="titulo-cal">Hoy</h2>
          <p className="text-secondary primera-mayuscula mb-4">{formatearFecha(hoy)}</p>

          <Row className="g-3">
            {resumen.map((tarjeta) => (
              <Col xs={6} lg={3} key={tarjeta.estado}>
                <Card className="text-center h-100 shadow-sm">
                  <Card.Body>
                    <p className="display-6 fw-bold mb-0">
                      {contarPorEstado(reservasDeHoy, tarjeta.estado)}
                    </p>
                    <p className="text-secondary mb-0">{tarjeta.titulo}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        <Row className="g-4">
          <Col xs={12} lg={8}>
            <section>
              <h2 className="titulo-cal h4">Reservas de hoy</h2>

              {reservasDeHoy.length === 0 && (
                <p className="text-secondary">No hay reservas cargadas para hoy.</p>
              )}

              {reservasDeHoy.length > 0 && (
                <Table responsive hover size="sm" className="align-middle bg-white"> 
                  <caption className="text-secondary">
                    Reservas cargadas para el día de hoy.
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Hora</th>
                      <th scope="col">Cliente</th>
                      <th scope="col" className="d-none d-md-table-cell">
                        Cancha
                      </th>
                      <th scope="col" className="d-none d-xl-table-cell">
                        Duración
                      </th>
                      <th scope="col" className="d-none d-xl-table-cell">
                        Precio
                      </th>
                      <th scope="col" className="d-none d-xl-table-cell">
                        Seña
                      </th>
                      <th scope="col">Estado</th>
                      <th scope="col" className="text-end">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservasDeHoy.map((reserva) => {
                      const estado = estadoReal(reserva);
                      const suCancha = buscarCancha(reserva.canchaId);

                      return (
                        <tr key={reserva.id}>
                          <td>{reserva.hora}</td>
                          <td>{reserva.cliente}</td>
                          <td className="d-none d-md-table-cell">
                            {suCancha === null ? '—' : suCancha.nombre}
                          </td>
                          <td className=" d-none d-xl-table-cell">{reserva.duracion} h</td>
                          <td className=" d-none d-xl-table-cell">
                            {formatearPrecio(precioDeLaReserva(reserva))}
                          </td>
                          <td className=" d-none d-xl-table-cell">
                            {formatearPrecio(reserva.sena)}
                          </td>
                          <td>
                            <Badge bg={colorDelEstado[estado]}>{estado}</Badge>
                          </td>
                          <td className="text-end text-nowrap">
                            <Button size="sm" variant="outline-primary" className="me-1" aria-label="Editar" title="Editar" onClick={() => abrirModal(reserva)}>
                              <i className="bi bi-pencil"></i>
                            </Button>
                            {estado === 'reservada' && (
                              <Button size="sm" variant="outline-warning" className="me-1" aria-label="Cancelar reserva" title="Cancelar reserva" onClick={() => cancelar(reserva.id)}>
                                <i className="bi bi-x-circle"></i>
                              </Button>
                            )}
                            <Button size="sm" variant="outline-danger" aria-label="Borrar" title="Borrar" onClick={() => pedirBorrado(reserva)}>
                              <i className="bi bi-trash"></i>
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              )}
            </section>
          </Col>

          <Col xs={12} lg={4}>
            <section>
              <ProximosFeriados reservas={reservas} />
            </section>
          </Col>
        </Row>
      </Container>

      <Modal show={editando !== null} onHide={cerrarModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar reserva</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form noValidate>
            <Row className="g-3">
              <Col xs={12}>
                <Form.Group controlId="cliente">
                  <Form.Label className="fw-semibold">Cliente</Form.Label>
                  <Form.Control type="text" name="cliente" size="lg" placeholder="Pérez, Juan" value={datos.cliente} onChange={manejarCambio} isInvalid={Boolean(errores.cliente)}/> 

                  <Form.Control.Feedback type="invalid">
                    {errores.cliente}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col xs={12}>
                <Form.Group controlId="telefono">
                  <Form.Label className="fw-semibold">Teléfono</Form.Label>
                  <Form.Control type="tel" name="telefono" size="lg" placeholder="3884000000" value={datos.telefono} onChange={manejarCambio} isInvalid={Boolean(errores.telefono)}/>
                  <Form.Control.Feedback type="invalid">
                    {errores.telefono}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col xs={6}>
                <Form.Group controlId="hora">
                  <Form.Label className="fw-semibold">Hora</Form.Label>
                  <Form.Select name="hora" size="lg" value={datos.hora} onChange={manejarCambio}>
                    {horarios.map((hora) => (
                      <option key={hora} value={hora}>
                        {hora}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col xs={6}>
                <Form.Group controlId="duracion">
                  <Form.Label className="fw-semibold">Duración</Form.Label>
                  <Form.Select name="duracion" size="lg" value={datos.duracion} onChange={manejarCambio}>
                    {duraciones.map((opcion) => (
                      <option key={opcion} value={opcion}>
                        {opcion} h
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col xs={12}>
                <Form.Group controlId="sena">
                  <Form.Label className="fw-semibold">
                    Seña — el turno sale {formatearPrecio(precio)}, la seña es la mitad
                  </Form.Label>
                  <Form.Control type="text" size="lg" className="bg-light" readOnly value={formatearPrecio(sena)}/>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModal}>
            Cancelar
          </Button>
          <Button className="btn-club" onClick={guardarCambios}>
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
}
export default Inicio;
