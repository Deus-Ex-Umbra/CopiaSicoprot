import { useState, useEffect } from 'react';
import { Card, Button, Table, Badge, Alert, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEye, FaFileUpload } from 'react-icons/fa';
import { useAutenticacion } from '../contextos/ContextoAutenticacion';
import { obtenerProyectos, crearProyecto } from '../servicios/proyectos.servicio';
import { Proyecto, Rol } from '../tipos/usuario';

const Proyectos = () => {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoProyecto, setNuevoProyecto] = useState({
    titulo: '',
    id_estudiante: 0,
    id_asesor: 0,
  });
  
  const { usuario } = useAutenticacion();
  const navigate = useNavigate();
  const esEstudiante = usuario?.rol === Rol.Estudiante;

  useEffect(() => {
    cargarProyectos();
  }, []);

  const cargarProyectos = async () => {
    try {
      setCargando(true);
      const data = await obtenerProyectos();
      setProyectos(data);
    } catch (err: any) {
      console.error('Error al cargar proyectos:', err);
      setError('Error al cargar los proyectos');
    } finally {
      setCargando(false);
    }
  };

  const manejarCrearProyecto = async () => {
    try {
      if (!nuevoProyecto.titulo) {
        setError('El título es requerido');
        return;
      }

      const proyecto = {
        ...nuevoProyecto,
        id_estudiante: usuario?.perfil?.id_estudiante || 0,
      };

      await crearProyecto(proyecto);
      setMostrarModal(false);
      await cargarProyectos();
      setNuevoProyecto({ titulo: '', id_estudiante: 0, id_asesor: 0 });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear el proyecto');
    }
  };

  if (cargando) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-light">Mis Proyectos</h2>
        {esEstudiante && (
          <Button variant="primary" onClick={() => setMostrarModal(true)}>
            <FaPlus className="me-2" />
            Nuevo Proyecto
          </Button>
        )}
      </div>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

      {proyectos.length === 0 ? (
        <Card style={{ backgroundColor: 'var(--color-fondo-tarjeta)' }}>
          <Card.Body className="text-center py-5">
            <p className="text-muted mb-3">No tienes proyectos registrados</p>
            {esEstudiante && (
              <Button variant="primary" onClick={() => setMostrarModal(true)}>
                <FaPlus className="me-2" />
                Crear mi primer proyecto
              </Button>
            )}
          </Card.Body>
        </Card>
      ) : (
        <Card style={{ backgroundColor: 'var(--color-fondo-tarjeta)' }}>
          <Card.Body>
            <Table responsive hover variant="dark">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Estudiante</th>
                  <th>Asesor</th>
                  <th>Documentos</th>
                  <th>Fecha de Creación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {proyectos.map((proyecto) => (
                  <tr key={proyecto.id}>
                    <td>{proyecto.titulo}</td>
                    <td>
                      {proyecto.estudiante?.nombre} {proyecto.estudiante?.apellido}
                    </td>
                    <td>
                      {proyecto.asesor?.nombre} {proyecto.asesor?.apellido}
                    </td>
                    <td>
                      <Badge bg="info">{proyecto.documentos?.length || 0}</Badge>
                    </td>
                    <td>{new Date(proyecto.fecha_creacion).toLocaleDateString()}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => navigate(`/panel/proyecto/${proyecto.id}`)}
                      >
                        <FaEye className="me-1" />
                        Ver
                      </Button>
                      {esEstudiante && (
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={() => navigate(`/panel/proyecto/${proyecto.id}/subir-documento`)}
                        >
                          <FaFileUpload className="me-1" />
                          Subir Doc
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
        <Modal.Header closeButton style={{ backgroundColor: 'var(--color-fondo-tarjeta)' }}>
          <Modal.Title>Crear Nuevo Proyecto</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: 'var(--color-fondo-tarjeta)' }}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Título del Proyecto</Form.Label>
              <Form.Control
                type="text"
                value={nuevoProyecto.titulo}
                onChange={(e) => setNuevoProyecto({ ...nuevoProyecto, titulo: e.target.value })}
                placeholder="Ingrese el título del proyecto"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>ID del Asesor</Form.Label>
              <Form.Control
                type="number"
                value={nuevoProyecto.id_asesor}
                onChange={(e) => setNuevoProyecto({ ...nuevoProyecto, id_asesor: parseInt(e.target.value) })}
                placeholder="ID del asesor asignado"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: 'var(--color-fondo-tarjeta)' }}>
          <Button variant="secondary" onClick={() => setMostrarModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={manejarCrearProyecto}>
            Crear Proyecto
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Proyectos;