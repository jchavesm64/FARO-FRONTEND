import ButtonIconTable from "../../../../components/Common/ButtonIconTable";
import withRouter from "../../../../components/Common/withRouter"
import { Link } from 'react-router-dom';

const TableExtraService = ({ ...props }) => {
    const { data, onDelete } = props;

    const onClickDelete = async (id, nombre) => {
        await onDelete(id, nombre)
    }
    return (

        <div className="table-responsive mb-3">
            <table className="table table-hover table-striped mb-0">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th>Tipo de servicio</th>
                        <th className="text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((services, i) => (
                            <tr key={`TypeRoom-${i}`}>
                                <td>{services.nombre}</td>
                                <td>{services.descripcion}</td>
                                <td>{services.precio}</td>
                                <td>{services.tipo.nombre}</td>
                                <td>
                                    <div className="d-flex justify-content-center mx-1 my-1">
                                        <Link to={`/hotelsettings/editexternalservice/${services.id}`}>
                                            <ButtonIconTable icon='mdi mdi-pencil' color='warning' />
                                        </Link>
                                        <ButtonIconTable icon='mdi mdi-delete' color='danger' onClick={() => { onClickDelete(services.id, services.nombre) }} />
                                    </div>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default withRouter(TableExtraService)