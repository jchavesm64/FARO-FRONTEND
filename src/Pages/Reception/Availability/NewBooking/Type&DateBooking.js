import React from 'react'
import { Button, ButtonGroup, Card, Col, Container, Row } from "reactstrap";

const TypeDateBooking = ({ ...props }) => {

    const { handleTypeBookingChange, setCheckIn, setCheckOut, setAmountPeople, typeBooking, checkIn, checkOut, amountPeople } = props.props
    const typesBooking = ['Individual', 'Grupales', 'Bloqueo', 'Sobreventa'];

    return (
        <React.Fragment>
            <div className="page-content p-3">
                <Container fluid={true}>
                    <div className="m-1 p-3 col-md-12">
                        <Row>
                            <label htmlFor="typeBooking" className="m-2 fw-bold fs-5 ">Tipo de reserva</label>
                            <Col>
                                <ButtonGroup>
                                    {typesBooking.map((type, index) => (
                                        <Button
                                            key={index}
                                            color="primary"
                                            outline
                                            onClick={() => handleTypeBookingChange(type)}
                                            active={typeBooking === type}
                                            className='m-1 fw-bold fs-5'
                                        >
                                            {type}
                                        </Button>
                                    ))}
                                </ButtonGroup>
                            </Col>
                        </Row>
                        <Row className="m-3 col-md-12 d-flex flex-row flex-nowrap">
                            <Card className="d-flex flex-row flex-nowrap justify-content-center ">
                                <Col className="p-1 col-md-5 border shadow_wizard m-2">
                                    <div className="p-1 col-md-12">
                                        <label htmlFor="checkInDate" className="form-label fs-5">Fecha de Entrada</label>
                                        <input
                                            className="form-control"
                                            type="date"
                                            id="checkInDate"
                                            value={checkIn}
                                            onChange={(e) => { setCheckIn(e.target.value) }}
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                    <div className="p-1 col-md-12">
                                        <label htmlFor="checkOutDate" className="form-label fs-5">Fecha de Salida</label>
                                        <input
                                            className="form-control"
                                            type="date"
                                            id="checkOutDate"
                                            value={checkOut}
                                            disabled={checkIn === ''}
                                            onChange={(e) => { setCheckOut(e.target.value) }}
                                            min={checkIn ? new Date(new Date(checkIn).setDate(new Date(checkIn).getDate() + 1)).toISOString().split('T')[0] : ''}
                                        />
                                    </div>
                                </Col>
                                <Col className="p-1 col-md-5 border shadow_wizard m-2">
                                    <div className="p-1 col-md-12">
                                        <label htmlFor="checkOutDate" className="form-label fs-5">Cantidad de personas por reserva</label>
                                        <input
                                            className="form-control"
                                            type="number"
                                            id="checkOutDate"
                                            value={amountPeople}
                                            onChange={(e) => { setAmountPeople(e.target.value) }}
                                            min='0'
                                        />
                                    </div>
                                </Col>
                            </Card>

                        </Row>
                    </div>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default TypeDateBooking;