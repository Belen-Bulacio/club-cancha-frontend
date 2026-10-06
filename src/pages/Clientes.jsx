import { useState } from "react";
import { Container, Table, Form, Badge } from "react-bootstrap";
import Hero from "../components/Hero";
import { fechaCorta, formatearPrecio } from "../data/funciones";

const Clientes = ({ reservas = [] }) => {
  const [busqueda, setBusqueda] = useState("");

  // Los clientes salen de las reservas, sin repetir.
  // Por cada uno se cuentan sus reservas y lo que señó en total.
  const clientes = [];

  reservas.forEach((reserva) => {
    const yaEsta = clientes.find((cliente) => cliente.telefono === reserva.telefono);

    if (yaEsta) {
      yaEsta.cantidad = yaEsta.cantidad + 1;
      yaEsta.senado = yaEsta.senado + Number(reserva.sena || 0);
      yaEsta.ultima = reserva.fecha + " " + reserva.hora;
    } else {
      clientes.push({
        nombre: reserva.cliente,
        telefono: reserva.telefono,
        cantidad: 1,
        senado: Number(reserva.sena || 0),
        ultima: reserva.fecha + " " + reserva.hora,
      });
    }
  });

  const clientesFiltrados = clientes.filter((cliente) => {
    const texto = busqueda.toLowerCase();
    return (
      cliente.nombre.toLowerCase().includes(texto) ||
      cliente.telefono.includes(texto)
    );
  });

  return (
    <>
      <Hero titulo="Clientes" texto="Quiénes reservaron, cuántas veces y cuánto señaron." />

      <Container className="py-5">
        <h2 className="titulo-cal">Listado de clientes</h2>

        <Form.Control
          type="search"
          placeholder="Buscar por nombre o teléfono"
          className="mb-4"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        {clientesFiltrados.length === 0 ? (
          <p className="text-secondary">No hay clientes para mostrar.</p>
        ) : (
          <Table responsive hover className="align-middle bg-white">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Teléfono</th>
                <th className="text-center">Reservas</th>
                <th>Señado</th>
                <th>Última</th>
              </tr>
            </thead>
            <tbody>
              {clientesFiltrados.map((cliente) => (
                <tr key={cliente.telefono}>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.telefono}</td>
                  <td className="text-center">
                    <Badge bg="secondary">{cliente.cantidad}</Badge>
                  </td>
                  <td>{formatearPrecio(cliente.senado)}</td>
                  <td>
                    {fechaCorta(cliente.ultima.split(" ")[0])} ·{" "}
                    {cliente.ultima.split(" ")[1]}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
    </>
  );
};

export default Clientes;