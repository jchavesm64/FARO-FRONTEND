import ButtonIconTable from "../../../../components/Common/ButtonIconTable";
import withRouter from "../../../../components/Common/withRouter"
import { Link } from 'react-router-dom';

const TableOperativeAreas = ({ ...props }) => {
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
                        <th>Estado</th>
                        <th className="text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((area, i) => (
                            <tr key={`TypeRoom-${i}`}>
                                <td>{area.nombre}</td>
                                <td>{area.descripcion}</td>
                                <td>{area.estado}</td>
                                <td>
                                    <div className="d-flex justify-content-center mx-1 my-1">
                                        <Link to={`/hotelsettings/editoperativeareas/${area.id}`}>
                                            <ButtonIconTable icon='mdi mdi-pencil' color='warning' />
                                        </Link>
                                        <ButtonIconTable icon='mdi mdi-delete' color='danger' onClick={() => { onClickDelete(area.id, area.nombre) }} />
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

export default withRouter(TableOperativeAreas)