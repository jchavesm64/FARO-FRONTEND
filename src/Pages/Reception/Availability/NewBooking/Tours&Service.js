import React from "react";
import Select from "react-select";
import { Button, Card, CardBody, Container, Row } from "reactstrap";
import ListInfo from "../../../../components/Common/ListInfo";

const ToursService = ({ ...props }) => {

    const {
        handleChangeServiceBooking,
        handleChangeServiceRoom,
        handleChangeTourRoom,
        handleService,
        deleteServiceBooking,
        deleteServiceRoom,
        handleRoomSelect,
        getServices,
        addExtraService,
        getServicesPerRoom,
        addExtraServicePerRoom,
        ServicesRoom,
        roomsBooking,
        selectRoom,
        serviceBookingCheck,
        serviceRoomCheck,
        ServicesBooking,
        extraService,
        extraServiceRoom,
        options,
        serviceTourCheck
    } = props.props;

    return (
        <React.Fragment>
            <div className="page-content p-0 border m-2 size_wizard">
                <Container fluid={true}>
                    <div className="m-2 p-2 ">
                        <div className='col-md-12 d-flex flex-column align-items-center'>
                            <Row className="m-2">
                                <h3 className="col mb-2">
                                    Servicios Adicionales
                                </h3>
                            </Row>
                            {roomsBooking.length ? (
                                <Row className="m-2 p-2 d-flex flex-row col-md-7 col-xl-7 justify-content-around">
                                    <div className="form-check ms-3 mt-2 col-md-3">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="isServiceBooking"
                                            value='serviceBooking'
                                            readOnly
                                            checked={serviceBookingCheck}
                                            onClick={handleChangeServiceBooking}
                                        />
                                        <label htmlFor="isServiceBooking" className="form-check-label ms-2">Servicios por reserva</label>
                                    </div>
                                    <div className="form-check ms-3 mt-2 col-md-3">
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
                                    <div className="form-check ms-3 mt-2 col-md-3">
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
                        <div className='col-md-12 d-flex flex-row  justify-content-center'>
                            {serviceBookingCheck && (
                                <Card className='col-md-3 col-xl-4 bg-light m-2 p-2 shadow_wizard'>
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
                                                    <ListInfo data={extraService} headers={['Servicio ', 'Precio']} keys={['nombre', 'precio']} enableEdit={false} enableDelete={true} actionDelete={deleteServiceBooking} mainKey={'nombre'} secondKey={'precio'} />
                                                </Row>
                                            </CardBody>
                                        </Card>
                                    </div>
                                </Card>
                            )}
                            {serviceRoomCheck && (
                                <Card className='col-md-3 col-xl-4 bg-light mb-2 mt-2 p-2 shadow_wizard'>
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
                                                            <ListInfo data={extraServiceRoom} headers={['Servicio ', 'Precio']} keys={['nombre', 'precio']} enableEdit={false} enableDelete={true} actionDelete={deleteServiceRoom} mainKey={'nombre'} secondKey={'precio'} />
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
                            )}
                            {serviceTourCheck && (
                                <Card className='col-md-3 col-xl-4 bg-light m-2 p-2 shadow_wizard'>
                                    <div className="col-md-12">
                                        <h3 key='summary' className="text-center mb-2 mt-2">Tours por reserva</h3>
                                    </div>

                                    <div className="col-md-12 col-sm-12">
                                        <Card className="p-2">
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
                                                    <ListInfo data={extraService} headers={['Servicio ', 'Precio']} keys={['nombre', 'precio']} enableEdit={false} enableDelete={true} actionDelete={deleteServiceBooking} mainKey={'nombre'} secondKey={'precio'} />
                                                </Row>
                                            </CardBody>
                                        </Card>
                                    </div>
                                </Card>
                            )}
                        </div>
                    </div>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default ToursService;