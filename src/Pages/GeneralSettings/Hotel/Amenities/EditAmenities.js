import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { OBTENER_COMODIDADES_BY_ID, UPDATE_COMODIDAD } from "../../../../services/ComodidadesService";
import { infoAlert } from "../../../../helpers/alert";
import { Card, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../../../components/Common/Breadcrumb";
import SpanSubtitleForm from "../../../../components/Forms/SpanSubtitleForm";

const EditAmenities = () => {
    document.title = "Comodidades | FARO";

    const navigate = useNavigate();

    const { id } = useParams();
    const { loading: loading_amenites, error: error_amenites, data: data_amenites, startPolling, stopPolling } = useQuery(OBTENER_COMODIDADES_BY_ID, { variables: { id: id }, pollInterval: 1000 });
    const [actualizar] = useMutation(UPDATE_COMODIDAD)

    useEffect(() => {
        startPolling(1000)
        return () => {
            stopPolling()
        }
    }, [startPolling, stopPolling])

    const [name, setName] = useState('')
    const [description, setDescripcion] = useState('')

    useEffect(() => {
        if (data_amenites) {
            setName(data_amenites.obtenerComodidadById.nombre)
            setDescripcion(data_amenites.obtenerComodidadById.descripcion)
        }
    }, [data_amenites])

    const [disableSave, setDisableSave] = useState(true);

    useEffect(() => {
        setDisableSave(name.trim().length === 0)
    }, [name])

    const onClickSave = async () => {
        try {
            debugger
            setDisableSave(true)
            const input = {
                nombre: name,
                descripcion: description,
                estado: "ACTIVO"
            }

            const { data } = await actualizar({ variables: { id, input }, errorPolicy: 'all' })
            const { estado, message } = data.actualizarComodidad;

            if (estado) {
                infoAlert('Excelente', message, 'success', 3000, 'top-end')
                navigate('/hotelsettings/amenities');
            } else {
                infoAlert('Oops', message, 'error', 3000, 'top-end')
            }
        } catch (error) {
            infoAlert('Oops', 'Ocurrió un error inesperado al guardar el tipo de comodidad', 'error', 3000, 'top-end')
            setDisableSave(false)
        }
    }

    if (loading_amenites) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title="Editar tipo de comodidad" breadcrumbItem="Comodidad" breadcrumbItemUrl='/hotelsettings/amenities' />
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

    if (error_amenites) {
        return null
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Nuevo tipo de comodidad" breadcrumbItem="Tipo de comodidad" breadcrumbItemUrl='/hotelsettings/amenities' />
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
                                <SpanSubtitleForm subtitle='Información de la ubicación' />
                            </div>
                        </Row>
                        <Row className='d-flex justify-content-between shadow_service rounded-5'>
                            <Col className="col-md-6  d-flex justify-content-center flex-wrap">
                                <div className="col-md-11 col-sm-9 m-2">
                                    <label htmlFor="type" className="form-label">* Nombre del tipo de comodidad</label>
                                    <input className="form-control" type="text" id="type" value={name} onChange={(e) => { setName(e.target.value) }} />
                                </div>
                                <div className="col-md-11 col-sm-9 m-2">
                                    <label htmlFor="type" className="form-label">* Descripción del tipo de comodidad</label>
                                    <input className="form-control" type="text" id="type" value={description} onChange={(e) => { setDescripcion(e.target.value) }} />
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </Container>
            </div>
        </React.Fragment>
    );
}

export default EditAmenities;