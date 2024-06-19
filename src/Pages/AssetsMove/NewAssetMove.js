import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { INSERTAR_MOVIMIENTO_ACTIVO } from '../../services/MovimientosActivosService';
import { OBTENER_ACTIVO, OBTENER_ACTIVOS } from '../../services/ActivosService';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { Card, CardBody, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { infoAlert } from '../../helpers/alert';
import Select from "react-select";
import SpanSubtitleForm from '../../components/Forms/SpanSubtitleForm';
import ListInfo from '../../components/Common/ListInfo';

const NewAssetMove = () => {
    document.title = "Movimientos | FARO";

    const { id } = useParams();

    const { loading: load_activos, data: data_activos } = useQuery(OBTENER_ACTIVOS, { pollInterval: 1000 })

    const [getAssetData, { loading: loading_asset, data: data_asset }] = useLazyQuery(OBTENER_ACTIVO)
    const [insertar] = useMutation(INSERTAR_MOVIMIENTO_ACTIVO);
    const navigate = useNavigate();

    const [tipo, setTipo] = useState(null);
    const [beneficiario, setBeneficiario] = useState('');
    const [assets, setAssets] = useState([]);
    const [selectedAssets, setSelectedAssets] = useState([]);

    useEffect(() => {
        if (data_activos) {
            const data = data_activos.obtenerActivos.map(asset => {
                return {
                    label: asset.nombre + (asset.referenciaInterna ? ', ref: ' + asset.referenciaInterna : ''),
                    value: asset.id
                }
            })
            setAssets(data)
            if (id) {
                getAssetData({ variables: { id: id } })
            }
        }
    }, [data_activos])

    useEffect(() => {
        if (data_asset) {
            setSelectedAssets([{
                id: data_asset.obtenerActivo.id,
                nombre: data_asset.obtenerActivo.nombre,
                referenciaInterna: data_asset.obtenerActivo.referenciaInterna
            }])
            setAssets(assets.filter((asset) => asset.value !== data_asset.obtenerActivo.id));
        }
    }, [data_asset])

    const handleAssetChange = (selectedOption) => {
        const asset = data_activos.obtenerActivos.find((asset) => asset.id === selectedOption.value);
        setSelectedAssets([...selectedAssets, {
            id: asset.id,
            nombre: asset.nombre,
            referenciaInterna: asset.referenciaInterna
        }])
        setAssets(assets.filter((asset) => asset.value !== selectedOption.value));
    };

    const handleDeleteAsset = (assetToDelete) => {
        setSelectedAssets(selectedAssets.filter((asset) => asset.id !== assetToDelete));
        const asset = data_activos.obtenerActivos.find((asset) => asset.id === assetToDelete);
        setAssets([...assets, {
            label: asset.nombre + (asset.referenciaInterna ? ', ref: ' + asset.referenciaInterna : ''),
            value: asset.id
        }]);
    };

    const [disableSave, setDisableSave] = useState(true);

    useEffect(() => {
        setDisableSave(!tipo || !beneficiario || selectedAssets.length === 0)
    }, [tipo, beneficiario, selectedAssets])

    const onSaveAssetMove = async () => {
        try {
            setDisableSave(true)
            const input = {
                tipo: tipo.value,
                beneficiario: beneficiario,
                activos: selectedAssets.map(asset => asset.id),
                cedula: localStorage.getItem('cedula')
            }
            const { data } = await insertar({ variables: { input }, errorPolicy: 'all' });
            const { estado, message } = data.insertarMovimientosActivo;
            if (estado) {
                infoAlert('Excelente', message, 'success', 3000, 'top-end')
                if (id) {
                    navigate(`/asset/movements/${id}`);
                }
                else {
                    navigate('/assets/movements');
                }
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

    if (loading_asset || load_activos) {
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
                    <Breadcrumbs title={"Nuevo Movimiento"} breadcrumbItem={"Movimientos Activo"} breadcrumbItemUrl={`${data_asset && id ? '/asset/movements/' + data_asset.obtenerActivo.nombre + '/' + id : '/assets/movements'}`} />
                    <Row>
                        <div className="col mb-3 text-end">
                            <button disabled={disableSave} onClick={onSaveAssetMove} type="button" className="btn btn-primary waves-effect waves-light" >
                                Guardar{" "}
                                <i className="ri-save-line align-middle ms-2"></i>
                            </button>
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
                                onChange={(e) => setTipo(e)}
                                options={[{ label: 'SALIDA', value: 'SALIDA' }, { label: 'ENTRADA', value: 'ENTRADA' }]}
                                placeholder="Tipo de movimiento"
                                classNamePrefix="select2-selection"
                            />
                        </div>
                        <div className="col-md-2 col-sm-12 mb-3">
                            <label htmlFor="beneficiario" className="form-label">* Beneficiario</label>
                            <input className="form-control" type="text" id="beneficiario" value={beneficiario} onChange={(e) => setBeneficiario(e.target.value)} />
                        </div>
                        <div className="col-md-4 col-sm-12">
                            <label className="col mb-2 form-label">
                                * Activos
                            </label>
                            <Card className="p-2">
                                <CardBody>
                                    <div className="row g-3 align-items-center">
                                        <div className=" mb-1">
                                            <Select
                                                options={assets}
                                                classNamePrefix="select2-selection"
                                                menuPosition="fixed"
                                                placeholder="Seleccione los activos"
                                                value={'Seleccione los activos'}
                                                onChange={handleAssetChange}
                                                isSearchable={true}
                                            />
                                        </div>
                                    </div>
                                    <Row>
                                        <ListInfo data={selectedAssets} headers={['Nombre', 'Referencia Interna']} keys={['nombre', 'referenciaInterna']} enableEdit={false} enableDelete={true} actionDelete={handleDeleteAsset} mainKey={'id'} />
                                    </Row>
                                </CardBody>
                            </Card>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default NewAssetMove;

