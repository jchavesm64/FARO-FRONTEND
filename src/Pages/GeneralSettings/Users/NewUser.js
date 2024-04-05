import React, { useEffect, useState } from "react";
import { Card, CardBody, Container, Row } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import Select from "react-select";
import SpanSubtitleForm from "../../../components/Forms/SpanSubtitleForm";
import { infoAlert } from "../../../helpers/alert";
import ListInfo from "../../../components/Common/ListInfo";
import { useMutation, useQuery } from "@apollo/client";
import { SAVE_USER } from "../../../services/UsuarioService";
import { OBTENER_ROLES } from "../../../services/RolService";
import { useNavigate } from 'react-router-dom';
import countriesJson from '../../../store/json/countries.json'

const NewUser = (props) => {
    document.title = "Usuarios | FARO";

    const navigate = useNavigate();

    const [userId, setUserId] = useState('')
    const [userName, setUserName] = useState('')

    const [code, setCode] = useState(null);

    const [insertar] = useMutation(SAVE_USER);

    const { loading: load_roles, error: error_roles, data: data_roles } = useQuery(OBTENER_ROLES)

    const codes = countriesJson.map(c => ({ label: c.code, value: c.code }));

    const handleCode = (c) => {
        setCode(c)
    }

    const getRoles = () => {
        if (data_roles) {
            if (data_roles.obtenerRoles) {
                return data_roles.obtenerRoles.map(rol => ({
                    label: rol.nombre,
                    value: rol.id
                }));
            }
        }
        return []
    }

    const userRoles = getRoles();

    const [roles, setRoles] = useState([])
    const [rolesTemp, setRolesTemp] = useState('')
    const [telefonos, setTelefonos] = useState([]);
    const [telefonoTemp, setTelefonoTemp] = useState('');
    const [correos, setCorreos] = useState([]);
    const [correoTemp, setCorreoTemp] = useState('');

    const agregarTelefono = () => {
        if (code) {
            var band = false;
            telefonos.map(t => {
                if (t.telefono === code.value + ' ' + telefonoTemp) {
                    band = true;
                }
            })
            if (!band) {
                setTelefonos([...telefonos, { 'telefono': `${code.value} ${telefonoTemp}` }])
                setTelefonoTemp('');
            } else {
                infoAlert('Oops', 'Ese teléfono ya existe', 'error', 3000, 'top-end')
            }
        } else {
            infoAlert('Oops', 'No ha seleccionado el código', 'error', 3000, 'top-end')
        }
    }

    const eliminarTelefono = (telefono) => {
        setTelefonos(telefonos.filter(e => e.telefono !== telefono))
    }

    const agregarCorreo = () => {
        if (/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(correoTemp)) {
            var band = false;
            correos.map(c => {
                if (c.email === correoTemp) {
                    band = true;
                }
            })
            if (!band) {
                setCorreos([...correos, {
                    "email": correoTemp
                }])
                setCorreoTemp('')
            } else {
                infoAlert('Oops', 'Ese correo ya existe', 'error', 3000, 'top-end')
            }
        } else {
            infoAlert('Oops', 'El formato del correo es incorrecto', 'error', 3000, 'top-end')
        }
    }

    const eliminarCorreo = (correo) => {
        setCorreos(correos.filter(e => e.email !== correo))
    }

    const agregarRol = () => {
        if (rolesTemp) {
            var band = false;
            roles.map(r => {
                if (r.id === rolesTemp.value) {
                    band = true;
                }
            })
            if (!band) {
                setRoles([...roles, { "id": rolesTemp.value, "nombre": rolesTemp.label }])
                setRolesTemp('')
            } else {
                infoAlert('Oops', 'Ese rol ya existe', 'error', 3000, 'top-end')
            }
        } else {
            infoAlert('Oops', 'No ha seleccionado el rol', 'error', 3000, 'top-end')
        }
    }

    const eliminarRol = (rol) => {
        setRoles(roles.filter(r => r.nombre !== rol))
    }

    function handleUserRole(selectedRole) {
        setRolesTemp(selectedRole);
    }

    const [disableSave, setDisableSave] = useState(true);

    useEffect(() => {
        setDisableSave(userName.trim().length === 0 || userId.trim().length === 0 || roles.length === 0 || correos.length === 0 || telefonos.length === 0)
    }, [userName, userId, roles, correos, telefonos])

    const onClickSave = async () => {
        try {
            setDisableSave(true)
            const input = {
                nombre: userName,
                cedula: userId,
                correos,
                telefonos,
                roles: roles.map(r => r.id),
                estado: "ACTIVO"
            }
            const { data } = await insertar({ variables: { input }, errorPolicy: 'all' });
            const { estado, message } = data.insertarUsuario;
            if (estado) {
                infoAlert('Excelente', message, 'success', 3000, 'top-end')
                navigate('/users');
            } else {
                infoAlert('Oops', message, 'error', 3000, 'top-end')
            }
            setDisableSave(false)
        } catch (error) {
            infoAlert('Oops', 'Ocurrió un error inesperado al guardar el usuario', 'error', 3000, 'top-end')
            setDisableSave(false)
        }
    }
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Usuario nuevo" breadcrumbItem="Usuarios" breadcrumbItemUrl="/users" />
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
                                    <SpanSubtitleForm subtitle='Información del usuario' />
                                </div>
                            </Row>
                            <Row>
                                <div className="col-md-6 col-sm-12 mb-3">
                                    <label htmlFor="id" className="form-label">* Identificación</label>
                                    <input className="form-control" type="text" id="id" value={userId} onChange={(e) => { setUserId(e.target.value) }} />
                                </div>
                                <div className="col-md-6 col-sm-12 mb-3">
                                    <label htmlFor="name" className="form-label">* Nombre</label>
                                    <input className="form-control" type="text" id="name" value={userName} onChange={(e) => { setUserName(e.target.value) }} />
                                </div>
                            </Row>
                            <Row>
                                <div className="col-md-4 col-sm-12">
                                    <Card className="p-2">
                                        <CardBody>
                                            <Row>
                                                <div className="col mb-2">
                                                    * Teléfonos
                                                </div>
                                            </Row>
                                            <div className="row row-cols-lg-auto g-3 align-items-center">
                                                <div className="col-12 mb-1">
                                                    <Select
                                                        value={code}
                                                        onChange={(e) => {
                                                            handleCode(e);
                                                        }}
                                                        options={codes}
                                                        classNamePrefix="select2-selection"
                                                    />
                                                </div>
                                                <div className="col-12 mb-1">
                                                    <label className="visually-hidden" htmlFor="inlineTel">Username</label>
                                                    <input
                                                        type="tel"
                                                        className="form-control"
                                                        id="inlineTel"
                                                        placeholder="Teléfono"
                                                        value={telefonoTemp}
                                                        onChange={(e) => { setTelefonoTemp(e.target.value) }}
                                                    />
                                                </div>
                                                <div className="col-12 mb-1">
                                                    <button type="submit" className="btn btn-outline-primary" onClick={() => { agregarTelefono() }}>
                                                        Agregar
                                                    </button>
                                                </div>
                                            </div>
                                            <Row>
                                                <ListInfo data={telefonos} headers={['Teléfono']} keys={['telefono']} enableEdit={false} enableDelete={true} actionDelete={eliminarTelefono} mainKey={'telefono'} />
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </div>
                                <div className="col-md-4 col-sm-12">
                                    <Card className="p-2">
                                        <CardBody>
                                            <Row>
                                                <div className="col mb-2">
                                                    * Correo electrónico
                                                </div>
                                            </Row>
                                            <div className="row row-cols-lg-auto g-3 align-items-center">
                                                <div className="col-12 mb-1">
                                                    <label className="visually-hidden" htmlFor="inlineEmail">Correo</label>
                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        id="inlineEmail"
                                                        placeholder="ejemplo@correo.com"
                                                        value={correoTemp}
                                                        onChange={(e) => { setCorreoTemp(e.target.value) }}
                                                    />
                                                </div>
                                                <div className="col-12 mb-1">
                                                    <button type="submit" className="btn btn-outline-primary" onClick={() => { agregarCorreo() }}>
                                                        Agregar
                                                    </button>
                                                </div>
                                            </div>
                                            <Row>
                                                <ListInfo data={correos} headers={['Correo']} keys={['email']} enableEdit={false} enableDelete={true} actionDelete={eliminarCorreo} mainKey={'email'} />
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </div>
                                <div className="col-md-4 col-sm-12">
                                    <Card className="p-2">
                                        <CardBody>
                                            <Row>
                                                <div className="col mb-2">
                                                    * Roles
                                                </div>
                                            </Row>
                                            <div className="row row-cols-lg-auto g-3 align-items-center">
                                                <div className="col-12 mb-1">
                                                    <Select
                                                        placeholder="Seleccione el rol"
                                                        value={rolesTemp}
                                                        onChange={(e) => {
                                                            handleUserRole(e);
                                                        }}
                                                        options={userRoles}
                                                        classNamePrefix="select2-selection"
                                                    />
                                                </div>
                                                <div className="col-12 mb-1">
                                                    <button type="submit" className="btn btn-outline-primary" onClick={() => { agregarRol() }}>
                                                        Agregar
                                                    </button>
                                                </div>
                                            </div>
                                            <Row>
                                                <ListInfo data={roles} headers={['Rol']} keys={['nombre']} enableEdit={false} enableDelete={true} actionDelete={eliminarRol} mainKey={'nombre'} />
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </div>
                            </Row>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default NewUser;