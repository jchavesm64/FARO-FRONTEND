import React, { useEffect, useState } from 'react'
import { Card, CardBody, Container, Row, Modal, ModalHeader, ModalBody, Col } from "reactstrap";
import NewCustomer from '../../../Customers/NewCustomer'
import ListSection from '../../../../components/Common/ListSelection';
import EditCustomer from '../../../Customers/EditCustomer';

const SearchCustomer = ({ ...props }) => {

    const { handleInputChange, selectClient, setCustomer, setFilter, setDisabledButton, filter, customers, customer, stateBooking, bookingDate } = props.props;

    const [modal, setModal] = useState(false);
    const [editCustomer, setEditCustomer] = useState(false);

    const toggle = () => setModal(!modal);

    const addNewCustomer = (data) => {
        setCustomer(data);
        setFilter('');
        setEditCustomer(false);
    };

    useEffect(() => { setDisabledButton(!customer) }, [setDisabledButton, customer])

    const onClickMoreInfo = () => {
        setModal(true);
    };

    const onClickEdit = () => {
        setEditCustomer(!editCustomer);
        setModal(false);
    }

    const handleCustomer = (customer) => {
        selectClient(customer)
    };


    return (
        <React.Fragment>
            <div className="page-content p-4 border m-2">
                <Container fluid={true}>
                    <Card className='p-1'>
                        <Row className='d-flex justify-content-between p-3'>
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
                        <Row >
                            {customers?.length > 0 ? (
                                <ul className="list-group form-control ontent-scroll p-3 mb-3 border" style={{ zIndex: 1000, maxHeight: '300px', overflowY: 'auto' }}>
                                    {customers.map((customer, index) => (
                                        <li
                                            key={customer.id}
                                            onClick={() => handleCustomer(customer)}
                                            className='ist-group-item list-group-item-action rounded p-2 search_customer_wizard'

                                        >
                                            {customer.nombre}
                                        </li>
                                    ))}
                                </ul>

                            ) : filter !== '' && (
                                <Row className='d-flex justify-content-between shadow_service rounded-5 p-3'>
                                    <label>No existe el cliente, ¿Desea agregar uno?</label>
                                    <Card className='col-xl-12 col-md-12 p-0'>
                                        <CardBody className="p-0">
                                            <NewCustomer props={{ addNewCustomer, stateBooking }} />
                                        </CardBody>
                                    </Card>
                                </Row>
                            )}
                        </Row>
                        <Row >
                            {customers?.length > 0 ? (
                                <ul className="list-group form-control ontent-scroll p-3 mb-3 border" style={{ zIndex: 1000, maxHeight: '300px', overflowY: 'auto' }}>
                                    {customers.map((customer, index) => (
                                        <li
                                            key={customer.id}
                                            onClick={() => handleCustomer(customer)}
                                            className='ist-group-item list-group-item-action rounded p-2 search_customer_wizard'

                                        >
                                            {customer.nombre}
                                        </li>
                                    ))}
                                </ul>

                            ) : filter !== '' && (
                                <Row className='d-flex justify-content-between shadow_service rounded-5 p-3'>
                                    <label>No existe el cliente, ¿Desea agregar uno?</label>
                                    <Card className='col-xl-12 col-md-12 p-0'>
                                        <CardBody className="p-0">
                                            <NewCustomer props={{ addNewCustomer, stateBooking }} />
                                        </CardBody>
                                    </Card>
                                </Row>
                            )}
                        </Row>
                        {customer ? (
                            <div className='mt-1'>
                                <Row className="m-2 col-md-12 d-flex flex-row flex-nowrap justify-content-center">
                                    <Card className="m-1 p-3 col-md-11 shadow_service rounded-5">
                                        <CardBody className="text-muted d-flex flex-column justify-content-center">
                                            <h2 className="mb-2 span_package_color"> <strong className="mdi mdi-account me-1" />Datos del cliente</h2>
                                            <p className="mb-2 fw-bold fs-5 label_package_color">Fecha de reserva: <span className='fw-normal span_package_color'>{bookingDate}</span></p>
                                            <div className='p-3 d-flex flex-wrap flex-column'>
                                                <label className="fs-5 m-0 ms-4 span_package_color">
                                                    <strong>Nombre: </strong> <span className="fs-5 label_package_color">{customer.nombreFacturacion}</span>
                                                </label>
                                                <label className="fs-5 m-0 ms-4 span_package_color">
                                                    <strong>Identificación: </strong> <span className="fs-5 label_package_color">{customer.nombre}</span>
                                                </label>
                                                <label className="fs-5 m-0 ms-4 span_package_color">
                                                    <strong>País: </strong> <span className="fs-5 label_package_color">{customer.pais}</span>
                                                </label>
                                                <ListSection
                                                    title="Correos"
                                                    items={customer.correos.slice(0, 3)}
                                                    label="Email"
                                                    emptyMessage="Sin datos"
                                                />
                                                <ListSection
                                                    title="Teléfonos"
                                                    items={customer.telefonos.slice(0, 3)}
                                                    label="Teléfono"
                                                    emptyMessage="Sin datos"
                                                />
                                            </div>
                                            <div className=" text-end">
                                                <button type="button" className="btn btn-primary waves-effect waves-light" onClick={() => onClickMoreInfo()}>
                                                    Mostrar más datos{" "}
                                                    <i className="mdi mdi-account-search align-middle ms-2"></i>
                                                </button>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Row>
                            </div>
                        ) : filter === '' && (
                            <div className="col-md-11 col-sm-9 m-2">
                                <label>Debe buscar un cliente</label>
                            </div>
                        )}
                        {editCustomer && (
                            <Row className='d-flex justify-content-between shadow_service rounded-5 p-3'>
                                <Card className='col-xl-12 col-md-12 p-0'>
                                    <CardBody className="p-0">
                                        <EditCustomer props={props} customer={customer} booking={true} editCustomer={addNewCustomer} />
                                    </CardBody>
                                </Card>
                            </Row>
                        )}

                        <Modal key='modalCustomer' isOpen={modal} toggle={toggle} size='lg'>
                            <ModalHeader key='modalheader' toggle={toggle}><span className="fs-4 m-0 span_package_color">Información adicional del cliente</span></ModalHeader>
                            <ModalBody key='modalbody'>
                                <Card className='p-4'>
                                    <Row className='d-flex justify-content-between shadow_service rounded-5 p-3'>
                                        <Col className="col-md-12  d-flex justify-content-center flex-wrap ">
                                            <div key='modaldivmain' className="col-md-12 border-bottom mb-3 d-flex flex-column">
                                                <label key='labelmodalmain' className="fs-5 m-0 ms-4 span_package_color ">
                                                    <strong>Nombre de facturación: </strong> <span className="fs-5 label_package_color">{customer?.nombreFacturacion}</span>
                                                </label>
                                                <label key='labelmodalmain' className="fs-5 m-0 ms-4 span_package_color ">
                                                    <strong>Tipo de cliente: </strong> <span className="fs-5 label_package_color">{customer?.tipo}</span>
                                                </label>
                                                <label key='labelmodalmain' className="fs-5 m-0 ms-4 span_package_color ">
                                                    <strong>Ciudad: </strong>
                                                    <span className="fs-5 label_package_color">{customer?.ciudad}</span>
                                                </label>
                                                <label key='labelmodalmain' className="fs-5 m-0 ms-4 span_package_color ">
                                                    <strong>Cantón: </strong>
                                                    <span className="fs-5 label_package_color">{customer?.city}</span>
                                                </label>
                                                <label key='labelmodalmain' className="fs-5 m-0 ms-4 span_package_color ">
                                                    <strong>Calle: </strong>
                                                    <span className="fs-5 label_package_color">{customer?.calle}</span>
                                                </label>
                                                <label key='labelmodalmain' className="fs-5 m-0 ms-4 span_package_color ">
                                                    <strong>Dirección: </strong>
                                                    <span className="fs-5 label_package_color">{customer?.direccion}</span>
                                                </label>
                                                <ListSection
                                                    title="Correos"
                                                    items={customer?.correos}
                                                    label="Email"
                                                    emptyMessage="Sin datos"
                                                />
                                                <ListSection
                                                    title="Teléfonos"
                                                    items={customer?.telefonos}
                                                    label="Teléfono"
                                                    emptyMessage="Sin datos"
                                                />
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className=" text-end">
                                                <button type="button" className="btn btn-primary waves-effect waves-light" onClick={() => onClickEdit()}>
                                                    Editar cliente{" "}
                                                    <i className="mdi mdi-account-search align-middle ms-2"></i>
                                                </button>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card>
                            </ModalBody>
                        </Modal>
                    </Card>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default SearchCustomer;