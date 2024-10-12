import React, { useState } from "react";
import Select from "react-select";
import { Button, Card, CardBody, Col, Container, Row } from "reactstrap";
import ListInfo from "../../../../components/Common/ListInfo";
import ListSection from "../../../../components/Common/ListSelection";
import TabeListService from "../../../../components/Common/TableListService";

const ToursService = ({ ...props }) => {

    const {
        handleChangeServiceBooking,
        handleChangeServiceRoom,
        handleChangeTourRoom,
        handleService,
        handleTour,
        deleteServiceBooking,
        deleteServiceRoom,
        deleteTour,
        handleRoomSelect,
        getServices,
        getTour,
        addTours,
        addExtraService,
        getServicesPerRoom,
        addExtraServicePerRoom,
        setDisabledButton,
        updateAmountService,
        ServicesRoom,
        roomsBooking,
        selectRoom,
        serviceBookingCheck,
        serviceRoomCheck,
        ServicesBooking,
        extraService,
        extraServiceRoom,
        options,
        serviceTourCheck,
        tours,
        toursList,
        servicesPerRoom,
        typeBooking
    } = props.props;

    const [isOpenServicePerBooking, setIsOpenServicePerBooking] = useState(false);
    const [isOpenServicePerRoom, setIsOpenServicePerRoom] = useState(false);
    const [isOpenServiceTour, setIsOpenServiceTour] = useState(false);

    const toggleAccordion = () => {
        setIsOpenServicePerBooking(!isOpenServicePerBooking);
    };
    const toggleAccordionPerRoom = () => {
        setIsOpenServicePerRoom(!isOpenServicePerRoom);
    };
    const toggleAccordionServiceTour = () => {
        setIsOpenServiceTour(!isOpenServiceTour);
    };

    setDisabledButton(false);


    return (
        <React.Fragment>
            <div className="page-content p-0 border m-2 ">
                <Container fluid={true}>
                    <div className="m-2 p-2 ">
                        <div className='col-md-12 col-sm-8  d-flex flex-column align-items-center'>
                            <Row className="m-2">
                                <h3 className="col mb-2">
                                    Servicios Adicionales
                                </h3>
                            </Row>
                            {roomsBooking.length ? (
                                <Row className="m-2 p-2 d-flex flex-row col-md-7 col-sm-8 col-xl-7 justify-content-around">
                                    <div className="form-check ms-3 mt-2 col-md-3 col-sm-8">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="isServiceBooking"
                                            value='serviceBooking'
                                            readOnly
                                            checked={serviceBookingCheck}
                                            onClick={handleChangeServiceBooking}
                                            disabled={typeBooking === 'Individual'}
                                        />
                                        <label htmlFor="isServiceBooking" className="form-check-label ms-2">Servicios por reserva</label>
                                    </div>
                                    <div className="form-check ms-3 mt-2 col-md-3 col-sm-8">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="isServiceRoom"
                                            value='serviceRoom'
                                            readOnly
                                            checked={serviceRoomCheck}
                                            onClick={handleChangeServiceRoom}
                                        />
                                        <label htmlFor="isServiceRoom" className="form-check-label ms-2">Servicios por Habitacion</label>
                                    </div>
                                    <div className="form-check ms-3 mt-2 col-md-3 col-sm-8">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="isTour"
                                            value='serviceTour'
                                            readOnly
                                            checked={serviceTourCheck}
                                            onClick={handleChangeTourRoom}
                                        />
                                        <label htmlFor="isTour" className="form-check-label ms-2">Servicios de tours</label>
                                    </div>
                                </Row>
                            ) : (<label>Debe selecionar almenos una habitación</label>)}
                        </div>
                        <div className='col-md-12 col-sm-8 d-flex flex-row  justify-content-center'>
                            {serviceBookingCheck && (
                                <Col >
                                    <Row>
                                        <Card className='col-md-11 col-xl-11 bg-light m-2 p-2 shadow_wizard'>
                                            <div className="col-md-12">
                                                <h3 key='titleService' className="text-center mb-2 mt-2">Servicios adicionales por reserva</h3>
                                            </div>

                                            <div className="col-md-12 col-sm-12">
                                                <Card className="p-2 shadow_wizard">
                                                    <CardBody>
                                                        <div className="row row-cols-lg-auto g-3 align-items-center">
                                                            <div className="col-xl-8 col-md-12 col-sm-4 mb-2">
                                                                <Select
                                                                    value={ServicesBooking}
                                                                    onChange={(e) => {
                                                                        handleService(e, 'general');
                                                                    }}
                                                                    options={getServices()}
                                                                    placeholder="Servicios"
                                                                    classNamePrefix="select2-selection"
                                                                />
                                                            </div>
                                                            <div className="col-12 mb-1">
                                                                <Button type="submit" className="btn btn-outline-primary" onClick={() => { addExtraService(ServicesBooking, extraService, 'general') }}>
                                                                    Agregar
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <Row>
                                                            <TabeListService data={extraService} headers={['Servicio', 'Precio']} keys={['nombre', 'precio']} enableAmount={true} enableDelete={true} actionDelete={deleteServiceBooking} actionAmount={updateAmountService} mainKey={'nombre'} type='booking' amount='Extra' />
                                                        </Row>
                                                    </CardBody>
                                                </Card>
                                            </div>
                                        </Card>
                                    </Row>
                                    <Row>
                                        <div className="accordion col-md-11 col-sm-8" id="serviceBooking">
                                            <div className="accordion-item">
                                                <h2 className="accordion-header" id="headingServiceBooking">
                                                    <button
                                                        className={`accordion-button ${!isOpenServicePerBooking ? 'collapsed' : ''}`}
                                                        type="button"
                                                        onClick={toggleAccordion}
                                                        aria-expanded={isOpenServicePerBooking}
                                                        aria-controls="collapseOne"
                                                    >
                                                        Mostrar información acerca de los servicios adicionales por reserva
                                                    </button>
                                                </h2>
                                                <div
                                                    id="collapseOne"
                                                    className={`accordion-collapse collapse ${isOpenServicePerBooking ? 'show' : ''}`}
                                                    aria-labelledby="headingServiceBooking"
                                                >
                                                    <div className="accordion-body">
                                                        <div className="d-flex justify-content-center flex-wrap align-content-center">
                                                            {extraService?.length !== 0 ? (
                                                                <div className='col-md-11 col-sm-8 border border-secondary rounded p-1 me-2 d-flex justify-content-center flex-wrap'>
                                                                    {extraService?.map(service => (

                                                                        <div className='col-md-11 border m-2 shadow_wizard rounded p-3 d-flex justify-content-between'>
                                                                            <div key={`row${service.nombre}`} className="m-0 col-md-11 p-1">
                                                                                <label className="fs-4 m-0 span_package_color">
                                                                                    <strong>Servicio:</strong>
                                                                                    <span className="fs-5 label_package_color"> {service.nombre}</span>
                                                                                    <span className="span_package_color fs-5">
                                                                                        {(service.cantidad !== 0 && service.cantidad !== undefined) && (<span> x{parseInt(service.cantidad) + parseInt(service?.extra !== undefined ? service.extra : 0)} </span>)}
                                                                                    </span>
                                                                                </label>

                                                                                <div className="col-md-11 m-1 d-flex flex-wrap flex-column">
                                                                                    <label className="fs-5 m-0 ms-4 span_package_color">
                                                                                        <strong>Descripcion:</strong> <span className="fs-5 label_package_color">{service.descripcion}</span>
                                                                                    </label>
                                                                                    <label className="fs-5 m-0 ms-4 span_package_color">
                                                                                        <strong>Cuantificable:</strong> <span className="fs-5 label_package_color">{service.tipo.cuantificable ? 'Sí' : 'No'}</span>
                                                                                    </label>
                                                                                    <label className="fs-5 m-0 ms-4 span_package_color">
                                                                                        <strong>Precio:</strong> <span className="fs-5 label_package_color">{service.precio}</span>
                                                                                    </label>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <label className="fs-4 m-0 d-flex justify-content-center">
                                                                    <span className="fs-6 label_package_color ">Sin datos que mostar</span>
                                                                </label>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </Row>
                                </Col>

                            )}
                            {serviceRoomCheck && (
                                <Col>
                                    <Row>
                                        <Card className='col-md-11 col-xl-11 bg-light m-2 p-2 shadow_wizard'>
                                            <div className="col-md-12">
                                                <h3 key='summary' className="text-center mb-2 mt-2">Servicios adicionales por habitación</h3>
                                            </div>

                                            {roomsBooking.length ? (
                                                <div className="col-md-12 col-sm-12">
                                                    {selectRoom ? (
                                                        <Card className="p-2 shadow_wizard">
                                                            <CardBody>
                                                                <div className="row row-cols-lg-auto g-3 align-items-center">
                                                                    <div className="col-xl-8 col-md-12 col-sm-4 mb-2">
                                                                        <Select
                                                                            value={ServicesRoom}
                                                                            onChange={(e) => {
                                                                                handleService(e, 'room');
                                                                            }}
                                                                            options={getServicesPerRoom()}
                                                                            placeholder={`Servicios para la habitación ${selectRoom.numeroHabitacion}`}
                                                                            classNamePrefix="select2-selection"
                                                                        />
                                                                    </div>
                                                                    <div className="col-12 mb-1">
                                                                        <Button type="submit" className="btn btn-outline-primary" onClick={() => { addExtraService(ServicesRoom, extraServiceRoom, 'room') }}>
                                                                            Agregar
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                                <Row>
                                                                    <TabeListService data={extraServiceRoom} headers={['Servicio', 'Precio']} keys={['nombre', 'precio']} enableAmount={true} enableDelete={true} actionDelete={deleteServiceRoom} actionAmount={updateAmountService} mainKey={'nombre'} type='room' />
                                                                </Row>
                                                                <div className="col-12 mt-2">
                                                                    <Button type="submit" className="btn btn-outline-primary" onClick={() => { addExtraServicePerRoom() }}>
                                                                        Guardar
                                                                    </Button>
                                                                </div>
                                                            </CardBody>
                                                        </Card>
                                                    ) : (
                                                        <Card className="p-2 shadow_wizard">
                                                            <CardBody>
                                                                <label htmlFor="roomSelector">Selecciona una habitación:</label>
                                                                <Select
                                                                    id='roomSelector'
                                                                    placeholder="Selecciona una habitación:"
                                                                    value={selectRoom ? { label: selectRoom.numeroHabitacion, value: selectRoom } : null}
                                                                    options={options}
                                                                    onChange={(selectedOption) => handleRoomSelect(selectedOption ? selectedOption.value : null)}
                                                                    classNamePrefix="select2-selection"
                                                                />
                                                            </CardBody>
                                                        </Card>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className='d-flex justify-content-center'>
                                                    <h5 className='text-center'>Debe haber seleccionado almenos una habitación para realizar esta acción.</h5>
                                                </div>
                                            )}
                                        </Card>
                                    </Row>
                                    <Row>
                                        <div className="accordion col-md-11" id="serviceBooking">
                                            <div className="accordion-item">
                                                <h2 className="accordion-header" id="headingServiceBooking">
                                                    <button
                                                        className={`accordion-button ${!isOpenServicePerRoom ? 'collapsed' : ''}`}
                                                        type="button"
                                                        onClick={toggleAccordionPerRoom}
                                                        aria-expanded={isOpenServicePerRoom}
                                                        aria-controls="collapseOne"
                                                    >
                                                        Mostrar información acerca de los servicios adicionales por habitación
                                                    </button>
                                                </h2>
                                                <div
                                                    id="collapseOne"
                                                    className={`accordion-collapse collapse ${isOpenServicePerRoom ? 'show' : ''}`}
                                                    aria-labelledby="headingServiceBooking"
                                                >
                                                    <div className="accordion-body">
                                                        <div className="d-flex justify-content-center flex-wrap align-content-center">
                                                            {servicesPerRoom.length !== 0 ? (
                                                                <div className='col-md-11 border border-secondary rounded p-1 me-2 d-flex justify-content-center flex-wrap'>
                                                                    {servicesPerRoom.map(service => (

                                                                        <div className='col-md-11 border m-2 shadow_wizard rounded p-3 d-flex justify-content-between'>
                                                                            <div key={`row${service.nombre}`} className="m-0 col-md-11 p-1">
                                                                                <label className="fs-4 m-0 span_package_color">
                                                                                    <strong>n.º Habitación</strong> <span className="fs-5 label_package_color">{service.room.numeroHabitacion}</span>
                                                                                </label>

                                                                                <div className="col-md-11 m-1 d-flex flex-wrap flex-column">
                                                                                    <label className="fs-5 m-0 ms-4 span_package_color">
                                                                                        <strong>Tipo Habitación:</strong> <span className="fs-5 label_package_color">{service.room.tipoHabitacion.nombre}</span>
                                                                                    </label>
                                                                                    <ListSection
                                                                                        title="Servicio"
                                                                                        items={service.service}
                                                                                        label="nombre"
                                                                                        emptyMessage="Sin datos"
                                                                                    />

                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                    ))}
                                                                </div>) : (
                                                                <label className="fs-4 m-0 d-flex justify-content-center">
                                                                    <span className="fs-6 label_package_color ">Sin datos que mostar</span>
                                                                </label>
                                                            )}
                                                        </div> </div>
                                                </div>
                                            </div>
                                        </div>

                                    </Row>
                                </Col>
                            )}
                            {serviceTourCheck && (
                                <Col>
                                    <Row>
                                        <Card className='col-md-11 col-xl-11 bg-light m-2 p-2 shadow_wizard'>
                                            <div className="col-md-12">
                                                <h3 key='Tour' className="text-center mb-2 mt-2">Tours por reserva</h3>
                                            </div>

                                            <div className="col-md-12 col-sm-12">
                                                <Card className="p-2">
                                                    <CardBody>
                                                        <div className="row row-cols-lg-auto g-3 align-items-center">
                                                            <div className="col-xl-8 col-md-12 col-sm-4 mb-2">
                                                                <Select
                                                                    value={tours}
                                                                    onChange={(e) => {
                                                                        handleTour(e);
                                                                    }}
                                                                    options={getTour()}
                                                                    placeholder="Tours"
                                                                    classNamePrefix="select2-selection"
                                                                />
                                                            </div>
                                                            <div className="col-12 mb-1">
                                                                <Button type="submit" className="btn btn-outline-primary" onClick={() => { addTours() }}>
                                                                    Agregar
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <Row>
                                                            <ListInfo data={toursList} headers={['Tour ', 'Precio']} keys={['nombre', 'precio']} enableEdit={false} enableDelete={true} actionDelete={deleteTour} mainKey={'nombre'} secondKey={'precio'} />
                                                        </Row>
                                                    </CardBody>
                                                </Card>
                                            </div>
                                        </Card>
                                    </Row>
                                    <Row>
                                        <div className="accordion col-md-11" id="serviceBooking">
                                            <div className="accordion-item">
                                                <h2 className="accordion-header" id="headingServiceBooking">
                                                    <button
                                                        className={`accordion-button ${!isOpenServiceTour ? 'collapsed' : ''}`}
                                                        type="button"
                                                        onClick={toggleAccordionServiceTour}
                                                        aria-expanded={isOpenServiceTour}
                                                        aria-controls="collapseOne"
                                                    >
                                                        Mostrar información acerca de los tours selecionados por reserva
                                                    </button>
                                                </h2>
                                                <div
                                                    id="collapseOne"
                                                    className={`accordion-collapse collapse ${isOpenServiceTour ? 'show' : ''}`}
                                                    aria-labelledby="headingServiceBooking"
                                                >
                                                    <div className="accordion-body">
                                                        <div className="d-flex justify-content-center flex-wrap align-content-center">
                                                            {toursList.length !== 0 ? (
                                                                <div className='col-md-11 border border-secondary rounded p-1 ms-2 d-flex justify-content-center flex-wrap'>
                                                                    {toursList.map(tour => (

                                                                        <div className='col-md-11 border m-2 shadow_wizard rounded p-3 d-flex justify-content-between'>
                                                                            <div key={`row${tour.nombre}`} className="m-0 col-md-11 p-1">
                                                                                <label className="fs-4 m-0 span_package_color">
                                                                                    <strong>Tour:</strong> <span className="fs-5 label_package_color">{tour.nombre}</span>
                                                                                </label>

                                                                                <div className="col-md-11 m-1 d-flex flex-wrap flex-column">
                                                                                    <label className="fs-5 m-0 ms-4 span_package_color">
                                                                                        <strong>Descripcion:</strong> <span className="fs-5 label_package_color">{tour.descripcion}</span>
                                                                                    </label>
                                                                                    <label className="fs-5 m-0 ms-4 span_package_color">
                                                                                        <strong>Cuantificable:</strong> <span className="fs-5 label_package_color">{tour.tipo}</span>
                                                                                    </label>
                                                                                    <label className="fs-5 m-0 ms-4 span_package_color">
                                                                                        <strong>Precio:</strong> <span className="fs-5 label_package_color">{tour.precio}</span>
                                                                                    </label>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <label className="fs-4 m-0 d-flex justify-content-center">
                                                                    <span className="fs-6 label_package_color ">Sin datos que mostar</span>
                                                                </label>
                                                            )}
                                                        </div></div>
                                                </div>
                                            </div>
                                        </div>

                                    </Row>
                                </Col>
                            )}
                        </div>
                    </div>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default ToursService;

