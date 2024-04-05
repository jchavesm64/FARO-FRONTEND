import React, { useState } from 'react'
import withRouter from '../../components/Common/withRouter';
import { getFechaTZ } from '../../helpers/helpers';


const TableAssets = ({ ...props }) => {

    const { data, mode } = props;

    data.sort((a, b) => {
        if (a.consecutivo.consecutivo > b.consecutivo.consecutivo) {
            return -1;
        }
        if (a.consecutivo.consecutivo < b.consecutivo.consecutivo) {
            return 1;
        }
        return 0;
    })

    return (

        <div className="table-responsive mb-3">
            <table className="table table-hover table-striped mb-0">
                <thead>
                    <tr>
                        <th></th>
                        <th>Identificador</th>
                        <th>Beneficiario</th>
                        <th>Fecha y Hora de Registro</th>
                        {mode === 'all' &&
                            <>
                                <th>Activo</th>
                                <th>Referencia Interna</th>
                            </>
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((move, i) => (
                            <tr key={`assetMove-${i}`}>
                                <td>
                                    {
                                        move.tipo === 'ENTRADA' ?
                                            <i className="mdi mdi-plus align-middle" style={{ color: '#0AC074' }}></i>
                                            :
                                            <i className="mdi mdi-minus align-middle" style={{ color: '#FF3D60' }}></i>
                                    }
                                </td>
                                <td>{move.consecutivo ? move.consecutivo.consecutivo : ""}</td>
                                <td>{move.beneficiario}</td>
                                <td>{getFechaTZ('fechaHora', move.fecha)}</td>
                                {mode === 'all' &&
                                    <>
                                        <td>{move.activo.nombre}</td>
                                        <td>{move.activo.referenciaInterna}</td>
                                    </>
                                }
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )


}

export default withRouter(TableAssets)