import React, { useState } from "react";
import { Card, Container, Row, CardBody } from "reactstrap";
import { useMutation, useQuery } from "@apollo/client";
import { Link } from "react-router-dom";

import Breadcrumbs from "../../../../components/Common/Breadcrumb";
import DataList from "../../../../components/Common/DataList";
import { infoAlert } from "../../../../helpers/alert";
import Swal from "sweetalert2";
import { DELETE_COMODIDAD, OBTENER_COMODIDADES } from "../../../../services/ComodidadesService";

const Amenities = ({ ...props }) => {
    document.title = "Comodidades | FARO";

    const [filter, setFilter] = useState('');
    const [modo] = useState('1')

    const { data: tiposComodidades } = useQuery(OBTENER_COMODIDADES, { pollInterval: 1000 });
    const [desactivar] = useMutation(DELETE_COMODIDAD);

    const onDeleteAmenities = (id, nombre) => {
        Swal.fire({
            title: "Eliminar Comodidad",
            text: `¿Está seguro de eliminar la comodidad ${nombre}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#0BB197",
            cancelButtonColor: "#FF3D60",
            cancelButtonText: 'Cancelar',
            confirmButtonText: "Sí, ¡eliminar!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { data } = await desactivar({ variables: { id } });
                const { estado, message } = data.desactivarComodidad;
                if (estado) {
                    infoAlert('Comodidad eliminada', message, 'success', 3000, 'top-end')
                } else {
                    infoAlert('Comodidad Ubicación', message, 'error', 3000, 'top-end')
                }
            }
        });
    }

    function getFilteredByKey(modo, key, value) {
        const valName = key.nombre.toLowerCase()
        const val = value.toLowerCase()

        if (valName.includes(val)) {
            return key
        }

        return null
    }

    const getData = () => {
        if (tiposComodidades) {
            if (tiposComodidades.obtenerComodidades) {
                return tiposComodidades.obtenerComodidades.filter((value) => {
                    if (filter !== "" && modo !== "") {
                        return getFilteredByKey(modo, value, filter);
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
                    <Breadcrumbs title="Comodidades" breadcrumbItem="Ajustes generales Hotel" breadcrumbItemUrl="/hotelsettings" />
                    <Row className="flex" style={{ alignItems: 'flex-end' }}>
                        <div className="col-md-10 mb-3">
                            <label htmlFor="search-input" className="col-md-4 col-form-label">
                                Busca tipo de comodidad
                            </label>
                            <input
                                className="form-control"
                                id="search-input"
                                type="search"
                                placeholder="Escribe el nombre del tipo de comodidad"
                                onChange={(e) => { setFilter(e.target.value) }}

                            />
                        </div>
                        <div className="col-md-2 col-sm-12 mb-3">
                            <Link to="/hotelsettings/newamenities">
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
                                    <DataList onDelete={onDeleteAmenities} data={data} type="amenities" displayLength={9} {...props} />
                                </CardBody>
                            </Card>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default Amenities;