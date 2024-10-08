import ButtonIconTable from "../../../../components/Common/ButtonIconTable";
import withRouter from "../../../../components/Common/withRouter"
import { Link } from 'react-router-dom';


const TablePackage = ({ ...props }) => {
    const { data, onDelete } = props;

    const onClickDelete = async (id, numerohabitacion) => {
        await onDelete(id, numerohabitacion)
    }
    return (

        <div className="table-responsive mb-3">
            <table className="table table-hover table-striped mb-0">
                <thead>
                    <tr>
                        <th>Tipo</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Temporada</th>
                        <th>Descripcion</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((adminPackage, i) => (
                            <tr key={`adminPackage-${i}`}>
                                <td>{adminPackage.tipo}</td>
                                <td>{adminPackage.nombre}</td>
                                <td>{adminPackage.precio}</td>
                                <td>{adminPackage.temporadas?.nombre}</td>
                                <td>{adminPackage.descripcion}</td>
                                <td>
                                    <div className="d-flex justify-content-center mx-1 my-1">
                                        <Link to={`/hotelsettings/editpackage/${adminPackage.id}`}>
                                            <ButtonIconTable icon='mdi mdi-pencil' color='warning' />
                                        </Link>
                                        <ButtonIconTable icon='mdi mdi-delete' color='danger' onClick={() => { onClickDelete(adminPackage.id, adminPackage.nombre) }} />
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

export default withRouter(TablePackage)