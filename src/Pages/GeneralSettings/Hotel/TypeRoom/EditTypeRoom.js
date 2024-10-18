import React, { useState, useEffect } from "react";
import { Card, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../../../components/Common/Breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { OBTENER_TIPOSHABITACION_BY_ID, UPDATE_TIPO_HABITACION } from "../../../../services/TipoHabitacionService";
import SpanSubtitleForm from "../../../../components/Forms/SpanSubtitleForm";
import { infoAlert } from "../../../../helpers/alert";

const EditTypeRoom = () => {
    document.title = "Tipo de habitaciones | FARO";

    const navigate = useNavigate();

    const { id } = useParams();
    const { loading: loading_typeroom, error: error_typeroom, data: data_typeroom, startPolling, stopPolling } = useQuery(OBTENER_TIPOSHABITACION_BY_ID, { variables: { id: id }, pollInterval: 1000 });
    const [actualizar] = useMutation(UPDATE_TIPO_HABITACION)

    useEffect(() => {
        startPolling(1000)
        return () => {
            stopPolling()
        }
    }, [startPolling, stopPolling])

    const [name, setName] = useState('')
    const [description, setDescripcion] = useState('')
    const [basePrice, setBasePrice] = useState(0)

    useEffect(() => {
        if (data_typeroom) {
            setName(data_typeroom.obtenerTipoHabitacionById.nombre)
            setDescripcion(data_typeroom.obtenerTipoHabitacionById.descripcion)
            setBasePrice(data_typeroom.obtenerTipoHabitacionById.precioBase)
        }
    }, [data_typeroom])

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
            const { data } = await actualizar({ variables: { id, input }, errorPolicy: 'all' })
            const { estado, message } = data.actualizarTipoHabitacion;
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

    if (loading_typeroom) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title="Editar tipo de habitación" breadcrumbItem="Tipo de habitación" breadcrumbItemUrl='/hotelsettings/typeroom' />
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

    if (error_typeroom) {
        return null
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
                        <Row className='d-flex justify-content-between shadow_service rounded-5 p-3'>
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

export default EditTypeRoom;