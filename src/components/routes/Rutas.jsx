import { Routes, Route } from "react-router-dom";
import Inicio from "../../pages/Inicio";
import Canchas from "../../pages/Canchas";
import Horarios from "../../pages/Horarios";
import Reservar from "../../pages/Reservar";
import Clientes from "../../pages/Clientes";
import Error404 from "../../pages/Error404";

const Rutas = ({ reservas, agregar, editar, cancelar, borrar }) => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Inicio
            reservas={reservas}
            editar={editar}
            cancelar={cancelar}
            borrar={borrar}
          />
        }
      />
      <Route path="/canchas" element={<Canchas reservas={reservas} />} />
      <Route path="/horarios" element={<Horarios reservas={reservas} />} />
      <Route path="/reservar" element={<Reservar reservas={reservas} agregar={agregar} />}/>
      <Route path="/clientes" element={<Clientes reservas={reservas} />} />
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
};

export default Rutas;
