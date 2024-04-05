
import React, { useState } from 'react'
import withRouter from '../../components/Common/withRouter';
import ButtonIconTable from '../../components/Common/ButtonIconTable';
import { Link } from 'react-router-dom';


const TableCleaningJobs = ({ ...props }) => {
    const { data, onDelete } = props;

    const onClickDelete = async(id, nombre) => {
        await onDelete(id, nombre)
    }

    return (

        <div className="table-responsive mb-3">
            <table className="table table-hover table-striped mb-0">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Código</th>
                        <th>Ubicación en planta</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((cleaningJob, i)=>(
                            <tr key={`cleaningJob-${i}`}>
                                <td>{cleaningJob.nombre}</td>
                                <td>{cleaningJob.codigo}</td>
                                <td>{cleaningJob.ubicacion.nombre}</td>
                                <td>
                                    <div className="d-flex">
                                        <Link to={`/editcleaningjob/${cleaningJob.id}`}>
                                            <ButtonIconTable icon='mdi mdi-pencil' color='warning'/>
                                        </Link>
                                        <ButtonIconTable icon='mdi mdi-delete' color='danger' onClick={()=>{onClickDelete(cleaningJob.id, cleaningJob.nombre)}}/>
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

export default withRouter(TableCleaningJobs)