import ButtonIconTable from "../../../../components/Common/ButtonIconTable";
import withRouter from "../../../../components/Common/withRouter"
import { Link } from 'react-router-dom';

const TableTypeRoom = ({ ...props }) => {
    const { data, onDelete, view } = props;

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
                        <th>Precio Base</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((room, i) => (
                            <tr key={`TypeRoom-${i}`}>
                                <td>{room.nombre}</td>
                                <td>{room.descripcion}</td>
                                <td>{room.precioBase}</td>
                                <td>
                                    <div className="d-flex justify-content-end mx-1 my-1">
                                        <Link to={`/hotelsettings/edittyperoom/${room.id}`}>
                                            <ButtonIconTable icon='mdi mdi-pencil' color='warning' />
                                        </Link>
                                        <ButtonIconTable icon='mdi mdi-delete' color='danger' onClick={() => { onClickDelete(room.id, room.nombre) }} />
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

export default withRouter(TableTypeRoom)