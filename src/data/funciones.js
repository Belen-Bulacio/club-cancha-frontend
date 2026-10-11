import Swal from 'sweetalert2';
import { tarifas, horarios } from './datosIniciales';

// ==================== Avisos ====================

// Aviso corto que aparece arriba a la derecha y se va solo.
// Es un toast y no un modal porque salta con cada tecla equivocada:
// un modal que hay que cerrar a mano sería insoportable.
export function avisar(texto) {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'warning',
    title: texto,
    showConfirmButton: false,
    timer: 2200,
    timerProgressBar: true,
  });
}

// ==================== Validaciones ====================

const LETRAS = 'abcdefghijklmnñopqrstuvwxyzáéíóúüABCDEFGHIJKLMNÑOPQRSTUVWXYZÁÉÍÓÚÜ ';
const NUMEROS = '0123456789';

// Cuenta cuántos números tiene un texto
export function contarNumeros(texto) {
  return texto.split('').filter((caracter) => NUMEROS.includes(caracter)).length;
}

// Deja pasar solo letras y espacios.
// En un nombre no se pueden escribir números: directamente no entran.
export function soloLetras(texto) {
  return texto
    .split('')
    .filter((caracter) => LETRAS.includes(caracter))
    .join('');
}

// Deja pasar solo números, para el celular
export function soloNumeros(texto) {
  return texto
    .split('')
    .filter((caracter) => NUMEROS.includes(caracter))
    .join('');
}

// ==================== Fechas y horas ====================

// Agrega un cero adelante si hace falta: 5 -> '05'
function dosDigitos(numero) {
  return String(numero).padStart(2, '0');
}

// La fecha de hoy en hora de Argentina.
// No se usa toISOString() porque devuelve la hora UTC: después de las 21
// ya sería el día siguiente y el sistema mostraría mal el día.
export function fechaDeHoy() {
  const hoy = new Date();
  return `${hoy.getFullYear()}-${dosDigitos(hoy.getMonth() + 1)}-${dosDigitos(hoy.getDate())}`;
}

// Convierte '2026-10-10' en un objeto Date
function aFecha(texto) {
  const partes = texto.split('-');
  return new Date(partes[0], partes[1] - 1, partes[2]);
}

