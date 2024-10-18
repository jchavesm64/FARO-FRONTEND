import React, { useState, useEffect } from "react";
import { Container, Row } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import SpanSubtitleForm from "../../../components/Forms/SpanSubtitleForm";
import { infoAlert } from "../../../helpers/alert";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from 'react-router-dom';
import { OBTENER_TIPOS_MENU_BY_ID, UPDATE_TIPO_MENU } from "../../../services/TipoMenuService";

const EditMenuType = () => {
    document.title = "Menu | FARO";

    const navigate = useNavigate();

    const { id } = useParams();
    const { loading: loading_menu, error: error_menu, data: data_menu, startPolling, stopPolling } = useQuery(OBTENER_TIPOS_MENU_BY_ID, { variables: { id: id }, pollInterval: 1000 });
    const [actualizar] = useMutation(UPDATE_TIPO_MENU);

    useEffect(() => {
        startPolling(1000)
        return () => {
            stopPolling()
        }
    }, [startPolling, stopPolling])

    const [menuName, setMenuName] = useState('');

    useEffect(() => {
        if (data_menu) {
            setMenuName(data_menu.obtenerTipoMenuById.nombre)
        }
    }, [data_menu])

    const [disableSave, setDisableSave] = useState(true);

    useEffect(() => {
        setDisableSave(menuName === '')
    }, [menuName])

    const onClickSave = async () => {
        try {
            setDisableSave(true)
            const input = {
                nombre: menuName,
                estado: "ACTIVO"
            }
            const id = data_menu.obtenerTipoMenuById.id;
            const { data } = await actualizar({ variables: { id, input }, errorPolicy: 'all' });
            const { estado, message } = data.actualizarTipoMenu;
            if (estado) {
                infoAlert('Excelente', message, 'success', 3000, 'top-end')
                navigate('/menutype');
            } else {
                infoAlert('Oops', message, 'error', 3000, 'top-end')
            }
            setDisableSave(false)
        } catch (error) {
            console.log(error)
            infoAlert('Oops', 'Ocurrió un error inesperado al guardar el tipo de menu', 'error', 3000, 'top-end')
            setDisableSave(false)
        }
    }

    if (loading_menu) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title="Editar Tipo de Menu" breadcrumbItem="Gestion de Tipos de Menu" breadcrumbItemUrl='/menutype' />
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
    if (error_menu) {
        return null
    }
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Editar Tipo de Menu" breadcrumbItem="Gestion de Tipos de Menu" breadcrumbItemUrl='/menutype' />
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
                                    <SpanSubtitleForm subtitle='Información del Tipo de Menu' />
                                </div>
                            </Row>
                            <Row>
                                <div className="col-md-6 col-sm-12 mb-3">
                                    <label htmlFor="type" className="form-label">* Tipo de Menu</label>
                                    <input className="form-control" type="text" id="type" value={menuName} onChange={(e) => { setMenuName(e.target.value) }} />
                                </div>
                            </Row>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
}

export default EditMenuType;