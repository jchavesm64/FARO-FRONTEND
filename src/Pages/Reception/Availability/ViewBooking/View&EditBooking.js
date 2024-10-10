import React, { useEffect, useState } from "react";
import { Badge, Card, CardBody, CardHeader, CardTitle, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../../../components/Common/Breadcrumb";
import { useQuery } from "@apollo/client";
import { OBTENER_RESERVAS } from "../../../../services/ReservaService";
import { timestampToDateLocal } from "../../../../helpers/helpers";
import { Link } from "react-router-dom";

const Booking = () => {
    document.title = "Disponibilidad | FARO";

    const { data: data_booking } = useQuery(OBTENER_RESERVAS, { pollInterval: 1000 });

    const [booking, setBooking] = useState([]);

    useEffect(() => {
        setBooking(data_booking?.obtenerReservas || [])
    }, [data_booking]);


    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Reservas" breadcrumbItem="Nueva Reserva" breadcrumbItemUrl="/reception/availability" />
                </Container>

                <Row className='row-cols-2 m-0 mt-3  row-cols-sm-3 row-cols-md-5 d-flex justify-content-center flex-wrap '>
                    {booking.map(b => (
                        <Link to={`/reception/availability/editbooking/${b.id}`} style={{ textDecoration: 'none' }} className="card_home_link p-0 m-0">
                            <Card key={b.id} className="card_booking  p-0 mb-2 overflow-hidden">
                                <CardHeader className="bg-primary text-primary-foreground">
                                    <CardTitle className="text-lg">
                                        <span className="fs-5 m-0 ms-1 mb-2 span_color" >Reservación:</span> {b.id.slice(0, 10)}...
                                    </CardTitle>
                                </CardHeader>
                                <CardBody className="pt-2">
                                    <div className="d-flex flex-column mb-2">
                                        <span className="font-semibold">{b.cliente.nombre}</span>
                                        <span className="text-sm text-gray-600">
                                            {b.cliente.ciudad}, {b.cliente.pais}
                                        </span>
                                    </div>
                                    <div className="">
                                        <Badge color="primary" className="mr-2 fs-6" variant={b.estado === 'Pendiente' ? 'outline' : 'default'}>
                                            {b.estado}
                                        </Badge>
                                    </div>
                                    <div className="m-0 mt-1 text-sm">
                                        <span>Adults: {b.numeroPersonas.adulto}</span>
                                        <strong> &nbsp; </strong>
                                        <span>Children: {b.numeroPersonas.ninos}</span>
                                    </div>
                                    <div className="m-0  text-sm">
                                        <span>Servicios: {b.serviciosGrupal.length}</span>
                                        <strong> &nbsp; </strong>
                                        <span>Paquetes: {b.paquetes.length}</span>
                                    </div>
                                    <p className="mt-1 mb-3 text-sm">
                                        Fecha reserva: {timestampToDateLocal(Number(b.fechaReserva), 'label')}
                                    </p>
                                </CardBody>
                            </Card>
                        </Link>
                    ))}
                </Row>

            </div>

        </React.Fragment >
    )
};

export default Booking;