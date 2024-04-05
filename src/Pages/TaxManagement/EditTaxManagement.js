import React, { useState, useEffect } from "react";
import { Container, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import SpanSubtitleForm from "../../components/Forms/SpanSubtitleForm";
import { infoAlert } from "../../helpers/alert";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from 'react-router-dom';
import { OBTENER_IMPUESTO_BY_ID, UPDATE_IMPUESTO } from "../../services/ImpuestoService";


const EditTaxManagement = (props) => {
    document.title = "Impuestos | FARO";

    const navigate = useNavigate();

    const [taxName, setTaxName] = useState('')
    const [taxValue, setTaxValue] = useState('')

    const { id } = useParams();
    const { loading: loading_tax, error: error_tax, data: data_tax, startPolling, stopPolling } = useQuery(OBTENER_IMPUESTO_BY_ID, { variables: { id: id }, pollInterval: 1000 });

    useEffect(() => {
        startPolling(1000)
        return () => {
            stopPolling()
        }
    }, [startPolling, stopPolling])

    const [actualizar] = useMutation(UPDATE_IMPUESTO);

    useEffect(() => {
        if (data_tax) {
            setTaxName(data_tax.obtenerImpuestoById.nombre)
            setTaxValue(data_tax.obtenerImpuestoById.valor)
        }
    }, [data_tax])

    const [disableSave, setDisableSave] = useState(true);

    useEffect(() => {
        setDisableSave(taxName === '' || taxValue === '')
    }, [taxName, taxValue])

    const onClickSave = async () => {
        try {
            setDisableSave(true)
            const input = {
                nombre: taxName,
                valor: taxValue,
                estado: "ACTIVO"
            }
            const id = data_tax.obtenerImpuestoById.id
            const { data } = await actualizar({ variables: { id, input }, errorPolicy: 'all' });
            const { estado, message } = data.actualizarImpuesto;
            if (estado) {
                infoAlert('Excelente', message, 'success', 3000, 'top-end')
                navigate('/taxmanagement');
            } else {
                infoAlert('Oops', message, 'error', 3000, 'top-end')
            }
            setDisableSave(false)
        } catch (error) {
            infoAlert('Oops', 'Ocurrió un error inesperado al guardar el impuesto', 'error', 3000, 'top-end')
            setDisableSave(false)
        }
    }

    if (loading_tax) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title="Editar impuesto" breadcrumbItem="Gestión de impuestos" breadcrumbItemUrl="/taxmanagement" />
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
    if (error_tax) {
        return null
    }
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Impuesto nuevo" breadcrumbItem="Gestión de impuestos" breadcrumbItemUrl="/taxmanagement" />
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
                                    <SpanSubtitleForm subtitle='Información del impuesto' />
                                </div>
                            </Row>
                            <Row>
                                <div className="col-md-6 col-sm-12 mb-3">
                                    <label htmlFor="name" className="form-label">* Nombre del impuesto</label>
                                    <input className="form-control" type="text" id="name" value={taxName} onChange={(e) => { setTaxName(e.target.value) }} />
                                </div>
                                <div className="col-md-6 col-sm-12 mb-3">
                                    <label htmlFor="value" className="form-label">* Valor del impuesto</label>
                                    <input className="form-control" type="text" id="value" value={taxValue} onChange={(e) => { setTaxValue(e.target.value) }} />
                                </div>
                            </Row>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
}

export default EditTaxManagement;