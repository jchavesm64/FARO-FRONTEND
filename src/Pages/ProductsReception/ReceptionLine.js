import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client';
import withRouter from '../../components/Common/withRouter';
import { ACTUALIZAR_CANTIDAD_LINEA_RECEPCION } from '../../services/LineaRecepcionProductos';
import { infoAlert } from '../../helpers/alert';
import ButtonIconTable from '../../components/Common/ButtonIconTable';
import Select from "react-select";


const ReceptionLine = ({ props, linea, estadoRecepcion, almacenes, almacen, almacenTodos }) => {

    const [actualizar] = useMutation(ACTUALIZAR_CANTIDAD_LINEA_RECEPCION);


    const [cantidadRecibida, setCantidadRecibida] = useState(linea.cantidadRecibida || 0)
    const [almacenLinea, setAlmacenLinea] = useState(linea.almacen ? { value: linea.almacen, label: linea.almacen.nombre } : null)

    useEffect(() => {
        if (almacen && almacenTodos) {
            setAlmacenLinea(almacen)
            onClickActualizarCantidad(almacen)
        }
    }, [almacen, almacenTodos])


    const onClickActualizarCantidad = async (alm) => {
        try {
            const { data } = await actualizar({ variables: { id: linea.id, cantidad: cantidadRecibida, almacen: alm ? alm.value.id : almacenLinea.value.id }, errorPolicy: 'all' });
            const { estado, message } = data.actualizarCantidadRecibidaLineaRecepcion;
            if (estado) {
                infoAlert('Excelente', message, 'success', 3000, 'top-end')
            } else {
                infoAlert('Oops', message, 'error', 3000, 'top-end')
            }
        } catch (error) {
            infoAlert('Oops', 'Hubo un error inesperado al actualizar la cantidad', 'error', 3000, 'top-end')
        }
    }


    return (
        <tr>
            <td>{linea.producto.nombre}</td>
            <td>{linea.cantidadSolicitada}</td>

            {estadoRecepcion === 'Borrador' ?
                <td>
                    <input id='cantidadRecibida' placeholder='Cantidad Recibida' type='number' className='form-control' value={cantidadRecibida} onChange={(e) => { setCantidadRecibida(e.target.value) }} />
                </td>
                :
                <td>
                    {linea.cantidadRecibida}
                </td>
            }
            {estadoRecepcion === 'Borrador' ?
                <td>
                    <Select
                        menuPosition="fixed"
                        disabled={almacenTodos}
                        id="almacen"
                        value={almacenLinea}
                        onChange={(e) => {
                            setAlmacenLinea(e);
                        }}
                        options={almacenes}
                        classNamePrefix="select2-selection"
                        isClearable={false}
                        isSearchable={true}
                    />
                </td>
                :
                <td>
                    {linea.almacen?.nombre || ''}
                </td>
            }

            {
                estadoRecepcion === 'Borrador' &&
                <td>
                    <div className="d-flex justify-content-end mx-1 my-1">
                        <ButtonIconTable icon='mdi mdi-content-save' color='warning' onClick={() => { onClickActualizarCantidad() }} />
                    </div>
                </td>
            }
        </tr>
    )


}

export default withRouter(ReceptionLine)