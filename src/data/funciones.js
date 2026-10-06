import { tarifas } from "./datosIniciales";

export const fechaDeHoy = () => {
  return new Date().toISOString().slice(0, 10);
};

export const formatearFecha = (fecha) => {
  const partes = fecha.split("-");
  const f = new Date(partes[0], partes[1] - 1, partes[2]);
  return f.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const fechaCorta = (fecha) => {
  const partes = fecha.split("-");
  return partes[2] + "/" + partes[1];
};


export const franjaDeLaHora = (hora) => {
  if (Number(hora.slice(0, 2)) < 17) {
    return "dia";
  }
  return "noche";
};

export const calcularPrecio = (tipo, duracion, hora) => {
  if (!tipo || !hora) {
    return 0;
  }
  const porTipo = tarifas[tipo];
  if (!porTipo) {
    return 0;
  }
  const porDuracion = porTipo[duracion];
  if (!porDuracion) {
    return 0;
  }
  return porDuracion[franjaDeLaHora(hora)];
};

export const senaMinima = (precio) => {
  return precio / 2;
};

export const formatearPrecio = (numero) => {
  return "$" + Number(numero).toLocaleString("es-AR");
};

export const estadoReal = (reserva) => {
  if (reserva.estado === "cancelada") {
    return "cancelada";
  }
  if (reserva.fecha !== fechaDeHoy()) {
    return "reservada";
  }

  const ahora = new Date().getHours() + new Date().getMinutes() / 60;
  const inicio = Number(reserva.hora.slice(0, 2));
  const fin = inicio + Number(reserva.duracion);

  if (ahora >= inicio && ahora < fin) {
    return "en curso";
  }
  if (ahora >= fin) {
    return "finalizada";
  }
  return "reservada";
};

export const buscarReserva = (reservas, canchaId, fecha, hora) => {
  return reservas.find((reserva) => {
    if (reserva.estado === "cancelada") {
      return false;
    }
    if (reserva.canchaId !== canchaId || reserva.fecha !== fecha) {
      return false;
    }
    const inicio = Number(reserva.hora.slice(0, 2));
    const fin = inicio + Number(reserva.duracion);
    const consultada = Number(hora.slice(0, 2));
    return consultada >= inicio && consultada < fin;
  });
};

export const estadoDelTurno = (reservas, canchaId, fecha, hora) => {
  const reserva = buscarReserva(reservas, canchaId, fecha, hora);
  if (reserva) {
    return estadoReal(reserva);
  }
  return "libre";
};

export const colorDelEstado = {
  libre: "success",
  reservada: "primary",
  "en curso": "warning",
  finalizada: "secondary",
  cancelada: "danger",
};


// Un turno de 2 horas necesita dos horas libres seguidas.
export const rangoLibre = (reservas, canchaId, fecha, hora, duracion) => {
  const inicio = Number(hora.slice(0, 2));
  const fin = inicio + Number(duracion);

  // El club cierra a las 00: un turno no puede pasarse de ahí
  if (fin > 24) {
    return false;
  }

  for (let h = inicio; h < fin; h++) {
    const texto = (h < 10 ? "0" + h : h) + ":00";
    if (estadoDelTurno(reservas, canchaId, fecha, texto) !== "libre") {
      return false;
    }
  }

  return true;
};
