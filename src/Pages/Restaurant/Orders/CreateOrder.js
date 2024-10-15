import React, { useEffect, useState, } from "react";
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, Container, Row, Modal, ModalHeader, ModalBody } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { Link, useLocation } from 'react-router-dom';
import SpanSubtitleForm from "../../../components/Forms/SpanSubtitleForm";
import { OBTENER_MENUS } from "../../../services/MenuService";
import { useMutation, useQuery } from "@apollo/client";
import Select from "react-select";
import { infoAlert } from "../../../helpers/alert";
import { OBTENER_COMANDA_POR_MESA, SAVE_COMANDA, UPDATE_COMANDA } from "../../../services/ComandaService";
import { SAVE_SUBCUENTA } from "../../../services/SubcuentaService";
import { UPDATE_MESA } from "../../../services/MesaService";

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

    const [category, setCategory] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [filter, setFilter] = useState('');
    const [observations, setObservations] = useState('');
    const [modal, setModal] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [disableSave, setDisableSave] = useState(true);
    const toggle = () => setModal(!modal);

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
        if (data_order?.obtenerComandaPorMesa) {
            setOrderId(data_order.obtenerComandaPorMesa.id);
            setObservations(data_order.obtenerComandaPorMesa.observaciones);
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

    useEffect(() => {
        if (table) {
            setSelectedItems(table.orders.map(order => ({
                id: order.id,
                name: order.nombre,
                price: order.precio,
                quantity: order.cantidad,
                subBill: 1
            }))
            );
        }
    }, [table]);

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
            <Row key={`selected-item-${item.id}-${i}`} className="m-0">
                <div className="col-md-12 h5">
                    {item.name}
                </div>
                <div className="col-md-12 d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center justify-content-between col-md-5">
                        <button className="btn btn-danger btn-add-remove" onClick={() => { removeItem(item.id) }}>
                            -
                        </button>
                        <input
                            className="form-control w-30 min-w-45-px"
                            type="text"
                            value={item.quantity}
                            onChange={(e) => {
                                setSelectedItems(selectedItems.map(thisItem =>
                                    thisItem.id === item.id ?
                                        { ...thisItem, quantity: Number(e.target.value) } :
                                        thisItem
                                ))
                            }}
                        />
                        <button className="btn btn-success btn-add-remove" onClick={() => { addItem(item) }}>
                            +
                        </button>
                    </div>
                    <p className="mb-0 h5">{formatPrices(item.price * item.quantity)}</p>
                </div>
                <hr />
            </Row>
        ));
        return items;
    }

    const addItem = (menuItem) => {
        const existingItem = selectedItems.find(item => item.id === menuItem.id);

        if (existingItem) {
            setSelectedItems(selectedItems.map(item =>
                item.id === menuItem.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            const newItem = {
                id: menuItem.id,
                name: menuItem.nombre,
                price: menuItem.precioCosto + (menuItem.precioCosto * (menuItem.porcentajeGanancia / 100)),
                quantity: 1,
                subBill: 1
            };
            setSelectedItems([...selectedItems, newItem]);
        }
    }

    const removeItem = (id) => {
        const existingItem = selectedItems.find(item => item.id === id);

        if (existingItem) {
            if (existingItem.quantity > 1) {
                setSelectedItems(selectedItems.map(item =>
                    item.id === id
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                ));
            } else {
                setSelectedItems(selectedItems.filter(item => item.id !== id));
            }
        }
    }

    const onClickSendOrder = async () => {
        try {
            setDisableSave(true)
            let newOrderId = orderId;
            const order = {
                mesa: table.id,
                observaciones: observations,
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
            console.log("Order", order)
            await actualizarComanda({ variables: { id: newOrderId, input: order }, errorPolicy: 'all' });
            const { data } = await actualizarMesa({ variables: { id: table.id, input: { disponibilidad: "OCUPADA" } }, errorPolicy: 'all' });
            const { estado, message } = data.actualizarMesa;
            if (!estado) {
                infoAlert('Oops', message, 'error', 3000, 'top-end');
                setDisableSave(true)
                return;
            }

            /*const groupedItems = selectedItems.reduce((acc, item) => {
                const subBillKey = item.subBill || 1;
                if (!acc[subBillKey]) {
                    acc[subBillKey] = [];
                }
                acc[subBillKey].push(item);
                return acc;
            }, {});
            const subBills = Object.entries(groupedItems).map(([subBillKey, items], index) => ({
                numero: index + 1,
                comanda: newOrderId,
                cliente: null, //TODO: Add client
                fecha: new Date(),
                platillos: items.map(item => ({
                    id: item.id,
                    cantidad: item.quantity,
                    precio: item.price,
                    descuento: 0
                })),
                descuento: 0,
                total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                moneda: "COLONES",
                formaPago: null,
                estado: "Pendiente"
            }));
            for (const subBill of subBills) {
                console.log(subBill)
                const { data } = await insertarSubcuenta({ variables: { input: subBill }, errorPolicy: 'all' });
                const { estado, message } = data.insertarSubcuenta;
                if (!estado) {
                    infoAlert('Oops', message, 'error', 3000, 'top-end');
                    setDisableSave(true)
                    return;
                }
            }*/
            const subBill = {
                numero: 1,
                comanda: newOrderId,
                cliente: null, //TODO: Add client
                fecha: new Date(),
                platillos: [...selectedItems.map(item => ({
                    id: item.id,
                    nombre: item.name,
                    cantidad: item.quantity,
                    precio: item.price,
                    descuento: 0
                }))],
                descuento: 0,
                total: selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
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
                            <button
                                type="button"
                                className="btn btn-info waves-effect waves-light"
                                style={{ width: '100%' }}
                                onClick={() => { toggle() }}
                            >
                                Observaciones{" "}
                                <i className="mdi mdi-eye align-middle ms-2"></i>
                            </button>
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
                                        <p className="mb-0 h5">Total: {formatPrices(selectedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0))} </p>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    </Row>
                    <Modal isOpen={modal} toggle={toggle} size="md">
                        <ModalHeader toggle={toggle}>
                            {table.name}
                        </ModalHeader>
                        <ModalBody>
                            <Row>
                                <div className="col-md-12 mb-3">
                                    <label htmlFor="observations" className="form-label">Observaciones</label>
                                    <textarea
                                        className="form-control"
                                        id="observations"
                                        value={observations}
                                        placeholder="Sin cebolla, con mayonesa extra..."
                                        onChange={(e) => { setObservations(e.target.value) }}
                                        rows="4"
                                    />
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