import ButtonIconTable from "../../../../components/Common/ButtonIconTable";
import withRouter from "../../../../components/Common/withRouter"
import { Link } from 'react-router-dom';


const TableRooms = ({ ...props }) => {
    const { data, onDelete } = props;

    const onClickDelete = async (id, habitacio) => {
        await onDelete(id, habitacio)
    }
    return (

        <div className="table-responsive mb-3">
            <table className="table table-hover table-striped mb-0">
                <thead>
                    <tr>
                        <th>Número de habitación</th>
                        <th>Tipo de habitación</th>
                        <th>Precio por noche</th>
                        <th>Descripción</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((room, i) => (
                            <tr key={`Room-${i}`}>
                                <td>{room.numeroHabitacion}</td>
                                <td>{room.tipoHabitacion}</td>
                                <td>{room.precioPorNoche}</td>
                                <td>{room.descripcion}</td>
                                <td>
                                    <div className="d-flex justify-content-end mx-1 my-1">
                                        <Link to={`/hotelsettings/extraservice/${room.id}`}>
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

export default withRouter(TableRooms)