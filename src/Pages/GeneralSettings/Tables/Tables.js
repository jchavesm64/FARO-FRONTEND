import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Alert, CardBody, Button, Label, Input, FormFeedback, Form, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import withRouter from "../../../components/Common/withRouter";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import { Link } from "react-router-dom";
import DataList from "../../../components/Common/DataList";
import { useMutation, useQuery } from "@apollo/client";
import Swal from "sweetalert2";
import { infoAlert } from "../../../helpers/alert";
import { DELETE_MESA, OBTENER_MESAS } from '../../../services/MesaService';
import { convertDataTablesExcel, exportAndDownloadExcel } from "../../../helpers/exportExcel";

const Tables = ({ ...props }) => {
    document.title = "Mesas | FARO";

    const [filter, setFilter] = useState('')
    const [page, setPage] = useState(1);
    const [displayLength, setDisplayLength] = useState(10);


    const { loading: loading_table, error: error_table, data: data_table, refetch } = useQuery(OBTENER_MESAS, { pollInterval: 1000 });
    const [desactivar] = useMutation(DELETE_MESA);

    const getData = () => {
        if (data_table) {
            if (data_table.obtenerMesas) {
                return data_table.obtenerMesas.filter((value, index) => {
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
        const val1 = key.numero.toLowerCase();
        const val2 = key.valor.toString();
        const val = value.toLowerCase();
        if (val1.includes(val) || val2.includes(val) || val2.includes(val.replace('%', ''))) {
            return key
        }
    }

    const onDeleteTable = async (id, name) => {
        Swal.fire({
            title: "Eliminar mesa",
            text: `¿Está seguro de eliminar la mesa ${name}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#0BB197",
            cancelButtonColor: "#FF3D60",
            cancelButtonText: 'Cancelar',
            confirmButtonText: "Sí, ¡eliminar!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { data } = await desactivar({ variables: { id } });
                const { estado, message } = data.desactivarMesa;
                if (estado) {
                    infoAlert('Mesa eliminada', message, 'success', 3000, 'top-end')
                    refetch();
                } else {
                    infoAlert('Eliminar Mesa', message, 'error', 3000, 'top-end')
                }
            }
        });
    }

    const onClickExportExcel = () => {
        exportAndDownloadExcel('Mesas', convertDataTablesExcel(data))
    }

    const data = getData();

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumb title="Gestión Mesas" breadcrumbItem="Ajustes Generales" breadcrumbItemUrl="/generalsettings" />

                    <Row className="flex" style={{ alignItems: 'flex-end' }}>
                        <div className="col-md-10 mb-3">
                            <label htmlFor="search-input" className="col-md-3 col-form-label">
                                Busca por numero
                            </label>
                            <input
                                className="form-control"
                                id="search-input"
                                type="search"
                                placeholder="Escribe el numero, tipo, o piso de la mesa"
                                value={filter}
                                onChange={(e) => { setFilter(e.target.value) }}
                            />
                        </div>
                        <div className="col-md-2 col-sm-12 mb-3">
                            <Link to="/newtable">
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
                                    <DataList onDelete={onDeleteTable} data={data} type="tables" displayLength={9} {...props} />
                                </CardBody>
                            </Card>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
};

export default withRouter(Tables);


