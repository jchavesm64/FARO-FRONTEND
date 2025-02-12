import React, { useCallback, useEffect, useState } from "react";
import { Card, Container, Row, CardBody, Col } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import Floor from "../Floor/Floor";
import Select from "react-select";
import { useNavigate } from 'react-router-dom';
import OrderDetails from "./OrderDetails";
import { useMutation, useQuery } from "@apollo/client";
import { OBTENER_PISOS, OBTENER_MESAS_POR_PISO } from "../../../services/PisoService";
import { OBTENER_COMANDA_POR_MESA, UPDATE_COMANDA, DELETE_COMANDA } from "../../../services/ComandaService";
import { UPDATE_MESA } from "../../../services/MesaService";
import { DELETE_SUBCUENTA, DELETE_PLATILLO } from "../../../services/SubcuentaService";
import { isEqual, set } from "lodash";
import Swal from "sweetalert2";
import { infoAlert } from "../../../helpers/alert";

const Orders = ({ ...props }) => {
    document.title = "Comandas | FARO";

    const navigate = useNavigate();

    const [floors, setFloors] = useState([]);
    const [selectedFloor, setSelectedFloor] = useState(null);
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [isTransferMode, setIsTransferMode] = useState(false);
    const [comandaData, setComandaData] = useState([]);
    const [comandaId, setComandaId] = useState(null);
    const [comandaCreatedAt, setComandaCreatedAt] = useState(null);
    const { loading: loadingPisos, error: errorPisos, data: dataPisos, refetch: refecthPisos } = useQuery(OBTENER_PISOS);

    const { loading: loadingMesas, error: errorMesas, data: dataMesas, refetch: refetchMesas } = useQuery(OBTENER_MESAS_POR_PISO, {
        variables: { id: selectedFloor?.value.id },
        skip: !selectedFloor,
        fetchPolicy: 'network-only', // This ensures we always fetch fresh data
        pollInterval: 5000,
    });

    const { loading: loadingComandas, error: errorComandas, data: dataComandas, refetch: refetchComanda } = useQuery(OBTENER_COMANDA_POR_MESA, {
        variables: { id: selectedTable?.id },
        skip: !selectedTable,
        fetchPolicy: 'network-only', // This ensures we always fetch fresh data
        notifyOnNetworkStatusChange: true, // This helps in tracking loading state
    });

    const [updateComanda] = useMutation(UPDATE_COMANDA);
    const [updateMesa] = useMutation(UPDATE_MESA);
    const [deleteComanda] = useMutation(DELETE_COMANDA);
    const [deleteSubcuenta] = useMutation(DELETE_SUBCUENTA);
    const [deletePlatillo] = useMutation(DELETE_PLATILLO);

    useEffect(() => {
        const fetchMesas = async () => {
            await refetchMesas({ id: selectedFloor?.value.id });
        }
        if (selectedFloor) {
            fetchMesas();
        }
    }, []);

    useEffect(() => {
        if (dataPisos && dataPisos.obtenerPisos.length > 0) {
            const floorOptions = dataPisos.obtenerPisos.map((floor) => ({
                label: floor.nombre,
                value: floor
            }));
            setFloors(floorOptions);

            const lastFloorId = localStorage.getItem("lastFloorId");
            const initialFloor = lastFloorId
                ? floorOptions.find((floor) => floor.value.id === lastFloorId)
                : floorOptions[0];
            setSelectedFloor(initialFloor);
            localStorage.setItem("lastFloorId", initialFloor.value.id);
        }
    }, [dataPisos]);

    const placeTables = useCallback(() => {
        if (!dataMesas || !dataMesas.obtenerMesasPorPiso) return;

        const tables = dataMesas.obtenerMesasPorPiso.map((table) => ({
            id: table.id,
            name: (table.tipo === "Mesa" ? "Mesa " : "") + table.numero,
            pos: {
                left: 0,
                top: 0
            },
            isChair: table.tipo === "Silla",
            isSelected: false,
            hasOrder: table.disponibilidad === "OCUPADA",
            isReserved: table.disponibilidad === "RESERVADA",
            subcuenta: null,
            orders: []
        }));

        const updatedTables = [...tables];
        const maxWidth = 600;
        const maxHeight = 555;
        const sillaWidth = 40;
        const sillaHeight = 40;
        const mesaWidth = 100;
        const mesaHeight = 60;
        const spacing = 20;

        let sillaTop = 20;
        let sillaLeft = 20;
        let mesaTop = 0;
        let mesaLeft = 20;
        let sillaCount = 0;
        let mesaCount = 0;

        // Position chairs
        updatedTables.forEach(obj => {
            if (obj.isChair) {
                obj.pos = {
                    left: sillaLeft,
                    top: sillaTop
                };

                sillaLeft += sillaWidth + spacing;

                if (sillaLeft + sillaWidth > maxWidth) {
                    sillaLeft = 20;
                    sillaTop += sillaHeight + spacing;
                }
            }
        });

        // Calculate mesaTop based on the last chair position
        mesaTop = sillaTop + sillaHeight + spacing;

        // Position tables
        updatedTables.forEach(obj => {
            if (!obj.isChair) {
                obj.pos = {
                    left: mesaLeft,
                    top: mesaTop
                };

                mesaLeft += mesaWidth + spacing;

                if (mesaLeft + mesaWidth > maxWidth) {
                    mesaLeft = 20;
                    mesaTop += mesaHeight + spacing;
                }
            }
        });

        return updatedTables;
    }, [dataMesas]);

    useEffect(() => {
        if (selectedFloor && dataMesas) {
            const placedTables = placeTables();
            setTables(placedTables);
        }
    }, [selectedFloor, dataMesas, placeTables]);

    useEffect(() => {
        if (dataComandas && selectedTable) {
            let newOrders = [];
            dataComandas.obtenerComandaPorMesa?.subcuentas?.forEach(subcuenta => {
                subcuenta.platillos.forEach(platillo => {
                    newOrders.push({
                        _id:platillo._id,
                        id: platillo.id,
                        nombre: platillo.nombre,
                        precio: platillo.precio,
                        descuento: platillo.descuento,
                        estado: platillo.estado,
                        observaciones: platillo.observaciones,
                        subcuenta: dataComandas.obtenerComandaPorMesa?.subcuentas[0]?.id
                    });
                }
                )
            });
            if (!isEqual(newOrders, comandaData)) {
                setComandaId(dataComandas.obtenerComandaPorMesa?.id);
                setComandaCreatedAt(dataComandas.obtenerComandaPorMesa?.fecha);
                setComandaData(newOrders);

                setTables(prevTables =>
                    prevTables.map(table =>
                        table.id === selectedTable.id
                            ? { ...table, hasOrder: newOrders.length > 0, orders: newOrders }
                            : table
                    )
                );
                setSelectedTable(prevTable => ({
                    ...prevTable,
                    hasOrder: newOrders.length > 0,
                    orders: newOrders,
                }));
            }
        }
    }, [dataComandas, selectedTable]);

    const onSelectTable = (table) => {
        if (!table) {
            setSelectedTable(null);
            setIsTransferMode(false);
            setComandaId(null);  // Reset comandaId
            setComandaData(null);  // Reset comandaData
            setComandaCreatedAt(null);  // Reset comandaCreatedAt
            return;
        }

        if (isTransferMode) {
            onTransferOrder(table);
            setIsTransferMode(false);
            return;
        }
        refetchComanda({ id: table.id });
        setSelectedTable(table);
    };

    const onDeleteItem = (subcuentaId, platilloId, name, state) => {
        if (state === "Entregado") {
            infoAlert("Eliminar Platillo", "No se puede eliminar un producto que ya ha sido entregado.", "error", 3000, "top-end");
            return;
        }

        console.log("Deleting item...", subcuentaId, platilloId);
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
            if (result.isConfirmed) {
                const { data } = await deletePlatillo({ variables: { subcuentaId, platilloId } });
                const { estado, message } = data.desactivarPlatillo;
    
                if (estado) {
                    infoAlert("Platillo eliminado", message, "success", 3000, "top-end");
    
                    // Refetch comanda para actualizar la vista
                    const { data: dataComanda } = await refetchComanda({ id: selectedTable.id });
                    const subcuentas = dataComanda.obtenerComandaPorMesa?.subcuentas || [];
    
                    if (subcuentas.every(subcuenta => subcuenta.platillos.every(platillo => platillo.estado === "Cancelado"))) {
                        // Si todos los platillos están cancelados, eliminar la comanda y liberar la mesa
                        await deleteComanda({ variables: { id: comandaId } });
                        await updateMesa({ variables: { id: selectedTable.id, input: { disponibilidad: "LIBRE" } } });
    
                        infoAlert("Comanda eliminada", "La comanda ha sido eliminada porque todos los platillos fueron cancelados.", "success", 3000, "top-end");
    
                        setComandaId(null);
                        setComandaData([]);
                        setComandaCreatedAt(null);
                    }
    
                    await refetchMesas();
                } else {
                    infoAlert("Eliminar Platillo", message, "error", 3000, "top-end");
                }
            }
        });
    };
    

    const onDeleteOrder = () => {
        //TODO: terminar de implementar
        Swal.fire({
            title: "Eliminar comanda",
            text: `¿Está seguro de eliminar la comanda de la ${selectedTable.isChair ? 'Silla ' + selectedTable.name : selectedTable.name}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#0BB197",
            cancelButtonColor: "#FF3D60",
            cancelButtonText: 'Cancelar',
            confirmButtonText: "Sí, ¡eliminar!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { data: dataComanda } = await deleteComanda({ variables: { id: comandaId } });
                const { estado: estadoComanda, message: messageComanda } = dataComanda.desactivarComanda;

                if (estadoComanda) {
                    await updateMesa({ variables: { id: selectedTable.id, input: { disponibilidad: "LIBRE" } } });

                    infoAlert('Comanda eliminada', messageComanda, 'success', 3000, 'top-end')
                    setComandaId(null);
                    setComandaData([]);
                    setComandaCreatedAt(null);

                    await refetchMesas();
                    await refetchComanda({ id: selectedTable.id });
                } else {
                    infoAlert('Eliminar Comanda', messageComanda, 'error', 3000, 'top-end')
                }
            }
        });
    };


    const onTransferOrder = async (destinationTable) => {
        if (!selectedTable || !destinationTable) return;
        if (destinationTable.hasOrder) {
            infoAlert('Transferir Comanda', 'La mesa de destino ya tiene una comanda', 'error', 3000, 'top-end')
            return;
        }
        Swal.fire({
            title: "Transferir Comanda",
            text: `¿Está seguro de transferir la comanda de la ${selectedTable.isChair ? 'Silla ' + selectedTable.name : selectedTable.name} a la ${destinationTable.isChair ? 'Silla ' + destinationTable.name : destinationTable.name}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#0BB197",
            cancelButtonColor: "#FF3D60",
            cancelButtonText: 'Cancelar',
            confirmButtonText: "Sí, ¡transferir!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const { data: dataComanda } = await updateComanda({ variables: { id: comandaId, input: { mesa: destinationTable.id } } });
                    const { estado: estadoComanda, message: messageComanda } = dataComanda.actualizarComanda;
                    if (estadoComanda) {
                        await updateMesa({ variables: { id: selectedTable.id, input: { disponibilidad: "LIBRE" } } });
                        await updateMesa({ variables: { id: destinationTable.id, input: { disponibilidad: "OCUPADA" } } });

                        infoAlert('Transferencia completa', messageComanda, 'success', 3000, 'top-end')

                        setSelectedTable(null);
                        setComandaId(null);
                        setComandaCreatedAt(null);
                        setComandaData([]);

                        await refetchMesas();
                        await refetchComanda({ id: destinationTable.id });

                        setSelectedTable(destinationTable);
                    } else {
                        infoAlert('Error de transferencia', messageComanda, 'error', 3000, 'top-end')
                    }
                } catch (error) {
                    console.error("Error during transfer:", error);
                    infoAlert('Error de transferencia', 'Ocurrió un error durante la transferencia', 'error', 3000, 'top-end')
                }
            }
        });
    };

    const onCreateOrder = () => {
        navigate('/restaurant/orders/new', { state: { table: selectedTable } });
    };

    const onBill = () => {
        const selectedComanda = dataComandas?.obtenerComandaPorMesa;
        if (selectedComanda) {
            navigate('/restaurant/orders/invoice', { state: { data: selectedComanda, table: selectedTable, floor:selectedFloor } });
        }
    };

    if (loadingPisos) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title='Comandas' breadcrumbItem='Restaurante' breadcrumbItemUrl='/restaurant' />
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
        );
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title='Comandas' breadcrumbItem='Restaurante' breadcrumbItemUrl='/restaurant' />
                    <Row>
                        <div className="col-md-7 mb-3">
                            <div style={{ maxWidth: '300px', minWidth: '200px' }}>
                                <label htmlFor="floors" className="form-label">Pisos</label>
                                <Select
                                    id="floors"
                                    value={selectedFloor}
                                    onChange={async (e) => {
                                        !isTransferMode && onSelectTable(null);
                                        setSelectedFloor(e);
                                        await refetchMesas({ id: e.value.id });
                                        localStorage.setItem("lastFloorId", e.value.id);
                                    }}
                                    options={floors}
                                    classNamePrefix="select2-selection"
                                    className="mb-3"
                                    isSearchable={true}
                                    menuPortalTarget={document.body}
                                    menuPosition="fixed"
                                />
                            </div>
                            <Floor data={tables} selectTable={onSelectTable} />
                            <button type="button" className="btn-info-table">
                                Mesa disponible
                            </button>
                            <button type="button" className="btn-info-table has-order">
                                Mesa con orden
                            </button>
                            <button type="button" className="btn-info-table reserved">
                                Mesa reservada
                            </button>
                        </div>
                        <div className="col-md-5 mb-3">
                            <Card className={"h-95"}>
                                <CardBody>
                                    <OrderDetails
                                        table={selectedTable}
                                        onDelete={onDeleteItem}
                                        onDeleteOrder={onDeleteOrder}
                                        onTransfer={() => setIsTransferMode(!isTransferMode)}
                                        transferMode={isTransferMode}
                                        onCreateOrder={onCreateOrder}
                                        onBill={onBill}
                                        createdAt={comandaCreatedAt}
                                    />
                                </CardBody>
                            </Card>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};
export default Orders;