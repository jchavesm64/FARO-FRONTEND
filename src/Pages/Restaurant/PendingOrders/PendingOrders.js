import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, Button, Container, Row, Col } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import SpanSubtitleForm from "../../../components/Forms/SpanSubtitleForm";
import { useMutation, useQuery } from "@apollo/client";
import { OBTENER_COMANDAS_PENDIENTES } from "../../../services/ComandaService";
import { getFechaTZ } from "../../../helpers/helpers";
import { infoAlert } from "../../../helpers/alert";
import { UPDATE_SERVED } from "../../../services/SubcuentaService";
import { set } from "lodash";

const PendingOrders = ({ ...props }) => {
    document.title = "Ordenes Pendientes | FARO";

    const navigate = useNavigate();
    const { data: data_comandas, loading: loading_comandas, error: error_comandas } = useQuery(OBTENER_COMANDAS_PENDIENTES, { pollInterval: 1000 });
    const [actualizarEntregados] = useMutation(UPDATE_SERVED);

    const [comandas, setComandas] = useState([]);
    const [temporaryServedArray, setTemporaryServedArray] = useState([]);
    const [lastServedArray, setLastServedArray] = useState([]);

    useEffect(() => {
        if (data_comandas?.obtenerComandasPendientes) {
            const filteredComandas = data_comandas.obtenerComandasPendientes.filter(comanda => comanda.subcuentas[0].platillos && comanda.subcuentas[0].platillos.length > 0);
            setComandas(filteredComandas);
        }
    }, [data_comandas]);

    
    const handlePrepareSubcuenta = (comanda) => {
        if (!temporaryServedArray.some(item => item.id === comanda.id)) {
            setTemporaryServedArray(prevArray => [...prevArray, comanda]);
            setComandas(prevComandas => prevComandas.filter(item => item.id !== comanda.id));
        }
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

    const getPendingOrders = () => {

        if (!comandas.length) {
            return <div className="text-center"><h5>No hay órdenes pendientes.</h5></div>;
        }

        return (
            <div>
                {comandas?.map(comanda => (
                    <Card key={"table-" + comanda.id} className="mb-3 card-pending-orders">
                        <CardBody>
                            <Row>
                                <div className="text-center">
                                    <h4>{comanda.mesa.tipo + " " + comanda.mesa.numero}</h4>
                                </div>
                                <h6><strong>Piso:</strong> {comanda.mesa.piso.nombre}</h6>
                                <h6><strong>Fecha:</strong> {getFechaTZ("fechaHora", comanda.fecha)}</h6>
                            </Row>
                            <div className="text-center mb-2">
                                <h5>Subcuenta</h5>
                            </div>
                            {comanda.subcuentas.map(subcuenta => (
                                <Card key={"subcuenta-" + subcuenta.id} className="card-pending-orders mb-0">
                                    <CardBody>
                                        {subcuenta.platillos.map(platillo => (
                                            <div key={`${comanda.mesa.id}-${platillo._id}`} className="mb-2">
                                                <Row>
                                                    <div className="text-center mb-2">
                                                        <h5>{platillo.nombre}</h5>
                                                    </div>
                                                </Row>
                                                <Row className="align-items-center">
                                                    <div className="col-md-12">
                                                        <h6 className="mb-0">Observaciones: {formatObservationsText(platillo.observaciones)}</h6>
                                                    </div>
                                                </Row>
                                                <hr />
                                            </div>
                                        ))}
                                        <div className="text-center">
                                            <Button
                                                color="info"
                                                onClick={() => handlePrepareSubcuenta(comanda)}
                                            >
                                                Preparar  
                                            </Button>
                                        </div>
                                    </CardBody>
                                </Card>
                            ))}
                        </CardBody>
                    </Card>
                ))}
            </div>
        );
    };

    const handleRemovePrepareSubcuenta = (comanda) => {
        setTemporaryServedArray(prevArray => {
            const updatedArray = prevArray.filter(item => item.id !== comanda.id);
            if (updatedArray.length !== prevArray.length) {
                setComandas(prevComandas => {
                    const updatedComandas = [...prevComandas, comanda];
                    return updatedComandas.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
                });
            }
            return updatedArray;
        });
    }

    const getTemporaryServedSubcuentas = () => {
        return temporaryServedArray.map((item, index) => {
            return (
                <Card key={"table-" + item.id} className="mb-3 card-pending-orders">
                    <CardBody>
                        <Row>
                            <div className="text-center">
                                <h4>{item.mesa.tipo + " " + item.mesa.numero}</h4>
                            </div>
                            <h6><strong>Piso:</strong> {item.mesa.piso.nombre}</h6>
                            <h6><strong>Fecha:</strong> {getFechaTZ("fechaHora", item.fecha)}</h6>
                        </Row>
                        <div className="text-center mb-2">
                            <h5>Subcuenta</h5>
                        </div>
                        {item.subcuentas.map(subcuenta => (
                            <Card key={"subcuenta-" + subcuenta.id} className="card-pending-orders mb-0">
                                <CardBody>
                                    {subcuenta.platillos.map(platillo => (
                                        <div key={`${item.mesa.id}-${platillo._id}`} className="mb-2">
                                            <Row>
                                                <div className="text-center mb-2">
                                                    <h5>{platillo.nombre}</h5>
                                                </div>
                                            </Row>
                                            <Row className="align-items-center">
                                                <div className="col-md-12">
                                                    <h6 className="mb-0">Observaciones: {formatObservationsText(platillo.observaciones)}</h6>
                                                </div>
                                            </Row>
                                            <hr />
                                        </div>
                                    ))}
                                    <div className="text-center">
                                        <Button
                                            color="danger"
                                            className="me-2"
                                            onClick={() => handleRemovePrepareSubcuenta(item)}
                                        >
                                            Eliminar
                                        </Button>
                                        <Button
                                            color="info"
                                            onClick={() => handleDeliverSubcuenta(item)}
                                        >
                                            Entregar
                                        </Button>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </CardBody>
                </Card>
            );
        });
    };
    

    const handleDeliverSubcuenta = async (comanda) => {
        console.log("COMANDA: ", comanda.subcuentas[0].id);
        try {
            const {data} = await actualizarEntregados({variables: {id: comanda.subcuentas[0].id }});

            const { estado, message } = data.actualizarEntregados;
            if (!estado) {
                infoAlert("Error actualizar Subcuenta", message, "error", 3000, "top-end");
                return;
            }
            infoAlert('Excelente', 'Subcuenta entregada con éxito.', 'success', 1000, 'top-end');

            setLastServedArray(prev => [...prev, comanda].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)));
            setTemporaryServedArray(prevArray => prevArray.filter(item => item.id !== comanda.id));
        } catch (error) {
            infoAlert('Oops', 'Error al entregar subcuenta.', 'error', 3000, 'top-end');
        }
    };

    const getLastServed = () => {
        return lastServedArray.map((item, index) => {
            return (
                <Card key={index} className="mb-2 card-pending-orders">
                    <CardBody>
                        <Row className="text-center">
                            <h4 className="mb-0">{`${item.mesa.tipo} ${item.mesa.numero}`}</h4>
                        </Row>
                        <Row>
                            <div className="col-md-12">
                                <h6>Subcuenta</h6>
                            </div>
                        </Row>
                        <hr />
                        <Row>
                            <div className="col-md-12">
                                <h5 className="mb-2">Platillos:</h5>
                                <ul>
                                    {item.subcuentas[0].platillos.map((platillo) => (
                                        <li key={platillo._id}>{platillo.nombre}</li>
                                    ))}
                                </ul>
                            </div>
                        </Row>
                    </CardBody>
                </Card>
            );
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
                                        <SpanSubtitleForm subtitle={"En Preparación"} />
                                    </div>
                                    {getTemporaryServedSubcuentas()}
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
