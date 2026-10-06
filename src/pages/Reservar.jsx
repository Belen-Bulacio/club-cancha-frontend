import { useState } from "react";
import { Container, Form, Row, Col, Button, Modal, Alert } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import Hero from "../components/Hero";
import { canchas, horarios, duracionesPorTipo } from "../data/datosIniciales";
import {
  estadoDelTurno, fechaDeHoy, calcularPrecio, senaMinima, formatearPrecio,
} from "../data/funciones";

const Reservar = ({ reservas = [], agregar }) => {
  // Si venimos desde Canchas u Horarios, llegan la cancha, la hora y el día
  const [parametros] = useSearchParams();

  const [apellido, setApellido] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [tipo, setTipo] = useState("");
  const [canchaId, setCanchaId] = useState(parametros.get("cancha") || "");
  const [fecha, setFecha] = useState(parametros.get("fecha") || fechaDeHoy());
  const [hora, setHora] = useState(parametros.get("hora") || "");
  const [duracion, setDuracion] = useState(1);
  const [sena, setSena] = useState("");
  const [politica, setPolitica] = useState(false);

  // null = sin modal, "ok" = se guardó, un texto = el error a mostrar
  const [modal, setModal] = useState(null);

  const canchaElegida = canchas.find((c) => c.id === Number(canchaId));
  const tipoElegido = canchaElegida ? canchaElegida.tipo : tipo;

  const duraciones = tipoElegido ? duracionesPorTipo[tipoElegido] : [1];
  const precio = calcularPrecio(tipoElegido, Number(duracion), hora);
  const minimo = senaMinima(precio);

  const canchasDelTipo = canchas.filter((cancha) => cancha.tipo === tipo);

  const horasLibres = horarios.filter((unaHora) => {
    return estadoDelTurno(reservas, Number(canchaId), fecha, unaHora) === "libre";
  });

  const guardar = (evento) => {
    evento.preventDefault();

    if (!apellido || !nombre || !telefono || !canchaId || !fecha || !hora) {
      setModal("Faltan datos obligatorios. La reserva no se guardó.");
      return;
    }
    if (!politica) {
      setModal("Tenés que confirmar que el cliente fue informado de la política de cancelación.");
      return;
    }
    if (Number(sena) < minimo) {
      setModal("La seña no puede ser menor a " + formatearPrecio(minimo) + ".");
      return;
    }

    agregar({
      canchaId: Number(canchaId),
      fecha: fecha,
      hora: hora,
      duracion: Number(duracion),
      cliente: apellido + ", " + nombre,
      telefono: telefono,
      sena: Number(sena),
      politica: true,
    });

    setModal("ok");

    setApellido(""); setNombre(""); setTelefono("");
    setTipo(""); setCanchaId(""); setHora("");
    setDuracion(1); setSena(""); setPolitica(false);
  };

  return (
    <>
      <Hero titulo="Cargar reserva" texto="Completá los datos del cliente y del turno." />

      <Container className="py-5">
        <h2 className="titulo-cal">Nueva reserva</h2>

        <Form onSubmit={guardar} className="bg-white p-4 rounded shadow-sm">
          <Row className="g-3">
            <Col xs={12} md={6}>
              <Form.Label>Apellido</Form.Label>
              <Form.Control value={apellido} onChange={(e) => setApellido(e.target.value)} />
            </Col>

            <Col xs={12} md={6}>
              <Form.Label>Nombre</Form.Label>
              <Form.Control value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </Col>

            <Col xs={12} md={6}>
              <Form.Label>Celular</Form.Label>
              <Form.Control type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
            </Col>

            <Col xs={12} md={3}>
              <Form.Label>Deporte</Form.Label>
              <Form.Select
                value={tipo}
                onChange={(e) => { setTipo(e.target.value); setCanchaId(""); setDuracion(1); }}
              >
                <option value="">Elegí</option>
                <option value="Fútbol">Fútbol</option>
                <option value="Pádel">Pádel</option>
              </Form.Select>
            </Col>

            <Col xs={12} md={3}>
              <Form.Label>Cancha</Form.Label>
              <Form.Select value={canchaId} onChange={(e) => setCanchaId(e.target.value)}>
                <option value="">Elegí</option>
                {canchasDelTipo.map((cancha) => (
                  <option value={cancha.id} key={cancha.id}>{cancha.nombre}</option>
                ))}
              </Form.Select>
            </Col>

            <Col xs={12} md={4}>
              <Form.Label>Día</Form.Label>
              <Form.Control
                type="date"
                value={fecha}
                min={fechaDeHoy()}
                onChange={(e) => setFecha(e.target.value)}
              />
            </Col>

            <Col xs={12} md={4}>
              <Form.Label>Hora de inicio</Form.Label>
              <Form.Select value={hora} onChange={(e) => setHora(e.target.value)} disabled={!canchaId}>
                <option value="">{canchaId ? "Elegí una hora" : "Elegí la cancha"}</option>
                {horasLibres.map((unaHora) => (
                  <option value={unaHora} key={unaHora}>{unaHora}</option>
                ))}
              </Form.Select>
            </Col>

            <Col xs={12} md={4}>
              <Form.Label>Duración</Form.Label>
              <Form.Select value={duracion} onChange={(e) => setDuracion(e.target.value)}>
                {duraciones.map((unaDuracion) => (
                  <option value={unaDuracion} key={unaDuracion}>{unaDuracion} h</option>
                ))}
              </Form.Select>
            </Col>

            <Col xs={12}>
              <Alert variant="light" className="mb-0">
                El turno sale <strong>{formatearPrecio(precio)}</strong> — seña mínima{" "}
                <strong>{formatearPrecio(minimo)}</strong>
              </Alert>
            </Col>

            <Col xs={12} md={6}>
              <Form.Label>Seña recibida</Form.Label>
              <Form.Control
                type="number"
                min={minimo}
                value={sena}
                onChange={(e) => setSena(e.target.value)}
              />
            </Col>

            <Col xs={12}>
              <Form.Check
                type="checkbox"
                checked={politica}
                onChange={(e) => setPolitica(e.target.checked)}
                label="El cliente fue informado de la política de cancelación"
              />
            </Col>

            <Col xs={12}>
              <Button type="submit" className="btn-club mt-3">Guardar reserva</Button>
            </Col>
          </Row>
        </Form>
      </Container>

      <Modal show={modal !== null} onHide={() => setModal(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modal === "ok" ? "Reserva generada" : "No se pudo guardar"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modal === "ok" ? "La reserva se generó con éxito." : modal}
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn-club" onClick={() => setModal(null)}>Aceptar</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Reservar;