import React, { useState } from 'react';
import DataList from '../../components/Common/DataList';
import Swal from 'sweetalert2';
import { infoAlert } from '../../helpers/alert';
import { Card, CardBody, Container, Row } from "reactstrap";
import { useMutation, useQuery } from '@apollo/client';
import { OBTENER_ACTIVOS, ELIMINAR_ACTIVO } from '../../services/ActivosService';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { convertirDataActivosExcel, exportAndDownloadExcel } from '../../helpers/exportExcel';

//TODO: Make sure if unit of the asset is necessary
const Assets = () => {
    document.title = "Activos | FARO";

    const { loading: load_activos, error: error_activos, data: data_activos } = useQuery(OBTENER_ACTIVOS, { pollInterval: 1000 })
    const [desactivar] = useMutation(ELIMINAR_ACTIVO);

    const [filter, setFilter] = useState('')

    function getFilteredByKey(key, value) {
        const valName = key.nombre.toLowerCase()
        const valInternalRef = key.referenciaInterna?.toLowerCase()
        const val = value.toLowerCase()


        if (valName.includes(val) || valInternalRef?.includes(val)) {
            return key
        }

        return null
    }

    const getData = () => {
        if (data_activos) {
            if (data_activos.obtenerActivos) {
                return data_activos.obtenerActivos.filter((value, index) => {
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

    const onClickExportExcel = () => {
        exportAndDownloadExcel('Activos', convertirDataActivosExcel(data))
    }

    const onDeleteAsset = (id, nombre, referenciaInterna) => {

        Swal.fire({
            title: "Eliminar activo",
            text: `¿Está seguro de eliminar el activo ${nombre} - Referencia: ${referenciaInterna}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#0BB197",
            cancelButtonColor: "#FF3D60",
            cancelButtonText: 'Cancelar',
            confirmButtonText: "Sí, ¡eliminar!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { data } = await desactivar({ variables: { id } });
                const { estado, message } = data.desactivarRol;
                if (estado) {
                    infoAlert('Activo eliminado', message, 'success', 3000, 'top-end')
                } else {
                    infoAlert('Eliminar Activo', message, 'error', 3000, 'top-end')
                }
            }
        });
    }

    if (load_activos) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title="Activos" breadcrumbItem="Inicio" breadcrumbItemUrl="/home" />
                        <Row>
                            <div className="col text-center pt-3 pb-3">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        </Row>
                    </Container>
                </div>
            </React.Fragment>
        );
    }


    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Activos" breadcrumbItem="Inicio" breadcrumbItemUrl="/home" />

                    <Row className="flex" style={{ alignItems: 'flex-end' }}>
                        <div className="col-md-10 mb-3">
                            <label htmlFor="search-input" className="col-md-3 col-form-label">
                                Busca el activo
                            </label>
                            {/*<input className="form-control" value={filter} onChange={(e) => { setFilter(e.target.value) }} type="search"
                                placeholder="Escribe el nombre, la unidad o la referencia interna del activo" />*/}
                            <input
                                className="form-control"
                                id="search-input"
                                value={filter}
                                onChange={(e) => { setFilter(e.target.value) }}
                                type="search"
                                placeholder="Escribe el nombre o la referencia interna del activo" />
                        </div>
                        <div className="col-md-2 col-sm-12 mb-3">
                            <Link to="/newasset">
                                <button type="button" className="btn btn-primary waves-effect waves-light" style={{ width: '100%' }} >
                                    Agregar{" "}
                                    <i className="mdi mdi-plus align-middle ms-2"></i>
                                </button>
                            </Link>
                        </div>
                    </Row>
                    <Row className="">
                        <div className="col mb-3">
                            <button
                                type="button"
                                className="btn btn-outline-secondary waves-effect waves-light"
                                onClick={() => { onClickExportExcel() }}>
                                Exportar Excel{" "}
                                <i className="mdi mdi-file-excel align-middle ms-2"></i>
                            </button>
                        </div>
                    </Row>
                    <Row>
                        <div className="col mb-3">
                            <Card>
                                <CardBody>
                                    <DataList onDelete={onDeleteAsset} data={data} type="assets" />
                                </CardBody>
                            </Card>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
}

export default Assets;