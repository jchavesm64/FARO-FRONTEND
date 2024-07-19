import React, { useState } from "react";
import { Card, CardBody, CardTitle, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import DataList from "../../components/Common/DataList";
import { OBTENER_FACTURAS_EMITIDAS } from "../../services/FacturasEmitidasService";
import { useQuery } from "@apollo/client";


const InvoiceIssued = ({ ...props }) => {
    document.title = "Facturas Emitidas | FARO";

    const { data: dataFacturasEmitidas } = useQuery(OBTENER_FACTURAS_EMITIDAS, { pollInterval: 1000 })

    const getData = () => {
        if (dataFacturasEmitidas) {
            if (dataFacturasEmitidas.obtenerFacturasEmitidas) {
                return dataFacturasEmitidas.obtenerFacturasEmitidas.filter((value, index) => {
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
                    <Breadcrumbs title="Facturas Emitidas" />
                    <Row>
                        <div className="col mb-3">
                            <Card>
                                <CardBody>
                                    <DataList data={data} type="invoicesIssued" displayLength={9} {...props} />
                                </CardBody>
                            </Card>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default InvoiceIssued;
