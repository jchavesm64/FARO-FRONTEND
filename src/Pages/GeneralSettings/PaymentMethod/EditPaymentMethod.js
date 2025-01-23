import React, { useState, useEffect } from "react";
import { Container, Row } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import SpanSubtitleForm from "../../../components/Forms/SpanSubtitleForm";
import { infoAlert } from "../../../helpers/alert";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from 'react-router-dom';
import { OBTENER_TIPOS_METODO_PAGO_BY_ID, UPDATE_TIPO_METODO_PAGO } from "../../../services/TipoMetodoPagoService";

const EditPaymentMethod = () => {
    document.title = "Métodos de Pago | FARO";

    const navigate = useNavigate();

    const { id } = useParams();
    const { loading: loading_paymentMethod, error: error_paymentMethod, data: data_paymentMethod, startPolling, stopPolling } = useQuery(OBTENER_TIPOS_METODO_PAGO_BY_ID, { variables: { id: id }, pollInterval: 1000 });
    const [actualizar] = useMutation(UPDATE_TIPO_METODO_PAGO);

    useEffect(() => {
        startPolling(1000)
        return () => {
            stopPolling()
        }
    }, [startPolling, stopPolling])

    const [paymentName, setPaymentName] = useState('');

    useEffect(() => {
        if (data_paymentMethod) {
            setPaymentName(data_paymentMethod.obtenerTipoMetodoPagoById.nombre)
        }
    }, [data_paymentMethod])

    const [disableSave, setDisableSave] = useState(true);

    useEffect(() => {
        setDisableSave(paymentName === '')
    }, [paymentName])

    const onClickSave = async () => {
        try {
            setDisableSave(true)
            const input = {
                nombre: paymentName,
                estado: "ACTIVO"
            }
            const id = data_paymentMethod.obtenerTipoMetodoPagoById.id;
            const { data } = await actualizar({ variables: { id, input }, errorPolicy: 'all' });
            const { estado, message } = data.actualizarTipoMetodoPago;
            if (estado) {
                infoAlert('Excelente', message, 'success', 3000, 'top-end')
                navigate('/paymentmethods');
            } else {
                infoAlert('Oops', message, 'error', 3000, 'top-end')
            }
            setDisableSave(false)
        } catch (error) {
            console.log(error)
            infoAlert('Oops', 'Ocurrió un error inesperado al guardar el metodo de pago', 'error', 3000, 'top-end')
            setDisableSave(false)
        }
    }

    if (loading_paymentMethod) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title="Editar Método de Pago" breadcrumbItem="Gestion de Métodos de Pago" breadcrumbItemUrl='/paymentmethods' />
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
    if (error_paymentMethod) {
        return null
    }
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Editar Método de Pago" breadcrumbItem="Gestion de Métodos de Pago" breadcrumbItemUrl='/paymentmethods' />
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
                                    <SpanSubtitleForm subtitle='Información del Método de Pago' />
                                </div>
                            </Row>
                            <Row>
                                <div className="col-md-6 col-sm-12 mb-3">
                                    <label htmlFor="type" className="form-label">* Nombre</label>
                                    <input className="form-control" type="text" id="type" value={paymentName} onChange={(e) => { setPaymentName(e.target.value) }} />
                                </div>
                            </Row>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
}

export default EditPaymentMethod;