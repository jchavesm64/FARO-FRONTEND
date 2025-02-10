import React, { useEffect, useState } from "react";
import { Badge, Button, Card, Col, Container, Row } from "reactstrap";
import { useParams } from "react-router-dom";
import ListSection from "../../../../components/Common/ListSelection";
import { typesBooking } from "../../../../constants/routesConst";

const Summary = ({ ...props }) => {

    const { setTotal, amountPeople, calculateNights, onClickSave, customer, currentDate, currentSeason, checkIn, checkOut, amountAdult, amountChildren, typeBooking, packageBookingList, roomsBooking, servicesPerRoom, extraService, toursList, notes, user, amountTypeRooms, total } = props.props

    const [isOpenRoom, setIsOpenRoom] = useState(false);
    const [isOpenPackage, setIsOpenPackage] = useState(false);
    const [isOpenService, setIsOpenService] = useState(false);
    const [isOpenTours, setIsOpenTours] = useState(false);
    const [isOpenNotes, setIsOpenNote] = useState(false);

    const { id } = useParams();

    const toggleAccordion = (currentStateSetter, currentState) => {
        currentStateSetter(!currentState);
    };

    useEffect(() => {
        const totalPackage = packageBookingList.reduce((total, p) => total + p.precio, 0);
        const totalRoomPrice = roomsBooking.reduce((total, r) => total + currentSeason.reduce((sum, tr) => sum + ((tr.tiposHabitacion[r.tipoHabitacion.nombre].price * tr.nights) * (parseInt(amountAdult) + (parseInt(amountChildren) / 2))), 0), 0);
        const totalServicePerRoom = servicesPerRoom.reduce((total, room) => {
            const roomTotal = room.service.reduce((subTotal, service) => {
                const extraMultiplier = parseInt(service.extra) || 1;
                return subTotal + (service.precio * extraMultiplier);
            }, 0);
            return total + roomTotal;
        }, 0);
        const totalService = extraService.reduce((total, service) => {
            const extraMultiplier = service.extra || 1;
            return total + (service.precio * extraMultiplier);
        }, 0);
        const totalTours = toursList.reduce((total, t) => total + t.precio, 0);
        setTotal(totalPackage + totalRoomPrice + totalServicePerRoom + totalService + totalTours)
    }, [amountAdult, amountChildren, currentSeason, extraService, packageBookingList, roomsBooking, servicesPerRoom, toursList])



    console.log('Tour', toursList);
    console.log('servicios', servicesPerRoom);


    return (
        <React.Fragment>
            <div className="page-content p-0 border m-2 ">
                <Container fluid={true}>
                    <div className="m-2 p-2 ">
                        <Row>
                            <Col className='col-md-12'>
                                <Card className='col-md-12 '>
                                    <Row className="col-md-12 bg-light border ms-2 p-2  ">
                                        <h3 key='summary' className="mt-2">Resumen de Reserva</h3>
                                        <div className="d-flex flex-column">
                                            <label className="fs-5 m-0 ms-1 mb-2 span_package_color">
                                                <strong>Fecha de la reserva:</strong> <span className="fs-5 label_package_color">{currentDate}</span>
                                            </label>
                                            <label className="fs-5 m-0 ms-1 mb-2 span_package_color">
                                                <strong>Usuario:</strong> <span className="fs-5 label_package_color">{user.nombre}</span>
                                            </label>
                                        </div>
                                        <Col className="col-md-12 bg-tertiary rounded p-2  room_card_wizard_details" >
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
                                                                    <div className="col-md-12 m-1 d-flex align-items-center">
                                                                        <Badge color="primary" className="col-md-1-5 mr-2 fs-6 p-1 text-center">{typesBooking.find(item => item.value === typeBooking).label}</Badge>
                                                                        <label className="fs-5 m-0 ms-1 span_package_color d-flex align-items-center">
                                                                            <div className="">
                                                                                <ListSection
                                                                                    icon="mdi mdi-calendar-clock"
                                                                                    title="Temporadas"
                                                                                    items={currentSeason}
                                                                                    label="•"
                                                                                    emptyMessage="Sin datos"
                                                                                    withoutm={true}
                                                                                />
                                                                            </div>
                                                                            <strong> &nbsp; </strong>
                                                                            <strong className="mdi mdi-calendar-month-outline me-1" />
                                                                            <strong>Entrada: </strong> <span className="fs-5 label_package_color">{checkIn}</span>
                                                                            <strong> - </strong>
                                                                            <strong>Salida: </strong> <span className="fs-5 label_package_color">{checkOut}</span>
                                                                            <strong> &nbsp; </strong>
                                                                            <strong>Noches: </strong> <span className="fs-5 label_package_color">{calculateNights()}</span>
                                                                            <strong> &nbsp; </strong>
                                                                            <strong>Dias: </strong> <span className="fs-5 label_package_color">{(calculateNights() + 1)}</span>
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
                                                                <Col key={`packageBooking`} className="m-0 col-md-12 p-1 ">
                                                                    <div className="accordion col-md-12 col-sm-8 " id="packageBooking">
                                                                        <div className="accordion-item shadow_booking">
                                                                            <h2 className="accordion-header" id="headingServiceRoomList">
                                                                                <button
                                                                                    className={`step-hover-effect_wizard accordion-button ${!isOpenPackage ? 'collapsed' : ''}`}
                                                                                    type="button"
                                                                                    onClick={() => toggleAccordion(setIsOpenPackage, isOpenPackage)}
                                                                                    aria-expanded={isOpenPackage}
                                                                                    aria-controls="collapseOne"
                                                                                >
                                                                                    <label className="fs-4 m-0 span_package_color">
                                                                                        <strong>Paquetes</strong>
                                                                                    </label>
                                                                                </button>
                                                                            </h2>
                                                                            <div
                                                                                id="collapseOneRoomList"
                                                                                className={`accordion-collapse collapse ${isOpenPackage ? 'show' : ''}`}
                                                                                aria-labelledby="headingServiceBooking"
                                                                            >
                                                                                <div className="accordion-body">
                                                                                    <div className="d-flex justify-content-center flex-wrap align-content-center">
                                                                                        {packageBookingList.map(pack => (
                                                                                            <div key={pack.nombre} className="m-0 d-flex justify-content-between p-1 col-md-11">
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
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>


                                                                </Col>
                                                            )}
                                                            {roomsBooking.length > 0 && (
                                                                <Col key={`roomBooking`} className="m-0 col-md-12 p-1 ">
                                                                    <div className="accordion col-md-12 col-sm-8" id="roomBooking">
                                                                        <div className="accordion-item shadow_booking">
                                                                            <h2 className="accordion-header" id="headingServiceRoomList">
                                                                                <button
                                                                                    className={`step-hover-effect_wizard accordion-button ${!isOpenRoom ? 'collapsed' : ''}`}
                                                                                    type="button"
                                                                                    onClick={() => toggleAccordion(setIsOpenRoom, isOpenRoom)}
                                                                                    aria-expanded={isOpenRoom}
                                                                                    aria-controls="collapseOne"
                                                                                >
                                                                                    <label className="fs-4 m-0 span_package_color">
                                                                                        <strong>Habitaciones</strong>
                                                                                    </label>
                                                                                </button>
                                                                            </h2>
                                                                            <div
                                                                                id="collapseOneRoomList"
                                                                                className={`accordion-collapse collapse ${isOpenRoom ? 'show' : ''}`}
                                                                                aria-labelledby="headingServiceBooking"
                                                                            >
                                                                                <div className="accordion-body">
                                                                                    <div className="d-flex justify-content-center flex-wrap align-content-center">
                                                                                        {amountTypeRooms.map(type => (
                                                                                            type.amountBooking !== 0 && (
                                                                                                <div id={`data${type.type.nombre}`} key={`data${type.type.nombre}`} className='col-md-11 border m-2 shadow_wizard rounded p-3 d-flex justify-content-between'>
                                                                                                    <div id={`row${type.type.nombre}`} key={`row${type.type.nombre}`} className="m-0 col-md-11 p-1">
                                                                                                        <label id={`label${type.type.nombre}`} key={`label${type.type.nombre}`} className="fs-4 m-0 span_package_color">
                                                                                                            <strong>Tipo de habitación:</strong> <span className="fs-5 label_package_color">{type.type.nombre}</span>
                                                                                                        </label>

                                                                                                        <div id={`card${type.type.nombre}`} key={`card${type.type.nombre}`} className="col-md-11 m-1 d-flex flex-wrap flex-column">

                                                                                                            <ListSection
                                                                                                                key={`list1`}
                                                                                                                title="Habitaciones"
                                                                                                                items={roomsBooking.filter(rooms => rooms.tipoHabitacion.nombre === type.type.nombre)}
                                                                                                                label="n.º de habitación"
                                                                                                                emptyMessage="Sin datos"
                                                                                                            />

                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            )
                                                                                        ))}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </Col>
                                                            )}
                                                            {extraService.length > 0 && (
                                                                <Col key={`extraservice`} className="m-0 col-md-12 p-1 ">
                                                                    <div className="accordion col-md-12 col-sm-8" id="extraservice">
                                                                        <div className="accordion-item shadow_booking">
                                                                            <h2 className="accordion-header" id="headingServiceRoomList">
                                                                                <button
                                                                                    className={`step-hover-effect_wizard accordion-button ${!isOpenService ? 'collapsed' : ''}`}
                                                                                    type="button"
                                                                                    onClick={() => toggleAccordion(setIsOpenService, isOpenService)}
                                                                                    aria-expanded={isOpenService}
                                                                                    aria-controls="collapseOne"
                                                                                >
                                                                                    <label className="fs-4 m-0 span_package_color">
                                                                                        <strong>Sevicios adicionales por reserva</strong>
                                                                                    </label>
                                                                                </button>
                                                                            </h2>
                                                                            <div
                                                                                id="collapseOneRoomList"
                                                                                className={`accordion-collapse collapse ${isOpenService ? 'show' : ''}`}
                                                                                aria-labelledby="headingServiceBooking"
                                                                            >
                                                                                <div className="accordion-body">
                                                                                    <div className="d-flex justify-content-center flex-wrap align-content-center">
                                                                                        {extraService?.map(extra => (
                                                                                            <div id={`data${extra.cantidad}`} key={`data${extra.cantidad}`} className='col-md-11 border m-2 shadow_wizard rounded p-3 d-flex justify-content-between'>
                                                                                                <div id={`row${extra.cantidad}`} key={`row${extra.cantidad}`} className="m-0 col-md-11 p-1">
                                                                                                    <label className="fs-5 m-0 ms-4 span_package_color">
                                                                                                        <strong className={`${extra.tipo.icon} me-1`}></strong>
                                                                                                        <span className="fs-5 label_package_color">{extra.nombre}
                                                                                                            <span className="span_package_color fs-5">
                                                                                                                {(extra.extra !== 0 && extra.extra !== undefined) && (<span> x{extra.extra} </span>)}
                                                                                                            </span>
                                                                                                        </span>
                                                                                                        <strong> &nbsp; </strong>

                                                                                                    </label>
                                                                                                </div>
                                                                                            </div>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                </Col>
                                                            )}
                                                            {toursList.length > 0 && (
                                                                <Col key={`tourBooking`} className="m-0 col-md-12 p-1 ">
                                                                    <div className="accordion col-md-12 col-sm-8" id="tourBooking">
                                                                        <div className="accordion-item shadow_booking">
                                                                            <h2 className="accordion-header" id="headingServiceRoomList">
                                                                                <button
                                                                                    className={`step-hover-effect_wizard accordion-button ${!isOpenTours ? 'collapsed' : ''}`}
                                                                                    type="button"
                                                                                    onClick={() => toggleAccordion(setIsOpenTours, isOpenTours)}
                                                                                    aria-expanded={isOpenTours}
                                                                                    aria-controls="collapseOne"
                                                                                >
                                                                                    <label className="fs-4 m-0 span_package_color">
                                                                                        <strong>Tours adicionales por reserva</strong>
                                                                                    </label>
                                                                                </button>
                                                                            </h2>
                                                                            <div
                                                                                id="collapseOneRoomList"
                                                                                className={`accordion-collapse collapse ${isOpenTours ? 'show' : ''}`}
                                                                                aria-labelledby="headingServiceBooking"
                                                                            >
                                                                                <div className="accordion-body">
                                                                                    <div className="d-flex justify-content-center flex-wrap align-content-center">
                                                                                        {toursList.map(tour => (
                                                                                            <div key={tour.nombre} className="m-0 d-flex justify-content-between p-1 col-md-11">
                                                                                                <div className='col-md-12 shadow_wizard rounded p-3'>
                                                                                                    <label className="fs-4 m-0 label_package_color">
                                                                                                        <strong className="mdi mdi-compass-outline me-1 span_package_color" />
                                                                                                        <strong>{tour.nombre}</strong>
                                                                                                    </label>
                                                                                                    <div className="col-md-12 m-1 ">
                                                                                                        <label className="fs-5 m-0 ms-4 span_package_color">
                                                                                                            <strong className="mdi mdi-compass-rose me-1" />
                                                                                                            <strong>Tipo de tour:</strong> <span className="fs-5 label_package_color">{tour.tipo}</span>
                                                                                                        </label>
                                                                                                    </div>

                                                                                                </div>
                                                                                            </div>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </Col>
                                                            )}
                                                            <Col key={`notebooking`} className="m-0 col-md-12 p-1 ">
                                                                <div className="accordion col-md-12 col-sm-8" id="notebooking">
                                                                    <div className="accordion-item shadow_booking" >
                                                                        <h2 className="accordion-header" id="headingServiceRoomList">
                                                                            <button
                                                                                className={`step-hover-effect_wizard accordion-button ${!isOpenNotes ? 'collapsed' : ''}`}
                                                                                type="button"
                                                                                onClick={() => toggleAccordion(setIsOpenNote, isOpenNotes)}
                                                                                aria-expanded={isOpenNotes}
                                                                                aria-controls="collapseOne"
                                                                            >
                                                                                <label className="fs-4 m-0 span_package_color">
                                                                                    <strong>Notas</strong>
                                                                                </label>
                                                                            </button>
                                                                        </h2>
                                                                        <div
                                                                            id="collapseOneRoomList"
                                                                            className={`accordion-collapse collapse ${isOpenNotes ? 'show' : ''}`}
                                                                            aria-labelledby="headingServiceBooking"
                                                                        >
                                                                            <div className="accordion-body">
                                                                                <div className="d-flex justify-content-center flex-wrap align-content-center">
                                                                                    {notes.filter(note => note.nota !== "").map(note => (
                                                                                        <div key={note.area.nombre} className="col-md-11 m-0 d-flex justify-content-between p-1">
                                                                                            <div className='col-md-12 shadow_wizard rounded p-3'>
                                                                                                <label className="fs-5 m-0 label_package_color">
                                                                                                    <strong className="mdi mdi-chart-areaspline me-1 span_package_color" />
                                                                                                    <strong>{note.area.nombre}</strong>
                                                                                                </label>
                                                                                                <div className="col-md-12 m-1 ">
                                                                                                    <label className="fs-5 m-0 ms-4 span_package_color">
                                                                                                        <strong className="mdi mdi-calendar-month-outline me-1" />
                                                                                                        <strong>Fecha: </strong> <span className="fs-5 label_package_color">{note.fecha}</span>
                                                                                                    </label>
                                                                                                </div>
                                                                                                <div className="col-md-12 m-1 ">
                                                                                                    <label className="fs-5 m-0 ms-4 span_package_color">
                                                                                                        <strong className="mdi mdi-note-text me-1" />
                                                                                                        <strong>Nota: </strong> <span className="fs-5 label_package_color">{note.nota}</span>
                                                                                                    </label>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>


                                                            </Col>
                                                        </Row>
                                                        <Row className='p-4'>
                                                            <label className="fs-2 m-0 span_package_color ">
                                                                <strong>Total: {total}</strong>
                                                            </label>
                                                        </Row>
                                                    </Card>

                                                </div>
                                            ) : (
                                                <div className='d-flex justify-content-center align-items-center' style={{ height: '100vh' }}>
                                                    <label>Sin datos que mostrar</label>
                                                </div>
                                            )}

                                        </Col>

                                    </Row>
                                </Card>
                                <Row className="mt-4">
                                    <Col >
                                        <Button
                                            color="primary"
                                            size="lg"
                                            className="position-fixed send_booking_wizard"
                                            onClick={() => onClickSave()}
                                        >
                                            {!id ? 'Realizar Reserva' : 'Guardar Reserva'}
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div >
                </Container >
            </div >
        </React.Fragment >
    );
};

export default Summary;