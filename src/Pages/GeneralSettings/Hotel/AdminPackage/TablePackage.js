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
                        <th>Servicios</th>
                        <th>Tours</th>
                        <th>precio</th>
                        <th>descripcion</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((adminPackage, i) => (
                            <tr key={`adminPackage-${i}`}>
                                <td>{adminPackage.tipo}</td>
                                <td>{adminPackage.precio}</td>
                                <td>{adminPackage.estado}</td>
                                <td>{adminPackage.descripcion}</td>
                                <td>
                                    <div className="d-flex justify-content-end mx-1 my-1">
                                        <Link to={`/hotelsettings/editpac/${adminPackage.id}`}>
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