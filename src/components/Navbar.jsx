import { useState } from 'react';
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
  // Si el menú hamburguesa del celular está abierto o cerrado
  const [abierto, setAbierto] = useState(false);

  // Al tocar cualquier link, el menú se cierra
  const cerrarMenu = () => setAbierto(false);

  return (
    <Navbar as="header" expand="lg" className="navbar-club py-2" variant="dark" sticky="top" expanded={abierto} onToggle={setAbierto}>
      <Container>
        <Navbar.Brand as={Link} to="/" onClick={cerrarMenu}>
          <Image src="/logo-club.png" alt="Club Cancha" style={{ height: '40px', width: 'auto' }} />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="menu-principal" />

        <Navbar.Collapse id="menu-principal">
          <Nav as="nav" className="ms-auto align-items-lg-center gap-lg-2">
            {secciones.map((seccion) => (
              <Nav.Link key={seccion.ruta} as={NavLink} to={seccion.ruta} end={seccion.ruta === '/'} onClick={cerrarMenu}>
                {seccion.texto}
              </Nav.Link>
            ))}
            <Button as={Link} to="/reservar" className="btn-club ms-lg-3" onClick={cerrarMenu}>
              Cargar reserva
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavegacionPrincipal;
