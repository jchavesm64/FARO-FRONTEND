import React, { useEffect, useRef, useState, useMemo } from 'react'
import { Button, Card, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../../../components/Common/Breadcrumb';
import { stepsWizardMenuBooking } from '../../../../constants/routesConst';
import { OBTENER_CLIENTES } from '../../../../services/ClienteService';
import { OBTENER_HABITACIONES_DISPONIBLES } from '../../../../services/HabitacionesService';
import { OBTENER_TIPOSHABITACION } from '../../../../services/TipoHabitacionService';
import { OBTENER_SERVICIO } from '../../../../services/ServiciosExtraService';
import { infoAlert } from '../../../../helpers/alert';
import { OBTENER_PAQUETES } from '../../../../services/PaquetesService';
import { OBTENER_TEMPORADAS } from '../../../../services/TemporadaService';
import { convertDate, timestampToDateLocal } from '../../../../helpers/helpers';

import SearchCustomer from './SearchCustomer';
import TypeDateBooking from './Type&DateBooking';
import Packages from './Packages';
import Rooms from './Rooms';
import ToursService from './Tours&Service';
import Notes from './Notes/Notes';
import Summary from './Summary';

import { useStepper } from 'headless-stepper';
import { OBTENER_AREAS } from '../../../../services/AreasOperativasService';
import { OBTENER_TOURS } from '../../../../services/TourService';
import { useMutation, useQuery } from '@apollo/client';
import { OBTENER_RESERVA, SAVE_RESERVA } from '../../../../services/ReservaService';
import { OBTENER_USUARIO_CODIGO } from '../../../../services/UsuarioService';
import { useNavigate, useParams } from 'react-router-dom';
import { OBTENER_RESERVAHABITACION } from '../../../../services/ReservaHabitacionService';

const NewBooking = () => {
    document.title = "Nueva Reserva | FARO";

    const navigate = useNavigate();
    const { id } = useParams();

    const currentDate = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;

    const [filter, setFilter] = useState('')
    const { data: dataCustomer } = useQuery(OBTENER_CLIENTES, { pollInterval: 1000 });
    const { data: dataRoomsAvailable } = useQuery(OBTENER_HABITACIONES_DISPONIBLES, { pollInterval: 1000 });
    const { data: dataTypeRooms } = useQuery(OBTENER_TIPOSHABITACION, { pollInterval: 1000 });
    const { data: services } = useQuery(OBTENER_SERVICIO, { pollInterval: 1000 });
    const { data: season } = useQuery(OBTENER_TEMPORADAS, { pollInterval: 1000 });
    const { data: packages } = useQuery(OBTENER_PAQUETES, { pollInterval: 1000 });
    const { data: data_tours } = useQuery(OBTENER_TOURS, { pollInterval: 1000 });
    const { data: data_user } = useQuery(OBTENER_USUARIO_CODIGO, { variables: { codigo: localStorage.getItem('cedula') }, pollInterval: 1000 });
    const { data: operativeAreas } = useQuery(OBTENER_AREAS, { pollInterval: 1000 });

    const { loading: loading_booking, data: booking } = useQuery(OBTENER_RESERVA, { variables: { id: id }, skip: !id, pollInterval: 1000 });
    const { data: bookingRoom } = useQuery(OBTENER_RESERVAHABITACION, { variables: { id: booking?.obtenerReserva.id }, skip: !id, pollInterval: 1000 })

    const [insertar] = useMutation(SAVE_RESERVA);

    const [user, setUser] = useState([])

    const [customer, setCustomer] = useState(null)
    const [customers, setCustomers] = useState([])
    const [bookingDate] = useState(currentDate);
    const [amountAdult, setAmountAdult] = useState(0);
    const [amountChildren, setAmountChildren] = useState(0);

    const [disabledButton, setDisabledButton] = useState(true)

    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');

    const [stateBooking, setStateBooking] = useState(false);

    
    const [typeBooking, setTypeBooking] = useState(null);

    const [packageBooking, setPackageBooking] = useState(null);
    const [packageBookingList, setPackageBookingList] = useState([]);

    const [seasonlist, setSeasonlist] = useState([]);
    const [currentSeason, setCurrentSeason] = useState(null);

    const [roomsAvailable, setRoomsAvailable] = useState(null);//Habitaciones disponibles
    const [typeRooms, setTypeRooms] = useState([]);//Tipo de habitaciones
    const [amountTypeRooms, setAmountTypeRooms] = useState([]);//Cantidad de habitaciones por tipo 
    const [roomsBooking, setRoomsBooking] = useState([]);//Habitaciones seleccionadas por reserva, esta lista es temporal para para crear la reserva habitación
    const [ServicesBooking, setServicesBooking] = useState(null);//Servicio selecionado para agregar a la reserva en general
    const [ServicesRoom, setServicesRoom] = useState(null);//Servicio selecionado para agregar a la habitación
    const [extraService, setExtraService] = useState([]);//Lista de servicios selecionados para la reserva en general
    const [selectRoom, setSelectRoom] = useState(null);//Habitación seleccionada para agragar servicios extra a la habitación 
    const [extraServiceRoom, setExtraServiceRoom] = useState([]);//Servicios seleccionados para la habitación seleccionada
    const [servicesPerRoom, setServicesPerRoom] = useState([]);//lista de servicios por habitación

    const [tours, setTours] = useState(null);
    const [toursList, setToursList] = useState([]);

    const [areas, setAreas] = useState([]);

    const [notes, setNotes] = useState(null);
    const [filterNotes, setFilterNotes] = useState([]);

    const [componentSize, setComponentSize] = useState({ width: 0 });
    const wizardRef = useRef(null);


    //Load data for edit booking 
    useEffect(() => {
        if (id !== undefined) {
            setCustomer(booking?.obtenerReserva.cliente);
            setTypeBooking(booking?.obtenerReserva.tipo);
            setUser(booking?.obtenerReserva.usuario.nombre);
            setAmountAdult(booking?.obtenerReserva.numeroPersonas.adulto);
            setAmountChildren(booking?.obtenerReserva.numeroPersonas.ninos);
            setCheckIn(timestampToDateLocal(Number(bookingRoom?.obtenerReservaHabitacion[0]?.fechaEntrada), 'date'));
            setCheckOut(timestampToDateLocal(Number(bookingRoom?.obtenerReservaHabitacion[0]?.fechaSalida), 'date'));
            setPackageBookingList(booking?.obtenerReserva?.paquetes);
        }
    }, [booking, bookingRoom, id])

    // Data for new boooking
    useEffect(() => {
        setUser(data_user?.obtenerUsuarioByCodigo || [])
    }, [data_user])

    useEffect(() => {

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

        const getCurrentSeason = () => (
            seasonlist.find(sl => {
                const dateStart = sl.fechaInicio;
                const dateEnd = sl.fechaFin;
                return currentDate >= convertDate(dateStart) && currentDate <= convertDate(dateEnd);
            }) || null
        );

        const getAreas = () => (operativeAreas?.obtenerAreas || []);

        const getRoomsAvailable = () => (dataRoomsAvailable?.obtenerHabitacionesDisponibles || []);

        const getSeasons = () => (season?.obtenerTemporada || []);

        const getTypeRooms = () => (dataTypeRooms?.obtenerTiposHabitaciones || []);

        setRoomsAvailable(getRoomsAvailable());
        setTypeRooms(getTypeRooms());
        setAmountTypeRooms(getAmountTypeRooms());
        setSeasonlist(getSeasons());
        setCurrentSeason(getCurrentSeason());
        setAreas(getAreas());
        setNotes(
            areas.map(area => (
                {
                    area,
                    nota: '',
                    fecha: ''
                }
            ))
        );


    }, [dataRoomsAvailable, dataTypeRooms, roomsAvailable, operativeAreas, typeRooms, season, seasonlist, currentDate, areas]);

    const calAmountService = (service) => {
        if (service.tipo.cuantificable === 'true') {

            if (service.tipo.horadia === 'Día' || service.tipo.horadia === 'Noche') {
                return calculateNights() * amountPeople()
            }
            return (calculateNights() + 1) * amountPeople()

        }
        return 0;
    };

    useEffect(() => {
        const updatedExtraService = extraService?.map(service => ({
            ...service,
            cantidad: calAmountService(service, checkIn, checkOut, amountAdult, amountChildren)
        }));

        // Actualizar paxkageBookingList con la cantidad calculada para cada servicio
        /* const updatedPakageBookingList = packageBookingList.map(packageItem => ({
            ...packageItem,
            servicios: packageItem.servicios.map(service => ({
                ...service,
                cantidad: calAmountService(service, checkIn, checkOut, amountAdult, amountChildren)
            }))
        })); */

        // Actualizar los estados
        setExtraService(updatedExtraService);
        //setPackageBookingList(updatedPakageBookingList);

    }, [amountAdult, amountChildren, checkIn, checkOut])

    function calculateNights() {
        const startDateObj = new Date(checkIn);
        const endDateObj = new Date(checkOut);
        const timeDifference = endDateObj - startDateObj;
        const dayDifference = timeDifference / (1000 * 60 * 60 * 24);
        return dayDifference;
    };

    const amountPeople = () => {
        return parseInt(amountAdult, 10) + parseInt(amountChildren, 10)
    }

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
        const extra = extraService?.map(item => item.id);
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
        };

        const updatedService = [
            ...extra,
            {
                ...s.value,
                cantidad: calAmountService(s.value),
                extra: 1
            }
        ];

        if (type === 'general') {

            setExtraService(updatedService);
            setServicesBooking(null);
            const newExtraServiceRoom = extraServiceRoom.filter(roomService => !updatedService.find(service => service.nombre === roomService.nombre));
            setExtraServiceRoom(newExtraServiceRoom);

        } else if (type === 'room') {
            setExtraServiceRoom(updatedService);
            setServicesRoom(null);
        }

    };

    const deleteServiceBooking = (nombre) => {
        setExtraService(extraService.filter(a => a.nombre !== nombre))

    };

    const updateAmountService = (type, amount, service) => {
        if (type === 'booking') {
            setExtraService(prevServices =>
                prevServices.map(s =>
                    s.id === service.id
                        ? {
                            ...s,
                            extra: amount !== '' ? amount : 0
                        }
                        : s
                )
            );
        } else {
            setExtraServiceRoom(prevServices =>
                prevServices.map(s =>
                    s.id === service.id
                        ? {
                            ...s,
                            extra: amount !== '' ? amount : 0
                        }
                        : s
                )
            );
        }

    };

    const deleteServiceRoom = (nombre) => {
        setExtraServiceRoom(extraServiceRoom.filter(a => a.nombre !== nombre));
    }

    const getTour = () => {
        const data = [];
        if (data_tours?.obtenerTours) {
            data_tours.obtenerTours.forEach((item) => {

                data.push({
                    value: item,
                    label: item.nombre
                });
            });
        }
        return data;
    };

    const handleTour = (a) => {
        setTours(a);
    };

    const addTours = () => {
        if (tours) {
            const exist = toursList.find(e => e.id === tours.value.id)
            if (exist) {
                infoAlert('Oops', 'Ya existe este tour en esta reserva', 'warning', 3000, 'top-end')
                setPackageBooking(null)
                return
            }

            setToursList([...toursList, tours.value]);
            setTours(null);

        } else {
            infoAlert('Oops', 'No ha seleccionado un tour', 'error', 3000, 'top-end')
        }
    };

    const deleteTour = (nombre) => {
        setToursList(toursList.filter(a => a.nombre !== nombre));
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
                infoAlert('Oops', 'Ya existe este paquete en la reserva', 'warning', 3000, 'top-end')
                setPackageBooking(null)
                return
            }
            const servicePackageUpdate = {
                ...packageBooking.value,
                servicios: packageBooking.value.servicios.map(servicio => ({
                    ...servicio
                }))
            };

            setPackageBookingList([...packageBookingList, servicePackageUpdate]);
            setPackageBooking(null);

        } else {
            infoAlert('Oops', 'No ha seleccionado un paquete', 'error', 3000, 'top-end')
        }

    };

    const deletePackage = (nombre) => {
        setPackageBookingList(packageBookingList.filter(a => a.nombre !== nombre));
    };

    const updatePackageBooking = (pack) => {
        const updataPackage = packageBookingList.map(p =>
            p.nombre === pack.nombre ? { ...p, ...pack } : p

        );
        setPackageBookingList(updataPackage)
    };

    const updateServiceBooking = (service, type) => {
        console.log(service)
        if (type === 'perService') {
            const updataService = extraService.map(s =>
                s.nombre === service.nombre ? { ...s, ...service } : s

            );
            setExtraService(updataService)
        } else if (type === 'perRoom') {
            const updateService = extraServiceRoom.map(s =>
                s.nombre === service.nombre ? { ...s, ...service } : s

            );
            setExtraServiceRoom(updateService)
        }
    };

    const stepsFromWizard = useMemo(() => stepsWizardMenuBooking, []);

    const [steps, setSteps] = useState(stepsFromWizard);

    const enableNextStep = (index) => {
        setSteps((prevSteps) =>
            prevSteps.map((step, i) => {
                if (i === index + 1 && step.disabled) {
                    return { ...step, disabled: false };
                }
                return step;
            })
        );
    };

    const { state, nextStep, prevStep, stepsProps, stepperProps } = useStepper({
        steps,
    });

    useEffect(() => {
        if (!disabledButton) {
            enableNextStep(state.currentStep);
        }
    }, [disabledButton, state]);

    useEffect(() => {
        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                setComponentSize({
                    width: entry.contentRect.width,
                });
            }
        });

        if (wizardRef.current) {
            resizeObserver.observe(wizardRef.current);
        }
        return () => {
            if (wizardRef.current) {
                resizeObserver.unobserve(wizardRef.current);
            }
        };
    }, [wizardRef]);

    const handleSaveNote = (updatedNote) => {

        const update = notes.map(note => {
            if (note.area.id === updatedNote.area.id) {
                return {
                    ...note,
                    nota: updatedNote.nota,
                    fecha: updatedNote.fecha
                };
            }
            return note;
        });
        setNotes(update);
    };

    const getFilteredAreaByKey = (nombre) => {
        if (nombre !== '') {
            const value = nombre.toLowerCase();
            const filtered = notes.filter(note =>
                note.area.nombre.toLowerCase().includes(value)
            );
            setFilterNotes(filtered);
        } else {
            setFilterNotes([]);
        }
    };

    const handleChangeState = () => {
        setDisabledButton(true);
    };

    const handleStep = (onClickFunction) => {
        handleChangeState()
        if (onClickFunction) {
            onClickFunction()
        }
    };

    const onClickSave = async () => {
        try {
            const input = {
                cliente: customer ? customer.id : null,
                tipo: typeBooking,
                fechaReserva: bookingDate,
                numeroPersonas: {
                    adulto: amountAdult,
                    ninos: amountChildren
                },
                total: null,
                serviciosGrupal: extraService?.map(s => s.id),
                paquetes: packageBookingList.map(p => p.id),
                tours: toursList.map(t => t.id),
                notas: notes.filter(note => note.nota !== ""),
                metodoPago: null,
                politicas: null,
                usuario: user.id !== undefined ? user.id : null
            }

            const bookingRoom = {
                habitacion: roomsBooking.length > 0 ? roomsBooking.map(room => room.id) : null,
                fechaEntrada: checkIn,
                fechaSalida: checkOut,
                serviciosExtra: servicesPerRoom.length > 0 ? servicesPerRoom.map(roomData => ({
                    room: roomData.room.id,
                    service: roomData.service.map(serviceData => serviceData.id)
                })) : null
            };


            const { data } = await insertar({ variables: { input, bookingRoom }, errorPolicy: 'all' });
            const { estado, message } = data.insertarReserva;

            if (estado) {
                infoAlert('Excelente', message, 'success', 3000, 'top-end')
                navigate(`/reception/availability`)
            } else {
                infoAlert('Oops', message, 'error', 3000, 'top-end')
            }
        } catch (error) {

        }
    };

    if (loading_booking && id) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title={!id ? 'Nueva Reserva' : 'Editar Reserva'} breadcrumbItem="Reservas" breadcrumbItemUrl={!id ? '/reception/availability' : '/reception/availability/booking'} />
                        <Row>
                            <div className="col text-center pt-3 pb-3">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        </Row>
                    </Container>
                </div>
            </React.Fragment>
        );

    };

    return (
        <React.Fragment>
            <div className="page-content " ref={wizardRef}>
                <Container fluid={true}>
                    <Breadcrumbs title={!id ? 'Nueva Reserva' : 'Editar Reserva'} breadcrumbItem="Reservas" breadcrumbItemUrl={!id ? '/reception/availability' : '/reception/availability/booking'} />
                    <Card className='p-4'>
                        <div className='d-flex col-md-12 justify-content-center '>
                            <nav className='d-flex col-md-12 justify-content-center shadow_wizard wizard_bar' {...stepperProps}>
                                {stepsProps?.map((step, index) => (
                                    <div key={index}>
                                        <ol
                                            className={`
                                                list-group wizard_button_size text-center step-hover-effect_wizard 
                                                p-2 m-1 text-wrap fs-5 border-bottom border-top border-primary d-flex 
                                                justify-content-center text-dark ${state.currentStep === index ? "border-3" : "border-1"}`}
                                            key={index}
                                            style={{
                                                fontWeight: state.currentStep === index ? 'bold' : 'unset',
                                                opacity: steps[index].disabled ? 0.6 : 1
                                            }}

                                        >
                                            <a {...step} onClick={() => handleStep(stepsProps[index].onClick)}  >
                                                {componentSize.width <= 1151 ? (
                                                    <i className={`${steps[index].icon} wizard_icon_size`}></i>
                                                ) : steps[index].label}
                                            </a>
                                        </ol>
                                    </div>
                                ))}
                            </nav>
                        </div>
                        <div className='d-flex justify-content-between m-4 mt-3 mb-0'>
                            <Button id='Anterior' color="primary" onClick={prevStep} disabled={!state.hasPreviousStep}><i className={'mdi mdi-arrow-left-bold-circle-outline button_wizard_icon'}></i></Button>
                            <Button id='Siguiente' color="primary" onClick={() => { nextStep(); handleChangeState(); }} disabled={!state.hasNextStep || disabledButton}><i className={'mdi mdi-arrow-right-bold-circle-outline button_wizard_icon'}></i></Button>
                        </div>
                        {steps[state.currentStep].label === 'Buscar cliente' &&
                            <div>
                                <SearchCustomer props={{ handleInputChange, selectClient, setCustomer, setFilter, setDisabledButton, filter, customers, customer, stateBooking, bookingDate }} />
                            </div>
                        }
                        {steps[state.currentStep].label === 'Tipo y fecha de reserva' &&
                            <div>
                                <TypeDateBooking props={{ handleTypeBookingChange, setCheckIn, setCheckOut, setAmountAdult, setAmountChildren, setDisabledButton, typeBooking, checkIn, checkOut, amountAdult, amountChildren }} />
                            </div>
                        }
                        {steps[state.currentStep].label === 'Paquetes' &&
                            <div>
                                <Packages props={{ handlePackage, getPackage, addPackage, deletePackage, setDisabledButton, updatePackageBooking, packageBooking, packageBookingList }} />
                            </div>
                        }
                        {steps[state.currentStep].label === 'Habitaciones' &&
                            <div>
                                <Rooms props={{ handleDecrease, handleChange, handleBlur, totalPerRoom, handleIncrease, setDisabledButton, amountTypeRooms, currentSeason, roomsBooking, typeBooking }} />
                            </div>
                        }
                        {steps[state.currentStep].label === 'Servicios y Tours' &&
                            <div>
                                <ToursService props={{
                                    updateServiceBooking,
                                    handleService,
                                    handleTour,
                                    deleteServiceBooking,
                                    deleteServiceRoom,
                                    deleteTour,
                                    handleRoomSelect,
                                    getServices,
                                    getTour,
                                    addTours,
                                    addExtraService,
                                    getServicesPerRoom,
                                    addExtraServicePerRoom,
                                    setDisabledButton,
                                    updateAmountService,
                                    ServicesRoom,
                                    roomsBooking,
                                    selectRoom,
                                    ServicesBooking,
                                    extraService,
                                    extraServiceRoom,
                                    options,
                                    tours,
                                    toursList,
                                    servicesPerRoom,
                                    typeBooking
                                }} />
                            </div>
                        }
                        {steps[state.currentStep].label === 'Notas' &&
                            <div>
                                <Notes props={{ handleSaveNote, getFilteredAreaByKey, setDisabledButton, filterNotes, notes }} />
                            </div>
                        }
                        {steps[state.currentStep].label === 'Resumen' &&
                            <div>
                                <Summary props={{ amountPeople, calculateNights, onClickSave, customer, currentDate, currentSeason, checkIn, checkOut, amountAdult, amountChildren, typeBooking, packageBookingList, roomsBooking, servicesPerRoom, extraService, toursList, notes, user }} />
                            </div>
                        }
                    </Card>
                </Container>
            </div>
        </React.Fragment>
    );
}

export default NewBooking;