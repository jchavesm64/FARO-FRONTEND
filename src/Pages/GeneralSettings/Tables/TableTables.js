import React, { useState } from 'react'
import withRouter from '../../../components/Common/withRouter';
import ButtonIconTable from '../../../components/Common/ButtonIconTable';
import { Link } from 'react-router-dom';


const TableTables = ({ ...props }) => {

    const { data, onDelete } = props;

    const onClickDelete = async (id, numero) => {
        await onDelete(id, numero)
    }

    return (

        <div className="table-responsive mb-3">
            <table className="table table-hover table-striped mb-0">
                <thead>
                    <tr>
                        <th>Tipo</th>
                        <th>Numero</th>
                        <th>Piso</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((table, i) => (
                            <tr key={`table-${i}`}>
                                <td>{table.tipo}</td>
                                <td>{table.numero}</td>
                                <td>{table.piso.nombre}</td>
                                <td>
                                    <div className="d-flex">
                                        <Link to={`/edittable/${table.id}`}>
                                            <ButtonIconTable icon='mdi mdi-pencil' color='warning' />
                                        </Link>
                                        <ButtonIconTable icon='mdi mdi-delete' color='danger' onClick={() => { onClickDelete(table.id, table.numero) }} />
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

export default withRouter(TableTables)