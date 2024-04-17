import React, { useState } from "react";
import { Card, CardBody, CardTitle, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Link } from "react-router-dom";
import DataList from "../../components/Common/DataList";
import { useMutation, useQuery } from "@apollo/client";
import Swal from "sweetalert2";
import { infoAlert } from "../../helpers/alert";
import { convertDataSuppliersExcel, exportAndDownloadExcel } from "../../helpers/exportExcel";
import { DELETE_PROVEEDOR, OBTENER_PROVEEDORES } from "../../services/ProveedorService";


const Suppliers = ({ ...props }) => {
    document.title = "Proveedores | FARO";

    const [filter, setFilter] = useState('')
    const { loading: load_proveedores, error: error_proveedores, data: data_proveedores } = useQuery(OBTENER_PROVEEDORES, { pollInterval: 1000 })
    const [desactivar] = useMutation(DELETE_PROVEEDOR);


    function getFilteredByKey(key, value) {
        const valName = key.empresa.toLowerCase();
        const valCode = key.cedula.toLowerCase();
        const valCountry = key.pais.toLowerCase();
        const val = value.toLowerCase()
        const valEmail = key.correos?.some(correo => correo.email.includes(val));
        const valPhone = key.telefonos?.some(telefono => telefono.telefono.includes(val));

        let condition = false
        if (key.provedurias && key.provedurias.length > 0) {
            condition = key.provedurias.filter(p => p.tipo.toLowerCase().includes(val)).length > 0
        }
        if (valName.includes(val) || valCode.includes(val) || valCountry.includes(val) || condition || valEmail || valPhone) {
            return key
        }

        return null
    }

    const getData = () => {
        if (data_proveedores) {
            if (data_proveedores.obtenerProveedores) {
                return data_proveedores.obtenerProveedores.filter((value, index) => {
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
            title: "Eliminar proveedor",
            text: `¿Está seguro de eliminar al proveedor ${name}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#0BB197",
            cancelButtonColor: "#FF3D60",
            cancelButtonText: 'Cancelar',
            confirmButtonText: "Sí, ¡eliminar!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { data } = await desactivar({ variables: { id } });
                const { estado, message } = data.desactivarProveedor;
                if (estado) {
                    infoAlert('Proveedor eliminado', message, 'success', 3000, 'top-end')
                } else {
                    infoAlert('Eliminar proveedor', message, 'error', 3000, 'top-end')
                }
            }
        });
    }

    const onClickExportExcel = () => {
        exportAndDownloadExcel('proveedores', convertDataSuppliersExcel(data))
    }

    const data = getData();

    if (load_proveedores) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title="Proveedores" />
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
                    <Breadcrumbs title="Proveedores" />
                    <Row className="flex" style={{ alignItems: 'flex-end' }}>
                        <div className="col-md-10 mb-3">
                            <label
                                htmlFor="search-input"
                                className="col-md-2 col-form-label"
                            >
                                Busca el proveedor
                            </label>
                            <input
                                className="form-control"
                                id="search-input"
                                value={filter}
                                onChange={(e) => { setFilter(e.target.value) }}
                                type="search"
                                placeholder="Escribe el nombre, identificación, correo, teléfono o país del proveedor" />
                        </div>
                        <div className="col-md-2 col-sm-12 mb-3">
                            <Link to="/newsupplier"><button
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
                                    <DataList onDelete={onDelete} data={data} type="suppliers" displayLength={9} {...props} />
                                </CardBody>
                            </Card>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default Suppliers;
