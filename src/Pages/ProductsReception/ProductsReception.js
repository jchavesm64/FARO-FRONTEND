import React, { useState } from "react";
import { Card, CardBody, Container, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import DataList from "../../components/Common/DataList";
import { useQuery } from "@apollo/client";
import { convertDataProductReceptionExcel, exportAndDownloadExcel } from "../../helpers/exportExcel";
import { OBTENER_RECEPCION_PRODUCTOS } from "../../services/RecepcionProductosService";


const ProductsReception = ({...props}) => {
    document.title = "Recepción de productos | FARO";

    const [filter, setFilter] = useState('')
    const { loading: load_recepcion_productos, error: error_recepcion_productos, data: data_recepcion_productos } = useQuery(OBTENER_RECEPCION_PRODUCTOS, { pollInterval: 1000 })

    function getFilteredByKey(key, value) {
        const val1 = key.proveedor.empresa.toLowerCase();
        const val = value.toLowerCase();

        if(val1.includes(val)){
            return key
        }

        return null
    }

    const getData = () => {
        if (data_recepcion_productos) {
            if (data_recepcion_productos.obtenerRecepcionPedidos) {
                return data_recepcion_productos.obtenerRecepcionPedidos.filter((value, index) => {
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
        exportAndDownloadExcel('productReception', convertDataProductReceptionExcel(data))
    }

    const data = getData();

    if(load_recepcion_productos){
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title="Recepción de productos" />
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
                    <Breadcrumbs title="Recepción de productos" />
                    <Row className="flex" style={{alignItems: 'flex-end'}}>
                        <div className="col-md-12 mb-3">
                            <label
                                htmlFor="example-search-input"
                                className="col-md-2 col-form-label"
                            >
                                Busca la recepción
                            </label>
                            <input className="form-control" value={filter} onChange={(e)=>{setFilter(e.target.value)}} type="search" placeholder="Escribe el nombre del proveedor" />
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
                                    <DataList data={data} type="productsReception" displayLength={9} {...props} />
                                </CardBody>
                            </Card>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default ProductsReception;
