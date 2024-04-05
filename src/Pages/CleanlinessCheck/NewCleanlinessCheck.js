import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Card, CardBody, Container, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { infoAlert } from "../../helpers/alert";
import { useApolloClient, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useNavigate } from 'react-router-dom';
import SpanSubtitleForm from "../../components/Forms/SpanSubtitleForm";
import { OBTENER_PUESTO_LIMPIEZAS } from "../../services/PuestoLimpiezaService";
import TrAreaCheck from "./TrAreaCheck";
import { OBTENER_CHEQUEO, SAVE_CHEQUEO } from "../../services/ChequeoService";
import { OBTENER_USUARIO_CODIGO } from "../../services/UsuarioService"


const NewCleanlinessCheck = (props) => {
    document.title = "Chequeos de limpieza | FARO";

    const navigate = useNavigate();
    const apolloClient = useApolloClient();

    const [insertar] = useMutation(SAVE_CHEQUEO);

    const [fecha, setFecha] = useState(`${new Date().getFullYear()}-${(new Date().getMonth() + 1) >= 10 ? (new Date().getMonth() + 1) : '0' + (new Date().getMonth() + 1)}-${new Date().getDate() >= 10 ? new Date().getDate() : '0' + new Date().getDate()}`)
    const [puestoLimpieza, setPuestoLimpieza] = useState(null)
    const [areas, setAreas] = useState([])
    const [chequeoCargado, setChequeoCargado] = useState(false)
    const [loadingChequeo, setLoadingChequeo] = useState(false)

    const { loading: load_puestos, data: data_puestos } = useQuery(OBTENER_PUESTO_LIMPIEZAS, { pollInterval: 1000 })
    const { data: data_usuario } = useQuery(OBTENER_USUARIO_CODIGO, { variables: { codigo: localStorage.getItem('cedula') } });

    const onClickClean = () => {
        setPuestoLimpieza(null)
        setAreas([])
        setChequeoCargado(false)
        setFecha(`${new Date().getFullYear()}-${(new Date().getMonth() + 1) > 10 ? (new Date().getMonth() + 1) : '0' + (new Date().getMonth() + 1)}-${new Date().getDate() > 10 ? new Date().getDate() : '0' + new Date().getDate()}`)
    }


    // const [ getChequeoExistente, { loading: loading_existente, error: error_existente, data: data_chequeo}] = useLazyQuery(OBTENER_CHEQUEO);

    // useEffect(() => {
    //     console.log(data_chequeo);
    //   if(data_chequeo){
    //     setAreas(data_chequeo.obtenerChequeo.chequeo.areas)
    //   }
    // }, [data_chequeo])

    const getPuestos = () => {
        const puestos = []
        if (data_puestos) {
            data_puestos.obtenerPuestoLimpiezas.map(item => {
                puestos.push({
                    "label": item.nombre,
                    "value": item
                })
            })
        }
        return puestos
    }

    const [disableSave, setDisableSave] = useState(false);

    // useEffect(() => {
    //     if (!fecha) {
    //         setDisableSave(true)
    //     } else {
    //         setDisableSave(false)
    //     }
    // }, [fecha])


    const onSave = async () => {
        try {
            setDisableSave(true)

            const userId = data_usuario.obtenerUsuarioByCodigo.id;

            const input = {
                puesto_limpieza: puestoLimpieza.value.id,
                areas: areas,
                fecha: fecha + ' 00:00:00',
                aprobado: false,
                usuario: userId
            }

            console.log(input);
            const { data } = await insertar({ variables: { input }, errorPolicy: 'all' });
            const { estado, message } = data.insertarChequeo;
            if (estado) {
                infoAlert('Excelente', message, 'success', 3000, 'top-end')
                // navigate(`/cleaningjobs`);
            } else {
                infoAlert('Oops', message, 'error', 3000, 'top-end')
            }
            setDisableSave(false)
        } catch (error) {
            console.log(error);
            setDisableSave(false)
            infoAlert('Oops', 'Ocurrió un error inesperado al guardar el puesto de limpieza', 'error', 3000, 'top-end')
        }
    }

    if (load_puestos) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title='Registrar chequeo' breadcrumbItem='Chequeos de limpieza' breadcrumbItemUrl='/cleaningjobs/checks' />
                        <Row>
                            <div className="col text-center pt-3 pb-3">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        </Row>
                    </Container>
                </div>
            </React.Fragment>)
    }

    const onChangePuestoLimpieza = (e) => {
        setPuestoLimpieza(e)
    }

    const onHandleCheckArea = (areaIndex, checked) => {
        setAreas(area => {
            return area.map((item, index) => {
                if (index === areaIndex) {
                    return { ...item, estado: checked };
                }
                return item;
            });
        });
    }


    const cargarChequeo = async () => {
        if (!puestoLimpieza || puestoLimpieza === null) {
            console.log('if null');
            console.log(puestoLimpieza);
            return null
        }



        try {
            const { data, loading, error } = await apolloClient.mutate({
                mutation: OBTENER_CHEQUEO,
                variables: { id: puestoLimpieza.value.id, fecha: fecha + ' 00:00:00' }
            });

            if (loading) {
                setLoadingChequeo(true)
            }
            if (data) {
                setLoadingChequeo(false)
                setAreas(data.obtenerChequeo.chequeo.areas)
                setChequeoCargado(true)
            }
        } catch (err) {
            console.log(err);
            console.log('catch error');

        }


        // getChequeoExistente({ variables: { id: puestoLimpieza.value.id, fecha: fecha + ' 00:00:00' } })
        // setChequeoCargado(true)
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title='Registrar chequeo' breadcrumbItem='Chequeos de limpieza' breadcrumbItemUrl='/cleaningjobs/checks' />
                    <Row>
                        <div className="col mb-3 text-end">
                            <button type="button" className="btn btn-primary waves-effect waves-light" onClick={() => onClickClean()}>
                                Registrar nuevo chequeo{" "}
                                <i className="ri-save-line align-middle ms-2"></i>
                            </button>
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
                                    <label htmlFor="fecha" className="form-label">* Fecha</label>
                                    <input readOnly={true} className="form-control" type="date" id="fecha" value={fecha} onChange={(e) => setFecha(e.target.value)} />
                                </div>
                            </Row>
                            <Row>
                                <div className="col mb-3">
                                    <label htmlFor="puesto" className="form-label">* Puesto de limpieza</label>
                                    {
                                        !chequeoCargado ?
                                            <Select
                                                id="puesto"
                                                value={puestoLimpieza}
                                                onChange={(e) => {
                                                    onChangePuestoLimpieza(e);
                                                }}
                                                options={getPuestos()}
                                                classNamePrefix="select2-selection"
                                                isSearchable={true}
                                                menuPosition="fixed"
                                            />
                                            :
                                            <input className="form-control" readOnly={true} type="text" value={puestoLimpieza.value.nombre} />
                                    }

                                </div>
                            </Row>
                            <Row>
                                <div className="col mb-3 text-end">
                                    {
                                        !chequeoCargado && puestoLimpieza !== null &&
                                        <button onClick={cargarChequeo} type="button" className="btn btn-primary waves-effect waves-light" >
                                            Cargar{" "}
                                            <i className="ri-save-line align-middle ms-2"></i>
                                        </button>
                                    }

                                </div>
                            </Row>
                        </div>
                        {
                            loadingChequeo && <div className="col-md-7 col-sm-12 mb-3">
                                <Row>
                                    <div className="col text-center pt-3 pb-3">
                                        <div className="spinner-border" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                </Row>
                            </div>
                        }
                        {
                            chequeoCargado && areas.length > 0 &&
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
                                                                <th style={{ width: '40%' }}>Estado</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                areas.map((area, i) => (
                                                                    <TrAreaCheck key={`area-${i}`} area={area} index={i} check={area.estado} onHandleCheckArea={onHandleCheckArea} />
                                                                ))
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </div>
                                </Row>
                                <Row>
                                    <div className="col mb-3 text-end">
                                        <button disabled={disableSave} onClick={onSave} type="button" className="btn btn-primary waves-effect waves-light" >
                                            Guardar{" "}
                                            <i className="ri-save-line align-middle ms-2"></i>
                                        </button>
                                    </div>
                                </Row>
                            </div>

                        }
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default NewCleanlinessCheck;
