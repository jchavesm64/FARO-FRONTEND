import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { OBTENER_RESERVAS } from "../../../../services/ReservaService";
import { Container, Row, Card, CardHeader, FormGroup, Label, CardTitle, CardBody, Badge, Input, Button, Col, } from 'reactstrap';
import Breadcrumbs from '../../../../components/Common/Breadcrumb';
import { Link } from 'react-router-dom';
import { typesBooking } from "../../../../constants/routesConst";


const CheckIn = () => {
    document.title = "ChechIn | FARO";

    const { data: data_booking } = useQuery(OBTENER_RESERVAS, { pollInterval: 1000 });


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

            const allowedStates = ["Pendiente", "Pagada", "Incompleto", "Conflicto", "Activa"];
            if (!allowedStates.includes(b.estado)) {
                matches = false;
            }

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

    


    const estadoColores = {
        Cancelada: "danger",
        Pendiente: "warning",
        Pagada: "success",
        Conflicto: "dark",
        Incompleto: "secondary",
        Activa: "info",
        CheckIn: "primary",
        CheckOut: "purple-600",
        Finalizada: "teal-500",
    };

    return (
        <React.Fragment>
            <div className="page-content ">
                <Container fluid={true}>
                    <Breadcrumbs title="CheckIn" breadcrumbItem="Recepción" breadcrumbItemUrl="/reception" />
                </Container>

                {booking.length > 0 ? (
                    <Row >
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
                                                            <option value="Pendiente">Pendiente</option>
                                                            <option value="Pagada">Pagada</option>
                                                            <option value="Conflicto">Conflicto</option>
                                                            <option value="Incompleto">Incompleto</option>
                                                        </Input>
                                                    </FormGroup>
                                                </Col>
                                                <Col md={4}>
                                                    <FormGroup>
                                                        <Label for="estado">Tipo</Label>
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
                            <Row className='row-cols-2 m-0 mt-3 row-cols-sm-3 row-cols-md-5 d-flex justify-content-center flex-wrap'>
                                {filteredBooking.map(b => (
                                    <Link to={`/reception/checkin/${b.id}`} style={{ textDecoration: 'none' }} className="card_home_link p-0 m-0" key={b.id}>
                                        <Card className="card_booking p-0 mb-2 overflow-hidden">
                                            <CardHeader className={`d-flex justify-content-between text-primary-foreground bg-${estadoColores[b.estado] || 'bg-primary'}`}>
                                                <CardTitle className="text-lg">
                                                    <span className="fs-5 m-0 ms-1 mb-2 span_color">Reservación:</span> {b.id.slice(0, 10)}...
                                                </CardTitle>

                                            </CardHeader>
                                            <CardBody className="pt-2">
                                                <div className="d-flex flex-column mb-2">
                                                    <span className="font-semibold">{b.cliente.nombre.slice(0, 15)}...</span>
                                                    <span className="text-sm text-gray-600">
                                                        {b.cliente.ciudad}, {b.cliente.pais}
                                                    </span>
                                                </div>
                                                <div className="d-flex justify-content-around">
                                                    <Badge color={`${estadoColores[b.estado] || 'bg-primary'}`} className="mr-2 fs-6" variant={b.estado === 'Pendiente' ? 'outline' : 'default'}>
                                                        {b.estado}
                                                    </Badge>
                                                    <Badge color={`${estadoColores[b.estado] || 'bg-primary'}`} className="fs-6 p-1 text-center">{typesBooking.find(item => item.value === b.tipo).label}</Badge>
                                                </div>

                                                <div className="m-0 mt-1 text-sm">
                                                    <span>Adults: {b.numeroPersonas.adulto}</span>
                                                    <strong> &nbsp; </strong>
                                                    <span>Children: {b.numeroPersonas.ninos}</span>
                                                </div>
                                                <div className="m-0 text-sm">
                                                    <span>Servicios: {b.serviciosGrupal.length}</span>
                                                    <strong> &nbsp; </strong>
                                                    <span>Paquetes: {b.paquetes.length}</span>
                                                </div>
                                                <p className="mt-1 mb-3 text-sm">
                                                    Fecha reserva: {new Date(Number(b.fechaReserva)).toLocaleDateString()}
                                                </p>
                                            </CardBody>
                                        </Card>
                                    </Link>
                                ))}
                            </Row>
                        </div>
                    </Row>
                ) : (
                    <div className="d-flex justify-content-center align-items-center h-100">
                        <h5 className="text-muted">No hay reservas</h5>
                    </div>
                )}

            </div>
        </React.Fragment>

    )
};

export default CheckIn;