import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import Swal from 'sweetalert2';
import { infoAlert } from '../../../../helpers/alert';
import { OBTENER_RESERVAS, DELETE_RESERVA } from "../../../../services/ReservaService";
import { Container, Row, Card, CardHeader, FormGroup, Label, CardTitle, CardBody, Badge, Input, Button, Col, } from 'reactstrap';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../../../../components/Common/Breadcrumb';

const Booking = () => {
    document.title = "Disponibilidad | FARO";

    const { data: data_booking } = useQuery(OBTENER_RESERVAS, { pollInterval: 1000 });
    const [desactivar] = useMutation(DELETE_RESERVA);

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

    const onDelete = async (reserva) => {
        Swal.fire({
            title: "Cancelar reserva",
            text: `¿Está seguro de eliminar la reserva ${reserva.id}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#0BB197",
            cancelButtonColor: "#FF3D60",
            cancelButtonText: 'Cancelar',
            confirmButtonText: "Sí, ¡eliminar!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { data } = await desactivar({ variables: { id: reserva.id } });
                const { estado, message } = data.desactivarReserva;
                if (estado) {
                    infoAlert('Reserva eliminada', message, 'success', 3000, 'top-end')
                } else {
                    infoAlert('Eliminar reserva', message, 'error', 3000, 'top-end')
                }
            }
        });
    }

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
                    <Breadcrumbs title="Reservas" breadcrumbItem="Nueva Reserva" breadcrumbItemUrl="/reception/availability" />
                </Container>

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
                    <Row className='row-cols-2 m-0 mt-3 row-cols-sm-3 row-cols-md-5 d-flex justify-content-center flex-wrap'>
                        {filteredBooking.map(b => (
                            <Link to={`/reception/availability/editbooking/${b.id}`} style={{ textDecoration: 'none' }} className="card_home_link p-0 m-0" key={b.id}>
                                <Card className="card_booking p-0 mb-2 overflow-hidden">
                                    <CardHeader className={`d-flex justify-content-between text-primary-foreground ${b.estado === 'Cancelada' ? 'bg-danger' : 'bg-primary'}`}>
                                        <CardTitle className="text-lg">
                                            <span className="fs-5 m-0 ms-1 mb-2 span_color">Reservación:</span> {b.id.slice(0, 10)}...
                                        </CardTitle>
                                        {!(b.estado === 'Cancelada' || b.estado === 'Pagada' || b.estado === 'CheckOut' || b.estado === 'Finalizada') && (
                                            <div className="delete_icon" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(b); }}><i className='mdi mdi-delete'></i></div>
                                        )}
                                    </CardHeader>
                                    <CardBody className="pt-2">
                                        <div className="d-flex flex-column mb-2">
                                            <span className="font-semibold">{b.cliente.nombre.slice(0, 15)}...</span>
                                            <span className="text-sm text-gray-600">
                                                {b.cliente.ciudad}, {b.cliente.pais}
                                            </span>
                                        </div>
                                        <div className="d-flex justify-content-around">
                                            <Badge color={`${b.estado === 'Cancelada' ? 'danger' : 'primary'}`} className="mr-2 fs-6" variant={b.estado === 'Pendiente' ? 'outline' : 'default'}>
                                                {b.estado}
                                            </Badge>
                                            <Badge color={`${b.estado === 'Cancelada' ? 'danger' : 'primary'}`} className="fs-6 p-1 text-center">{b.tipo}</Badge>
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

            </div>
        </React.Fragment >
    )
}

export default Booking;