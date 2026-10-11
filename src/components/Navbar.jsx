import { Navbar, Nav, Container, Image, Button } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";

const NavigationBar = () => {
  return (
    <Navbar expand="lg" className="navbar-club py-2" variant="dark" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
          <Image src="/logo-club.png" alt="Club Cancha" style={{ height: "40px", width: "auto" }}/>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="menu-principal" />

        <Navbar.Collapse id="menu-principal">
          <Nav className="ms-auto align-items-lg-center gap-lg-2">
            <Nav.Link as={NavLink} to="/" end>
              Inicio
            </Nav.Link>
            <Nav.Link as={NavLink} to="/canchas">
              Canchas
            </Nav.Link>
            <Nav.Link as={NavLink} to="/horarios">
              Horarios
            </Nav.Link>
            <Nav.Link as={NavLink} to="/clientes">
              Clientes
            </Nav.Link>

            <Button as={Link} to="/reservar" className="btn-club ms-lg-3">
              Cargar reserva
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
