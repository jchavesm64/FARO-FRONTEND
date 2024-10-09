import React, { useEffect, useState } from "react";
import { Card, Container } from "reactstrap";
import Breadcrumbs from "../../../../components/Common/Breadcrumb";
import { useQuery } from "@apollo/client";
import { OBTENER_RESERVAS } from "../../../../services/ReservaService";

const Booking = () => {
    document.title = "Disponibilidad | FARO";

    const { data: data_booking } = useQuery(OBTENER_RESERVAS, { pollInterval: 1000 });

    const [booking, setBooking] = useState([]);

    useEffect(() => {
        setBooking(data_booking?.obtenerReservas || [])
    }, [data_booking]);
    
    console.log(booking);

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Reservas" breadcrumbItem="Nueva Reserva" breadcrumbItemUrl="/reception/availability" />
                </Container>
                <Card className='col-md-12 p-2'>

                </Card>
            </div>

        </React.Fragment>
    )
};

export default Booking;