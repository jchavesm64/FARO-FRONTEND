import React, { useEffect, useState } from 'react'
import { Button, Card, CardBody, Container, InputGroup, Row, Input } from 'reactstrap';
import Breadcrumbs from '../../../components/Common/Breadcrumb';
import { useMutation, useQuery } from '@apollo/client';
import { OBTENER_CLIENTES } from '../../../services/ClienteService';
import { OBTENER_HABITACIONES_DISPONIBLES } from '../../../services/HabitacionesService';
import { OBTENER_TIPOSHABITACION } from '../../../services/TipoHabitacionService';
import { OBTENER_SERVICIO } from '../../../services/ServiciosExtraService';
import Select from "react-select";
import ListInfo from '../../../components/Common/ListInfo';
import { infoAlert } from '../../../helpers/alert';
import SpanSubtitleForm from '../../../components/Forms/SpanSubtitleForm';
import NewCustomer from '../../Customers/NewCustomer';
import { SAVE_RESERVA } from '../../../services/ReservaService';

const NewBooking = ({ ...props }) => {
    document.title = "Nueva Reserva | FARO";

    const [filter, setFilter] = useState('')
    const { data: dataCustomer } = useQuery(OBTENER_CLIENTES, { pollInterval: 1000 });
    const { data: dataRoomsAvailable } = useQuery(OBTENER_HABITACIONES_DISPONIBLES, { pollInterval: 1000 });
    const { data: dataTypeRooms } = useQuery(OBTENER_TIPOSHABITACION, { pollInterval: 1000 });
    const { data: services } = useQuery(OBTENER_SERVICIO, { pollInterval: 1000 });

    const [insertar] = useMutation(SAVE_RESERVA);

    const [customer, setCustomer] = useState(null)
    const [customers, setCustomers] = useState([])
    const [bookingDate] = useState(`${new Date().getFullYear()}-${(new Date().getMonth() + 1) > 10 ? (new Date().getMonth() + 1) : '0' + (new Date().getMonth() + 1)}-${new Date().getDate() > 10 ? new Date().getDate() : '0' + new Date().getDate()}`);
    const [amountPeople, setAmountPeople] = useState(0);

    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');

    const [stateBooking, setStateBooking] = useState(false);

    const [disableSave, setDisableSave] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [serviceBookingCheck, setServiceBookingCheck] = useState(false);
    const [serviceRoomCheck, setServiceRoomCheck] = useState(false);

    const [roomsAvailable, setRoomsAvailable] = useState(null);//Habitaciones disponibles
    const [typeRooms, setTypeRooms] = useState([]);//Tipo de habitaciones
    const [amountTypeRooms, setAmountTypeRooms] = useState([]);//Cantidad de habitaciones por tipo 
    const [roomsBooking, setRoomsBooking] = useState([]);//Habitaciones seleccionadas por reserva, esta lista es temporal para para crear la reserva habitación
    const [ServicesBooking, setServicesBooking] = useState([]);//Servicio selecionado para agregar a la reserva en general
    const [ServicesRoom, setServicesRoom] = useState([]);//Servicio selecionado para agregar a la habitación
    const [extraService, setExtraService] = useState([]);//Lista de servicios selecionados para la reserva en general
    const [selectRoom, setSelectRoom] = useState(null);//Habitación seleccionada para agragar servicios extra a la habitación 
    const [extraServiceRoom, setExtraServiceRoom] = useState([]);//Servicios seleccionados para la habitación seleccionada
    const [servicesPerRoom, setServicePerRoom] = useState([]);//lista de servicios por habitación
    const [totalBooking, setTotalBooking] = useState([]);

    const [total, setTotal] = useState(0);


    useEffect(() => {
        const getRoomsAvailable = () => {
            if (dataRoomsAvailable) {
                if (dataRoomsAvailable.obtenerHabitacionesDisponibles) {
                    return dataRoomsAvailable.obtenerHabitacionesDisponibles;
                }
            }
            return [];
        };

        const getTypeRooms = () => {
            if (dataTypeRooms) {
                if (dataTypeRooms.obtenerTiposHabitaciones) {
                    return dataTypeRooms.obtenerTiposHabitaciones;
                }
            }
            return [];
        };

        const getAmountTypeRooms = () => {
            if (typeRooms) {
                let data = []
                typeRooms.forEach(type => {
                    if (type) {
                        if (roomsAvailable) {
                            const RoomAvailable = roomsAvailable.filter(habitacion => habitacion.tipoHabitacion.nombre === type.nombre);
                            data.push({ 'lengthAvailable': RoomAvailable.length, 'type': type, 'amountBooking': 0, 'rooms': RoomAvailable });
                        }
                    }
                })
                return data;
            }
        };
        setRoomsAvailable(getRoomsAvailable());
        setTypeRooms(getTypeRooms());
        setAmountTypeRooms(getAmountTypeRooms())

    }, [dataRoomsAvailable, dataTypeRooms, roomsAvailable, typeRooms]);


    function getFilteredByKey(key, value) {
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

    const selectClient = (c) => {
        setCustomer(c)
        setFilter('')
        setCustomers([])
    }

    const handleIncrease = (e, index) => {
        if (amountTypeRooms[index].amountBooking < amountTypeRooms[index].lengthAvailable) {
            const updatedRooms = [...amountTypeRooms];
            updatedRooms[index].amountBooking += 1;
            const newExtractedRooms = [...roomsBooking, updatedRooms[index].rooms.shift()];
            setAmountTypeRooms(updatedRooms);
            setRoomsBooking(newExtractedRooms);

            const i = totalBooking.findIndex(t => t.typeName === amountTypeRooms[index].type.nombre);
            if (i !== -1) {
                setTotalBooking((prev) => {
                    const updatedTotal = [...prev];
                    updatedTotal[i] = {
                        ...updatedTotal[i],
                        price: amountTypeRooms[index].amountBooking * amountTypeRooms[index].type.precioBase
                    };
                    return updatedTotal;
                });
            } else {
                setTotalBooking([...totalBooking, { 'typeName': amountTypeRooms[index].type.nombre, 'price': amountTypeRooms[index].amountBooking * amountTypeRooms[index].type.precioBase }]);
            }

        }
    };

    const handleDecrease = (e, index) => {
        if (amountTypeRooms[index].amountBooking > 0) {
            const updatedRooms = [...amountTypeRooms];
            const updatedRoomsBooking = [...roomsBooking];
            updatedRooms[index].amountBooking -= 1;

            if (updatedRoomsBooking.length > 0) {
                const roomToReturn = updatedRoomsBooking.pop();
                updatedRooms[index].rooms.push(roomToReturn);
            }

            setAmountTypeRooms(updatedRooms);
            setRoomsBooking(updatedRoomsBooking);

            const i = totalBooking.findIndex(t => t.typeName === amountTypeRooms[index].type.nombre);
            if (i !== -1) {
                setTotalBooking((prev) => {
                    const updatedTotal = [...prev];
                    updatedTotal[i] = {
                        ...updatedTotal[i],
                        price: amountTypeRooms[index].amountBooking * amountTypeRooms[index].type.precioBase
                    };
                    return updatedTotal;
                });
            } else {

                setTotalBooking([...totalBooking, { 'typeName': amountTypeRooms[index].type.nombre, 'price': amountTypeRooms[index].amountBooking * amountTypeRooms[index].type.precioBase }]);
            }
        }
    };

    const handleChange = (e, index) => {
        const { value } = e.target;
        if (!isNaN(value) && value !== '') {
            const updatedRooms = [...amountTypeRooms];
            updatedRooms[index].amountBooking = parseInt(value, 10);
            setAmountTypeRooms(updatedRooms);
        }
    };

    const handleBlur = (e, index) => {
        const { value } = e.target;
        const updatedRooms = [...amountTypeRooms];

        if (value === '' || parseInt(value, 10) < 1) {
            updatedRooms[index].amountBooking = 1;
            setAmountTypeRooms(updatedRooms);
        }
    };

    const totalPerRoom = (type) => {
        const total = type.amountBooking * type.type.precioBase;

        return total
    }

    const handleChangeServiceBooking = () => {
        setServiceBookingCheck(!serviceBookingCheck);
        setExtraService([])
    };

    const handleChangeServiceRoom = () => {
        setServiceRoomCheck(!serviceRoomCheck);
        setExtraServiceRoom([])
        setServicePerRoom([])
        setSelectRoom(null)
    };

    const handleService = (a, type) => {
        if (type === 'general') setServicesBooking(a);
        if (type === 'room') setServicesRoom(a);
    }

    const getServices = () => {
        const data = []
        if (services?.obtenerServicios) {
            services?.obtenerServicios.forEach((item) => {
                data.push({
                    "value": item,
                    "label": item.nombre
                });
            });
        }
        return data;
    }

    const getServicesPerRoom = () => {
        const extra = extraService.map(item => item.id);
        const data = getServices().filter(item => !extra.includes(item.value.id));

        return data;
    }

    const addExtraService = (s, extra, type) => {

        if (s.length === 0) {
            infoAlert('Oops', 'No ha seleccionado un servicio', 'error', 3000, 'top-end');
            return;
        }

        const exist = extra.find(e => e.id === s.value.id);
        if (exist) {
            infoAlert('Oops', 'Ya existe este servicio para esta reservación', 'warning', 3000, 'top-end');
            if (type === 'general') setServicesBooking(null);
            if (type === 'room') setServicesRoom(null);
            return;
        }

        const updatedService = [...extra, s.value];
        if (type === 'general') {
            setExtraService(updatedService);
            setServicesBooking(null);
        } else if (type === 'room') {
            setExtraServiceRoom(updatedService);
            setServicesRoom(null);
        }

        setTotalBooking([...totalBooking, { 'typeName': s.label, 'price': s.value.precio }]);
    };

    const eliminarServiceBooking = (nombre) => {
        setExtraService(extraService.filter(a => a.nombre !== nombre))

    }

    const eliminarServiceRoom = (nombre) => {
        setExtraServiceRoom(extraServiceRoom.filter(a => a.nombre !== nombre));

    }

    const handleRoomSelect = (room) => {
        setSelectRoom(room);
        if (servicesPerRoom.length) {
            const dataService = servicesPerRoom.find(s => s.room.numeroHabitacion === room.numeroHabitacion);
            if (dataService) {
                setExtraServiceRoom([...extraServiceRoom, dataService.service]);
            }
        }
    };

    const options = typeRooms.map((type) => ({
        label: type.nombre,
        options: roomsBooking.filter(roomB => roomB.tipoHabitacion.id === type.id).map((room) => ({
            label: room.numeroHabitacion,
            value: room,
        })),
    }));

    const addExtraServicePerRoom = () => {
        setServicePerRoom((prev) => {
            const index = prev.findIndex(r => r.room.numeroHabitacion === selectRoom.numeroHabitacion);

            if (index !== -1) {
                return prev.map((item, i) =>
                    i === index
                        ? { ...item, service: extraServiceRoom }
                        : item
                );
            } else {
                return [...prev, { room: selectRoom, service: extraServiceRoom }];
            }
        });

        // Limpia los estados
        setSelectRoom(null);
        setExtraServiceRoom([]);
    };

    const addNewCustomer = (data) => {
        setCustomer(data);
        setFilter('');
    }

    useEffect(() => {
        setTotal(totalBooking.reduce((sum, item) => sum + item.price, 0))
    }, [totalBooking])

    useEffect(() => {
        setDisableSave(customer === '' || bookingDate === '' || total <= 0 || amountPeople <= 0 || (servicesPerRoom.length === 0 && roomsBooking === 0) || checkIn === '' || checkOut === '')
    }, [customer, bookingDate, amountPeople, total, extraService, servicesPerRoom, roomsBooking, checkIn, checkOut])

    const restartData = () => {
        setCustomer(null);
        setAmountPeople(0);
        setTotal(0);
        setExtraService([]);
        setServicePerRoom([]);
        setRoomsBooking([]);
        setCheckIn('');
        setCheckOut('');


    }

    const onClickSave = async () => {
        try {
            setDisableSave(true);
            const input = {
                cliente: customer ? customer.id : null,
                fechaReserva: bookingDate,
                numeroPersonas: amountPeople,
                total: total,
                serviciosGrupal: extraService.length > 0 ? extraService.map(service => service.id) : null,
                estado: 'Pendiente'
            }

            const bookingRoom = {
                habitaciones: servicesPerRoom.length > 0 ?
                    servicesPerRoom.map(item => ({ roomId: item.room.id, serviceIds: item.service.map(service => service.id) })) :
                    roomsBooking.map(item => ({ roomId: item.id, serviceIds: null })),
                fechaEntrada: checkIn,
                fechaSalida: checkOut
            }

            const { data } = await insertar({ variables: { input, bookingRoom }, errorPolicy: 'all' });
            const { estado, message } = data.insertarReserva;
            if (estado) {
                infoAlert('Excelente', message, 'success', 3000, 'top-end');
                restartData();
            } else {
                infoAlert('Oops', message, 'error', 3000, 'top-end');
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Nueva Reserva" breadcrumbItem="Reservas" breadcrumbItemUrl='/reception/availability' />

                    <Row className="flex" style={{ alignItems: 'flex-end' }}>
                        <div className="col-md-12 mb-1">
                            <SpanSubtitleForm>
                                Busca el cliente
                            </SpanSubtitleForm>
                            <input
                                className="form-control"
                                id="search-input"
                                value={filter}
                                onChange={handleInputChange}
                                type="search"
                                placeholder="Escribe el nombre o identificación del cliente" />
                        </div>


                    </Row>
                    <Row>
                        {customers.length > 0 ? (
                            <ul className="list-group form-control ontent-scroll p-3 mb-3 border" style={{ zIndex: 1000, maxHeight: '300px', overflowY: 'auto' }}>
                                {customers.map((customer, index) => (
                                    <li
                                        key={customer.id}
                                        onClick={() => selectClient(customer)}
                                        className='ist-group-item list-group-item-action rounded p-2'
                                        style={{
                                            backgroundColor: hoveredIndex === index ? '#0BB197' : '#fff',
                                            listStyleType: 'none',
                                            cursor: 'pointer',
                                        }}
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
                                <Card className='col-xl-12 col-md-12'>
                                    <CardBody>
                                        <NewCustomer props={{ addNewCustomer, stateBooking }} />
                                    </CardBody>
                                </Card>
                            </div>
                        )}
                    </Row>
                    {customer ? (
                        <div className='mt-1'>
                            <Row className="m-2 col-md-7 d-flex flex-row flex-nowrap">
                                <Card className="m-1 p-3 col-md-10">
                                    <CardBody className="text-muted d-flex flex-column justify-content-center">
                                        <h2 className="mb-2">{customer.nombre}</h2>
                                        <p className="mb-2 fw-bold fs-5">Identificación: <span className='fw-normal'>{customer.codigo}</span></p>
                                        <p className="mb-2 fw-bold fs-5">País: <span className='fw-normal'>{customer.pais}</span></p>
                                        <p className="mb-2 fw-bold fs-5">Fecha de reserva: <span className='fw-normal'>{bookingDate}</span></p>
                                    </CardBody>
                                    <div>
                                        tipo de reserva
                                    </div>
                                </Card>
                                <Card className="m-1 p-2 col-md-10">
                                    <div className="p-1 col-md-8">
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
                                    <div className="p-1 col-md-8">
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
                                    <div className="p-1 col-md-8">
                                        <label htmlFor="checkOutDate" className="form-label fs-5">Cantidad de personas</label>
                                        <input
                                            className="form-control"
                                            type="number"
                                            id="checkOutDate"
                                            value={amountPeople}
                                            onChange={(e) => { setAmountPeople(e.target.value) }}
                                            min='0'
                                        />
                                    </div>
                                </Card>
                            </Row>
                            <Card className="m-2 p-2 d-flex flex-row justify-content-center">
                                <div className='col-md-7 d-flex flex-column align-items-center'>
                                    <Row className="m-2">
                                        <h3 className="col mb-2">
                                            Tipo de Habitaciones
                                        </h3>
                                    </Row>
                                    {amountTypeRooms.map((type, index) => (
                                        <Card key={`${type.type.nombre}-type`} className="m-2 p-1 bg-light col-md-12">
                                            <CardBody className="p-2">
                                                <Row className="d-flex align-items-center" >
                                                    <div className="col-md-2 mb-3">
                                                        <span className="logo-lg">
                                                            <img src="/static/media/faro-light.f23d16523144109283f2.png" alt="logo-light" height="24" />
                                                        </span>
                                                    </div>
                                                    <div className="col-md-7 col-sm-12 ">
                                                        <p>Typo Habitación: <span>{type.type.nombre}</span></p>
                                                        <p>Precion por noche: $<span>{type.type.precioBase}</span></p>
                                                        <p>Decripción: <span>{type.type.descripcion}</span></p>
                                                    </div>

                                                    <div className="col-md-3 col-sm-12 d-flex flex-column align-items-center justify-content-end"  >
                                                        <InputGroup style={{ maxWidth: '7rem' }}>
                                                            <Button color="primary" onClick={(e) => handleDecrease(e, index)} disabled={type.amountBooking === 0}>
                                                                -
                                                            </Button>
                                                            <Input
                                                                type="text"
                                                                value={type.amountBooking}
                                                                onChange={(e) => handleChange(e, index)}
                                                                onBlur={(e) => handleBlur(e, index)}
                                                                className="text-center"
                                                            />
                                                            <Button color="primary" onClick={(e) => handleIncrease(e, index)} disabled={type.amountBooking === type.lengthAvailable}>
                                                                +
                                                            </Button>
                                                        </InputGroup>
                                                        <p>Disponibles: {type.lengthAvailable - type.amountBooking}</p>
                                                    </div>

                                                </Row>

                                            </CardBody>
                                        </Card>
                                    ))}
                                </div>
                                <Card className='col-md-4 bg-light m-2 p-2 '>
                                    <div className="col-md-12">
                                        <h3 key='summary' className="text-center mb-4 mt-4">Resumen</h3>
                                        <Card className="col-md-12 bg-tertiary rounded p-3" style={{ height: '300px', overflowY: 'auto' }}>

                                            {roomsBooking.length ? (
                                                <div>
                                                    <div >
                                                        <label>Habitaciones</label>
                                                        <div className='border border-secondary rounded p-1'>
                                                            {amountTypeRooms.map((type) => (
                                                                <div key={`row${type.type.nombre}`} className="bg-secondary col-md-11 m-3 mb-0 mt-0">
                                                                    {type.amountBooking !== 0 && (
                                                                        <div key={`data${type.type.nombre}`} className="text-light d-flex justify-content-between">
                                                                            <p className="p-1 m-0 text-nowrap">{type.type.nombre}</p>
                                                                            <div className="col-md-4 d-flex justify-content-between p-1">
                                                                                <p className="m-0">X{type.amountBooking}</p>
                                                                                <p className="m-0 w-1 h-1 text-end ">${totalPerRoom(type)}</p>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        {extraService.length > 0 && (
                                                            <div className='mt-2'>
                                                                <label>Servicios adicionales por reserva</label>
                                                                <div className='border border-secondary rounded p-1'>
                                                                    <div className="bg-secondary col-md-11 m-3">
                                                                        {extraService.map(s => (
                                                                            <div key={s.nombre} className="m-0 text-light d-flex justify-content-between p-1">
                                                                                <p className="m-0 text-nowrap">{s.nombre}</p>
                                                                                <p className="m-0 text-end">${s.precio}</p>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        {servicesPerRoom.length > 0 && (
                                                            <div className='mt-2'>
                                                                <label>Servicios adicionales por habitación</label>
                                                                {servicesPerRoom.map(r => (
                                                                    <div className='border border-secondary rounded mb-1'>
                                                                        <label className='m-1'>{r.room.numeroHabitacion}</label>
                                                                        <div className="bg-secondary col-md-11 m-3">
                                                                            {r.service.map(s => (
                                                                                <div key={`room${s.nombre}`} className="m-0 text-light d-flex justify-content-between p-1">
                                                                                    <p className="m-0 text-nowrap">{s.nombre}</p>
                                                                                    <p className="m-0 text-end">${s.precio}</p>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className='d-flex justify-content-center align-items-center' style={{ height: '100vh' }}>
                                                    <label>Sin datos que mostrar</label>
                                                </div>
                                            )}
                                        </Card>

                                    </div>
                                    <Card key='total' className='col-md-12 d-flex align-items-center'>
                                        <div className='col-md-11 d-flex justify-content-between p-1'>
                                            <div className="p-3">
                                                <p className=" text-uppercase fs-1 fw-bold">Total:</p>
                                            </div>

                                            <div className="p-3">
                                                <p className=" text-uppercase fs-1 fw-bold">$ {total}</p>
                                            </div>

                                        </div>
                                    </Card>
                                </Card>
                            </Card>
                            <Card className="m-2 p-2 ">
                                <div className='col-md-12 d-flex flex-column align-items-center'>
                                    <Row className="m-2">
                                        <h3 className="col mb-2">
                                            Servicios Adicionales
                                        </h3>
                                    </Row>
                                    {roomsBooking.length ? (
                                        <Row className="m-2 p-2 d-flex flex-row col-md-7 col-xl-7 justify-content-center">
                                            <div className="form-check ms-3 mt-2 col-md-4">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="isServiceBooking"
                                                    value='serviceBooking'
                                                    readOnly
                                                    checked={serviceBookingCheck}
                                                    onClick={handleChangeServiceBooking}
                                                />
                                                <label htmlFor="isServiceBooking" className="form-check-label ms-2">Servicios por reserva</label>
                                            </div>
                                            <div className="form-check ms-3 mt-2 col-md-4">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="isServiceRoom"
                                                    value='serviceRoom'
                                                    readOnly
                                                    checked={serviceRoomCheck}
                                                    onClick={handleChangeServiceRoom}
                                                />
                                                <label htmlFor="isServiceRoom" className="form-check-label ms-2">Servicios por Habitacion</label>
                                            </div>
                                        </Row>
                                    ) : (<label>Debe selecionar almenos una habitación</label>)}
                                </div>
                                <div className='col-md-12 d-flex flex-row  justify-content-center'>
                                    {serviceBookingCheck && (
                                        <Card className='col-md-5 bg-light m-2 p-2 '>
                                            <div className="col-md-12">
                                                <h3 key='summary' className="text-center mb-4 mt-4">Servicios adicionales por reserva</h3>
                                            </div>

                                            <div className="col-md-12 col-sm-12">
                                                <Card className="p-2">
                                                    <CardBody>
                                                        <div className="row row-cols-lg-auto g-3 align-items-center">
                                                            <div className="col-xl-9 col-md-12 mb-2">
                                                                <Select
                                                                    value={ServicesBooking}
                                                                    onChange={(e) => {
                                                                        handleService(e, 'general');
                                                                    }}
                                                                    options={getServices()}
                                                                    placeholder="Servicios"
                                                                    classNamePrefix="select2-selection"
                                                                />
                                                            </div>
                                                            <div className="col-12 mb-1">
                                                                <button type="submit" className="btn btn-outline-primary" onClick={() => { addExtraService(ServicesBooking, extraService, 'general') }}>
                                                                    Agregar
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <Row>
                                                            <ListInfo data={extraService} headers={['Servicio ', 'Precio']} keys={['nombre', 'precio']} enableEdit={false} enableDelete={true} actionDelete={eliminarServiceBooking} mainKey={'nombre'} secondKey={'precio'} />
                                                        </Row>
                                                    </CardBody>
                                                </Card>
                                            </div>
                                        </Card>
                                    )}
                                    {serviceRoomCheck && (
                                        <Card className='col-md-5 bg-light m-2 p-2 '>
                                            <div className="col-md-12">
                                                <h3 key='summary' className="text-center mb-4 mt-4">Servicios adicionales por habitación</h3>
                                            </div>

                                            {roomsBooking.length ? (<div className="col-md-12 col-sm-12">
                                                {selectRoom ? (
                                                    <Card className="p-2">
                                                        <CardBody>
                                                            <div className="row row-cols-lg-auto g-3 align-items-center">
                                                                <div className="col-xl-9 col-md-12 mb-2">
                                                                    <Select
                                                                        value={ServicesRoom}
                                                                        onChange={(e) => {
                                                                            handleService(e, 'room');
                                                                        }}
                                                                        options={getServicesPerRoom()}
                                                                        placeholder={`Servicios para la habitación ${selectRoom.numeroHabitacion}`}
                                                                        classNamePrefix="select2-selection"
                                                                    />
                                                                </div>
                                                                <div className="col-12 mb-1">
                                                                    <button type="submit" className="btn btn-outline-primary" onClick={() => { addExtraService(ServicesRoom, extraServiceRoom, 'room') }}>
                                                                        Agregar
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <Row>
                                                                <ListInfo data={extraServiceRoom} headers={['Servicio ', 'Precio']} keys={['nombre', 'precio']} enableEdit={false} enableDelete={true} actionDelete={eliminarServiceRoom} mainKey={'nombre'} secondKey={'precio'} />
                                                            </Row>
                                                            <div className="col-12 mt-2">
                                                                <button type="submit" className="btn btn-outline-primary" onClick={() => { addExtraServicePerRoom() }}>
                                                                    Guardar
                                                                </button>
                                                            </div>
                                                        </CardBody>
                                                    </Card>
                                                ) : (
                                                    <Card className="p-2">
                                                        <CardBody>
                                                            <label htmlFor="roomSelector">Selecciona una habitación:</label>
                                                            <Select
                                                                id='roomSelector'
                                                                placeholder="Selecciona una habitación:"
                                                                value={selectRoom ? { label: selectRoom.numeroHabitacion, value: selectRoom } : null}
                                                                options={options}
                                                                onChange={(selectedOption) => handleRoomSelect(selectedOption ? selectedOption.value : null)}
                                                                classNamePrefix="select2-selection"
                                                            />
                                                        </CardBody>
                                                    </Card>
                                                )}
                                            </div>) : (
                                                <div className='d-flex justify-content-center'>
                                                    <h5 className='text-center'>Debe haber seleccionado almenos una habitación para realizar esta acción.</h5>
                                                </div>
                                            )}
                                        </Card>
                                    )}
                                </div>
                            </Card>

                            <Card className="m-2 p-2 d-flex justify-content-center" style={{ height: '15vh' }}>
                                <div className='d-flex flex-row justify-content-end '>
                                    <button type="button" className="btn btn-primary waves-effect waves-light text-uppercase fs-3 fw-bold" style={{ width: '30%', height: '10vh' }} disabled={disableSave} onClick={() => onClickSave()}>
                                        Reservar{" "}
                                        <i className="ri-save-line align-middle ms-2"></i>
                                    </button>
                                </div>
                            </Card>
                        </div>
                    ) : filter === '' && (<label>Debe buscar un cliente</label>)}
                </Container>
            </div>
        </React.Fragment>
    )
}

export default NewBooking;