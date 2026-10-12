import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Modal, Alert } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import Hero from '../components/Hero';
import { canchas, horarios, duracionesPorTipo } from '../data/datosIniciales';
import {estadoDelTurno, fechaDeHoy, calcularPrecio, senaMinima, formatearPrecio, rangoLibre, turnoPasado, soloLetras, soloNumeros, contarNumeros, avisar,} from '../data/funciones';

const TITULO = 'Cargar reserva | Club Cancha';

const deportes = ['Fútbol', 'Pádel'];

const datosIniciales = {
  apellido: '',
  nombre: '',
  telefono: '',
  tipo: '',
  canchaId: '',
  fecha: '',
  hora: '',
  duracion: 1,
  sena: '',
  politica: false,
};

// Busca una cancha por su id

function buscarCancha(canchaId) {
  const encontrada = canchas.find((cancha) => cancha.id === Number(canchaId));
  return encontrada || null;
}

// Las canchas de ese deporte

function canchasDelDeporte(tipo) {
  return canchas.filter((cancha) => cancha.tipo === tipo);
}

// Las horas que están libres en esa cancha ese día y que todavía no pasaron

function horasLibres(reservas, canchaId, fecha) {
  return horarios.filter(
    (hora) =>
      !turnoPasado(fecha, hora) &&
      estadoDelTurno(reservas, Number(canchaId), fecha, hora) === 'libre',
  );
}

// Revisa todos los datos y devuelve un objeto con los errores encontrados.
// Si no hay errores, el objeto queda vacío.

function validar(datos, reservas, minimo) {
  const errores = {};

  if (datos.apellido.trim().length < 2) {
    errores.apellido = 'Escribí el apellido del cliente (solo letras).';
  }

  if (datos.nombre.trim().length < 2) {
    errores.nombre = 'Escribí el nombre del cliente (solo letras).';
  }

  if (contarNumeros(datos.telefono) < 8) {
    errores.telefono = 'El celular tiene que tener al menos 8 números.';
  }

  if (datos.tipo === '') {
    errores.tipo = 'Elegí el deporte.';
  }

  if (datos.canchaId === '') {
    errores.canchaId = 'Elegí la cancha.';
  }

  if (datos.fecha === '') {
    errores.fecha = 'Elegí el día del turno.';
  }

  if (datos.hora === '') {
    errores.hora = 'Elegí la hora de inicio.';
  }

  // No se puede reservar en el pasado
  if (datos.fecha !== '' && datos.hora !== '' && turnoPasado(datos.fecha, datos.hora)) {
    errores.hora = 'No se puede reservar en un día o una hora que ya pasaron.';
  }

  // El turno no puede pisar otra reserva ni pasar el horario de cierre
  if (datos.canchaId !== '' && datos.hora !== '' && datos.fecha !== '') {
    const libre = rangoLibre(
      reservas,
      Number(datos.canchaId),
      datos.fecha,
      datos.hora,
      Number(datos.duracion),
    );
    if (!libre) {
      errores.hora = 'Ese turno se superpone con otra reserva o pasa el cierre.';
    }
  }

  if (Number(datos.sena) < minimo) {
    errores.sena = `La seña no puede ser menor a ${formatearPrecio(minimo)}.`;
  }

  if (!datos.politica) {
    errores.politica = 'Tenés que confirmar que el cliente fue informado.';
  }

  return errores;
}

