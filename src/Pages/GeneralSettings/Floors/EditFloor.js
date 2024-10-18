import React, { useState, useEffect } from "react";
import { Container, Row } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import SpanSubtitleForm from "../../../components/Forms/SpanSubtitleForm";
import { infoAlert } from "../../../helpers/alert";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from 'react-router-dom';
import { OBTENER_PISO_BY_ID, UPDATE_PISO } from "../../../services/PisoService";

const EditFloor = () => {
    document.title = "Pisos | FARO";

    const navigate = useNavigate();

    const { id } = useParams();
    const { loading: loading_floor, error: error_floor, data: data_floor, startPolling, stopPolling } = useQuery(OBTENER_PISO_BY_ID, { variables: { id: id }, pollInterval: 1000 });
    const [actualizar] = useMutation(UPDATE_PISO);
    const [disableSave, setDisableSave] = useState(true);

    useEffect(() => {
        startPolling(1000)
        return () => {
            stopPolling()
        }
    }, [startPolling, stopPolling])

    const [floorName, setFloorName] = useState('');

    useEffect(() => {
        setDisableSave(floorName === '')
    }, [floorName])

    useEffect(() => {
        if (data_floor) {
            setFloorName(data_floor.obtenerPisoById.nombre)
        }
    }, [data_floor])

    const onClickSave = async () => {
        try {
            setDisableSave(true)
            const input = {
                nombre: floorName,
                estado: "ACTIVO"
            }
            const id = data_floor.obtenerPisoById.id;
            const { data } = await actualizar({ variables: { id, input }, errorPolicy: 'all' });
            const { estado, message } = data.actualizarPiso;
            if (estado) {
                infoAlert('Excelente', message, 'success', 3000, 'top-end')
                navigate('/floors');
            } else {
                infoAlert('Oops', message, 'error', 3000, 'top-end')
            }
            setDisableSave(false)
        } catch (error) {
            console.log(error)
            infoAlert('Oops', 'Ocurrió un error inesperado al guardar el Piso', 'error', 3000, 'top-end')
            setDisableSave(false)
        }
    }

    if (loading_floor) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title="Editar Piso" breadcrumbItem="Gestion de Pisos" breadcrumbItemUrl='/floors' />
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
    if (error_floor) {
        return null
    }
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Editar Piso" breadcrumbItem="Gestion de Pisos" breadcrumbItemUrl='/floors' />
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
                                    <SpanSubtitleForm subtitle='Información del Piso' />
                                </div>
                            </Row>
                            <Row>
                                <div className="col-md-6 col-sm-12 mb-3">
                                    <label htmlFor="name" className="form-label">* Nombre del Piso</label>
                                    <input className="form-control" type="text" id="name" value={floorName} onChange={(e) => { setFloorName(e.target.value) }} />
                                </div>
                            </Row>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
}

export default EditFloor;