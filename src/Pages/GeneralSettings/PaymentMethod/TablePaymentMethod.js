import React, { useState } from 'react'
import withRouter from '../../../components/Common/withRouter';
import ButtonIconTable from '../../../components/Common/ButtonIconTable';
import { Link } from 'react-router-dom';


const TablePaymentMethod = ({ ...props }) => {

    const { data, onDelete, view } = props;

    const onClickDelete = async (id, nombre) => {
        await onDelete(id, nombre)
    }
    return (

        <div className="table-responsive mb-3">
            <table className="table table-hover table-striped mb-0">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((payment, i) => (
                            <tr key={`Dish-${i}`}>
                                <td>{payment.nombre}</td>
                                <td>
                                    <div className="d-flex justify-content-end mx-1 my-1">
                                        <Link to={`/editpaymentmethod/${payment.id}`}>
                                            <ButtonIconTable icon='mdi mdi-pencil' color='warning' />
                                        </Link>
                                        <ButtonIconTable icon='mdi mdi-delete' color='danger' onClick={() => { onClickDelete(payment.id, payment.nombre) }} />
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

export default withRouter(TablePaymentMethod)