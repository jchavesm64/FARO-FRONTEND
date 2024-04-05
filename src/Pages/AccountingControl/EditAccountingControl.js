import React, { useEffect, useState } from "react";
import { Card, CardBody, CardTitle, Col, Container, Label, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import Select from "react-select";
import SpanSubtitleForm from "../../components/Forms/SpanSubtitleForm";
import { infoAlert } from "../../helpers/alert";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useNavigate } from 'react-router-dom';
import { OBTENER_PROVEEDORES } from "../../services/ProveedorService";
import { OBTENER_CLIENTES } from "../../services/ClienteService";
import { OBTENER_USUARIOS_ACTIVOS } from "../../services/UsuarioService";
import { GUARDAR_REGISTRO_CONTABLE, ACTUALIZAR_REGISTRO_CONTABLE } from "../../services/RegistroContableService";
import { set } from "lodash";
import { OBTENER_ORDEN_COMPRA } from "../../services/OrdenCompraService";


const EditAccountingControl = ({ props, accountingControl, tipo }) => {
    document.title = "Control contable | FARO";

    const navigate = useNavigate();

    const [actualizar] = useMutation(ACTUALIZAR_REGISTRO_CONTABLE);
    const [insertar] = useMutation(GUARDAR_REGISTRO_CONTABLE);

    const [contactsType, setContactsType] = useState('');
    const [accontType, setAccountsType] = useState(null);
    const { loading: load_proveedores, data: data_proveedores, startPolling: startPolling_proveedores, stopPolling: stopPolling_proveedores } = useQuery(OBTENER_PROVEEDORES, { pollInterval: 1000 })
    const { loading: load_clientes, data: data_clientes, startPolling: startPolling_clientes, stopPolling: stopPolling_clientes } = useQuery(OBTENER_CLIENTES, { pollInterval: 1000 })
    const { loading: load_usuarios, data: data_usuarios, startPolling: startPolling_usuarios, stopPolling: stopPolling_usuarios } = useQuery(OBTENER_USUARIOS_ACTIVOS, { pollInterval: 1000 })
    const [referenciaModelo, setReferenciaModelo] = useState('manual')
    const [cliente, setCliente] = useState(null)
    const [proveedor, setProveedor] = useState(null)
    const [usuario, setUsuario] = useState(null)
    const [monto, setMonto] = useState(0)
    const [fechaRegistro, setFechaRegistro] = useState('')
    const [fechaPago, setFechaPago] = useState('')
    const [estadoRegistroContable, setEstadoRegistroContable] = useState('')
    const [tipoPago, setTipoPago] = useState(null)
    const [comprobantePago, setComprobantePago] = useState('')
    const [estado, setEstado] = useState('')
    const [referenciaID, setReferenciaID] = useState('')
    const [referenciaNombre, setReferenciaNombre] = useState('')

    const [getPurchaseOrder, { loading: loading_orden_compra, error: error_orden_compra, data: data_orden_compra }] = useLazyQuery(OBTENER_ORDEN_COMPRA);

    useEffect(() => {
        setAccountsType({ label: accountingControl.tipoRegistroContable, value: accountingControl.tipoRegistroContable })

        setFechaRegistro(getFecha(accountingControl.fechaRegistro))
        setFechaPago(getFecha(accountingControl.fechaPago))
        setTipoPago(accountingControl.tipoPago ? accountingControl.tipoPago : null)
        setEstado(accountingControl.estado)
        setReferenciaID(accountingControl.referenciaID ? accountingControl.referenciaID : '')
        setReferenciaNombre(accountingControl.referenciaNombre ? accountingControl.referenciaNombre : '')
        setReferenciaModelo(accountingControl.referenciaModelo ? accountingControl.referenciaModelo : '')
        setEstadoRegistroContable(accountingControl.estadoRegistroContable)
        setCliente(accountingControl.cliente ? accountingControl.cliente.id : null)
        setProveedor(accountingControl.proveedor ? accountingControl.proveedor.id : null)
        setUsuario(accountingControl.usuario ? accountingControl.usuario.id : null)
        setMonto(accountingControl.monto ? accountingControl.monto : null)
        setComprobantePago(accountingControl.comprobantePago ? accountingControl.comprobantePago : '')

        if (accountingControl.usuario !== null) {
            setContactsType({ label: 'Usuario', value: 'usuario' })
            setUsuario({ label: accountingControl.usuario.nombre, value: accountingControl.usuario })
        }
        if (accountingControl.proveedor !== null) {
            setContactsType({ label: 'Proveedor', value: 'proveedor' })
            setProveedor({ label: accountingControl.proveedor.empresa, value: accountingControl.proveedor })
        }
        if (accountingControl.cliente !== null) {
            setContactsType({ label: 'Cliente', value: 'cliente' })
            setCliente({ label: accountingControl.cliente.nombre, value: accountingControl.cliente })
        }

        if (accountingControl.estadoRegistroContable !== 'BORRADOR' && accountingControl.referenciaID && accountingControl.referenciaModelo === 'ordenCompra') {
            getPurchaseOrder({ variables: { id: accountingControl.referenciaID } })
        }

    }, [accountingControl])

    useEffect(() => {
        startPolling_proveedores(5000)
        startPolling_clientes(5000)
        startPolling_usuarios(5000)
        return () => {
            stopPolling_proveedores()
            stopPolling_clientes()
            stopPolling_usuarios()
        }
    }, [startPolling_proveedores, stopPolling_proveedores, startPolling_clientes, stopPolling_clientes, startPolling_usuarios, stopPolling_usuarios])


    const getFecha = (fechaString) => {
        if (fechaString !== null && fechaString.trim().length > 0) {
            const fecha = new Date(fechaString)
            return `${fecha.getFullYear()}-${(fecha.getMonth() + 1) >= 10 ? (fecha.getMonth() + 1) : '0' + (fecha.getMonth() + 1)}-${fecha.getDate() >= 10 ? fecha.getDate() : '0' + fecha.getDate()}`
        }
        return ''
    }

    const contactsTypes = [
        { label: "Usuario", value: "usuario" },
        { label: "Cliente", value: "cliente" },
        { label: "Proveedor", value: "proveedor" }
    ]

    const accontsTypes = [
        { label: "Por pagar", value: "PAGAR" },
        { label: "Por cobrar", value: "COBRAR" }
    ]

    const statesAccountingControl = [
        'BORRADOR',
        'PENDIENTE',
        'PAGADO',
    ]

    const tiposDePago = [
        { label: 'EFECTIVO', value: 'EFECTIVO' },
        { label: 'CHEQUE', value: 'CHEQUE' },
        { label: 'TRANSFERENCIA', value: 'TRANSFERENCIA' },
        { label: 'SINPE', value: 'SINPE' },
        { label: 'TARJETA', value: 'TARJETA' }
    ]

    function handleAccountType(selectedType) {
        setAccountsType(selectedType)
    }

    function handleContactType(selectedType) {
        setContactsType(selectedType)
        setCliente(null)
        setProveedor(null)
        setUsuario(null)
    }

    const getProveedores = () => {
        const datos = [];
        if (data_proveedores?.obtenerProveedores) {
            data_proveedores.obtenerProveedores.map(item => {
                datos.push({
                    "value": item,
                    "label": item?.empresa || ''
                });
            });
        }
        return datos;
    }

    const getClientes = () => {
        const datos = [];
        if (data_clientes?.obtenerClientes) {
            data_clientes.obtenerClientes.map(item => {
                datos.push({
                    "value": item,
                    "label": item?.nombre || ''
                });
            });
        }
        return datos;
    }

    const getUsuarios = () => {
        const datos = [];
        if (data_usuarios?.obtenerUsuariosActivos) {
            data_usuarios.obtenerUsuariosActivos.map(item => {
                datos.push({
                    "value": item,
                    "label": item?.nombre || ''
                });
            });
        }

        return datos;
    }

    const [disableGuardarOrden, setDisableGuardarOrden] = useState(true);
    const [disablePagarOrden, setDisablePagarOrden] = useState(true);

    const onSaveRegistroContable = async (estadoRC) => {
        try {
            setDisableGuardarOrden(true)
            const input = {
                estado: 'ACTIVO',
                estadoRegistroContable: estadoRC,
                fechaRegistro: fechaRegistro !== null && fechaRegistro.trim().length > 0 ? fechaRegistro + ' 00:00:00' : null,
                fechaPago: fechaPago !== null && fechaPago.trim().length > 0 ? fechaPago + ' 00:00:00' : null,
                tipoPago: tipoPago !== null ? tipoPago.value : null,
                tipoRegistroContable: accontType.value,
                referenciaID: referenciaID,
                referenciaNombre: referenciaNombre,
                referenciaModelo: referenciaModelo,
                cliente: cliente !== null ? cliente.value.id : null,
                proveedor: proveedor !== null ? proveedor.value.id : null,
                usuario: usuario !== null ? usuario.value.id : null,
                monto: parseFloat(monto),
                comprobantePago: comprobantePago
            }

            setEstadoRegistroContable(estadoRC)

            const { data } = await actualizar({ variables: { id: accountingControl.id, input, input }, errorPolicy: 'all' });
            const { estado, message } = data.actualizarRegistroContable;
            if (estado) {
                infoAlert('Excelente', message, 'success', 3000, 'top-end');
                if (estadoRC === 'BORRADOR') {
                    navigate(tipo === 'PAGAR' ? '/accountspayable' : '/accountsreceivable');
                }
            } else {
                infoAlert('Oops', message, 'error', 3000, 'top-end')
            }
            setDisableGuardarOrden(false)

        } catch (error) {
            console.log(error);
            infoAlert('Oops', 'Ocurrió un error inesperado al actualizar el registro contable', 'error', 3000, 'top-end')
            setDisableGuardarOrden(false)
        }
    }



    useEffect(() => {
        if (estadoRegistroContable === 'BORRADOR') {
            if (fechaRegistro === null || fechaRegistro.trim().length === 0 || monto === null || monto === 0 || (usuario === null && proveedor === null && cliente === null)) {
                setDisableGuardarOrden(true)
                return
            }
            setDisableGuardarOrden(false)
            return
        }

        if (fechaRegistro === null || fechaRegistro.trim().length === 0 || monto === null || monto === 0 || (usuario === null && proveedor === null && cliente === null) ||
            tipoPago === null || (tipoPago.value !== 'EFECTIVO' && (comprobantePago === null || comprobantePago.trim().length === 0))) {
            setDisableGuardarOrden(true)
            return
        }
        setDisableGuardarOrden(false)
    }, [fechaRegistro, monto, usuario, proveedor, cliente, tipoPago, comprobantePago, estadoRegistroContable])

    useEffect(() => {
        setDisablePagarOrden(fechaRegistro === null || fechaRegistro.trim().length === 0 || fechaPago === null || fechaPago.trim().length === 0 || monto === null || monto === 0 || (usuario === null && proveedor === null && cliente === null) ||
            tipoPago === null || (tipoPago.value !== 'EFECTIVO' && (comprobantePago === null || comprobantePago.trim().length === 0)))

    }, [fechaRegistro, fechaPago, monto, usuario, proveedor, cliente, tipoPago, comprobantePago, estadoRegistroContable])

    const getValueBeadcrum = () => {
        if (tipo === 'PAGAR') {
            return {
                value: 'Cuentas por pagar',
                url: '/accountspayable'
            }
        }
        return {
            value: 'Cuentas por cobrar',
            url: '/accountsreceivable'
        }
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Editar registro contable" breadcrumbItem={getValueBeadcrum().value} breadcrumbItemUrl={getValueBeadcrum().url} />
                    <Row>
                        <div className='col d-flex justify-content-end mb-3'>
                            {
                                statesAccountingControl.map((estado, i) => (
                                    <div key={i} className={estado === estadoRegistroContable ? `states_cards active ${i == 0 ? 'first' : ''} ${i == statesAccountingControl.length - 1 ? 'last' : ''}` : `states_cards ${i == 0 ? 'first' : ''} ${i == statesAccountingControl.length - 1 ? 'last' : ''}`} >
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
                                estadoRegistroContable === 'BORRADOR' && (
                                    <>
                                        <button type="button" className="btn btn-info waves-effect waves-light me-2" onClick={() => { onSaveRegistroContable('PENDIENTE') }}>
                                            Confirmar
                                        </button>
                                    </>
                                )
                            }
                            {
                                estadoRegistroContable === 'PENDIENTE' &&
                                <button type="button" className="btn btn-info waves-effect waves-light me-2" disabled={disablePagarOrden} onClick={() => { onSaveRegistroContable('PAGADO') }}>
                                    Pagar
                                </button>
                            }
                        </div>
                        {
                            estadoRegistroContable === 'BORRADOR' &&
                            <div className="col mb-3 text-end">
                                <button type="button" className="btn btn-primary waves-effect waves-light" disabled={disableGuardarOrden} onClick={() => { onSaveRegistroContable(estadoRegistroContable) }}>
                                    Guardar{" "}
                                    <i className="ri-save-line align-middle ms-2"></i>
                                </button>
                            </div>
                        }
                    </Row>

                    <div className="col-md-12 col-sm-12">
                        <Row>
                            <div className="col mb-3">
                                <SpanSubtitleForm subtitle='Información registro contable' />
                            </div>
                        </Row>
                        <Row>
                            <div className="col-md-3 col-sm-6 mb-3">
                                <Label>Tipo cuenta</Label>
                                <Select isDisabled={estadoRegistroContable !== 'BORRADOR'}
                                    menuPosition="fixed"
                                    value={accontType}
                                    onChange={(e) => {
                                        handleAccountType(e);
                                    }}
                                    options={accontsTypes}
                                    classNamePrefix="select2-selection"
                                />
                            </div>

                            <div className="col-md-3 col-sm-6 mb-3">
                                <label htmlFor="id" className="form-label">Monto</label>
                                <input className="form-control" type="number" readOnly={estadoRegistroContable !== 'BORRADOR'}
                                    id="monto" pattern="[0-9]*" inputMode="numeric"
                                    value={monto} onChange={(e) => setMonto(e.target.value)} />
                            </div>

                            <div className="col-md-3 col-sm-6 mb-3">
                                <label htmlFor="id" className="form-label">Fecha registro</label>
                                <input className="form-control" type="date" id="idDate" readOnly={estadoRegistroContable !== 'BORRADOR'}
                                    value={fechaRegistro} onChange={(e) => { setFechaRegistro(e.target.value) }} />
                            </div>
                        </Row>

                        <Row>

                            <div className="col-md-3 col-sm-6 mb-3">
                                <Label>Tipo contacto</Label>
                                <Select
                                    isDisabled={estadoRegistroContable !== 'BORRADOR'}
                                    menuPosition="fixed"
                                    value={contactsType}
                                    onChange={(e) => { handleContactType(e); }}
                                    options={contactsTypes}
                                    classNamePrefix="select2-selection"
                                    isClearable={false}
                                    isSearchable={true}
                                />
                            </div>

                            <div className="col-md-3 col-sm-6 mb-3" >
                                {
                                    contactsType.value === 'cliente' &&
                                    <>
                                        <Label>Cliente</Label>
                                        <Select id='cliente'
                                            isDisabled={estadoRegistroContable !== 'BORRADOR'}
                                            menuPosition="fixed"
                                            size="md" placeholder="Cliente"
                                            value={cliente}
                                            options={getClientes()}
                                            searchable={true}
                                            onChange={(e) => setCliente(e)}
                                        />
                                    </>
                                }
                                {
                                    contactsType.value === 'proveedor' &&
                                    <>
                                        <Label>Proveedor</Label>
                                        <Select id='proveedor'
                                            isDisabled={estadoRegistroContable !== 'BORRADOR'}
                                            menuPosition="fixed"
                                            size="md"
                                            placeholder="Proveedor"
                                            value={proveedor}
                                            options={getProveedores()}
                                            searchable={true}
                                            onChange={(e) => setProveedor(e)}
                                        />
                                    </>
                                }
                                {
                                    contactsType.value === 'usuario' &&
                                    <>
                                        <Label>Usuario</Label>
                                        <Select id='usuario'
                                            isDisabled={estadoRegistroContable !== 'BORRADOR'}
                                            menuPosition="fixed"
                                            size="md"
                                            placeholder="Usuario"
                                            value={usuario}
                                            options={getUsuarios()}
                                            onChange={(e) => setUsuario(e)}
                                        />
                                    </>
                                }
                            </div>
                            {
                                estadoRegistroContable !== 'BORRADOR' && tipo === 'PAGAR' &&
                                <div className="col-md-3 col-sm-6 mb-3">
                                    <label htmlFor="id" className="form-label">Identificador</label>
                                    <input className="form-control" type="text" disabled={estadoRegistroContable !== 'BORRADOR'}
                                        id="Identificador"
                                        value={accountingControl.consecutivo ? accountingControl.consecutivo.consecutivo : ""} />
                                </div>
                            }
                        </Row>
                    </div>

                    {
                        estadoRegistroContable !== 'BORRADOR' &&
                        <>
                            <hr />
                            <h5 className="text-left mt-3 mb-4">Información de pago</h5>
                            <div className='row'>
                                <div className='col-4 col-sm-6 mb-3'>
                                    <label htmlFor='tipoPago'>Tipo de pago</label>
                                    {
                                        estadoRegistroContable !== 'PAGADO' &&
                                        <Select id='tipoPago'
                                            style={{ width: '100%' }}
                                            size="md" placeholder="Tipo de pago"
                                            value={tipoPago}
                                            options={tiposDePago}
                                            menuPosition="fixed"
                                            searchable={true}
                                            onChange={(e) => { setTipoPago(e) }} />
                                    }
                                    {
                                        estadoRegistroContable === 'PAGADO' &&
                                        <input id='tipoPago'
                                            readOnly={estadoRegistroContable === 'PAGADO'}
                                            placeholder='Tipo de pago'
                                            type='text' className='form-control mt-2'
                                            value={tipoPago}
                                            onChange={(e) => setTipoPago(e.target.value)} />
                                    }
                                </div>
                                <div className="col-md-4 col-sm-6 mb-3">
                                    <label htmlFor="fechaPago" className="form-label">Fecha de pago</label>
                                    <input className="form-control" type="date" id="fechaPago" readOnly={estadoRegistroContable === 'PAGADO'}
                                        value={fechaPago} onChange={(e) => { setFechaPago(e.target.value) }} />
                                </div>
                                {
                                    tipoPago !== null && tipoPago !== '' && tipoPago.value !== 'EFECTIVO' &&
                                    <div className='col-4 col-sm-6 mb-3'>
                                        <label htmlFor='comprobante'>Comprobante</label>
                                        <input id='comprobante'
                                            readOnly={estadoRegistroContable === 'PAGADO'}
                                            placeholder='Comprobante'
                                            type='text' className='form-control mt-2'
                                            value={comprobantePago}
                                            onChange={(e) => setComprobantePago(e.target.value)} />
                                    </div>
                                }

                            </div>
                        </>

                    }
                    {
                        estadoRegistroContable !== 'BORRADOR' && accountingControl.referenciaID && accountingControl.referenciaModelo === 'ordenCompra' &&
                        <>
                            <hr />
                            <h5 className="text-left mt-3 mb-4">Resumen orden de compra</h5>
                            {
                                !error_orden_compra && !loading_orden_compra && data_orden_compra &&
                                <>
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
                                                                data_orden_compra.obtenerOrdenCompra.estadoPedido === 'Recibido' && <th>Cantidad recibida</th>
                                                            }
                                                            <th>Descuento</th>
                                                            <th>Subtotal</th>
                                                            <th>Impuestos</th>
                                                            <th>Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            data_orden_compra.obtenerOrdenCompra.lineasPedido.length > 0 && data_orden_compra.obtenerOrdenCompra.lineasPedido.map((linea, index) => (
                                                                <tr key={index}>
                                                                    <td>{linea.producto.nombre}</td>
                                                                    <td>₡{linea.precioUnitario}</td>
                                                                    <td>{linea.cantidad}</td>
                                                                    {
                                                                        data_orden_compra.obtenerOrdenCompra.estadoPedido === 'Recibido' && <td>{linea.cantidadRecibida}</td>
                                                                    }
                                                                    <td>₡{linea.descuento} {`${linea.porcentajeDescuento > 0 ? `(${linea.porcentajeDescuento}%)` : ''}`}</td>
                                                                    <td>₡{linea.subtotalSinImpuesto}</td>
                                                                    <td>₡{linea.montoImpuestos} {`${linea.impuesto?.valor > 0 ? `(${linea.impuesto.valor}%)` : ''}`}</td>
                                                                    <td>₡{linea.subtotalConImpuesto}</td>
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
                                                    <p>₡{data_orden_compra.obtenerOrdenCompra.subtotal}</p>
                                                    <p>₡{data_orden_compra.obtenerOrdenCompra.impuestos}</p>
                                                    <p>₡{data_orden_compra.obtenerOrdenCompra.total}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Row>
                                </>
                            }
                        </>

                    }

                </Container>
            </div>
        </React.Fragment>
    );
};

export default EditAccountingControl;
