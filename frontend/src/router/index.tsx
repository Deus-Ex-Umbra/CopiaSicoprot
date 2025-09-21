import { createBrowserRouter, Navigate } from 'react-router-dom';
import LayoutAutenticacion from '../layouts/LayoutAutenticacion';
import LayoutPanel from '../layouts/LayoutPanel';
import IniciarSesion from '../paginas/IniciarSesion';
import Registro from '../paginas/Registro';
import Panel from '../paginas/Panel';
import Proyectos from '../paginas/Proyectos';
import DetalleProyecto from '../paginas/DetalleProyecto';
import RutaProtegida from '../componentes/RutaProtegida';
import { Rol } from '../tipos/usuario';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/panel" replace />,
  },
  {
    path: '/',
    element: <LayoutAutenticacion />,
    children: [
      {
        path: 'iniciar-sesion',
        element: <IniciarSesion />,
      },
      {
        path: 'registrarse',
        element: <Registro />,
      },
    ],
  },
  {
    path: '/panel',
    element: (
      <RutaProtegida>
        <LayoutPanel />
      </RutaProtegida>
    ),
    children: [
      {
        index: true,
        element: <Panel />,
      },
      {
        path: 'proyectos',
        element: <Proyectos />,
      },
      {
        path: 'proyecto/:id',
        element: <DetalleProyecto />,
      },
      {
        path: 'proyecto/:id/subir-documento',
        element: (
          <RutaProtegida roles_permitidos={[Rol.Estudiante]}>
            <DetalleProyecto />
          </RutaProtegida>
        ),
      },
      {
        path: 'mis-documentos',
        element: (
          <RutaProtegida roles_permitidos={[Rol.Estudiante]}>
            <DetalleProyecto />
          </RutaProtegida>
        ),
      },
      {
        path: 'observaciones',
        element: (
          <RutaProtegida roles_permitidos={[Rol.Estudiante]}>
            <DetalleProyecto />
          </RutaProtegida>
        ),
      },
      {
        path: 'estudiantes',
        element: (
          <RutaProtegida roles_permitidos={[Rol.Asesor]}>
            <Proyectos />
          </RutaProtegida>
        ),
      },
      {
        path: 'revisar',
        element: (
          <RutaProtegida roles_permitidos={[Rol.Asesor]}>
            <Proyectos />
          </RutaProtegida>
        ),
      },
      {
        path: 'administracion',
        element: (
          <RutaProtegida roles_permitidos={[Rol.Administrador]}>
            <Panel />
          </RutaProtegida>
        ),
      },
    ],
  },
]);

export default router;