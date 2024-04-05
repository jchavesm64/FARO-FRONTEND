
import React, { useState } from 'react'
import withRouter from '../../components/Common/withRouter';
import ButtonIconTable from '../../components/Common/ButtonIconTable';
import { Link } from 'react-router-dom';


const TableCustomers = ({ ...props }) => {

    const { data, onDelete } = props;

    const onClickDelete = async (id, nombre) => {
        await onDelete(id, nombre)
    }

    return (

        <div className="table-responsive mb-3">
            <table className="table table-hover table-striped mb-0">
                <thead>
                    <tr>
                        <th>Tipo</th>
                        <th>Nombre</th>
                        <th>Identificación</th>
                        <th>País</th>
                        <th>Estado o Provincia</th>
                        <th>Correo</th>
                        <th>Teléfono</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((cliente, i) => (
                            <tr key={`Customer-${i}`}>
                                <td>{cliente.tipo}</td>
                                <td>{cliente.nombre}</td>
                                <td>{cliente.codigo}</td>
                                <td>{cliente.pais}</td>
                                <td>{cliente.ciudad}</td>
                                <td>{cliente.correos.length > 0 ? cliente.correos[0].email : ''}</td>
                                <td>{cliente.telefonos.length > 0 ? cliente.telefonos[0].telefono : ''}</td>
                                <td>
                                    <div className="d-flex">
                                        <Link to={`/editcustomer/${cliente.id}`}>
                                            <ButtonIconTable icon='mdi mdi-pencil' color='warning' />
                                        </Link>
                                        <ButtonIconTable icon='mdi mdi-delete' color='danger' onClick={() => { onClickDelete(cliente.id, cliente.nombre) }} />
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

export default withRouter(TableCustomers)