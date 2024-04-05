import React, { useEffect, useState } from "react";
import { Container, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import Select from "react-select";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from 'react-router-dom';
import { OBTENER_ALMACENES } from "../../services/AlmacenService";
import { SAVE_SALIDA } from "../../services/MovimientosService";
import { infoAlert } from "../../helpers/alert";
import { OBTENER_LINEAS_ALMACEN } from "../../services/AlmacenLineaService";

import { OBTENER_USUARIO_CODIGO } from "../../services/UsuarioService"


const NewStockMoveOut = (props) => {
    document.title = "Movimientos | FARO";

    const navigate = useNavigate();

    const { stockType, productName, productId } = useParams();

    const { loading: load_almacenes, data: data_almacenes } = useQuery(OBTENER_ALMACENES, { pollInterval: 1000 })
    const { data: data_usuario } = useQuery(OBTENER_USUARIO_CODIGO, { variables: { codigo: localStorage.getItem('cedula') } });

    const [getWarehouseLines, { loading: load_lineas_almacenes, error: error_lineas_almacenes, data: data_lineas_almacenes }] = useLazyQuery(OBTENER_LINEAS_ALMACEN, { pollInterval: 1000 });

    const [insertar] = useMutation(SAVE_SALIDA);

    const [almacen, setAlmacen] = useState(null)
    const [cantidad, setCantidad] = useState(0)

    const [disableSave, setDisableSave] = useState(true);

    const [cantidadDisponibleAlmacen, setCantidadDisponibleAlmacen] = useState('')

    useEffect(() => {
        if (!almacen || almacen === null || !cantidad || cantidad === null || cantidad <= 0 || !cantidadDisponibleAlmacen) {
            setDisableSave(true)
            return
        }
        try {
            const canDis = parseFloat(cantidadDisponibleAlmacen)
            if (canDis <= 0 || (cantidad > canDis)) {
                setDisableSave(true)
                return
            }
        } catch (error) {
            setDisableSave(true)
            return
        }
        setDisableSave(false)
    }, [almacen, cantidad, cantidadDisponibleAlmacen])

    useEffect(() => {
        getWarehouseLines({ variables: { id: almacen?.value.id || null } })
    }, [almacen])

    useEffect(() => {
        setCantidadDisponibleAlmacen(data_lineas_almacenes ? (data_lineas_almacenes.obtenerLineasAlmacen.find((value, index) => value.producto.id === productId))?.cantidad || '0' : '')
    }, [data_lineas_almacenes])


    const onSave = async () => {
        var date = new Date();
        var fecha = date.getFullYear() + "-" + (((date.getMonth() + 1) < 10) ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)) + '-' + ((date.getDate() < 10) ? ('0' + date.getDate()) : date.getDate());

        const userId = data_usuario.obtenerUsuarioByCodigo.id

        try {
            setDisableSave(true)
            const input = {
                tipo: 'SALIDA',
                fecha,
                cantidad,
                materia_prima: productId,
                almacen: almacen ? almacen.value.id : null,
                usuario: userId
            }
            const { data } = await insertar({ variables: { input, almacen: almacen.value.id }, errorPolicy: 'all' });
            const { estado, message } = data.insertarSalida;
            if (estado) {
                infoAlert('Excelente', message, 'success', 3000, 'top-end')
                navigate(`/product/movements/${stockType}/${productName}/${productId}`)
            } else {
                infoAlert('Oops', message, 'error', 3000, 'top-end')
            }
            setDisableSave(false)
        } catch (error) {
            console.log(error)
            infoAlert('Oops', 'Ocurrió un error inesperado al registrar la salida', 'error', 3000, 'top-end')
            setDisableSave(false)
        }
    }

    const getAlmacenes = () => {
        const datos = []
        if (data_almacenes.obtenerAlmacenes) {
            data_almacenes.obtenerAlmacenes.map(item => {
                datos.push({
                    "value": item,
                    "label": item.nombre
                });
            });
        }
        return datos;
    }



    if (load_almacenes || load_lineas_almacenes) {
        return <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title={`Agregar salida - ${productName}`} breadcrumbItem={`Movimientos - ${productName}`} breadcrumbItemUrl={`/product/movements/${stockType}/${productName}/${productId}`} />
                    <Row>
                        <div className="col text-center pt-3 pb-3">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title={`Agregar salida - ${productName}`} breadcrumbItem={`Movimientos - ${productName}`} breadcrumbItemUrl={`/product/movements/${stockType}/${productName}/${productId}`} />
                    <Row>
                        <div className="col mb-3 text-end">
                            <button disabled={disableSave} onClick={onSave} type="button" className="btn btn-primary waves-effect waves-light" >
                                Guardar{" "}
                                <i className="ri-save-line align-middle ms-2"></i>
                            </button>
                        </div>
                    </Row>
                    <Row>
                        <div className="col-md-6 col-sm-12">
                            <Row>
                                <div className="col-md-6 col-sm-12 mb-3">
                                    <label htmlFor='almacen' className="form-label">Almacén</label>
                                    <Select
                                        menuPosition="fixed"
                                        id="almacen"
                                        value={almacen}
                                        onChange={(e) => {
                                            setAlmacen(e)
                                        }}
                                        options={getAlmacenes()}
                                        classNamePrefix="select2-selection"
                                        isClearable={false}
                                        isSearchable={true}
                                    />
                                </div>
                                {
                                    cantidadDisponibleAlmacen &&
                                    <div className="col-md-6 col-sm-12 mb-3">
                                        <label htmlFor='cantidad'>Cantidad disponible en almacén</label>
                                        <input readOnly={true} id='cantidad' value={cantidadDisponibleAlmacen} placeholder='Cantidad disponible en almacén' className='form-control' />
                                    </div>
                                }

                            </Row>
                        </div>
                        <div className="col-md-6 col-sm-12">
                            <Row>
                                <div className="col mb-3">
                                    <label htmlFor='cantidad'>Cantidad a retirar</label>
                                    <input id='cantidad' value={cantidad} onChange={(e) => setCantidad(e.target.value)} placeholder='Cantidad a retirar' type='number' className='form-control' />
                                </div>
                            </Row>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default NewStockMoveOut;
