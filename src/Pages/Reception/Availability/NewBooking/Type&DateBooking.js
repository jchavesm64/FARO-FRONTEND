import React, { useEffect, useState } from 'react'
import { Button, ButtonGroup, Card, Col, Container, Row } from "reactstrap";
import { typesBooking } from '../../../../constants/routesConst';

const TypeDateBooking = ({ ...props }) => {

    const { handleTypeBookingChange, setCheckIn, setCheckOut, setAmountAdult, setAmountChildren, setDisabledButton, typeBooking, checkIn, checkOut, amountAdult, amountChildren } = props.props

    const [previousBookin, setPreviousBookin] = useState(false);

    useEffect(() => { setDisabledButton(!typeBooking || checkIn === "" || checkOut === "" || amountAdult === 0) }, [setDisabledButton, typeBooking, checkIn, checkOut, amountAdult, amountChildren])

    const handleOnClickPreviousBooking = () => {
        setPreviousBookin(!previousBookin)
    };

    return (
        <React.Fragment>
            <div className="page-content p-3">
                <Container fluid={true}>
                    <Card className='p-5 rounded-5 shadow_service'>
                        <Row className='col-md-12 d-flex justify-content-between  p-3'>
                            <Col className="col-md-12">
                                <label htmlFor="typeBooking" className="m-2 fw-bold fs-5 ">Tipo de reserva</label>
                                <div className="col-md-11 col-sm-9 m-2">
                                    <ButtonGroup>
                                        {typesBooking.map((type, index) => (
                                            <Button
                                                key={index}
                                                color="primary"
                                                outline
                                                onClick={() => handleTypeBookingChange(type.value)}
                                                active={typeBooking === type.value}
                                                className='m-1 fw-bold fs-5'
                                            >
                                                {type.label}
                                            </Button>
                                        ))}
                                    </ButtonGroup>
                                </div>
                                {typeBooking === 'BL' &&
                                    <Col className="col-md-6 mb-3">
                                        <div className="form-check ms-3 mt-4    p-0 ps-4">
                                            <label htmlFor="isPreviousBookin" className="form-check-label ms-1">Cargar reserva anterior</label>
                                            <input
                                                className="form-check-input p-0"
                                                type="checkbox"
                                                id="isPreviousBookin"
                                                readOnly
                                                checked={previousBookin}
                                                onClick={() => { handleOnClickPreviousBooking() }}
                                            />
                                        </div>
                                    </Col>
                                }
                            </Col>
                            <Col className="m-0 col-md-12 d-flex flex-row flex-nowrap">
                                <div  className="col-md-12 col-sm-9 m-0 d-flex justify-content-around">
                                    <Col className="p-1 col-md-5 border shadow_wizard m-0" >
                                        <div className="p-1 col-md-12">
                                            <label htmlFor="checkInDate" className="form-label fs-5">Fecha de Entrada</label>
                                            <input
                                                className="form-control"
                                                type="date"
                                                id="checkInDate"
                                                value={checkIn || ''}
                                                disabled={!typeBooking}
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
                                                value={checkOut || ''}
                                                disabled={checkIn === ''}
                                                onChange={(e) => { setCheckOut(e.target.value) }}
                                                min={checkIn ? new Date(new Date(checkIn).setDate(new Date(checkIn).getDate() + 1)).toISOString().split('T')[0] : ''}
                                            />
                                        </div>
                                    </Col>
                                    <Col className="p-1 col-md-5 border shadow_wizard m-0">
                                        <label htmlFor="checkOutDate" className="form-label fs-5">Cantidad de personas por reserva</label>
                                        <div className="p-1 col-md-12 d-flex">
                                            <div className="p-1 col-md-6">
                                                <label htmlFor="checkOutDate" className="form-label fs-6">Adultos:</label>
                                                <input
                                                    className="form-control"
                                                    type="number"
                                                    id="checkOutDate"
                                                    value={amountAdult}
                                                    disabled={checkIn === "" || checkOut === ""}
                                                    onChange={(e) => { setAmountAdult(e.target.value) }}
                                                    min='0'
                                                />
                                            </div>
                                            <div className="p-1 col-md-6">
                                                <label htmlFor="checkOutDate" className="form-label fs-6">Niños:</label>
                                                <input
                                                    className="form-control"
                                                    type="number"
                                                    id="checkOutDate"
                                                    value={amountChildren}
                                                    disabled={checkIn === "" || checkOut === ""}
                                                    onChange={(e) => { setAmountChildren(e.target.value) }}
                                                    min='0'
                                                />
                                            </div>

                                        </div>
                                    </Col>
                                </div>

                            </Col>
                        </Row>
                    </Card>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default TypeDateBooking;