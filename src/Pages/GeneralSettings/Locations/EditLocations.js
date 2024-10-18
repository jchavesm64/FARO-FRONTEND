import React, { useState, useEffect } from "react";
import { Container, Row } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import SpanSubtitleForm from "../../../components/Forms/SpanSubtitleForm";
import { infoAlert } from "../../../helpers/alert";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from 'react-router-dom';
import { OBTENER_UBICACION_BY_ID, UPDATE_UBICACION } from "../../../services/UbicacionService";

const EditLocation = () => {
    document.title = "Ubicaciones | FARO";

    const navigate = useNavigate();

    const { id } = useParams();
    const { loading: loading_location, error: error_location, data: data_location, startPolling, stopPolling } = useQuery(OBTENER_UBICACION_BY_ID, { variables: { id: id }, pollInterval: 1000 });
    const [actualizar] = useMutation(UPDATE_UBICACION);
    const [disableSave, setDisableSave] = useState(true);

    useEffect(() => {
        startPolling(1000)
        return () => {
            stopPolling()
        }
    }, [startPolling, stopPolling])

    const [locationName, setLocationName] = useState('');

    useEffect(() => {
        setDisableSave(locationName === '')
    }, [locationName])

    useEffect(() => {
        if (data_location) {
            setLocationName(data_location.obtenerUbicacionById.nombre)
        }
    }, [data_location])

    const onClickSave = async () => {
        try {
            setDisableSave(true)
            const input = {
                nombre: locationName,
                estado: "ACTIVO"
            }
            const id = data_location.obtenerUbicacionById.id;
            const { data } = await actualizar({ variables: { id, input }, errorPolicy: 'all' });
            const { estado, message } = data.actualizarUbicacion;
            if (estado) {
                infoAlert('Excelente', message, 'success', 3000, 'top-end')
                navigate('/locations');
            } else {
                infoAlert('Oops', message, 'error', 3000, 'top-end')
            }
            setDisableSave(false)
        } catch (error) {
            console.log(error)
            infoAlert('Oops', 'Ocurrió un error inesperado al guardar la ubicación', 'error', 3000, 'top-end')
            setDisableSave(false)
        }
    }

    if (loading_location) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title="Editar Ubicación" breadcrumbItem="Gestion de Ubicaciones" breadcrumbItemUrl='/locations' />
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
    if (error_location) {
        return null
    }
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Editar Ubicación" breadcrumbItem="Gestion de Ubicaciones" breadcrumbItemUrl='/locations' />
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
                                    <SpanSubtitleForm subtitle='Información de la Ubicación' />
                                </div>
                            </Row>
                            <Row>
                                <div className="col-md-6 col-sm-12 mb-3">
                                    <label htmlFor="name" className="form-label">* Nombre de ubicación</label>
                                    <input className="form-control" type="text" id="name" value={locationName} onChange={(e) => { setLocationName(e.target.value) }} />
                                </div>
                            </Row>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
}

export default EditLocation;