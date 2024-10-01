import React from "react";
import { Badge, Card, Col, Container, Row } from "reactstrap";
import ListSection from "../../../../components/Common/ListSelection";

const Summary = ({ ...props }) => {

    const { amountPeople, calculateNights, customer, currentDate, currentSeason, checkIn, checkOut, amountAdult, amountChildren, typeBooking, packageBookingList, roomsBooking, servicesPerRoom, extraService, toursList, notes } = props.props


    const getServicesPerRoom = (room, servicesPerRoom) => {
        const service = servicesPerRoom.find(service => service.room.numeroHabitacion === room)?.service;
        return service ? service : [];
    };

    console.log(notes)

    return (
        <React.Fragment>
            <div className="page-content p-0 border m-2 ">
                <Container fluid={true}>
                    <div className="m-2 p-2 ">
                        <Row>
                            <Col className='col-md-12'>
                                <Card className='col-md-12 bg-light border ms-2 p-2  room_card_wizard'>
                                    <div className="col-md-12">
                                        <h3 key='summary' className="  mt-2">Resumen de Reserva</h3>
                                        <label className="fs-5 m-0 ms-1 mb-2 span_package_color">
                                            <strong>Fecha de la reserva:</strong> <span className="fs-5 label_package_color">{currentDate}</span>
                                        </label>
                                        <Row className="col-md-12 bg-tertiary rounded p-2  room_card_wizard_details" >
                                            {customer ? (
                                                <div className="d-flex justify-content-center">
                                                    <Card className='col-md-11 d-flex align-content-center shadow_wizard '>
                                                        <Row className='p-4'>
                                                            <Col key={`rowcustomer`} className="mb-2 col-md-12 p-1 border-bottom ">
                                                                <label className="fs-4 m-0 span_package_color">
                                                                    <strong>Información del cliente:</strong>
                                                                </label>

                                                                <div className="col-md-12  d-flex flex-wrap flex-column">
                                                                    <label className="fs-5 m-0 ms-4 span_package_color">
                                                                        <strong>Nombre:</strong> <span className="fs-5 label_package_color">{customer.nombre}</span>
                                                                        <strong> &nbsp; </strong>
                                                                        <strong>Identificación:</strong> <span className="fs-5 label_package_color">{customer.codigo}</span>
                                                                    </label>
                                                                    <label className="fs-5 m-0 ms-4 span_package_color">
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
                                                            </Col>
                                                            <Col key={`datebooking`} className="m-0 col-md-12 p-1 border-bottom">
                                                                <label className="fs-4 m-0 span_package_color">
                                                                    <strong>Detalles de la Reserva</strong>
                                                                </label>

                                                                <Row>
                                                                    <div className="col-md-12 m-1 ">
                                                                        <Badge color="primary" className="col-md-1 mr-2 fs-6">{typeBooking}</Badge>
                                                                        <label className="fs-5 m-0 ms-4 span_package_color">
                                                                            <strong className="mdi mdi-calendar-clock me-1"></strong> <span className="fs-5 label_package_color">{currentSeason.nombre}</span>
                                                                            <strong> &nbsp; </strong>
                                                                            <strong className="mdi mdi-calendar-month-outline me-1" />
                                                                            <strong>Entrada:</strong> <span className="fs-5 label_package_color">{checkIn}</span>
                                                                            <strong> - </strong>
                                                                            <strong>Salida:</strong> <span className="fs-5 label_package_color">{checkOut}</span>
                                                                            <strong> &nbsp; </strong>
                                                                            <strong>Noches:</strong> <span className="fs-5 label_package_color">{calculateNights()}</span>
                                                                            <strong> &nbsp; </strong>
                                                                            <strong>Dias:</strong> <span className="fs-5 label_package_color">{(calculateNights() + 1)}</span>
                                                                        </label>
                                                                    </div>
                                                                </Row>
                                                                <Row>
                                                                    <div className="col-md-12 m-1 ">
                                                                        <label className="fs-5 m-0 ms-4 span_package_color">
                                                                            <strong className="mdi mdi-account-group-outline me-1" />
                                                                            <strong>Cantidad de personas:</strong> <span className="fs-5 label_package_color">{amountPeople()}</span>
                                                                            <strong> &nbsp; </strong>
                                                                            <strong>Adultos:</strong> <span className="fs-5 label_package_color">{amountAdult}</span>
                                                                            <strong> - </strong>
                                                                            <strong>Niños:</strong> <span className="fs-5 label_package_color">{amountChildren}</span>
                                                                        </label>
                                                                    </div>
                                                                </Row>
                                                            </Col>
                                                            {packageBookingList.length > 0 && (
                                                                <Col key={`packageBooking`} className="m-0 col-md-12 p-1 border-bottom">
                                                                    <label className="fs-4 m-0 span_package_color">
                                                                        <strong>Paquetes</strong>
                                                                    </label>

                                                                    <div className='mt-1'>
                                                                        {packageBookingList.map(pack => (
                                                                            <div key={pack.nombre} className="m-0 d-flex justify-content-between p-1">
                                                                                <div className='col-md-12 shadow_wizard rounded p-3'>
                                                                                    <label className="fs-4 m-0 label_package_color">
                                                                                        <strong className="mdi mdi-package-variant-closed me-1 span_package_color" />
                                                                                        <strong>{pack.nombre}</strong>
                                                                                    </label>

                                                                                    <div className="col-md-12 m-1 ">
                                                                                        <label className="fs-5 m-0 ms-4 span_package_color">
                                                                                            <strong className="mdi mdi-account-group-outline me-1" />
                                                                                            <strong>Tipo de paquete</strong> <span className="fs-5 label_package_color">{pack.tipo}</span>
                                                                                            <strong> &nbsp; </strong>
                                                                                            <strong>Temporada:</strong> <span className="fs-5 label_package_color">{pack.temporadas.nombre}</span>
                                                                                            <strong> &nbsp; </strong>
                                                                                            <strong>Descripción:</strong> <span className="fs-5 label_package_color">{pack.descripcion}</span>
                                                                                        </label>
                                                                                    </div>

                                                                                    <div className="col-md-12 m-2 d-flex">
                                                                                        <div className="col-md-3">
                                                                                            <ListSection
                                                                                                icon="mdi mdi-room-service-outline"
                                                                                                title="Servicios"
                                                                                                items={pack.servicios}
                                                                                                label="•"
                                                                                                emptyMessage="Sin datos"
                                                                                            />
                                                                                        </div>
                                                                                        <div className="col-md-3">
                                                                                            <ListSection
                                                                                                icon="mdi mdi-compass-outline"
                                                                                                title="Tours"
                                                                                                items={pack.tours}
                                                                                                label="•"
                                                                                                emptyMessage="Sin datos"
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </Col>
                                                            )}
                                                            {roomsBooking.length > 0 && (
                                                                <Col key={`roomBooking`} className="m-0 col-md-12 p-1 border-bottom">
                                                                    <label className="fs-4 m-0 span_package_color">
                                                                        <strong>Habitaciones</strong>
                                                                    </label>
                                                                    <div className='mt-1'>
                                                                        {roomsBooking.map(room => (
                                                                            <div key={room.numeroHabitacion} className="m-0 d-flex justify-content-between p-1">
                                                                                <div className='col-md-12 shadow_wizard rounded p-3'>
                                                                                    <label className="fs-4 m-0 label_package_color">
                                                                                        <strong className="mdi mdi-bed-outline me-1 span_package_color" />
                                                                                        <strong>{room.numeroHabitacion}</strong>
                                                                                    </label>
                                                                                    <div className="col-md-12 m-1 ">
                                                                                        <label className="fs-5 m-0 ms-4 span_package_color">
                                                                                            <strong>Tipo de habitacion:</strong> <span className="fs-5 label_package_color">{room.tipoHabitacion.nombre}</span>
                                                                                            <strong> &nbsp; </strong>
                                                                                            <strong>Descripción: </strong> <span className="fs-5 label_package_color">{room.tipoHabitacion.descripcion}</span>
                                                                                        </label>
                                                                                    </div>
                                                                                    <div className="col-md-11 m-1 d-flex">
                                                                                        <div className="col-md-3">
                                                                                            <ListSection
                                                                                                icon="mdi mdi-sofa-single-outline"
                                                                                                title="Comodidades"
                                                                                                items={room.comodidades}
                                                                                                label="•"
                                                                                                emptyMessage="Sin datos"
                                                                                            />
                                                                                        </div>
                                                                                        {servicesPerRoom.length > 0 && (
                                                                                            <div className="col-md-3">
                                                                                                <ListSection
                                                                                                    icon="mdi mdi-room-service-outline"
                                                                                                    title="Servicios adicionales"
                                                                                                    items={getServicesPerRoom(room.numeroHabitacion, servicesPerRoom)}
                                                                                                    label="•"
                                                                                                    emptyMessage="N/A"
                                                                                                />
                                                                                            </div>
                                                                                        )}
                                                                                    </div>

                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </Col>
                                                            )}
                                                            {extraService.length > 0 && (
                                                                <Col key={`extraservice`} className="m-0 col-md-12 p-1 border-bottom">
                                                                    <label className="fs-4 m-0 span_package_color">
                                                                        <strong>Sevicios adicionales por reserva</strong>
                                                                    </label>

                                                                    <div className='mt-1'>
                                                                        {extraService.map(extra => (
                                                                            <label className="fs-5 m-0 ms-4 span_package_color">
                                                                                <strong className={`${extra.tipo.icon} me-1`}></strong>
                                                                                <span className="fs-5 label_package_color">{extra.nombre}
                                                                                    <span className="span_package_color fs-5">
                                                                                        {(extra.cantidad !== 0 && extra.cantidad !== undefined) && (<span> x{extra.cantidad} </span>)}
                                                                                    </span>
                                                                                </span>
                                                                                <strong> &nbsp; </strong>

                                                                            </label>
                                                                        ))}
                                                                    </div>

                                                                </Col>
                                                            )}
                                                            {toursList.length > 0 && (
                                                                <Col key={`tourBooking`} className="m-0 col-md-12 p-1 border-bottom">
                                                                    <label className="fs-4 m-0 span_package_color">
                                                                        <strong>Tours adicionales por reserva</strong>
                                                                    </label>
                                                                    <div className='mt-1'>
                                                                        {toursList.map(tour => (
                                                                            <div key={tour.nombre} className="m-0 d-flex justify-content-between p-1">
                                                                                <div className='col-md-12 shadow_wizard rounded p-3'>
                                                                                    <label className="fs-4 m-0 label_package_color">
                                                                                        <strong className="mdi mdi-compass-outline me-1 span_package_color" />
                                                                                        <strong>{tour.nombre}</strong>
                                                                                    </label>
                                                                                    <div className="col-md-12 m-1 ">
                                                                                        <label className="fs-5 m-0 ms-4 span_package_color">
                                                                                            <strong className="mdi mdi-compass-rose me-1" />
                                                                                            <strong>Tipo de tour:</strong> <span className="fs-5 label_package_color">{tour.tipo}</span>
                                                                                            <strong> &nbsp; </strong>
                                                                                            <strong>Descripción:</strong> <span className="fs-5 label_package_color">{tour.descripcion}</span>
                                                                                        </label>
                                                                                    </div>

                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </Col>
                                                            )}
                                                            <Col key={`notebooking`} className="m-0 col-md-12 p-1 border-bottom">
                                                                <label className="fs-4 m-0 span_package_color">
                                                                    <strong>Notas:</strong>
                                                                </label>
                                                                {notes.filter(note => note.nota !== "").map(note => (
                                                                    <div key={note.area.nombre} className="m-0 d-flex justify-content-between p-1">
                                                                        <div className='col-md-12 shadow_wizard rounded p-3'>
                                                                            <label className="fs-5 m-0 label_package_color">
                                                                                <strong className="mdi mdi-chart-areaspline me-1 span_package_color" />
                                                                                <strong>{note.area.nombre}</strong>
                                                                            </label>
                                                                            <div className="col-md-12 m-1 ">
                                                                                <label className="fs-5 m-0 ms-4 span_package_color">
                                                                                    <strong className="mdi mdi-note-text me-1" />
                                                                                    <strong>Nota: </strong> <span className="fs-5 label_package_color">{note.nota}</span>
                                                                                </label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </Col>
                                                        </Row>
                                                    </Card>
                                                </div>
                                            ) : (
                                                <div className='d-flex justify-content-center align-items-center' style={{ height: '100vh' }}>
                                                    <label>Sin datos que mostrar</label>
                                                </div>
                                            )}
                                        </Row>

                                    </div>

                                </Card>
                            </Col>
                        </Row>
                    </div >
                </Container >
            </div >
        </React.Fragment >
    );
};

export default Summary;