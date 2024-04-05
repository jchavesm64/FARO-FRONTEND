import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Card,
  CardBody,
} from "reactstrap";

import withRouter from "../../components/Common/withRouter";

//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb";

import { CAMBIAR_CLAVE, OBTENER_USUARIO_CODIGO, UPDATE_USER } from "../../services/UsuarioService"
import { useMutation, useQuery } from "@apollo/client";
import { infoAlert } from "../../helpers/alert";
import countriesJson from '../../store/json/countries.json'
import SpanSubtitleForm from "../../components/Forms/SpanSubtitleForm";
import Select from "react-select";
import ListInfo from "../../components/Common/ListInfo";


const UserProfile = () => {
  document.title = "Perfil | FARO";


  const [userId, setUserId] = useState(localStorage.getItem('cedula'))
  const { loading: load_user, error: error_user, data: data_user } = useQuery(OBTENER_USUARIO_CODIGO, { variables: { codigo: userId }, pollInterval: 1000 })
  const [actualizarPassword] = useMutation(CAMBIAR_CLAVE);
  const [actualizar] = useMutation(UPDATE_USER);

  const [code, setCode] = useState(null);
  const codes = countriesJson.map(c => ({ label: c.code, value: c.code }));
  const handleCode = (c) => {
    setCode(c)
  }

  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [samePasswordError, setSamePasswordError] = useState(false)
  const [passwordMatchError, setPasswordMatchError] = useState(false)

  const [userName, setUserName] = useState('')
  const [roles, setRoles] = useState([])
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

  useEffect(() => {
    if (data_user) {
      setUserId(data_user.obtenerUsuarioByCodigo.cedula)
      setUserName(data_user.obtenerUsuarioByCodigo.nombre)
      setCorreos(data_user.obtenerUsuarioByCodigo.correos || [])
      setTelefonos(data_user.obtenerUsuarioByCodigo.telefonos || [])
      setRoles(data_user.obtenerUsuarioByCodigo.roles || [])
    }
  }, [data_user])

  const [disableSaveContactInfo, setDisableSaveContactInfo] = useState(true);
  const [disableSavePassword, setDisableSavePassword] = useState(true);

  useEffect(() => {
    setDisableSaveContactInfo(correos.length === 0 || telefonos.length === 0)
  }, [correos, telefonos])

  useEffect(() => {
    setDisableSavePassword(password === '' || newPassword === '' || confirmNewPassword === '' || newPassword !== confirmNewPassword || (newPassword === password && newPassword !== '' && password !== ''))
    setSamePasswordError(newPassword === password && newPassword !== '' && password !== '')
    setPasswordMatchError(newPassword !== confirmNewPassword)
  }, [password, newPassword, confirmNewPassword])

  const getRoles = () => {
    var rolesTemp = []
    roles.map(r => {
      rolesTemp.push(r.nombre)
    })
    return rolesTemp.join(', ')
  }

  const resetPasswordInputs = () => {
    setPassword('')
    setNewPassword('')
    setConfirmNewPassword('')
    setShowPassword(false)
  }

  const onClickSavePassword = async () => {
    try {
      setDisableSavePassword(true)
      const actual = password
      const nueva = newPassword
      const id = data_user.obtenerUsuarioByCodigo.id;
      const { data } = await actualizarPassword({ variables: { id, actual, nueva }, errorPolicy: 'all' });
      const { success, message } = data.cambiarClave;
      if (success) {
        infoAlert('Excelente', message, 'success', 3000, 'top-end')
        resetPasswordInputs()
      } else {
        infoAlert('Oops', message, 'error', 3000, 'top-end')
      }
      setDisableSavePassword(false)
    } catch (error) {
      console.log(error)
      infoAlert('Oops', 'Ocurrió un error inesperado al actualizar la contraseña', 'error', 3000, 'top-end')
      setDisableSavePassword(false)
    }
  }

  const onClickSaveContactInfo = async () => {
    try {
      setDisableSaveContactInfo(true)
      const input = {
        correos,
        telefonos,
      }
      const id = data_user.obtenerUsuarioByCodigo.id;
      const { data } = await actualizar({ variables: { id, input }, errorPolicy: 'all' });
      const { estado, message } = data.actualizarUsuario;
      if (estado) {
        infoAlert('Excelente', message, 'success', 3000, 'top-end')
      } else {
        infoAlert('Oops', message, 'error', 3000, 'top-end')
      }
      setDisableSaveContactInfo(false)
    } catch (error) {
      console.log(error)
      infoAlert('Oops', 'Ocurrió un error inesperado al actualizar la información de contacto', 'error', 3000, 'top-end')
      setDisableSaveContactInfo(false)
    }
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Perfil" breadcrumbItem="Inicio" breadcrumbItemUrl="/home" />
          <Row>
            <div className="col mb-3">
              <SpanSubtitleForm subtitle='Información Personal' />
            </div>
            <div className="col mb-3">
              <SpanSubtitleForm subtitle='Contraseña' />
            </div>
          </Row>
          <Row>
            <div className="col-md-12 col-sm-12">
              <Row>
                <div className="col-md-6 col-sm-12">
                  <Card>
                    <CardBody className="text-muted">
                      <h5 className="mb-4">{userName}</h5>
                      <p className="mb-4">Cedula: {userId}</p>
                      <p className="mb-0">Roles: {getRoles()}</p>
                    </CardBody>
                  </Card>
                </div>
                <div className="col-md-6 col-sm-12">
                  <Row>
                    <div className="col-md-6 col-sm-12 mb-3">
                      <label htmlFor="password" className="form-label">* Contraseña Actual</label>
                      <div className="input-group">
                        <input className="form-control" type={showPassword ? 'text' : 'password'} id="password" value={password} onChange={(e) => { setPassword(e.target.value) }} />
                        <span className="input-group-text" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <i className="mdi mdi-eye"></i> : <i className="mdi mdi-eye-off"></i>}
                        </span>
                      </div>
                    </div>
                    <div className="col mb-6 text-center align-self-center">
                      <button type="button" className="btn btn-danger waves-effect waves-light" disabled={disableSavePassword} onClick={() => onClickSavePassword()}>
                        Actualizar Contraseña{" "}
                        <i className="ri-save-line align-middle ms-2"></i>
                      </button>
                    </div>
                  </Row>
                  <Row>
                    <div className="col-md-6 col-sm-12 mb-3">
                      <label htmlFor="newPassword" className="form-label">* Nueva Contraseña</label>
                      <div className="input-group">
                        <input className={`form-control ${samePasswordError || passwordMatchError ? 'is-invalid' : ''}`} type={showPassword ? 'text' : 'password'} id="newPassword" value={newPassword} onChange={(e) => { setNewPassword(e.target.value) }} />
                        <span className="input-group-text" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <i className="mdi mdi-eye"></i> : <i className="mdi mdi-eye-off"></i>}
                        </span>
                        {samePasswordError && <div className="invalid-feedback">La nueva contraseña no puede ser igual a la actual</div>}
                      </div>
                    </div>
                    <div className="col-md-6 col-sm-12 mb-3">
                      <label htmlFor="newPasswordR" className="form-label">* Confrimar Nueva Contraseña</label>
                      <div className="input-group">
                        <input className={`form-control ${passwordMatchError ? 'is-invalid' : ''}`} type={showPassword ? 'text' : 'password'} id="newPasswordR" value={confirmNewPassword} onChange={(e) => { setConfirmNewPassword(e.target.value) }} />
                        <span className="input-group-text" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <i className="mdi mdi-eye"></i> : <i className="mdi mdi-eye-off"></i>}
                        </span>
                        {passwordMatchError && <div className="invalid-feedback">Las contraseñas no coinciden</div>}
                      </div>
                    </div>
                  </Row>
                </div>
              </Row>
              <Row>
                <div className="col mb-3">
                  <SpanSubtitleForm subtitle='Información de Contacto' />
                </div>
              </Row>
              <Row>
                <div className="col-md-6 col-sm-12">
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
                <div className="col-md-6 col-sm-12">
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
              </Row>
              <Row>
                <div className="col mb-3 text-center">
                  <button type="button" className="btn btn-primary waves-effect waves-light" disabled={disableSaveContactInfo} onClick={() => onClickSaveContactInfo()}>
                    Actualizar Información de Contacto{" "}
                    <i className="ri-save-line align-middle ms-2"></i>
                  </button>
                </div>
              </Row>
            </div>
          </Row>
        </Container >
      </div >
    </React.Fragment >
  );
};

export default withRouter(UserProfile);
