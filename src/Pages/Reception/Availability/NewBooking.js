import React, { useEffect, useState } from 'react'
import { Card, CardBody, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../../components/Common/Breadcrumb';
import { useQuery } from '@apollo/client';
import { OBTENER_CLIENTES } from '../../../services/ClienteService';
import { Link } from 'react-router-dom';
import { OBTENER_HABITACIONES_DISPONIBLES } from '../../../services/HabitacionesService';
import { OBTENER_TIPOSHABITACION } from '../../../services/TipoHabitacionService';

const NewBooking = ({ ...props }) => {
    document.title = "Nueva Reserva | FARO";

    const [filter, setFilter] = useState('')
    const { data: dataCustomer } = useQuery(OBTENER_CLIENTES, { pollInterval: 1000 });
    const { data: dataRoomsAvailable } = useQuery(OBTENER_HABITACIONES_DISPONIBLES, { pollInterval: 1000 });
    const { data: dataTypeRooms } = useQuery(OBTENER_TIPOSHABITACION, { pollInterval: 1000 });

    const [customer, setCustomer] = useState(null)
    const [customers, setCustomers] = useState([])
    const [bookingDate] = useState(`${new Date().getFullYear()}-${(new Date().getMonth() + 1) > 10 ? (new Date().getMonth() + 1) : '0' + (new Date().getMonth() + 1)}-${new Date().getDate() > 10 ? new Date().getDate() : '0' + new Date().getDate()}`)

    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');

    const [disableSave, setDisableSave] = useState(true);
    const [disableSearch, setDisableSearch] = useState(true);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const [roomsAvailable, setRoomsAvailable] = useState(null);
    const [typeRooms, setTypeRooms] = useState(null);
    const [amountTypeRooms, setAmountTypeRooms] = useState([])

    useEffect(() => {
        const getRooms = () => {
            if (dataRoomsAvailable) {
                if (dataRoomsAvailable.obtenerHabitacionesDisponibles) {
                    return dataRoomsAvailable.obtenerHabitacionesDisponibles;
                }
            }
            return [];
        }

        const getTypeRooms = () => {
            if (dataTypeRooms) {
                if (dataTypeRooms.obtenerTiposHabitaciones) {
                    return dataTypeRooms.obtenerTiposHabitaciones;
                }
            }
            return [];
        }

        const getAmountTypeRooms = () => {
            if (typeRooms) {
                let data = []
                typeRooms.forEach(type => {
                    if (type) {
                        if (roomsAvailable) {
                            const lengthRoomAvailable = roomsAvailable.filter(habitacion => habitacion.tipoHabitacion.nombre === type.nombre);
                            data.push({ 'data': lengthRoomAvailable.length, 'nombre': type.nombre });
                        } else {
                            data.push({ 'data': 0, 'nombre': type.nombre });
                        }
                    }
                })
                return data;
            }
        };

        setRoomsAvailable(getRooms());
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

    const getData = () => {
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
            setCustomers(getData())
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
        setCustomer(getData())
    }



    console.log(amountTypeRooms)

    const onClickSave = async () => { }
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Nueva Reserva" breadcrumbItem="Reservas" breadcrumbItemUrl='/reception/availability' />
                    <Row>
                        <div className="col mb-3 text-end">
                            <button type="button" className="btn btn-primary waves-effect waves-light" disabled={disableSave} onClick={() => onClickSave()}>
                                Guardar{" "}
                                <i className="ri-save-line align-middle ms-2"></i>
                            </button>
                        </div>
                    </Row>
                    <Row className="flex" style={{ alignItems: 'flex-end' }}>
                        <div className="col-md-10 mb-3">
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
                        <div className="col-md-2 col-sm-12 mb-3">
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
                            <Row className="m-1 col-md-7 d-flex flex-row flex-nowrap">
                                <Card className="m-2 col-md-10">
                                    <CardBody className="text-muted">
                                        <h4 className="mb-2">{customer.nombre}</h4>
                                        <p className="mb-2 fw-bold">Identificación: <span className='fw-normal'>{customer.codigo}</span></p>
                                        <p className="mb-2 fw-bold">País: <span className='fw-normal'>{customer.pais}</span></p>
                                        <p className="mb-2 fw-bold">Fecha de reserva: <span className='fw-normal'>{bookingDate}</span></p>
                                    </CardBody>
                                </Card>
                                <Card className="m-2 p-2 col-md-10">
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
                            <Card className="m-2">
                                <Row className="m-2">
                                    <h3 className=" col mb-2">
                                        Tipo de Habitaciones
                                    </h3>
                                </Row>
                                {typeRooms.map(type => (
                                    <Card key={`${type.nombre}-type`} className="m-2 p-1 bg-light col-md-8">
                                        <CardBody >
                                            <Row className="flex" style={{ alignItems: 'flex-end' }}>
                                                <div className="col-md-2 mb-3">
                                                    <span className="logo-lg">
                                                        <img src="/static/media/faro-light.f23d16523144109283f2.png" alt="logo-light" height="24" />
                                                    </span>
                                                </div>
                                                <div className="col-md-4 col-sm-12 ">
                                                    <span>{type.nombre}</span><br />
                                                    <span>{type.precioBase}</span><br />
                                                    <span>{type.descripcion}</span>
                                                </div>



                                            </Row>
                                        </CardBody>
                                    </Card>
                                ))}
                            </Card>
                        </div>
                    ) : filter === '' && (<label>Debe buscar un cliente</label>)}
                </Container>
            </div>
        </React.Fragment>
    )
}

export default NewBooking;