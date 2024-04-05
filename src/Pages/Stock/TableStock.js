
import React, { useState } from 'react'
import withRouter from '../../components/Common/withRouter';
import ButtonIconTable from '../../components/Common/ButtonIconTable';
import { Link } from 'react-router-dom';
import { calculateStockMovements } from '../../helpers/helpers';


const TableStock = ({ ...props }) => {

    const { data } = props;
    return (

        <div className="table-responsive mb-3">
            <table className="table table-hover table-striped mb-0">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        {/* <th>País</th> */}
                        <th>Existencias</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((product, i)=>(
                            <tr key={`product-${i}`}>
                                <td>{product.materia_prima.nombre}</td>
                                {/* <td>{product.materia_prima.pais}</td> */}
                                <td>{calculateStockMovements(product.movimientos) + ' ' + product.materia_prima.unidad}</td>
                                <td>
                                    <div className="d-flex">
                                        <Link to={`/product/movements/${product.materia_prima.tipo}/${product.materia_prima.nombre}/${product.materia_prima.id}`}>
                                            <button type="button" className="me-2 btn btn-outline-secondary waves-effect waves-light">
                                                Movimientos{" "}
                                                <i className="mdi mdi-swap-horizontal ms-2"></i>
                                            </button>
                                        </Link>
                                        <Link to={`/editproduct/${product.materia_prima.tipo}/${product.materia_prima.id}`}>
                                            <ButtonIconTable icon='mdi mdi-pencil' color='warning'/>
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

export default withRouter(TableStock)