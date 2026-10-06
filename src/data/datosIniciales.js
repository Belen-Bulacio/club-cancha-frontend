const hoy = new Date().toISOString().slice(0, 10);
export const canchas = [
  { id: 1, nombre: "Cancha 1", deporte: "Fútbol 5", tipo: "Fútbol" },
  { id: 2, nombre: "Cancha 2", deporte: "Fútbol 7", tipo: "Fútbol" },
  { id: 3, nombre: "Cancha 3", deporte: "Pádel", tipo: "Pádel" },
];

// El club abre de 8 a 00. El último turno empieza a las 23.
export const horarios = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
  "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00",
];

// Las canchas de fútbol solo se alquilan de a una hora.
export const duracionesPorTipo = {
  "Fútbol": [1],
  "Pádel": [1, 1.5, 2],
};

// Precio según tipo de cancha, duración y franja horaria.
// Franja "dia": de 08:00 a 16:59 — Franja "noche": de 17:00 a 00:00

export const tarifas = {
  "Fútbol": {
    1: { dia: 40000, noche: 50000 },
  },
  "Pádel": {
    1: { dia: 40000, noche: 50000 },
    1.5: { dia: 50000, noche: 60000 },
    2: { dia: 55000, noche: 70000 },
  },
};

export const reservasIniciales = [
  { id: 1, canchaId: 2, fecha: hoy, hora: "19:00", duracion: 1, cliente: "Pérez, Juan", telefono: "3884000000", sena: 25000, politica: true, estado: "reservada" },
  { id: 2, canchaId: 3, fecha: hoy, hora: "21:00", duracion: 1.5, cliente: "Gómez, Ana", telefono: "3885112233", sena: 30000, politica: true, estado: "reservada" },
  { id: 3, canchaId: 1, fecha: hoy, hora: "10:00", duracion: 1, cliente: "Díaz, Luis", telefono: "3886224455", sena: 20000, politica: true, estado: "cancelada" },
];
