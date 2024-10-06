import React, { useState, useEffect } from "react";
import { Container, Row } from "reactstrap";
import Breadcrumbs from "../../../../components/Common/Breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import SpanSubtitleForm from "../../../../components/Forms/SpanSubtitleForm";
import { infoAlert } from "../../../../helpers/alert";
import { OBTENER_AREA_BY_ID, UPDATE_AREA } from "../../../../services/AreasOperativasService";

const EditOperativeAreas = () => {
    document.title = "Áreas Operativas | FARO";

    const navigate = useNavigate();

    const { id } = useParams();
    const { loading: loading_areas, error: error_areas, data: data_areas, startPolling, stopPolling } = useQuery(OBTENER_AREA_BY_ID, { variables: { id: id }, pollInterval: 1000 });
    const [actualizar] = useMutation(UPDATE_AREA);

    useEffect(() => {
        startPolling(1000)
        return () => {
            stopPolling()
        }
    }, [startPolling, stopPolling]);

    const [name, setName] = useState('');
    const [description, setDescripcion] = useState('');

    useEffect(() => {
        if (data_areas) {
            setName(data_areas.obtenerArea.nombre);
            setDescripcion(data_areas.obtenerArea.descripcion);
        }
    }, [data_areas])

    const [disableSave, setDisableSave] = useState(true);

    useEffect(() => {
        setDisableSave(name.trim().length === 0)
    }, [name])


    const onClickSave = async () => {
        try {
            setDisableSave(true)
            const input = {
                nombre: name,
                descripcion: description,
                estado: "ACTIVO"
            }

            const { data } = await actualizar({ variables: { id, input }, errorPolicy: 'all' })
            const { estado, message } = data.actualizarArea;
            if (estado) {
                infoAlert('Excelente', message, 'success', 3000, 'top-end')
                navigate('/hotelsettings/operativeareas');
            } else {
                infoAlert('Oops', message, 'error', 3000, 'top-end')
            }
        } catch (error) {
            infoAlert('Oops', 'Ocurrió un error inesperado al guardar el área', 'error', 3000, 'top-end')
            setDisableSave(false)
        }
    }

    if (loading_areas) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title="Nuevo área operativa" breadcrumbItem="Áreas operativas" breadcrumbItemUrl='/hotelsettings/operativeareas' />
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

    if (error_areas) {
        return null
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Nuevo área operativa" breadcrumbItem="Áreas operativas" breadcrumbItemUrl='/hotelsettings/operativeareas' />
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
                                    <SpanSubtitleForm subtitle='Información del área operativa' />
                                </div>
                            </Row>
                            <Row>
                                <div className="col-md-6 col-sm-12 mb-3">
                                    <label htmlFor="type" className="form-label">* Nombre del área</label>
                                    <input className="form-control" type="text" id="type" value={name} onChange={(e) => { setName(e.target.value) }} />
                                </div>
                            </Row>
                            <Row>
                                <div className="col-md-6 col-sm-12 mb-3">
                                    <label htmlFor="type" className="form-label">* Descripción del área</label>
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

export default EditOperativeAreas;