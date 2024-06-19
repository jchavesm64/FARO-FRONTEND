import React, { useEffect, useState, forwardRef } from "react";
import { Card, CardBody, Container, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useQuery } from "@apollo/client";
import SpanSubtitleForm from "../../components/Forms/SpanSubtitleForm";
import { OBTENER_LINEAS_TRANSFERENCIA_INTERNA } from "../../services/TransferenciaInternaLineaService";


const EditInternTransfer = forwardRef(({ props, internTransfer }, ref) => {
    document.title = "Transferencias internas | FARO";

    const [fecha, setFecha] = useState(``)
    const [nota, setNota] = useState('')
    const [almacenDesde, setAlmacenDesde] = useState(null)
    const [almacenHasta, setAlmacenHasta] = useState(null)
    const [lineasAlmacen, setLineasAlmacen] = useState([])

    const { loading: load_lineas, data: data_lineas } = useQuery(OBTENER_LINEAS_TRANSFERENCIA_INTERNA, { variables: { id: internTransfer.id }, pollInterval: 1000 })

    const getFecha = (fechaString) => {
        if (fechaString !== null && fechaString.trim().length > 0) {
            const fecha = new Date(fechaString)
            return `${fecha.getFullYear()}-${(fecha.getMonth() + 1) >= 10 ? (fecha.getMonth() + 1) : '0' + (fecha.getMonth() + 1)}-${fecha.getDate() >= 10 ? fecha.getDate() : '0' + fecha.getDate()}`
        }
        return ''
    }

    useEffect(() => {
        setFecha(getFecha(internTransfer.fecha))
        setNota(internTransfer.nota || '')
        setAlmacenDesde(internTransfer.almacenDesde)
        setAlmacenHasta(internTransfer.almacenHasta)
        setLineasAlmacen()
    }, [])

    useEffect(() => {
        setLineasAlmacen(data_lineas?.obtenerLineasTransferenciaInterna || [])
    }, [data_lineas])

    if (load_lineas) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title='Ver transferencia interna' breadcrumbItem='Transferencias internas' breadcrumbItemUrl='/internTransfers' />
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

    return (
        <React.Fragment>
            <div className="page-content" ref={ref}>
                <Container fluid={true}>
                    <Breadcrumbs title='Ver transferencia interna' breadcrumbItem='Transferencias internas' breadcrumbItemUrl='/internTransfers' />
                    <Row>
                        <div className="col mb-3">
                            <SpanSubtitleForm subtitle='Información general' />
                        </div>
                    </Row>
                    <Row>
                        <div className="col-md-5 col-sm-12">
                            <Row>
                                <div className="col mb-3">
                                    <label htmlFor="fecha" className="form-label">Fecha</label>
                                    <input readOnly={true} className="form-control" type="date" id="fecha" value={fecha} />
                                </div>
                            </Row>
                            <Row>
                                <div className="col mb-3">
                                    <label htmlFor="almacenDesde" className="form-label">Almacén que envía</label>
                                    <input className="form-control" id="almacenDesde" readOnly={true} type="text" value={almacenDesde?.nombre} />
                                </div>
                            </Row>
                            <Row>
                                <div className="col mb-3">
                                    <label htmlFor="almacenHasta" className="form-label">Almacén que recibe</label>
                                    <input className="form-control" id="almacenHasta" readOnly={true} type="text" value={almacenHasta?.nombre} />

                                </div>
                            </Row>
                            <Row>
                                <div className="col mb-3">
                                    <label htmlFor="nota" className="form-label">Nota</label>
                                    <textarea id="nota" className="form-control" rows={3} value={nota} readOnly={true}></textarea>
                                </div>
                            </Row>
                        </div>
                        <div className="col-md-7 col-sm-12">
                            <Row>
                                <div className="col mb-3">
                                    <SpanSubtitleForm subtitle='Productos transferidos' />
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
                                                            <th>Cantidad transferida</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            lineasAlmacen.map((linea, i) => (
                                                                <tr key={`lineaAlmacen-${i}`}>
                                                                    <td>{linea.producto.nombre}</td>
                                                                    <td>{`${linea.cantidad} ${linea.producto.unidad}`}</td>
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
                </Container>
            </div>
        </React.Fragment>
    );
});

export default EditInternTransfer;
