import React, { useEffect, useState } from "react";
import { Container, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import Select from "react-select";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from 'react-router-dom';
import { OBTENER_ALMACENES } from "../../services/AlmacenService";
import { OBTENER_PROVEEDORES } from "../../services/ProveedorService";
import { OBTENER_CLIENTES } from "../../services/ClienteService";
import { OBTENER_MATERIA_PRIMA } from "../../services/MateriaPrimaService";
import { SAVE_MOVIMIENTO } from "../../services/MovimientosService";
import { infoAlert } from "../../helpers/alert";

import { OBTENER_USUARIO_CODIGO } from "../../services/UsuarioService"


const NewStockMoveIn = (props) => {
    document.title = "Movimientos | FARO";

    const navigate = useNavigate();

    const { stockType, productName, productId } = useParams();

    const { loading: load_proveedores, data: data_proveedores } = useQuery(OBTENER_PROVEEDORES, { pollInterval: 1000 })
    const { loading: load_clientes, data: data_clientes } = useQuery(OBTENER_CLIENTES, { pollInterval: 1000 })
    const { loading: load_almacenes, data: data_almacenes } = useQuery(OBTENER_ALMACENES, { pollInterval: 1000 })
    const { loading: load_producto, data: data_producto } = useQuery(OBTENER_MATERIA_PRIMA, { variables: { id: productId }, pollInterval: 1000 })
    const { data: data_usuario } = useQuery(OBTENER_USUARIO_CODIGO, { variables: { codigo: localStorage.getItem('cedula') } });

    const [insertar] = useMutation(SAVE_MOVIMIENTO);

    const [almacen, setAlmacen] = useState(null)
    const [cedido, setCedido] = useState(false)
    const [cliente, setCliente] = useState(null)
    const [proveedor, setProveedor] = useState(null)
    const [cantidad, setCantidad] = useState(0)
    const [precio, setPrecio] = useState(0)
    const [moneda, setMoneda] = useState('Colón')
    const [unidad, setUnidad] = useState(null)

    const [disableSave, setDisableSave] = useState(false);

    useEffect(() => {
        setDisableSave(!almacen || almacen === null || !cantidad || cantidad === null || cantidad <= 0 || (!cedido && (!proveedor || proveedor === null)) || (cedido && (!cliente || cliente === null)))
    }, [almacen, cantidad, proveedor, cliente, cedido])



    const onSave = async () => {
        var date = new Date();
        var fecha = date.getFullYear() + "-" + (((date.getMonth() + 1) < 10) ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)) + '-' + ((date.getDate() < 10) ? ('0' + date.getDate()) : date.getDate());

        const pasar = cedido ? (cantidad <= 0) : (cantidad <= 0 || precio <= 0)
        if (!pasar) {
            try {
                setDisableSave(true)
                const userId = data_usuario.obtenerUsuarioByCodigo.id;
                const input = {
                    tipo: 'ENTRADA',
                    lote: null,
                    cedido,
                    cliente: cliente ? cliente.value.id : null,
                    proveedor: proveedor ? proveedor.value.id : null,
                    fecha,
                    cantidad,
                    existencia: cantidad,
                    precio: parseFloat(cantidad * precio).toFixed(2),
                    precio_unidad: precio,
                    moneda,
                    materia_prima: productId,
                    almacen: almacen ? almacen.value.id : null,
                    usuario: userId,
                }
                const { data } = await insertar({ variables: { input, almacen: almacen.value.id }, errorPolicy: 'all' });
                const { estado, message } = data.insertarMovimiento;
                if (estado) {
                    infoAlert('Excelente', message, 'success', 3000, 'top-end')
                    navigate(`/product/movements/${stockType}/${productName}/${productId}`)
                } else {
                    infoAlert('Oops', message, 'error', 3000, 'top-end')
                }
                setDisableSave(false)
            } catch (error) {
                console.log(error)
                infoAlert('Oops', 'Ocurrió un error inesperado al registrar la entrada', 'error', 3000, 'top-end')
                setDisableSave(false)
            }
        } else {
            infoAlert('Oops', 'Los valores numericos deben ser mayor a cero', 'error', 3000, 'top-end')
        }
    }

    const getProvedores = () => {
        const datos = []
        if (data_proveedores.obtenerProveedores) {
            data_proveedores.obtenerProveedores.map(item => {
                datos.push({
                    "value": item,
                    "label": item.empresa
                });
            });
        }
        return datos;
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

    const getClientes = () => {
        const datos = []
        if (data_clientes.obtenerClientes) {
            data_clientes.obtenerClientes.map(item => {
                datos.push({
                    "value": item,
                    "label": item.nombre
                });
            });
        }
        return datos;
    }

    const getUnidad = () => {
        if (data_producto.obtenerMateriaPrima) {
            return data_producto.obtenerMateriaPrima.unidad
        }
        return null
    }

    if (load_proveedores || load_clientes || load_almacenes || load_producto) {
        return <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title={`Agregar entrada - ${productName}`} breadcrumbItem={`Movimientos - ${productName}`} breadcrumbItemUrl={`/product/movements/${stockType}/${productName}/${productId}`} />
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
                    <Breadcrumbs title={`Agregar entrada - ${productName}`} breadcrumbItem={`Movimientos - ${productName}`} breadcrumbItemUrl={`/product/movements/${stockType}/${productName}/${productId}`} />
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
                                <div className="col mb-3">
                                    <label htmlFor='almacen' className="form-label">Almacén</label>
                                    <Select
                                        menuPosition="fixed"
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
                                <div className="col mb-3">
                                    {
                                        cedido ? (
                                            <>
                                                <label htmlFor='customer' className="form-label">Cliente</label>
                                                <Select
                                                    menuPosition="fixed"
                                                    id="customer"
                                                    value={cliente}
                                                    onChange={(e) => {
                                                        setCliente(e);
                                                    }}
                                                    options={getClientes()}
                                                    classNamePrefix="select2-selection"
                                                    isClearable={false}
                                                    isSearchable={true}
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <label htmlFor='supplier' className="form-label">Proveedor</label>
                                                <Select
                                                    menuPosition="fixed"
                                                    id="supplier"
                                                    value={proveedor}
                                                    onChange={(e) => {
                                                        setProveedor(e);
                                                    }}
                                                    options={getProvedores()}
                                                    classNamePrefix="select2-selection"
                                                    isClearable={false}
                                                    isSearchable={true}
                                                />
                                            </>
                                        )
                                    }
                                </div>
                            </Row>
                            <Row>
                                <div className='col mt-2'>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            value={cedido}
                                            onChange={() => { setCedido(!cedido) }}
                                            id="cedidoCheck"
                                        />
                                        <label
                                            className="form-check-label"
                                            htmlFor="cedidoCheck"
                                        >
                                            Marcar en caso de que el producto sea cedido por el cliente
                                        </label>
                                    </div>
                                </div>
                            </Row>
                        </div>
                        <div className="col-md-6 col-sm-12">
                            <Row>
                                <div className="col mb-3">
                                    <label htmlFor='cantidad'>Cantidad</label>
                                    <div className="input-group">
                                        <input className="form-control" type="number" id='cantidad' value={cantidad} onChange={(e) => setCantidad(e.target.value)} placeholder='Cantidad' />
                                        <span className="input-group-text" id="basic-addon2">{getUnidad()}</span>
                                    </div>
                                </div>
                            </Row>
                            <Row>
                                <div className="col mb-3">
                                    <label htmlFor='precio'>Precio unitario</label>
                                    <input id='precio' value={precio} onChange={(e) => setPrecio(e.target.value)} placeholder='Precio unitario' type='number' className='form-control' />
                                </div>
                            </Row>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default NewStockMoveIn;
