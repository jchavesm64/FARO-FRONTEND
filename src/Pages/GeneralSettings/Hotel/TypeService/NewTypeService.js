import React, { useState, useEffect } from "react";
import { Container, Row } from "reactstrap";
import Breadcrumbs from "../../../../components/Common/Breadcrumb";
import SpanSubtitleForm from "../../../../components/Forms/SpanSubtitleForm";
import { infoAlert } from "../../../../helpers/alert";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { SAVE_TIPO_SERVICIOS } from "../../../../services/TipoServicioService";


const NewTypeService = () => {
    document.title = "Tipo Servicio | FARO";

    const navigate = useNavigate();

    const [insertar] = useMutation(SAVE_TIPO_SERVICIOS);

    const [name, setName] = useState('');
    const [cuantificable, setCuantificable] = useState(false);

    const [disableSave, setDisableSave] = useState(true);

    useEffect(() => {
        setDisableSave(name.trim().length === 0)
    }, [name]);

    const handleOnClickIsQuantifiable = () => {
        setCuantificable(!cuantificable)
    };

    const onClickSave = async () => {
        try {
            setDisableSave(true)
            const input = {
                nombre: name,
                cuantificable,
                estado: "Activo"
            };
            const { data } = await insertar({ variables: { input }, errorPolicy: 'all' });
            const { estado, message } = data.insertarTipoServicio;
            if (estado) {
                infoAlert('Excelente', message, 'success', 3000, 'top-end')
                navigate('/hotelsettings/typeservice');
            } else {
                infoAlert('Oops', message, 'error', 3000, 'top-end')
            }
            setDisableSave(false)
        } catch (error) {
            infoAlert('Oops', 'Ocurrió un error inesperado al guardar el tipo de servicio', 'error', 3000, 'top-end')
            setDisableSave(false)
        }
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Nuevo tipo de servicio" breadcrumbItem="Tipo de servicio" breadcrumbItemUrl='/hotelsettings/typeservice' />
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
                                    <SpanSubtitleForm subtitle='Información del tipo de servicio' />
                                </div>
                            </Row>

                            <Row className="d-flex flex-nowrap">
                                <div className="col-md-4 col-sm-12 mb-3">
                                    <label htmlFor="type" className="form-label">* Nombre del tipo de habitación</label>
                                    <input className="form-control" type="text" id="type" value={name} onChange={(e) => { setName(e.target.value) }} />
                                </div>
                                <div className="form-check ms-3 mt-4">
                                    <label htmlFor="isSameAsCustomer" className="form-check-label ms-1">Cuantificable</label>
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="isSameAsCustomer"
                                        readOnly
                                        checked={cuantificable}
                                        onClick={() => { handleOnClickIsQuantifiable() }}
                                    />
                                </div>
                            </Row>


                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )

};

export default NewTypeService;