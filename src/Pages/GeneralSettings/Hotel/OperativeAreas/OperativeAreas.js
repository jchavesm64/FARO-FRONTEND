import { useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { infoAlert } from "../../../../helpers/alert";
import { Card, CardBody, Container, Row } from "reactstrap";
import Breadcrumbs from "../../../../components/Common/Breadcrumb";
import { Link } from "react-router-dom";
import DataList from "../../../../components/Common/DataList";
import { DELETE_AREA, OBTENER_AREAS } from "../../../../services/AreasOperativasService";

const OperativeAreas = ({ ...props }) => {
    document.title = "Áreas Operativas | FARO";

    const [filter, setFilter] = useState('');
    const [modo] = useState('1')

    const { data: areas } = useQuery(OBTENER_AREAS, { pollInterval: 1000 });
    const [desactivar] = useMutation(DELETE_AREA);

    const onDeleteOperativeArea = (id, nombre) => {
        Swal.fire({
            title: "Eliminar el área",
            text: `¿Está seguro de eliminar el área ${nombre}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#0BB197",
            cancelButtonColor: "#FF3D60",
            cancelButtonText: 'Cancelar',
            confirmButtonText: "Sí, ¡eliminar!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { data } = await desactivar({ variables: { id } });
                const { estado, message } = data.desactivarArea;
                if (estado) {
                    infoAlert('Área eliminada', message, 'success', 3000, 'top-end')
                } else {
                    infoAlert('Error eliminar el área', message, 'error', 3000, 'top-end')
                }
            }
        });
    };

    function getFilteredByKey(modo, key, value) {
        const valName = key.nombre.toLowerCase()
        const val = value.toLowerCase()

        if (valName.includes(val)) {
            return key
        }

        return null
    };

    const getData = () => {
        if (areas) {
            if (areas.obtenerAreas) {
                return areas.obtenerAreas.filter((value, index) => {
                    if (filter !== "" && modo !== "") {
                        return getFilteredByKey(modo, value, filter);
                    }
                    return value
                });
            }
        }
        return []
    };

    const data = getData();

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Áreas operativas" breadcrumbItem="Ajustes generales Hotel" breadcrumbItemUrl="/hotelsettings" />
                    <Row className="flex" style={{ alignItems: 'flex-end' }}>
                        <div className="col-md-10 mb-3">
                            <label htmlFor="search-input" className="col-md-4 col-form-label">
                                Buscar área
                            </label>
                            <input
                                className="form-control"
                                id="search-input"
                                type="search"
                                placeholder="Escribe el nombre del área"
                                onChange={(e) => { setFilter(e.target.value) }}

                            />
                        </div>
                        <div className="col-md-2 col-sm-12 mb-3">
                            <Link to="/hotelsettings/newoperativearea">
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
                                    <DataList onDelete={onDeleteOperativeArea} data={data} type="operativearea" displayLength={9} {...props} />
                                </CardBody>
                            </Card>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
}

export default OperativeAreas;