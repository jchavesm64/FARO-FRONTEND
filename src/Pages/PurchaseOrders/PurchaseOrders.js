import React, { useState } from "react";
import { Card, CardBody, Container, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Link } from "react-router-dom";
import DataList from "../../components/Common/DataList";
import { useMutation, useQuery } from "@apollo/client";
import Swal from "sweetalert2";
import { infoAlert } from "../../helpers/alert";
import { convertDataCustomersExcel, convertDataPurchaseOrdersExcel, exportAndDownloadExcel } from "../../helpers/exportExcel";
import { DELETE_ORDEN_COMPRA, OBTENER_ORDENES_COMPRA } from "../../services/OrdenCompraService";


const PurchaseOrders = ({ ...props }) => {
    document.title = "Órdenes de compra | FARO";

    const [filter, setFilter] = useState('')
    const { loading: load_ordenes_compra, error: error_ordenes_compra, data: data_ordenes_compra } = useQuery(OBTENER_ORDENES_COMPRA, { pollInterval: 1000 })
    const [desactivar] = useMutation(DELETE_ORDEN_COMPRA);

    function getFilteredByKey(key, value) {
        const val1 = key.proveedor.empresa.toLowerCase();
        const val2 = key.numeroComprobante.toLowerCase();
        const val = value.toLowerCase();
        const val3 = key.consecutivo ? key.consecutivo.consecutivo.toLowerCase() : '';

        if (val1.includes(val) || val2.includes(val) || val3.includes(val)) {
            return key
        }

        return null
    }

    const getData = () => {
        if (data_ordenes_compra) {
            if (data_ordenes_compra.obtenerOrdenesCompra) {
                return data_ordenes_compra.obtenerOrdenesCompra.filter((value, index) => {
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
            title: "Eliminar orden de compra",
            text: `¿Está seguro de eliminar la orden ${name || ''}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#0BB197",
            cancelButtonColor: "#FF3D60",
            cancelButtonText: 'Cancelar',
            confirmButtonText: "Sí, ¡eliminar!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { data } = await desactivar({ variables: { id } });
                const { estado, message } = data.desactivarOrdenCompra;
                if (estado) {
                    infoAlert('Orden de compra eliminada', message, 'success', 3000, 'top-end')
                } else {
                    infoAlert('Eliminar orden de compra', message, 'error', 3000, 'top-end')
                }
            }
        });
    }

    const onClickExportExcel = () => {
        exportAndDownloadExcel('ordenesCompra', convertDataPurchaseOrdersExcel(data))
    }

    const data = getData();

    if (load_ordenes_compra) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title="Órdenes de compra" />
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
                    <Breadcrumbs title="Órdenes de compra" />
                    <Row className="flex" style={{ alignItems: 'flex-end' }}>
                        <div className="col-md-10 mb-3">
                            <label
                                htmlFor="example-search-input"
                                className="col-md-2 col-form-label"
                            >
                                Busca la órden de compra
                            </label>
                            <input className="form-control" value={filter} onChange={(e) => { setFilter(e.target.value) }} type="search" placeholder="Escribe el nombre del proveedor, número de comprobante" />
                        </div>
                        <div className="col-md-2 col-sm-12 mb-3">
                            <Link to="/newpurchaseorder"><button
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
                                    <DataList onDelete={onDelete} data={data} type="purchaseOrders" displayLength={9} {...props} />
                                </CardBody>
                            </Card>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default PurchaseOrders;
