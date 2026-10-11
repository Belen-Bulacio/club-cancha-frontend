import { Container } from 'react-bootstrap';

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
