import Container from 'react-bootstrap/Container';

// El encabezado de todas las páginas. Es un <section> con el <h1>,
// que es lo que pide el SEO: un solo h1 por página.
function Hero({ titulo, texto }) {
  return (
    <section className="hero-club">
      <Container>
        <h1>{titulo}</h1>
        <p className="lead mb-0">{texto}</p>
      </Container>
    </section>
  );
}

export default Hero;
