import { useState } from 'react'
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert
} from 'react-bootstrap'
import '../styles/reservar.css'

// Datos de los recordatorios
const recordatorios = [
  {
    numero: 1,
    titulo: 'Verificá la cancha',
    texto: 'Seleccioná el deporte y la cancha que se quiere reservar.'
  },
  {
    numero: 2,
    titulo: 'Verificá fecha y hora con el cliente',
    texto: 'Comprobá que la fecha y el horario sean los correctos.'
  },
  {
    numero: 3,
    titulo: 'Cargá la reserva',
    texto: 'Aceptá la política de cancelación y confirmá el turno.'
  }
]

// Componente reutilizable para cada recordatorio
function Recordatorio({ numero, titulo, texto }) {
  return (
    <div className="d-flex gap-3 mb-4">
      <span className="paso-numero">{numero}</span>

      <div>
        <h3 className="h5 mb-1">{titulo}</h3>
        <p className="mb-0 text-muted">{texto}</p>
      </div>
    </div>
  )
}

function Reservar() {
  const [formulario, setFormulario] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    deporte: '',
    cancha: '',
    fecha: '',
    hora: '',
    observaciones: '',
    politica: false
  })

  const [mensaje, setMensaje] = useState('')
  const [tipoMensaje, setTipoMensaje] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setFormulario({
      ...formulario,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formulario.politica) {
      setMensaje(
        'Marcá que el cliente fue informado de la política de cancelación.'
      )
      setTipoMensaje('danger')
      return
    }

    setMensaje('Reserva guardada correctamente.')
    setTipoMensaje('success')
  }

  return (
    <main>
      {/* HERO */}
      <section className="hero-club">
        <Container className="py-5">
          <h1>Registrar una Reserva</h1>

          <p className="lead mb-0">
            Cargá los datos del cliente y del turno. Los campos con *
            son obligatorios.
          </p>
        </Container>
      </section>

      {/* FORMULARIO */}
      <section className="py-5">
        <Container>
          <Row className="g-4">

            {/* COLUMNA DEL FORMULARIO */}
            <Col xs={12} lg={8}>
              <Card className="shadow-sm border-0">
                <Card.Body className="p-4">

                  <h2 className="titulo-cal mb-4">
                    Datos de la reserva
                  </h2>

                  <Form onSubmit={handleSubmit}>

                    {/* PASO 1 */}
                    <div className="mb-5">

                      <div className="d-flex align-items-center gap-3 mb-4">
                        <span className="paso-numero">1</span>

                        <h3 className="h4 mb-0">
                          Datos del cliente
                        </h3>
                      </div>

                      <Row className="g-3">

                        {/* NOMBRE */}
                        <Col md={6}>
                          <Form.Group controlId="nombre">
                            <Form.Label>
                              Nombre <span className="obligatorio">*</span>
                            </Form.Label>

                            <Form.Control
                              type="text"
                              name="nombre"
                              value={formulario.nombre}
                              onChange={handleChange}
                              placeholder="Ingresá el nombre"
                              required
                            />
                          </Form.Group>
                        </Col>

                        {/* APELLIDO */}
                        <Col md={6}>
                          <Form.Group controlId="apellido">
                            <Form.Label>
                              Apellido <span className="obligatorio">*</span>
                            </Form.Label>

                            <Form.Control
                              type="text"
                              name="apellido"
                              value={formulario.apellido}
                              onChange={handleChange}
                              placeholder="Ingresá el apellido"
                              required
                            />
                          </Form.Group>
                        </Col>

                        {/* TELÉFONO */}
                        <Col md={6}>
                          <Form.Group controlId="telefono">
                            <Form.Label>
                              Teléfono <span className="obligatorio">*</span>
                            </Form.Label>

                            <Form.Control
                              type="tel"
                              name="telefono"
                              value={formulario.telefono}
                              onChange={handleChange}
                              placeholder="Ej: 3815555555"
                              required
                            />
                          </Form.Group>
                        </Col>

                        {/* EMAIL */}
                        <Col md={6}>
                          <Form.Group controlId="email">
                            <Form.Label>
                              Email <span className="obligatorio">*</span>
                            </Form.Label>

                            <Form.Control
                              type="email"
                              name="email"
                              value={formulario.email}
                              onChange={handleChange}
                              placeholder="cliente@email.com"
                              required
                            />
                          </Form.Group>
                        </Col>

                      </Row>
                    </div>

                    {/* PASO 2 */}
                    <div className="mb-5">

                      <div className="d-flex align-items-center gap-3 mb-4">
                        <span className="paso-numero">2</span>

                        <h3 className="h4 mb-0">
                          Datos del turno
                        </h3>
                      </div>

                      <Row className="g-3">

                        {/* DEPORTE */}
                        <Col md={6}>
                          <Form.Group controlId="deporte">
                            <Form.Label>
                              Deporte <span className="obligatorio">*</span>
                            </Form.Label>

                            <Form.Select
                              name="deporte"
                              value={formulario.deporte}
                              onChange={handleChange}
                              required
                            >
                              <option value="">
                                Seleccioná un deporte
                              </option>

                              <option value="Fútbol">
                                Fútbol
                              </option>

                              <option value="Pádel">
                                Pádel
                              </option>

                              <option value="Vóley">
                                Vóley
                              </option>
                            </Form.Select>
                          </Form.Group>
                        </Col>

                        {/* CANCHA */}
                        <Col md={6}>
                          <Form.Group controlId="cancha">
                            <Form.Label>
                              Cancha <span className="obligatorio">*</span>
                            </Form.Label>

                            <Form.Select
                              name="cancha"
                              value={formulario.cancha}
                              onChange={handleChange}
                              required
                            >
                              <option value="">
                                Seleccioná una cancha
                              </option>

                              <option value="Cancha 1">
                                Cancha 1
                              </option>

                              <option value="Cancha 2">
                                Cancha 2
                              </option>

                              <option value="Cancha 3">
                                Cancha 3
                              </option>
                            </Form.Select>
                          </Form.Group>
                        </Col>

                        {/* FECHA */}
                        <Col md={6}>
                          <Form.Group controlId="fecha">
                            <Form.Label>
                              Fecha <span className="obligatorio">*</span>
                            </Form.Label>

                            <Form.Control
                              type="date"
                              name="fecha"
                              value={formulario.fecha}
                              onChange={handleChange}
                              required
                            />
                          </Form.Group>
                        </Col>

                        {/* HORA */}
                        <Col md={6}>
                          <Form.Group controlId="hora">
                            <Form.Label>
                              Hora <span className="obligatorio">*</span>
                            </Form.Label>

                            <Form.Select
                              name="hora"
                              value={formulario.hora}
                              onChange={handleChange}
                              required
                            >
                              <option value="">
                                Seleccioná un horario
                              </option>

                              <option value="09:00">09:00</option>
                              <option value="10:00">10:00</option>
                              <option value="11:00">11:00</option>
                              <option value="12:00">12:00</option>
                              <option value="17:00">17:00</option>
                              <option value="18:00">18:00</option>
                              <option value="19:00">19:00</option>
                              <option value="20:00">20:00</option>
                              <option value="21:00">21:00</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>

                        {/* OBSERVACIONES */}
                        <Col xs={12}>
                          <Form.Group controlId="observaciones">
                            <Form.Label>
                              Observaciones
                            </Form.Label>

                            <Form.Control
                              as="textarea"
                              rows={4}
                              name="observaciones"
                              value={formulario.observaciones}
                              onChange={handleChange}
                              placeholder="Agregá alguna observación si es necesario"
                            />
                          </Form.Group>
                        </Col>

                      </Row>
                    </div>

                    {/* PASO 3 */}
                    <div className="mb-4">

                      <div className="d-flex align-items-center gap-3 mb-4">
                        <span className="paso-numero">3</span>

                        <h3 className="h4 mb-0">
                          Confirmación
                        </h3>
                      </div>

                      <Form.Check
                        type="checkbox"
                        id="politica"
                        name="politica"
                        checked={formulario.politica}
                        onChange={handleChange}
                        label="El cliente fue informado sobre la política de cancelación."
                      />
                    </div>

                    {/* MENSAJE */}
                    {mensaje && (
                      <Alert variant={tipoMensaje} className="mt-3">
                        {mensaje}
                      </Alert>
                    )}

                    {/* BOTÓN */}
                    <div className="mt-4">
                      <Button
                        type="submit"
                        className="btn-club"
                      >
                        Guardar reserva
                      </Button>
                    </div>

                  </Form>
                </Card.Body>
              </Card>
            </Col>

            {/* COLUMNA DE RECORDATORIOS */}
            <Col xs={12} lg={4}>
              <aside className="sticky-top reserva-recordatorio">

                <Card className="shadow-sm border-0">
                  <Card.Body className="p-4">

                    <h2 className="h4 titulo-cal mb-4">
                      Recordatorios
                    </h2>

                    {/* map() + props */}
                    {recordatorios.map((recordatorio) => (
                      <Recordatorio
                        key={recordatorio.numero}
                        numero={recordatorio.numero}
                        titulo={recordatorio.titulo}
                        texto={recordatorio.texto}
                      />
                    ))}

                    <Alert variant="light" className="mt-4 mb-0">
                      <strong>Importante:</strong> verificá todos los datos
                      antes de guardar la reserva.
                    </Alert>

                  </Card.Body>
                </Card>

              </aside>
            </Col>

          </Row>
        </Container>
      </section>
    </main>
  )
}

export default Reservar