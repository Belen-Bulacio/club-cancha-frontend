export const canchas = [
  {
    id: 1,
    nombre: 'Cancha 1',
    deporte: 'Fútbol 5',
    tarifa: 20000,
  },
  {
    id: 2,
    nombre: 'Cancha 2',
    deporte: 'Fútbol 7',
    tarifa: 25000,
  },
  {
    id: 3,
    nombre: 'Cancha 3',
    deporte: 'Pádel',
    tarifa: 15000,
  },
]

export const reservasIniciales = [
  {
    id: 1,
    canchaId: 2,
    fecha: '2026-10-02',
    hora: '19:00',
    cliente: 'Juan Pérez',
    telefono: '3884000000',
    estado: 'a confirmar',
  },
  {
    id: 2,
    canchaId: 3,
    fecha: '2026-10-02',
    hora: '21:00',
    cliente: 'Ana Gómez',
    telefono: '3885112233',
    estado: 'confirmada',
  },
]