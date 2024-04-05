
import React from 'react'
import withRouter from '../../components/Common/withRouter';
import ButtonIconTable from '../../components/Common/ButtonIconTable';
import { Link } from 'react-router-dom';


const TableWarehouseLines = ({ ...props }) => {

    const { data } = props;

    return (

        <div className="table-responsive mb-3">
            <table className="table table-hover table-striped mb-0">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Cantidad</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((line, i)=>(
                            <tr key={`warehouse-${i}`}>
                                <td>{line.producto.nombre}</td>
                                <td>{line.cantidad}{' '}{line.producto.unidad?.toLowerCase() || ''}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )


}

export default withRouter(TableWarehouseLines)