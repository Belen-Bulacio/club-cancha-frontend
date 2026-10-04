import { Link } from "react-router-dom";

function Error404() {
  return (
    <main className="container py-5 text-center">
      <p className="display-1 fw-bold">404</p>
      <h1 className="titulo-cal d-inline-block">Página no encontrada</h1>
      <p className="text-secondary mt-3">
        La dirección que escribiste no existe en el sistema.
      </p>
      <Link className="btn btn-club mt-3" to="/">
        Volver al inicio
      </Link>
    </main>
  );
}

export default Error404;
