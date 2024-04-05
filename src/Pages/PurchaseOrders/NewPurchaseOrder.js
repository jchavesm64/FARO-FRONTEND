import React, { useEffect, useState } from "react";
import { Container, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import Select from "react-select";
import { infoAlert } from "../../helpers/alert";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate } from 'react-router-dom';
import { SAVE_ORDEN_COMPRA } from "../../services/OrdenCompraService";
import { OBTENER_PROVEEDORES } from "../../services/ProveedorService";
import { OBTENER_TODAS_MATERIAS_PRIMAS } from "../../services/MateriaPrimaService";
import { OBTENER_IMPUESTOS } from "../../services/ImpuestoService";
import ButtonIconTable from "../../components/Common/ButtonIconTable";


const NewPurchaseOrder = (props) => {
    document.title = "Órdenes de compra | FARO";

    const navigate = useNavigate();


    const { loading: load_proveedores, data: data_proveedores } = useQuery(OBTENER_PROVEEDORES, { pollInterval: 1000 })
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

    const [modoLinea, setModoLinea] = useState('Agregar')


    const [producto, setProducto] = useState(null)
    const [precioUnitario, setPrecioUnitario] = useState(0)
    const [cantidad, setCantidad] = useState(0)
    const [porcentajeDescuento, setPorcentajeDescuento] = useState(0)
    const [impuesto, setImpuesto] = useState(null)

    const [indexEditar, setIndexEditar] = useState(null)


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
            setPrecioUnitario(p.value.precioCostoPromedio ? p.value.precioCostoPromedio !== null : 0)
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
            precioUnitario: parseFloat(precioUnitario).toFixed(2),
            cantidad: parseInt(cantidad),
            porcentajeDescuento: parseInt(porcentajeDescuento),
            subtotalSinImpuesto: subtotalLinea.toFixed(2),
            descuento: descuento.toFixed(2),
            impuesto: impuestoLinea,
            montoImpuestos: montoImpuestos.toFixed(2),
            subtotalConImpuesto: (subtotalLinea + montoImpuestos).toFixed(2)
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
            sumaSubtotal += parseFloat(linea.subtotalSinImpuesto)
        });

        setSubtotal(sumaSubtotal.toFixed(2))
        setImpuestos(sumaImpuestos.toFixed(2))
        setTotal((sumaImpuestos + sumaSubtotal).toFixed(2))
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
                estadoPedido: 'Borrador',
                fechaPedido: fechaPedido !== null && fechaPedido.trim().length > 0 ? fechaPedido + ' 00:00:00' : null,
                numeroComprobante: numeroComprobante,
                subtotal: parseFloat(subtotal).toFixed(2),
                impuestosMonto: parseFloat(impuestos).toFixed(2),
                total: parseFloat(total).toFixed(2),
                cedula: localStorage.getItem('cedula')
            }

            const inputLineas = lineasPedido.map(linea => {
                console.log(linea);
                let l = {
                    estado: 'ACTIVO',
                    producto: linea.producto.id,
                    precioUnitario: linea.precioUnitario,
                    cantidad: linea.cantidad,
                    porcentajeDescuento: linea.porcentajeDescuento,
                    descuento: linea.descuento,
                    montoImpuestos: parseFloat(linea.montoImpuestos).toFixed(2),
                    subtotalSinImpuesto: parseFloat(linea.subtotalSinImpuesto).toFixed(2),
                    subtotalConImpuesto: parseFloat(linea.subtotalConImpuesto).toFixed(2)
                }

                if (linea.impuesto !== null && linea.impuesto?.id) {
                    l = {
                        ...l,
                        impuesto: linea.impuesto?.id || null,
                    }
                }

                return l
            })

            const { data } = await insertar({ variables: { input, inputLineas }, errorPolicy: 'all' });
            const { estado, message, data: dataOC } = data.insertarOrdenCompra;
            if (estado) {
                infoAlert('Excelente', message, 'success', 3000, 'top-end')
                console.log(data)
                navigate(`/editpurchaseorder/${dataOC.id}`);
            } else {
                infoAlert('Oops', message, 'error', 3000, 'top-end')
            }
            setDisableSave(false)
        } catch (error) {
            console.log(error)
            infoAlert('Oops', 'Ocurrió un error inesperado al guardar el cliente', 'error', 3000, 'top-end')
            setDisableSave(false)
        }
    }

    const disabledSaveLine = () => {
        if (!producto || producto === null || (precioUnitario && precioUnitario < 0) || (cantidad && cantidad < 0) || (porcentajeDescuento && porcentajeDescuento < 0)) {
            return true
        }
        return false
    }

    if (load_proveedores || load_productos || load_impuestos) {
        return <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Nueva orden de compra" breadcrumbItem="Órdenes de compra" breadcrumbItemUrl='/purchaseorders' />
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
                    <Breadcrumbs title="Nueva orden de compra" breadcrumbItem="Órdenes de compra" breadcrumbItemUrl='/purchaseorders' />
                    <Row>
                        <div className="col mb-3 text-end">
                            <button type="button" className="btn btn-primary waves-effect waves-light" disabled={disableSave} onClick={() => onSaveOrdenCompra()}>
                                Guardar{" "}
                                <i className="ri-save-line align-middle ms-2"></i>
                            </button>
                        </div>
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

                            />
                        </div>
                        <div className="col-md-4 col-sm-12 mb-3">
                            <label htmlFor="voucherNumber" className="form-label">Número de comprobante</label>
                            <input className="form-control" type="text" id="voucherNumber" value={numeroComprobante} onChange={(e) => { setNumeroComprobante(e.target.value) }} />
                        </div>
                        <div className="col-md-4 col-sm-12 mb-3">
                            <label htmlFor="supplier" className="form-label">* Proveedor</label>
                            <Select
                                id="supplier"
                                value={proveedor}
                                onChange={(e) => {
                                    setProveedor(e);
                                }}
                                options={getProveedores()}
                                classNamePrefix="select2-selection"
                            />
                        </div>
                    </Row>
                    <Row className="align-items-center">
                        <div className="col mt-5 mb-3">
                            <h6><strong>Líneas de pedido</strong></h6>
                        </div>
                        <div className="col-2 mt-5 mb-3 text-end">
                            <button type="button" className="btn btn-outline-secondary waves-effect waves-light" onClick={limpiarLinea}>
                                Limpiar{" "}
                                <i className="ri-delete-bin-line align-middle"></i>
                            </button>
                        </div>

                        <hr />
                    </Row>
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
                    <Row>
                        <div className='col mt-3 mb-3'>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Producto</th>
                                            <th>Precio unitario</th>
                                            <th>Cantidad</th>
                                            <th>Descuento</th>
                                            <th>Subtotal</th>
                                            <th>Impuestos</th>
                                            <th>Total</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            lineasPedido.length > 0 && lineasPedido.map((linea, index) => (
                                                <tr key={index}>
                                                    <td>{linea.producto.nombre}</td>
                                                    <td>₡{linea.precioUnitario}</td>
                                                    <td>{linea.cantidad}</td>
                                                    <td>₡{linea.descuento} {`${linea.porcentajeDescuento > 0 ? `(${linea.porcentajeDescuento}%)` : ''}`}</td>
                                                    <td>₡{linea.subtotalSinImpuesto}</td>
                                                    <td>₡{linea.montoImpuestos} {`${linea.impuesto?.valor > 0 ? `(${linea.impuesto.valor}%)` : ''}`}</td>
                                                    <td>₡{linea.subtotalConImpuesto}</td>
                                                    <td>
                                                        <div className="d-flex justify-content-end mx-1 my-1">
                                                            <ButtonIconTable icon='mdi mdi-pencil' color='warning' onClick={() => { editarLinea(linea, index) }} />
                                                            <ButtonIconTable icon='mdi mdi-delete' color='danger' onClick={() => { eliminarLinea(index) }} />
                                                        </div>
                                                    </td>
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

export default NewPurchaseOrder;
