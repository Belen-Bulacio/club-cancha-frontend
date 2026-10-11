import { Container, Row, Col, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const secciones = [
  { texto: 'Inicio', ruta: '/' },
  { texto: 'Canchas', ruta: '/canchas' },
  { texto: 'Horarios', ruta: '/horarios' },
  { texto: 'Reservar', ruta: '/reservar' },
  { texto: 'Clientes', ruta: '/clientes' },
];

const contacto = [
  '+54 388 400-0000',
  'administracion@clubcancha.com.ar',
  'Todos los días, de 8 a 00 h',
];

function Footer() {
  const anio = new Date().getFullYear();

  return (
    <footer className="pie-club mt-auto py-5">
      <Container>
        <Row className="g-4">
          <Col xs={12} md={5}>
            <h2 className="h5">Club Cancha</h2>
            <p className="mb-0">
              Sistema interno de gestión de turnos para canchas de fútbol 5, fútbol 7
              y pádel.
            </p>
          </Col>

          <Col xs={6} md={3}>
            <h2 className="h6 text-uppercase">Secciones</h2>
            <Nav as="nav" className="flex-column">
              {secciones.map((seccion) => (
                <Nav.Link
                  key={seccion.ruta}
                  as={NavLink}
                  to={seccion.ruta}
                  className="p-0 mb-1"
                >
                  {seccion.texto}
                </Nav.Link>
              ))}
            </Nav>
          </Col>

          <Col xs={6} md={4}>
            <h2 className="h6 text-uppercase">Administración</h2>
            <address className="mb-0">
              {contacto.map((dato) => (
                <p className="mb-1 text-break" key={dato}>
                  {dato}
                </p>
              ))}
            </address>
          </Col>
        </Row>

        <hr className="border-secondary my-4" />

        <p className="text-center small mb-0">
          Copyright {anio} · Grupo 6 · Sistema interno del club
        </p>
      </Container>
    </footer>
  );
}

export default Footer;
