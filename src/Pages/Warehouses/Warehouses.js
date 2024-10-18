import React, { useState } from "react";
import { Card, CardBody, Container, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Link } from "react-router-dom";
import DataList from "../../components/Common/DataList";
import { useMutation, useQuery } from "@apollo/client";
import Swal from "sweetalert2";
import { infoAlert } from "../../helpers/alert";
import { convertDataCustomersExcel, convertDataPurchaseOrdersExcel, convertDataWarehouseExcel, exportAndDownloadExcel } from "../../helpers/exportExcel";
import { DELETE_ORDEN_COMPRA, OBTENER_ORDENES_COMPRA } from "../../services/OrdenCompraService";
import { ELIMINAR_ALMANCEN, OBTENER_ALMACENES } from "../../services/AlmacenService";


const Warehouses = ({ ...props }) => {
    document.title = "Almacenes | FARO";

    const [filter, setFilter] = useState('')
    const { loading: load_almacenes, error: error_almacens, data: data_almacenes, refetch } = useQuery(OBTENER_ALMACENES, { pollInterval: 1000 })
    const [desactivar] = useMutation(ELIMINAR_ALMANCEN);

    function getFilteredByKey(key, value) {
        const val1 = key.nombre.toLowerCase();
        const val2 = key.descripcion.toLowerCase();
        const val = value.toLowerCase();

        if (val1.includes(val) || val2.includes(val)) {
            return key
        }

        return null
    }

    const getData = () => {
        if (data_almacenes) {
            if (data_almacenes.obtenerAlmacenes) {
                return data_almacenes.obtenerAlmacenes.filter((value, index) => {
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
            title: "Eliminar almacén",
            text: `¿Está seguro de eliminar este almacén ${name || ''}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#0BB197",
            cancelButtonColor: "#FF3D60",
            cancelButtonText: 'Cancelar',
            confirmButtonText: "Sí, ¡eliminar!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { data } = await desactivar({ variables: { id } });
                const { estado, message } = data.desactivarAlmacen;
                if (estado) {
                    infoAlert('Almacén eliminado', message, 'success', 3000, 'top-end')
                    refetch();
                } else {
                    infoAlert('Eliminar almacén', message, 'error', 3000, 'top-end')
                }
            }
        });
    }

    const onClickExportExcel = () => {
        exportAndDownloadExcel('warehouses', convertDataWarehouseExcel(data))
    }

    const data = getData();

    if (load_almacenes) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title="Almacenes" />
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
                    <Breadcrumbs title="Almacenes" />
                    <Row className="flex" style={{ alignItems: 'flex-end' }}>
                        <div className="col-md-10 mb-3">
                            <label
                                htmlFor="search-input"
                                className="col-md-2 col-form-label"
                            >
                                Busca el almacén
                            </label>
                            <input
                                className="form-control"
                                id="search-input"
                                value={filter}
                                onChange={(e) => { setFilter(e.target.value) }}
                                type="search"
                                placeholder="Escribe el nombre o la descripción del almacén" />
                        </div>
                        <div className="col-md-2 col-sm-12 mb-3">
                            <Link to="/newwarehouse"><button
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
                                    <DataList onDelete={onDelete} data={data} type="warehouses" displayLength={9} {...props} />
                                </CardBody>
                            </Card>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default Warehouses;
