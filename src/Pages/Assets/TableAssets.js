import React, { useState } from 'react'
import withRouter from '../../components/Common/withRouter';
import ButtonIconTable from '../../components/Common/ButtonIconTable';
import { Link } from 'react-router-dom';
import { getFechaTZ } from '../../helpers/helpers';


const TableAssets = ({ ...props }) => {

    const { data, onDelete } = props;

    const onClickDelete = async (id, nombre, referenciaInterna) => {
        await onDelete(id, nombre, referenciaInterna)
    }

    return (

        <div className="table-responsive mb-3">
            <table className="table table-hover table-striped mb-0">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        {/*<th>Unidad</th>*/}
                        <th>Referencia Interna</th>
                        <th>Fecha de Registro</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((asset, i) => (
                            <tr key={`asset-${i}`}>
                                <td>{asset.nombre}</td>
                                {/*<td>{asset.unidad}</td>*/}
                                <td>{asset.referenciaInterna}</td>
                                <td>{getFechaTZ('fecha', asset.fechaRegistro)}</td>
                                <td>
                                    <div className="d-flex">
                                        <Link to={`/asset/movements/${asset.id}`}>
                                            <button type="button" className="me-2 btn btn-outline-secondary waves-effect waves-light">
                                                Movimientos{" "}
                                                <i className="mdi mdi-swap-horizontal ms-2"></i>
                                            </button>
                                        </Link>
                                        <Link to={`/editasset/${asset.id}`}>
                                            <ButtonIconTable icon='mdi mdi-pencil' color='warning' />
                                        </Link>
                                        <ButtonIconTable icon='mdi mdi-delete' color='danger' onClick={() => { onClickDelete(asset.id, asset.nombre, asset.referenciaInterna) }} />
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

export default withRouter(TableAssets)