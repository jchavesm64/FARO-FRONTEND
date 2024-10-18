import React, { useEffect, useState } from "react";
import { Container, Row, Card, CardBody } from "reactstrap";
import withRouter from "../../../components/Common/withRouter";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import { Link, useNavigate } from "react-router-dom";
import DataList from "../../../components/Common/DataList";
import { useMutation, useQuery } from "@apollo/client";
import Swal from "sweetalert2";
import { infoAlert } from "../../../helpers/alert";
import { OBTENER_PISOS, DELETE_PISO } from '../../../services/PisoService';
import { convertirDataUbicacionesExcel, exportAndDownloadExcel } from "../../../helpers/exportExcel";

const Floors = ({ ...props }) => {
    document.title = "Pisos | FARO";

    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const [displayLength, setDisplayLength] = useState(10);
    const [filter, setFilter] = useState('');
    const [modo, setModo] = useState('1')
    const { loading, error, data: pisos, refetch } = useQuery(OBTENER_PISOS, { pollInterval: 1000 });
    const [desactivar] = useMutation(DELETE_PISO);

    const onDeleteFloor = (id, nombre) => {
        Swal.fire({
            title: "Eliminar Piso",
            text: `¿Está seguro de eliminar el Piso ${nombre}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#0BB197",
            cancelButtonColor: "#FF3D60",
            cancelButtonText: 'Cancelar',
            confirmButtonText: "Sí, ¡eliminar!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const { data } = await desactivar({
                        variables: { id },
                    });
                    const { estado, message } = data.desactivarPiso;
                    if (estado) {
                        infoAlert('Piso eliminado', message, 'success', 3000, 'top-end')
                        refetch();
                    } else {
                        infoAlert('Eliminar Piso', message, 'error', 3000, 'top-end')
                    }
                } catch (error) {
                    console.error("Error deleting piso:", error);
                    infoAlert('Error', 'Hubo un problema al eliminar el piso. Por favor, inténtelo de nuevo.', 'error', 3000, 'top-end')
                }
            }
        });
    }

    function getFilteredByKey(key, value) {
        const val = key.nombre.toLowerCase();
        const val2 = value.toLowerCase();

        if (val.includes(val2)) {
            return key
        }
        return null;
    }

    const getData = () => {
        if (pisos) {
            if (pisos.obtenerPisos) {
                return pisos.obtenerPisos.filter((value, index) => {
                    if (filter !== "" && modo !== "") {
                        return getFilteredByKey(value, filter);
                    }
                    return value
                });
            }
        }
        return []
    }

    const onClickExportExcel = () => {
        exportAndDownloadExcel('Pisos', convertirDataUbicacionesExcel(data))
    }

    const data = getData();
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumb title="Gestión de Pisos" breadcrumbItem="Ajustes Generales" breadcrumbItemUrl="/generalsettings" />

                    <Row className="flex" style={{ alignItems: 'flex-end' }}>
                        <div className="col-md-10 mb-3">
                            <label htmlFor="search-input" className="col-md-4 col-form-label">
                                Busca el piso
                            </label>
                            <input
                                className="form-control"
                                id="search-input"
                                type="search"
                                placeholder="Escribe el nombre del Piso"
                                value={filter}
                                onChange={(e) => { setFilter(e.target.value) }}
                            />
                        </div>
                        <div className="col-md-2 col-sm-12 mb-3">
                            <Link to="/newfloor"><button
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
                                    <DataList onDelete={onDeleteFloor} data={data} type="floors" displayLength={9} {...props} />
                                </CardBody>
                            </Card>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
};

export default withRouter(Floors);


