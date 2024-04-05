import React, { useState, useEffect } from "react";
import { Card, Container, Row } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import SpanSubtitleForm from "../../../components/Forms/SpanSubtitleForm";
import { infoAlert } from "../../../helpers/alert";
import { useMutation } from "@apollo/client";
import { useNavigate, useParams } from 'react-router-dom';
import { SAVE_ROL, UPDATE_ROLES } from "../../../services/RolService";
import TrPermission from "./TrPermission";
import { appModules } from "../../../CommonData/Data/modules";

const EditRole = ({ props, role }) => {
    document.title = "Roles | FARO";

    const [roleName, setRoleName] = useState('');
    const [disableSave, setDisableSave] = useState(true);
    const [permissions, setPermissions] = useState([])

    useEffect(() => {
        setRoleName(role.nombre)

        let tempPermissions = [...role.permisos]
        appModules.forEach(module => {
            const foundModule = role.permisos.some(permiso => permiso.modulo.toLowerCase() === module.toLowerCase());
            if (!foundModule) {
                tempPermissions = [...tempPermissions, { modulo: module, editar: false, eliminar: false, agregar: false, ver: false }]
            }
        });

        setPermissions(tempPermissions)
    }, [role])

    const navigate = useNavigate();
    const [actualizar] = useMutation(UPDATE_ROLES);

    useEffect(() => {
        setDisableSave(roleName === '')
    }, [roleName])

    const onClickSave = async () => {
        try {
            setDisableSave(true)
            const input = {
                nombre: roleName,
                permisos: permissions,
                estado: "ACTIVO"
            }
            const { data } = await actualizar({ variables: { id: role.id, input }, errorPolicy: 'all' });
            const { estado, message } = data.actualizarRol;
            if (estado) {
                infoAlert('Excelente', message, 'success', 3000, 'top-end')
                navigate('/roles');
            } else {
                infoAlert('Oops', message, 'error', 3000, 'top-end')
            }
            setDisableSave(false)
        } catch (error) {
            console.log(error)
            infoAlert('Oops', 'Ocurrió un error inesperado al guardar el rol', 'error', 3000, 'top-end')
            setDisableSave(false)
        }
    }

    const onHandlePermission = (mode, name, value) => {
        const vari = permissions.map(item => {
            if (item.modulo === name) {
                let val = {}
                if (mode === 'edit') {
                    val = {
                        editar: value
                    }
                } else if (mode === 'delete') {
                    val = {
                        eliminar: value
                    }
                } else if (mode === 'see') {
                    val = {
                        ver: value
                    }
                } else if (mode === 'add') {
                    val = {
                        agregar: value
                    }
                } else if (mode === 'all') {
                    val = {
                        editar: true,
                        eliminar: true,
                        agregar: true,
                        ver: true
                    }
                } else if (mode === 'none') {
                    val = {
                        editar: false,
                        eliminar: false,
                        agregar: false,
                        ver: false
                    }
                }

                return {
                    ...item,
                    ...val
                }
            }
            return item
        })

        setPermissions(vari)
    }


    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Editar rol" breadcrumbItem="Roles" breadcrumbItemUrl='/roles' />
                    <Row>
                        <div className="col mb-3 text-end">
                            <button type="button" className="btn btn-primary waves-effect waves-light" disabled={disableSave} onClick={() => onClickSave()}>
                                Guardar{" "}
                                <i className="ri-save-line align-middle ms-2"></i>
                            </button>
                        </div>
                    </Row>
                    <Row>
                        <div className="col-md-12 col-sm-12">
                            <Row>
                                <div className="col mb-3">
                                    <SpanSubtitleForm subtitle='Información del Rol' />
                                </div>
                            </Row>
                            <Row>
                                <div className="col-md-6 col-sm-12 mb-3">
                                    <label htmlFor="roleName" className="form-label">* Nombre del rol</label>
                                    <input className="form-control" type="text" id="roleName" value={roleName} onChange={(e) => { setRoleName(e.target.value) }} />
                                </div>
                            </Row>
                            <Row>
                                <div className="col mb-3">
                                    <SpanSubtitleForm subtitle='Permisos' />
                                </div>
                            </Row>
                            {
                                permissions.length > 0 &&
                                <Row>
                                    <div className="col mb-3">
                                        <Card>
                                            <div className="table-responsive mb-3">
                                                <table className="table table-hover table-striped mb-0">
                                                    <thead>
                                                        <tr>
                                                            <th>Nombre</th>
                                                            <th>Permisos</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            permissions.map((module, i) => (
                                                                <TrPermission permission={module} onHandlePermission={onHandlePermission} key={`module-${i}`} />
                                                            ))
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </Card>
                                    </div>
                                </Row>
                            }

                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
}

export default EditRole;