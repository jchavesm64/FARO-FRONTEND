import React, { useState } from "react";
import { Card, CardBody, CardTitle, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import DataList from "../../components/Common/DataList";
import { OBTENER_FACTURAS_EMITIDAS } from "../../services/FacturasEmitidasService";
import { useQuery } from "@apollo/client";


const InvoiceIssued = ({ ...props }) => {
    document.title = "Documentos Emitidos | FARO";

    const { data: dataFacturasEmitidas } = useQuery(OBTENER_FACTURAS_EMITIDAS, { pollInterval: 1000 })

    const [clienteCedula, setClienteCedula] = useState("");
    const [fechaFrom, setFechaFrom] = useState("");
    const [fechaTo, setFechaTo] = useState("");

    const getData = () => {
        var auxFechaFrom =  new Date(fechaFrom)
        var auxFechaTo =  new Date(fechaTo)
        if (dataFacturasEmitidas) {
            if (dataFacturasEmitidas.obtenerFacturasEmitidas) {
                return dataFacturasEmitidas.obtenerFacturasEmitidas.filter((value, index) => {
                    if (value.data && value.data.DocElectronicos && value.data.DocElectronicos.length > 0 && value.data.DocElectronicos[0].Encabezado.TipoDocumento === "1") {
                        var checkByNombreCedula = true;
                        var checkByFechaFrom = true;
                        var checkByFechaTo = true;
                        if (clienteCedula.length > 0) {
                            if (value.data && value.data.DocElectronicos.length > 0){
                                checkByNombreCedula = value.data.DocElectronicos[0].Encabezado.Receptor.IdentificacionNumero.includes(clienteCedula) || value.data.DocElectronicos[0].Encabezado.Receptor.Nombre.toLowerCase().includes(clienteCedula.toLowerCase()) ? true : false;
                            }
                        }

                        if (auxFechaFrom > 0) {
                            if (value.response && value.response.Fecha && value.response.Fecha.includes("T")){
                                checkByFechaFrom = new Date(value.response.Fecha.split("T")[0]) >= auxFechaFrom ? true : false;
                            }
                        }

                        if (auxFechaTo > 0) {
                            if (value.response && value.response.Fecha && value.response.Fecha.includes("T")){
                                checkByFechaTo = new Date(value.response.Fecha.split("T")[0]) <= auxFechaTo ? true : false;
                            }
                        }

                        if (checkByNombreCedula && checkByFechaFrom && checkByFechaTo){
                            return value;
                        }
                    }
                    return null
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
                    <Breadcrumbs title="Documentos Emitidos" />
                    <Row>
                        <div className="col-md-3 mb-3">
                            Cédula o Nombre
                            <Row className="d-flex">
                                <div className="col-12 mb-3" onChange={(e) => { setClienteCedula(e.target.value) }} value={clienteCedula}>
                                    <input className="form-control" type="text" placeholder="Cliente Cédula o Nombre"/>
                                </div>
                            </Row>
                        </div>
                        <div className="col-md-3 mb-3">
                            Desde
                            <Row className="d-flex">
                                <div className="col-12 mb-3" onChange={(e) => { setFechaFrom(e.target.value) }} value={fechaFrom}>
                                    <input className="form-control" type="date" />
                                </div>
                            </Row>
                        </div>
                        <div className="col-md-3 mb-3">
                            Hasta
                            <Row className="d-flex">
                                <div className="col-12 mb-3" onChange={(e) => { setFechaTo(e.target.value) }} value={fechaTo}>
                                    <input className="form-control" type="date" />
                                </div>
                            </Row>
                        </div>
                    </Row>
                    <Row>
                        <div className="col mb-3">
                            <Card>
                                <CardBody>
                                    <DataList data={data} type="invoicesIssued" actions={false} displayLength={9} {...props} />
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
