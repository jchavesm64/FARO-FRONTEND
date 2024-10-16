import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Button, Card, CardBody, Col, Container, Modal, Row, ModalBody, ModalHeader, FormGroup } from "reactstrap";
import ListInfo from "../../../../components/Common/ListInfo";
import ListSection from "../../../../components/Common/ListSelection";
import TabeListService from "../../../../components/Common/TableListService";
import EditExtraService from "../../../GeneralSettings/Hotel/ExtraService/EditExtraService";
import EditTour from "../../../GeneralSettings/Hotel/Tours/EditTour";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import DataList from "../../../../components/Common/DataList";
import { getFecha } from "../../../../helpers/helpers";
import { infoAlert } from "../../../../helpers/alert";


const ToursService = ({ ...props }) => {

    const {
        updateServiceBooking,
        updateTourBooking,
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
        addDateServiceExtra,
        deleteDateServiceExtra,
        checkIn,
        checkOut,
        ServicesRoom,
        roomsBooking,
        selectRoom,
        ServicesBooking,
        extraService,
        extraServiceRoom,
        options,
        tours,
        toursList,
        servicesPerRoom,
        typeBooking
    } = props.props;

    setDisabledButton(false);

    const [isOpenServicePerBooking, setIsOpenServicePerBooking] = useState(false);
    const [isOpenServicePerRoom, setIsOpenServicePerRoom] = useState(false);
    const [isOpenServiceTour, setIsOpenServiceTour] = useState(false);

    const [isOpenServicePerBookingList, setIsOpenServicePerBookingList] = useState(false);
    const [isOpenServicePerRoomList, setIsOpenServicePerRoomList] = useState(false);
    const [isOpenServiceTourList, setIsOpenServiceTourList] = useState(false);

    const toggleAccordion = (currentStateSetter, currentState) => {
        currentStateSetter(!currentState);
    };

    const [modal, setModal] = useState(false);
    const [filter, setFilter] = useState(null);
    const [extraDate, setExtraDate] = useState([]);
    const [type, setType] = useState('');
    const toggle = () => { setModal(!modal); setType(''); setExtraDate(0); };

    const showModalEditService = (data, type) => {
        setType(type);
        setFilter(data);
        setModal(true);
    };

    const showModalEditTour = (data) => {
        setFilter(data);
        setModal(true);
    };

    const updateService = (packageUpdate) => {
        updateServiceBooking(packageUpdate, type)
        toggle();
        setFilter(null);
    };

    const updateTour = (tour) => {
        updateTourBooking(tour);
        toggle();
        setFilter(null);
    };

    const showModalCalendar = (data, type) => {
        setType(type);
        setExtraDate(data);
        setModal(true);
    };

    const handleAddDate = (update, service, type) => {
        if (extraDate.useExtra.length < extraDate?.extra) {
            setExtraDate(addDateServiceExtra(update, service, type));
        } else {
            infoAlert('Oops', 'Ya completó las fechas para los servicios extra', 'warning', 3000, 'top-end')
        };
    };

    const deleteDate = (index) => {
        setExtraDate(deleteDateServiceExtra(index, extraDate, type));
    };

    return (
        <React.Fragment>
            <div className="page-content p-3 border m-2 ">
                <Container fluid={true}>

                    <Row className='d-flex justify-content-between shadow_service rounded-5 p-4'>
                        <Col className='col-md-12  d-flex justify-content-center flex-column align-items-center'>

                            <h3 className="col mb-2">
                                Servicios Adicionales
                            </h3>

                            {typeBooking !== "IN" && <div className="accordion col-md-11 col-sm-8 m-2 shadow_wizard" id="booking">
                                <div className="accordion-item ">
                                    <h2 className="accordion-header" id="headingAddServiceBooking">
                                        <button
                                            className={`service_toggle step-hover-effect_wizard accordion-button ${!isOpenServicePerBooking ? 'collapsed' : ''}`}
                                            type="button"
                                            onClick={() => toggleAccordion(setIsOpenServicePerBooking, isOpenServicePerBooking)}
                                            aria-expanded={isOpenServicePerBooking}
                                            aria-controls="collapseOne"
                                        >
                                            <label className="fs-5 m-0 ms-4 span_package_color ">
                                                <strong>Agregar servicios adicionales por reserva</strong>
                                            </label>

                                        </button>
                                    </h2>
                                    <div
                                        id="collapseOneService"
                                        className={`accordion-collapse collapse ${isOpenServicePerBooking ? 'show' : ''}`}
                                        aria-labelledby="headingServiceBooking"
                                    >
                                        <div className="accordion-body">
                                            <div className="d-flex justify-content-center flex-wrap align-content-center">
                                                <Col >
                                                    <Row className='d-flex justify-content-center flex-column align-items-center'>
                                                        <Card className='col-md-12 col-xl-11 bg-light m-2 p-2 shadow_wizard'>
                                                            <div className="col-md-12">
                                                                <h3 key='titleService' className="text-center mb-2 mt-2">Servicios adicionales por reserva</h3>
                                                            </div>

                                                            <div className="col-md-12 col-sm-12">
                                                                <Card className="p-2 shadow_wizard">
                                                                    <CardBody>
                                                                        <div className="row row-cols-lg-auto g-3 align-items-center">
                                                                            <div className="col-xl-10 col-md-12 col-sm-4 mb-2">
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
                                                                            <TabeListService data={extraService} headers={['Servicio', 'Precio']} keys={['nombre', 'precio']} enableAmount={true} enableDelete={true} actionDelete={deleteServiceBooking} enableEdit={true} actionEdit={showModalEditService} actionAmount={updateAmountService} mainKey={'nombre'} type='perService' amount='Extra' actionCalendar={showModalCalendar} enableCalendar={true} />
                                                                        </Row>
                                                                    </CardBody>
                                                                </Card>
                                                            </div>
                                                        </Card>
                                                    </Row>
                                                    <Row>
                                                        <div className="accordion col-md-12 col-sm-8" id="serviceBooking">
                                                            <div className="accordion-item">
                                                                <h2 className="accordion-header" id="headingServiceBooking">
                                                                    <button
                                                                        className={`accordion-button ${!isOpenServicePerBookingList ? 'collapsed' : ''}`}
                                                                        type="button"
                                                                        onClick={() => toggleAccordion(setIsOpenServicePerBookingList, isOpenServicePerBookingList)}
                                                                        aria-expanded={isOpenServicePerBookingList}
                                                                        aria-controls="collapseOne"
                                                                    >
                                                                        Mostrar información acerca de los servicios adicionales por reserva
                                                                    </button>
                                                                </h2>
                                                                <div
                                                                    id="collapseOneServiceList"
                                                                    className={`accordion-collapse collapse ${isOpenServicePerBookingList ? 'show' : ''}`}
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
                                                                                                        {(service.cantidad !== 0 && service.cantidad !== undefined) && (<span> x{parseInt(service?.extra !== undefined ? service.extra : 0)} </span>)}
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
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>}

                            <div className="accordion col-md-11 col-sm-8 m-2 shadow_wizard" id="room">
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="headingServiceRoom">
                                        <button
                                            className={`step-hover-effect_wizard accordion-button ${!isOpenServicePerRoom ? 'collapsed' : ''}`}
                                            type="button"
                                            onClick={() => toggleAccordion(setIsOpenServicePerRoom, isOpenServicePerRoom)}
                                            aria-expanded={isOpenServicePerRoom}
                                            aria-controls="collapseOne"
                                        >
                                            <label className="fs-5 m-0 ms-4 span_package_color">
                                                <strong>Agregar servicios adicionales por habitación</strong>
                                            </label>

                                        </button>
                                    </h2>
                                    <div
                                        id="collapseOneRoom"
                                        className={`accordion-collapse collapse ${isOpenServicePerRoom ? 'show' : ''}`}
                                        aria-labelledby="headingServiceRoom"
                                    >
                                        <div className="accordion-body">
                                            <div className="d-flex justify-content-center flex-wrap align-content-center">
                                                <Col >
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
                                                                                    <div className="col-xl-10 col-md-12 col-sm-4 mb-2">
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
                                                                                    <TabeListService data={extraServiceRoom} headers={['Servicio', 'Precio']} keys={['nombre', 'precio']} enableAmount={true} enableDelete={true} actionDelete={deleteServiceRoom} enableEdit={true} actionEdit={showModalEditService} actionAmount={updateAmountService} mainKey={'nombre'} type='perRoom' amount='Extra' actionCalendar={showModalCalendar} enableCalendar={true} />
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
                                                        <div className="accordion col-md-12 col-sm-8" id="serviceRoomList">
                                                            <div className="accordion-item">
                                                                <h2 className="accordion-header" id="headingServiceRoomList">
                                                                    <button
                                                                        className={`accordion-button ${!isOpenServicePerRoomList ? 'collapsed' : ''}`}
                                                                        type="button"
                                                                        onClick={() => toggleAccordion(setIsOpenServicePerRoomList, isOpenServicePerRoomList)}
                                                                        aria-expanded={isOpenServicePerRoomList}
                                                                        aria-controls="collapseOne"
                                                                    >
                                                                        Mostrar información acerca de los servicios adicionales por habitación
                                                                    </button>
                                                                </h2>
                                                                <div
                                                                    id="collapseOneRoomList"
                                                                    className={`accordion-collapse collapse ${isOpenServicePerRoomList ? 'show' : ''}`}
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
                                                                                                        showExtra={true}
                                                                                                        showAmount={false}
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
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="accordion col-md-11 col-sm-8 m-2 shadow_wizard" id="tour">
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="headingServiceTour1">
                                        <button
                                            className={`step-hover-effect_wizard accordion-button ${!isOpenServiceTour ? 'collapsed' : ''}`}
                                            type="button"
                                            onClick={() => toggleAccordion(setIsOpenServiceTour, isOpenServiceTour)}
                                            aria-expanded={isOpenServiceTour}
                                            aria-controls="collapseOne"
                                        >
                                            <label className="fs-5 m-0 ms-4 span_package_color">
                                                <strong>Agregar tours adicionales</strong>
                                            </label>
                                        </button>
                                    </h2>
                                    <div
                                        id="collapseOneTour"
                                        className={`accordion-collapse collapse ${isOpenServiceTour ? 'show' : ''}`}
                                        aria-labelledby="headingServiceTour2"
                                    >
                                        <div className="accordion-body">
                                            <div className="d-flex justify-content-center flex-wrap align-content-center">
                                                <Col >
                                                    <Row className='d-flex justify-content-center flex-column align-items-center'>
                                                        <Card className='col-md-11 col-xl-11 bg-light m-2 p-2 shadow_wizard'>
                                                            <div className="col-md-12">
                                                                <h3 key='Tour' className="text-center mb-2 mt-2">Tours por reserva</h3>
                                                            </div>

                                                            <div className="col-md-12 col-sm-12">
                                                                <Card className="p-2">
                                                                    <CardBody>
                                                                        <div className="row row-cols-lg-auto g-3 align-items-center">
                                                                            <div className="col-xl-10 col-md-12 col-sm-4 mb-2">
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
                                                                            <ListInfo data={toursList} headers={['Tour ', 'Precio']} keys={['nombre', 'precio']} enableEdit={true} actionEdit={showModalEditTour} enableDelete={true} actionDelete={deleteTour} mainKey={'nombre'} secondKey={'precio'} />
                                                                        </Row>
                                                                    </CardBody>
                                                                </Card>
                                                            </div>
                                                        </Card>
                                                    </Row>
                                                    <Row>
                                                        <div className="accordion col-md-12 col-sm-8" id="serviceTour">
                                                            <div className="accordion-item">
                                                                <h2 className="accordion-header" id="headingServiceTour3">
                                                                    <button
                                                                        className={`accordion-button ${!isOpenServiceTourList ? 'collapsed' : ''}`}
                                                                        type="button"
                                                                        onClick={() => toggleAccordion(setIsOpenServiceTourList, isOpenServiceTourList)}
                                                                        aria-expanded={isOpenServiceTourList}
                                                                        aria-controls="collapseOne"
                                                                    >
                                                                        Mostrar información acerca de los tours selecionados por reserva
                                                                    </button>
                                                                </h2>
                                                                <div
                                                                    id="collapseOneTourList"
                                                                    className={`accordion-collapse collapse ${isOpenServiceTourList ? 'show' : ''}`}
                                                                    aria-labelledby="headingServiceTour"
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
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>

                    </Row>

                    <Modal key='modalCustomer' isOpen={modal} toggle={toggle} size={extraDate === 0 ? 'xl' : 'lg'}>
                        <ModalHeader key='modalheader' toggle={toggle}>
                            {!extraDate ?
                                <span className="fs-4 m-0 span_package_color">
                                    {type !== '' ? 'Editar sevicio' : 'Editar tour'}
                                </span> : (
                                    <span className="fs-4 m-0 span_package_color">
                                        Fechas para el uso de cada servicio extra
                                    </span>
                                )}
                        </ModalHeader>
                        {!extraDate === 0 ?
                            <ModalBody key='modalbody'>
                                {type !== '' ? <EditExtraService idBooking={filter?.id} updateServiceBooking={updateService} /> : (<EditTour idBooking={filter?.id} updateTourBooking={updateTour} />)}
                            </ModalBody> : (
                                <ModalBody key='modalbody'>
                                    <Card className='p-4'>
                                        <Row>
                                            <div className="d-flex flex-column">
                                                <label className="fs-5 m-0 ms-1 mb-2 span_package_color">
                                                    <strong>Servicio:</strong> <span className="fs-5 label_package_color">{extraDate?.nombre}</span>
                                                </label>
                                                <label className="fs-5 m-0 ms-1 mb-2 span_package_color">
                                                    <strong>Extra:</strong> <span className="fs-5 label_package_color">{extraDate?.extra}</span>
                                                </label>
                                            </div>
                                        </Row>
                                        <Row className='d-flex justify-content-between shadow_service rounded-5 p-3'>
                                            <Col className="col-md-6 d-flex  flex-wrap justify-content-center align-items-center p-0">
                                                <FormGroup className=' m-0' disabled={true}>
                                                    <DatePicker
                                                        startDate={new Date()}
                                                        onChange={(e) => handleAddDate(e, extraDate, type)}
                                                        inline
                                                        className="form-control"
                                                        minDate={getFecha(checkIn)}
                                                        maxDate={getFecha(checkOut)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col className="col-md-6  d-flex justify-content-center flex-wrap">
                                                <DataList data={extraDate ? extraDate?.useExtra : []} type="tableDate" displayLength={3} enableDelete={true} deleteAction={deleteDate} />
                                            </Col>
                                        </Row>
                                    </Card>
                                </ModalBody>
                            )}
                    </Modal>
                </Container>
            </div>
        </React.Fragment>
    );
};
export default ToursService;

