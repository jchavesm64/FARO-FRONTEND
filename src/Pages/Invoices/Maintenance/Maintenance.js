import React, { useEffect, useState } from "react";
import { Container, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import Select from "react-select";
import { useQuery } from "@apollo/client";
import { OBTENER_FACTURAS_PARAMETROS_BY_TYPE } from "../../../services/FacturasParametrosService";
import { OBTENER_TODAS_MATERIAS_PRIMAS } from "../../../services/MateriaPrimaService";



const InvoiceMaintenance = ({ ...props }) => {

    document.title = "Mantenimiento | FARO";

    const { data: dataCurrencyTypes} = useQuery(OBTENER_FACTURAS_PARAMETROS_BY_TYPE, { variables: { type: 'currencyTypes' }, pollInterval: 1000 })

    const { data: dataPaymentMethods} = useQuery(OBTENER_FACTURAS_PARAMETROS_BY_TYPE, { variables: { type: 'paymentMethods' }, pollInterval: 1000 })

    const { data: dataSaleConditions} = useQuery(OBTENER_FACTURAS_PARAMETROS_BY_TYPE, { variables: { type: 'saleConditions' }, pollInterval: 1000 })

    const { data: dataDocumentTypes} = useQuery(OBTENER_FACTURAS_PARAMETROS_BY_TYPE, { variables: { type: 'documentTypes' }, pollInterval: 1000 })

    const { data: dataMateriasPrimas} = useQuery(OBTENER_TODAS_MATERIAS_PRIMAS, { pollInterval: 1000 })

    useEffect(() => {
        if (dataCurrencyTypes) {
            const options = dataCurrencyTypes.obtenerFacturasParametrosByType.map(item => ({
                value: item.id,
                label: item.value
            }));

            setTipoMonedas(options)
        }

        if (dataPaymentMethods) {
            const options = dataPaymentMethods.obtenerFacturasParametrosByType.map(item => ({
                value: item.id,
                label: item.value
            }));

            setMetodoPagos(options)
        }

        if (dataSaleConditions) {
            const options = dataSaleConditions.obtenerFacturasParametrosByType.map(item => ({
                value: item.id,
                label: item.value
            }));

            setCondicionVentas(options)
        }

        if (dataDocumentTypes) {
            const options = dataDocumentTypes.obtenerFacturasParametrosByType.map(item => ({
                value: item.id,
                label: item.value
            }));

            setTipoFacturas(options)
        }
    }, [dataCurrencyTypes, dataPaymentMethods, dataSaleConditions, dataDocumentTypes])


    const [selectedTipoMoneda, setSelectedTipoMoneda] = useState(null);
    const onChangeTipoMoneda = (option) => {
         setSelectedTipoMoneda(option);
    };
    const [tipoMonedas, setTipoMonedas] = useState([]);


    const [selectedMetodoPago, setSelectedMetodoPago] = useState(null);
    const onChangeMetodoPago = (option) => {
         setSelectedMetodoPago(option);
    };
    const [metodoPagos, setMetodoPagos] = useState([]);

    const [selectedCondicionVenta, setSelectedCondicionVenta] = useState(null);
    const onChangeCondicionVenta = (option) => {
         setSelectedCondicionVenta(option);
    };
    const [condicionVentas, setCondicionVentas] = useState([]);

    const [selectedTipoFactura, setSelectedTipoFactura] = useState(null);
    const onChangeTipoFactura = (option) => {
         setSelectedTipoFactura(option);
    };
    const [tipoFacturas, setTipoFacturas] = useState([]);

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    const [codigoArticulo, setCodigoArticulo] = useState("");
    const [cantidadArticulo, setCantidadArticulo] = useState(0);

    const [articulosLista, setArticulosLista] = useState([]);

    function getFilteredByCodigoCabys(key, value) {
        const valCodigoCabys = key.codigoCabys
        const val = value


        if (valCodigoCabys.includes(val)) {
            return key
        }

        return null
    }

    const getDataMeteriasPrimas = () => {
        if (dataMateriasPrimas) {
            if (dataMateriasPrimas.obtenerTodasMateriasPrimas) {
                return dataMateriasPrimas.obtenerTodasMateriasPrimas.filter((value, index) => {
                    if (codigoArticulo.length > 0) {
                        return getFilteredByCodigoCabys(value, codigoArticulo);
                    }
                    return value
                });
            }
        }
        return []
    }

    const addArticulo = (articulo, cantidad) => {
        console.log(cantidad.value)
        setArticulosLista([{descripcion: articulo.descripcion, codigoCabys: articulo.codigoCabys, precioCompra: articulo.precioCompra, cantidadArticulo: cantidad.value}])
    }

    const dataArticulos = getDataMeteriasPrimas();

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Mantenimiento" />
                    <Row className="justify-content-between">
                        <div className="col-md-6 mb-3" >
                            <Row>
                                <label className="form-label">Cliente (F5)</label>
                            </Row>
                            <Row>
                                <div className="col-md-3 mb-3">
                                    <input readOnly={true} className="form-control" type="number" />
                                </div>
                                <div className="col-md-8 mb-3">
                                    <input readOnly={true} className="form-control" type="number" />
                                </div>
                                <div className="col-md-1 mb-3">
                                    <input readOnly={true} className="form-control" type="number" />
                                </div>
                            </Row>
                            <Row>
                                <label className="form-label">Codigo de Barras (F2)</label>
                            </Row>
                            <Row>
                                <div className="col-md-11 mb-2">
                                    <Row className="d-flex">
                                        <div className="col mb-3 pe-0">
                                            <input className="form-control" type="number" disabled placeholder="Cantidad"/>
                                        </div>
                                        <div className="col-md-1 mb-3 px-0">
                                            <input className="fs-3 form-control d-flex text-center p-0" type="text" value={"/"}/>
                                        </div>
                                        <div className="col mb-3 ps-0" onChange={(e) => { setCodigoArticulo(e.target.value) }} value={codigoArticulo}>
                                            <input className="form-control" type="number" placeholder="Código del Articulo"/>
                                        </div>
                                    </Row>
                                </div>
                                <div className="col-md-1 mb-3">
                                    {codigoArticulo.length > 0 ? 
                                        <button type="button" className="btn btn-rounded btn-info waves-effect waves-light me-3" onClick={()=>toggle()}>
                                            <i className="mdi mdi-magnify"></i>
                                        </button>
                                        :
                                        null
                                    }
                                </div>
                            </Row>
                            <Row>
                                <div className="col-md-11 mb-3">
                                    <Row>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Cantidad Lineas</label>
                                            <input className="form-control" type="number" placeholder="0"/>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Dato Referencia</label>
                                            <input className="form-control" type="text"/>
                                        </div>
                                    </Row>
                                </div>
                            </Row>
                        </div>
                        <div className="col-md-5 mb-3" >
                            <Row>
                                <div className="col-md-2 mb-3">
                                    <label className="form-label">Días Plazo</label>
                                    <input readOnly={true} className="form-control" type="number" placeholder="0"/>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Condicíon de Venta</label>
                                    <Select
                                        id="condicion_venta"
                                        value={selectedCondicionVenta}
                                        onChange={(e) => {
                                            onChangeCondicionVenta(e);
                                        }}
                                        options={condicionVentas}
                                        classNamePrefix="select2-selection"
                                        isSearchable={true}
                                        menuPosition="fixed"
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Tipo de Factura</label>
                                    <Select
                                        id="condicion_venta"
                                        value={selectedTipoFactura}
                                        onChange={(e) => {
                                            onChangeTipoFactura(e);
                                        }}
                                        options={tipoFacturas}
                                        classNamePrefix="select2-selection"
                                        isSearchable={true}
                                        menuPosition="fixed"
                                    />
                                </div>
                            </Row>
                            <Row>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Moneda de Pago</label>
                                    <Select
                                        id="condicion_venta"
                                        value={selectedTipoMoneda}
                                        onChange={(e) => {
                                            onChangeTipoMoneda(e);
                                        }}
                                        options={tipoMonedas}
                                        classNamePrefix="select2-selection"
                                        isSearchable={true}
                                        menuPosition="fixed"
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Tipo de Cambio</label>
                                    <input readOnly={true} className="form-control" type="number" />
                                </div>
                            </Row>
                            <Row>
                                <label className="form-label">Forma de Pago</label>
                            </Row>
                            <Row>
                                <div className="col-md-6 mb-3">
                                    <Row>
                                        <div className="col-md-2 mb-3">
                                            <input className="form-control" type="number"/>
                                        </div>
                                        <div className="col-md-10 mb-3">
                                        <Select
                                            id="condicion_venta"
                                            value={selectedMetodoPago}
                                            onChange={(e) => {
                                                onChangeMetodoPago(e);
                                            }}
                                            options={metodoPagos}
                                            classNamePrefix="select2-selection"
                                            isSearchable={true}
                                            menuPosition="fixed"
                                        />
                                        </div>
                                    </Row>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <Row>
                                        <div className="col-md-4 mb-3 pe-1">
                                            <button type="button" className="btn btn-primary waves-effect waves-light" >
                                                Emitir (F4)
                                            </button>
                                        </div>
                                        <div className="col-md-6 mb-3 ps-1">
                                            <button type="button" className="btn btn-warning waves-effect waves-light" >
                                                Proforma (F6)
                                            </button>
                                        </div>
                                    </Row>
                                </div>
                            </Row>
                        </div>
                    </Row>
                    <Row>
                    <div className="col-md-6 table-responsive mb-3">
                            <table className="table table-hover table-striped mb-0">
                                <thead>
                                    <tr>
                                        <th>Descripcion</th>
                                        <th>Código Cabys</th>
                                        <th>Precio Unitario</th>
                                        <th>Cantidad</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        articulosLista.map((asset, i) => (
                                            <tr key={`asset-${i}`}>
                                                <td>{asset.descripcion}</td>
                                                <td>{asset.codigoCabys}</td>
                                                <td>{asset.precioCompra}</td>
                                                <td>{asset.cantidadArticulo}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                    </div>
                    </Row>
                    <Row className="justify-content-between">
                        <div className="col-md-6 mb-3" >
                            <Row>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Subtotal</label>
                                    <input className="form-control" type="number" placeholder="0.00"/>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Descuento</label>
                                    <input className="form-control" type="number" placeholder="0.00"/>
                                </div>
                            </Row>
                            <Row>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Impuesto</label>
                                    <input className="form-control" type="number" placeholder="0.00"/>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Otros Cargos</label>
                                    <input className="form-control" type="number" placeholder="0.00"/>
                                </div>
                            </Row>
                            <Row>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">IVA Devuelto</label>
                                    <input className="form-control" type="number" placeholder="0.00"/>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Total a Pagar</label>
                                    <input className="form-control" type="number" placeholder="0.00"/>
                                </div>
                            </Row>
                            <Row>
                                <label className="form-label">Contingencia</label>
                            </Row>
                            <Row className="d-flex">
                                <div className="col mb-3 pe-0">
                                    <input className="form-control" type="text" placeholder="Documento"/>
                                </div>
                                <div className="col-md-1 mb-3 px-0">
                                    <input className="fs-3 form-control d-flex text-center p-0" type="text" value={"/"}/>
                                </div>
                                <div className="col mb-3 ps-0">
                                    <input className="form-control" type="date" placeholder="Fecha"/>
                                </div>
                            </Row>
                        </div>
                        <div className="col-md-5 mb-3" >
                            
                        </div>
                    </Row>
                </Container>
                <Modal isOpen={modal} toggle={toggle} size="lg">
                    <ModalHeader toggle={toggle}>
                        
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <div className="col-md-6 col-sm-12 mb-3">
                                <label htmlFor="tipo" className="form-label">Código del Articulo</label>
                                <Row>
                                    <div className="col-9 mb-2 d-flex">
                                        <input className="form-control" type="number" onChange={(e) => { setCodigoArticulo(e.target.value) }} value={codigoArticulo}/>
                                    </div>
                                    <div className="col-3 mb-2 d-flex">
                                        {codigoArticulo.length > 0 ? 
                                            <button type="button" className="btn btn-rounded btn-info waves-effect waves-light" onClick={()=>toggle()}>
                                                <i className="mdi mdi-magnify"></i>
                                            </button>
                                            :
                                            null
                                        }
                                    </div>
                                </Row>
                            </div>
                        </Row>
                        <div className="table-responsive mb-3">
                            <table className="table table-hover table-striped mb-0">
                                <thead>
                                    <tr>
                                        <th>Descripcion</th>
                                        <th>Código Cabys</th>
                                        <th>Precio Unitario</th>
                                        <th>Cantidad</th>
                                        <th>Selección</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        dataArticulos.map((asset, i) => (
                                            <tr key={`asset-${i}`}>
                                                <td>{asset.descripcion}</td>
                                                <td>{asset.codigoCabys}</td>
                                                <td>{asset.precioCompra}</td>
                                                <td>
                                                    <input className="form-control py-0" type="number" placeholder="Cantidad" id={`cantidad-articulo-asset-${i}`}/>
                                                </td>
                                                <td>
                                                    <button type="button" className="btn btn-outline-secondary waves-effect waves-light py-0 px-4" onClick={()=>addArticulo(asset, document.getElementById(`cantidad-articulo-asset-${i}`))}>
                                                        <i className="ri-add-line align-middle"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        </React.Fragment>
    );
};

export default InvoiceMaintenance;
