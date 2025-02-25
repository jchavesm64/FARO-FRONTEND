import React, { useState, useEffect } from "react";
import { Card, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../../../components/Common/Breadcrumb";
import SpanSubtitleForm from "../../../../components/Forms/SpanSubtitleForm";
import { infoAlert } from "../../../../helpers/alert";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import Select from "react-select";
import { SAVE_TIPO_SERVICIOS } from "../../../../services/TipoServicioService";
import { iconTypeService } from "../../../../constants/routesConst";


const NewTypeService = () => {
    document.title = "Tipo Servicio | FARO";

    const navigate = useNavigate();

    const [insertar] = useMutation(SAVE_TIPO_SERVICIOS);

    const [name, setName] = useState('');
    const [cuantificable, setCuantificable] = useState(false);
    const [timeDay, setTimeDay] = useState(null);
    const [icon, setIcon] = useState(null);

    const [disableSave, setDisableSave] = useState(true);

    const timeOfDayOptions = [
        {
            label: 'Noche',
            value: 'Noche'
        },
        {
            label: 'Día',
            value: 'Día'
        },
        {
            label: 'Tarde',
            value: 'Tarde'
        },
        {
            label: 'No aplica',
            value: 'No aplica'
        }
    ];

    const getIcon = () => {
        const data = []
        if (iconTypeService) {
            iconTypeService.forEach((item) => {
                data.push({
                    "value": item.icon,
                    "label": <label className={`${item.icon}`}><span className="ms-2 fs-7">{item.label}</span></label>,
                    labelText: item.label

                });
            });
        }
        return data;
    };

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
                horadia: timeDay.value,
                icon: icon.value,
                estado: "ACTIVO"
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
            <div className="page-content " style={{ height: '50rem' }}>
                <Container fluid={true}>
                    <Breadcrumbs title="Nuevo tipo de servicio" breadcrumbItem="Tipo de servicio" breadcrumbItemUrl='/hotelsettings/typeservice' />
                    <Card className='p-4'>
                        <Row>
                            <div className="col mb-3 text-end">
                                <button type="button" className="btn btn-primary waves-effect waves-light" disabled={disableSave} onClick={() => onClickSave()}>
                                    Guardar{" "}
                                    <i className="ri-save-line align-middle ms-2"></i>
                                </button>
                            </div>
                        </Row>
                        <Row >
                            <div className="col mb-3">
                                <SpanSubtitleForm subtitle='Información del tipo de servicio' />
                            </div>
                        </Row>
                        <Row className='d-flex justify-content-between shadow_service rounded-5 p-3'>
                            <Col className="col-md-8 d-flex flex-wrap">
                                <div className="col-md-12 col-sm-9 m-2 d-flex">
                                    <div className="col-md-8 col-sm-12 ">
                                        <label htmlFor="type" className="form-label">* Nombre del tipo de servicio</label>
                                        <input className="form-control" type="text" id="type" value={name} onChange={(e) => { setName(e.target.value) }} />
                                    </div>
                                    <div className="form-check ms-3 mt-4 d-flex align-items-center flex-row-reverse p-0 ps-4">
                                        <label htmlFor="isSameAsCustomer" className="form-check-label ms-1">Cuantificable</label>
                                        <input
                                            className="form-check-input p-0"
                                            type="checkbox"
                                            id="isSameAsCustomer"
                                            readOnly
                                            checked={cuantificable}
                                            onClick={() => { handleOnClickIsQuantifiable() }}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-12 col-sm-9 m-2 d-flex justify-content-between">
                                    <div className="col-md-6 col-sm-12 ">
                                        <label htmlFor="icon" className="form-label">* Icono </label>
                                        <Select
                                            id="timeday"
                                            value={icon}
                                            onChange={(e) => {
                                                setIcon(e);
                                            }}
                                            options={getIcon()}
                                            classNamePrefix="select2-selection"
                                            isSearchable={true}
                                            getOptionLabel={(option) => option.labelText}
                                            formatOptionLabel={(option) => option.label}
                                        />
                                    </div>
                                    <div className="col-md-6 col-sm-12 ">
                                        <label htmlFor="timeday" className="form-label">* Hora del día </label>
                                        <Select
                                            id="timeday"
                                            value={timeDay}
                                            onChange={(e) => {
                                                setTimeDay(e);
                                            }}
                                            options={timeOfDayOptions}
                                            classNamePrefix="select2-selection"
                                        />
                                    </div>
                                </div>
                            </Col>

                        </Row>
                    </Card>
                </Container>
            </div>
        </React.Fragment>
    );

};

export default NewTypeService;