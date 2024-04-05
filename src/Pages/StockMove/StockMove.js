import React, { useState } from "react";
import { Card, CardBody, Container, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Link, useParams } from "react-router-dom";
import DataList from "../../components/Common/DataList";
import { useMutation, useQuery } from "@apollo/client";
import Swal from "sweetalert2";
import { infoAlert } from "../../helpers/alert";
import { convertirDataStockMoveExcel, exportAndDownloadExcel } from "../../helpers/exportExcel";
import { OBTENER_MOVIMIENTOS } from "../../services/MovimientosService";
import Select from "react-select";


const StockMove = ({...props}) => {
    document.title = "Movimientos | FARO";

    const { stockType, productName, productId } = useParams();

    const [filter, setFilter] = useState('')

    const { loading: load_movimiento, error: error_movimiento, data: data_movimiento } = useQuery(OBTENER_MOVIMIENTOS, { variables: { id: productId }, pollInterval: 1000 })

    const filterOptions = [
        {
            label: "Ver todo",
            value: "" 
        },
        {
            label: "Ver salidas",
            value: "SALIDA"
        },
        {
            label: "Ver entradas",
            value: "ENTRADA"
        }
    ]

    const [filterType, setFilterType] = useState({label: 'Ver todo', value: ''}) 

    const handleFilterType = (v) => {
        setFilterType(v)
        setFilter(v.value)
    }

    const getData = () => {
        if (data_movimiento) {
            if (data_movimiento.obtenerMovimientos) {
                return data_movimiento.obtenerMovimientos.filter((value, index) => {
                    if (filter !== "") {
                        return getFilteredByKey(value, filter);
                    }
                    return value
                });
            }
            return []
        }
        return []
    }

    function getFilteredByKey(key, value) {
        const val1 = key.tipo.toLowerCase();
        const val = value.toLowerCase();

        if(val1.includes(val)){
            return key
        }

        return null
    }

    const onClickExportExcel = () => {
        exportAndDownloadExcel('movimientos', convertirDataStockMoveExcel(data, productName))
    }

    const data = getData();

    if(load_movimiento){
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title={`Movimientos - ${productName}`} breadcrumbItem={`Inventario - ${stockType}`} breadcrumbItemUrl={`/stock/${stockType}`}/>
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
                    <Breadcrumbs title={`Movimientos - ${productName}`} breadcrumbItem={`Inventario - ${stockType}`} breadcrumbItemUrl={`/stock/${stockType}`}/>
                    <Row className="d-flex justify-content-between">
                        <div className="col-md-2 col-sm-12 mb-3">
                            <Select
                                value={filterType}
                                onChange={(e) => {
                                    handleFilterType(e);
                                }}
                                options={filterOptions}
                                classNamePrefix="select2-selection"
                                menuPosition="fixed"
                            />
                        </div>
                        
                        <div className="col-md-4 col-sm-12 mb-3">
                            <Row>
                                <div className="col-md-6 col-sm-12 mb-3">
                                    <Link to={`/product/movements/out/${stockType}/${productName}/${productId}`}>
                                        <button type="button" className="btn btn-danger waves-effect waves-light" style={{width: '100%'}}>
                                            Agregar salida{" "}
                                            <i className="mdi mdi-minus align-middle ms-2"></i>
                                        </button>
                                    </Link>
                                </div>
                                <div className="col-md-6 col-sm-12 mb-3">
                                    <Link to={`/product/movements/in/${stockType}/${productName}/${productId}`}>
                                        <button type="button" className="btn btn-success waves-effect waves-light" style={{width: '100%'}}>
                                            Agregar entrada{" "}
                                            <i className="mdi mdi-plus align-middle ms-2"></i>
                                    </button></Link>
                                </div>
                            </Row>
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
                                    <DataList data={data} type="stockMove" displayLength={9} {...props} />
                                </CardBody>
                            </Card>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default StockMove;
