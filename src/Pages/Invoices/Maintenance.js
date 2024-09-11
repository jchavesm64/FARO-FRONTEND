import React, { useEffect, useState } from "react";
import { Container, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import Select from "react-select";
import { useQuery } from "@apollo/client";
import { OBTENER_FACTURAS_PARAMETROS_BY_TYPE } from "../../services/FacturasParametrosService";
import { OBTENER_TODAS_MATERIAS_PRIMAS } from "../../services/MateriaPrimaService";
import ButtonIconTable from "../../components/Common/ButtonIconTable";
import { OBTENER_CLIENTES } from "../../services/ClienteService";
import Swal from "sweetalert2";



const InvoiceMaintenance = ({ ...props }) => {

    document.title = "Mantenimiento | FARO";

    console.log("START")

    const { data: dataCurrencyTypes} = useQuery(OBTENER_FACTURAS_PARAMETROS_BY_TYPE, { variables: { type: 'currencyTypes' }, pollInterval: 1000 })

    const { data: dataPaymentMethods} = useQuery(OBTENER_FACTURAS_PARAMETROS_BY_TYPE, { variables: { type: 'paymentMethods' }, pollInterval: 1000 })

    const { data: dataSaleConditions} = useQuery(OBTENER_FACTURAS_PARAMETROS_BY_TYPE, { variables: { type: 'saleConditions' }, pollInterval: 1000 })

    const { data: dataDocumentTypes} = useQuery(OBTENER_FACTURAS_PARAMETROS_BY_TYPE, { variables: { type: 'documentTypes' }, pollInterval: 1000 })

    const { data: dataMateriasPrimas} = useQuery(OBTENER_TODAS_MATERIAS_PRIMAS, { pollInterval: 1000 })

    const { data: dataAllClientes} = useQuery(OBTENER_CLIENTES, { pollInterval: 1000 })

    console.log(dataAllClientes)

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

            console.log(options)

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

    const [selectedClaveFactura, setSelectedClaveFactura] = useState(null);

    const [tipoFacturas, setTipoFacturas] = useState([]);

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    const [modalClientes, setModalClientes] = useState(false);
    const toggleClientes = () => setModalClientes(!modalClientes);

    const [codigoArticulo, setCodigoArticulo] = useState("");

    const [clienteCedula, setClienteCedula] = useState("");

    const [articulosLista, setArticulosLista] = useState([]);

    const [clienteFacturar, setClienteFacturar] = useState(false);


    function getFilteredByClienteCedula(key, value) {
        const valCedula = key
        const val = value


        if (valCedula.codigo.includes(val) || valCedula.nombre.toLowerCase().includes(val.toLowerCase())) {
            return key
        }

        return null
    }

    const getDataClientes = () => {
        if (dataAllClientes) {
            if (dataAllClientes.obtenerClientes) {
                return dataAllClientes.obtenerClientes.filter((value, index) => {
                    if (clienteCedula.length > 0) {
                        return getFilteredByClienteCedula(value, clienteCedula);
                    }
                    return value
                });
            }
        }
        return []
    }

    const dataClientes = getDataClientes();

    function getFilteredByCodigoCabys(key, value) {
        const valCodigoCabys = key
        const val = value


        if (valCodigoCabys.codigoCabys.includes(val) || valCodigoCabys.descripcion.toLowerCase().includes(val.toLowerCase())) {
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

    const dataArticulos = getDataMeteriasPrimas();

    const agregarArticulo = (articulo, cantidad) => {
        let newA = { ...articulo }; 
        newA.cantidadArticulo = cantidad.value;
        setArticulosLista(prevArticulosLista => {
            let findVali = false;
            prevArticulosLista.find((value, index) => {
                console.log(value.codigoCabys)
                if (value.codigoCabys === articulo.codigoCabys){
                    value.cantidadArticulo = parseInt(value.cantidadArticulo) + parseInt(cantidad.value);
                    findVali = true;
                    return value; 
                }

                return null; 
            });

            if (findVali){
                return [...prevArticulosLista]
            }else{
                return [...prevArticulosLista, newA]
            }

        });
    }

    const eliminarLinea = (index) => {
        setArticulosLista(articulosLista.filter((l, i) => i !== index))
    }

    useEffect(() => {
        dataArticulos.forEach((_, i) => {
            const inputElement = document.getElementById(`cantidad-articulo-asset-${i}`);
            if (inputElement) {
                inputElement.value = 0;
            }
        });
    }, [dataArticulos]);

    useEffect(() => {
        var subTotal = 0;
        var impuestoTotal = 0;
        articulosLista.forEach((item, i) => {
            subTotal += item.cantidadArticulo*item.precioCompra
            if (item.impuestos.length > 0) {
                impuestoTotal += (item.cantidadArticulo*item.precioCompra) * (item.impuestos[0].impuesto / 100)

            }
        })

        setSubTotalValue(subTotal)
        setImpuestoTotalValue(impuestoTotal)
        setDescuentoTotalValue(0)
        setTotalPagarValue(subTotal + impuestoTotal)

    }, [articulosLista]);


    useEffect(() => {
        if (props.data){
            if (dataAllClientes && dataDocumentTypes && dataSaleConditions && dataPaymentMethods && dataCurrencyTypes && clienteFacturar === false && selectedTipoFactura === null && selectedCondicionVenta === null && selectedMetodoPago === null && selectedTipoMoneda === null){
                if (props.data.articulosLista){
                    console.log(props.data.articulosLista)
                    setArticulosLista(props.data.articulosLista)
                }
                
                if (props.data.clave){
                    setSelectedClaveFactura(props.data.clave)
                }
                
                if (props.data.clienteFacturar){
                    dataAllClientes.obtenerClientes.map((value, index) => {
                        if (value.codigo === props.data.clienteFacturar){
                            setClienteFacturar(value)
                        }
        
                        return null;
                    });
                }
        
                if (props.data.selectedTipoFactura){
                    dataDocumentTypes.obtenerFacturasParametrosByType.map((value, index) => {
                        if (value.id === props.data.selectedTipoFactura){
                            setSelectedTipoFactura({
                                value: value.id,
                                label: value.value
                            })
                        }
        
                        return null;
                    });
                }
        
                if (props.data.selectedCondicionVenta){
                    dataSaleConditions.obtenerFacturasParametrosByType.map((value, index) => {
                        if (value.id === props.data.selectedCondicionVenta){
                            setSelectedCondicionVenta({
                                value: value.id,
                                label: value.value
                            })
                        }
        
                        return null;
                    });
                }
        
                if (props.data.selectedMetodoPago){
                    dataPaymentMethods.obtenerFacturasParametrosByType.map((value, index) => {
                        if (value.id === props.data.selectedMetodoPago){
                            setSelectedMetodoPago({
                                value: value.id,
                                label: value.value
                            })
                        }
        
                        return null;
                    });
                }
        
                if (props.data.selectedTipoMoneda){
                    dataCurrencyTypes.obtenerFacturasParametrosByType.map((value, index) => {
                        if (value.id === props.data.selectedTipoMoneda){
                            setSelectedTipoMoneda({
                                value: value.id,
                                label: value.value
                            })
                        }
        
                        return null;
                    });
                }
            }
        }
    
        
    }, [props, dataAllClientes, dataDocumentTypes, dataSaleConditions, dataPaymentMethods, dataCurrencyTypes, clienteFacturar, selectedTipoFactura, selectedCondicionVenta, selectedMetodoPago, selectedTipoMoneda]);

    
    const toEmit = () => {
        Swal.fire({
          title: "Emitir factura",
          text: `¿Está seguro de emitir esta factura?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#0BB197",
          cancelButtonColor: "#FF3D60",
          cancelButtonText: 'Cancelar',
          confirmButtonText: "Sí, ¡Emitir!"
        }).then(async (result) => {
          if (result.isConfirmed) {
            if (clienteFacturar && selectedTipoFactura && selectedCondicionVenta && selectedMetodoPago && selectedTipoMoneda){
                console.log("emitida")
                const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                myHeaders.append("Cookie", "session=qifO9RMl_v6U89RqK1yBNeYrK40-gYum763TWWpGmus");

                const raw = JSON.stringify({
                    "receiver_id_num": clienteFacturar.codigo,
                    "document_type": selectedTipoFactura.value,
                    "sale_condition": selectedCondicionVenta.value,
                    "payment_method": selectedMetodoPago.value,
                    "currency_type": selectedTipoMoneda.value,
                    "items": articulosLista,
                    "info_referency": selectedClaveFactura ? {
                        "TipoDoc": "07",
                        "Numero": selectedClaveFactura,
                        "FechaEmision": props.data ? props.data.fecha : null,
                        "Codigo": "01",
                        "Razon": props.data ? props.data.razon : null
                    } : null
                });

                const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
                };

                fetch("http://localhost/send/document", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    console.log(result)
                    if (result.result){
                        Swal.fire({
                            title: "Factura Emitida Correctamente",
                            text: `Su factura ha sido emitida exitosamente.`,
                            icon: 'Success',
                            showConfirmButton: true,
                            confirmButtonColor: "#0BB197"
                        })
                    }else{
                        Swal.fire({
                            title: "Error al Emitir la Factura",
                            text: `
                                Ha ocurrido un error al emitir su factura. Por favor, intente nuevamente más tarde.\n
                                Si el problema persiste, contacte a nuestro soporte técnico.`,
                            icon: 'Error',
                            showConfirmButton: true,
                            confirmButtonColor: "#0BB197"
                        })
                    }
                })
                .catch((error) => console.error(error));
            }else{
                Swal.fire({
                    title: "Emición de factura",
                    text: `Comprueba que todos los datos estén correctamente ingresados`,
                    icon: "Info",
                    showCancelButton: true,
                    confirmButtonColor: "#0BB197",
                    cancelButtonColor: "#FF3D60",
                  })
            }

          }
        });
      }


    const [subTotalValue, setSubTotalValue] = useState(0);
    const [descuentoTotalValue, setDescuentoTotalValue] = useState(0);
    const [impuestoTotalValue, setImpuestoTotalValue] = useState(0);
    // const [otrosCargosTotalValue, setOtrosCargosTotalValue] = useState(0);
    // const [IVADevueltoValue, setIVADevueltoValue] = useState(0);
    const [totalPagarValue, setTotalPagarValue] = useState(0);

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Mantenimiento" />
                    <Row className="justify-content-between">
                        <div className="col-md-5 mb-3" >
                            {selectedClaveFactura ?
                                <>
                                    <Row>
                                        <label className="form-label">Clave Factura</label>
                                    </Row>
                                    <Row>
                                        <div className="col-md-12 mb-3">
                                            <input readOnly={true} className="form-control" type="text" value={selectedClaveFactura}/>
                                        </div>
                                    </Row>
                                </>
                                :
                                null
                            }
                            <Row>
                                <label className="form-label">Cliente (F5)</label>
                            </Row>
                            <Row>
                                {props.data && props.data.clienteFacturar ?
                                    <>
                                        <div className="col-md-12 mb-3">
                                            <input readOnly={true} className="form-control" type="text" value={clienteFacturar ? `${clienteFacturar.nombre} - ${clienteFacturar.codigo}` : "..."}/>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div className="col-md-4 mb-3">
                                            <input readOnly={true} className="form-control" type="text" value={clienteFacturar ? `${clienteFacturar.nombre} - ${clienteFacturar.codigo}` : "..."}/>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <Row className="d-flex">
                                                <div className="col-12 mb-3" onChange={(e) => { setClienteCedula(e.target.value) }} value={clienteCedula}>
                                                    <input className="form-control" type="text" placeholder="Cliente Cédula o Nombre"/>
                                                </div>
                                            </Row>
                                        </div>
                                        <div className="col-md-2 mb-3">
                                            <button type="button" className="btn btn-rounded btn-info waves-effect waves-light me-3" onClick={()=>toggleClientes()} disabled={clienteCedula.length > 0 ? false : true}>
                                                <i className="mdi mdi-magnify"></i>
                                            </button>
                                        </div>
                                    </>
                                }
                            </Row>
                            <Row>
                                <label className="form-label">Codigo de Barras (F2)</label>
                            </Row>
                            <Row>
                                <div className="col-md-10 mb-2">
                                    <Row className="d-flex">
                                        <div className="col-12 mb-3" onChange={(e) => { setCodigoArticulo(e.target.value) }} value={codigoArticulo}>
                                            <input className="form-control" type="text" placeholder="Código del Articulo o Nombre"/>
                                        </div>
                                    </Row>
                                </div>
                                <div className="col-md-2 mb-3">
                                    <button type="button" className="btn btn-rounded btn-info waves-effect waves-light me-3" onClick={()=>toggle()} disabled={codigoArticulo.length > 0 ? false : true}>
                                        <i className="mdi mdi-magnify"></i>
                                    </button>
                                </div>
                            </Row>
                            {/* <Row>
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
                            </Row> */}
                            <Row>
                                {/* <div className="col-md-2 mb-3">
                                    <label className="form-label">Días Plazo</label>
                                    <input readOnly={true} className="form-control" type="number" placeholder="0"/>
                                </div> */}
                                <div className="col-md-6 mb-3">
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
                                        isDisabled={props.data && props.data.selectedTipoFactura ? true : false}
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
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Forma de Pago</label>
                                    {/* <div className="col-md-2 mb-3">
                                        <input className="form-control" type="number"/>
                                    </div> */}
                                    <div className="col-md-12 mb-3">
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
                                </div>
                            </Row>
                            <Row>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Subtotal</label>
                                    <input className="form-control" type="number" placeholder="0.00" value={subTotalValue}/>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Descuento</label>
                                    <input className="form-control" type="number" placeholder="0.00" value={descuentoTotalValue}/>
                                </div>
                            </Row>
                            <Row>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Impuesto</label>
                                    <input className="form-control" type="number" placeholder="0.00" value={impuestoTotalValue}/>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Total a Pagar</label>
                                    <input className="form-control" type="number" placeholder="0.00" value={totalPagarValue}/>
                                </div>
                                {/* <div className="col-md-6 mb-3">
                                    <label className="form-label">Otros Cargos</label>
                                    <input className="form-control" type="number" placeholder="0.00" value={otrosCargosTotalValue}/>
                                </div> */}
                            </Row>
                            <Row>
                                <div className="col-md-12">
                                    <button type="button" className="btn btn-primary waves-effect waves-light w-100" onClick={()=>toEmit()}>
                                        Emitir (F4)
                                    </button>
                                </div>
                                {/* <div className="col-md-6 mb-3 ps-1">
                                    <button type="button" className="btn btn-warning waves-effect waves-light" >
                                        Proforma (F6)
                                    </button>
                                </div> */}
                            </Row>
                        </div>
                        <div className="col-md-7 mb-3" style={{border: '1px solid #ced4da', borderRadius: '0.25rem', height: '660px', overflowY: 'scroll'}}>
                            <div className="col-md-12 table-responsive mb-3">
                                    <table className="table table-hover table-striped mb-0">
                                        <thead>
                                            <tr>
                                                <th style={{width: '200px'}}>Descripcion</th>
                                                <th>Código Cabys</th>
                                                <th>Precio Unitario</th>
                                                <th>Cantidad</th>
                                                <th>Subtotal</th>
                                                <th>Impuestos</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody >
                                        {articulosLista.length > 0 ?
                                            <>
                                            {
                                                articulosLista.map((asset, i) => (
                                                    <tr key={`asset-${i}`}>
                                                        <td>{asset.descripcion}</td>
                                                        <td>{asset.codigoCabys}</td>
                                                        <td>{asset.precioCompra}</td>
                                                        <td>{asset.cantidadArticulo}</td>
                                                        <td>{asset.cantidadArticulo*asset.precioCompra}</td>
                                                        <td>
                                                            %13
                                                        </td>
                                                        <td>
                                                            <ButtonIconTable icon='mdi mdi-delete ' color='danger' onClick={() => { eliminarLinea(i) }} />
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                            </>
                                            :
                                            <tr key={`asset-empty`}>
                                                <td colSpan={7} className="text-center" style={{height: '600px', alignContent: 'center'}}>{"No hay articulos agregados!"}</td>
                                            </tr>
                                        }
                                        </tbody>
                                    </table>
                            </div>
                        </div>
                    </Row>
                </Container>
                <Modal isOpen={modalClientes} toggle={toggleClientes} size="lg">
                    <ModalHeader toggle={toggleClientes}>
                        
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <div className="col-md-6 col-sm-12 mb-3">
                                <label htmlFor="tipo" className="form-label">Cliente</label>
                                <Row>
                                    <div className="col-9 mb-2 d-flex">
                                        <input className="form-control" type="number" onChange={(e) => { setClienteCedula(e.target.value) }} value={clienteCedula}/>
                                    </div>
                                    <div className="col-3 mb-2 d-flex">
                                        {clienteCedula.length > 0 ? 
                                            <button type="button" className="btn btn-rounded btn-info waves-effect waves-light" onClick={()=>toggleClientes()}>
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
                                            <th>Nombre</th>
                                            <th>Código</th>
                                            <th>Correo</th>
                                            <th>Teléfono</th>
                                            <th>Selección</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            dataClientes.map((asset, i) => (
                                                <tr key={`asset-${i}`}>
                                                    <td>{asset.nombre}</td>
                                                    <td>{asset.codigo}</td>
                                                    <td>
                                                        {asset.correos.length > 0 ? 
                                                            <>
                                                                {asset.correos[0].email}
                                                            </>
                                                            :
                                                            <>
                                                                Sin correo
                                                            </>
                                                        }
                                                    </td>
                                                    <td>
                                                        {asset.telefonos.length > 0 ? 
                                                            <>
                                                                {asset.telefonos[0].telefono}
                                                            </>
                                                            :
                                                            <>
                                                                Sin teléfono
                                                            </>
                                                        }
                                                    </td>
                                                    <td>
                                                    <button type="button" className="btn btn-outline-secondary waves-effect waves-light py-0 px-4" onClick={()=>setClienteFacturar(asset)}>
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
                                                    <button type="button" className="btn btn-outline-secondary waves-effect waves-light py-0 px-4" onClick={()=>agregarArticulo(asset, document.getElementById(`cantidad-articulo-asset-${i}`))}>
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
