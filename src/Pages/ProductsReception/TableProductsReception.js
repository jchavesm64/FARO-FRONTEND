
import React, { useState } from 'react'
import withRouter from '../../components/Common/withRouter';
import ButtonIconTable from '../../components/Common/ButtonIconTable';
import { Link } from 'react-router-dom';
import { getFechaTable } from '../../helpers/helpers';


const TableProductsReception = ({ ...props }) => {

    const { data } = props;
    return (

        <div className="table-responsive mb-3">
            <table className="table table-hover table-striped mb-0">
                <thead>
                    <tr>
                        <th>Identificador</th>
                        <th>Fecha de pedido</th>
                        <th>Proveedor</th>
                        <th>Estado de pedido</th>
                        <th>Total</th>
                        <th>Estado de recepción</th>
                        <th>Fecha de recepción</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((productReception, i) => (
                            <tr key={`productReception-${i}`}>
                                <td>{productReception.pedido.consecutivo ? productReception.pedido.consecutivo.consecutivo : ""}</td>
                                <td>{getFechaTable(productReception.fechaPedido)}</td>
                                <td>{productReception.proveedor.empresa}</td>
                                <td>{productReception.pedido.estadoPedido}</td>
                                <td>₡{productReception.total}</td>
                                <td>{productReception.estadoRecepcion}</td>
                                <td>{getFechaTable(productReception.fechaEntrega ? productReception.fechaEntrega : null)}</td>
                                <td>
                                    <div className="d-flex">
                                        <Link to={`/productsreception/${productReception.pedido.id}`}>
                                            <ButtonIconTable icon='mdi mdi-pencil' color='warning' />
                                        </Link>
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

export default withRouter(TableProductsReception)