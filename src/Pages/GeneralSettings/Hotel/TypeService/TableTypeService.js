import ButtonIconTable from "../../../../components/Common/ButtonIconTable";
import withRouter from "../../../../components/Common/withRouter"
import { Link } from 'react-router-dom';

const TableTypeservice = ({ ...props }) => {
    const { data, onDelete } = props;

    const onClickDelete = async (id, nombre) => {
        await onDelete(id, nombre)
    };
    const validateQuantifiable = (val) => {
        return val === 'true' ? "Sí" : "No";
    }

    return (
        <div className="table-responsive mb-3">
            <table className="table table-hover table-striped mb-0">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Cuantificable</th>
                        <th>Hora del día</th>
                        <th className="text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((service, i) => (
                            <tr key={`Typeservice-${i}`}>
                                <td>{service.nombre}</td>
                                <td>{validateQuantifiable(service.cuantificable)}</td>
                                <td>{service.horadia}</td>
                                <td>
                                    <div className="d-flex justify-content-center mx-1 my-1">
                                        <Link to={`/hotelsettings/edittypeservice/${service.id}`}>
                                            <ButtonIconTable icon='mdi mdi-pencil' color='warning' />
                                        </Link>
                                        <ButtonIconTable icon='mdi mdi-delete' color='danger' onClick={() => { onClickDelete(service.id, service.nombre) }} />
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

export default withRouter(TableTypeservice)