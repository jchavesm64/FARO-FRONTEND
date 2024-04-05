
import React, { useState } from 'react'
import withRouter from '../../components/Common/withRouter';
import { getFechaTable } from '../../helpers/helpers';
import ButtonIconTable from '../../components/Common/ButtonIconTable';
import { Link } from 'react-router-dom';

const TableTaxManagement = ({ ...props }) => {

    const { data, onDelete } = props;

    const onClickDelete = async (id, nombre) => {
        await onDelete(id, nombre)
    }
    return (

        <div className="table-responsive mb-3">
            <table className="table table-hover table-striped mb-0">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Porcentaje de impuesto</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((tax, i) => (
                            <tr key={`move-${i}`}>
                                <td>
                                    {
                                        tax.nombre
                                    }
                                </td>
                                <td>
                                    {
                                        tax.valor + '%'
                                    }
                                </td>

                                <td>
                                    <div className="d-flex justify-content-end mx-1 my-1">
                                        <Link to={`/edittaxmanagement/${tax.id}`}>
                                            <ButtonIconTable icon='mdi mdi-pencil' color='warning' />
                                        </Link>

                                        <ButtonIconTable icon='mdi mdi-delete' color='danger' onClick={() => { onClickDelete(tax.id, tax.nombre) }} />

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

export default withRouter(TableTaxManagement)