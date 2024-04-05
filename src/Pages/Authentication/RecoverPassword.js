import React, { useEffect, useState } from 'react';


import logolight from '../../assets/images/faro-light.png';
import logodark from '../../assets/images/faro-dark.png';

import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import { infoAlert } from '../../helpers/alert';
import { ENVIAR_CORREO, OBTENER_USUARIO_CODIGO, RECUPERAR_CLAVE } from '../../services/UsuarioService';
import { useLazyQuery, useMutation } from '@apollo/client';

const RecoverPassword = () => {
    document.title = "Olvido contraseña | FARO";
    const navigate = useNavigate();


    const [cedula, setCedula] = useState('');
    const [correo, setCorreo] = useState('');

    const [ultimoPaso, setUltimoPaso] = useState(false)

    const [codigo, setCodigo] = useState(null)
    const [codigoVerificacion, setCodigoVerificacion] = useState('')
    const [clave, setClave] = useState('');

    const [recuperar] = useMutation(RECUPERAR_CLAVE);
    const [sendMail] = useMutation(ENVIAR_CORREO);

    const [disableResetPassword, setDisableResetPassword] = useState(true);

    useEffect(() => {
        if (!codigoVerificacion || codigoVerificacion.trim().length === 0 || !clave || clave.trim().length === 0) {
            setDisableResetPassword(true)
        } else {
            setDisableResetPassword(false)
        }
    }, [codigoVerificacion, clave])

    const restaurarClave = async (event) => {
        event.preventDefault();
        setDisableResetPassword(true)
        if (!codigoVerificacion || codigoVerificacion.trim().length === 0) {
            return
        }

        console.log(codigo);
        console.log(codigoVerificacion);

        if (codigo !== codigoVerificacion) {
            infoAlert('Oops', 'Los códigos de verificación no coinciden', 'error', 3000, 'top-end')
            return
        }

        const { data } = await recuperar({ variables: { codigo: cedula, nueva: clave }, errorPolicy: 'all' });
        const { success, message } = data.recuperarClave;
        if (success) {
            infoAlert('Excelente', message, 'success', 3000, 'top-end')
            navigate(`/login`);
        } else {
            infoAlert('Oops', message, 'error', 3000, 'top-end')
        }
        setDisableResetPassword(false)
    }

    const [disableSendEmail, setDisableSendEmail] = useState(true);

    useEffect(() => {
        if (!correo || correo.trim().length === 0 || !cedula || cedula.trim().length === 0) {
            setDisableSendEmail(true)
        } else {
            setDisableSendEmail(false)
        }
    }, [correo, cedula])

    const handleClickSendEmail = async (event) => {
        event.preventDefault();
        setDisableSendEmail(true)
        const { data } = await sendMail({ variables: { codigo: cedula, correo }, errorPolicy: 'all' });
        const { estado, message, codigo } = data.enviarCodigoVerificacion;
        if (estado) {
            setCodigo(codigo);
            setUltimoPaso(true)
            infoAlert('Excelente', message, 'success', 3000, 'top-end')
        } else {
            setCodigo('');
            setUltimoPaso(false)
            infoAlert('Oops', message, 'error', 3000, 'top-end')
        }
        setDisableSendEmail(false)
    }

    return (
        <React.Fragment>
            <div className="bg-pattern" style={{ height: "100vh" }}>
                <div className="bg-overlay"></div>
                <div className="account-pages pt-5">
                    <Container>
                        <Row className="justify-content-center">
                            <Col lg={6} md={8} xl={4}>
                                <Card className='mt-5'>
                                    <CardBody className="p-4">
                                        <div className="">
                                            <div className="text-center">
                                                <Link to="/login" className="">
                                                    <img src={logodark} alt="" height="24" className="auth-logo logo-dark mx-auto" />
                                                    <img src={logolight} alt="" height="24" className="auth-logo logo-light mx-auto" />
                                                </Link>
                                            </div>
                                            <h4 className="font-size-18 text-muted mt-2 text-center">Olvidó su contraseña</h4>
                                            <p className="mb-5 text-center">Solicitar cambio de contraseña</p>
                                            <Row>
                                                <Col md={12}>
                                                    <form>
                                                        <div className="alert alert-warning alert-dismissible">
                                                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                                            Ingrese su <b>identificación, correo</b> y se te enviará un correo con una contraseña temporal.
                                                        </div>

                                                        <div className="mb-3">
                                                            <label className="form-label" htmlFor="useremail">Identificación</label>
                                                            <input autoComplete='off' disabled={ultimoPaso} type="text" className="form-control" id="useremail" placeholder="Ingrese su identificación" value={cedula} onChange={(e) => { setCedula(e.target.value) }} />
                                                        </div>
                                                        <div className="mb-3">
                                                            <label className="form-label" htmlFor="email">Correo</label>
                                                            <input autoComplete='off' disabled={ultimoPaso} type="email" className="form-control" id="email" placeholder="Ingrese su correo" value={correo} onChange={(e) => { setCorreo(e.target.value) }} />
                                                        </div>
                                                        {
                                                            !codigo && !ultimoPaso &&
                                                            <div className="d-grid mt-4">
                                                                <button disabled={disableSendEmail} className="btn btn-primary waves-effect waves-light" onClick={(e) => { handleClickSendEmail(e) }}>Enviar correo</button>
                                                            </div>
                                                        }
                                                        {
                                                            ultimoPaso &&
                                                            <>
                                                                <div className="mb-3">
                                                                    <label className="form-label" htmlFor="codeVer">Código de verificación</label>
                                                                    <input autoComplete='off' type="text" className="form-control" id="codeVer" placeholder="Ingrese el código de verificación que le llegó por correo electrónico" value={codigoVerificacion} onChange={(e) => { setCodigoVerificacion(e.target.value) }} />
                                                                </div>
                                                                <div className="mb-3">
                                                                    <label className="form-label" htmlFor="clave">Contraseña nueva</label>
                                                                    <input type="password" className="form-control" id="clave" placeholder="Ingrese la contraseña nueva" value={clave} onChange={(e) => { setClave(e.target.value) }} autoComplete='new-password' />
                                                                </div>
                                                                <div className="d-grid mt-4">
                                                                    <button disabled={disableResetPassword} className="btn btn-primary waves-effect waves-light" onClick={(e) => { restaurarClave(e) }}>Restaurar contraseña</button>
                                                                </div>
                                                            </>
                                                        }
                                                    </form>
                                                </Col>
                                            </Row>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>

        </React.Fragment>
    );
}

export default RecoverPassword;