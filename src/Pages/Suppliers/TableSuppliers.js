
import React, { useState } from 'react'
import withRouter from '../../components/Common/withRouter';
import ButtonIconTable from '../../components/Common/ButtonIconTable';
import { Link } from 'react-router-dom';


const TableSuppliers = ({ ...props }) => {

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
                        <th>Identificación</th>
                        <th>Tipo de proveeduría</th>
                        <th>Correo</th>
                        <th>Teléfono</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((proveedor, i) => (
                            <tr key={`Supplier-${i}`}>
                                <td>{proveedor.empresa}</td>
                                <td>{proveedor.cedula}</td>
                                <td>{proveedor.provedurias && proveedor.provedurias.length > 0 ? proveedor.provedurias[0].tipo + '...' : ''}</td>
                                <td>{proveedor.correos && proveedor.correos.length > 0 ? proveedor.correos[0].email : ''}</td>
                                <td>{proveedor.telefonos && proveedor.telefonos.length > 0 ? proveedor.telefonos[0].telefono : ''}</td>
                                <td>
                                    <div className="d-flex">
                                        <Link to={`/editsupplier/${proveedor.id}`}>
                                            <ButtonIconTable icon='mdi mdi-pencil' color='warning' />
                                        </Link>
                                        <ButtonIconTable icon='mdi mdi-delete' color='danger' onClick={() => { onClickDelete(proveedor.id, proveedor.empresa) }} />
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

export default withRouter(TableSuppliers)