# Club Cancha — Sistema de gestión de turnos

Sistema web para administrar los turnos de un club de canchas de fútbol y pádel.
Permite consultar la disponibilidad, cargar reservas, editarlas, cancelarlas y
ver el listado de clientes.

Trabajo Práctico de *Programación IV* — Tecnicatura Universitaria en Programación.
Es la migración a *React* del sitio que habíamos hecho con HTML, CSS y JavaScript.

## Sitio publicado

https://club-cancha-frontend.vercel.app

## Integrantes — Grupo 6

| Integrante | Parte del sistema |
| --- | --- |
| Ortega Lourdes | Inicio (panel del día y CRUD), funciones compartidas, consumo de la API |
| Roldan Analía | Canchas |
| Soria Laura | Horarios y disponibilidad |
| Andrada Emilse | Cargar reserva |
| Bulacio Belén | Clientes, creación y configuración del repositorio |

## Tecnologías

- React 19
- Vite
- React Router DOM
- React Bootstrap y Bootstrap 5
- Axios
- SweetAlert2
- CSS propio
- Git y GitHub
- Vercel

## Cómo levantar el proyecto

Hace falta tener instalado *Node.js* (versión 18 o superior) y *npm*.

1. Clonar el repositorio:


git clone https://github.com/Belen-Bulacio/club-cancha-frontend.git
cd club-cancha-frontend


2. Instalar las dependencias:


npm install


3. Crear un archivo .env en la raíz del proyecto con este contenido:


VITE_API_URL=https://api.argentinadatos.com/v1/feriados


4. Levantar el servidor de desarrollo:


npm run dev


Queda disponible en http://localhost:5173.

### Otros comandos

| Comando | Para qué sirve |
| --- | --- |
| npm run dev | Levanta el proyecto en modo desarrollo |
| npm run build | Genera la versión final en la carpeta dist |
| npm run preview | Muestra cómo quedó la versión final |
| npm run lint | Revisa que el código no tenga errores |

## Variables de entorno

El proyecto usa una sola variable:

| Variable | Qué guarda |
| --- | --- |
| VITE_API_URL | La dirección de la API pública de feriados |

El archivo .env *no se sube al repositorio*: está puesto en el .gitignore.
Cada una lo crea en su computadora. Por eso el paso 3 de la instalación es obligatorio:
sin ese archivo, la sección de feriados no trae nada.

En Vite las variables tienen que empezar con VITE_ para poder leerse desde el
código, y se leen con import.meta.env.VITE_API_URL.

## Estructura del proyecto


club-cancha-frontend
├── public
│   ├── canchas            imágenes de las canchas
│   ├── favicon.svg
│   └── logo-club.png
├── src
│   ├── components
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProximosFeriados.jsx     consume la API
│   │   └── routes
│   │       └── Rutas.jsx            todas las rutas del sistema
│   ├── data
│   │   ├── datosIniciales.js        canchas, horarios y tarifas
│   │   └── funciones.js             funciones compartidas por todas las páginas
│   ├── pages
│   │   ├── Inicio.jsx
│   │   ├── Canchas.jsx
│   │   ├── Horarios.jsx
│   │   ├── Reservar.jsx
│   │   ├── Clientes.jsx
│   │   └── Error404.jsx
│   ├── App.jsx                      el estado de las reservas vive acá
│   ├── index.css                    el CSS propio del proyecto
│   └── main.jsx
├── index.html
├── vercel.json
└── vite.config.js


## Rutas del sistema

| Ruta | Página | Qué muestra |
| --- | --- | --- |
| / | Inicio | El panel del día, el CRUD de reservas y los próximos feriados |
| /canchas | Canchas | Las canchas del club con su tipo, precio y foto |
| /horarios | Horarios | La grilla de disponibilidad por cancha y por hora |
| /reservar | Reservar | El formulario para cargar una reserva nueva |
| /clientes | Clientes | Quiénes reservaron, cuántas veces y cuánto señaron |
| cualquier otra | Error 404 | Avisa que la dirección no existe |

