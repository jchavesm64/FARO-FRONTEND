import React, { useState } from "react";
import { Card, CardBody, CardTitle, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import DataList from "../../components/Common/DataList";
import { useQuery } from "@apollo/client";
import { OBTENER_FACTURAS_PARAMETROS } from "../../services/FacturasParametrosService";


const InvoiceParameters = ({ ...props }) => {
    document.title = "Parametros | FARO";

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
                    <Breadcrumbs title="Parametros" />
                    <Row>
                        <div className="col mb-3">
                            <Card>
                                <CardBody>
                                    <DataList data={data} type="invoicesParameters" displayLength={9} {...props} />
                                </CardBody>
                            </Card>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default InvoiceParameters;
