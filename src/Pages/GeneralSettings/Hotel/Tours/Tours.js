import React, { useEffect, useState } from "react";
import { Card, CardBody, Container, Row } from "reactstrap";
import Breadcrumbs from "../../../../components/Common/Breadcrumb";
import { Link } from "react-router-dom";
import DataList from "../../../../components/Common/DataList";
import { useMutation, useQuery } from "@apollo/client";
import { DELETE_TOUR, OBTENER_TOURS } from "../../../../services/TourService";
import { infoAlert } from "../../../../helpers/alert";
import Swal from "sweetalert2";

const Tour = ({ ...props }) => {
    document.title = "Tours | FARO";

    const [filter, setFilter] = useState('');
    const [data, setData] = useState([]);

    const { data: tour } = useQuery(OBTENER_TOURS, { pollInterval: 1000 });
    const [desactivar] = useMutation(DELETE_TOUR);

    const onDeleteTour = (id, nombre) => {
        Swal.fire({
            title: "Eliminar tour",
            text: `¿Está seguro de eliminar la tour ${nombre}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#0BB197",
            cancelButtonColor: "#FF3D60",
            cancelButtonText: 'Cancelar',
            confirmButtonText: "Sí, ¡eliminar!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { data } = await desactivar({ variables: { id } });
                const { estado, message } = data.desactivarTour;
                if (estado) {
                    infoAlert('Tour eliminada', message, 'success', 3000, 'top-end')
                } else {
                    infoAlert('Error eliminar tour', message, 'error', 3000, 'top-end')
                }
            }
        });
    }

    function getFilteredByKey(key, value) {
        const valName = key.nombre.toLowerCase()
        const val = value.toLowerCase()

        if (valName.includes(val)) {
            return key
        }

        return null
    }

    useEffect(() => {
        const getData = () => {
            if (tour) {
                if (tour.obtenerTours) {
                    return tour.obtenerTours.filter((value) => {
                        if (filter !== "") {
                            return getFilteredByKey(value, filter);
                        }
                        return value
                    });
                }
            }
            return []
        }
        setData(getData());

    }, [tour, filter])

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Tours" breadcrumbItem="Ajustes generales Hotel" breadcrumbItemUrl="/hotelsettings" />
                    <Row className="flex" style={{ alignItems: 'flex-end' }}>
                        <div className="col-md-10 mb-3">
                            <label htmlFor="search-input" className="col-md-4 col-form-label">
                                Busca tipo de Tour
                            </label>
                            <input
                                className="form-control"
                                id="search-input"
                                type="search"
                                placeholder="Escribe el nombre del tipo de Tour"
                                onChange={(e) => { setFilter(e.target.value) }}

                            />
                        </div>
                        <div className="col-md-2 col-sm-12 mb-3">
                            <Link to="/hotelsettings/newtour">
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
                                    <DataList onDelete={onDeleteTour} data={data} type="tour" displayLength={9} {...props} />
                                </CardBody>
                            </Card>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
};

export default Tour;