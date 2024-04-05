
import React, { useState } from 'react'
import withRouter from '../../components/Common/withRouter';
import { getFechaTable } from '../../helpers/helpers';


const TableStockMove = ({ ...props }) => {

    const { data } = props;

    const moneda = {
        'US Dollar': '$',
        'Colón': '₡',
        'Yen': '¥'
    }

    return (

        <div className="table-responsive mb-3">
            <table className="table table-hover table-striped mb-0">
                <thead>
                    <tr>
                        <th></th>
                        <th>Proveedor</th>
                        <th>Cantidad</th>
                        <th>Precio unidad</th>
                        <th>Total</th>
                        <th>Almacén</th>
                        <th>Fecha de registro</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((move, i)=>(
                            <tr key={`move-${i}`}>
                                <td>
                                    {
                                        move.tipo === 'ENTRADA' ?
                                            <i className="mdi mdi-plus align-middle" style={{color: '#0AC074'}}></i>
                                        :
                                            <i className="mdi mdi-minus align-middle" style={{color: '#FF3D60'}}></i>
                                    }
                                </td>
                                <td>
                                    {
                                        move.cedido === null || move.cedido === false ?
                                            <span>{ move.proveedor ? move.proveedor.empresa : "No especificado" }</span>
                                        :
                                            <span>{ move.cliente ? move.cliente.nombre : "No especificado" }</span>
                                    }
                                </td>
                                <td>{ move.cantidad }</td>
                                {move.tipo === 'ENTRADA' ?
                                        <>
                                            <td>{`${moneda[move.moneda]}${move.precio_unidad}`}</td>
                                            <td>{`${moneda[move.moneda]}${move.precio}`}</td>
                                        </>
                                    :
                                        <>
                                            <td></td>
                                            <td></td>
                                        </>
                                }
                                <td>{move.almacen?.nombre || ''}</td>
                                <td>{getFechaTable(move.fecha)}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )


}

export default withRouter(TableStockMove)