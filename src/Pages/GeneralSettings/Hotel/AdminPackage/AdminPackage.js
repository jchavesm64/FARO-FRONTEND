import React, { useState } from "react";
import { Card, Container, Row, CardBody } from "reactstrap";
import { useMutation, useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../../../components/Common/Breadcrumb";
import DataList from "../../../../components/Common/DataList";
import { DELETE_PAQUETE, OBTENER_PAQUETES } from "../../../../services/PaquetesService";
import Swal from "sweetalert2";
import { infoAlert } from "../../../../helpers/alert";


const AdminPackages = ({ ...props }) => {
    document.title = "Administrar paquetes de hotel | FARO";

    const { data: paquetes } = useQuery(OBTENER_PAQUETES, { pollInterval: 1000 });
    const [desactivar] = useMutation(DELETE_PAQUETE);

    const [filter, setFilter] = useState('');

    const onDeletePackage = (id, nombre) => {
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
                const { estado, message } = data.desactivarPaquete;
                if (estado) {
                    infoAlert('Paquete eliminada', message, 'success', 3000, 'top-end')
                } else {
                    infoAlert('Eliminar paquete', message, 'error', 3000, 'top-end')
                }
            }
        });
    };

    function getFilteredByKey(key, value) {
        const valName = key.nombre.toLowerCase()
        const val = value.toLowerCase()

        if (valName.includes(val)) {
            return key
        }

        return null
    }

    const getData = () => {
        if (paquetes) {
            if (paquetes.obtenerPaquetes) {
                return paquetes.obtenerPaquetes.filter((value) => {
                    if (filter !== "") {
                        return getFilteredByKey(value, filter);
                    }
                    return value
                });
            }
        }
        return [];
    };

    const data = getData();

    console.log(paquetes)
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Administrar paquetes" breadcrumbItem="Ajustes generales Hotel" breadcrumbItemUrl="/hotelsettings" />
                    <Row className="flex" style={{ alignItems: 'flex-end' }}>
                        <div className="col-md-10 mb-3">
                            <label htmlFor="search-input" className="col-md-4 col-form-label">
                                Busca paquete
                            </label>
                            <input
                                className="form-control"
                                id="search-input"
                                type="search"
                                placeholder="Escribe el nombre del paquete"
                                onChange={(e) => { setFilter(e.target.value) }}

                            />
                        </div>
                        <div className="col-md-2 col-sm-12 mb-3">
                            <Link to="/hotelsettings/newpackage">
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
                                    <DataList onDelete={onDeletePackage} data={data} type="package" displayLength={9} {...props} />
                                </CardBody>
                            </Card>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
};

export default AdminPackages;