import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Card, CardBody, Container, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { infoAlert } from "../../helpers/alert";
import { useApolloClient, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useNavigate } from 'react-router-dom';
import SpanSubtitleForm from "../../components/Forms/SpanSubtitleForm";
import { OBTENER_CHEQUEO, SAVE_CHEQUEO } from "../../services/ChequeoService";
import { OBTENER_ALMACENES } from "../../services/AlmacenService";
import { OBTENER_LINEAS_ALMACEN } from "../../services/AlmacenLineaService";
import TrInternTransferLine from "./TrInternTransferLine";
import { GUARDAR_TRANSFERENCIA } from "../../services/TransferenciaInternaService";
import { OBTENER_USUARIO_CODIGO } from "../../services/UsuarioService"


const NewInternTransfer = (props) => {
    document.title = "Transferencias internas | FARO";

    const navigate = useNavigate();
    const apolloClient = useApolloClient();

    const [insertar] = useMutation(GUARDAR_TRANSFERENCIA);

    const [fecha, setFecha] = useState(`${new Date().getFullYear()}-${(new Date().getMonth() + 1) >= 10 ? (new Date().getMonth() + 1) : '0' + (new Date().getMonth() + 1)}-${new Date().getDate() >= 10 ? new Date().getDate() : '0' + new Date().getDate()}`)
    const [nota, setNota] = useState('')
    const [almacenDesde, setAlmacenDesde] = useState(null)
    const [almacenHasta, setAlmacenHasta] = useState(null)
    const [lineasAlmacen, setLineasAlmacen] = useState([])
    const [lineasAlmacenCargadas, setChequeoCargado] = useState(false)
    const [loadingLineasAlmacen, setLoadingLineasAlmacen] = useState(false)

    const { loading: load_almacenes, data: data_almacenes } = useQuery(OBTENER_ALMACENES, { pollInterval: 1000 })
    const { data: data_usuario } = useQuery(OBTENER_USUARIO_CODIGO, { variables: { codigo: localStorage.getItem('cedula') } });
    const [getWarehouseLines, { loading: load_lineas_almacen, data: data_lineas_almacen }] = useLazyQuery(OBTENER_LINEAS_ALMACEN, { pollInterval: 1000 });

    useEffect(() => {
        if (load_lineas_almacen) {
            setLoadingLineasAlmacen(true)
        }
        if (data_lineas_almacen) {
            setLoadingLineasAlmacen(false)
            setLineasAlmacen(data_lineas_almacen.obtenerLineasAlmacen.map((l, i) => {
                return {
                    ...l,
                    cantidadTransferir: 0
                }
            }))
            setChequeoCargado(true)
        }
    }, [data_lineas_almacen, load_lineas_almacen])

    const onClickClean = () => {
        // setPuestoLimpieza(null)
        // setAreas([])
        // setChequeoCargado(false)
        // setFecha(`${new Date().getFullYear()}-${(new Date().getMonth() + 1) > 10 ? (new Date().getMonth() + 1) : '0' + (new Date().getMonth() + 1)}-${new Date().getDate() > 10 ? new Date().getDate() : '0' + new Date().getDate()}`)
    }

    const getAlmacenes = () => {
        const puestos = []
        if (data_almacenes) {
            data_almacenes.obtenerAlmacenes.map(item => {
                puestos.push({
                    "label": item.nombre,
                    "value": item
                })
            })
        }
        return puestos
    }

    const [disableSave, setDisableSave] = useState(false);

    const onSave = async () => {
        try {
            let lineasTem = lineasAlmacen.filter(l => l.cantidadTransferir > 0)
            if (lineasTem && lineasTem.length > 0) {
                setDisableSave(true)
                const userId = data_usuario.obtenerUsuarioByCodigo.id;
                const input = {
                    fecha: fecha + ' 00:00:00',
                    nota: nota,
                    almacenDesde: almacenDesde.value.id,
                    almacenHasta: almacenHasta.value.id,
                    usuario: userId
                }

                const lineas = lineasTem.map((l, i) => {
                    if (l.cantidadTransferir > 0) {
                        return {
                            producto: l.producto.id,
                            cantidad: parseFloat(l.cantidadTransferir)
                        }
                    }

                })
                const { data } = await insertar({ variables: { input, lineas }, errorPolicy: 'all' });
                const { estado, message } = data.insertarTransferenciaInterna;
                if (estado) {
                    infoAlert('Excelente', message, 'success', 3000, 'top-end')
                    navigate(`/internTransfers`);
                } else {
                    infoAlert('Oops', message, 'error', 3000, 'top-end')
                }
                setDisableSave(false)
            } else {
                infoAlert('Oops', 'No ha colocado ninguna cantidad a transferir', 'warning', 3000, 'top-end')
            }
        } catch (error) {
            console.log(error);
            setDisableSave(false)
            infoAlert('Oops', 'Ocurrió un error inesperado al registrar la transferencia interna', 'error', 3000, 'top-end')
        }
    }

    if (load_almacenes) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title='Nueva transferencia interna' breadcrumbItem='Transferencias internas' breadcrumbItemUrl='/internTransfers' />
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

    const onChangeAlmacenDesde = (e) => {
        setAlmacenDesde(e)
        setAlmacenHasta(null)
    }

    const onChangeAlmacenHasta = (e) => {
        setAlmacenHasta(e)
    }

    const onHandleCantidadTransferir = (lineaIndex, value) => {
        setLineasAlmacen(linea => {
            return linea.map((item, index) => {
                if (index === lineaIndex) {
                    return { ...item, cantidadTransferir: value };
                }
                return item;
            });
        });
    }


    const cargarLineasAlmacen = () => {
        if (!almacenDesde || almacenDesde === null || !almacenHasta || almacenHasta === null) {
            return null
        }
        try {
            getWarehouseLines({ variables: { id: almacenDesde.value.id } })
        } catch (err) {
            console.log(err);
            setLoadingLineasAlmacen(false)
        }
    }


    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title='Nueva transferencia interna' breadcrumbItem='Transferencias internas' breadcrumbItemUrl='/internTransfers' />
                    {
                        lineasAlmacenCargadas && lineasAlmacen.length > 0 &&
                        <Row>
                            <div className="col mb-3 text-end">
                                <button disabled={disableSave} onClick={onSave} type="button" className="btn btn-primary waves-effect waves-light" >
                                    Guardar{" "}
                                    <i className="ri-save-line align-middle ms-2"></i>
                                </button>
                            </div>
                        </Row>
                    }
                    <Row>
                        <div className="col mb-3">
                            <SpanSubtitleForm subtitle='Información general' />
                        </div>
                    </Row>
                    <Row>
                        <div className="col-md-5 col-sm-12">
                            <Row>
                                <div className="col mb-3">
                                    <label htmlFor="fecha" className="form-label">* Fecha</label>
                                    <input readOnly={true} className="form-control" type="date" id="fecha" value={fecha} onChange={(e) => setFecha(e.target.value)} />
                                </div>
                            </Row>
                            <Row>
                                <div className="col mb-3">
                                    <label htmlFor="almacenDesde" className="form-label">* Almacén que envía</label>
                                    {
                                        !lineasAlmacenCargadas ?
                                            <Select
                                                id="almacenDesde"
                                                value={almacenDesde}
                                                onChange={(e) => {
                                                    onChangeAlmacenDesde(e);
                                                }}
                                                options={getAlmacenes()}
                                                classNamePrefix="select2-selection"
                                                isSearchable={true}
                                                menuPosition="fixed"
                                            />
                                            :
                                            <input className="form-control" readOnly={true} type="text" value={almacenDesde.value.nombre} />
                                    }

                                </div>
                            </Row>
                            <Row>
                                <div className="col mb-3">
                                    <label htmlFor="almacenHasta" className="form-label">* Almacén que recibe</label>
                                    {
                                        !lineasAlmacenCargadas ?
                                            <Select
                                                id="almacenHasta"
                                                value={almacenHasta}
                                                onChange={(e) => {
                                                    onChangeAlmacenHasta(e);
                                                }}
                                                options={getAlmacenes().filter(a => a.label !== almacenDesde?.label)}
                                                isDisabled={almacenDesde === null}
                                                classNamePrefix="select2-selection"
                                                isSearchable={true}
                                                menuPosition="fixed"
                                            />
                                            :
                                            <input className="form-control" readOnly={true} type="text" value={almacenHasta.value.nombre} />
                                    }

                                </div>
                            </Row>
                            <Row>
                                <div className="col mb-3">
                                    <label htmlFor="nota" className="form-label">Nota</label>
                                    <textarea id="nota" className="form-control" rows={3} value={nota} onChange={(e) => { setNota(e.target.value) }}></textarea>
                                </div>
                            </Row>
                            {
                                !lineasAlmacenCargadas && almacenDesde !== null && almacenHasta !== null &&
                                <Row>
                                    <div className="col mb-3">

                                        <button onClick={cargarLineasAlmacen} type="button" className="btn btn-outline-primary waves-effect waves-light w-100" >
                                            Cargar{" "}
                                            <i className="ri-save-line align-middle ms-2"></i>
                                        </button>
                                    </div>
                                </Row>
                            }
                        </div>
                        <div className="col-md-7 col-sm-12">
                            {
                                loadingLineasAlmacen &&
                                <Row>
                                    <div className="col text-center pt-3 pb-3">
                                        <div className="spinner-border" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                </Row>
                            }
                            {
                                lineasAlmacenCargadas && lineasAlmacen.length > 0 &&
                                <>
                                    <Row>
                                        <div className="col mb-3">
                                            <SpanSubtitleForm subtitle='Productos en almacén' />
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
                                                                    <th>Producto</th>
                                                                    <th>Cantidad disponible</th>
                                                                    <th>Cantidad a transferir</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    lineasAlmacen.map((linea, i) => (
                                                                        <TrInternTransferLine key={`lineaAlmacen-${i}`} linea={linea} index={i} onHandleChange={onHandleCantidadTransferir} />
                                                                    ))
                                                                }
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </div>
                                    </Row>
                                </>
                            }
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default NewInternTransfer;
