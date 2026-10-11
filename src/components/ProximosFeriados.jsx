import { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Spinner from 'react-bootstrap/Spinner';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  fechaDeHoy,
  fechaCorta,
  nombreDelDia,
  contarReservasDelDia,
} from '../data/funciones';

// La dirección de la API sale del archivo .env: no se escribe acá
const API_URL = import.meta.env.VITE_API_URL;

const CUANTOS = 4;

// Los feriados que todavía no pasaron, ordenados por fecha y recortados
function soloLosQueVienen(feriados) {
  const hoy = fechaDeHoy();

  return feriados
    .filter((feriado) => feriado.fecha >= hoy)
    .sort((uno, otro) => (uno.fecha < otro.fecha ? -1 : 1))
    .slice(0, CUANTOS);
}

function ProximosFeriados({ reservas = [] }) {
  const [feriados, setFeriados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // useEffect no puede ser async, porque React espera que devuelva la
    // función de limpieza y una función async siempre devuelve una promesa.
    // Entonces se declara la función async adentro y se la llama.
    async function traerFeriados() {
      try {
        const anio = new Date().getFullYear();
        const respuesta = await axios.get(`${API_URL}/${anio}`);
        setFeriados(soloLosQueVienen(respuesta.data));
      } catch {
        setError(true);
        Swal.fire({
          icon: 'error',
          title: 'No se pudieron cargar los feriados',
          text: 'Revisá la conexión a internet e intentá de nuevo más tarde.',
          confirmButtonText: 'Entendido',
        });
      } finally {
        // El finally corre siempre, salga bien o mal: el cartel de carga
        // tiene que desaparecer en los dos casos.
        setCargando(false);
      }
    }

    traerFeriados();
  }, []);

  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <Card.Title as="h3" className="h5">
          Próximos feriados
        </Card.Title>
        <Card.Subtitle className="text-secondary mb-3">
          Son los días de mayor demanda del club.
        </Card.Subtitle>

        {cargando && (
          <div className="text-secondary d-flex align-items-center gap-2">
            <Spinner animation="border" size="sm" />
            Cargando feriados...
          </div>
        )}

        {error && (
          <p className="text-secondary mb-0">No se pudieron cargar los feriados.</p>
        )}

        {!cargando && !error && feriados.length === 0 && (
          <p className="text-secondary mb-0">No quedan feriados este año.</p>
        )}

        {!cargando && !error && feriados.length > 0 && (
          <ListGroup variant="flush">
            {feriados.map((feriado) => {
              const cantidad = contarReservasDelDia(reservas, feriado.fecha);

              return (
                <ListGroup.Item
                  key={feriado.fecha}
                  className="px-0 d-flex justify-content-between align-items-start gap-2"
                >
                  <div>
                    <strong className="text-capitalize">
                      {nombreDelDia(feriado.fecha)} {fechaCorta(feriado.fecha)}
                    </strong>
                    <br />
                    <small className="text-secondary">{feriado.nombre}</small>
                  </div>

                  {cantidad === 0 && <Badge bg="secondary">sin reservas</Badge>}
                  {cantidad > 0 && <Badge bg="primary">{cantidad} reservas</Badge>}
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );
}

export default ProximosFeriados;
