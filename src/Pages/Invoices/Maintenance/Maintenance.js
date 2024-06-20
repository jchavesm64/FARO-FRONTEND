import React from "react";
import { Container, Row } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { head } from "lodash";
import Select from "react-select";



const InvoiceMaintenance = ({ ...props }) => {
    document.title = "Mantenimiento | FARO";

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Mantenimiento" />
                    <Row className="justify-content-between">
                        <div className="col-md-6 mb-3" >
                            <Row>
                                <label className="form-label">Cliente (F5)</label>
                            </Row>
                            <Row>
                                <div className="col-md-3 mb-3">
                                    <input readOnly={true} className="form-control" type="number" />
                                </div>
                                <div className="col-md-8 mb-3">
                                    <input readOnly={true} className="form-control" type="number" />
                                </div>
                                <div className="col-md-1 mb-3">
                                    <input readOnly={true} className="form-control" type="number" />
                                </div>
                            </Row>
                            <Row>
                                <label className="form-label">Codigo de Barras (F2)</label>
                            </Row>
                            <Row>
                                <div className="col-md-11 mb-2">
                                    <Row className="d-flex">
                                        <div className="col mb-3 pe-0">
                                            <input className="form-control" type="number" placeholder="Cantidad"/>
                                        </div>
                                        <div className="col-md-1 mb-3 px-0">
                                            <input className="fs-3 form-control d-flex text-center p-0" type="text" value={"/"}/>
                                        </div>
                                        <div className="col mb-3 ps-0">
                                            <input className="form-control" type="text" placeholder="Código del Articulo"/>
                                        </div>
                                    </Row>
                                </div>
                                <div className="col-md-1 mb-3">
                                    <input readOnly={true} className="form-control" type="number" />
                                </div>
                            </Row>
                            <Row>
                                <div className="col-md-11 mb-3">
                                    <Row>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Cantidad Lineas</label>
                                            <input className="form-control" type="number" placeholder="0"/>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Dato Referencia</label>
                                            <input className="form-control" type="text"/>
                                        </div>
                                    </Row>
                                </div>
                            </Row>
                        </div>
                        <div className="col-md-5 mb-3" >
                            <Row>
                                <div className="col-md-2 mb-3">
                                    <label className="form-label">Días Plazo</label>
                                    <input readOnly={true} className="form-control" type="number" placeholder="0"/>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Condicíon de Venta</label>
                                    <Select
                                        id="condicion_venta"
                                        value={"test"}
                                        // onChange={(e) => {
                                        //     onChangePuestoLimpieza(e);
                                        // }}
                                        options={["test"]}
                                        classNamePrefix="select2-selection"
                                        isSearchable={true}
                                        menuPosition="fixed"
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Tipo de Factura</label>
                                    <Select
                                        id="condicion_venta"
                                        value={"test"}
                                        // onChange={(e) => {
                                        //     onChangePuestoLimpieza(e);
                                        // }}
                                        options={["test"]}
                                        classNamePrefix="select2-selection"
                                        isSearchable={true}
                                        menuPosition="fixed"
                                    />
                                </div>
                            </Row>
                            <Row>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Moneda de Pago</label>
                                    <Select
                                        id="condicion_venta"
                                        value={"test"}
                                        // onChange={(e) => {
                                        //     onChangePuestoLimpieza(e);
                                        // }}
                                        options={["test"]}
                                        classNamePrefix="select2-selection"
                                        isSearchable={true}
                                        menuPosition="fixed"
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Tipo de Cambio</label>
                                    <input readOnly={true} className="form-control" type="number" />
                                </div>
                            </Row>
                            <Row>
                                <label className="form-label">Forma de Pago</label>
                            </Row>
                            <Row>
                                <div className="col-md-6 mb-3">
                                    <Row>
                                        <div className="col-md-2 mb-3">
                                            <input className="form-control" type="number"/>
                                        </div>
                                        <div className="col-md-10 mb-3">
                                        <Select
                                            id="condicion_venta"
                                            value={"test"}
                                            // onChange={(e) => {
                                            //     onChangePuestoLimpieza(e);
                                            // }}
                                            options={["test"]}
                                            classNamePrefix="select2-selection"
                                            isSearchable={true}
                                            menuPosition="fixed"
                                        />
                                        </div>
                                    </Row>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <Row>
                                        <div className="col-md-4 mb-3 pe-1">
                                            <button type="button" className="btn btn-primary waves-effect waves-light" >
                                                Emitir (F4)
                                            </button>
                                        </div>
                                        <div className="col-md-6 mb-3 ps-1">
                                            <button type="button" className="btn btn-warning waves-effect waves-light" >
                                                Proforma (F6)
                                            </button>
                                        </div>
                                    </Row>
                                </div>
                            </Row>
                        </div>
                    </Row>
                    <Row className="justify-content-between">
                        <div className="col-md-6 mb-3" >
                            <Row>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Subtotal</label>
                                    <input className="form-control" type="number" placeholder="0.00"/>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Descuento</label>
                                    <input className="form-control" type="number" placeholder="0.00"/>
                                </div>
                            </Row>
                            <Row>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Impuesto</label>
                                    <input className="form-control" type="number" placeholder="0.00"/>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Otros Cargos</label>
                                    <input className="form-control" type="number" placeholder="0.00"/>
                                </div>
                            </Row>
                            <Row>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">IVA Devuelto</label>
                                    <input className="form-control" type="number" placeholder="0.00"/>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Total a Pagar</label>
                                    <input className="form-control" type="number" placeholder="0.00"/>
                                </div>
                            </Row>
                            <Row>
                                <label className="form-label">Contingencia</label>
                            </Row>
                            <Row className="d-flex">
                                <div className="col mb-3 pe-0">
                                    <input className="form-control" type="text" placeholder="Documento"/>
                                </div>
                                <div className="col-md-1 mb-3 px-0">
                                    <input className="fs-3 form-control d-flex text-center p-0" type="text" value={"/"}/>
                                </div>
                                <div className="col mb-3 ps-0">
                                    <input className="form-control" type="date" placeholder="Fecha"/>
                                </div>
                            </Row>
                        </div>
                        <div className="col-md-5 mb-3" >
                            
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default InvoiceMaintenance;
