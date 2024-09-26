import React, { useState } from 'react'
import { Card, CardBody, Container, Row } from "reactstrap";
import NewCustomer from '../../../Customers/NewCustomer'

const SearchCustomer = ({ ...props }) => {

    const { handleInputChange, selectClient, setCustomer, setFilter, filter, customers, customer, stateBooking, bookingDate } = props.props;

    const [ setHoveredIndex] = useState(null);

    const addNewCustomer = (data) => {
        setCustomer(data);
        setFilter('');
    };

    return (
        <React.Fragment>
            <div className="page-content p-4 border m-2">
                <Container fluid={true}>
                    <Row className="flex" style={{ alignItems: 'flex-end' }}>
                        <div className="col-md-12 mb-1">
                            <label> Busca el cliente</label>
                            <input
                                className="form-control"
                                id="search-input"
                                value={filter}
                                onChange={(e) => handleInputChange(e)}
                                type="search"
                                placeholder="Escribe el nombre o la identificación del cliente" />
                        </div>

                    </Row>
                    <Row>
                        {customers?.length > 0 ? (
                            <ul className="list-group form-control ontent-scroll p-3 mb-3 border" style={{ zIndex: 1000, maxHeight: '300px', overflowY: 'auto' }}>
                                {customers.map((customer, index) => (
                                    <li
                                        key={customer.id}
                                        onClick={() => selectClient(customer)}
                                        className='ist-group-item list-group-item-action rounded p-2 search_customer_wizard'

                                        onMouseEnter={() => setHoveredIndex(index)}
                                        onMouseLeave={() => setHoveredIndex(null)}
                                    >
                                        {customer.nombre}
                                    </li>
                                ))}
                            </ul>

                        ) : filter !== '' && (
                            <div className="col-md-12 col-sm-12 mb-3">
                                <label>No existe el cliente, ¿Desea agregar uno?</label>
                                <Card className='col-xl-12 col-md-12 p-0'>
                                    <CardBody className="p-0">
                                        <NewCustomer props={{ addNewCustomer, stateBooking }} />
                                    </CardBody>
                                </Card>
                            </div>
                        )}
                    </Row>
                    {customer ? (
                        <div className='mt-1'>
                            <Row className="m-2 col-md-12 d-flex flex-row flex-nowrap">
                                <Card className="m-1 p-3 col-md-10">
                                    <CardBody className="text-muted d-flex flex-column justify-content-center">
                                        <h2 className="mb-2">Datos del cliente</h2>
                                        <div className='p-3'>
                                            <p className="mb-2 fw-bold fs-5">Nombre: <span className='fw-normal'>{customer.nombre}</span></p>
                                            <p className="mb-2 fw-bold fs-5">Identificación: <span className='fw-normal'>{customer.codigo}</span></p>
                                            <p className="mb-2 fw-bold fs-5">País: <span className='fw-normal'>{customer.pais}</span></p>
                                            <p className="mb-2 fw-bold fs-5">Fecha de reserva: <span className='fw-normal'>{bookingDate}</span></p>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Row>
                        </div>) : filter === '' && (<label>Debe buscar un cliente</label>)}
                </Container>
            </div>
        </React.Fragment>
    );
};

export default SearchCustomer;