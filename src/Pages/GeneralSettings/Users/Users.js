import React, { useState, useEffect } from "react";
import { Container, Row, Card, CardBody } from "reactstrap";
import withRouter from "../../../components/Common/withRouter";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import { Link } from "react-router-dom";
import DataList from "../../../components/Common/DataList";
import { useMutation, useQuery } from "@apollo/client";
import Swal from "sweetalert2";
import { infoAlert } from "../../../helpers/alert";
import { OBTENER_USUARIOS_ACTIVOS, DELETE_USER } from '../../../services/UsuarioService';
import { convertirDataUsuariosExcel, exportAndDownloadExcel } from "../../../helpers/exportExcel";

const Users = ({ ...props }) => {
    document.title = "Usuarios | FARO";

    const [filter, setFilter] = useState('')

    const [displayLength, setDisplayLength] = useState(10);
    const { loading: load_usuarios, error: error_usuarios, data: data_usuarios } = useQuery(OBTENER_USUARIOS_ACTIVOS, { pollInterval: 1000 })
    const [desactivar] = useMutation(DELETE_USER);

    const getData = () => {
        if (data_usuarios) {
            if (data_usuarios.obtenerUsuariosActivos) {
                return data_usuarios.obtenerUsuariosActivos.filter((value, index) => {
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
        const val = value.toLowerCase()
        const valName = key.nombre.toLowerCase()
        const valId = key.cedula.toLowerCase()
        const valEmail = key.correos?.some(correo => correo.email.includes(val));
        const valPhone = key.telefonos?.some(telefono => telefono.telefono.includes(val));

        if (valName.includes(val) || valId.includes(val) || valEmail || valPhone) {
            return key
        }

        return null
    }

    const onDeleteUser = (id, name) => {
        Swal.fire({
            title: "Eliminar usuario",
            text: `¿Está seguro de eliminar el usuario ${name}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#0BB197",
            cancelButtonColor: "#FF3D60",
            cancelButtonText: 'Cancelar',
            confirmButtonText: "Sí, ¡eliminar!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { data } = await desactivar({ variables: { id } });
                const { estado, message } = data.desactivarCliente;
                if (estado) {
                    infoAlert('Usuario eliminado', message, 'success', 3000, 'top-end')
                } else {
                    infoAlert('Eliminar Usuario', message, 'error', 3000, 'top-end')
                }
            }
        });
    }


    const onClickExportExcel = () => {
        exportAndDownloadExcel('Usuarios', convertirDataUsuariosExcel(data))
    }

    const data = getData();

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumb title="Usuarios" breadcrumbItem="Ajustes Generales" breadcrumbItemUrl="/generalsettings" />

                    <Row className="flex" style={{ alignItems: 'flex-end' }}>
                        <div className="col-md-10 mb-3">
                            <label htmlFor="search-input" className="col-md-3 col-form-label">
                                Busca el usuario
                            </label>
                            <input
                                className="form-control"
                                id="search-input"
                                type="search"
                                placeholder="Escribe el nombre, identificación, correo o teléfono del usuario"
                                value={filter}
                                onChange={(e) => { setFilter(e.target.value) }}
                            />
                        </div>
                        <div className="col-md-2 col-sm-12 mb-3">
                            <Link to="/newuser">
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
                                    <DataList onDelete={onDeleteUser} data={data} type="users" displayLength={9} {...props} />
                                </CardBody>
                            </Card>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
};

export default withRouter(Users);


