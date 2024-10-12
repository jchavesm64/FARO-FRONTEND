import React, { useState, useEffect } from "react";
import { Card, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../../../components/Common/Breadcrumb";
import SpanSubtitleForm from "../../../../components/Forms/SpanSubtitleForm";
import { infoAlert } from "../../../../helpers/alert";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { SAVE_TIPO_HABITACION } from "../../../../services/TipoHabitacionService";

const NewTypeRoom = () => {
    document.title = "Tipo Habitación | FARO";

    const navigate = useNavigate();
    const [insertar] = useMutation(SAVE_TIPO_HABITACION);

    const [name, setName] = useState('')
    const [description, setDescripcion] = useState('')
    const [basePrice, setBasePrice] = useState(0)

    const [disableSave, setDisableSave] = useState(true);

    useEffect(() => {
        setDisableSave(name.trim().length === 0 || basePrice.length === 0)
    }, [name, basePrice])

    const onClickSave = async () => {
        try {
            setDisableSave(true)
            const input = {
                nombre: name,
                descripcion: description,
                precioBase: basePrice,
                estado: "ACTIVO"
            }

            const { data } = await insertar({ variables: { input }, errorPolicy: 'all' })
            const { estado, message } = data.insertarTipoHabitacion;
            if (estado) {
                infoAlert('Excelente', message, 'success', 3000, 'top-end')
                navigate('/hotelsettings/typeroom');
            } else {
                infoAlert('Oops', message, 'error', 3000, 'top-end')
            }
        } catch (error) {
            infoAlert('Oops', 'Ocurrió un error inesperado al guardar el tipo de habitación', 'error', 3000, 'top-end')
            setDisableSave(false)
        }
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Nuevo tipo de habitación" breadcrumbItem="Tipo de habitación" breadcrumbItemUrl='/hotelsettings/typeroom' />
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
                                <SpanSubtitleForm subtitle='Información de la Habitación' />
                            </div>
                        </Row>
                        <Row className='d-flex justify-content-between shadow_service rounded-5'>
                            <Col className="col-md-6  d-flex justify-content-center flex-wrap">
                                <div className="col-md-11 col-sm-9 m-2">
                                    <label htmlFor="type" className="form-label">* Nombre del tipo de habitación</label>
                                    <input className="form-control" type="text" id="type" value={name} onChange={(e) => { setName(e.target.value) }} />
                                </div>
                                <div className="col-md-11 col-sm-9 m-2">
                                    <label htmlFor="type" className="form-label">* Precio base del tipo de habitación</label>
                                    <input className="form-control" type="number" id="type" value={basePrice} onChange={(e) => { setBasePrice(e.target.value) }} />
                                </div>
                                <div className="col-md-11 col-sm-9 m-2">
                                    <label htmlFor="type" className="form-label">* Descripción del tipo de habitación</label>
                                    <textarea className="form-control" type="text" id="type" value={description} onChange={(e) => { setDescripcion(e.target.value) }} />
                                </div>
                            </Col>

                        </Row>
                    </Card>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default NewTypeRoom;