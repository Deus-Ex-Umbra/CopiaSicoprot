import { Outlet, Navigate } from 'react-router-dom';
import { useAutenticacion } from '../contextos/ContextoAutenticacion';

const LayoutAutenticacion = () => {
  const { estaAutenticado } = useAutenticacion();

  if (estaAutenticado()) {
    return <Navigate to="/panel" replace />;
  }

  return (
    <div className="login-page" style={{ minHeight: '100vh' }}>
      <div className="login-box">
        <div className="login-logo">
          <a href="#">
            <b>SICOPROT</b>
          </a>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default LayoutAutenticacion;