import React, { useState } from "react";
import { Card, CardBody, Container, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import DataList from "../../components/Common/DataList";
import { useQuery } from "@apollo/client";
import { convertirDataMovimientosActivosExcel, exportAndDownloadExcel } from "../../helpers/exportExcel";
import { OBTENER_MOVIMIENTOS_ACTIVOS } from "../../services/MovimientosActivosService";


const AssetsMove = ({ ...props }) => {
    document.title = "Movimientos | FARO";

    const [filter, setFilter] = useState('')
    const { loading: load_movimientos_activos, error: error_movimientos_activos, data: data_movimientos_activos } = useQuery(OBTENER_MOVIMIENTOS_ACTIVOS, { pollInterval: 1000 })

    function getFilteredByKey(key, value) {
        const val1 = key.consecutivo.consecutivo.toLowerCase();
        const val2 = key.beneficiario.toLowerCase();
        const val3 = key.activo.nombre.toLowerCase();
        const val4 = key.activo.referenciaInterna.toLowerCase();
        const val = value.toLowerCase();

        if (val1.includes(val) || val2.includes(val) || val3.includes(val) || val4.includes(val)) {
            return key
        }

        return null
    }

    const getData = () => {
        if (data_movimientos_activos) {
            if (data_movimientos_activos.obtenerMovimientosActivos) {
                return data_movimientos_activos.obtenerMovimientosActivos.filter((value, index) => {
                    if (filter !== "") {
                        return getFilteredByKey(value, filter);
                    }
                    return value
                });
            }
        }
        return []
    }


    const onClickExportExcel = () => {
        exportAndDownloadExcel('movimientosActivos', convertirDataMovimientosActivosExcel(data))
    }

    const data = getData();

    if (load_movimientos_activos) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title="Movimiento de Activos" breadcrumbItem="Inicio" breadcrumbItemUrl="/home" />
                        <Row>
                            <div className="col text-center pt-3 pb-3">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        </Row>
                    </Container>
                </div>
            </React.Fragment>)
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Movimiento de Activos" breadcrumbItem="Inicio" breadcrumbItemUrl="/home" />
                    <Row className="flex" style={{ alignItems: 'flex-end' }}>
                        <div className="col-md-12 mb-3">
                            <label
                                htmlFor="search-input"
                                className="col-md-2 col-form-label"
                            >
                                Busca el movimiento
                            </label>
                            <input
                                className="form-control"
                                id="search-input"
                                value={filter}
                                onChange={(e) => { setFilter(e.target.value) }}
                                type="search"
                                placeholder="Escribe el identificador, beneficiario, activo o referencia interna"
                            />
                        </div>
                    </Row>
                    <Row className="">
                        <div className="col mb-3">
                            <button
                                type="button"
                                className="btn btn-outline-secondary waves-effect waves-light"
                                onClick={() => { onClickExportExcel() }}
                            >
                                Exportar Excel{" "}
                                <i className="mdi mdi-file-excel align-middle ms-2"></i>
                            </button>
                        </div>
                    </Row>
                    <Row>
                        <div className="col mb-3">
                            <Card>
                                <CardBody>
                                    <DataList mode="all" data={data} displayLength={9} type="assetMove"  {...props} />
                                </CardBody>
                            </Card>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default AssetsMove;