import { useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { DELETE_SERVICIO, OBTENER_SERVICIO } from "../../../../services/ServiciosExtraService";
import Swal from "sweetalert2";
import { infoAlert } from "../../../../helpers/alert";
import { Card, CardBody, Container, Row } from "reactstrap";
import Breadcrumbs from "../../../../components/Common/Breadcrumb";
import { Link } from "react-router-dom";
import DataList from "../../../../components/Common/DataList";

const ExtraService = ({ ...props }) => {
    document.title = "Servicios Extra | FARO";

    const [filter, setFilter] = useState('');
    const [modo] = useState('1')

    const { data: servicio } = useQuery(OBTENER_SERVICIO, { pollInterval: 1000 });
    const [desactivar] = useMutation(DELETE_SERVICIO);

    const onDeleteTypeRoom = (id, nombre) => {
        Swal.fire({
            title: "Eliminar el Servicio",
            text: `¿Está seguro de eliminar el Servicio ${nombre}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#0BB197",
            cancelButtonColor: "#FF3D60",
            cancelButtonText: 'Cancelar',
            confirmButtonText: "Sí, ¡eliminar!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { data } = await desactivar({ variables: { id } });
                const { estado, message } = data.desactivarServicio;
                if (estado) {
                    infoAlert('Servicio eliminado', message, 'success', 3000, 'top-end')
                } else {
                    infoAlert('Error eliminar habitación', message, 'error', 3000, 'top-end')
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
        if (servicio) {
            if (servicio.obtenerServicios) {
                return servicio.obtenerServicios.filter((value, index) => {
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
                    <Breadcrumbs title="Servicios" breadcrumbItem="Ajustes generales Hotel" breadcrumbItemUrl="/hotelsettings" />
                    <Row className="flex" style={{ alignItems: 'flex-end' }}>
                        <div className="col-md-10 mb-3">
                            <label htmlFor="search-input" className="col-md-4 col-form-label">
                                Busca Servicio
                            </label>
                            <input
                                className="form-control"
                                id="search-input"
                                type="search"
                                placeholder="Escribe el nombre del Servicio"
                                onChange={(e) => { setFilter(e.target.value) }}

                            />
                        </div>
                        <div className="col-md-2 col-sm-12 mb-3">
                            <Link to="/hotelsettings/newextraservices">
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
                                    <DataList onDelete={onDeleteTypeRoom} data={data} type="extraservice" displayLength={9} {...props} />
                                </CardBody>
                            </Card>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
}

export default ExtraService;