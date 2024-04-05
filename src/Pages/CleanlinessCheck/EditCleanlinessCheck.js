import React, { useEffect, useState } from "react";
import { Alert, Card, CardBody, Container, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { infoAlert } from "../../helpers/alert";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate } from 'react-router-dom';
import SpanSubtitleForm from "../../components/Forms/SpanSubtitleForm";
import { APROBAR_CHEQUEO } from "../../services/ChequeoService";
import { getFechaTZ } from "../../helpers/helpers";


const EditCleanlinessCheck = ({ props, chequeo }) => {
    document.title = "Chequeos | FARO";

    const navigate = useNavigate();

    const [aprobarChequeo] = useMutation(APROBAR_CHEQUEO);

    const [ fecha, setFecha ] = useState(`${new Date().getFullYear()}-${(new Date().getMonth() + 1) >= 10 ? (new Date().getMonth() + 1) : '0' + (new Date().getMonth() + 1)}-${new Date().getDate() >= 10 ? new Date().getDate() : '0' + new Date().getDate()}`)
    const [ fechaRegistro, setFechaRegistro ] = useState(`${new Date().getFullYear()}-${(new Date().getMonth() + 1) >= 10 ? (new Date().getMonth() + 1) : '0' + (new Date().getMonth() + 1)}-${new Date().getDate() >= 10 ? new Date().getDate() : '0' + new Date().getDate()}`)
    const [ puestoLimpieza, setPuestoLimpieza ] = useState(null)
    const [ areas, setAreas ] = useState([])
    const [ usuario, setUsuario ] = useState(null)
    const [ aprobado, setAprobado ] = useState(false)

    const getFecha = (fechaString) => {
        if (fechaString !== null && fechaString.trim().length > 0) {
            const fecha = new Date(fechaString)
            return `${fecha.getFullYear()}-${(fecha.getMonth() + 1) >= 10 ? (fecha.getMonth() + 1) : '0' + (fecha.getMonth() + 1)}-${fecha.getDate() >= 10 ? fecha.getDate() : '0' + fecha.getDate()}`
        }
        return ''
    }

    useEffect(() => {
        setFecha(getFecha(chequeo.fecha))
        setFechaRegistro(chequeo.fechaRegistro)
        setAreas(chequeo.areas)
        setPuestoLimpieza(chequeo.puesto_limpieza || null)
        setUsuario(chequeo.usuario || null)
        setAprobado(chequeo.aprobado)
    }, [chequeo])

  
    const getTime = () => {
        console.log(fechaRegistro);
        console.log(getFechaTZ('hora', fechaRegistro));
        return fechaRegistro
    }

    const onSave = async () => {
        try {
            const { data } = await aprobarChequeo({ variables: { id: chequeo.id }, errorPolicy: 'all' });
            const { estado, message } = data.aprobarChequeo;
            if (estado) {
                infoAlert('Excelente', message, 'success', 3000, 'top-end')
                setAprobado(true)
                // navigate(`/cleaningjobs/checks`);
            } else {
                infoAlert('Oops', message, 'error', 3000, 'top-end')
            }
        } catch (error) {
            infoAlert('Oops', 'Ocurrió un error inesperado al marcar como revisado el chequeo', 'error', 3000, 'top-end')
        }
    }


    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Revisar chequeo" breadcrumbItem="Chequeos" breadcrumbItemUrl='/cleaningjobs/checks'  />
                    <Row>
                        <div className="col">
                            {
                                aprobado &&
                                <Alert className='w-100'>
                                    Este chequeo ya fue revisado
                                </Alert>
                            }
                            {
                                !aprobado &&
                                <Alert color="danger" className='w-100'>
                                    Este chequeo no ha sido revisado
                                </Alert>
                            }
                        </div>
                    </Row>
                    <Row>
                        <div className="col-md-5 col-sm-12 mb-3">
                            <Row>
                                <div className="col mb-3">
                                    <SpanSubtitleForm subtitle='Información general' />
                                </div>
                            </Row>
                            <Row>
                                <div className="col mb-3">
                                    <label htmlFor="fecha" className="form-label">Fecha</label>
                                    <input readOnly={true} className="form-control" type="date" id="fecha" value={fecha}/>
                                </div>
                            </Row>
                            <Row>
                                <div className="col mb-3">
                                    <label htmlFor="fechaRegistro" className="form-label">Hora de registro</label>
                                    <input readOnly={true} className="form-control" type="text" id="fechaRegistro" value={getFechaTZ('hora', fechaRegistro)}/>
                                </div>
                            </Row>
                            {
                                puestoLimpieza !== null &&
                                <Row>
                                    <div className="col mb-3">
                                        <label htmlFor="puesto" className="form-label">Puesto de limpieza</label>
                                        <input id="puesto" className="form-control" readOnly={true} type="text" value={puestoLimpieza.nombre}/>
                                    </div>
                                </Row>
                            }
                            {
                                usuario !== null &&
                                <Row>
                                    <div className="col mb-3">
                                        <label htmlFor="usuario" className="form-label">Usuario</label>
                                        <input id="usuario" className="form-control" readOnly={true} type="text" value={usuario.nombre}/>
                                    </div>
                                </Row>
                            }
                        </div>
                        <div className="col-md-7 col-sm-12 mb-3">
                            <Row>
                                <div className="col mb-3">
                                    <SpanSubtitleForm subtitle='Areas de limpieza' />
                                </div>
                            </Row>
                            <Row>
                                <div className="col">
                                    <Card>
                                        <CardBody>
                                            <div className="table-responsive">
                                                <table className="table table-hover table-striped mb-0">
                                                    <thead>
                                                        <tr>
                                                            <th>Nombre</th>
                                                            <th>Estado</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            areas.map((area, i) => (
                                                                <tr key={`area-${i}`}>
                                                                    <td>{area.area}</td>
                                                                    <td>{area.estado ? 'Limpio' : 'Sin limpiar'}</td>
                                                                </tr>
                                                            ))
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </div>
                            </Row>
                        </div>
                    </Row>
                    {
                       !aprobado && 
                       <Row>
                            <div className="col w-100">
                                <button  onClick={onSave} type="button" className="btn btn-primary waves-effect waves-light w-100" >
                                    Marcar como revisado{" "}
                                    <i className="mdi mdi-check-bold align-middle ms-2"></i>
                                </button>
                            </div>
                        </Row>
                    }
                    
                </Container>
            </div>
        </React.Fragment>
    );
};

export default EditCleanlinessCheck;
