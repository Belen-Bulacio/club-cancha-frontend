import { Container, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

function Hero({ titulo, texto }) {
  const navigate = useNavigate();
  const location = useLocation();

  // React Router marca con 'default' la primera página que se abrió.
  // Si es esa, no hay una página anterior a la que volver.
  const hayPaginaAnterior = location.key !== 'default';

  return (
    <section className="hero-club">
      <Container>
        {hayPaginaAnterior && (
          <Button variant="link" className="text-white fs-2 p-0 mb-2" aria-label="Volver a la página anterior" title="Volver" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left"></i>
          </Button>
        )}
        <h1>{titulo}</h1>
        <p className="lead mb-0">{texto}</p>
      </Container>
    </section>
  );
}

export default Hero;
