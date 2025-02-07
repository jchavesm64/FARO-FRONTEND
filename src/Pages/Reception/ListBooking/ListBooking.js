/* import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Container, Row, Card, CardHeader, FormGroup, Label, CardTitle, CardBody, Badge, Input, Button, Col } from 'reactstrap';
import { OBTENER_RESERVAS } from "../../../../services/ReservaService";
import Breadcrumbs from '../../../components/Common/Breadcrumb';
import DataList from '../../../components/Common/DataList';

const ListBooking = ({ ...props }) => {

    document.title = "Listado de reservas | FARO";
    const { data: data_booking, loading: loading_booking, error: error_booking } = useQuery(OBTENER_RESERVAS, { pollInterval: 1000 });

    const [booking, setBooking] = useState([]);
    const [filteredBooking, setFilteredBooking] = useState([]);
    const [filterCriteria, setFilterCriteria] = useState({
        estado: '',
        clienteNombre: '',
        fechaReserva: '',
        tipo: ''
    });

    useEffect(() => {
        setBooking(data_booking?.obtenerReservas || []);
        setFilteredBooking(data_booking?.obtenerReservas || []);
    }, [data_booking]);



    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilterCriteria({
            ...filterCriteria,
            [name]: value
        });
    };

    const filterBookings = () => {
        const filtered = booking.filter(b => {
            let matches = true;

            if (filterCriteria.estado && b.estado !== filterCriteria.estado) {
                matches = false;
            }

            if (filterCriteria.clienteNombre) {
                const clienteNombreLower = b.cliente.nombre.toLowerCase();
                const clienteCodigoLower = b.cliente.codigo.toLowerCase();
                const filterLower = filterCriteria.clienteNombre.toLowerCase();
                if (!clienteNombreLower.includes(filterLower) && !clienteCodigoLower.includes(filterLower)) {
                    matches = false;
                }
            }

            if (filterCriteria.fechaReserva && new Date(Number(b.fechaReserva)).toLocaleDateString() !== new Date(filterCriteria.fechaReserva).toLocaleDateString()) {
                matches = false;
            }

            if (filterCriteria.tipo && b.tipo !== filterCriteria.tipo) {
                matches = false;
            }

            return matches;
        });

        setFilteredBooking(filtered);
    };


    useEffect(() => {
        filterBookings();
    }, [filterCriteria, booking]);


    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Listado de reservas" breadcrumbItem="Recepción" breadcrumbItemUrl="/reception" />
                </Container>

                {booking.length > 0 ? (
                    <div className="page-content">
                        <Row className="mb-4">
                            <div className="col-md-12">
                                <Card>
                                    <CardBody>
                                        <h5 className="card-title">Filtrar Reservas</h5>
                                        <Row form>
                                            <Col >
                                                <FormGroup>
                                                    <Label for="clienteNombre">Nombre del cliente</Label>
                                                    <Input type="text" name="clienteNombre" id="clienteNombre" placeholder="Nombre del cliente o cédula" value={filterCriteria.clienteNombre} onChange={handleFilterChange} />
                                                </FormGroup>
                                            </Col>
                                            <Row>
                                                <Col md={4}>
                                                    <FormGroup>
                                                        <Label for="fechaReserva">Fecha de reserva</Label>
                                                        <Input type="date" name="fechaReserva" id="fechaReserva" placeholder="Fecha de reserva" value={filterCriteria.fechaReserva} onChange={handleFilterChange} />
                                                    </FormGroup>
                                                </Col>
                                                <Col md={4}>
                                                    <FormGroup>
                                                        <Label for="estado">Estado</Label>
                                                        <Input type="select" name="estado" id="estado" value={filterCriteria.estado} onChange={handleFilterChange}>
                                                            <option value="">Todos los estados</option>
                                                            <option value="Cancelada">Cancelada</option>
                                                            <option value="Pendiente">Pendiente</option>
                                                            <option value="Pagada">Pagada</option>
                                                            <option value="Conflicto">Conflicto</option>
                                                            <option value="Incompleto">Incompleto</option>
                                                            <option value="Activa">Activa</option>
                                                            <option value="CheckIn">CheckIn</option>
                                                            <option value="CheckOut">CheckOut</option>
                                                            <option value="Finalizada">Finalizada</option>
                                                        </Input>
                                                    </FormGroup>
                                                </Col>
                                                <Col md={4}>
                                                    <FormGroup>
                                                        <Label for="estado">Estado</Label>
                                                        <Input type="select" name="tipo" id="tipo" value={filterCriteria.tipo} onChange={handleFilterChange}>
                                                            <option value="">Todos los tipos</option>
                                                            <option value="IN">Individual</option>
                                                            <option value="GR">Grupales</option>
                                                            <option value="BL">Bloqueo</option>
                                                            <option value="OS">Sobreventa</option>
                                                        </Input>
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                        </Row>
                                        <Button color="primary" onClick={filterBookings}>Filtrar</Button>
                                    </CardBody>
                                </Card>
                            </div>
                        </Row>
                        <div className="scroll-container">
                            <Card>
                                <CardBody>
                                    <DataList data={booking} type="listbook" displayLength={9} {...props} />
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                ) : (
                    <div className="d-flex justify-content-center align-items-center h-100">
                        <h5 className="text-muted">No hay reservas</h5>
                    </div>
                )
                }
            </div>


        </React.Fragment>


    );
};

export default ListBooking; */