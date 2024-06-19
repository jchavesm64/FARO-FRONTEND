import React, { useEffect, useState } from "react";
import { Container, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import Select from "react-select";
import { infoAlert } from "../../helpers/alert";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate } from 'react-router-dom';
import { DELETE_ORDEN_COMPRA, SAVE_ORDEN_COMPRA, UPDATE_ESTADO_ORDEN_COMPRA, UPDATE_ORDEN_COMPRA } from "../../services/OrdenCompraService";
import { OBTENER_PROVEEDORES, OBTENER_PROVEEDORES_2 } from "../../services/ProveedorService";
import { OBTENER_TODAS_MATERIAS_PRIMAS } from "../../services/MateriaPrimaService";
import { OBTENER_IMPUESTOS } from "../../services/ImpuestoService";
import ButtonIconTable from "../../components/Common/ButtonIconTable";
import Swal from "sweetalert2";


const EditPurchaseOrder = ({ props, purchaseOrder }) => {
    document.title = "Órdenes de compra | FARO";

    const navigate = useNavigate();

    const [actualizar] = useMutation(UPDATE_ORDEN_COMPRA);
    const [actualizarEstadoCompra] = useMutation(UPDATE_ESTADO_ORDEN_COMPRA);
    const [desactivar] = useMutation(DELETE_ORDEN_COMPRA);


    const { loading: load_proveedores, data: data_proveedores } = useQuery(OBTENER_PROVEEDORES_2, { pollInterval: 1000 })
    const { loading: load_productos, data: data_productos } = useQuery(OBTENER_TODAS_MATERIAS_PRIMAS, { pollInterval: 1000 })
    const { loading: load_impuestos, data: data_impuestos } = useQuery(OBTENER_IMPUESTOS, { pollInterval: 1000 })
    const [insertar] = useMutation(SAVE_ORDEN_COMPRA);

    const [proveedor, setProveedor] = useState(null)
    const [numeroComprobante, setNumeroComprobante] = useState('')
    const [fechaPedido, setFechaPedido] = useState(`${new Date().getFullYear()}-${(new Date().getMonth() + 1) > 10 ? (new Date().getMonth() + 1) : '0' + (new Date().getMonth() + 1)}-${new Date().getDate() > 10 ? new Date().getDate() : '0' + new Date().getDate()}`)

    const [estadoPedido, setEstadoPedido] = useState('')
    const [subtotal, setSubtotal] = useState(0)
    const [impuestos, setImpuestos] = useState(0)
    const [total, setTotal] = useState(0)
    const [lineasPedido, setLineasPedido] = useState([])

    const estadoPedidos = [
        'Borrador',
        'Confirmado',
        'Cancelado',
        'Recibido',
    ]

    const [modoLinea, setModoLinea] = useState('Agregar')


    const [producto, setProducto] = useState(null)
    const [precioUnitario, setPrecioUnitario] = useState(0)
    const [cantidad, setCantidad] = useState(0)
    const [porcentajeDescuento, setPorcentajeDescuento] = useState(0)
    const [impuesto, setImpuesto] = useState(null)

    const [indexEditar, setIndexEditar] = useState(null)

    const getFecha = (fechaString) => {
        if (fechaString !== null && fechaString.trim().length > 0) {
            const fecha = new Date(fechaString)
            return `${fecha.getFullYear()}-${(fecha.getMonth() + 1) >= 10 ? (fecha.getMonth() + 1) : '0' + (fecha.getMonth() + 1)}-${fecha.getDate() >= 10 ? fecha.getDate() : '0' + fecha.getDate()}`
        }
        return ''
    }

    useEffect(() => {
        setProveedor({ value: purchaseOrder.proveedor, label: purchaseOrder.proveedor.empresa })
        setNumeroComprobante(purchaseOrder.numeroComprobante && purchaseOrder.numeroComprobante.trim().length > 0 ? purchaseOrder.numeroComprobante : '')
        setFechaPedido(getFecha(purchaseOrder.fechaPedido))
        setEstadoPedido(purchaseOrder.estadoPedido)

        if (purchaseOrder.lineasPedido && purchaseOrder.lineasPedido.length > 0) {
            setLineasPedido(purchaseOrder.lineasPedido.map(linea => {
                return {
                    id: linea.id,
                    producto: linea.producto,
                    precioUnitario: linea.precioUnitario,
                    cantidad: linea.cantidad,
                    cantidadRecibida: linea.cantidadRecibida,
                    porcentajeDescuento: linea.porcentajeDescuento,
                    subtotalSinImpuesto: parseFloat(linea.subtotalSinImpuesto).toFixed(2),
                    descuento: parseFloat(linea.descuento).toFixed(2),
                    impuesto: linea.impuesto,
                    montoImpuestos: parseFloat(linea.montoImpuestos).toFixed(2),
                    subtotalConImpuesto: parseFloat(linea.subtotalConImpuesto).toFixed(2),
                }
            }))
        } else {
            setLineasPedido([])
        }

        setSubtotal(parseFloat(purchaseOrder.subtotal).toFixed(2))
        setImpuestos(parseFloat(purchaseOrder.impuestosMonto).toFixed(2))
        setTotal(parseFloat(purchaseOrder.total).toFixed(2))

    }, [purchaseOrder])

    const getProveedores = () => {
        const datos = [];
        if (data_proveedores?.obtenerProveedores) {
            data_proveedores.obtenerProveedores.map(item => {
                datos.push({
                    "value": item,
                    "label": item.empresa
                });
            });
        }
        return datos;
    }

    const getProductos = () => {
        const datos = [];
        if (data_productos?.obtenerTodasMateriasPrimas) {
            data_productos.obtenerTodasMateriasPrimas.map(item => {
                datos.push({
                    "value": item,
                    "label": item.nombre
                });
            });
        }
        return datos;
    }

    const onChangeProducto = (p) => {
        if (p) {
            setProducto(p)
            setPrecioUnitario(p.value.precioCompra ? p.value.precioCompra : 0)
            setCantidad(1)
            setPorcentajeDescuento(0)
            if (p.value.impuestos) {
                const impuesto = p.value.impuestos.find(i => i.aplicaCompras)
                if (impuesto) {

                    setImpuesto(impuesto.impuesto)
                }

            }
        } else {
            limpiarLinea()

        }

    }

    const limpiarLinea = () => {
        setPrecioUnitario(0)
        setCantidad(0)
        setPorcentajeDescuento(0)
        setImpuesto(null)
        setProducto(null)
        setIndexEditar(null)
        setModoLinea('Agregar')
    }

    const getImpuestos = () => {
        const datos = [];
        if (data_impuestos?.obtenerImpuestos) {
            data_impuestos.obtenerImpuestos.map(item => {
                datos.push({
                    "value": item.id,
                    "label": `${item.nombre} (${item.valor}%)`
                });
            });
        }
        return datos;
    }

    const disabledLine = () => {
        if (!producto || producto === null) {
            return true
        }
        return false
    }

    const guardarLinea = () => {
        if (modoLinea === 'Agregar') {
            const existe = lineasPedido.find(l => l.producto.id === producto.value.id)
            if (existe) {
                infoAlert('Oops', 'Ya existe una línea con ese producto', 'warning', 3000, 'top-end')
                return
            }

            const obj = getObjetoLinea()
            setLineasPedido([...lineasPedido, obj])
            limpiarLinea()
        } else {
            const obj = getObjetoLinea()
            setLineasPedido(lineasPedido.map((l, i) => {
                if (l.producto.id !== producto.value.id) {
                    return l
                } else {
                    return obj
                }
            }))
            limpiarLinea()
        }
    }

    const getObjetoLinea = () => {
        let subtotalLinea = parseInt(cantidad) * parseFloat(precioUnitario)
        let descuento = 0
        if (porcentajeDescuento && porcentajeDescuento > 0) {
            descuento = subtotalLinea * (porcentajeDescuento / 100)
        }
        subtotalLinea -= descuento
        let impuestoLinea = null
        let porcentajeImpuesto = 0
        let montoImpuestos = 0
        if (impuesto !== null && impuesto !== '') {
            impuestoLinea = data_impuestos.obtenerImpuestos.find(i => i.id === impuesto.value)
            porcentajeImpuesto = impuestoLinea?.valor || 0
        }

        if (porcentajeImpuesto > 0) {
            montoImpuestos = subtotalLinea * (porcentajeImpuesto / 100)
        }

        const obj = {
            producto: producto.value,
            precioUnitario: precioUnitario,
            cantidad: cantidad,
            porcentajeDescuento: porcentajeDescuento,
            subtotalSinImpuesto: parseFloat(subtotalLinea).toFixed(2),
            descuento: parseFloat(descuento).toFixed(2),
            impuesto: impuestoLinea,
            montoImpuestos: parseFloat(montoImpuestos).toFixed(2),
            subtotalConImpuesto: parseFloat(subtotalLinea + montoImpuestos).toFixed(2),
        }

        return obj
    }

    const eliminarLinea = (index) => {
        setLineasPedido(lineasPedido.filter((l, i) => i !== index))
    }

    const editarLinea = (linea, index) => {

        setIndexEditar(index)
        setPrecioUnitario(linea.precioUnitario)
        setCantidad(linea.cantidad)
        setPorcentajeDescuento(linea.porcentajeDescuento)
        if (!linea.impuesto || linea.impuesto === null) {
            setImpuesto(null)
        } else {
            setImpuesto({ value: linea.impuesto.id, label: `${linea.impuesto.nombre} (${linea.impuesto.valor}%)` })
        }
        setProducto({ value: linea.producto, label: linea.producto.nombre })
        setModoLinea('Editar')

    }

    useEffect(() => {
        let sumaImpuestos = 0
        let sumaSubtotal = 0

        lineasPedido.forEach(linea => {
            sumaImpuestos += parseFloat(linea.montoImpuestos)
            sumaSubtotal += parseFloat(linea.subtotalConImpuesto)
        });

        setSubtotal(parseFloat(sumaSubtotal).toFixed(2))
        setImpuestos(parseFloat(sumaImpuestos).toFixed(2))
        setTotal(parseFloat(sumaSubtotal + sumaImpuestos).toFixed(2))
    }, [lineasPedido])

    const [disableSave, setDisableSave] = useState(true);

    useEffect(() => {
        setDisableSave(!lineasPedido || lineasPedido.length === 0 || !proveedor || proveedor === null)
    }, [lineasPedido, proveedor])

    const onSaveOrdenCompra = async () => {
        try {
            setDisableSave(true)
            const input = {
                estado: 'ACTIVO',
                proveedor: proveedor.value.id,
                estadoPedido: estadoPedido,
                fechaPedido: fechaPedido !== null && fechaPedido.trim().length > 0 ? fechaPedido + ' 00:00:00' : null,
                numeroComprobante: numeroComprobante,
                subtotal: subtotal,
                impuestosMonto: impuestos,
                total: total
            }

            const inputLineasEditar = lineasPedido.map(lin => {
                let l = {
                    estado: 'ACTIVO',
                    producto: lin.producto.id,
                    precioUnitario: lin.precioUnitario,
                    cantidad: lin.cantidad,
                    porcentajeDescuento: lin.porcentajeDescuento,
                    descuento: lin.descuento,
                    montoImpuestos: lin.montoImpuestos,
                    subtotalSinImpuesto: lin.subtotalSinImpuesto,
                    subtotalConImpuesto: lin.subtotalConImpuesto,
                }

                if (lin.impuesto !== null && lin.impuesto.id) {
                    l = {
                        ...l,
                        impuesto: lin.impuesto.id,
                    }
                }

                let obj = {
                    linea: l
                }

                if (lin.id && lin.id !== null) {
                    obj = {
                        ...obj,
                        id: lin.id
                    }
                }

                return obj
            })

            const { data } = await actualizar({ variables: { id: purchaseOrder.id, input, inputLineasEditar }, errorPolicy: 'all' });
            const { estado, message } = data.actualizarOrdenCompra;
            if (estado) {
                infoAlert('Excelente', message, 'success', 3000, 'top-end')
                navigate('/purchaseorders');
            } else {
                infoAlert('Oops', message, 'error', 3000, 'top-end')
            }
            setDisableSave(false)
        } catch (error) {
            infoAlert('Oops', 'Ocurrió un error inesperado al guardar el cliente', 'error', 3000, 'top-end')
            setDisableSave(false)
        }
    }

    const confirmarPedido = async () => {
        if (!lineasPedido || lineasPedido.length === 0) {
            infoAlert('Oops', 'No se puede confirmar un pedido sin líneas', 'error', 3000, 'top-end')
            return
        }
        await actualizarEstado('Confirmado')
    }

    const cancelarPedido = async () => {
        await actualizarEstado('Cancelado')
    }

    const actualizarEstado = async (estadoPedido) => {
        try {
            const { data } = await actualizarEstadoCompra({ variables: { id: purchaseOrder.id, estado: estadoPedido }, errorPolicy: 'all' });

            const { estado, message } = data.actualizarEstadoOrdenCompra;

            if (estado) {
                infoAlert('Excelente', message, 'success', 3000, 'top-end')
            } else {
                infoAlert('Oops', message, 'error', 3000, 'top-end')
            }

        } catch (error) {
            infoAlert('Oops', 'Hubo un error inesperado al actualizar estado orden de compra', 'error', 3000, 'top-end')
        }
    }

    const disabledSaveLine = () => {
        if (!producto || producto === null || (precioUnitario && precioUnitario < 0) || (cantidad && cantidad < 0) || (porcentajeDescuento && porcentajeDescuento < 0)) {
            return true
        }
        return false
    }

    const onClickRecibirProductos = () => {
        navigate(`/productsreception/${purchaseOrder.id}`);
    }

    const onDelete = (id, name) => {
        Swal.fire({
            title: "Eliminar orden de compra",
            text: `¿Está seguro de eliminar la orden ${name || ''}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#0BB197",
            cancelButtonColor: "#FF3D60",
            cancelButtonText: 'Cancelar',
            confirmButtonText: "Sí, ¡eliminar!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { data } = await desactivar({ variables: { id } });
                const { estado, message } = data.desactivarOrdenCompra;
                if (estado) {
                    infoAlert('Orden de compra eliminada', message, 'success', 3000, 'top-end')
                    navigate('/purchaseorders');
                } else {
                    infoAlert('Eliminar orden de compra', message, 'error', 3000, 'top-end')
                }
            }
        });
    }

    if (load_impuestos || load_productos || load_proveedores) {
        return <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Editar orden de compra" breadcrumbItem="Órdenes de compra" breadcrumbItemUrl='/purchaseorders' />
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
                    <Breadcrumbs title="Editar orden de compra" breadcrumbItem="Órdenes de compra" breadcrumbItemUrl='/purchaseorders' />
                    <Row>
                        <div className='col d-flex justify-content-end mb-3'>
                            {
                                estadoPedidos.map((estado, i) => (
                                    <div key={i} className={estado === estadoPedido ? `states_cards active ${i == 0 ? 'first' : ''} ${i == estadoPedidos.length - 1 ? 'last' : ''}` : `states_cards ${i == 0 ? 'first' : ''} ${i == estadoPedidos.length - 1 ? 'last' : ''}`} >
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
                                estadoPedido === 'Borrador' && (
                                    <>
                                        <button type="button" className="btn btn-info waves-effect waves-light me-2" onClick={() => { confirmarPedido() }}>
                                            Confirmar
                                        </button>
                                        <button type="button" className="btn btn-outline-info waves-effect waves-light me-2" onClick={() => { cancelarPedido() }}>
                                            Cancelar
                                        </button>
                                        <button type="button" className="btn btn-danger waves-effect waves-light me-2" onClick={() => { onDelete(purchaseOrder.id, purchaseOrder.numeroComprobante) }}>
                                            Eliminar
                                        </button>
                                    </>
                                )
                            }
                            {
                                estadoPedido === 'Confirmado' &&
                                <button type="button" className="btn btn-info waves-effect waves-light me-2" onClick={() => { onClickRecibirProductos() }}>
                                    Recibir productos
                                </button>
                            }
                        </div>
                        {
                            estadoPedido === 'Borrador' &&
                            <div className="col mb-3 text-end">
                                <button type="button" className="btn btn-primary waves-effect waves-light" disabled={disableSave} onClick={() => onSaveOrdenCompra()}>
                                    Guardar{" "}
                                    <i className="ri-save-line align-middle ms-2"></i>
                                </button>
                            </div>
                        }

                    </Row>
                    <Row>
                        <div className="col-md-4 col-sm-12 mb-3">
                            <label htmlFor="purchaseOrderDate" className="form-label">Fecha de pedido</label>
                            <input
                                className="form-control"
                                type="date"
                                id="purchaseOrderDate"
                                value={fechaPedido}
                                onChange={(e) => { setFechaPedido(e.target.value) }}
                                readOnly={estadoPedido !== 'Borrador'}
                            />
                        </div>
                        <div className="col-md-4 col-sm-12 mb-3">
                            <label htmlFor="voucherNumber" className="form-label">Número de comprobante</label>
                            <input readOnly={estadoPedido !== 'Borrador'} className="form-control" type="text" id="voucherNumber" value={numeroComprobante} onChange={(e) => { setNumeroComprobante(e.target.value) }} />
                        </div>
                        <div className="col-md-4 col-sm-12 mb-3">
                            <label htmlFor="supplier" className="form-label">Proveedor</label>
                            <Select
                                id="supplier"
                                value={proveedor}
                                onChange={(e) => {
                                    setProveedor(e);
                                }}
                                options={getProveedores()}
                                classNamePrefix="select2-selection"
                                isDisabled={estadoPedido !== 'Borrador'}
                            />
                        </div>
                    </Row>
                    <Row className="align-items-center">
                        <div className="col mt-5 mb-3">
                            <h6><strong>Líneas de pedido</strong></h6>
                        </div>
                        {
                            estadoPedido === 'Borrador' &&
                            <div className="col-2 mt-5 mb-3 text-end">
                                <button type="button" className="btn btn-outline-secondary waves-effect waves-light" onClick={limpiarLinea}>
                                    Limpiar{" "}
                                    <i className="ri-delete-bin-line align-middle"></i>
                                </button>
                            </div>
                        }
                        <hr />
                    </Row>
                    {
                        estadoPedido === 'Borrador' &&
                        <Row className="align-items-end">
                            <div className='col mb-3'>
                                <label htmlFor='productoLinea'>
                                    Producto
                                </label>
                                <Select menuPosition="fixed" isDisabled={modoLinea === 'Editar'} id='productoLinea' placeholder="Producto" value={producto} options={getProductos()} isSearchable={true} isClearable={true} onChange={(e) => onChangeProducto(e)} />
                            </div>
                            <div className='col mb-3'>
                                <label htmlFor='cantidadLinea'>
                                    Cantidad
                                </label>
                                <input disabled={disabledLine()} id='cantidadLinea' value={cantidad} onChange={(e) => setCantidad(e.target.value)} placeholder='Cantidad' type='number' className='form-control' />
                            </div>
                            <div className='col mb-3'>
                                <label htmlFor='precioUnitarioLinea'>
                                    Precio unitario
                                </label>
                                <input disabled={disabledLine()} id='precioUnitarioLinea' value={precioUnitario} onChange={(e) => setPrecioUnitario(e.target.value)} placeholder='Precio unitario' type='number' className='form-control' />
                            </div>
                            <div className='col mb-3'>
                                <label htmlFor='porcentajeDescuentoLinea'>
                                    Descuento (%)
                                </label>
                                <input disabled={disabledLine()} id='porcentajeDescuentoLinea' value={porcentajeDescuento} onChange={(e) => setPorcentajeDescuento(e.target.value)} placeholder='Descuento' type='number' className='form-control' />
                            </div>
                            <div className='col mb-3'>
                                <label htmlFor='impuesto'>
                                    Impuesto
                                </label>
                                <Select menuPosition="fixed" isDisabled={disabledLine()} id='impuesto' placeholder="Impuesto" value={impuesto} options={getImpuestos()} isSearchable={true} isClearable={true} onChange={(e) => setImpuesto(e)} />
                            </div>
                            <div className='col mb-3'>
                                {
                                    modoLinea === 'Agregar' ?
                                        <button style={{ width: '100%' }} type="button" className="btn btn-outline-secondary waves-effect waves-light" disabled={disabledSaveLine()} onClick={() => guardarLinea()}>
                                            Agregar{" "}
                                            <i className="ri-add-line align-middle"></i>
                                        </button>
                                        :
                                        <button style={{ width: '100%' }} type="button" className="btn btn-outline-secondary waves-effect waves-light" disabled={disabledSaveLine()} onClick={() => guardarLinea()}>
                                            Guardar{" "}
                                            <i className="ri-save-line align-middle"></i>
                                        </button>
                                }
                            </div>
                        </Row>
                    }
                    <Row>
                        <div className='col mt-3 mb-3'>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Producto</th>
                                            <th>Precio unitario</th>
                                            <th>Cantidad solicitada</th>
                                            {
                                                estadoPedido === 'Recibido' && <th>Cantidad recibida</th>
                                            }
                                            <th>Descuento</th>
                                            <th>Subtotal</th>
                                            <th>Impuestos</th>
                                            <th>Total</th>
                                            {
                                                estadoPedido === 'Borrador' && <th></th>
                                            }
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            lineasPedido.length > 0 && lineasPedido.map((linea, index) => (
                                                <tr key={index}>
                                                    <td>{linea.producto.nombre}</td>
                                                    <td>₡{linea.precioUnitario}</td>
                                                    <td>{linea.cantidad}</td>
                                                    {
                                                        estadoPedido === 'Recibido' && <td>{linea.cantidadRecibida}</td>
                                                    }
                                                    <td>₡{linea.descuento} {`${linea.porcentajeDescuento > 0 ? `(${linea.porcentajeDescuento}%)` : ''}`}</td>
                                                    <td>₡{linea.subtotalSinImpuesto}</td>
                                                    <td>₡{linea.montoImpuestos} {`${linea.impuesto?.valor > 0 ? `(${linea.impuesto.valor}%)` : ''}`}</td>
                                                    <td>₡{linea.subtotalConImpuesto}</td>
                                                    {
                                                        estadoPedido === 'Borrador' &&
                                                        <td>
                                                            <div className="d-flex justify-content-end mx-1 my-1">
                                                                <ButtonIconTable icon='mdi mdi-pencil' color='warning' onClick={() => { editarLinea(linea, index) }} />
                                                                <ButtonIconTable icon='mdi mdi-delete' color='danger' onClick={() => { eliminarLinea(index) }} />
                                                            </div>
                                                        </td>
                                                    }
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </Row>
                    <Row className='justify-content-end'>
                        <div className='col'>
                            <div className="d-flex justify-content-end float-rigth mt-2">
                                <div className='text-end me-3'>
                                    <p>Subtotal</p>
                                    <p>Impuestos</p>
                                    <p>Total</p>
                                </div>
                                <div>
                                    <p>₡{subtotal}</p>
                                    <p>₡{impuestos}</p>
                                    <p>₡{total}</p>
                                </div>
                            </div>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default EditPurchaseOrder;
