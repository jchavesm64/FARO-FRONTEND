import React from "react";
import { Card, Col, Container, Row } from "reactstrap";
import ListSection from "../../../../components/Common/ListSelection";

const Summary = ({ ...props }) => {

    const { customer, currentDate, currentSeason, checkIn, checkOut, amountPeople, typeBooking, packageBookingList, roomsBooking, servicesPerRoom } = props.props
    console.log(roomsBooking)

    function calculateNights() {
        const startDateObj = new Date(checkIn);
        const endDateObj = new Date(checkOut);
        const timeDifference = endDateObj - startDateObj;
        const dayDifference = timeDifference / (1000 * 60 * 60 * 24);
        return dayDifference;
    }

    return (
        <React.Fragment>
            <div className="page-content p-0 border m-2 ">
                <Container fluid={true}>
                    <div className="m-2 p-2 ">
                        <Row>
                            <Col className='col-md-12'>
                                <Card className='col-md-12 bg-light border ms-2 p-2 room_card_wizard'>
                                    <div className="col-md-12">
                                        <h3 key='summary' className="text-center mb-4 mt-4">Resumen de la reservacion</h3>
                                        <Card className="col-md-12 bg-tertiary rounded p-2 room_card_wizard_details" >
                                            {customer ? (
                                                <div>
                                                    <Row className='col-md-12 d-flex align-content-center  justify-content-around'>
                                                        <Row className='col-md-5 border  shadow_wizard rounded p-3 d-flex justify-content-between'>
                                                            <div key={`rowcustomer`} className="m-0 col-md-11 p-1">
                                                                <label className="fs-4 m-0 span_package_color">
                                                                    <strong>Nombre del cliente:</strong> <span className="fs-5 label_package_color">{customer.nombre}</span>
                                                                </label>

                                                                <div className="col-md-11 m-1 d-flex flex-wrap flex-column">
                                                                    <label className="fs-5 m-0 ms-4 span_package_color">
                                                                        <strong>Identificación:</strong> <span className="fs-5 label_package_color">{customer.codigo}</span>
                                                                    </label>
                                                                    <label className="fs-5 m-0 ms-4 span_package_color">
                                                                        <strong>Nombre de facturación:</strong> <span className="fs-5 label_package_color">{customer.nombreFacturacion}</span>
                                                                    </label>
                                                                    <ListSection
                                                                        title="Correos"
                                                                        items={customer.correos}
                                                                        label="Email"
                                                                        emptyMessage="Sin datos"
                                                                    />
                                                                    <ListSection
                                                                        title="Teléfonos"
                                                                        items={customer.telefonos}
                                                                        label="Teléfono"
                                                                        emptyMessage="Sin datos"
                                                                    />
                                                                    <label className="fs-5 m-0 ms-4 span_package_color">
                                                                        <strong>País:</strong> <span className="fs-5 label_package_color">{customer.pais}</span>
                                                                    </label>


                                                                </div>
                                                            </div>
                                                        </Row>
                                                        <Row className='col-md-5 border  shadow_wizard rounded p-3 d-flex justify-content-between'>
                                                            <div key={`datebooking`} className="m-0 col-md-11 p-1">
                                                                <label className="fs-4 m-0 span_package_color">
                                                                    <strong>Tipo de reserva</strong> <span className="fs-5 label_package_color">{typeBooking}</span>
                                                                </label>

                                                                <div className="col-md-11 m-1 d-flex flex-wrap flex-column">
                                                                    <label className="fs-5 m-0 ms-4 span_package_color">
                                                                        <strong>Temporada:</strong> <span className="fs-5 label_package_color">{currentSeason.nombre}</span>
                                                                    </label>
                                                                    <label className="fs-5 m-0 ms-4 span_package_color">
                                                                        <strong>Fecha de la reserva:</strong> <span className="fs-5 label_package_color">{currentDate}</span>
                                                                    </label>
                                                                    <label className="fs-5 m-0 ms-4 span_package_color">
                                                                        <strong>Cantidad de noches:</strong> <span className="fs-5 label_package_color">{calculateNights()}</span>
                                                                    </label>
                                                                    <label className="fs-5 m-0 ms-4 span_package_color">
                                                                        <strong>Cantidad de personas:</strong> <span className="fs-5 label_package_color">{amountPeople}</span>
                                                                    </label>
                                                                    <label className="fs-5 m-0 ms-4 span_package_color">
                                                                        <strong>CheckIn:</strong> <span className="fs-5 label_package_color">{checkIn}</span>
                                                                    </label>
                                                                    <label className="fs-5 m-0 ms-4 span_package_color">
                                                                        <strong>CheckOut:</strong> <span className="fs-5 label_package_color">{checkOut}</span>
                                                                    </label>

                                                                </div>
                                                            </div>
                                                        </Row>
                                                    </Row>
                                                    <Row className='col-md-12 d-flex align-content-center mt-2 justify-content-around'>

                                                        {packageBookingList.length > 0 ? (
                                                            <div className='col-md-5 border shadow_wizard rounded p-3 d-flex justify-content-between  flex-wrap'>

                                                                {packageBookingList.map(pack => (
                                                                    <div className="col-md-11 m-1 d-flex flex-wrap flex-column">

                                                                        <label className="fs-4 m-0 label_package_color">
                                                                            <strong>Paquete:</strong> <span className="fs-5 span_package_color">{pack.nombre}</span>
                                                                        </label>
                                                                        <Row className='d-flex justify-content-around'>
                                                                            <Col className='border col-md-5 '>
                                                                                <ListSection
                                                                                    title="Servicios por paquetes"
                                                                                    items={pack.servicios}
                                                                                    label="Nombre"
                                                                                    emptyMessage="Sin datos"
                                                                                />
                                                                            </Col>
                                                                            <Col className='border col-md-5 '>
                                                                                <ListSection
                                                                                    title="Tours por paquetes"
                                                                                    items={pack.tours}
                                                                                    label="Nombre"
                                                                                    emptyMessage="Sin datos"
                                                                                />
                                                                            </Col>
                                                                        </Row>
                                                                    </div>

                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className='col-md-5 border  shadow_wizard rounded p-3 d-flex justify-content-center align-content-center flex-wrap'>
                                                                <label className="fs-4 m-0 label_package_color">
                                                                    <strong >Sin paquetes selecionados</strong>
                                                                </label>
                                                            </div>
                                                        )}
                                                        {roomsBooking.length > 0 ? (
                                                            <div className='col-md-5 border  shadow_wizard rounded p-3 d-flex justify-content-between flex-wrap'>

                                                                {servicesPerRoom.map(service => (
                                                                    <div className="col-md-11 m-1 d-flex flex-wrap flex-column">

                                                                        <label className="fs-4 m-0 label_package_color">
                                                                            <strong>Habitaciones:</strong> <span className="fs-5 span_package_color">{service.room.numeroHabitacion}</span>
                                                                        </label>

                                                                        <Row className='d-flex justify-content-around'>
                                                                            <Col className='border col-md-5 '>
                                                                                <ListSection
                                                                                    title="Servicios por habitación"
                                                                                    items={service.service}
                                                                                    label="Nombre"
                                                                                    emptyMessage="Sin datos"
                                                                                />
                                                                            </Col>
                                                                            <Col className='border col-md-5 '>
                                                                                <ListSection
                                                                                    title="Servicios por habitación"
                                                                                    items={service.room.comodidades}
                                                                                    label="Nombre"
                                                                                    emptyMessage="Sin datos"
                                                                                />
                                                                            </Col>
                                                                        </Row>
                                                                    </div>

                                                                ))}
                                                            </div>

                                                        ) : (
                                                            <div className='col-md-5 border ms-3 shadow_wizard rounded p-3 d-flex justify-content-center flex-wrap'>
                                                                <label className="fs-4 m-0 label_package_color">
                                                                    <strong >Sin habitaciones selecionadas</strong>
                                                                </label>
                                                            </div>
                                                        )}

                                                    </Row>

                                                </div>
                                            ) : (
                                                <div className='d-flex justify-content-center align-items-center' style={{ height: '100vh' }}>
                                                    <label>Sin datos que mostrar</label>
                                                </div>
                                            )}
                                        </Card>

                                    </div>

                                </Card>
                            </Col>
                        </Row>
                    </div>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default Summary;