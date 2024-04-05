
import React, { useState } from 'react'
import withRouter from '../../components/Common/withRouter';
import ButtonIconTable from '../../components/Common/ButtonIconTable';
import { Link } from 'react-router-dom';
import { getFechaTable } from '../../helpers/helpers';


const TablePurchaseOrder = ({ ...props }) => {

    const { data, onDelete } = props;

    const onClickDelete = async (id, nombre) => {
        await onDelete(id, nombre)
    }

    return (

        <div className="table-responsive mb-3">
            <table className="table table-hover table-striped mb-0">
                <thead>
                    <tr>
                        <th>Identificador</th>
                        <th>Fecha de pedido</th>
                        <th>Comprobante</th>
                        <th>Proveedor</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((purchaseOrder, i) => (
                            <tr key={`purchaseOrder-${i}`}>
                                <td>{purchaseOrder.consecutivo ? purchaseOrder.consecutivo.consecutivo : ""}</td>
                                <td>{getFechaTable(purchaseOrder.fechaPedido)}</td>
                                <td>{purchaseOrder.numeroComprobante}</td>
                                <td>{purchaseOrder.proveedor.empresa}</td>
                                <td>₡{purchaseOrder.total}</td>
                                <td>{purchaseOrder.estadoPedido}</td>
                                <td>
                                    <div className="d-flex">
                                        <Link to={`/editpurchaseorder/${purchaseOrder.id}`}>
                                            <ButtonIconTable icon='mdi mdi-pencil' color='warning' />
                                        </Link>
                                        {
                                            purchaseOrder.estadoPedido === 'Borrador' && <ButtonIconTable icon='mdi mdi-delete' color='danger' onClick={() => { onClickDelete(purchaseOrder.id, purchaseOrder.numeroComprobante) }} />
                                        }

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

export default withRouter(TablePurchaseOrder)