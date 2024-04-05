
import React, { useState } from 'react'
import withRouter from '../../components/Common/withRouter';
import ButtonIconTable from '../../components/Common/ButtonIconTable';
import { Link } from 'react-router-dom';
import { getFechaTable } from '../../helpers/helpers';


const TableInternTransfers = ({ ...props }) => {
    const { data } = props;

    return (

        <div className="table-responsive mb-3">
            <table className="table table-hover table-striped mb-0">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Desde</th>
                        <th>Hasta</th>
                        <th>Usuario</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {
                        data.map((internTransfer, i)=>(
                            <tr key={`internTransfer-${i}`}>
                                <td>{getFechaTable(internTransfer.fecha)}</td>
                                <td>{internTransfer.almacenDesde?.nombre || ''}</td>
                                <td>{internTransfer.almacenHasta?.nombre || ''}</td>
                                <td>{internTransfer.usuario?.nombre || ''}</td>
                                <td>
                                    <div className="d-flex">
                                        <Link to={`/internTransfers/${internTransfer.id}`}>
                                            <ButtonIconTable icon='mdi mdi-eye' color='info'/>
                                        </Link>
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

export default withRouter(TableInternTransfers)