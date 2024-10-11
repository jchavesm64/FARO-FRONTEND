import React, { useState } from "react";
import { Card, CardBody, CardTitle, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import DataList from "../../components/Common/DataList";
import { useQuery } from "@apollo/client";
import { OBTENER_FACTURAS_PARAMETROS } from "../../services/FacturasParametrosService";


const InvoiceCompany = ({ ...props }) => {
    document.title = "Compañia | FARO";

    const { data: dataFacturasParametros} = useQuery(OBTENER_FACTURAS_PARAMETROS, { pollInterval: 1000 })

    const getData = () => {
        if (dataFacturasParametros) {
            if (dataFacturasParametros.obtenerFacturasParametros) {
                return dataFacturasParametros.obtenerFacturasParametros.filter((value, index) => {
                    return value
                });
            }
        }
        return []
    }

    const data = getData();

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Compañia" />
                    <Row className="justify-content-between">
                        <Row>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">ENDPOINT</label>
                                <input className="form-control" type="text" value="https://apifecr-01-68su.azurewebsites.net/"/>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">CLIENT CODE</label>
                                <input className="form-control" type="text" value="745"/>
                            </div>
                        </Row>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default InvoiceCompany;
