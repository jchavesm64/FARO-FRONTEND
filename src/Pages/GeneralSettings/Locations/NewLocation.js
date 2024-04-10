import React, { useState, useEffect } from "react";
import { Container, Row } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import SpanSubtitleForm from "../../../components/Forms/SpanSubtitleForm";
import { infoAlert } from "../../../helpers/alert";
import { useMutation } from "@apollo/client";
import { useNavigate } from 'react-router-dom';
import { SAVE_UBICACION } from "../../../services/UbicacionService";

const NewLocation = () => {
    document.title = "Proveeduría | FARO";

    const navigate = useNavigate();
    const [insertar] = useMutation(SAVE_UBICACION);

    const [nuevo, setNuevo] = useState('');

    const [disableSave, setDisableSave] = useState(true);

    const handleNuevo = (e) => {
        setNuevo(e.target.value)
    }

    useEffect(() => {
        setDisableSave(nuevo === '')
    }, [nuevo])

    const onClickSave = async () => {
        try {
            setDisableSave(true)
            const input = {
                nombre: nuevo,
                estado: "ACTIVO"
            }
            const { data } = await insertar({ variables: { input }, errorPolicy: 'all' });
            const { estado, message } = data.insertarUbicacion;
            if (estado) {
                infoAlert('Excelente', message, 'success', 3000, 'top-end')
                navigate('/locations');
            } else {
                infoAlert('Oops', message, 'error', 3000, 'top-end')
            }
            setDisableSave(false)
        } catch (error) {
            infoAlert('Oops', 'Ocurrió un error inesperado al guardar la ubucación', 'error', 3000, 'top-end')
            setDisableSave(false)
        }
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Nueva ubicación" breadcrumbItem="Ubicaciones" breadcrumbItemUrl='/locations' />
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
                                    <label htmlFor="type" className="form-label">* Nombre de ubicación</label>
                                    <input className="form-control" type="text" id="type" value={nuevo} onChange={(e) => { handleNuevo(e) }} />
                                </div>
                            </Row>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
}

export default NewLocation;