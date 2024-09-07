import ButtonIconTable from "../../../../components/Common/ButtonIconTable";
import withRouter from "../../../../components/Common/withRouter"
import { Link } from 'react-router-dom';


const Tabletours = ({ ...props }) => {
    const { data, onDelete } = props;

    const onClickDelete = async (id, numerohabitacion) => {
        await onDelete(id, numerohabitacion)
    }
    return (

        <div className="table-responsive mb-3">
            <table className="table table-hover table-striped mb-0">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Tipo de Tour</th>
                        <th>Precio</th>
                        <th>Descripción</th>
                        <th>Estado</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((tour, i) => (
                            
                            <tr key={`tour-${i}`}>
                                <td>{tour.nombre}</td>
                                <td>{tour.tipo}</td>
                                <td>{tour.precio}</td>
                                <td>{tour.descripcion}</td>
                                <td>{tour.estado}</td>
                                <td>
                                    <div className="d-flex justify-content-end mx-1 my-1">
                                        <Link to={`/hotelsettings/edittour/${tour.id}`}>
                                            <ButtonIconTable icon='mdi mdi-pencil' color='warning' />
                                        </Link>
                                        <ButtonIconTable icon='mdi mdi-delete' color='danger' onClick={() => { onClickDelete(tour.id, tour.nombre) }} />
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

export default withRouter(Tabletours)