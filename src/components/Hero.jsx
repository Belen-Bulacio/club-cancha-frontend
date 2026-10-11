import { Container } from "react-bootstrap";

const Hero = ({ titulo, texto }) => {
  return (
    <div className="hero-club py-5">
      <Container>
        <h1>{titulo}</h1>
        <p className="lead mb-0">{texto}</p>
      </Container>
    </div>
  );
};

export default Hero;
