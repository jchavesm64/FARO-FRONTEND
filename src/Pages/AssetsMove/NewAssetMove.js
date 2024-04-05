import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { INSERTAR_MOVIMIENTO_ACTIVO } from '../../services/MovimientosActivosService';
import { OBTENER_ACTIVO } from '../../services/ActivosService';
import { useMutation, useQuery } from '@apollo/client';
import { Container, Row } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { infoAlert } from '../../helpers/alert';
import Select from "react-select";
import SpanSubtitleForm from '../../components/Forms/SpanSubtitleForm';

//TODO: Make sure if unit of the asset is necessary
const NewAssetMove = () => {
    document.title = "Movimientos | FARO";

    const { type, id } = useParams();

    const { loading: loading_asset, error: error_asset, data: data_asset, startPolling, stopPolling } = useQuery(OBTENER_ACTIVO, { variables: { id: id }, pollInterval: 1000 })
    const [insertar] = useMutation(INSERTAR_MOVIMIENTO_ACTIVO);
    const navigate = useNavigate();

    const [nombre, setNombre] = useState('');
    //const [unidad, setUnidad] = useState(null)
    const [referenciaInterna, setReferenciaInterna] = useState('');
    const [tipo, setTipo] = useState(type === 'SALIDA' || type === 'ENTRADA' ? { label: type, value: type } : null);
    const [beneficiario, setBeneficiario] = useState('');

    useEffect(() => {
        if (data_asset) {
            setNombre(data_asset.obtenerActivo.nombre)
            setReferenciaInterna(data_asset.obtenerActivo.referenciaInterna)
            //setUnidad({ label: data_asset.obtenerActivo.unidad, value: data_asset.obtenerActivo.unidad })
        }
    }, [data_asset])

    const [disableSave, setDisableSave] = useState(true);

    useEffect(() => {
        setDisableSave(!tipo || !beneficiario)
    }, [tipo, beneficiario])

    const onSaveAsset = async () => {
        try {
            setDisableSave(true)
            const input = {
                tipo: tipo.value,
                beneficiario: beneficiario,
                activo: id,
                cedula: localStorage.getItem('cedula')
            }
            const { data } = await insertar({ variables: { input }, errorPolicy: 'all' });
            const { estado, message } = data.insertarMovimientosActivo;
            if (estado) {
                infoAlert('Excelente', message, 'success', 3000, 'top-end')
                navigate(`/asset/movements/${data_asset.obtenerActivo.nombre}/${id}`);
            } else {
                infoAlert('Oops', message, 'error', 3000, 'top-end')
            }
            setDisableSave(false)
        } catch (error) {
            console.log(error);
            infoAlert('Oops', 'Ocurrió un error inesperado al guardar el movimiento', 'error', 3000, 'top-end')
            setDisableSave(false)
        }
    }

    if (loading_asset) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title={"Nuevo Movimiento"} breadcrumbItem={"Movimientos Activo"} breadcrumbItemUrl={`/assets`} />
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

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title={"Nuevo Movimiento"} breadcrumbItem={"Movimientos Activo"} breadcrumbItemUrl={`/asset/movements/${data_asset.obtenerActivo.nombre}/${id}`} />
                    <Row>
                        <div className="col mb-3 text-end">
                            <button disabled={disableSave} onClick={onSaveAsset} type="button" className="btn btn-primary waves-effect waves-light" >
                                Guardar{" "}
                                <i className="ri-save-line align-middle ms-2"></i>
                            </button>
                        </div>
                    </Row>
                    <Row>
                        <div className="col mb-3">
                            <SpanSubtitleForm subtitle='Información del activo' />
                        </div>
                    </Row>
                    <Row>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="nombre" className="form-label">Nombre</label>
                            <input className="form-control" type="text" id="nombre" value={nombre} disabled />
                        </div>
                        {/*<div className="col-md-2 mb-3">
                            <label htmlFor="unidad" className="form-label">Unidad de medida</label>
                            <Select
                                menuPosition="fixed"
                                id="unidad"
                                value={unidad}
                                isDisabled
                                options={[{ label: 'Kilogramo', value: 'Kilogramo' }, { label: 'Litro', value: 'Litro' }, { label: 'Unidades', value: 'Unidades' }]}
                                classNamePrefix="select2-selection"
                            />
                        </div>*/}
                        <div className="col-md-2 col-sm-12 mb-3">
                            <label htmlFor="refInterna" className="form-label">Referencia interna</label>
                            <input className="form-control" type="text" id="refInterna" value={referenciaInterna} disabled />
                        </div>
                    </Row>
                    <Row>
                        <div className="col mb-3">
                            <SpanSubtitleForm subtitle='Información del movimiento' />
                        </div>
                    </Row>
                    <Row>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="tipo" className="form-label">* Tipo de moviminto</label>
                            <Select
                                menuPosition="fixed"
                                id="tipo"
                                value={tipo}
                                isDisabled={type === 'SALIDA' || type === 'ENTRADA'}
                                onChange={(e) => setTipo(e)}
                                options={[{ label: 'SALIDA', value: 'SALIDA' }, { label: 'ENTRADA', value: 'ENTRADA' }]}
                                classNamePrefix="select2-selection"
                            />
                        </div>
                        <div className="col-md-2 col-sm-12 mb-3">
                            <label htmlFor="beneficiario" className="form-label">* Beneficiario</label>
                            <input className="form-control" type="text" id="beneficiario" value={beneficiario} onChange={(e) => setBeneficiario(e.target.value)} />
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default NewAssetMove;

