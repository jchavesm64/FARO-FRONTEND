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

            if (roomsBooking.length >= 4) return true;
        };
        setEnableRooms(valIndividualBooking)
    }, [typeBooking, roomsBooking])

console.log(roomsBooking)
console.log(amountTypeRooms)
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
                                            <CardBody className="p-2 ">
                                                <Row className="d-flex align-items-center" >
                                                    <div className="col-md-2 mb-3">
                                                        <span className="logo-lg">
                                                            <img  src="/static/media/faro-light.f23d16523144109283f2.png" alt="logo-light" height="25" width="85" />
                                                        </span>
                                                    </div>
                                                    <div className="col-md-7 col-sm-12 ">
                                                        <p className="mb-1 mt-1">Tipo Habitación: <span>{type.type.nombre.slice(0, 20)}...</span></p>

                                                        <div className="mb-1 mt-1 col-md-12 d-flex flex-column">Precio por noche:
                                                            {currentSeason.map(c =>
                                                                <spam className='ms-3'>{c.nombre}: <span>${c.tiposHabitacion[type.type.nombre].price}</span>
                                                                </spam>
                                                            )}
                                                        </div>
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
                                                            <div id={`data${type.type.nombre}`} key={`data${type.type.nombre}`} className='col-md-11 border m-2 shadow_wizard rounded p-3 d-flex justify-content-between'>
                                                                <div id={`row${type.type.nombre}`} key={`row${type.type.nombre}`} className="m-0 col-md-11 p-1">
                                                                    <label id={`label${type.type.nombre}`} key={`label${type.type.nombre}`} className="fs-4 m-0 span_package_color">
                                                                        <strong>Tipo de habitación:</strong> <span className="fs-5 label_package_color">{type.type.nombre}</span>
                                                                    </label>

                                                                    <div id={`card${type.type.nombre}`} key={`card${type.type.nombre}`} className="col-md-11 m-1 d-flex flex-wrap flex-column">
                                                                        <label id={`rowselect${type.type.nombre}`} key={`rowselect${type.type.nombre}`} className="fs-5 m-0 ms-4 span_package_color">
                                                                            <strong>Habitaciones selecionadas:</strong> <span className="fs-5 label_package_color">{type.amountBooking}</span>
                                                                        </label>
                                                                        <ListSection
                                                                            key={`list1`}
                                                                            title="Habitaciones"
                                                                            items={roomsBooking.filter(rooms => rooms.tipoHabitacion.nombre === type.type.nombre)}
                                                                            label="n.º de habitación"
                                                                            emptyMessage="Sin datos"
                                                                        />
                                                                        <ListSection
                                                                            key={`list2`}
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