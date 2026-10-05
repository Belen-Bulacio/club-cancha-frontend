function TarjetaDato({ numero, texto }) {
  return (
    <div className="col-12 col-md-4">
      <div className="card card-inicio h-100 text-center p-3">
        <p className="display-5 fw-bold mb-0">{numero}</p>
        <p className="text-secondary mb-0">{texto}</p>
      </div>
    </div>
  );
}

export default TarjetaDato;
