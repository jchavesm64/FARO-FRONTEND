import React, { useState } from 'react'
import withRouter from '../../../components/Common/withRouter';
import ButtonIconTable from '../../../components/Common/ButtonIconTable';
import { getFechaTable } from '../../../helpers/helpers';
import { Link } from 'react-router-dom';


const TableUsers = ({ ...props }) => {

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
                        <th>Identificación</th>
                        <th>Correo</th>
                        <th>Teléfono</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((user, i) => (
                            <tr key={`User-${i}`}>
                                <td>{user.nombre}</td>
                                <td>{user.cedula}</td>
                                <td>{user.correos.length > 0 ? user.correos[0].email : ''}</td>
                                <td>{user.telefonos.length > 0 ? user.telefonos[0].telefono : ''}</td>
                                <td>
                                    <div className="d-flex justify-content-end mx-1 my-1">
                                        <Link to={`/edituser/${user.id}`}>
                                            <ButtonIconTable icon='mdi mdi-pencil' color='warning' />
                                        </Link>
                                        <ButtonIconTable icon='mdi mdi-delete' color='danger' onClick={() => { onClickDelete(user.id, user.nombre) }} />
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

export default withRouter(TableUsers)