// '2026-10-10' -> 'sábado, 10 de octubre de 2026'
export function formatearFecha(fecha) {
  return aFecha(fecha).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// '2026-10-12' -> 'lunes'
export function nombreDelDia(fecha) {
  return aFecha(fecha).toLocaleDateString('es-AR', { weekday: 'long' });
}

// '2026-10-10' -> '10/10'
export function fechaCorta(fecha) {
  const partes = fecha.split('-');
  return `${partes[2]}/${partes[1]}`;
}

// '19:00' -> 19
export function horaEnNumero(hora) {
  return Number(hora.slice(0, 2));
}

// 19 -> '19:00'
export function numeroEnHora(numero) {
  return `${dosDigitos(numero)}:00`;
}

// La primera hora en la que todavía se puede cargar un turno hoy.
// Si son las 19:30, el próximo turno que se puede vender es el de las 20.
export function proximaHoraDeHoy() {
  const ahora = new Date();
  if (ahora.getMinutes() > 0) {
    return ahora.getHours() + 1;
  }
  return ahora.getHours();
}

// ¿Ese turno ya pasó? No se puede reservar en el pasado.
export function turnoPasado(fecha, hora) {
  const hoy = fechaDeHoy();

  if (fecha < hoy) {
    return true;
  }
  return fecha === hoy && horaEnNumero(hora) < proximaHoraDeHoy();
}

// ==================== Precios ====================

// Antes de las 17 es tarifa de día; de las 17 en adelante, de noche
export function franjaDeLaHora(hora) {
  if (horaEnNumero(hora) < 17) {
    return 'dia';
  }
  return 'noche';
}

// Cuánto sale el turno
export function calcularPrecio(tipo, duracion, hora) {
  if (tipo === '' || hora === '') {
    return 0;
  }

  const porTipo = tarifas[tipo];
  if (porTipo === undefined) {
    return 0;
  }

  const porDuracion = porTipo[duracion];
  if (porDuracion === undefined) {
    return 0;
  }

  return porDuracion[franjaDeLaHora(hora)];
}

// La seña mínima es la mitad del precio del turno
export function senaMinima(precio) {
  return precio / 2;
}

// 40000 -> '$40.000'
export function formatearPrecio(numero) {
  return `$${Number(numero).toLocaleString('es-AR')}`;
}

// ==================== Estados ====================

// El estado se calcula con la hora. De los datos solo sale si fue cancelada,
// porque eso lo decide una persona.
export function estadoReal(reserva) {
  if (reserva.estado === 'cancelada') {
    return 'cancelada';
  }
  if (reserva.fecha !== fechaDeHoy()) {
    return 'reservada';
  }

  const ahora = new Date();
  const horaAhora = ahora.getHours() + ahora.getMinutes() / 60;
  const empieza = horaEnNumero(reserva.hora);
  const termina = empieza + Number(reserva.duracion);

  if (horaAhora < empieza) {
    return 'reservada';
  }
  if (horaAhora < termina) {
    return 'en curso';
  }
  return 'finalizada';
}

// ¿Esta reserva ocupa esa cancha, ese día y esa hora?
// Un turno de 2 horas también ocupa la hora siguiente.
function ocupaElTurno(reserva, canchaId, fecha, hora) {
  if (reserva.estado === 'cancelada') {
    return false;
  }
  if (reserva.canchaId !== canchaId || reserva.fecha !== fecha) {
    return false;
  }

  const empieza = horaEnNumero(reserva.hora);
  const termina = empieza + Number(reserva.duracion);
  const consultada = horaEnNumero(hora);

  return consultada >= empieza && consultada < termina;
}

// Busca la reserva que ocupa esa cancha, ese día y esa hora
export function buscarReserva(reservas, canchaId, fecha, hora) {
  const encontrada = reservas.find((reserva) =>
    ocupaElTurno(reserva, canchaId, fecha, hora),
  );
  return encontrada || null;
}

// El estado de un turno: el de su reserva, o 'libre' si no hay ninguna
export function estadoDelTurno(reservas, canchaId, fecha, hora) {
  const reserva = buscarReserva(reservas, canchaId, fecha, hora);
  if (reserva === null) {
    return 'libre';
  }
  return estadoReal(reserva);
}

// ¿Está libre todo el rango y todavía no pasó?
// Un turno de 2 horas necesita 2 horas libres seguidas.
// Esto es lo que impide que dos reservas se superpongan.
export function rangoLibre(reservas, canchaId, fecha, hora, duracion) {
  if (turnoPasado(fecha, hora)) {
    return false;
  }

  const empieza = horaEnNumero(hora);
  const termina = empieza + Number(duracion);

  // El club cierra a las 00: ningún turno puede pasarse de ahí
  if (termina > 24) {
    return false;
  }

  // Las horas que ocupa el turno. Para 2 h a las 20, son las 20 y las 21.
  const horasDelTurno = horarios.filter((unaHora) => {
    const numero = horaEnNumero(unaHora);
    return numero >= empieza && numero < termina;
  });

  // every() devuelve true solo si TODAS cumplen la condición
  return horasDelTurno.every(
    (unaHora) => estadoDelTurno(reservas, canchaId, fecha, unaHora) === 'libre',
  );
}

// Cuántas reservas activas hay cargadas para ese día
export function contarReservasDelDia(reservas, fecha) {
  return reservas.filter(
    (reserva) => reserva.fecha === fecha && reserva.estado !== 'cancelada',
  ).length;
}

// El color de Bootstrap de cada estado
export const colorDelEstado = {
  libre: 'success',
  reservada: 'primary',
  'en curso': 'warning',
  finalizada: 'secondary',
  cancelada: 'danger',
  pasado: 'light',
};
