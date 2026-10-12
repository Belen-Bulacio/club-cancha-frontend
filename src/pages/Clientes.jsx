import { useState, useEffect } from 'react';
import { Container, Table, Form, Badge } from 'react-bootstrap';
import Hero from '../components/Hero';
import { fechaCorta, formatearPrecio } from '../data/funciones';

const TITULO = 'Clientes | Club Cancha';

// Arma la lista de clientes a partir de las reservas, sin repetir.
// Por cada uno cuenta sus reservas y suma lo que señó.

function armarClientes(reservas) {
  const clientes = [];

  reservas.forEach((reserva) => {
    const existente = clientes.find((cliente) => cliente.telefono === reserva.telefono);

    if (existente) {
      existente.cantidad = existente.cantidad + 1;
      existente.senado = existente.senado + Number(reserva.sena);
      existente.ultimaFecha = reserva.fecha;
      existente.ultimaHora = reserva.hora;
    } else {
      clientes.push({
        nombre: reserva.cliente,
        telefono: reserva.telefono,
        cantidad: 1,
        senado: Number(reserva.sena),
        ultimaFecha: reserva.fecha,
        ultimaHora: reserva.hora,
      });
    }
  });

  return clientes;
}

// Los clientes cuyo nombre o teléfono contienen lo que se escribió

function filtrarClientes(clientes, busqueda) {
  const texto = busqueda.trim().toLowerCase();

  if (texto === '') {
    return clientes;
  }

  return clientes.filter(
    (cliente) =>
      cliente.nombre.toLowerCase().includes(texto) || cliente.telefono.includes(texto),
  );
}

function Clientes({ reservas = [] }) {
  // Lo que se escribió en el buscador
  const [busqueda, setBusqueda] = useState('');

  // El título de la pestaña, para el SEO: cada página tiene el suyo

  useEffect(() => {
    document.title = TITULO;
  }, []);

  const clientes = armarClientes(reservas);
  const clientesVisibles = filtrarClientes(clientes, busqueda);

  function manejarBusqueda(evento) {
    setBusqueda(evento.target.value);
  }

  return (
    <main>
      <Hero titulo="Clientes" texto="Quiénes reservaron, cuántas veces y cuánto señaron." />

      <Container className="py-5">
        <section>
          <h2 className="titulo-cal">Listado de clientes</h2>

          <Form.Group controlId="busqueda" className="mb-4">
            <Form.Label className="fw-semibold">Buscar cliente</Form.Label>
            <Form.Control type="search" size="lg" placeholder="Buscar por nombre o teléfono" value={busqueda} onChange={manejarBusqueda}/>
          </Form.Group>

          {clientesVisibles.length === 0 && (
            <p className="text-secondary">No hay clientes para mostrar.</p>
          )}

          {clientesVisibles.length > 0 && (
            <Table responsive hover className="align-middle bg-white">
              <caption className="text-secondary">
                Clientes del club, deducidos de las reservas cargadas.
              </caption>

              <thead>
                <tr>
                  <th scope="col">Cliente</th>
                  <th scope="col">Teléfono</th>
                  <th scope="col" className="text-center">
                    Reservas
                  </th>
                  <th scope="col" className="d-none d-md-table-cell">
                    Señado
                  </th>
                  <th scope="col" className="d-none d-md-table-cell">
                    Última
                  </th>
                </tr>
              </thead>

              <tbody>
                {clientesVisibles.map((cliente) => (
                  <tr key={cliente.telefono}>
                    <th scope="row" className="fw-normal">
                      {cliente.nombre}
                    </th>
                    <td>{cliente.telefono}</td>
                    <td className="text-center">
                      <Badge bg="secondary">{cliente.cantidad}</Badge>
                    </td>
                    <td className="d-none d-md-table-cell">
                      {formatearPrecio(cliente.senado)}
                    </td>
                    <td className="d-none d-md-table-cell">
                      {fechaCorta(cliente.ultimaFecha)} · {cliente.ultimaHora}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </section>
      </Container>
    </main>
  );
}

export default Clientes;