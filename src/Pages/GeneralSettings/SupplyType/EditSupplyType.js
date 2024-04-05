import React, { useState, useEffect } from "react";
import { Container, Row } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import SpanSubtitleForm from "../../../components/Forms/SpanSubtitleForm";
import { infoAlert } from "../../../helpers/alert";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from 'react-router-dom';
import { OBTENER_TIPO_PROVEDURIA_BY_ID, UPDATE_TIPO_PROVEDURIA } from "../../../services/TipoProveduriaService";

const EditSupplyType = () => {
    document.title = "Proveeduría | FARO";

    const navigate = useNavigate();

    const { id } = useParams();
    const { loading: loading_supply, error: error_supply, data: data_supply, startPolling, stopPolling } = useQuery(OBTENER_TIPO_PROVEDURIA_BY_ID, { variables: { id: id }, pollInterval: 1000 });
    const [actualizar] = useMutation(UPDATE_TIPO_PROVEDURIA);

    useEffect(() => {
        startPolling(1000)
        return () => {
            stopPolling()
        }
    }, [startPolling, stopPolling])

    const [supplyType, setSupplyType] = useState('');

    useEffect(() => {
        if (data_supply) {
            setSupplyType(data_supply.obtenerTipoProveduriaById.tipo)
        }
    }, [data_supply])

    const [disableSave, setDisableSave] = useState(true);

    useEffect(() => {
        setDisableSave(supplyType === '')
    }, [supplyType])

    const onClickSave = async () => {
        try {
            setDisableSave(true)
            const input = {
                tipo: supplyType,
                estado: "ACTIVO"
            }
            const id = data_supply.obtenerTipoProveduriaById.id;
            const { data } = await actualizar({ variables: { id, input }, errorPolicy: 'all' });
            const { estado, message } = data.actualizarTipoProveduria;
            if (estado) {
                infoAlert('Excelente', message, 'success', 3000, 'top-end')
                navigate('/suppliertype');
            } else {
                infoAlert('Oops', message, 'error', 3000, 'top-end')
            }
            setDisableSave(false)
        } catch (error) {
            console.log(error)
            infoAlert('Oops', 'Ocurrió un error inesperado al guardar el tipo de proveeduría', 'error', 3000, 'top-end')
            setDisableSave(false)
        }
    }

    if (loading_supply) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title="Editar Tipo de Proveeduría" breadcrumbItem="Gestion de Tipos de Proveeduría" breadcrumbItemUrl='/suppliertype' />
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
    if (error_supply) {
        return null
    }
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Editar Tipo de Proveeduría" breadcrumbItem="Gestion de Tipos de Proveeduría" breadcrumbItemUrl='/suppliertype' />
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
                                    <SpanSubtitleForm subtitle='Información del Tipo de Proveeduría' />
                                </div>
                            </Row>
                            <Row>
                                <div className="col-md-6 col-sm-12 mb-3">
                                    <label htmlFor="type" className="form-label">* Tipo de proveedor</label>
                                    <input className="form-control" type="text" id="type" value={supplyType} onChange={(e) => { setSupplyType(e.target.value) }} />
                                </div>
                            </Row>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
}

export default EditSupplyType;