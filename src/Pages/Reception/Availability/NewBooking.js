import React, { useEffect, useState } from 'react'
import { Button, Card, CardBody, Container, InputGroup, Row, Input, ButtonGroup, Col, Tooltip } from 'reactstrap';
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
import { SAVE_RESERVA } from '../../../services/ReservaService';
import { OBTENER_PAQUETES } from '../../../services/PaquetesService';
import { OBTENER_TEMPORADAS } from '../../../services/TemporadaService';
import { convertDate } from '../../../helpers/helpers';

import NewCustomer from '../../Customers/NewCustomer';
import SearchCustomer from './NewBooking/SearchCustomer';
import TypeDateBooking from './NewBooking/Type&DateBooking';
import Packages from './NewBooking/Packages';
import Rooms from './NewBooking/Rooms';
import ToursService from './NewBooking/Tours&Service';
import Notes from './NewBooking/Notes';
import Summary from './NewBooking/Summary';



import { useStepper } from 'headless-stepper';

const NewBooking = ({ ...props }) => {
    document.title = "Nueva Reserva | FARO";

    const currentDate = `${new Date().getFullYear()}-${(new Date().getMonth() + 1) > 10 ? (new Date().getMonth() + 1) : '0' + (new Date().getMonth() + 1)}-${new Date().getDate() >= 10 ? new Date().getDate() : '0' + new Date().getDate()}`;

    const [filter, setFilter] = useState('')
    const { data: dataCustomer } = useQuery(OBTENER_CLIENTES, { pollInterval: 1000 });
    const { data: dataRoomsAvailable } = useQuery(OBTENER_HABITACIONES_DISPONIBLES, { pollInterval: 1000 });
    const { data: dataTypeRooms } = useQuery(OBTENER_TIPOSHABITACION, { pollInterval: 1000 });
    const { data: services } = useQuery(OBTENER_SERVICIO, { pollInterval: 1000 });
    const { data: season } = useQuery(OBTENER_TEMPORADAS, { pollInterval: 1000 });
    const { data: packages } = useQuery(OBTENER_PAQUETES, { pollInterval: 1000 });

    const [insertar] = useMutation(SAVE_RESERVA);

    const [customer, setCustomer] = useState(null)
    const [customers, setCustomers] = useState([])
    const [bookingDate] = useState(currentDate);
    const [amountPeople, setAmountPeople] = useState(0);

    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');

    const [stateBooking, setStateBooking] = useState(false);

    const [disableSave, setDisableSave] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [serviceBookingCheck, setServiceBookingCheck] = useState(false);
    const [serviceTourCheck, setServiceTourCheck] = useState(false);
    const [serviceRoomCheck, setServiceRoomCheck] = useState(false);
    const [packageBookingCheck, setPackageBookingCheck] = useState(false);
    const [typeBooking, setTypeBooking] = useState(null);

    const [packageBooking, setPackageBooking] = useState(null);
    const [packageBookingList, setPackageBookingList] = useState([]);

    const [seasonlist, setSeasonlist] = useState([]);
    const [currentSeason, setCurrentSeason] = useState(null);

    const [roomsAvailable, setRoomsAvailable] = useState(null);//Habitaciones disponibles
    const [typeRooms, setTypeRooms] = useState([]);//Tipo de habitaciones
    const [amountTypeRooms, setAmountTypeRooms] = useState([]);//Cantidad de habitaciones por tipo 
    const [roomsBooking, setRoomsBooking] = useState([]);//Habitaciones seleccionadas por reserva, esta lista es temporal para para crear la reserva habitación
    const [ServicesBooking, setServicesBooking] = useState([]);//Servicio selecionado para agregar a la reserva en general
    const [ServicesRoom, setServicesRoom] = useState([]);//Servicio selecionado para agregar a la habitación
    const [extraService, setExtraService] = useState([]);//Lista de servicios selecionados para la reserva en general
    const [selectRoom, setSelectRoom] = useState(null);//Habitación seleccionada para agragar servicios extra a la habitación 
    const [extraServiceRoom, setExtraServiceRoom] = useState([]);//Servicios seleccionados para la habitación seleccionada
    const [servicesPerRoom, setServicesPerRoom] = useState([]);//lista de servicios por habitación
    const [totalBooking, setTotalBooking] = useState([]);

    const [total, setTotal] = useState(0);

    const [notes, setNotes] = useState('');


    useEffect(() => {

        const getRoomsAvailable = () => (
            dataRoomsAvailable?.obtenerHabitacionesDisponibles || []
        );

        const getAmountTypeRooms = () => {
            if (!roomsAvailable || !typeRooms) return [];

            return typeRooms.map(type => {
                const RoomAvailable = roomsAvailable.filter(habitacion => habitacion.tipoHabitacion.nombre === type.nombre);
                return {
                    lengthAvailable: RoomAvailable.length,
                    type,
                    amountBooking: 0,
                    rooms: RoomAvailable
                };
            });
        };

        const getSeasons = () => (
            season?.obtenerTemporada || []
        );

        const getCurrentSeason = () => (
            seasonlist.find(sl => {
                const dateStart = sl.fechaInicio;
                const dateEnd = sl.fechaFin;
                return currentDate >= convertDate(dateStart) && currentDate <= convertDate(dateEnd);
            }) || null
        );

        const getTypeRooms = () => (dataTypeRooms?.obtenerTiposHabitaciones || []);

        setRoomsAvailable(getRoomsAvailable());
        setTypeRooms(getTypeRooms());
        setAmountTypeRooms(getAmountTypeRooms());
        setSeasonlist(getSeasons());
        setCurrentSeason(getCurrentSeason());

    }, [dataRoomsAvailable, dataTypeRooms, roomsAvailable, typeRooms, season, seasonlist, currentDate]);

    const handleTypeBookingChange = (type) => {
        setTypeBooking(type);
    };

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

    const handleIncrease = (index) => {
        const currentRoomType = amountTypeRooms[index];
        if (currentRoomType.amountBooking >= currentRoomType.lengthAvailable) return;
        const updatedRooms = [...amountTypeRooms];
        const updatedRoomsBooking = [...roomsBooking];
        updatedRooms[index] = {
            ...currentRoomType,
            amountBooking: currentRoomType.amountBooking + 1,
        };
        const roomToExtract = currentRoomType.rooms[0];
        if (roomToExtract) {
            updatedRooms[index] = {
                ...updatedRooms[index],
                rooms: currentRoomType.rooms.slice(1),
            };
            const newExtractedRooms = [...updatedRoomsBooking, roomToExtract];
            setAmountTypeRooms(updatedRooms);
            setRoomsBooking(newExtractedRooms);
        }
    };



    const handleDecrease = (index) => {
        const currentRoomType = amountTypeRooms[index];
        if (currentRoomType.amountBooking === 0) return;
        const updatedRooms = [...amountTypeRooms];
        const updatedRoomsBooking = [...roomsBooking];
        updatedRooms[index] = {
            ...currentRoomType,
            amountBooking: currentRoomType.amountBooking - 1,
        };
        const roomToReturn = updatedRoomsBooking.find(
            room => room.tipoHabitacion.nombre === currentRoomType.type.nombre
        );
        if (roomToReturn) {
            const filteredRoomsBooking = updatedRoomsBooking.filter(
                room => room.numeroHabitacion !== roomToReturn.numeroHabitacion
            );
            updatedRooms[index] = {
                ...updatedRooms[index],
                rooms: [...updatedRooms[index].rooms, roomToReturn],
            };
            setAmountTypeRooms(updatedRooms);
            setRoomsBooking(filteredRoomsBooking);
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
        const total = (type.amountBooking * type.type.precioBase) + currentSeason.precio;

        return total
    }

    const handleChangePackageBooking = () => {
        setPackageBookingCheck(!packageBookingCheck);

    };

    const handleChangeServiceBooking = () => {
        setServiceBookingCheck(!serviceBookingCheck);
        setExtraService([])
    };
    const handleChangeTourRoom = () => {
        setServiceTourCheck(!serviceTourCheck);
        setExtraService([])
    };

    const handleChangeServiceRoom = () => {
        setServiceRoomCheck(!serviceRoomCheck);
        setExtraServiceRoom([])
        setServicesPerRoom([])
        setSelectRoom(null)
    };

    const handleService = (a, type) => {
        if (type === 'general') setServicesBooking(a);
        if (type === 'room') setServicesRoom(a);
    }

    const handlePackage = (a) => {
        setPackageBooking(a);
    }

    const getServices = () => {
        const data = [];
        if (services?.obtenerServicios) {
            services.obtenerServicios.forEach((item) => {
                const newItem = { ...item };

                newItem.precio = item.precio + currentSeason.precio;

                data.push({
                    value: newItem,
                    label: newItem.nombre
                });
            });
        }
        return data;
    };


    const getServicesPerRoom = () => {
        const extra = extraService.map(item => item.id);
        const data = getServices().filter(item => !extra.includes(item.value.id));

        return data;
    }

    const addExtraService = (s, extra, type) => {

        if (!s) {
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
            const newExtraServiceRoom = extraServiceRoom.filter(roomService => !updatedService.find(service => service.nombre === roomService.nombre));
            setExtraServiceRoom(newExtraServiceRoom);

            //Eliminar servicios de la lista de servicios por habitación

        } else if (type === 'room') {
            setExtraServiceRoom(updatedService);
            setServicesRoom(null);
        }

        setTotalBooking([...totalBooking, { 'typeName': s.label, 'price': s.value.precio + currentSeason.precio }]);
    };

    const deleteServiceBooking = (nombre) => {
        setExtraService(extraService.filter(a => a.nombre !== nombre))

    }

    const deleteServiceRoom = (nombre) => {
        setExtraServiceRoom(extraServiceRoom.filter(a => a.nombre !== nombre));
    }

    const handleRoomSelect = (room) => {
        setSelectRoom(room);

        if (servicesPerRoom.length) {
            const dataService = servicesPerRoom.find(s => s.room.numeroHabitacion === room.numeroHabitacion);
            if (dataService) {
                setExtraServiceRoom(...extraServiceRoom, dataService.service);
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
        setServicesPerRoom((prev) => {
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

    const getPackage = () => {
        const data = [];
        if (packages?.obtenerPaquetes) {
            packages.obtenerPaquetes.forEach((item) => {
                const matchingSeason = item.temporadas?.nombre === currentSeason.nombre;
                if (matchingSeason) {
                    data.push({
                        value: item,
                        label: item.nombre
                    });
                }
            });
        }

        return data;
    };

    const addPackage = () => {

        if (packageBooking) {
            const exist = packageBookingList.find(e => e.id === packageBooking.value.id)
            if (exist) {
                infoAlert('Oops', 'Ya existe esta comodidad en la habitación', 'warning', 3000, 'top-end')
                setPackageBooking(null)
                return
            }

            setPackageBookingList([...packageBookingList, packageBooking.value]);
            setPackageBooking(null);

        } else {
            infoAlert('Oops', 'No ha seleccionado una comodida', 'error', 3000, 'top-end')
        }

    };

    const deletePackage = (nombre) => {
        setPackageBookingList(packageBookingList.filter(a => a.nombre !== nombre));
    }

    useEffect(() => {
        setTotal(totalBooking.reduce((sum, item) => sum + item.price, 0))
    }, [totalBooking])



    const restartData = () => {
        setCustomer(null);
        setAmountPeople(0);
        setTotal(0);
        setExtraService([]);
        setServicesPerRoom([]);
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

    //Mejorar diseño ya que no es viable este que ya está creado

    const steps = React.useMemo(
        () => [
            { label: 'Buscar cliente', },
            { label: 'Tipo y fecha de reserva' },
            { label: 'Paquetes' },
            { label: 'Habitaciones' },
            { label: 'Servicios y Tours' },
            { label: 'Notas' },
            { label: 'Resumen' }
        ],
        []
    );
    const [tooltipOpen, setTooltipOpen] = useState(false);

    const toggleTooltip = () => {
        setTooltipOpen(!tooltipOpen);
    };
    const { state, nextStep, prevStep, progressProps, stepsProps, stepperProps } =
        useStepper({
            steps,
        });

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Nueva Reserva" breadcrumbItem="Reservas" breadcrumbItemUrl='/reception/availability' />
                    <Card className='col-md-12 p-2'>
                        <div className='d-flex col-md-12 justify-content-center '>
                            <nav className='d-flex col-md-10 justify-content-center shadow_wizard wizard_bar' {...stepperProps}>
                                {stepsProps?.map((step, index) => (
                                    <div key={index}>
                                        <ol
                                            className={`list-group text-center step-hover-effect_wizard p-2 m-1 text-wrap fs-5 border-bottom border-top border-primary text-dark ${state.currentStep === index ? "border-3" : "border-1"}`}
                                            key={index}
                                            style={{
                                                fontWeight: state.currentStep === index ? 'bold' : 'unset'
                                            }}
                                        >
                                            <a  {...step}>{steps[index].label}</a>
                                        </ol>
                                    </div>
                                ))}
                            </nav>
                        </div>
                        <div className='d-flex justify-content-between m-4 mt-3 mb-0'>
                            <Button id='Anterior' color="primary" onClick={prevStep} disabled={!state.hasPreviousStep}><i className={'mdi mdi-arrow-left-bold-circle-outline button_wizard_icon'}></i></Button>
                            <Button id='Siguiente' color="primary" onClick={nextStep} disabled={!state.hasNextStep}><i className={'mdi mdi-arrow-right-bold-circle-outline button_wizard_icon'}></i></Button>
                        </div>
                        {steps[state.currentStep].label === 'Buscar cliente' &&
                            <div>
                                <SearchCustomer props={{ handleInputChange, selectClient, setCustomer, setFilter, filter, customers, customer, stateBooking, bookingDate }} />
                            </div>
                        }
                        {steps[state.currentStep].label === 'Tipo y fecha de reserva' &&
                            <div>
                                <TypeDateBooking props={{ handleTypeBookingChange, setCheckIn, setCheckOut, setAmountPeople, typeBooking, checkIn, checkOut, amountPeople }} />
                            </div>
                        }
                        {steps[state.currentStep].label === 'Paquetes' &&
                            <div>
                                <Packages props={{ handlePackage, getPackage, addPackage, deletePackage, packageBooking, packageBookingList }} />
                            </div>
                        }
                        {steps[state.currentStep].label === 'Habitaciones' &&
                            <div>
                                <Rooms props={{ handleDecrease, handleChange, handleBlur, totalPerRoom, handleIncrease, amountTypeRooms, currentSeason, roomsBooking }} />
                            </div>
                        }
                        {steps[state.currentStep].label === 'Servicios y Tours' &&
                            <div>
                                <ToursService props={{
                                    handleChangeServiceBooking,
                                    handleChangeServiceRoom,
                                    handleChangeTourRoom,
                                    handleService,
                                    deleteServiceBooking,
                                    deleteServiceRoom,
                                    handleRoomSelect,
                                    getServices,
                                    addExtraService,
                                    getServicesPerRoom,
                                    addExtraServicePerRoom,
                                    ServicesRoom,
                                    roomsBooking,
                                    selectRoom,
                                    serviceBookingCheck,
                                    serviceRoomCheck,
                                    ServicesBooking,
                                    extraService,
                                    extraServiceRoom,
                                    options,
                                    serviceTourCheck
                                }} />
                            </div>
                        }
                        {steps[state.currentStep].label === 'Notas' &&
                            <div>
                                <Notes />
                            </div>
                        }
                        {steps[state.currentStep].label === 'Resumen' &&
                            <div>
                                <Summary />
                            </div>
                        }
                    </Card>
                </Container>
            </div>
        </React.Fragment>
    );
    /* return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Nueva Reserva" breadcrumbItem="Reservas" breadcrumbItemUrl='/reception/availability' />

                    {customer ? (
                        <div className='mt-1'>
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
                                                        <p>Precio por noche: $<span>{type.type.precioBase + currentSeason.precio}</span></p>
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
                                                                                    <p className="m-0 text-end">${s.precio + currentSeason.precio}</p>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        {packageBookingList.length > 0 && (
                                                            <div className='mt-2'>
                                                                <label>Servicios adicionales por paquete</label>
                                                                <div className='border border-secondary rounded p-1'>
                                                                    <div className="bg-secondary col-md-11 m-3">
                                                                        {packageBookingList.map(s => (
                                                                            <div key={s.nombre} className="m-0 text-light d-flex justify-content-between p-1">
                                                                                <p className="m-0 text-nowrap">{s.nombre}</p>
                                                                                <p className="m-0 text-end">${s.precio + currentSeason.precio}</p>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
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
                                    <Row className="mt-3">
                                        <h2 >
                                            Paquetes adicionales
                                        </h2>
                                    </Row>
                                    <Row className="m-2  d-flex flex-row col-md-8 col-xl-7 justify-content-center">
                                        <div className="form-check  mb-3 col-md-6 d-flex justify-content-center">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="isPackageBooking"
                                                value='packageBooking'
                                                readOnly
                                                checked={packageBookingCheck}
                                                onClick={handleChangePackageBooking}
                                            />
                                            <label htmlFor="isPackageBooking" className="form-check-label ms-2 ">¿Desea agregar paquetes a la reserva?</label>
                                        </div>
                                    </Row>
                                    <div className='col-md-12 d-flex flex-row  justify-content-center'>
                                        {packageBookingCheck && (
                                            <Card className='col-md-5 bg-light m-2 p-2 '>
                                                <div className="col-md-12">
                                                    <h3 key='summary' className="text-center mb-4 mt-4">Paquetes adicionales por reserva</h3>
                                                </div>

                                                <div className="col-md-12 col-sm-12">
                                                    <Card className="p-2">
                                                        <CardBody>
                                                            <div className="row row-cols-lg-auto g-3 align-items-center">
                                                                <div className="col-xl-9 col-md-12 mb-2">
                                                                    <Select
                                                                        value={packageBooking}
                                                                        onChange={(e) => {
                                                                            handlePackage(e);
                                                                        }}
                                                                        options={getPackage()}
                                                                        placeholder="Paquetes"
                                                                        classNamePrefix="select2-selection"
                                                                    />
                                                                </div>
                                                                <div className="col-12 mb-1">
                                                                    <Button type="submit" className="btn btn-outline-primary" onClick={() => { addPackage() }}>
                                                                        Agregar
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                            <Row>
                                                                <ListInfo data={packageBookingList} headers={['Paquete ', 'Precio']} keys={['nombre', 'precio']} enableEdit={false} enableDelete={true} actionDelete={deletePackage} mainKey={'nombre'} secondKey={'precio'} />
                                                            </Row>
                                                        </CardBody>
                                                    </Card>
                                                </div>
                                            </Card>
                                        )}
                                    </div>
                                </div>
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
                                                                <Button type="submit" className="btn btn-outline-primary" onClick={() => { addExtraService(ServicesBooking, extraService, 'general') }}>
                                                                    Agregar
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <Row>
                                                            <ListInfo data={extraService} headers={['Servicio ', 'Precio']} keys={['nombre', 'precio']} enableEdit={false} enableDelete={true} actionDelete={deleteServiceBooking} mainKey={'nombre'} secondKey={'precio'} />
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
                                                                    <Button type="submit" className="btn btn-outline-primary" onClick={() => { addExtraService(ServicesRoom, extraServiceRoom, 'room') }}>
                                                                        Agregar
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                            <Row>
                                                                <ListInfo data={extraServiceRoom} headers={['Servicio ', 'Precio']} keys={['nombre', 'precio']} enableEdit={false} enableDelete={true} actionDelete={deleteServiceRoom} mainKey={'nombre'} secondKey={'precio'} />
                                                            </Row>
                                                            <div className="col-12 mt-2">
                                                                <Button type="submit" className="btn btn-outline-primary" onClick={() => { addExtraServicePerRoom() }}>
                                                                    Guardar
                                                                </Button>
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
                            <Card className="m-2 p-2 d-flex justify-content-center" >
                                <div className="col-md-7 m-3">
                                    <label htmlFor="descripcion" className="form-label">Notas para la reserva</label>
                                    <textarea className="form-control" type="text" id="descripcion" value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
                                </div>
                                <div className='d-flex flex-row justify-content-end '>
                                    <Button type="Button" className="btn btn-primary waves-effect waves-light text-uppercase fs-3 fw-bold" style={{ width: '30%', height: '10vh' }} disabled={disableSave} onClick={() => onClickSave()}>
                                        Reservar{" "}
                                        <i className="ri-save-line align-middle ms-2"></i>
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    ) : filter === '' && (<label>Debe buscar un cliente</label>)}
                </Container>
            </div>
        </React.Fragment>
    ) */
}

export default NewBooking;