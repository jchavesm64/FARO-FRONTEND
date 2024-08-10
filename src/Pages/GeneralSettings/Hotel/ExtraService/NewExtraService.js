import React, { useState, useEffect } from "react";
import { Container, Row } from "reactstrap";
import Breadcrumbs from "../../../../components/Common/Breadcrumb";
import SpanSubtitleForm from "../../../../components/Forms/SpanSubtitleForm";
import { infoAlert } from "../../../../helpers/alert";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { SAVE_SERVICIO } from "../../../../services/ServiciosExtraService";

const NewExtraService = () => {
    document.title = "Servicios Extra | FARO";

    const navigate = useNavigate();
    const [insertar] = useMutation(SAVE_SERVICIO);

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState(0)

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

            debugger
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
                    <Breadcrumbs title="Nuevo servicio" breadcrumbItem="servicio" breadcrumbItemUrl='/hotelsettings/extraservices' />
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
                                    <input className="form-control" type="text" id="type" value={description} onChange={(e) => { setDescription(e.target.value) }} />
                                </div>
                            </Row>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default NewExtraService;