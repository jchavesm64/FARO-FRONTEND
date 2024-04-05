import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Alert, CardBody, Button, Label, Input, FormFeedback, Form, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import withRouter from "../../../components/Common/withRouter";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import DataList from "../../../components/Common/DataList";
import { useMutation, useQuery } from "@apollo/client";
import { DELETE_ROL, OBTENER_ROLES } from '../../../services/RolService';
import { convertirDataRolesExcel, exportAndDownloadExcel } from "../../../helpers/exportExcel";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { infoAlert } from "../../../helpers/alert";

const Roles = ({ ...props }) => {
    document.title = "Roles | FARO";

    const [page, setPage] = useState(1);
    const [displayLength, setDisplayLength] = useState(10);
    const [filter, setFilter] = useState('')
    const [modo, setModo] = useState('1')
    const [confimation, setConfirmation] = useState(false);
    const { loading: load_roles, error: error_roles, data: data_roles } = useQuery(OBTENER_ROLES, { pollInterval: 1000 })
    const [desactivar] = useMutation(DELETE_ROL);
    const [nameRol, setNameRol] = useState('');
    const [idRol, setIdRol] = useState('');
    const [estadoBoton, setEstadoBoton] = useState('Agregar');
    const [iconButton, setIconButton] = useState('ri-save-line align-middle ms-2');

    const onDeleteRol = (id, name) => {
        Swal.fire({
            title: "Eliminar rol",
            text: `¿Está seguro de eliminar el rol ${name}?`,
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
                    infoAlert('Rol eliminado', message, 'success', 3000, 'top-end')
                } else {
                    infoAlert('Eliminar Rol', message, 'error', 3000, 'top-end')
                }
            }
        });
    }

    const onEditRol = async (id, nombre) => {
        setNameRol(nombre);
        setIdRol(id);
        setEstadoBoton('Editar');
        setIconButton('ri-edit-line align-middle ms-2');
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
        if (data_roles) {
            if (data_roles.obtenerRoles) {
                return data_roles.obtenerRoles.filter((value, index) => {
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
        if (modo === "1") {
            const val = key.descripcion.toLowerCase();
            const val2 = value.toLowerCase();
            if (val.includes(val2)) {
                return key
            }
        } else {
            const val = getPermisosSoloUnString(key).toLowerCase();
            const val2 = value.toLowerCase();
            if (val.includes(val2)) {
                return key
            }
        }
        return null;
    }

    const getPermisosSoloUnString = (rol) => {
        let permisos = ''
        if (rol.permisos) {
            let permisosDescripcion = []
            rol.permisos.forEach(permiso => {
                permisosDescripcion.push(permiso.descripcion)
            });
            permisos = permisosDescripcion.join(', ')
        }
        return permisos
    }

    const limpiarRol = () => {
        setNameRol('');
        setIdRol('');
        setEstadoBoton('Agregar');
        setIconButton('ri-save-line align-middle ms-2');
    }


    const onClickExportExcel = () => {
        exportAndDownloadExcel('Roles', convertirDataRolesExcel(data))
    }

    const handleNameRolChange = (e) => {
        setNameRol(e.target.value)
    }

    const data = getData();

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumb title="Roles" />

                    <Row className="flex" style={{ alignItems: 'flex-end' }}>
                        <div className="col-md-10 mb-3">
                            <label htmlFor="example-search-input" className="col-md-3 col-form-label">
                                Busca el rol
                            </label>
                            <input className="form-control" type="search" placeholder="Escribe el nombre del rol" />
                        </div>
                        <div className="col-md-2 col-sm-12 mb-3">
                            <Link to="/newrole">
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
                        <div className="col-2 text-end">
                            <button type="button" className="btn btn-outline-secondary waves-effect waves-light" onClick={() => { limpiarRol() }}>
                                Limpiar{" "}
                                <i className="ri-delete-bin-line align-middle"></i>
                            </button>
                        </div>
                    </Row>

                    <Row>
                        <div className="col mb-3">
                            <Card>
                                <CardBody>
                                    <DataList onDelete={onDeleteRol} data={data} type="roles" displayLength={9} {...props} />
                                </CardBody>
                            </Card>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
};

export default withRouter(Roles);


