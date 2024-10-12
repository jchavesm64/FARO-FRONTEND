import React, { useState, useEffect } from "react";
import { Card, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../../../components/Common/Breadcrumb";
import Select from "react-select";
import SpanSubtitleForm from "../../../../components/Forms/SpanSubtitleForm";
import { infoAlert } from "../../../../helpers/alert";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { SAVE_SERVICIO } from "../../../../services/ServiciosExtraService";
import { OBTENER_TIPOSSERVICIOS } from "../../../../services/TipoServicioService";

const NewExtraService = () => {
    document.title = "Servicios Extra | FARO";

    const navigate = useNavigate();
    const { data: typesService } = useQuery(OBTENER_TIPOSSERVICIOS, { pollInterval: 1000 });
    const [insertar] = useMutation(SAVE_SERVICIO);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [typeService, setTypeService] = useState(null);

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
                tipo: typeService.value.id,
                estado: "ACTIVO"
            }

            const { data } = await insertar({ variables: { input }, errorPolicy: 'all' })
            const { estado, message } = data.insertarServicio;
            if (estado) {
                infoAlert('Excelente', message, 'success', 3000, 'top-end')
                navigate('/hotelsettings/extraservices');
            } else {
                infoAlert('Oops', message, 'error', 3000, 'top-end')
            }
        } catch (error) {
            infoAlert('Oops', 'Ocurrió un error inesperado al guardar el servicio', 'error', 3000, 'top-end')
            setDisableSave(false)
        }
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Editar servicio" breadcrumbItem="Servicio" breadcrumbItemUrl='/hotelsettings/extraservices' />
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
                                <SpanSubtitleForm subtitle='Información del servicio' />
                            </div>
                        </Row >
                        <Row className='d-flex justify-content-between shadow_service rounded-5'>
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
                                    <label htmlFor="type" className="form-label">* Nombre del servicio</label>
                                    <input className="form-control" type="text" id="type" value={name} onChange={(e) => { setName(e.target.value) }} />
                                </div>
                                <div className="col-md-11 col-sm-9 m-2">
                                    <label htmlFor="type" className="form-label">* Precio del servicio</label>
                                    <input className="form-control" type="number" id="type" value={price} onChange={(e) => { setPrice(e.target.value) }} />
                                </div>
                                <div className="col-md-11 col-sm-9 m-2">
                                    <label htmlFor="type" className="form-label">* Descripción del servicio</label>
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

export default NewExtraService;