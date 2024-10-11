import React, { useState } from "react";
import { Card, CardBody, CardTitle, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Link } from "react-router-dom";
import DataList from "../../components/Common/DataList";
import { useMutation, useQuery } from "@apollo/client";
import Swal from "sweetalert2";
import { infoAlert } from "../../helpers/alert";
import { convertDataCleaningJobsExcel, exportAndDownloadExcel } from "../../helpers/exportExcel";
import { DELETE_PUESTO_LIMPIEZA, OBTENER_PUESTO_LIMPIEZAS } from "../../services/PuestoLimpiezaService";


const CleaningJobs = ({ ...props }) => {
    document.title = "Puestos de limpieza | FARO";

    const [filter, setFilter] = useState('')
    const { loading: load_puesto_limpieza, error: error_puesto_limpieza, data: data_puesto_limpieza, refetch } = useQuery(OBTENER_PUESTO_LIMPIEZAS, { pollInterval: 1000 })
    const [desactivar] = useMutation(DELETE_PUESTO_LIMPIEZA);


    function getFilteredByKey(key, value) {
        const val1 = key.nombre.toLowerCase()
        const val2 = key.ubicacion.nombre.toLowerCase()
        const val3 = key.codigo.toLowerCase()
        const val = value.toLowerCase()


        if (val1.includes(val) || val2.includes(val) || val3.includes(val)) {
            return key
        }

        return null
    }

    const getData = () => {
        if (data_puesto_limpieza) {
            if (data_puesto_limpieza.obtenerPuestoLimpiezas) {
                return data_puesto_limpieza.obtenerPuestoLimpiezas.filter((value, index) => {
                    if (filter !== "") {
                        return getFilteredByKey(value, filter);
                    }
                    return value
                });
            }
        }
        return []
    }

    const onDelete = (id, name) => {
        Swal.fire({
            title: "Eliminar puesto de limpieza",
            text: `¿Está seguro de eliminar el puesto de limpieza ${name}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#0BB197",
            cancelButtonColor: "#FF3D60",
            cancelButtonText: 'Cancelar',
            confirmButtonText: "Sí, ¡eliminar!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { data } = await desactivar({ variables: { id } });
                const { estado, message } = data.desactivarPuestoLimpieza;
                if (estado) {
                    infoAlert('Puesto de limpieza eliminado', message, 'success', 3000, 'top-end')
                    refetch();
                } else {
                    infoAlert('Eliminar puesto de limpieza', message, 'error', 3000, 'top-end')
                }
            }
        });
    }

    const onClickExportExcel = () => {
        exportAndDownloadExcel('puestosLimpieza', convertDataCleaningJobsExcel(data))
    }

    const data = getData();

    if (load_puesto_limpieza) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title="Puestos de limpieza" />
                        <Row>
                            <div className="col text-center pt-3 pb-3">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        </Row>
                    </Container>
                </div>
            </React.Fragment>)
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Puestos de limpieza" />
                    <Row className="flex" style={{ alignItems: 'flex-end' }}>
                        <div className="col-md-10 mb-3">
                            <label
                                htmlFor="search-input"
                                className="col-md-2 col-form-label"
                            >
                                Busca el puesto de limpieza
                            </label>
                            <input
                                className="form-control"
                                id="search-input"
                                value={filter}
                                onChange={(e) => { setFilter(e.target.value) }}
                                type="search"
                                placeholder="Escribe el nombre, código, o la ubicación del puesto de limpieza" />
                        </div>
                        <div className="col-md-2 col-sm-12 mb-3">
                            <Link to="/newcleaningjob"><button
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
                                    <DataList onDelete={onDelete} data={data} type="cleaningJobs" displayLength={9} {...props} />
                                </CardBody>
                            </Card>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default CleaningJobs;
