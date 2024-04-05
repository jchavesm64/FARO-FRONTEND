import React, { useEffect, useState } from "react";
import { Container, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import Select from "react-select";
import { infoAlert } from "../../helpers/alert";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate } from 'react-router-dom';
import ButtonIconTable from "../../components/Common/ButtonIconTable";
import { OBTENER_LINEAS_RECEPCION_PEDIDO } from "../../services/LineaRecepcionProductos";
import { OBTENER_ALMACENES } from "../../services/AlmacenService";
import { UPDATE_ESTADO_RECEPCION } from "../../services/RecepcionProductosService";
import ReceptionLine from "./ReceptionLine";


const EditProductsReception = ({ props, recepcion }) => {
    document.title = "Recepción de productos | FARO";

    const navigate = useNavigate();

    const { loading: load_lineas, data: data_lineas } = useQuery(OBTENER_LINEAS_RECEPCION_PEDIDO, { variables: { id: recepcion.id }, pollInterval: 1000 })
    const { loading: load_almacenes, data: data_almacenes } = useQuery(OBTENER_ALMACENES, { pollInterval: 1000 })
    const [actualizarEstadoRecepcion] = useMutation(UPDATE_ESTADO_RECEPCION);

    const [estado, setEstado] = useState('')
    const [proveedor, setProveedor] = useState(null)
    const [pedido, setPedido] = useState(null)
    const [fechaPedido, setFechaPedido] = useState('')
    const [fechaEntrega, setFechaEntrega] = useState('')
    const [estadoRecepcion, setEstadoRecepcion] = useState('')
    const [subtotal, setSubtotal] = useState(0)
    const [impuestosMonto, setImpuestosMonto] = useState(0)
    const [total, setTotal] = useState(0)
    const [lineasPedido, setLineasPedido] = useState([])
    const [almacen, setAlmacen] = useState(null)
    const [almacenTodos, setAlmacenTodos] = useState(false)

    const [disableConfirmar, setDisableConfirmar] = useState(true)

    useEffect(() => {
        setEstado(recepcion.estado)
        setProveedor(recepcion.proveedor.empresa)
        setPedido(recepcion.pedido)
        setFechaPedido(getFecha(recepcion.fechaPedido))
        setFechaEntrega(getFecha(recepcion.fechaEntrega))
        setEstadoRecepcion(recepcion.estadoRecepcion)
        setSubtotal(recepcion.subtotal)
        setImpuestosMonto(recepcion.impuestosMonto)
        setTotal(recepcion.total)

    }, [])

    useEffect(() => {
        setLineasPedido(data_lineas?.obtenerLineasRecepcionPedido || [])
    }, [data_lineas])

    const getFecha = (fechaString) => {
        if (fechaString !== null && fechaString.trim().length > 0) {
            const fecha = new Date(fechaString)
            return `${fecha.getFullYear()}-${(fecha.getMonth() + 1) >= 10 ? (fecha.getMonth() + 1) : '0' + (fecha.getMonth() + 1)}-${fecha.getDate() >= 10 ? fecha.getDate() : '0' + fecha.getDate()}`
        }
        return ''
    }

    const estadosRecepcion = [
        'Borrador',
        'Confirmado',
    ]

    const onSaveRecepcion = async () => {

    }

    const disableGuardarRecepcion = () => {
        return false
    }

    const disableConfirmarRecepcion = () => {
        const lineas = lineasPedido.filter(l => !l.cantidadRecibida || l.cantidadRecibida === null)
        if (lineas && lineas.length > 0) {
            return true
        }
        return false
    }

    useEffect(() => {
        setDisableConfirmar(disableConfirmarRecepcion())
    }, [lineasPedido])

    const confirmarRecepcion = async () => {
        try {
            setDisableConfirmar(true)
            const { data } = await actualizarEstadoRecepcion({ variables: { id: recepcion.id, estado: 'Confirmado' }, errorPolicy: 'all' });
            const { estado, message } = data.actualizarEstadoRecepcion;

            if (estado) {
                infoAlert('Excelente', message, 'success', 3000, 'top-end')
                navigate(`/editpurchaseorder/${recepcion.pedido.id}`);
            } else {
                infoAlert('Oops', message, 'error', 3000, 'top-end')
            }
            setDisableConfirmar(false)
        } catch (error) {
            console.log(error);
            setDisableConfirmar(false)
            infoAlert('Oops', 'Hubo un error inesperado al confirmar la recepción', 'error', 3000, 'top-end')
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



    if (load_lineas || load_almacenes) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title="Editar recepción de producto" breadcrumbItem="Recepción de productos" breadcrumbItemUrl='/productsreception' />
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
        )
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Editar recepción de producto" breadcrumbItem="Recepción de productos" breadcrumbItemUrl='/productsreception' />
                    <Row>
                        <div className='col d-flex justify-content-end mb-3'>
                            {
                                estadosRecepcion.map((estado, i) => (
                                    <div key={i} className={estado === estadoRecepcion ? `states_cards active ${i == 0 ? 'first' : ''} ${i == estadosRecepcion.length - 1 ? 'last' : ''}` : `states_cards ${i == 0 ? 'first' : ''} ${i == estadosRecepcion.length - 1 ? 'last' : ''}`} >
                                        <span>
                                            {estado}
                                        </span>
                                    </div>
                                ))
                            }

                        </div>
                    </Row>
                    <Row>
                        <div className="col mb-3 text-start">
                            {
                                estadoRecepcion === 'Borrador' && (
                                    <>
                                        <button type="button" className="btn btn-info waves-effect waves-light me-2" disabled={disableConfirmar} onClick={() => { confirmarRecepcion() }}>
                                            Confirmar
                                        </button>
                                    </>
                                )
                            }
                        </div>

                    </Row>
                    <Row>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="purchaseOrderDate" className="form-label">Fecha de pedido</label>
                            <input
                                className="form-control"
                                type="date"
                                id="purchaseOrderDate"
                                value={fechaPedido}
                                onChange={(e) => { setFechaPedido(e.target.value) }}
                                readOnly={true}
                            />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="supplier" className="form-label">Proveedor</label>
                            <input readOnly={true} id='supplier' placeholder='Proveedor' type='text' className='form-control' value={proveedor} onChange={(e) => setProveedor(e.target.value)} />
                        </div>
                        {
                            estadoRecepcion === 'Borrador' &&
                            <div className='col-md-3 col-sm-12 mb-3'>
                                <Row>
                                    <div className='col'>
                                        <label htmlFor='almacen' className="form-label">Almacén</label>
                                        <Select
                                            id="almacen"
                                            value={almacen}
                                            onChange={(e) => {
                                                setAlmacen(e);
                                            }}
                                            options={getAlmacenes()}
                                            classNamePrefix="select2-selection"
                                            isClearable={false}
                                            isSearchable={true}
                                        />
                                    </div>
                                </Row>
                                <Row>
                                    <div className='col mt-2'>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                value={almacenTodos}
                                                onChange={() => { setAlmacenTodos(!almacenTodos) }}
                                                id="warehouseCheck"
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor="warehouseCheck"
                                            >
                                                Mismo almacén para todos
                                            </label>
                                        </div>
                                    </div>
                                </Row>
                            </div>
                        }
                        {
                            estadoRecepcion !== 'Borrador' &&
                            <div className='col-md-3 col-sm-12 mb-3'>
                                <label htmlFor='fechaRecepcion' className="form-label">Fecha de recepción</label>
                                <input
                                    className="form-control"
                                    type="date"
                                    id="fechaRecepcion"
                                    value={fechaEntrega}
                                    onChange={(e) => setFechaEntrega(e.target.value)}
                                    readOnly={true}
                                    placeholder='Fecha de recepción'
                                />
                            </div>
                        }
                    </Row>
                    <Row className="align-items-center">
                        <div className="col mt-5 mb-3">
                            <h6><strong>Líneas de pedido</strong></h6>
                        </div>
                        <hr />
                    </Row>
                    <Row>
                        <div className='col mt-3 mb-3'>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Producto</th>
                                            <th>Cantidad Solicitada</th>
                                            <th>Cantidad recibida</th>
                                            <th>Almacén</th>
                                            {
                                                estadoRecepcion === 'Borrador' && <th></th>
                                            }
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            lineasPedido.length > 0 && lineasPedido.map((linea, index) => (
                                                <ReceptionLine linea={linea} key={index} estadoRecepcion={estadoRecepcion} almacenes={getAlmacenes()} almacen={almacen} almacenTodos={almacenTodos} />
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </Row>

                </Container>
            </div>
        </React.Fragment>
    );
};

export default EditProductsReception;
