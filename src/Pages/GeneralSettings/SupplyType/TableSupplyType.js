import React, { useState } from 'react'
import withRouter from '../../../components/Common/withRouter';
import ButtonIconTable from '../../../components/Common/ButtonIconTable';
import { Link } from 'react-router-dom';


const TableSupplyType = ({ ...props }) => {

    const { data, onDelete, view } = props;

    const onClickDelete = async (id, tipo) => {
        await onDelete(id, tipo)
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
                        data.map((supply, i) => (
                            <tr key={`Role-${i}`}>
                                <td>{supply.tipo}</td>
                                <td>
                                    <div className="d-flex justify-content-end mx-1 my-1">
                                        <Link to={`/editsuppliertype/${supply.id}`}>
                                            <ButtonIconTable icon='mdi mdi-pencil' color='warning' />
                                        </Link>
                                        <ButtonIconTable icon='mdi mdi-delete' color='danger' onClick={() => { onClickDelete(supply.id, supply.tipo) }} />
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

export default withRouter(TableSupplyType)