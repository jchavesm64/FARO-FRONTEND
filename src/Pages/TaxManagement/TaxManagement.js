import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Alert, CardBody, Button, Label, Input, FormFeedback, Form, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import withRouter from "../../components/Common/withRouter";
import Breadcrumb from "../../components/Common/Breadcrumb";
import { Link } from "react-router-dom";
import DataList from "../../components/Common/DataList";
import { useMutation, useQuery } from "@apollo/client";
import Swal from "sweetalert2";
import { infoAlert } from "../../helpers/alert";
import { DELETE_IMPUESTO, OBTENER_IMPUESTOS } from '../../services/ImpuestoService';
import { convertDataTaxesExcel, exportAndDownloadExcel } from "../../helpers/exportExcel";

const TaxManagement = ({ ...props }) => {
    document.title = "Impuestos | FARO";

    const [filter, setFilter] = useState('')
    const [page, setPage] = useState(1);
    const [displayLength, setDisplayLength] = useState(10);


    const { loading: loading_tax, error: error_tax, data: data_tax, refetch } = useQuery(OBTENER_IMPUESTOS, { pollInterval: 1000 });
    const [desactivar] = useMutation(DELETE_IMPUESTO);

    const getData = () => {
        if (data_tax) {
            if (data_tax.obtenerImpuestos) {
                return data_tax.obtenerImpuestos.filter((value, index) => {
                    if (filter !== "") {
                        return getFilteredByKey(value, filter);
                    }
                    return value
                });
            }
        }
        return []
    }

    function getFilteredByKey(key, value) {
        const val1 = key.nombre.toLowerCase();
        const val2 = key.valor.toString();
        const val = value.toLowerCase();
        if (val1.includes(val) || val2.includes(val) || val2.includes(val.replace('%', ''))) {
            return key
        }
    }

    const onDeleteTax = async (id, name) => {
        Swal.fire({
            title: "Eliminar impuesto",
            text: `¿Está seguro de eliminar el impuesto ${name}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#0BB197",
            cancelButtonColor: "#FF3D60",
            cancelButtonText: 'Cancelar',
            confirmButtonText: "Sí, ¡eliminar!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { data } = await desactivar({ variables: { id } });
                const { estado, message } = data.desactivarImpuesto;
                if (estado) {
                    infoAlert('Impuesto eliminado', message, 'success', 3000, 'top-end')
                    refetch();
                } else {
                    infoAlert('Eliminar Impuesto', message, 'error', 3000, 'top-end')
                }
            }
        });
    }

    const onClickExportExcel = () => {
        exportAndDownloadExcel('impuestos', convertDataTaxesExcel(data))
    }

    const data = getData();

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumb title="Gestión de impuestos" breadcrumbItem="Ajustes Generales" breadcrumbItemUrl="/generalsettings" />

                    <Row className="flex" style={{ alignItems: 'flex-end' }}>
                        <div className="col-md-10 mb-3">
                            <label htmlFor="search-input" className="col-md-3 col-form-label">
                                Busca por nombre
                            </label>
                            <input
                                className="form-control"
                                id="search-input"
                                type="search"
                                placeholder="Escribe el nombre o porcentaje del impuesto"
                                value={filter}
                                onChange={(e) => { setFilter(e.target.value) }}
                            />
                        </div>
                        <div className="col-md-2 col-sm-12 mb-3">
                            <Link to="/newtaxmanagement">
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
                                    <DataList onDelete={onDeleteTax} data={data} type="taxManagement" displayLength={9} {...props} />
                                </CardBody>
                            </Card>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
};

export default withRouter(TaxManagement);


