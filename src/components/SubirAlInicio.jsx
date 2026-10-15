import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Cada vez que se cambia de página, sube la pantalla hasta arriba.
// React Router cambia el contenido sin recargar, por eso el navegador
// no lo hace solo y nos dejaba en el mismo lugar del scroll.
function SubirAlInicio() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default SubirAlInicio;
