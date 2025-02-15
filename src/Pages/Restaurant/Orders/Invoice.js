import React, { useEffect, useState } from "react";
import { Container, Modal, ModalBody, ModalHeader, Row, Card, CardBody, Button, Col} from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import Select from "react-select";
import { useQuery } from "@apollo/client";
import { OBTENER_FACTURAS_PARAMETROS_BY_TYPE } from "../../../services/FacturasParametrosService";
import { OBTENER_TODAS_MATERIAS_PRIMAS } from "../../../services/MateriaPrimaService";
import { OBTENER_IMPUESTO_BY_NOMBRE } from "../../../services/ImpuestoService";
import ButtonIconTable from "../../../components/Common/ButtonIconTable";
import { OBTENER_CLIENTES } from "../../../services/ClienteService";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import { use } from "react";
import { getFechaTZ } from "../../../helpers/helpers";
import { set } from "lodash";

const Invoice = (props) => {
    document.title = "Facturación | FARO";

    const location = useLocation();
    const navigate = useNavigate();
    const { data, table, floor} = location.state || {};
    const [platillos, setPlatillos] = useState([]);
    const [selected, setSelected] = useState({}); 
    const [selectAll, setSelectAll] = useState(false);
    
    const { data: dataCurrencyTypes} = useQuery(OBTENER_FACTURAS_PARAMETROS_BY_TYPE, { variables: { type: 'currencyTypes' }, pollInterval: 1000 })
    
    const { data: dataPaymentMethods} = useQuery(OBTENER_FACTURAS_PARAMETROS_BY_TYPE, { variables: { type: 'paymentMethods' }, pollInterval: 1000 })
    
    const { data: dataSaleConditions} = useQuery(OBTENER_FACTURAS_PARAMETROS_BY_TYPE, { variables: { type: 'restaurantSaleConditions' }, pollInterval: 1000 })
    
    const { data: dataDocumentTypes} = useQuery(OBTENER_FACTURAS_PARAMETROS_BY_TYPE, { variables: { type: 'documentTypes' }, pollInterval: 1000 })

    const { loading: loadingImpuestoIVA, error: errorImpuestoIVA, data: dataImpuestoIVA, refetch: refetchImpuestoIVA } = useQuery(OBTENER_IMPUESTO_BY_NOMBRE, { variables: { nombre: 'IVA' }, fetchPolicy: 'network-only', pollInterval: 1000, notifyOnNetworkStatusChange: true });
    const { loading: loadingImpuestoServicio, error: errorImpuestoServicio, data: dataImpuestoServicio, refetch: refetchImpuestoServicio } = useQuery(OBTENER_IMPUESTO_BY_NOMBRE, { variables: { nombre: 'Servicio Restaurante' }, fetchPolicy: 'network-only', pollInterval: 1000, notifyOnNetworkStatusChange: true });

    const { data: dataAllClientes} = useQuery(OBTENER_CLIENTES, { pollInterval: 1000 })
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

    const [clienteFacturar, setClienteFacturar] = useState(null);

    const [subTotalValue, setSubTotalValue] = useState(0);
    const [descuentoTotalValue, setDescuentoTotalValue] = useState(0);
    const [impuestoValueIVA, setImpuestoValueIVA] = useState(0);
    const [impuestoServicioValue, setImpuestoServicioValue] = useState(0);
    const [impuestoIVA, setImpuestoIVA] = useState(0);
    const [impuestoServicio, setImpuestoServicio] = useState(0);
    const [totalPagarValue, setTotalPagarValue] = useState(0);
    const [clientesFiltrados, setClientesFiltrados] = useState([]);
    const [nombreFacturacion, setNombreFacturacion] = useState("");
    const [servicesModal, setServicesModal] = useState(false);

    useEffect(() => {
        if (dataImpuestoIVA?.obtenerImpuestoByNombre?.valor !== undefined) {
            setImpuestoIVA(() => dataImpuestoIVA.obtenerImpuestoByNombre.valor);
        }
    }, [dataImpuestoIVA]);
    
    useEffect(() => {
        if (dataImpuestoServicio?.obtenerImpuestoByNombre?.valor !== undefined) {
            setImpuestoServicio(dataImpuestoServicio.obtenerImpuestoByNombre.valor);
        }
    }, [dataImpuestoServicio]);
    

    useEffect(() => {
        if (data) {
            if (data?.subcuentas[0]?.platillos?.length > 0) {
                const filteredPlatillos = data.subcuentas[0].platillos.filter(platillo => platillo.estado !== 'Pendiente');
                setPlatillos(filteredPlatillos);
            }
        }
    }, [data]);

    useEffect(() => {
        const initialState = platillos.reduce((acc, platillo) => {
            acc[platillo._id] = platillo.estado === 'Pagado'; 
            document.getElementById(`checkbox-${platillo._id}`).checked = platillo.estado === 'Pagado';
            return acc;
        }, {});
    
        setSelected(initialState);
    }, [platillos]); 
    
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

                fetch("http://18.223.1.94/send/document", requestOptions)
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
    const handlePrepareSubcuenta = (comanda) => {
        console.log("seleccionar");
    };
    function formatObservationsText(input) {
        if(!input) return '';
        const lines = input.split('\n');

        const formattedLines = lines.map(line => {
            const trimmedLine = line.trim();
            if (trimmedLine && !trimmedLine.endsWith('.')) {
                return ' ' + trimmedLine + '.';
            }
            return trimmedLine;
        });

        return formattedLines.join('\n');
    }

    const calculateSubTotal = () => {
        let subTotal = 0;
        platillos.forEach((platillo) => {
            if (selected[platillo._id] && platillo.estado !== 'Pagado') { 
                subTotal += platillo.precio;
            }
        });
        return subTotal;
    };

    const calculateTotal = () => {
        let total = 0;
        total = (subTotalValue + (subTotalValue*(impuestoIVA/100)) + (subTotalValue*(impuestoServicio/100)))-((subTotalValue/100)*descuentoTotalValue);
        return total;
    };

    const handleCheckboxChange = (id) => {
        setSelected((prevState) => {
            const newState = { ...prevState, [id]: !prevState[id] };
            // Verificar si todos los checkboxes están seleccionados
            const allSelected =
                platillos.length > 0 &&
                platillos.every((p) => newState[p._id]);

            setSelectAll(allSelected);
            return newState;
        });
    };
    
    const toggleAllCheckboxes = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);
        platillos.forEach((platillo) => {
            if (platillo.estado !== 'Pagado') {
                const checkbox = document.getElementById(`checkbox-${platillo._id}`);
                if (checkbox) {
                    checkbox.checked = newSelectAll;
                }
            }
        });

        const newSelectedState = platillos.reduce((acc, platillo) => {
            if (platillo.estado !== 'Pagado') {
                acc[platillo._id] = newSelectAll;
            } 
            return acc;
        }, {});

        setSelected(newSelectedState);
    };


    useEffect(() => {
        setSubTotalValue(calculateSubTotal());
    }, [selected]);
    
    useEffect(() => {
        setTotalPagarValue(calculateTotal());
        setImpuestoValueIVA(subTotalValue*(impuestoIVA/100));
        setImpuestoServicioValue(subTotalValue*(impuestoServicio/100));
    }, [subTotalValue, impuestoIVA, impuestoServicio, descuentoTotalValue, impuestoValueIVA, impuestoServicioValue]);


    const handleInputChangeCliente = (e) => {
        const valor = e.target.value;
        setClienteCedula(valor);
        if (valor.trim() === "") {
            setClienteFacturar(null);
            setNombreFacturacion("");
        }

        if (valor.length > 0) {
            const filtrados = dataAllClientes.obtenerClientes.filter((cliente) =>
                cliente.codigo.includes(valor) || cliente.nombre.toLowerCase().includes(valor.toLowerCase())
            );
            setClientesFiltrados(filtrados);
            setModalClientes(filtrados.length > 0);
        } else {
            setModalClientes(false);
        }
    };
    const seleccionarCliente = (cliente) => {
        setClienteCedula(`${cliente.codigo} - ${cliente.nombre}`);
        setNombreFacturacion(cliente.nombreFacturacion);
        setClienteFacturar(cliente);
        setModalClientes(false);
        //onClienteSeleccionado(cliente); // Callback para manejar el cliente seleccionado
    };
    
    const getOrders = () => {
        //console.log(table)
        if (!platillos.length) {
            return <div className="text-center"><h5>No hay órdenes pendientes.</h5></div>;
        }

        return (
            <div>
                {platillos.map((platillo) => (
                    <Card key={platillo._id} className="mb-2 card-pending-orders" style={{ margin: "5px", opacity: platillo.estado === "Pagado" ? 0.6 : 1, backgroundColor: platillo.estado === "Pagado" ? "#f0f0f0" : "white"}}>
                        <CardBody>
                            <div className="mb-1">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="col-md-auto">
                                        <h5>{platillo.nombre}</h5>
                                    </div>
                                    <div className="col-md-auto form-check">
                                        <input
                                            className="form-check-input fs-2"
                                            type="checkbox"
                                            id={`checkbox-${platillo?._id}`}
                                            onChange={() => handleCheckboxChange(platillo._id)}
                                            disabled={platillo.estado === 'Pagado'} 
                                        />
                                    </div>
                                </div>
                                <Row className="align-items-center">
                                    <div className="col-md-9">
                                        <h6 className="mb-0">{formatObservationsText(platillo.observaciones)}</h6>
                                    </div>
                                </Row>
                                <hr />
                                <Row className="d-flex justify-content-between align-items-center">
                                    <div className="col-md-auto">
                                        <h6 style={{ color: platillo.estado === "Pagado" ? "#020aaf" : "black" }}>{"Estado: " + platillo.estado}</h6>
                                    </div>
                                    <div className="col-md-auto text-end">
                                        <h5>₡{platillo.precio}</h5>
                                    </div>
                                </Row>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
        );
    };

    const openServicesModal = () => {
        if (codigoArticulo.length > 0) {
           setServicesModal(true);
        }
    };



    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                <Breadcrumbs title='Facturación' breadcrumbItem='Comandas' breadcrumbItemUrl='/restaurant/orders/' />
                    <Row className="justify-content-between">
                        <div className="container-fluid ms-2">
                            <div className="row">
                                <div className="col-12 col-md-11">
                                    <Row>
                                        <h4 className="form-label">Datos del Cliente</h4>
                                    </Row> 

                                    <Row className="align-items-center position-relative">
                                        <div className="col-6 col-md-5 position-relative">
                                            <label className="form-label">Cédula - Nombre</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                placeholder="Cliente Cédula o Nombre"
                                                value={clienteCedula}
                                                onChange={handleInputChangeCliente}
                                            />
                                            {modalClientes && (
                                                <div 
                                                    className="position-absolute bg-white border rounded shadow w-100" 
                                                    style={{ top: "100%", left: 0, zIndex: 1000, maxHeight: "200px", overflowY: "auto" }}
                                                >
                                                    {clientesFiltrados.length > 0 ? (
                                                        clientesFiltrados.map((cliente) => (
                                                            <div key={cliente.codigo} className="p-2 border-bottom cursor-pointer" onClick={() => seleccionarCliente(cliente)}>
                                                                {cliente.codigo} - {cliente.nombre}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="p-2 text-muted">No se encontraron clientes</div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="col-4 col-md-4">
                                            <label className="form-label">Nombre de Facturación</label>
                                            <input 
                                                className="form-control" 
                                                type="text" 
                                                placeholder="Nombre de Facturación" 
                                                value={nombreFacturacion}   
                                                onChange={(e) => setNombreFacturacion(e.target.value)} 
                                                disabled={clienteFacturar !== null} 
                                            />
                                        </div>

                                        <div className="col-3 col-md-3">
                                            <label className="form-label">Estado de Crédito</label>
                                            <input 
                                                className="form-control" 
                                                type="text" 
                                                placeholder="Crédito Disponible" 
                                                value={clienteFacturar?.estadoCredito || ""} 
                                                disabled 
                                            />
                                        </div>
                                    </Row>

                                    <h4 className="form-label mt-3">Incluir Servicios</h4>
                                    <Row>
                                        <label className="form-label mt-1">Número de habitación</label>
                                    </Row>

                                    <Row className="align-items-center">
                                        <div className="col-9 col-md-10">
                                            <input 
                                                className="form-control" 
                                                type="text" 
                                                placeholder="Número de habitación" 
                                                onChange={(e) => setCodigoArticulo(e.target.value)} 
                                                value={codigoArticulo} 
                                            />
                                        </div>
                                        <div className="col-3 col-md-2">
                                            <button 
                                                type="button" 
                                                className="btn btn-info btn-rounded waves-effect waves-light" 
                                                onClick={openServicesModal}
                                            >
                                                <i className="mdi mdi-magnify"></i>
                                            </button>
                                        </div>
                                        {servicesModal && (
                                            <div className="modal fade" id="servicesModal" tabIndex="-1" aria-labelledby="modalLabel" aria-hidden="true">
                                                <div className="modal-dialog">
                                                    <div className="modal-content">
                                                        <div className="modal-header">
                                                            <h5 className="modal-title" id="modalLabel">Modal de Servicios</h5>
                                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                        </div>
                                                        <div className="modal-body">
                                                            Contenido del modal...
                                                        </div>
                                                        <div className="modal-footer">
                                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                                            <button type="button" className="btn btn-primary">Aceptar</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Row>

                                    <Row className="mt-3">
                                        <div className="col-12 col-md-3 mb-3">
                                            <label className="form-label">Condición de Venta</label>
                                            <Select 
                                                id="condicion_venta" 
                                                value={selectedCondicionVenta} 
                                                onChange={onChangeCondicionVenta} 
                                                options={condicionVentas} 
                                                classNamePrefix="select2-selection" 
                                                isSearchable={true} 
                                                menuPosition="fixed" 
                                            />
                                        </div>
                                        <div className="col-12 col-md-3 mb-3">
                                            <label className="form-label">Forma de Pago</label>
                                            <Select 
                                                id="metodo_pago" 
                                                value={selectedMetodoPago} 
                                                onChange={onChangeMetodoPago} 
                                                options={metodoPagos} 
                                                classNamePrefix="select2-selection" 
                                                isSearchable={true} 
                                                menuPosition="fixed" 
                                            />
                                        </div>
                                        <div className="col-12 col-md-3 mb-3">
                                            <label className="form-label">Moneda de Pago</label>
                                            <Select 
                                                id="tipo_moneda" 
                                                value={selectedTipoMoneda} 
                                                onChange={onChangeTipoMoneda} 
                                                options={tipoMonedas} 
                                                classNamePrefix="select2-selection" 
                                                isSearchable={true} 
                                                menuPosition="fixed" 
                                            />
                                        </div>
                                        <div className="col-12 col-md-3 mb-3">
                                            <label className="form-label">Tipo de Cambio</label>
                                            <input className="form-control" type="number" readOnly />
                                        </div>
                                    </Row>
                                </div>
                            </div>
                        </div>

                        <Row className="justify-content-center mt-4">
                            <div style={{border: '1px solid #ced4da', borderRadius: '0.25rem', height: '500px', width:'850px', backgroundColor: '#ffffff',  margin: 'auto'}}>
                                <Row>
                                    <div className="text-center mt-3">
                                        <h4><strong>{table.isChair === true ? "Silla "+ table?.name : table?.name}</strong></h4>
                                    </div>
                                    <div className="ms-5 mt-2">
                                        <h6><strong>Piso:</strong> {floor?.value.nombre}</h6>
                                        <h6><strong>Fecha:</strong> {getFechaTZ("fechaHora", data.fecha)}</h6>
                                    </div>
                                </Row>
                                <Row className="d-flex align-items-center justify-content-between mt-2 mb-2">
                                    <div className="col-md-auto text-center mb-1 mt-2 ms-5">
                                        <h5>Subcuenta</h5>
                                    </div>
                                    <div className="col-md-auto d-flex justify-content-end">
                                        <Button color="primary" className="mb-1 me-3" onClick={toggleAllCheckboxes}>
                                            {selectAll ? "Deseleccionar Todo" : "Seleccionar Todo"}
                                        </Button>
                                    </div>
                                </Row>
                                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    {getOrders()}
                                </div>
                            </div>
                        </Row>
                        <div className="mt-4 mb-5">
                            <Row className="flex-column">
                                <div className="col-12 mb-3">
                                    <div className="row row-cols-1 row-cols-md-3 g-3">
                                        <div className="col">
                                            <label className="form-label">Subtotal</label>
                                            <div className="input-group">
                                                <span className="input-group-text">$</span>
                                                <input className="form-control disabled-input fs-5 fw-bold" type="number" placeholder="0.00" value={subTotalValue} disabled />
                                            </div>
                                        </div>
                                        <div className="col">
                                            <label className="form-label">IVA</label>
                                            <div className="input-group">
                                                <span className="input-group-text">$</span>
                                                <input className="form-control disabled-input fs-5 fw-bold" type="number" placeholder="0.00" value={impuestoValueIVA} disabled />
                                            </div>
                                        </div>
                                        <div className="col d-flex align-items-center">
                                            <input className="form-check-input fs-4 me-2" type="checkbox" />
                                            <label className="form-check-label">Generar Factura Electrónica</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 mb-3">
                                    <div className="row row-cols-1 row-cols-md-3 g-3">
                                        <div className="col">
                                            <label className="form-label">Descuento</label>
                                            <div className="input-group">
                                                <span className="input-group-text">%</span>
                                                <input className="form-control fs-5 fw-bold" type="number" placeholder="0" value={descuentoTotalValue} onChange={(e) => setDescuentoTotalValue(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="col">
                                            <label className="form-label">Impuesto por servicio</label>
                                            <div className="input-group">
                                                <span className="input-group-text">$</span>
                                                <input className="form-control fs-5 fw-bold" type="number" placeholder="0.00" value={impuestoServicioValue ?? 0} disabled />
                                            </div>
                                        </div>
                                        <div className="col">
                                            <label className="form-label">Total a Pagar</label>
                                            <div className="input-group">
                                                <span className="input-group-text">$</span>
                                                <input className="form-control disabled-input fs-5 fw-bold" type="number" placeholder="0.00" value={totalPagarValue} disabled />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 mb-3 mt-4 d-flex justify-content-center">
                                    <button type="button" className="btn btn-primary waves-effect waves-light w-50" onClick={()=>toEmit()}>
                                        Emitir
                                    </button>
                                </div>
                            </Row>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default Invoice;