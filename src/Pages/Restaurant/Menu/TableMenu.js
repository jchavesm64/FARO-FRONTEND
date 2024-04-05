
import React from 'react'
import withRouter from '../../../components/Common/withRouter';
import ButtonIconTable from '../../../components/Common/ButtonIconTable';
import { Link } from 'react-router-dom';


const TableMenu = ({ ...props }) => {

    const { data, onDelete } = props;

    const onClickDelete = async(id, nombre) => {
        await onDelete(id, nombre)
    }

    return (

        <div className="table-responsive mb-3">
            <table className="table table-hover table-striped mb-0">
                <thead>
                    <tr>
                        <th>Tipo</th>
                        <th>Nombre</th>
                        <th>Precio costo</th>
                        <th>Precio venta</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((menuItem, i)=>(
                            <tr key={`menu-${i}`}>
                                <td>{menuItem.tipo}</td>
                                <td>{menuItem.nombre}</td>
                                <td>₡{menuItem.precioCosto}</td>
                                <td>₡{menuItem.precioVenta}</td>
                                <td>
                                    <div className="d-flex">
                                        <Link to={`/restaurant/editmenu/${menuItem.id}`}>
                                            <ButtonIconTable icon='mdi mdi-pencil' color='warning'/>
                                        </Link>
                                        <ButtonIconTable icon='mdi mdi-delete' color='danger' onClick={()=>{onClickDelete(menuItem.id, menuItem.nombre)}}/>
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

export default withRouter(TableMenu)