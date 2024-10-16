import React, { useState } from "react";
import { Card, CardBody, Container, Row } from "reactstrap";
import Breadcrumbs from "../../../../components/Common/Breadcrumb";
import { Link } from "react-router-dom";
import DataList from "../../../../components/Common/DataList";
import { OBTENER_TEMPORADAS } from "../../../../services/TemporadaService";
import { useQuery } from "@apollo/client";

const Season = ({ ...props }) => {
    document.title = "Temporada | FARO";

    const [filter, setFilter] = useState('');
    const { data: season } = useQuery(OBTENER_TEMPORADAS, { pollInterval: 1000 });

    function getFilteredByKey(key, value) {
        const valName = key.nombre.toLowerCase()
        const val = value.toLowerCase()

        if (valName.includes(val)) {
            return key
        }

        return null
    }

    const getData = () => {
        if (season) {
            if (season.obtenerTemporada) {
                return season.obtenerTemporada.filter((value, index) => {
                    if (filter !== "") {
                        return getFilteredByKey(value, filter);
                    }
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
                    <Breadcrumbs title="Temporada" breadcrumbItem="Ajustes generales Hotel" breadcrumbItemUrl="/hotelsettings" />
                    <Row className="flex" style={{ alignItems: 'flex-end' }}>
                        <div className="col-md-10 mb-3">
                            <label htmlFor="search-input" className="col-md-4 col-form-label">
                                Busca tipo de Temporada
                            </label>
                            <input
                                className="form-control"
                                id="search-input"
                                type="search"
                                placeholder="Escribe el nombre del tipo de temporada"
                                onChange={(e) => { setFilter(e.target.value) }}

                            />
                        </div>
                        <div className="col-md-2 col-sm-12 mb-3">
                            <Link to="/hotelsettings/newseason">
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

                    <Row>
                        <div className="col mb-3">
                            <Card>
                                <CardBody>
                                    <DataList data={data} type="season" displayLength={9} {...props} />
                                </CardBody>
                            </Card>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
}

export default Season;