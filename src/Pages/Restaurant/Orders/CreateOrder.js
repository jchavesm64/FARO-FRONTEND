import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, Container, Row, Modal, ModalHeader, ModalBody } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { Link, useLocation } from 'react-router-dom';
import SpanSubtitleForm from "../../../components/Forms/SpanSubtitleForm";
import { OBTENER_MENUS } from "../../../services/MenuService";
import { useMutation, useQuery } from "@apollo/client";
import Select from "react-select";
import { infoAlert } from "../../../helpers/alert";
import { OBTENER_COMANDA_POR_MESA, SAVE_COMANDA, UPDATE_COMANDA, DELETE_COMANDA} from "../../../services/ComandaService";
import { DELETE_SUBCUENTA, DELETE_PLATILLO } from "../../../services/SubcuentaService";
import { SAVE_SUBCUENTA } from "../../../services/SubcuentaService";
import { UPDATE_MESA } from "../../../services/MesaService";
import Swal from "sweetalert2";

const CreateOrder = ({ ...props }) => {
    document.title = "Crear Comanda | FARO";

    const location = useLocation();
    const navigate = useNavigate();
    const { table } = location.state || {};

    const { loading: load_menu, error: error_menu, data: data_menu } = useQuery(OBTENER_MENUS, { pollInterval: 1000 })
    const { data: data_order, refetch: refetchOrder } = useQuery(OBTENER_COMANDA_POR_MESA, {
        variables: { id: table?.id },
        skip: !table?.id,
        fetchPolicy: 'network-only'
    });

    const [insertarComanda] = useMutation(SAVE_COMANDA);
    const [insertarSubcuenta] = useMutation(SAVE_SUBCUENTA);
    const [actualizarMesa] = useMutation(UPDATE_MESA);
    const [actualizarComanda] = useMutation(UPDATE_COMANDA);
    const [deletePlatillo] = useMutation(DELETE_PLATILLO);
    

    const [category, setCategory] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [filter, setFilter] = useState('');
    const [observations, setObservations] = useState({});
    const [modal, setModal] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [orderId, setOrderId] = useState(null);
    const [disableSave, setDisableSave] = useState(true);
    const toggle = () => setModal(!modal);
    const itemCountRef = useRef(0);

    const getData = () => {
        if (data_menu) {
            if (data_menu.obtenerMenus) {
                return data_menu.obtenerMenus.filter((value, index) => {
                    if (filter !== "") {
                        return getFilteredByKey(value, filter);
                    }
                    return value
                });
            }
        }
        return []
    }

    const menuData = getData();

    const [menuType, setMenuType] = useState(null);

    const getMenuTypes = () => {
        let types = [];
        for (const item of menuData) {
            for (const type of item.tipoMenu) {
                if (!types.some(t => t.value === type.id)) {
                    types.push({ value: type.id, label: type.nombre });
                }
            }
        }
        return types;
    }

    useEffect(() => {
        if (table?.id) {
            refetchOrder();
        }
    }, [table, refetchOrder]);

    useEffect(() => {
        const menuTypes = getMenuTypes();
        if (menuTypes.length > 0) {
            setMenuType(menuTypes[0]);
        }
    }, [data_menu]);

    useEffect(() => {
        if (table) {
            const initialObservations = {};
            const items = table.orders.filter(order => order.estado !== 'Cancelado' && order.estado !== 'Entregado').map(order => {
                const count = itemCountRef.current++; 
            
                initialObservations[count] = order.observaciones || ""; 
    
                return {
                    _id: order._id,
                    id: order.id,
                    count: count, 
                    name: order.nombre,
                    price: order.precio,
                    quantity: order.cantidad,
                    observations: order.observaciones || "",
                    subBill: 1
                };
            });

            setObservations(initialObservations);
            setSelectedItems(items);
        }
    }, [table]);

    useEffect(() => {
        if (data_order?.obtenerComandaPorMesa) {
            setOrderId(data_order.obtenerComandaPorMesa.id);
            //setObservations(data_order.obtenerComandaPorMesa.observaciones);
        }
    }, [data_order]);  

    const getFilteredMenuData = () => {
        if (!menuType) return [];
        return menuData.filter(item => item.tipoMenu.some(type => type.id === menuType.value));
    }

    const filteredMenuData = getFilteredMenuData();

    const getUniqueCategories = () => {
        const categories = new Set();
        filteredMenuData.forEach(item => {
            categories.add(item.tipoPlatillo.nombre);
        });
        return Array.from(categories);
    }

    const getCategories = () => {
        const uniqueCategories = getUniqueCategories();
        return uniqueCategories.map((categoryName, i) => (
            <div key={`menu-category-${categoryName}-${i}`} className="mb-3">
                <button className={`btn btn-cyan-dark card-menu-category ${category === categoryName ? 'active' : ''}`}
                    onClick={() => { setCategory(categoryName) }}>
                    {categoryName}
                </button>
            </div>
        ));
    }

    const getItems = () => {
        const items = filteredMenuData.map((menuItem, i) => {
            if (menuItem.tipoPlatillo.nombre === category) {
                return (
                    <React.Fragment key={`menu-item-${menuItem.id}-${i}`} >
                        <Row>
                            <div className="col-md-12 h5">
                                {menuItem.nombre}
                            </div>
                        </Row>
                        <Row>
                            <div className="col-md-12 d-flex justify-content-between align-items-center">
                                <button className="btn btn-success" onClick={() => { addItem(menuItem) }}>
                                    Agregar
                                </button>
                                <p className="mb-0 h4">{formatPrices(menuItem.precioCosto + (menuItem.precioCosto * (menuItem.porcentajeGanancia / 100)))}</p>
                            </div>
                        </Row>
                        <hr />
                    </React.Fragment>
                );
            }
            return null;
        });
        return items;
    }
    const handleOpenModal = (item) => {
        if (!item) return;
        setCurrentItem(item);
        setModal(true);
    };    

    useEffect(() => {
        setDisableSave(selectedItems.length <= 0 || selectedItems.every(item => item.quantity <= 0));
    }, [selectedItems])

    function getFilteredByKey(key, value) {
        const val1 = key.tipoPlatillo.nombre.toLowerCase();
        const val2 = key.nombre.toLowerCase();
        const val = value.toLowerCase();

        if (val1.includes(val) || val2.includes(val)) {
            return key
        }

        return null
    }

    const getSelectedItems = () => {
        
        const items = selectedItems.map((item, i) => (
            <Row key={`selected-item-${item.count}-${i}`} className="m-0">
                <div className="col-md-12 h5 d-flex justify-content-between align-items-center">
                    {item.name}
                    <button
                        type="button"
                        className="btn btn-info btn-sm"
                        onClick={() => handleOpenModal(item)}
                    >
                        <i className="mdi mdi-eye align-middle"></i>
                    </button>
                </div>
                <div className="col-md-12 d-flex justify-content-between align-items-center mb-3">
                    <p className="mb-0 h5">{formatPrices(item.price)}</p>
                    <button className="btn btn-danger btn-add-remove" onClick={() => { removeItem(data_order?.obtenerComandaPorMesa?.subcuentas[0]?.id, item._id, item.name,item) }}>
                            -
                    </button>
                </div>
                <hr />
            </Row>
        ));
        return items;
    }

    const addItem = (menuItem) => {
        const newCount = itemCountRef.current++;
        const newItem = {
            _id: null,
            id: menuItem.id,
            count: newCount,
            name: menuItem.nombre,
            price: menuItem.precioCosto + (menuItem.precioCosto * (menuItem.porcentajeGanancia / 100)),
            state: "Pendiente",
            observations: "",
        };
        setSelectedItems([...selectedItems, newItem]);
        setObservations({ ...observations, [newCount]: "" });
    }

    const removeItem = async (subcuentaId, platilloId, name, item) => {
    
        Swal.fire({
            title: "Eliminar platillo de la comanda",
            text: `¿Está seguro de eliminar ${name || ''}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#0BB197",
            cancelButtonColor: "#FF3D60",
            cancelButtonText: "Cancelar",
            confirmButtonText: "Sí, ¡eliminar!"
        }).then(async (result) => {
            if (!result.isConfirmed) return;
    
            try {
                if (item._id) {
                    const { data } = await deletePlatillo({ variables: { subcuentaId, platilloId } });
                    const { estado, message } = data.desactivarPlatillo;
    
                    if (!estado) {
                        infoAlert("Eliminar Platillo", message, "error", 3000, "top-end");
                        return;
                    }
    
                    infoAlert("Platillo eliminado", message, "success", 3000, "top-end");

                    await refetchOrder();
    
                } else {
                    // Eliminar localmente
                    updateLocalState(item);
                }
                // Actualizar la lista de platillos seleccionados
                setSelectedItems(prevItems => prevItems.filter(selectedItem => selectedItem.count !== item.count));
            } catch (error) {
                infoAlert("Eliminar Platillo", error.message, "error", 3000, "top-end");
            }
        });
    };
    const updateLocalState = (item) => {
        setSelectedItems(prevItems => prevItems.filter(selectedItem => selectedItem.count !== item.count));
    
        setObservations(prevObservations => {
            const newObservations = { ...prevObservations };
            delete newObservations[item.count];
            return newObservations;
        });
    };
    
    /*const updateComandaState = async () => {
        try {
            const { data: dataComanda } = await refetchComanda({ id: selectedTable.id });
            //const subcuentas = dataComanda.obtenerComandaPorMesa?.subcuentas || [];
    
    
            await refetchMesas();
        } catch (error) {
            infoAlert("Actualizar Comanda", error.message, "error", 3000, "top-end");
        }
    };
    
    const removeItem = (count) => {
        setSelectedItems(selectedItems.filter(item => item.count !== count));
        const newObservations = { ...observations };
        delete newObservations[count];
        setObservations(newObservations);
    };*/
    

    const onClickSendOrder = async () => {
        try {
            setDisableSave(true)
            let newOrderId = orderId;
            const order = {
                mesa: table.id,
                preFactura: false,
                estado: "GENERADA",
            }
            if (!orderId) {
                order['fecha'] = new Date();
                const { data } = await insertarComanda({ variables: { input: order }, errorPolicy: 'all' });
                const { estado, message, data: comandaData } = data.insertarComanda;
                if (!estado) {
                    infoAlert('Oops', message, 'error', 3000, 'top-end');
                    setDisableSave(false)
                    return;
                }
                setOrderId(comandaData.id);
                newOrderId = comandaData.id;
            }
            await actualizarComanda({ variables: { id: newOrderId, input: order }, errorPolicy: 'all' });
            const { data } = await actualizarMesa({ variables: { id: table.id, input: { disponibilidad: "OCUPADA" } }, errorPolicy: 'all' });
            const { estado, message } = data.actualizarMesa;
            if (!estado) {
                infoAlert('Oops', message, 'error', 3000, 'top-end');
                setDisableSave(true)
                return;
            }
            const subBill = {
                numero: 1,
                comanda: newOrderId,
                cliente: null, //TODO: Add client
                fecha: new Date(),
                platillos: [...selectedItems.map(item => ({
                    _id: item._id || null,
                    id: item.id,
                    nombre: item.name,
                    precio: item.price,
                    descuento: 0,
                    estado: "Pendiente",
                    observaciones: item.observations
                }))],
                descuento: 0,
                total: selectedItems.reduce((sum, item) => sum + item.price, 0),
                moneda: "COLONES",
                formaPago: null,
                estado: "Pendiente"
            }
            const { data: savedSubcuenta } = await insertarSubcuenta({ variables: { input: subBill }, errorPolicy: 'all' });
            const { estado: estadoSubcuenta, message: messageSubcuenta } = savedSubcuenta.insertarSubcuenta;
            if (!estadoSubcuenta) {
                infoAlert('Oops', messageSubcuenta, 'error', 3000, 'top-end');
                setDisableSave(true)
                return;
            }
            infoAlert('Excelente', 'Comanda enviada correctamente', 'success', 3000, 'top-end');
            navigate('/restaurant/orders');
            setDisableSave(false)
        } catch (error) {
            infoAlert('Oops', 'Ocurrió un error inesperado al guardar la comanda', 'error', 3000, 'top-end')
            setDisableSave(false)
        }
    }

    const formatPrices = (price) => {
        if (!price) return '₡0,00';
        let priceStr = price.toFixed(2);
        let [integerPart, decimalPart] = priceStr.split('.');
        integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        return `₡${integerPart},${decimalPart}`;
    };

    const handleObservationChange = (e) => {
        setObservations({
            ...observations,
            [currentItem.count]: e.target.value
        });
    };

    const saveObservation = () => {
        setSelectedItems(selectedItems.map(item =>
            item.count === currentItem.count
                ? { ...item, observations: observations[item.count] }
                : item
        ));
        toggle();
    };
    const updateObservation = (count, value) => {
        setObservations({ ...observations, [count]: value });
    };

    if (load_menu) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title='Crear Comanda' breadcrumbItem='Comandas' breadcrumbItemUrl='/restaurant/orders' />
                        <Row>
                            <div className="col text-center pt-3 pb-3">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        </Row>
                    </Container>
                </div>
            </React.Fragment>)
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title='Crear Comanda' breadcrumbItem='Comandas' breadcrumbItemUrl='/restaurant/orders' />
                    <Row>
                        <div className="col-md-6 mb-3">
                            <SpanSubtitleForm subtitle={table ? "Para la " + (table.isChair ? `Silla ${table.name}` : table.name) : `\u00A0`} />
                        </div>
                        <div className="col-md-2 col-sm-12 mb-3">
                        </div>
                        <div className="col-md-2 col-sm-12 mb-3">
                            <button
                                type="button"
                                className="btn btn-danger waves-effect waves-light"
                                style={{ width: '100%' }}
                                onClick={() => { navigate('/restaurant/orders') }}
                            >
                                Volver Atrás{" "}
                                <i className="mdi mdi-arrow-left align-middle ms-2"></i>
                            </button>
                        </div>
                        <div className="col-md-2 col-sm-12 mb-3">
                            <button
                                type="button"
                                className="btn btn-primary waves-effect waves-light"
                                style={{ width: '100%' }}
                                onClick={() => { onClickSendOrder() }}
                                disabled={disableSave}
                            >
                                Enviar Comanda{" "}
                                <i className="mdi mdi-arrow-right align-middle ms-2"></i>
                            </button>
                        </div>
                    </Row>
                    <Row>
                        <div className="col-md-4 mb-3">
                            <Card className={"h-100"}>
                                <CardBody>
                                    <Row className="text-center mb-3">
                                        <SpanSubtitleForm subtitle={"Categoria"} />
                                    </Row>
                                    <Row className="flex" style={{ alignItems: 'flex-end' }}>
                                        <div className="col-md-12 mb-3">
                                            <input
                                                className="form-control"
                                                id="search-input"
                                                value={filter}
                                                onChange={(e) => { setFilter(e.target.value) }}
                                                type="search"
                                                placeholder="Busca la categoria o el platillo" />
                                        </div>
                                    </Row>
                                    <Row>
                                        <div className="col-md-12 mb-3">
                                            <Select
                                                menuPosition="fixed"
                                                id="tipo"
                                                value={menuType}
                                                onChange={(e) => {
                                                    setMenuType(e);
                                                    setCategory(null);
                                                }}
                                                options={getMenuTypes()}
                                                placeholder="Tipo de menú"
                                                classNamePrefix="select2-selection"
                                            />
                                        </div>
                                    </Row>
                                    <Row>
                                        <div className="col-md-12">
                                            {getCategories()}
                                        </div>
                                    </Row>
                                </CardBody>
                            </Card>
                        </div>
                        <div className="col-md-4 mb-3">
                            <Card className={"h-100"}>
                                <CardBody>
                                    <div className="text-center mb-3">
                                        <SpanSubtitleForm subtitle={category || "Productos"} />
                                        {!category ? <div className="text-center">Seleccione una categoría</div> : <hr />}
                                    </div>
                                    {getItems()}
                                </CardBody>
                            </Card>
                        </div>
                        <div className="col-md-4 mb-3">
                            <Card className={"h-100"}>
                                <CardBody className="d-flex flex-column m-0">
                                    <div className="text-center">
                                        <SpanSubtitleForm subtitle={"Seleccionados"} />
                                        <hr />
                                    </div>
                                    <div className="overflow-auto flex-grow-1" style={{ maxHeight: '400px' }}>
                                        {getSelectedItems()}
                                    </div>
                                    <div className="align-self-end mt-auto">
                                        <p className="mb-0 h5">Total: {formatPrices(selectedItems.reduce((acc, item) => acc + item.price, 0))} </p>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    </Row>
                    <Modal isOpen={modal} toggle={toggle} size="md">
                        <ModalHeader toggle={toggle}>
                            {currentItem?.name}
                        </ModalHeader>
                        <ModalBody>
                            <Row>
                                <div className="col-md-12 mb-3">
                                    <label htmlFor="observations" className="form-label">Observaciones</label>
                                    <textarea
                                        className="form-control"
                                        id="observations"
                                        value={currentItem?.count in observations ? observations[currentItem.count] : ""}
                                        placeholder="Sin cebolla, con mayonesa extra..."
                                        onChange={(e) => handleObservationChange(e, currentItem?.count)}
                                        rows="4"
                                    />
                                </div>
                                <div className="col-md-12 text-end">
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => saveObservation(currentItem?.count)}
                                    >
                                        Guardar
                                    </button>
                                </div>
                            </Row>
                        </ModalBody>
                    </Modal>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default CreateOrder;
