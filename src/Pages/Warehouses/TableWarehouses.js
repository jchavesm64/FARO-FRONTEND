
import React from 'react'
import withRouter from '../../components/Common/withRouter';
import ButtonIconTable from '../../components/Common/ButtonIconTable';
import { Link } from 'react-router-dom';


const TableWarehouses = ({ ...props }) => {

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
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((warehouse, i)=>(
                            <tr key={`warehouse-${i}`}>
                                <td>{warehouse.nombre}</td>
                                <td>
                                    <div className="d-flex">
                                        <Link to={`/editwarehouse/${warehouse.id}`}>
                                            <ButtonIconTable icon='mdi mdi-pencil' color='warning'/>
                                        </Link>
                                        <ButtonIconTable icon='mdi mdi-delete' color='danger' onClick={()=>{onClickDelete(warehouse.id, warehouse.nombre)}}/>
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

export default withRouter(TableWarehouses)