import React, { useEffect, useState } from "react";
import { Container, Row, Card, CardBody } from "reactstrap";
import withRouter from "../../../components/Common/withRouter";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import { Link, useNavigate } from "react-router-dom";
import DataList from "../../../components/Common/DataList";
import { useMutation, useQuery } from "@apollo/client";
import Swal from "sweetalert2";
import { infoAlert } from "../../../helpers/alert";
import { OBTENER_UBICACIONES, DELETE_UBICACION } from '../../../services/UbicacionService';
import { convertirDataUbicacionesExcel, exportAndDownloadExcel } from "../../../helpers/exportExcel";

const Locations = ({ ...props }) => {
    document.title = "Ubicaciones | FARO";

    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const [displayLength, setDisplayLength] = useState(10);
    const [filter, setFilter] = useState('');
    const [modo, setModo] = useState('1')
    const { loading, error, data: categorias, refetch } = useQuery(OBTENER_UBICACIONES, { pollInterval: 1000 });
    const [desactivar] = useMutation(DELETE_UBICACION);
    const [disableSave, setDisableSave] = useState(true);

    const onDeletLocation = (id, nombre) => {
        Swal.fire({
            title: "Eliminar Ubicación",
            text: `¿Está seguro de eliminar la ubicación ${nombre}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#0BB197",
            cancelButtonColor: "#FF3D60",
            cancelButtonText: 'Cancelar',
            confirmButtonText: "Sí, ¡eliminar!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { data } = await desactivar({ variables: { id } });
                const { estado, message } = data.desactivarUbicacion;
                if (estado) {
                    infoAlert('Ubicación eliminada', message, 'success', 3000, 'top-end')
                    refetch();
                } else {
                    infoAlert('Eliminar Ubicación', message, 'error', 3000, 'top-end')
                }
            }
        });
    }

    function getFilteredByKey(modo, key, value) {
        if (modo === "1") {
            const val = key.nombre.toLowerCase();
            const val2 = value.toLowerCase();

            if (val.includes(val2)) {
                return key
            }
        } else {
            const val = key.cedula.toLowerCase();
            const val2 = value.toLowerCase();

            if (val.includes(val2)) {
                return key
            }
        }
        return null;
    }

    const getData = () => {
        if (categorias) {
            if (categorias.obtenerUbicaciones) {
                return categorias.obtenerUbicaciones.filter((value, index) => {
                    if (filter !== "" && modo !== "") {
                        return getFilteredByKey(modo, value, filter);
                    }
                    return value
                });
            }
        }
        return []
    }

    function getFilteredByKey(modo, key, value) {
        const valName = key.nombre.toLowerCase()
        const val = value.toLowerCase()

        if (valName.includes(val)) {
            return key
        }

        return null
    }

    const onClickExportExcel = () => {
        exportAndDownloadExcel('Ubicaciones', convertirDataUbicacionesExcel(data))
    }

    const data = getData();

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumb title="Gestión de Ubicaciones" breadcrumbItem="Ajustes Generales" breadcrumbItemUrl="/generalsettings" />

                    <Row className="flex" style={{ alignItems: 'flex-end' }}>
                        <div className="col-md-10 mb-3">
                            <label htmlFor="search-input" className="col-md-4 col-form-label">
                                Busca la ubicación
                            </label>
                            <input
                                className="form-control"
                                id="search-input"
                                type="search"
                                placeholder="Escribe el nombre de la ubicación"
                                value={filter}
                                onChange={(e) => { setFilter(e.target.value) }}
                            />
                        </div>
                        <div className="col-md-2 col-sm-12 mb-3">
                            <Link to="/newlocation"><button
                                type="button"
                                className="btn btn-primary waves-effect waves-light"
                                style={{ width: '100%' }}
                            >
                                Agregar{" "}
                                <i className="mdi mdi-plus align-middle ms-2"></i>
                            </button></Link>
                        </div>
                    </Row>

                    <Row className="">
                        <div className="col mb-3">
                            <button
                                type="button"
                                className="btn btn-outline-secondary waves-effect waves-light"
                                onClick={() => { onClickExportExcel() }}
                            >
                                Exportar Excel{" "}
                                <i className="mdi mdi-file-excel align-middle ms-2"></i>
                            </button>
                        </div>
                    </Row>

                    <Row>
                        <div className="col mb-3">
                            <Card>
                                <CardBody>
                                    <DataList onDelete={onDeletLocation} data={data} type="locations" displayLength={9} {...props} />
                                </CardBody>
                            </Card>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
};

export default withRouter(Locations);


