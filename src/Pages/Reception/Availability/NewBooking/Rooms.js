import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, Col, Container, Input, InputGroup, Row } from "reactstrap";
import ListSection from "../../../../components/Common/ListSelection";

const Rooms = ({ ...props }) => {

    const { handleDecrease, handleChange, handleBlur, handleIncrease, setDisabledButton, amountTypeRooms, currentSeason, roomsBooking, typeBooking } = props.props;

    useEffect(() => { setDisabledButton(roomsBooking.length === 0) }, [setDisabledButton, roomsBooking]);

    const [enableRooms, setEnableRooms] = useState(false);

    useEffect(() => {
        const valIndividualBooking = () => {
            if (typeBooking !== 'IN') return false;

            if (roomsBooking.length >= 1) return true;
        };
        setEnableRooms(valIndividualBooking)
    }, [typeBooking, roomsBooking])

    return (
        <React.Fragment>
            <div className="page-content p-4 border m-2">
                <Container fluid={true}>
                    <Card className="m-2 p-2 d-flex flex-row justify-content-center ">
                        <Col className='col-md-7'>
                            <Card className='col-md-12 shadow_wizard room_card_wizard'>
                                <Row className="m-2 text-center">
                                    <h3 className="col mb-2">
                                        Tipo de Habitaciones
                                    </h3>
                                </Row>
                                <Row className="col-md-12 ms-0 flex-row justify-content-center room_card_wizard_details ">
                                    {amountTypeRooms.map((type, index) => (
                                        <Card key={`${type.type.nombre}-type`} className="m-2 p-1 bg-light shadow col-md-11">
                                            <CardBody className="p-2 card_room_wizard">
                                                <Row className="d-flex align-items-center" >
                                                    <div className="col-md-2 mb-3">
                                                        <span className="logo-lg">
                                                            <img src="/static/media/faro-light.f23d16523144109283f2.png" alt="logo-light" height="24" />
                                                        </span>
                                                    </div>
                                                    <div className="col-md-7 col-sm-12 ">
                                                        <p className="mb-1 mt-1">Typo Habitación: <span>{type.type.nombre}</span></p>
                                                        <p className="mb-1 mt-1">Precio por noche: $<span>{type.type.precioBase + currentSeason.precio}</span></p>
                                                        <div className="d-flex flex-wrap description_room_wizard"> <p>Decripción: <span>{type.type.descripcion}</span></p></div>
                                                    </div>

                                                    <div className="col-md-3 col-sm-12 d-flex flex-column align-items-center justify-content-end"  >
                                                        <InputGroup style={{ maxWidth: '7rem' }}>
                                                            <Button color="primary" onClick={() => handleDecrease(index)} disabled={type.amountBooking === 0}>
                                                                -
                                                            </Button>
                                                            <Input
                                                                type="text"
                                                                value={type.amountBooking}
                                                                onChange={(e) => handleChange(e, index)}
                                                                onBlur={(e) => handleBlur(e, index)}
                                                                className="text-center"
                                                            />
                                                            <Button color="primary" onClick={() => handleIncrease(index)} disabled={type.amountBooking === type.lengthAvailable || enableRooms}>
                                                                +
                                                            </Button>
                                                        </InputGroup>
                                                        <p>Disponibles: {type.lengthAvailable - type.amountBooking}</p>
                                                    </div>

                                                </Row>

                                            </CardBody>
                                        </Card>
                                    ))}
                                </Row>
                            </Card>
                        </Col>
                        <Col className='col-md-5'>
                            <Card className='col-md-12 bg-light border ms-2 p-2 room_card_wizard'>
                                <div className="col-md-12">
                                    <h3 key='summary' className="text-center mb-4 mt-4">Habitaciones</h3>
                                    <Card className="col-md-12 bg-tertiary rounded p-2 room_card_wizard_details" >
                                        {roomsBooking?.length ? (
                                            <div >
                                                <div className='border border-secondary rounded p-1'>
                                                    {amountTypeRooms.map(type => (
                                                        type.amountBooking !== 0 && (
                                                            <div className='col-md-11 border m-2 shadow_wizard rounded p-3 d-flex justify-content-between'>
                                                                <div key={`row${type.type.nombre}`} className="m-0 col-md-11 p-1">
                                                                    <label className="fs-4 m-0 span_package_color">
                                                                        <strong>Tipo de habitación:</strong> <span className="fs-5 label_package_color">{type.type.nombre}</span>
                                                                    </label>

                                                                    <div className="col-md-11 m-1 d-flex flex-wrap flex-column">
                                                                        <label className="fs-5 m-0 ms-4 span_package_color">
                                                                            <strong>Habitaciones selecionadas:</strong> <span className="fs-5 label_package_color">{type.amountBooking}</span>
                                                                        </label>
                                                                        <ListSection
                                                                            title="Habitaciones"
                                                                            items={roomsBooking.filter(rooms => rooms.tipoHabitacion.nombre === type.type.nombre)}
                                                                            label="n.º de habitación"
                                                                            emptyMessage="Sin datos"
                                                                        />
                                                                        <ListSection
                                                                            title="Comodidades por habitación"
                                                                            items={roomsBooking.find(rooms => rooms.tipoHabitacion.nombre === type.type.nombre).comodidades}
                                                                            label="Comodidad"
                                                                            emptyMessage="Sin datos"
                                                                        />

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    ))}
                                                </div>
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
                    </Card>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default Rooms;