Es una *SPA*: hay un solo index.html y React Router cambia la página sin
recargar el navegador. Por eso el archivo vercel.json tiene un rewrite: le
avisa al servidor que cualquier dirección tiene que devolver el index.html,
porque si no, al entrar directo a /clientes daría un error 404 del servidor.

## Cómo funciona por dentro

### Dónde vive la información

Todas las reservas están guardadas en un solo lugar: un useState dentro de
App.jsx. Desde ahí bajan a las páginas por *props*.

Las páginas que solo necesitan mostrar datos reciben reservas. Las que además
tienen que modificarlos reciben *funciones* (agregar, editar, cancelar,
borrar). Cuando la página llama a una de esas funciones, el estado cambia en
App.jsx y React vuelve a dibujar *todas* las páginas con la información nueva.

Gracias a eso, una reserva cargada en Reservar aparece al instante en Inicio,
en Horarios y en Clientes.

### Que no se borre al recargar

Un useEffect en App.jsx guarda las reservas en el *localStorage* del
navegador cada vez que cambian, y al abrir la página se leen de ahí.

El localStorage es del navegador, no un servidor: lo que se guarda en una
computadora no se ve en otra. Es una solución provisoria hasta tener una base
de datos.

### Reglas del negocio

- El precio sale de la *duración* del turno y de la *franja horaria* (mañana,
  tarde o noche). Está en la tabla tarifas de datosIniciales.js.
- La *seña mínima* es la mitad del precio del turno.
- *No se puede superponer* una reserva con otra: se revisa que estén libres
  todas las horas que ocupa el turno, no solo la de inicio.
- *No se puede reservar en el pasado*, ni en un día anterior a hoy ni en una
  hora que ya pasó.
- Los formularios no dejan guardar con campos vacíos, y avisan con un mensaje
  cuando lo que se escribió no corresponde (por ejemplo, números en el nombre).

## API pública

La sección Próximos feriados de la página de Inicio consume la API pública
*ArgentinaDatos*:


https://api.argentinadatos.com/v1/feriados


Se trae con *axios*, usando async/await dentro de un useEffect, con
try / catch / finally: mientras carga muestra un spinner, si falla avisa con
un modal de SweetAlert2, y cuando termina saca el cartel de "cargando" pase lo
que pase.

Sirve para el club porque permite ver de antemano los días feriados, que son los
de más demanda, y además avisa si ya hay reservas cargadas en esas fechas.

## SEO

- Un solo <h1> por página, y el resto de los títulos en orden (h2, h3).
- Etiquetas semánticas: <main>, <section>, <article>, <header>, <footer>.
- El <title> y la descripción de cada página se actualizan con un useEffect.
- En el index.html están las etiquetas description, author, robots,
  canonical, Open Graph y Twitter Card.
- Las tablas usan caption y scope para que se entiendan sin ver la pantalla.
- Las imágenes tienen alt.

## Diseño

El diseño usa React Bootstrap, y arriba de eso hay un archivo de *CSS propio*
(src/index.css) con los colores del club, la tipografía, el hero, la barra de
navegación, el pie y los botones.

Es responsive: se probó en 375 px, 768 px y 1366 px, sin scroll horizontal.

## Cómo trabajamos con Git

- main es la rama final, la que se publica en Vercel.
- dev es la rama donde vamos juntando el trabajo de todas.
- Cada integrante tiene su rama feature/... para su parte.

El circuito es siempre el mismo:


git switch mi-rama
git merge origin/dev -m "Traer los cambios de dev a mi rama"
   ...hacer los cambios...
git add .
git commit -m "Mi cambio"
git push origin mi-rama


Después se abre un *Pull Request hacia dev*, lo revisa otra compañera y recién
ahí se mergea. Cuando dev está completo y probado, se mergea a main.
