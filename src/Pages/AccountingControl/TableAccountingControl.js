import React, { useState } from 'react'
import withRouter from '../../components/Common/withRouter';
import ButtonIconTable from '../../components/Common/ButtonIconTable';
import { getFechaTable } from '../../helpers/helpers';
import { Link } from 'react-router-dom';


const TableAccountingControl = ({ ...props }) => {

    const { data, onDelete, view } = props;

    const onClickDelete = async (id, nombre) => {
        await onDelete(id, nombre)
    }

    const getSupplierValue = (item) => {
        if (item.usuario !== null) {
            return item.usuario.nombre
        }
        if (item.cliente !== null) {
            return item.cliente.nombre
        }
        if (item.proveedor !== null) {
            return item.proveedor.empresa
        }
        return ''
    }

    return (

        <div className="table-responsive mb-3">
            <table className="table table-hover table-striped mb-0">
                <thead>
                    <tr>
                        <th>Identificador</th>
                        {
                            view === 'TODOS' && <th>Tipo cuenta</th>
                        }
                        <th>Proveedor</th>
                        <th>Fecha de registro</th>
                        <th>Estado</th>
                        <th>Monto</th>
                        <th>Tipo pago</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((accounting, i) => (
                            <tr key={`Customer-${i}`}>
                                <td>{accounting.consecutivo ? accounting.consecutivo.consecutivo : ""}</td>
                                {
                                    view === 'TODOS' && <td>{accounting.tipoRegistroContable}</td>
                                }
                                <td>{getSupplierValue(accounting)}</td>
                                <td>{getFechaTable(accounting.fechaRegistro)}</td>
                                <td>{accounting.estadoRegistroContable}</td>
                                <td>₡{accounting.monto}</td>
                                <td>{accounting.tipoPago ? accounting.tipoPago : 'PENDIENTE'}</td>
                                <td>
                                    <div className="d-flex justify-content-end mx-1 my-1">
                                        <Link to={`/editaccountingcontrol/${accounting.tipoRegistroContable}/${accounting.id}`}>
                                            <ButtonIconTable icon='mdi mdi-pencil' color='warning' />
                                        </Link>

                                        <ButtonIconTable icon='mdi mdi-delete' color='danger' onClick={() => { onClickDelete(accounting.id, accounting.tipoRegistroContable) }} />

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

export default withRouter(TableAccountingControl)