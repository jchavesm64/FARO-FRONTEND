import PropTypes from "prop-types";
import React, { useEffect } from "react";
import logolight from "../../assets/images/faro-light.png";
import logodark from "../../assets/images/faro-dark.png";

import { Row, Col, CardBody, Card, Alert, Container, Form, Input, FormFeedback, Label } from "reactstrap";

//redux
import { useSelector, useDispatch } from "react-redux";

import { Link } from "react-router-dom";
import withRouter from "../../components/Common/withRouter";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";


import { LOGIN } from "../../services/UsuarioService";
import { useMutation } from "@apollo/client";

import { useNavigate } from 'react-router-dom';
import { infoAlert } from "../../helpers/alert";


const Login = props => {
  document.title = "Inicio sesion | FARO";
  const [autenticarUsuario, { loading: load_login, error: error_login }] = useMutation(LOGIN);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,


    initialValues: {
      user: '',
      password: '',
    },
    validationSchema: Yup.object({
      user: Yup.string().required("Por favor ingrese su usuario"),
      password: Yup.string().required("Por favor ingrese su contraseña"),
    }),
    onSubmit: async (values) => {
      localStorage.removeItem('rol');
      const { data } = await autenticarUsuario({ variables: { cedula: values.user, clave: values.password } });
      console.log(data.autenticarUsuario);
      if (data.autenticarUsuario.token !== '0') {
        localStorage.setItem('roles', data.autenticarUsuario.roles);
        localStorage.setItem('token', data.autenticarUsuario.token);
        localStorage.setItem('cedula', data.autenticarUsuario.cedula);
        localStorage.setItem('nombre', data.autenticarUsuario.nombre);
        infoAlert('Excelente', 'Bienvenido', 'success', 3000, 'top-end')
        navigate('/home');
      } else {
        infoAlert('Oops', 'Usuario o contraseña incorrecto', 'error', 3000, 'top-end')
      }
    }
  });

  useEffect(() => {
    document.body.className = "bg-pattern";
    // remove classname when component will unmount
    return function cleanup() {
      document.body.className = "";
    };
  });

  return (
    <React.Fragment>

      <div className="bg-overlay"></div>
      <div className="account-pages my-5 pt-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={6} md={8} xl={4}>
              <Card>
                <CardBody className="p-4">
                  <div>
                    <div className="text-center">
                      <img
                        src={logodark}
                        alt=""
                        height="24"
                        className="auth-logo logo-dark mx-auto"
                      />
                      <img
                        src={logolight}
                        alt=""
                        height="24"
                        className="auth-logo logo-light mx-auto"
                      />
                    </div>
                    <h4 className="font-size-18 text-muted mt-2 text-center">
                      ¡Bienvenido!
                    </h4>
                    <p className="mb-5 text-center">
                      Inicia sesión para continuar
                    </p>
                    <Form
                      className="form-horizontal"
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                    >
                      {/* {error ? <Alert color="danger"><div>{error}</div></Alert> : null} */}
                      <Row>
                        <Col md={12}>
                          <div className="mb-4">
                            <Label className="form-label">Identificación</Label>
                            <Input
                              autoComplete="username"
                              name="user"
                              className="form-control"
                              placeholder="Ingrese su identificación"
                              type="text"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.user || ""}
                              invalid={
                                validation.touched.user && validation.errors.user ? true : false
                              }
                            />
                            {validation.touched.user && validation.errors.user ? (
                              <FormFeedback type="invalid"><div>{validation.errors.user}</div></FormFeedback>
                            ) : null}
                          </div>
                          <div className="mb-4">
                            <Label className="form-label">Contraseña</Label>
                            <Input
                              autoComplete="current-password"
                              name="password"
                              value={validation.values.password || ""}
                              type="password"
                              placeholder="Ingrese su contraseña"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              invalid={
                                validation.touched.password && validation.errors.password ? true : false
                              }
                            />
                            {validation.touched.password && validation.errors.password ? (
                              <FormFeedback type="invalid"><div> {validation.errors.password} </div></FormFeedback>
                            ) : null}
                          </div>
                          <Row>
                            <Col className="col">
                              <div className="text-md-end mt-3 mt-md-0">
                                <Link
                                  to="/auth-recoverpw"
                                  className="text-muted"
                                >
                                  <i className="mdi mdi-lock"></i> ¿Olvidó la contraseña?
                                </Link>
                              </div>
                            </Col>
                          </Row>
                          <div className="d-grid mt-4">
                            <button
                              className="btn btn-primary waves-effect waves-light"
                              type="submit"
                            >
                              Iniciar sesión
                            </button>
                          </div>
                          <div className="mt-4 text-center">
                          </div>

                        </Col>
                      </Row>
                    </Form>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(Login);

Login.propTypes = {
  history: PropTypes.object,
};
