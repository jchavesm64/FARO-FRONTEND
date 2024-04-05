import React, { useEffect, useState } from "react";
import { Container, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import SpanSubtitleForm from "../../components/Forms/SpanSubtitleForm";
import { infoAlert } from "../../helpers/alert";
import { useMutation } from "@apollo/client";
import { useNavigate } from 'react-router-dom';
import { SAVE_IMPUESTO } from "../../services/ImpuestoService";

const NewTaxManagement = (props) => {
    document.title = "Impuestos | FARO";

    const navigate = useNavigate();

    const [taxName, setTaxName] = useState('')
    const [taxValue, setTaxValue] = useState('')

    const [insertar] = useMutation(SAVE_IMPUESTO);

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
            const { data } = await insertar({ variables: { input }, errorPolicy: 'all' });
            const { estado, message } = data.insertarImpuesto;
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
};

export default NewTaxManagement;