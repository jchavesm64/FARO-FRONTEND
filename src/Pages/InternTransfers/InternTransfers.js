import React, { useState } from "react";
import { Card, CardBody, Container, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Link } from "react-router-dom";
import DataList from "../../components/Common/DataList";
import { useQuery } from "@apollo/client";
import { convertDataInternTransfers, exportAndDownloadExcel } from "../../helpers/exportExcel";
import { OBTENER_TRANSFERENCIAS } from "../../services/TransferenciaInternaService";


const InternTransfers = ({...props}) => {
    document.title = "Transferencias internas | FARO";

    const [filter, setFilter] = useState('')
    const { loading: load_transferencias_internas, error: error_transferencias_internas, data: data_transferencias_internas } = useQuery(OBTENER_TRANSFERENCIAS, { pollInterval: 1000 })

    function getFilteredByKey(key, value) {
        const val1 = key.usuario?.nombre.toLowerCase() || '';
        const val2 = key.almacenDesde?.nombre.toLowerCase() || '';
        const val3 = key.almacenHasta?.nombre.toLowerCase() || '';
        const val = value.toLowerCase();

        if(val1.includes(val) || val2.includes(val) || val3.includes(val)){
            return key
        }

        return null
    }

    const getData = () => {
        if (data_transferencias_internas) {
            if (data_transferencias_internas.obtenerTransferenciasInternas) {
                return data_transferencias_internas.obtenerTransferenciasInternas.filter((value, index) => {
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
        exportAndDownloadExcel('internTransfers', convertDataInternTransfers(data))
    }

    const data = getData();

    if(load_transferencias_internas){
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title="Transferencias internas" />
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
                    <Breadcrumbs title="Transferencias internas" />
                    <Row className="flex" style={{alignItems: 'flex-end'}}>
                        <div className="col-md-10 mb-3">
                            <label
                                htmlFor="example-search-input"
                                className="col-md-2 col-form-label"
                            >
                                Busca la transferencia interna
                            </label>
                            <input className="form-control" value={filter} onChange={(e)=>{setFilter(e.target.value)}} type="search" placeholder="Escribe el nombre del almacén" />
                        </div>
                        <div className="col-md-2 col-sm-12 mb-3">
                            <Link to="/newinterntransfer"><button
                              type="button"
                              className="btn btn-primary waves-effect waves-light"
                              style={{width: '100%'}}
                            >
                              Agregar{" "}
                              <i className="mdi mdi-plus align-middle ms-2"></i>
                            </button></Link>
                        </div>
                    </Row>
                    <Row className="">
                        <div className="col mb-3">
                            <button
                              type="button"
                              className="btn btn-outline-secondary waves-effect waves-light"
                              onClick={()=>{onClickExportExcel()}}
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
                                    <DataList data={data} type="internTransfers" displayLength={9} {...props} />
                                </CardBody>
                            </Card>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default InternTransfers;
