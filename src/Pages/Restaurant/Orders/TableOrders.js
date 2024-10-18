
import React from 'react'
import withRouter from '../../../components/Common/withRouter';
import ButtonIconTable from '../../../components/Common/ButtonIconTable';


const TableOrders = ({ ...props }) => {

    const { data, onDelete } = props;

    const onClickDelete = async (id, nombre) => {
        await onDelete(id, nombre)
    }

    return (

        <div className="table-responsive mb-3">
            <table className="table table-hover table-striped mb-0">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Entregados</th>
                        <th>Total</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((order, i) => (
                            <tr key={`menu-${i}`}>
                                <td>{order.nombre}</td>
                                <td>₡{order.precio}</td>
                                <td className='text-center'>{order.cantidad}</td>
                                <td className='text-center'>{order.entregados}</td>
                                <td>₡{order.precio * order.cantidad}</td>
                                <td>
                                    <div className="d-flex">
                                        <ButtonIconTable icon='mdi mdi-delete' color='danger' onClick={() => { onClickDelete(order.id, order.nombre) }} />
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

export default withRouter(TableOrders)