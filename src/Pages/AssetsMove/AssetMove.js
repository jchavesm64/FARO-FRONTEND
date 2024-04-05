import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { OBTENER_ACTIVO_CON_MOVIMIENTOS } from '../../services/ActivosService';
import { useQuery } from '@apollo/client';
import { Card, CardBody, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import Select from "react-select";
import DataList from '../../components/Common/DataList';

const AssetMove = () => {
    document.title = "Movimientos | FARO";

    const { id } = useParams();

    const { loading: loading_asset, error: error_asset, data: data_asset, startPolling, stopPolling } = useQuery(OBTENER_ACTIVO_CON_MOVIMIENTOS, { variables: { id: id }, pollInterval: 1000 })

    useEffect(() => {
        startPolling(1000)
        return () => {
            stopPolling()
        }
    }, [startPolling, stopPolling])

    useEffect(() => {
        if (data_asset) {
            setNombre(data_asset.obtenerActivoConMovimientos.nombre)
            setReferenciaInterna(data_asset.obtenerActivoConMovimientos.referenciaInterna)
            setUnidad({ label: data_asset.obtenerActivoConMovimientos.unidad, value: data_asset.obtenerActivoConMovimientos.unidad })
        }
    }, [data_asset])

    const [nombre, setNombre] = useState('');
    const [referenciaInterna, setReferenciaInterna] = useState('');
    const [unidad, setUnidad] = useState(null)

    if (loading_asset) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title={"Movimientos Activo"} breadcrumbItem={"Activos"} breadcrumbItemUrl={"/assets"} />
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
                    <Breadcrumbs title={"Movimientos Activo"} breadcrumbItem={"Activos"} breadcrumbItemUrl={"/assets"} />
                    <Row className="d-flex justify-content-between">
                        <span className='col-md-2 col-sm-12 mb-3'></span>
                        <div className="col-md-5 col-sm-12 mb-3">
                            <Row>
                                <div className="col-md-6 col-sm-12 mb-3">
                                    <Link to={`/asset/newmovement/SALIDA/${id}`}>
                                        <button type="button" className="btn btn-danger waves-effect waves-light" style={{ width: '100%' }}>
                                            Agregar salida{" "}
                                            <i className="mdi mdi-minus align-middle ms-2"></i>
                                        </button>
                                    </Link>
                                </div>
                                <div className="col-md-6 col-sm-12 mb-3">
                                    <Link to={`/asset/newmovement/ENTRADA/${id}`}>
                                        <button type="button" className="btn btn-success waves-effect waves-light" style={{ width: '100%' }}>
                                            Agregar entrada{" "}
                                            <i className="mdi mdi-plus align-middle ms-2"></i>
                                        </button></Link>
                                </div>
                            </Row>
                        </div>
                    </Row>
                    <Row>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="nombre" className="form-label">Nombre</label>
                            <input className="form-control" type="text" id="nombre" value={nombre} disabled />
                        </div>
                        <div className="col-md-2 mb-3">
                            <label htmlFor="unidad" className="form-label">Unidad de medida</label>
                            <Select
                                menuPosition="fixed"
                                id="unidad"
                                value={unidad}
                                isDisabled
                                options={[{ label: 'Kilogramo', value: 'Kilogramo' }, { label: 'Litro', value: 'Litro' }, { label: 'Unidades', value: 'Unidades' }]}
                                classNamePrefix="select2-selection"
                            />
                        </div>
                        <div className="col-md-2 col-sm-12 mb-3">
                            <label htmlFor="refInterna" className="form-label">Referencia interna</label>
                            <input className="form-control" type="text" id="refInterna" value={referenciaInterna} disabled />
                        </div>
                    </Row>
                    <Row>
                        <div className="col mb-3">
                            <Card>
                                <CardBody>
                                    <DataList data={data_asset.obtenerActivoConMovimientos.movimientos} displayLength={9} type="assetMove" />
                                </CardBody>
                            </Card>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default AssetMove;