function Reservar({ reservas = [], agregar }) {
  // Si venimos desde Canchas u Horarios, llegan la cancha, la hora y el día
  const [parametros] = useSearchParams();

  const canchaElegida = buscarCancha(parametros.get('cancha'));

  const [datos, setDatos] = useState({
    ...datosIniciales,
    tipo: canchaElegida === null ? '' : canchaElegida.tipo,
    canchaId: parametros.get('cancha') || '',
    hora: parametros.get('hora') || '',
    fecha: parametros.get('fecha') || fechaDeHoy(),
  });

  // Qué campos están mal. Se llena recién al apretar Guardar.
  const [errores, setErrores] = useState({});

  // null = sin modal, 'ok' = se guardó, 'error' = algo falló
  const [modal, setModal] = useState(null);

  // El título de la pestaña, para el SEO: cada página tiene el suyo
  useEffect(() => {
    document.title = TITULO;
  }, []);

  const cancha = buscarCancha(datos.canchaId);
  const tipo = cancha === null ? datos.tipo : cancha.tipo;
  const duraciones = tipo === '' ? [1] : duracionesPorTipo[tipo];
  const precio = calcularPrecio(tipo, Number(datos.duracion), datos.hora);
  const minimo = senaMinima(precio);

  const opcionesDeCancha = canchasDelDeporte(datos.tipo);
  const opcionesDeHora = horasLibres(reservas, datos.canchaId, datos.fecha);

  // Un solo manejador para todos los campos.
  // El name del input dice qué dato cambiar, y qué se le deja escribir.

  function manejarCambio(evento) {
    const { name, value, type, checked } = evento.target;

    // En los nombres no entran números
    if (name === 'apellido' || name === 'nombre') {
      const limpio = soloLetras(value);
      if (limpio !== value) {
        avisar('En el nombre y el apellido solo se pueden escribir letras.');
      }
      setDatos({ ...datos, [name]: limpio });
      return;
    }

    // En el celular solo entran números
    if (name === 'telefono') {
      const limpio = soloNumeros(value);
      if (limpio !== value) {
        avisar('En el celular solo se pueden escribir números.');
      }
      setDatos({ ...datos, telefono: limpio });
      return;
    }

    // Si cambia el deporte, se borra la cancha que estaba elegida
    if (name === 'tipo') {
      setDatos({ ...datos, tipo: value, canchaId: '', duracion: 1 });
      return;
    }

    if (type === 'checkbox') {
      setDatos({ ...datos, [name]: checked });
      return;
    }

    setDatos({ ...datos, [name]: value });
  }

  function manejarEnvio(evento) {
    evento.preventDefault();

    const nuevosErrores = validar(datos, reservas, minimo);
    setErrores(nuevosErrores);

    // Si hay al menos un error, no se guarda nada
    if (Object.keys(nuevosErrores).length > 0) {
      setModal('error');
      return;
    }

    agregar({
      canchaId: Number(datos.canchaId),
      fecha: datos.fecha,
      hora: datos.hora,
      duracion: Number(datos.duracion),
      cliente: `${datos.apellido.trim()}, ${datos.nombre.trim()}`,
      telefono: datos.telefono,
      sena: Number(datos.sena),
      politica: true,
    });

    setModal('ok');
    setErrores({});
    setDatos({ ...datosIniciales, fecha: fechaDeHoy() });
  }

  return (
    <main>
      <Hero titulo="Cargar reserva" texto="Completá los datos del cliente y del turno." />

      <Container className="py-5">
        <section>
          <Card className="border-0 shadow-sm rounded-4">
            <Card.Body className="p-4 p-md-5">
              <h2 className="titulo-cal">Nueva reserva</h2>

              <Form noValidate onSubmit={manejarEnvio}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group controlId="apellido">
                      <Form.Label className="fw-semibold">Apellido</Form.Label>
                      <Form.Control type="text" name="apellido" size="lg" placeholder="Pérez" value={datos.apellido} onChange={manejarCambio} isInvalid={Boolean(errores.apellido)}/>
                      <Form.Control.Feedback type="invalid">
                        {errores.apellido}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="nombre">
                      <Form.Label className="fw-semibold">Nombre</Form.Label>
                      <Form.Control type="text" name="nombre" size="lg" placeholder="Juan" value={datos.nombre} onChange={manejarCambio} isInvalid={Boolean(errores.nombre)}/>
                      <Form.Control.Feedback type="invalid">
                        {errores.nombre}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="telefono">
                      <Form.Label className="fw-semibold">Celular</Form.Label>
                      <Form.Control type="tel" name="telefono" size="lg" placeholder="3884000000" value={datos.telefono} onChange={manejarCambio} isInvalid={Boolean(errores.telefono)}/>
                      <Form.Control.Feedback type="invalid">
                        {errores.telefono}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group controlId="tipo">
                      <Form.Label className="fw-semibold">Deporte</Form.Label>
                      <Form.Select name="tipo" size="lg" value={datos.tipo} onChange={manejarCambio} isInvalid={Boolean(errores.tipo)}>
                        <option value="">Elegí</option>
                        {deportes.map((deporte) => (
                          <option key={deporte} value={deporte}>
                            {deporte}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errores.tipo}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group controlId="canchaId">
                      <Form.Label className="fw-semibold">Cancha</Form.Label>
                      <Form.Select name="canchaId" size="lg"  value={datos.canchaId} onChange={manejarCambio} isInvalid={Boolean(errores.canchaId)}>
                        <option value="">Elegí</option>
                        {opcionesDeCancha.map((unaCancha) => (
                          <option key={unaCancha.id} value={unaCancha.id}>
                            {unaCancha.nombre}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errores.canchaId}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group controlId="fecha">
                      <Form.Label className="fw-semibold">Día</Form.Label>
                      <Form.Control type="date" name="fecha" size="lg" min={fechaDeHoy()}  value={datos.fecha} onChange={manejarCambio} isInvalid={Boolean(errores.fecha)}/>
                      <Form.Control.Feedback type="invalid">
                        {errores.fecha}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group controlId="hora">
                      <Form.Label className="fw-semibold">Hora de inicio</Form.Label>
                      <Form.Select  name="hora" size="lg" value={datos.hora} onChange={manejarCambio} disabled={datos.canchaId === ''} isInvalid={Boolean(errores.hora)}>
                        <option value="">
                          {datos.canchaId === '' ? 'Elegí la cancha' : 'Elegí una hora'}
                        </option>
                        {opcionesDeHora.map((hora) => (
                          <option key={hora} value={hora}>
                            {hora}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errores.hora}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={4}>
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
                    <Alert variant="light" className="mb-0">
                      El turno sale <strong>{formatearPrecio(precio)}</strong> — seña mínima <strong>{formatearPrecio(minimo)}</strong>
                    </Alert>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="sena">
                      <Form.Label className="fw-semibold">Seña recibida</Form.Label>
                      <Form.Control type="number" name="sena" size="lg" min={minimo} placeholder={String(minimo)} value={datos.sena} onChange={manejarCambio} isInvalid={Boolean(errores.sena)}/>
                      <Form.Control.Feedback type="invalid">
                        {errores.sena}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group controlId="politica">
                      <Form.Check type="checkbox" name="politica" checked={datos.politica} onChange={manejarCambio} isInvalid={Boolean(errores.politica)} label="El cliente fue informado de la política de cancelación" feedback={errores.politica} feedbackType="invalid"/>
                    </Form.Group>
                  </Col>

                  <Col xs={12} className="d-grid d-sm-block">
                    <Button type="submit" size="lg" className="btn-club px-4">
                      Guardar reserva
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </section>
      </Container>

      <Modal show={modal !== null} onHide={() => setModal(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {modal === 'ok' ? 'Reserva generada' : 'No se pudo guardar'}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {modal === 'ok'
            ? 'La reserva se generó con éxito.'
            : 'Revisá los campos marcados en rojo. La reserva no se guardó.'}
        </Modal.Body>

        <Modal.Footer>
          <Button className="btn-club" onClick={() => setModal(null)}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
}

export default Reservar;