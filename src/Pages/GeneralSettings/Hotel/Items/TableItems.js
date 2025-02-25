import { Link } from "react-router-dom";
import ButtonIconTable from "../../../../components/Common/ButtonIconTable";
import withRouter from "../../../../components/Common/withRouter";

const TableItems = ({ ...props }) => {
  const { data, onDelete } = props;

  const onClickDelete = async (id, nombre) => {
    await onDelete(id, nombre);
  };

  return (
    <div className="table-responsive mb-3">
      <table className="table table-hover table-striped mb-0">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={`TypeRoom-${i}`}>
              <td>{item.nombre}</td>
              <td>{item.descripcion}</td>
              <td>{item.estado}</td>
              <td>
                <div className="d-flex justify-content-center mx-1 my-1">
                  <Link to={`/hotelsettings/edititems/${item.id}`}>
                    <ButtonIconTable icon="mdi mdi-pencil" color="warning" />
                  </Link>
                  <ButtonIconTable
                    icon="mdi mdi-delete"
                    color="danger"
                    onClick={() => {
                      onClickDelete(item.id, item.nombre);
                    }}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default withRouter(TableItems);
