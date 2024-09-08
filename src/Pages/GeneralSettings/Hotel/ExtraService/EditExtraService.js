import React, { useState, useEffect } from "react";
import { Container, Row } from "reactstrap";
import Breadcrumbs from "../../../../components/Common/Breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import SpanSubtitleForm from "../../../../components/Forms/SpanSubtitleForm";
import { infoAlert } from "../../../../helpers/alert";
import { OBTENER_SERVICIO_BY_ID, UPDATE_SERVICIO } from "../../../../services/ServiciosExtraService";

const EditExtraService = () => {
    document.title = "Servicios Extra | FARO";

    const navigate = useNavigate();

    const { id } = useParams();
    const { loading: loading_extraservice, error: error_extraservice, data: data_extraservice, startPolling, stopPolling } = useQuery(OBTENER_SERVICIO_BY_ID, { variables: { id: id }, pollInterval: 1000 });
    const [actualizar] = useMutation(UPDATE_SERVICIO)

    useEffect(() => {
        startPolling(1000)
        return () => {
            stopPolling()
        }
    }, [startPolling, stopPolling])

    const [name, setName] = useState('')
    const [description, setDescripcion] = useState('')
    const [price, setPrice] = useState(0)

    useEffect(() => {
        if (data_extraservice) {
            setName(data_extraservice.obtenerServicio.nombre)
            setDescripcion(data_extraservice.obtenerServicio.descripcion)
            setPrice(data_extraservice.obtenerServicio.precio)
        }
    }, [data_extraservice])

    const [disableSave, setDisableSave] = useState(true);

    useEffect(() => {
        setDisableSave(name.trim().length === 0 || price.length === 0)
    }, [name, price])

    const onClickSave = async () => {
        try {
            setDisableSave(true)
            const input = {
                nombre: name,
                descripcion: description,
                precio: price,
                estado: "ACTIVO"
            }

            const { data } = await actualizar({ variables: { id, input }, errorPolicy: 'all' })
            const { estado, message } = data.actualizarServicio;
            if (estado) {
                infoAlert('Excelente', message, 'success', 3000, 'top-end')
                navigate('/hotelsettings/extraservices');
            } else {
                infoAlert('Oops', message, 'error', 3000, 'top-end')
            }
        } catch (error) {
            console.log(error)
            infoAlert('Oops', 'Ocurrió un error inesperado al guardar el servicio', 'error', 3000, 'top-end')
            setDisableSave(false)
        }
    }

    if (loading_extraservice) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title="Editar servicio" breadcrumbItem="servicio" breadcrumbItemUrl='/hotelsettings/extraservice' />
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
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Editar servicio" breadcrumbItem="Servicio" breadcrumbItemUrl='/hotelsettings/extraservices' />
                    <Row>
                        <div className="col mb-3 text-end">
                            <button type="button" className="btn btn-primary waves-effect waves-light" disabled={disableSave} onClick={() => onClickSave()}>
                                Guardar{" "}
                                <i className="ri-save-line align-middle ms-2"></i>
                            </button>
                        </div>
                    </Row>
                    <Row>
                        <div className="col-md-12 col-sm-12">
                            <Row>
                                <div className="col mb-3">
                                    <SpanSubtitleForm subtitle='Información de la ubicación' />
                                </div>
                            </Row>
                            <Row>
                                <div className="col-md-6 col-sm-12 mb-3">
                                    <label htmlFor="type" className="form-label">* Nombre del servicio</label>
                                    <input className="form-control" type="text" id="type" value={name} onChange={(e) => { setName(e.target.value) }} />
                                </div>
                            </Row>
                            <Row>
                                <div className="col-md-6 col-sm-12 mb-3">
                                    <label htmlFor="type" className="form-label">* Precio del servicio</label>
                                    <input className="form-control" type="number" id="type" value={price} onChange={(e) => { setPrice(e.target.value) }} />
                                </div>

                            </Row>
                            <Row>
                                <div className="col-md-6 col-sm-12 mb-3">
                                    <label htmlFor="type" className="form-label">* Descripción del servicio</label>
                                    <input className="form-control" type="text" id="type" value={description} onChange={(e) => { setDescripcion(e.target.value) }} />
                                </div>
                            </Row>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default EditExtraService;