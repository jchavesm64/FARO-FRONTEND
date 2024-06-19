import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { OBTENER_ACTIVO_CON_MOVIMIENTOS } from '../../services/ActivosService';
import { useQuery } from '@apollo/client';
import { Card, CardBody, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
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
        }
    }, [data_asset])

    const [nombre, setNombre] = useState('');
    const [referenciaInterna, setReferenciaInterna] = useState('');

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
                    <Row>
                        <div className="col mb-3 text-end">
                            <Link to={`/asset/newmovement/${id}`}>
                                <button type="button" className="btn btn-primary waves-effect waves-light">
                                    Agregar movimiento{" "}
                                    <i className="mdi mdi-plus align-middle ms-2"></i>
                                </button>
                            </Link>
                        </div>
                    </Row>
                    <Row>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="nombre" className="form-label">Nombre</label>
                            <input className="form-control" type="text" id="nombre" value={nombre} disabled />
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

