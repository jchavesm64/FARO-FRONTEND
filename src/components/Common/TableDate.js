import { getFecha } from "../../helpers/helpers";
import ButtonIconTable from "./ButtonIconTable";
import withRouter from "./withRouter";

const TableDate = ({ ...props }) => {
    const { data, deleteAction, enableDelete } = props;

    const onDelete = (index) => {
        deleteAction(index);
    };

    return (
        <div className="col table-responsive">
            <table className="table table-hover table-striped mb-0">
                <thead>
                    <tr>
                        <th className="text-center">Indice</th>
                        <th className="text-center">Fecha</th>
                        <th className="text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((line, index) => (
                            <tr key={index}>
                                {
                                    <td className="text-center">{index + 1}</td>
                                }
                                {
                                    <td className="text-center">{getFecha(line)}</td>
                                }

                                {
                                    (enableDelete) &&
                                    <td className="d-flex justify-content-center">

                                        {
                                            enableDelete && <ButtonIconTable icon='mdi mdi-delete' color='danger' onClick={() => onDelete(index)} />
                                        }

                                    </td>
                                }
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );

};

export default withRouter(TableDate)