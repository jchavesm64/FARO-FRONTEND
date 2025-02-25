import React, { useState, useEffect } from "react";
import { Card, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../../../components/Common/Breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import Select from "react-select";
import SpanSubtitleForm from "../../../../components/Forms/SpanSubtitleForm";
import { infoAlert } from "../../../../helpers/alert";
import { OBTENER_SERVICIO_EXTERNOS_BY_ID, UPDATE_SERVICIO_EXTERNO } from "../../../../services/ServiciosExternalService";
import { OBTENER_TIPOSSERVICIOS } from "../../../../services/TipoServicioService";

const EditExtraService = ({ idBooking, updateServiceBooking }) => {
    document.title = "Servicios Externos | FARO";

    const navigate = useNavigate();
    const { id } = useParams();

    const { data: typesService } = useQuery(OBTENER_TIPOSSERVICIOS, { pollInterval: 1000 });
    const { loading: loading_extraservice, error: error_extraservice, data: data_extraservice, startPolling, stopPolling } = useQuery(OBTENER_SERVICIO_EXTERNOS_BY_ID, { variables: { id: idBooking ? idBooking : id }, pollInterval: 1000 });
    const [actualizar] = useMutation(UPDATE_SERVICIO_EXTERNO);

    useEffect(() => {
        startPolling(1000)
        return () => {
            stopPolling()
        }
    }, [startPolling, stopPolling]);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [typeService, setTypeService] = useState(null);
    useEffect(() => {
        if (data_extraservice) {
            setName(data_extraservice.obtenerServicioExterno.nombre);
            setDescription(data_extraservice.obtenerServicioExterno.descripcion);
            setPrice(data_extraservice.obtenerServicioExterno.precio);
            setTypeService({
                "value": data_extraservice.obtenerServicioExterno.tipo,
                "label": data_extraservice.obtenerServicioExterno.tipo.nombre
            });
        }
    }, [data_extraservice])

    const [disableSave, setDisableSave] = useState(true);

    useEffect(() => {
        setDisableSave(name.trim().length === 0 || price.length === 0)
    }, [name, price])

    const getTypeService = () => {
        const data = []
        if (typesService?.obtenerTipoServicio) {
            typesService.obtenerTipoServicio.forEach((item) => {
                data.push({
                    "value": item,
                    "label": item.nombre
                });
            });
        }
        return data;
    };

    const cleanData = () => {
        setName('');
        setPrice(0);
        setDescription('');
        setTypeService(null)
    };

    const handleTypeService = (a) => {
        setTypeService(a);
    };

    const onClickSave = async () => {
        try {
            setDisableSave(true)
            const input = {
                nombre: name,
                descripcion: description,
                precio: price,
                tipo: !idBooking ? typeService.value.id : typeService.value,
                estado: "ACTIVO"
            }

            if (!idBooking) {
                const { data } = await actualizar({ variables: { id: !idBooking ? id : idBooking, input }, errorPolicy: 'all' })
                const { estado, message } = data.actualizarServicioExterno;
                if (estado) {
                    infoAlert('Excelente', message, 'success', 3000, 'top-end')
                    navigate('/hotelsettings/externalservices');
                } else {
                    infoAlert('Oops', message, 'error', 3000, 'top-end')
                }
            } else {
                infoAlert('Excelente', "Servicio actualizado para la reserva", 'success', 3000, 'top-end');
                updateServiceBooking(input);
                cleanData();
            }
        } catch (error) {
            infoAlert('Oops', 'Ocurrió un error inesperado al guardar el servicio', 'error', 3000, 'top-end')
            setDisableSave(false)
        }
    }

    if (loading_extraservice) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title="Editar servicio externo" breadcrumbItem="servicio externo" breadcrumbItemUrl='/hotelsettings/externalservice' />
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

    if (error_extraservice) {
        return null
    }

    return (
        <React.Fragment>
            <div className={!idBooking && "page-content"}>
                <Container fluid={true}>
                    {!idBooking && <Breadcrumbs title="Editar servicio externo" breadcrumbItem="servicio externo" breadcrumbItemUrl='/hotelsettings/externalservice' />}
                    <Card className='p-4'>
                        <Row>
                            <div className="col mb-3 text-end">
                                <button type="button" className="btn btn-primary waves-effect waves-light" disabled={disableSave} onClick={() => onClickSave()}>
                                    Guardar{" "}
                                    <i className="ri-save-line align-middle ms-2"></i>
                                </button>
                            </div>
                        </Row>
                        <Row>
                            <div className="col mb-3">
                                <SpanSubtitleForm subtitle='Información del servicio externo' />
                            </div>
                        </Row >
                        <Row className='d-flex justify-content-between shadow_service rounded-5 p-3'>
                            <Col className="col-md-6  d-flex justify-content-center flex-wrap">
                                <div className="col-md-11 col-sm-9 m-2">
                                    <label htmlFor="season" className="form-label">* Tipos de servicios</label>
                                    <Select
                                        id="season"
                                        value={typeService}
                                        onChange={(e) => {
                                            handleTypeService(e);
                                        }}
                                        options={getTypeService()}
                                        placeholder="Tipo de servicio"
                                        classNamePrefix="select2-selection"
                                    />
                                </div>
                                <div className="col-md-11 col-sm-9 m-2">
                                    <label htmlFor="type" className="form-label">* Nombre del servicio externo</label>
                                    <input className="form-control" type="text" id="type" value={name} onChange={(e) => { setName(e.target.value) }} />
                                </div>
                                <div className="col-md-11 col-sm-9 m-2">
                                    <label htmlFor="type" className="form-label">* Precio del servicio externo</label>
                                    <input className="form-control" type="number" id="type" value={price} onChange={(e) => { setPrice(e.target.value) }} />
                                </div>
                                <div className="col-md-11 col-sm-9 m-2">
                                    <label htmlFor="type" className="form-label">* Descripción del servicio externo</label>
                                    <input className="form-control" type="text" id="type" value={description} onChange={(e) => { setDescription(e.target.value) }} />
                                </div>

                            </Col>
                        </Row>
                    </Card>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default EditExtraService;