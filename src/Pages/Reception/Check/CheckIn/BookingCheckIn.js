import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { infoAlert } from '../../../../helpers/alert';
import { OBTENER_RESERVA, CHECKIN_RESERVA } from "../../../../services/ReservaService";
import { OBTENER_CLIENTES } from '../../../../services/ClienteService';
import { OBTENER_RESERVAHABITACION } from '../../../../services/ReservaHabitacionService';
import { Container, Row, Col, Button, Badge, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Card, CardBody } from 'reactstrap';
import Breadcrumbs from '../../../../components/Common/Breadcrumb';
import ButtonIconTable from "../../../../components/Common/ButtonIconTable";
import NewCustomer from '../../../Customers/NewCustomer'

const BookingCheckIn = () => {
    document.title = "CheckIn | FARO";

    const { id } = useParams(); // Obtener el ID de la reserva desde los parámetros de la URL
    const { data: dataCustomer } = useQuery(OBTENER_CLIENTES, { pollInterval: 1000 });
    const { data: data_booking, loading: loading_booking, error: error_booking } = useQuery(OBTENER_RESERVA, { variables: { id } });
    const { data: bookingRoom, loading: loading_room, error: error_room } = useQuery(OBTENER_RESERVAHABITACION, { variables: { id: data_booking?.obtenerReserva.id }, skip: !id, pollInterval: 1000 });

    const [checkInReservaHabitacion] = useMutation(CHECKIN_RESERVA);

    const [filter, setFilter] = useState('')
    const [booking, setBooking] = useState(null);
    const [modal, setModal] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [huespedes, setHuespedes] = useState([{ nombre: '', documento: '' }]);
    const [useBookingClient, setUseBookingClient] = useState(false);
    const [customer, setCustomer] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [stateBooking, setStateBooking] = useState(false);
    const [editCustomer, setEditCustomer] = useState(false);

    useEffect(() => {
        if (data_booking) {
            setBooking(data_booking.obtenerReserva);
        }
    }, [data_booking]);

    const toggleModal = (room = null) => {
        setSelectedRoom(room);
        setModal(!modal);
    };

    const handleCheckIn = async () => {
        if (!selectedRoom) return;

        Swal.fire({
            title: "Realizar Check-In",
            text: `¿Está seguro de realizar el check-in para la habitación ${selectedRoom.habitacion.numeroHabitacion}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#0BB197",
            cancelButtonColor: "#FF3D60",
            cancelButtonText: 'Cancelar',
            confirmButtonText: "Sí, ¡realizar check-in!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { data } = await checkInReservaHabitacion({ variables: { id: selectedRoom.id, huespedes } });
                const { estado, message } = data.checkInReservaHabitacion;
                if (estado) {
                    infoAlert('Check-In realizado', message, 'success', 3000, 'top-end');
                } else {
                    infoAlert('Error en Check-In', message, 'error', 3000, 'top-end');
                }
                toggleModal();
            }
        });
    };

    const handleHuespedChange = (index, event) => {
        const { name, value } = event.target;
        const newHuespedes = [...huespedes];
        newHuespedes[index][name] = value;
        setHuespedes(newHuespedes);
    };

    const addHuesped = () => {
        setHuespedes([...huespedes, { nombre: '', documento: '' }]);
    };

    const removeHuesped = (index) => {
        const newHuespedes = huespedes.filter((_, i) => i !== index);
        setHuespedes(newHuespedes);
    };

    const handleUseBookingClientChange = () => {
        setUseBookingClient(!useBookingClient);
        if (!useBookingClient && booking) {
            setHuespedes([{ ...booking.cliente }, ...huespedes]);
        } else {
            setHuespedes(huespedes.filter(h => h.id !== booking.cliente.id));
        }
    };

    const toggle = () => { setModal(!modal); setEditCustomer(false) };

    const getFilteredByKey = (key, value) => {
        const valName = key.nombre.toLowerCase()
        const valCode = key.codigo.toLowerCase()
        const val = value.toLowerCase()

        if (valName.includes(val) || valCode.includes(val)) {
            return key
        }
        setStateBooking(true);
        setCustomer(null)
        return null
    }

    const getDataCustomer = () => {
        if (dataCustomer) {
            if (dataCustomer.obtenerClientes) {
                return dataCustomer.obtenerClientes.filter((value) => {
                    if (filter !== "") {
                        return getFilteredByKey(value, filter);
                    }
                    return value
                });
            }

        }
        return []
    }

    const handleCustomer = (c) => {
        setCustomer(c)
        setFilter('')
        setCustomers([])
    };

    const handleInputChange = (e) => {
        if (e.target.value !== '') {
            setFilter(e.target.value);
            setCustomers(getDataCustomer());
            return
        } else {
            setFilter('');
            setCustomers([]);
            setStateBooking(false)
        }

    }

    const addNewCustomer = (data) => {
        setCustomer(data);
        setFilter('');
        toggle();
    };


    if (loading_booking || loading_room) return <p>Cargando...</p>;
    if (error_booking || error_room) return <p>Error al cargar la reserva</p>;

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="CheckIn" breadcrumbItem="Recepción" breadcrumbItemUrl="/reception" />
                </Container>

                {booking && (
                    <Row className="mb-4">
                        <Col md={12}>
                            <div className="booking-details">
                                <h2 className="booking-title">Detalles de la Reservación</h2>
                                <div className="booking-info">
                                    <div className="info-item">
                                        <strong>Reservación ID:</strong> {booking.id}
                                    </div>
                                    <div className="info-item">
                                        <strong>Cliente:</strong> {booking.cliente.nombre}
                                    </div>

                                    <div className="info-item">
                                        <strong>Estado:</strong> <Badge color={booking.estado === 'Cancelada' ? 'danger' : 'primary'}>{booking.estado}</Badge>
                                    </div>
                                    <div className="info-item">
                                        <strong>Tipo:</strong> <Badge color="primary">{booking.tipo}</Badge>
                                    </div>
                                    <div className="info-item">
                                        <strong>Niños:</strong> {booking.numeroPersonas.ninos}
                                    </div>
                                    <div className="info-item">
                                        <strong>Adultos:</strong> {booking.numeroPersonas.adulto}
                                    </div>
                                    <div className="info-item">
                                        <strong>Ciudad:</strong> {booking.cliente.ciudad}, {booking.cliente.pais}
                                    </div>

                                    <div className="info-item">
                                        <strong>Fecha de Reserva:</strong> {new Date(Number(booking.fechaReserva)).toLocaleDateString()}
                                    </div>
                                    <div className="info-item">
                                        <h3>Total: ${booking.total}</h3>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                )}

                {bookingRoom && bookingRoom.obtenerReservaHabitacion && bookingRoom.obtenerReservaHabitacion.length > 0 && (
                    <Row className="mb-4">
                        <Col md={12}>
                            <div className="room-details">
                                <h2 className="room-title">Detalles de la Habitación</h2>
                                {bookingRoom.obtenerReservaHabitacion.map((habitacion, index) => (
                                    <div key={habitacion.id} className="room-info">
                                        <h5>Habitación {index + 1}</h5>
                                        <div className="info-item">
                                            <strong>Número de Habitación:</strong> {habitacion.habitacion.numeroHabitacion}
                                        </div>
                                        <div className="info-item">
                                            <strong>Tipo de Habitación:</strong> {habitacion.habitacion.tipoHabitacion.nombre}
                                        </div>
                                        <div className="info-item">
                                            <strong>Precio por Noche:</strong> ${habitacion.habitacion.precioPorNoche}
                                        </div>
                                        <div className="info-item">
                                            <strong>Fecha de Entrada:</strong> {new Date(Number(habitacion.fechaEntrada)).toLocaleDateString()}
                                        </div>
                                        <div className="info-item">
                                            <strong>Fecha de Salida:</strong> {new Date(Number(habitacion.fechaSalida)).toLocaleDateString()}
                                        </div>
                                        <div className="info-item">
                                            <strong>Comodidades:</strong> {habitacion.habitacion.comodidades.map(c => c.nombre).join(', ')}
                                        </div>
                                        <div className="info-item">
                                            <strong>Servicios Extra:</strong> {habitacion.serviciosExtra.map(s => s.nombre).join(', ')}
                                        </div>
                                        <Button color="success" onClick={() => toggleModal(habitacion)}>Check-In</Button>
                                    </div>
                                ))}
                            </div>
                        </Col>
                    </Row>
                )}

                <Modal classname='' isOpen={modal} toggle={() => toggleModal(null)} size='lg' >
                    <ModalHeader toggle={() => toggleModal(null)}>Agregar Huéspedes</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <div className="form-check ms-3 mt-4">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="isSameAsCustomer"
                                    readOnly
                                    checked={useBookingClient}
                                    onClick={() => { handleUseBookingClientChange() }}
                                />
                                <label htmlFor="isSameAsCustomer" className="form-check-label ms-2">Nombre de quien reserva</label>
                            </div>
                        </FormGroup>
                        {huespedes.map((huesped, index) => (
                            <Row key={index} form>
                                <Row className='d-flex justify-content-between p-3 pb-0'>
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
                        <Row className='col-md-12 d-flex align-items-center flex-wrap ps-4'>
                            {customers?.length > 0 ? (
                                <ul className="list-group form-control ontent-scroll p-3 mb-3 border rounded-3" style={{ zIndex: 1000, maxHeight: '300px', overflowY: 'auto' }}>
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
                                <Row className='d-flex justify-content-between  p-3'>
                                    <label>No existe el cliente, ¿Desea agregar uno?</label>
                                    <Card className='col-xl-12 col-md-12 p-0'>
                                        <CardBody className="p-0">
                                            <NewCustomer props={{ addNewCustomer, stateBooking }} />
                                        </CardBody>
                                    </Card>
                                </Row>
                            )}
                        </Row>
                                <Col md={5}>
                                    <FormGroup>
                                        <Label for={`nombre-${index}`}>Nombre: {huesped.nombre}</Label>
                                       </FormGroup>
                                </Col>
                                <Col md={5}>
                                    <FormGroup>
                                        <Label for={`documento-${index}`}>Cédula: {huesped.codigo}</Label>
                                     </FormGroup>
                                </Col>
                                <Col md={2} className="d-flex align-items-center">
                                   <ButtonIconTable icon='mdi mdi-delete' color='danger' onClick={() => { removeHuesped(index) }} />
                                </Col>
                            </Row>
                        ))}
                        <Button color="primary" onClick={addHuesped}>Agregar Huésped</Button>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={() => toggleModal(null)}>Cancelar</Button>
                        <Button color="success" onClick={handleCheckIn}>Realizar Check-In</Button>
                    </ModalFooter>
                </Modal>
            </div>
        </React.Fragment>
    );
};

export default BookingCheckIn;