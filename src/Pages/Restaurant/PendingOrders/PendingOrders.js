import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, Button, Container, Row, Col } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import SpanSubtitleForm from "../../../components/Forms/SpanSubtitleForm";
import { useMutation, useQuery } from "@apollo/client";
import { OBTENER_COMANDAS } from "../../../services/ComandaService";
import { getFechaTZ } from "../../../helpers/helpers";
import { infoAlert } from "../../../helpers/alert";
import { UPDATE_SERVED } from "../../../services/SubcuentaService";

const PendingOrders = ({ ...props }) => {
    document.title = "Ordenes Pendientes | FARO";

    const navigate = useNavigate();
    const { data: data_comandas, loading: loading_comandas, error: error_comandas } = useQuery(OBTENER_COMANDAS, { pollInterval: 1000 });
    const [actualizarEntregados] = useMutation(UPDATE_SERVED);

    const [temporaryServedArray, setTemporaryServedArray] = useState([]);
    const [lastServedArray, setLastServedArray] = useState([]);

    const handleServePlatillo = (mesa, platillo, subcuentaId) => {
        const servedQuantity = getServedQuantity(mesa.id, platillo.id, subcuentaId);

        if (servedQuantity < platillo.cantidad) {
            setTemporaryServedArray(prevArray => {
                const existingEntry = prevArray.find(item => item.mesa.id === mesa.id && item.platillo.id === platillo.id && item.subcuentaId === subcuentaId);

                if (existingEntry) {
                    return prevArray.map(item =>
                        item.mesa.id === mesa.id && item.platillo.id === platillo.id && item.subcuentaId === subcuentaId
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                } else {
                    return [...prevArray, { mesa: mesa, platillo, quantity: 1, subcuentaId }];
                }
            });
        } else {
            infoAlert('Oops', `No puedes servir más de ${platillo.cantidad} ${platillo.nombre}.`, 'error', 3000, 'top-end');
        }
    };

    const getServedQuantity = (mesaId, platilloId, subcuentaId) => {
        const entry = temporaryServedArray.find(item => item.mesa.id === mesaId && item.platillo.id === platilloId && item.subcuentaId === subcuentaId);
        return entry ? entry.quantity : 0;
    };

    function formatObservationsText(input) {
        const lines = input.split('\n');

        const formattedLines = lines.map(line => {
            const trimmedLine = line.trim();
            if (trimmedLine && !trimmedLine.endsWith('.')) {
                return '- ' + trimmedLine + '.';
            }
            return trimmedLine;
        });

        return formattedLines.join('\n');
    }

    const getPendingOrders = () => {
        const hasAnyPendingOrders = data_comandas?.obtenerComandas?.some(comanda =>
            comanda.subcuentas.some(subcuenta =>
                subcuenta.platillos.some(platillo =>
                    (platillo.cantidad - platillo.entregados) > 0
                )
            )
        );

        if (!hasAnyPendingOrders) {
            return <div className="text-center"><h5>No hay órdenes pendientes.</h5></div>;
        }
        return (
            <div>
                {data_comandas?.obtenerComandas?.map(comanda => {
                    const hasPendingPlatillos = comanda.subcuentas.some(subcuenta =>
                        subcuenta.platillos.some(platillo =>
                            (platillo.cantidad - platillo.entregados) > 0
                        )
                    );

                    if (!hasPendingPlatillos) return null;

                    return (
                        <Card key={"table-" + comanda.id} className="mb-3 card-pending-orders">
                            <CardBody>
                                <Row>
                                    <div className="text-center">
                                        <h4>{comanda.mesa.tipo + " " + comanda.mesa.numero}</h4>
                                    </div>
                                    <h6><strong>Piso:</strong> {comanda.mesa.piso.nombre}</h6>
                                    <h6><strong>Fecha:</strong> {getFechaTZ("fechaHora", comanda.fecha)}</h6>
                                    {comanda.observaciones && <h6><strong>Observaciones:</strong> {formatObservationsText(comanda.observaciones)}</h6>}
                                </Row>
                                <Card key={"orders-" + comanda.id} className="card-pending-orders mb-0">
                                    <CardBody >
                                        {comanda.subcuentas.map(subcuenta => (
                                            <React.Fragment key={"subcuenta-" + subcuenta.id}>
                                                {subcuenta.platillos.map(platillo => {
                                                    const pendingQuantity = platillo.cantidad - platillo.entregados;
                                                    const servedQuantity = getServedQuantity(comanda.mesa.id, platillo.id, subcuenta.id);
                                                    return (pendingQuantity > 0 &&
                                                        <div key={`${comanda.mesa.id}-${platillo.id}`} className="mb-2">
                                                            <Row>
                                                                <div className="text-center mb-2">
                                                                    <h5>{platillo.nombre} </h5>
                                                                </div>
                                                            </Row>
                                                            <Row className="align-items-center">
                                                                <div className="col-md-6">
                                                                    <h6 className="mb-0">Entregar <strong>{servedQuantity}</strong> de <strong>{pendingQuantity}</strong></h6>
                                                                </div>
                                                                <div className="col-md-6 text-end">
                                                                    <Button
                                                                        color="info"
                                                                        onClick={() => handleServePlatillo(comanda.mesa, platillo, subcuenta.id)}
                                                                        disabled={servedQuantity >= pendingQuantity}
                                                                    >
                                                                        Entregar
                                                                    </Button>
                                                                </div>
                                                            </Row>
                                                            <hr />
                                                        </div>
                                                    );
                                                })}
                                            </React.Fragment>
                                        ))}
                                    </CardBody>
                                </Card>
                            </CardBody>
                        </Card>
                    )
                })}
            </div>
        );
    };

    const handleRemoveServedPlatillo = (platillo) => {
        setTemporaryServedArray(prevArray => {
            return prevArray.map(item =>
                item.platillo.id === platillo.id
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            ).filter(item => item.quantity > 0);
        });
    }

    const getTemporaryServedPlatillos = () => {
        return temporaryServedArray.map((item, index) => {
            return (
                <Card key={index} className="mb-2 card-pending-orders">
                    <CardBody>
                        <Row className="text-center">
                            <h4>{item.platillo.nombre}</h4>
                        </Row>
                        <Row className="align-items-center">
                            <div className="col-md-8">
                                <Row className="align-items-center">
                                    <div className="col-md-2">
                                        <Button
                                            color="danger"
                                            onClick={() => handleRemoveServedPlatillo(item.platillo)}
                                        >
                                            -
                                        </Button>
                                    </div>
                                    <div className="col-md-10">
                                        <h5 className="mb-0">{`Entrega en ${item.mesa.tipo} ${item.mesa.numero}`}</h5>
                                    </div>
                                </Row>
                            </div>

                            <div className="col-md-4 text-end">
                                <h5 className="mb-0">Cantidad: <strong>{item.quantity}</strong></h5>
                            </div>
                        </Row>
                    </CardBody>
                </Card>
            )
        })
    }

    const handleServePlatillos = () => {
        const servedWithTimestamp = temporaryServedArray.map(item => ({
            ...item,
            timestamp: new Date().toISOString()
        }));

        servedWithTimestamp.forEach(async item => {
            try {
                const { data } = await actualizarEntregados({
                    variables: {
                        input: {
                            subcuenta: item.subcuentaId,
                            platillo: item.platillo.id,
                            entregados: item.quantity
                        }
                    },
                    errorPolicy: 'all'
                });
                const { estado } = data.actualizarEntregados;
                if (!estado) {
                    throw new Error();
                }
            } catch (error) {
                console.error(error);
                infoAlert('Oops', 'Ocurrió un error al entregar los platillos. Por favor intenta de nuevo.', 'error', 3000, 'top-end');
                return;
            }
        });

        setLastServedArray(prev =>
            [...prev, ...servedWithTimestamp].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        );

        setTemporaryServedArray([]);
    };

    const getLastServed = () => {
        return lastServedArray.map((item, index) => {
            return (
                <Card key={index} className="mb-2 card-pending-orders">
                    <CardBody className="p-0">
                        <div className="green-bar text-center">
                            {getFechaTZ("fechaHoraSegundos", item.timestamp)}
                        </div>
                        <div className="card-content p-3">
                            <h4 className="text-center">{item.platillo.nombre}</h4>
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">{`${item.mesa.tipo} ${item.mesa.numero}`}</h5>
                                <h5 className="mb-0">Cantidad: <strong>{item.quantity}</strong></h5>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            )
        })
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title='Ordenes Pendientes' breadcrumbItem='Restaurante' breadcrumbItemUrl='/restaurant' />
                    <Row>
                        <div className="col-md-4 mb-3">
                            <Card className="h-100">
                                <CardBody>
                                    <Row className="text-center mb-3">
                                        <SpanSubtitleForm subtitle={"Ordenes Pendientes"} />
                                    </Row>
                                    <Row>
                                        <div className="col-md-12">
                                            {loading_comandas && <Row>
                                                <div className="col text-center pt-3 pb-3">
                                                    <div className="spinner-border" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                </div>
                                            </Row>}
                                            {getPendingOrders()}
                                        </div>
                                    </Row>
                                </CardBody>
                            </Card>
                        </div>
                        <div className="col-md-4 mb-3">
                            <Card className="h-100">
                                <CardBody>
                                    <div className="text-center mb-3">
                                        <SpanSubtitleForm subtitle={"Entrega Actual"} />
                                    </div>
                                    {getTemporaryServedPlatillos()}
                                    {temporaryServedArray.length > 0 && (
                                        <div className="text-center">
                                            <Button color="success" onClick={handleServePlatillos}>
                                                Entregar Ordenes
                                            </Button>
                                        </div>
                                    )}
                                </CardBody>
                            </Card>
                        </div>
                        <div className="col-md-4 mb-3">
                            <Card className="h-100">
                                <CardBody className="d-flex flex-column m-0">
                                    <div className="text-center">
                                        <SpanSubtitleForm subtitle={"Ordenes Entregadas"} />
                                    </div>
                                    {getLastServed()}
                                </CardBody>
                            </Card>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default PendingOrders;
