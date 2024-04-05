
import React, { useState } from 'react'
import withRouter from '../../components/Common/withRouter';
import ButtonIconTable from '../../components/Common/ButtonIconTable';
import { Link } from 'react-router-dom';
import { getFechaTable } from '../../helpers/helpers';
import { Alert } from 'reactstrap';


const TableCleanlinessCheck = ({ ...props }) => {
    const { data } = props;

    return (

        <div className="table-responsive mb-3">
            <table className="table table-hover table-striped mb-0">
                <thead>
                    <tr>
                        <th>Fecha de chequeo</th>
                        <th>Puesto de limpieza</th>
                        <th>Usuario</th>
                        <th>Revisado</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((check, i)=>(
                            <tr key={`check-${i}`}>
                                <td>{getFechaTable(check.fecha)}</td>
                                <td>{check.puesto_limpieza.nombre}</td>
                                <td>{check.usuario?.nombre || ''}</td>
                                <td>
                                    {
                                        check.aprobado &&
                                        <Alert className='text-center'>
                                            Revisado
                                        </Alert>
                                    }
                                    {
                                        !check.aprobado &&
                                        <Alert color="danger" className='text-center'>
                                            Sin revisar
                                        </Alert>
                                    }
                                </td>
                                <td>
                                    {
                                        !check.aprobado &&
                                        <div className="d-flex">
                                            <Link to={`/cleaningjobs/check/${check.id}`}>
                                                <ButtonIconTable icon='mdi mdi-check-bold' color='info'/>
                                            </Link>
                                        </div>
                                        
                                    }
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )


}

export default withRouter(TableCleanlinessCheck)