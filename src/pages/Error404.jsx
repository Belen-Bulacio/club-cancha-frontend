import { useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

const TITULO = 'Página no encontrada | Club Cancha';

function Error404() {
  useEffect(() => {
    document.title = TITULO;
  }, []);

  return (
    <main>
      <Container className="py-5 text-center">
        <p className="display-1 fw-bold mb-0">404</p>
        <h1 className="titulo-cal d-inline-block">Página no encontrada</h1>
        <p className="text-secondary mt-3">
          La dirección que escribiste no existe en el sistema.
        </p>
        <Button as={Link} to="/" className="btn-club mt-3">
          Volver al inicio
        </Button>
      </Container>
    </main>
  );
}

export default Error404;
