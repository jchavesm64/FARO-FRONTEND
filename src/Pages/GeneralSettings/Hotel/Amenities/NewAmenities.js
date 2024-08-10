import React, { useState, useEffect } from "react";
import { Container, Row } from "reactstrap";
import Breadcrumbs from "../../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import SpanSubtitleForm from "../../../../components/Forms/SpanSubtitleForm";
import { infoAlert } from "../../../../helpers/alert";
import { SAVE_COMODIDAD } from "../../../../services/ComodidadesService";

const NewAmenities = () => {
    document.title = "Comodidades | FARO";

    const navigate = useNavigate();
    const [insertar] = useMutation(SAVE_COMODIDAD)

    const [name, setName] = useState('')
    const [description, setDescripcion] = useState('')

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

            const { data } = await insertar({ variables: { input }, errorPolicy: 'all' })
            const { estado, message } = data.insertarComodidad;

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

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Nuevo tipo de comodidad" breadcrumbItem="Tipo de comodidad" breadcrumbItemUrl='/hotelsettings/amenities' />
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
                                    <label htmlFor="type" className="form-label">* Nombre del tipo de comodidad</label>
                                    <input className="form-control" type="text" id="type" value={name} onChange={(e) => { setName(e.target.value) }} />
                                </div>
                            </Row>
                            <Row>
                                <div className="col-md-6 col-sm-12 mb-3">
                                    <label htmlFor="type" className="form-label">* Descripción del tipo de comodidad</label>
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

export default NewAmenities;