import React, { useState } from "react";
import { Card, Container, Row, CardBody } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { Link } from "react-router-dom";

export default function ReceptionHome() {
    document.title = "Disponibilidad | FARO";

    const [filter, setFilter] = useState('');
    const [modo] = useState('1')

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Disponivilidad y nuevas reservas" breadcrumbItem="Recepción" breadcrumbItemUrl="/reception" />

                    <Row className="flex" style={{ alignItems: 'flex-end' }}>
                        <div className="col-md-10 mb-3">
                            <label htmlFor="search-input" className="col-md-4 col-form-label">
                                Busca Reserva
                            </label>
                            <input
                                className="form-control"
                                id="search-input"
                                type="search"
                                placeholder="Debe de ir un filtro más complejo, ya sea con nombre fecha y/o identificación"
                                onChange={(e) => { setFilter(e.target.value) }}

                            />
                        </div>
                        <div className="col-md-2 col-sm-12 mb-3">
                            <Link to="/reception/availability/newbooking">
                                <button
                                    type="button"
                                    className="btn btn-primary waves-effect waves-light"
                                    style={{ width: '100%' }}
                                >
                                    Agregar{" "}
                                    <i className="mdi mdi-plus align-middle ms-2"></i>
                                </button>
                            </Link>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}