import React, { useState, useEffect } from "react";
import { Container, Row } from "reactstrap";
import Breadcrumbs from "../../../../components/Common/Breadcrumb";
import SpanSubtitleForm from "../../../../components/Forms/SpanSubtitleForm";
import { infoAlert } from "../../../../helpers/alert";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { useMutation, useQuery } from "@apollo/client";
import { OBTENER_TIPOSSERVICIOSBYID, UPDATE_TIPO_SERVICIOS } from "../../../../services/TipoServicioService";


const EditTypeService = () => {
    document.title = "Tipo Servicio | FARO";

    const navigate = useNavigate();

    const { id } = useParams();
    const { loading: loading_typeservice, error: error_typeservice, data: data_typeservice, startPolling, stopPolling } = useQuery(OBTENER_TIPOSSERVICIOSBYID, { variables: { id: id }, pollInterval: 1000 });
    const [actualizar] = useMutation(UPDATE_TIPO_SERVICIOS)

    useEffect(() => {
        startPolling(1000)
        return () => {
            stopPolling()
        }
    }, [startPolling, stopPolling])


    const [name, setName] = useState('');
    const [cuantificable, setCuantificable] = useState(false);
    const [timeDay, setTimeDay] = useState(null);

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


    const stringToBoolean = (str) => {
        return str.toLowerCase() === "true";
    };

    useEffect(() => {
        if (data_typeservice) {
            setName(data_typeservice.obtenerTipoServicioId.nombre);
            setCuantificable(stringToBoolean(data_typeservice.obtenerTipoServicioId.cuantificable));
            setTimeDay({
                label: data_typeservice.obtenerTipoServicioId.horadia,
                value: data_typeservice.obtenerTipoServicioId.horadia
            })
        }
    }, [data_typeservice])

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
                estado: "ACTIVO"
            };
            const { data } = await actualizar({ variables: { id, input }, errorPolicy: 'all' });
            const { estado, message } = data.actualizarTipoServicio;
            console.log(data)
            if (estado) {
                infoAlert('Excelente', message, 'success', 3000, 'top-end')
                navigate('/hotelsettings/typeservice');
            } else {
                infoAlert('Oops', message, 'error', 3000, 'top-end')
            }
            setDisableSave(false)
        } catch (error) {
            infoAlert('Oops', 'Ocurrió un error inesperado al actualizar el tipo de servicio', 'error', 3000, 'top-end')
            setDisableSave(false)
        }
    };

    if (loading_typeservice) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title="Editar tipo de servicio" breadcrumbItem="Tipo de servicio" breadcrumbItemUrl='/hotelsettings/typeservice' />
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

    if (error_typeservice) {
        return null
    }

    return (
        <React.Fragment>
            <div className="page-content" style={{ height: '35rem' }}>
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
                                    <label htmlFor="type" className="form-label">* Nombre del tipo de servicio</label>
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
                            <Row>
                                <div className="col-md-4 col-sm-12 ">
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
                            </Row>


                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )

};

export default EditTypeService;