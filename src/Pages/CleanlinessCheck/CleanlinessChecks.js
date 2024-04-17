import React, { useState } from "react";
import { Card, CardBody, Container, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Link } from "react-router-dom";
import DataList from "../../components/Common/DataList";
import { useQuery } from "@apollo/client";
import Swal from "sweetalert2";
import { infoAlert } from "../../helpers/alert";
import { convertDataCleanlinessCheck, exportAndDownloadExcel } from "../../helpers/exportExcel";
import { OBTENER_TODOS_CHEQUEOS } from "../../services/ChequeoService";


const CleanlinessChecks = ({ ...props }) => {
    document.title = "Chequeos de limpieza | FARO";

    const [filter, setFilter] = useState('')
    const { loading: load_chequeos, error: error_chequeos, data: data_chequeos } = useQuery(OBTENER_TODOS_CHEQUEOS, { pollInterval: 1000 })


    function getFilteredByKey(key, value) {
        const val1 = key.puesto_limpieza.nombre.toLowerCase()
        const val2 = key.usuario?.nombre.toLowerCase() || ''
        const val = value.toLowerCase()


        if (val1.includes(val) || val2.includes(val)) {
            return key
        }

        return null
    }

    const getData = () => {
        if (data_chequeos) {
            if (data_chequeos.obtenerTodosChequeos) {
                return data_chequeos.obtenerTodosChequeos.filter((value, index) => {
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
        exportAndDownloadExcel('chequeos', convertDataCleanlinessCheck(data))
    }

    const data = getData();

    if (load_chequeos) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title="Chequeos" />
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
                    <Breadcrumbs title="Chequeos de limpieza" />
                    <Row className="flex" style={{ alignItems: 'flex-end' }}>
                        <div className="col-md-12 mb-3">
                            <label
                                htmlFor="search-input"
                                className="col-md-2 col-form-label"
                            >
                                Busca el chequeo
                            </label>
                            <input className="form-control" id="search-input" value={filter} onChange={(e) => { setFilter(e.target.value) }} type="search" placeholder="Escribe el nombre del puesto o el usuario" />
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
                                    <DataList data={data} type="cleanlinessChecks" displayLength={9} {...props} />
                                </CardBody>
                            </Card>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default CleanlinessChecks;
