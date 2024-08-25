import React, { useEffect, useState } from 'react'
import { Button, Card, CardBody, Container, InputGroup, Row, Input } from 'reactstrap';
import Breadcrumbs from '../../../components/Common/Breadcrumb';
import { useQuery } from '@apollo/client';
import { OBTENER_CLIENTES } from '../../../services/ClienteService';
import { Link } from 'react-router-dom';
import { OBTENER_HABITACIONES_DISPONIBLES } from '../../../services/HabitacionesService';
import { OBTENER_TIPOSHABITACION } from '../../../services/TipoHabitacionService';
import { OBTENER_SERVICIO } from '../../../services/ServiciosExtraService';
import Select from "react-select";
import ListInfo from '../../../components/Common/ListInfo';
import { infoAlert } from '../../../helpers/alert';

const NewBooking = ({ ...props }) => {
    document.title = "Nueva Reserva | FARO";

    const [filter, setFilter] = useState('')
    const { data: dataCustomer } = useQuery(OBTENER_CLIENTES, { pollInterval: 1000 });
    const { data: dataRoomsAvailable } = useQuery(OBTENER_HABITACIONES_DISPONIBLES, { pollInterval: 1000 });
    const { data: dataTypeRooms } = useQuery(OBTENER_TIPOSHABITACION, { pollInterval: 1000 });
    const { data: services } = useQuery(OBTENER_SERVICIO, { pollInterval: 1000 });

    const [customer, setCustomer] = useState(null)
    const [customers, setCustomers] = useState([])
    const [bookingDate] = useState(`${new Date().getFullYear()}-${(new Date().getMonth() + 1) > 10 ? (new Date().getMonth() + 1) : '0' + (new Date().getMonth() + 1)}-${new Date().getDate() > 10 ? new Date().getDate() : '0' + new Date().getDate()}`)

    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');

    //const [disableSave, setDisableSave] = useState(true);
    const [disableSearch, setDisableSearch] = useState(true);
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

    const [totalBooking, setTotalBooking] = useState([])



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
            setFilter(e.target.value)
            setCustomers(getDataCustomer())
            return
        } else {
            setFilter('')
            setCustomers([])
        }

    }

    const selectClient = (c) => {
        setCustomer(c)
        setFilter('')
        setCustomers([])
    }

    const searchClient = () => {
        setFilter('')
        setCustomer(getDataCustomer())
    }

    const handleIncrease = (e, index) => {
        if (amountTypeRooms[index].amountBooking < amountTypeRooms[index].lengthAvailable) {
            const updatedRooms = [...amountTypeRooms];
            updatedRooms[index].amountBooking += 1;
            const newExtractedRooms = [...roomsBooking, updatedRooms[index].rooms.shift()];
            setAmountTypeRooms(updatedRooms);
            setRoomsBooking(newExtractedRooms);
          

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

    const addExtraService = (s, extra, type) => {

        if (s) {
            const exist = extra.find(e => e.id === s.value.id)
            if (exist) {
                infoAlert('Oops', 'Ya existe este servicio para esta reservación', 'warning', 3000, 'top-end')
                if (type === 'general') setServicesBooking(null)
                if (type === 'room') setServicesRoom(null)
                return
            }

            if (type === 'general') {
                setExtraService([...extraService, s.value])
                //setTotalBooking({ 'type': null, 'price': null });
                setServicesBooking(null)
            }
            if (type === 'room') {
                setExtraServiceRoom([...extraServiceRoom, s.value])
                setServicesRoom(null)
            }


        } else {
            infoAlert('Oops', 'No ha seleccionado un servicio', 'error', 3000, 'top-end')
        }
    }

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
            setExtraServiceRoom(...extraServiceRoom, dataService.service);
        }
    };

    const options = typeRooms.map((type) => ({
        label: type.nombre,
        options: roomsBooking.filter(roomB => roomB.tipoHabitacion.id === type.id).map((room) => ({
            label: room.numeroHabitacion,
            value: room,
        })),
    }));

    const addExtraServicePerRoom = async () => {
        const index = servicesPerRoom.findIndex(r => r.room.numeroHabitacion === selectRoom.numeroHabitacion);
        if (index !== -1) {
            setServicePerRoom((prev) => {
                const updatedServices = [...prev];
                updatedServices[index] = {
                    ...updatedServices[index],
                    service: extraServiceRoom
                };
                return updatedServices;
            });
        } else {
            await setServicePerRoom([...servicesPerRoom, { 'room': selectRoom, 'service': extraServiceRoom }])
        }

        setSelectRoom(null)
        setExtraServiceRoom([])
    }

    const totalToPayBooking = () => {

    }
    //const onClickSave = async () => { }


    /*     console.log('Habitaciones', roomsBooking);
        console.log('Servicios habitacion', servicesPerRoom);
        console.log('Servicio general', extraService);
        console.log('tipo habitacion', amountTypeRooms);
     */


    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Nueva Reserva" breadcrumbItem="Reservas" breadcrumbItemUrl='/reception/availability' />

                    <Row className="flex" style={{ alignItems: 'flex-end' }}>
                        <div className="col-md-10 mb-1">
                            <label
                                htmlFor="search-input"
                                className="col-md-2 col-form-label"
                            >
                                Busca el cliente
                            </label>
                            <input
                                className="form-control"
                                id="search-input"
                                value={filter}
                                onChange={handleInputChange}
                                type="search"
                                placeholder="Escribe el nombre o identificación del cliente" />
                        </div>
                        <div className="col-md-2 col-sm-12 mb-1">
                            <button type="button" className="btn btn-primary waves-effect waves-light" disabled={disableSearch} onClick={() => searchClient()}>
                                Buscar{" "}
                                <i className="ri-search-line align-middle ms-2"></i>
                            </button>
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
                            <div className="col-md-3 col-sm-12 mb-3">
                                <label>No existe el cliente, ¿Desea crear uno?</label>
                                <Link to="/hotelsettings/newamenities">
                                    <button
                                        type="button"
                                        className="btn btn-primary waves-effect waves-light"
                                        style={{ width: '100%' }}
                                    >
                                        Nuevo cliente{" "}
                                        <i className="mdi mdi-plus align-middle ms-2"></i>
                                    </button>
                                </Link>
                            </div>
                        )}
                    </Row>
                    {customer ? (
                        <div className='mt-1'>
                            <Row className="m-2 col-md-7 d-flex flex-row flex-nowrap">
                                <Card className="m-1 col-md-10">
                                    <CardBody className="text-muted">
                                        <h4 className="mb-2">{customer.nombre}</h4>
                                        <p className="mb-2 fw-bold">Identificación: <span className='fw-normal'>{customer.codigo}</span></p>
                                        <p className="mb-2 fw-bold">País: <span className='fw-normal'>{customer.pais}</span></p>
                                        <p className="mb-2 fw-bold">Fecha de reserva: <span className='fw-normal'>{bookingDate}</span></p>
                                    </CardBody>
                                </Card>
                                <Card className="m-1 p-2 col-md-10">
                                    <div className="p-1 col-md-8">
                                        <label htmlFor="checkInDate" className="form-label">Fecha de Entrada</label>
                                        <input
                                            className="form-control"
                                            type="date"
                                            id="checkInDate"
                                            value={checkIn}
                                            onChange={(e) => { setCheckIn(e.target.value) }}
                                        />
                                    </div>
                                    <div className="p-1 col-md-8">
                                        <label htmlFor="checkOutDate" className="form-label">Fecha de Salida</label>
                                        <input
                                            className="form-control"
                                            type="date"
                                            id="checkOutDate"
                                            value={checkOut}
                                            onChange={(e) => { setCheckOut(e.target.value) }}
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
                                                    <div>
                                                        <label>Habitaciones</label>
                                                        {amountTypeRooms.map((type) => (
                                                            <div className="bg-secondary col-md-12">
                                                                {type.amountBooking !== 0 && (
                                                                    <div key={type.type.nombre} className="m-0 text-light d-flex justify-content-between">
                                                                        <p className="p-1 m-0 w-25 h-25 ">{type.type.nombre}</p>
                                                                        <div className="col-md-4 d-flex justify-content-between p-1">
                                                                            <p className="m-0">X{type.amountBooking}</p>
                                                                            <p className="m-0 w-1 h-1 text-end ">${totalPerRoom(type)}</p>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div>
                                                        {extraService.length > 0 && (
                                                            <div className='mt-2'>
                                                                <label>Servicios adicionales por reserva</label>
                                                                <div className="bg-secondary col-md-12">
                                                                    {extraService.map(s => (
                                                                        <div key={s.nombre} className="m-0 text-light d-flex justify-content-between p-1">
                                                                            <p className="m-0 text-nowrap">{s.nombre}</p>
                                                                            <p className="m-0 text-end">${s.precio}</p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        {extraServiceRoom.length > 0 && (
                                                            <div className='mt-2'>
                                                                <label>Servicios adicionales por habitación</label>
                                                                <div className="bg-secondary col-md-12">
                                                                    {extraServiceRoom.map(s => (
                                                                        <div key={s.nombre} className="m-0 text-light d-flex justify-content-between p-1">
                                                                            <p className="m-0 text-nowrap">{s.nombre}</p>
                                                                            <p className="m-0 text-end">${s.precio}</p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (<label>Sin datos que mostrar</label>)}
                                        </Card>

                                    </div>
                                    <Card key='total'>
                                        <div>
                                            <div className="p-3">
                                                <p className=" text-uppercase fs-3 fw-bold">Total:</p>
                                            </div>

                                            <div className="p-3">

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
                                        <Row className="m-2 p-2 d-flex flex-row col-md-7 justify-content-center">
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
                                                                        options={getServices()}
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
                        </div>
                    ) : filter === '' && (<label>Debe buscar un cliente</label>)}
                </Container>
            </div>
        </React.Fragment>
    )
}

export default NewBooking;