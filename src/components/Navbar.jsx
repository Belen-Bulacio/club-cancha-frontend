import { Navbar, Nav, Container, Image, Button } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';

// Las secciones del menú. Agregar una es agregar una línea acá.
const secciones = [
  { texto: 'Inicio', ruta: '/' },
  { texto: 'Canchas', ruta: '/canchas' },
  { texto: 'Horarios', ruta: '/horarios' },
  { texto: 'Clientes', ruta: '/clientes' },
];

function NavegacionPrincipal() {
  return (
    <Navbar as="header" expand="lg" className="navbar-club py-2" variant="dark" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <Image src="/logo-club.png" alt="Club Cancha" style={{ height: '40px', width: 'auto' }}
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="menu-principal" />

        <Navbar.Collapse id="menu-principal">
          <Nav as="nav" className="ms-auto align-items-lg-center gap-lg-2">
            {secciones.map((seccion) => (
              <Nav.Link key={seccion.ruta} as={NavLink} to={seccion.ruta} end={seccion.ruta === '/'}>
                {seccion.texto}
              </Nav.Link>
            ))}
            <Button as={Link} to="/reservar" className="btn-club ms-lg-3">
              Cargar reserva
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavegacionPrincipal;
