import { Container, Row, Col, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const Footer = () => {
  const anio = new Date().getFullYear();

  return (
    <footer className="pie-club mt-auto py-5">
      <Container>
        <Row className="g-4">
          <Col xs={12} md={5}>
            <h3 className="h5">Club Cancha</h3>
            <p className="mb-0">
              Sistema interno de gestión de turnos para canchas de fútbol 5,
              fútbol 7 y pádel.
            </p>
          </Col>

          <Col xs={6} md={3}>
            <h3 className="h6 text-uppercase">Secciones</h3>
            <Nav className="flex-column">
              <Nav.Link as={NavLink} to="/" className="p-0 mb-1">
                Inicio
              </Nav.Link>
              <Nav.Link as={NavLink} to="/canchas" className="p-0 mb-1">
                Canchas
              </Nav.Link>
              <Nav.Link as={NavLink} to="/horarios" className="p-0 mb-1">
                Horarios
              </Nav.Link>
              <Nav.Link as={NavLink} to="/reservar" className="p-0 mb-1">
                Reservar
              </Nav.Link>
              <Nav.Link as={NavLink} to="/clientes" className="p-0">
                Clientes
              </Nav.Link>
            </Nav>
          </Col>

          <Col xs={6} md={4}>
            <h3 className="h6 text-uppercase">Administración</h3>
            <p className="mb-1">+54 388 400-0000</p>
            <p className="mb-1">administracion@clubcancha.com.ar</p>
            <p className="mb-0">Todos los días, de 8 a 00 h</p>
          </Col>
        </Row>

        <hr className="border-secondary my-4" />

        <p className="text-center small mb-0">
          Copyright {anio} · Grupo 6 · Sistema interno del club
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
