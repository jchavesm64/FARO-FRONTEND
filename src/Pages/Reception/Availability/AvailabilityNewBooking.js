import React, { useEffect, useState } from "react";
import { Card, Container, Row, CardBody, Col, Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import Select from "react-select";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { OBTENER_HABITACIONES } from "../../../services/HabitacionesService";
import { OBTENER_RESERVAHABITACIONES } from "../../../services/ReservaHabitacionService";
import DataList from "../../../components/Common/DataList";
import { OBTENER_TIPOSHABITACION } from "../../../services/TipoHabitacionService";
import { daysWeek } from "../../../constants/routesConst";

const ReceptionHome = () => {
    document.title = "Disponibilidad | FARO";

    const { data: data_rooms } = useQuery(OBTENER_HABITACIONES, { pollInterval: 1000 });
    const { data: tiposHabitacion } = useQuery(OBTENER_TIPOSHABITACION, { pollInterval: 1000 });
    const { data: data_reservaHabitacion } = useQuery(OBTENER_RESERVAHABITACIONES, { pollInterval: 1000 });

    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());

    const [rooms, setRoom] = useState([]);
    const [typeRoom, setTypeRoom] = useState([]);
    const [reservaHabitacion, setReservaHabitacion] = useState([]);

    const [modal, setModal] = useState(false);

    const [dataModal, setDataModal] = useState([]);

    useEffect(() => {
        const getData = () => {
            if (data_rooms) {
                if (data_rooms.obtenerHabitaciones) {
                    return data_rooms.obtenerHabitaciones.filter((value) => {

                        return value
                    });
                }
            }
            return []
        };
        setRoom(getData());
    }, [data_rooms])

    useEffect(() => {
        const getData = () => {
            if (data_reservaHabitacion) {
                if (data_reservaHabitacion?.obtenerReservaHabitaciones) {
                    return data_reservaHabitacion?.obtenerReservaHabitaciones.filter((value) => {

                        return value
                    });
                }
            }
            return []
        };
        setReservaHabitacion(getData());
    }, [data_reservaHabitacion])

    const currentYear = new Date().getFullYear();

    const yearOptions = Array.from({ length: 41 }, (_, i) => ({
        value: currentYear - 20 + i,
        label: currentYear - 20 + i
    }));

    const monthOptions = Array.from({ length: 12 }, (_, i) => ({
        value: i,
        label: new Date(year, i).toLocaleString('es-ES', { month: 'long' })
    }));

    const handleYearChange = (selectedOption) => {
        setYear(selectedOption.value);
    };

    const handleMonthChange = (selectedOption) => {
        setMonth(selectedOption.value);
    };

    const totalHabitaciones = rooms?.length;

    const calcularDisponibilidadPorDia = (mes, anio) => {
        const diasEnMes = new Date(anio, mes + 1, 0).getDate();
        const disponibilidadPorDia = [];

        for (let dia = 1; dia <= diasEnMes; dia++) {
            const fechaActual = new Date(anio, mes, dia);
            const timestampDia = fechaActual.getTime();

            let habitacionesReservadas = 0;

            reservaHabitacion?.forEach(reserva => {
                const fechaEntrada = Number(reserva.fechaEntrada);
                const fechaSalida = Number(reserva.fechaSalida);

                if (timestampDia >= fechaEntrada && timestampDia < fechaSalida) {
                    habitacionesReservadas++;
                }
            });

            const habitacionesDisponibles = totalHabitaciones - habitacionesReservadas;

            const porcentajeDisponibilidad = (100 * habitacionesReservadas) / totalHabitaciones;

            disponibilidadPorDia.push({
                dia,
                porcentajeDisponibilidad: porcentajeDisponibilidad.toFixed(0),
                habitacionesDisponibles
            });
        }

        return disponibilidadPorDia;
    };

    const disponibilidadDia = calcularDisponibilidadPorDia(month, year);

    const getColorByPercentage = (porcentajeDisponibilidad) => {
        if (porcentajeDisponibilidad === 0) {
            return 'green';
        } else if (porcentajeDisponibilidad <= 25) {
            return 'yellow';
        } else if (porcentajeDisponibilidad <= 50) {
            return 'orange';
        } else if (porcentajeDisponibilidad <= 100) {
            return 'red';
        }
    };

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const weeks = [];
    for (let i = 0; i < daysInMonth; i += 7) {
        weeks.push(disponibilidadDia.slice(i, i + 7));
    };

    useEffect(() => {
        const getTiposHabitacion = () => {
            if (tiposHabitacion) {
                if (tiposHabitacion.obtenerTiposHabitaciones) {
                    return tiposHabitacion.obtenerTiposHabitaciones.filter((value, index) => {

                        return value
                    });
                }
            }
            return []
        }
        setTypeRoom(getTiposHabitacion())
    }, [tiposHabitacion]);

    const [roomAvailability, setRoomAvailability] = useState([]);

    useEffect(() => {
        const typeRoomAvailability = () => {
            const availability = typeRoom?.map(room => ({
                nombre: room.nombre,
                cantidadTotal: 0,
                cantidadDisponible: 0,
                cantidadReservadas: 0,
                porcentajeDisponible: 0
            }));

            const isRoomReserved = (habitacionId, month, year) => {
                return reservaHabitacion.some(reserva => {
                    const fechaEntrada = new Date(parseInt(reserva.fechaEntrada));
                    const fechaSalida = new Date(parseInt(reserva.fechaSalida));

                    const entradaMes = fechaEntrada.getMonth(); // Mes de entrada (0 = enero, 11 = diciembre)
                    const entradaAño = fechaEntrada.getFullYear();
                    const salidaMes = fechaSalida.getMonth();
                    const salidaAño = fechaSalida.getFullYear();

                    // Verificamos si la reserva está en el mismo mes y año
                    const overlaps = (entradaAño === year && entradaMes === month) ||
                        (salidaAño === year && salidaMes === month) ||
                        (entradaAño < year && salidaAño >= year);

                    return overlaps && reserva.habitacion.id === habitacionId;
                });
            };

            rooms?.forEach(habitacion => {
                const tipoNombre = habitacion.tipoHabitacion.nombre;

                const roomType = availability.find(room => room.nombre === tipoNombre);

                if (roomType) {
                    roomType.cantidadTotal += 1;

                    if (!isRoomReserved(habitacion.id, month, year)) {
                        roomType.cantidadDisponible += 1;
                    } else if (habitacion.estado === 'Reservada') {
                        roomType.cantidadReservadas += 1;
                    }

                    roomType.porcentajeDisponible =
                        roomType.cantidadTotal > 0
                            ? ((roomType.cantidadDisponible / roomType.cantidadTotal) * 100).toFixed(0)
                            : 0;
                }
            });

            return availability;
        };
        setRoomAvailability(typeRoomAvailability());
    }, [typeRoom, rooms, month, year, reservaHabitacion]);

    const getData = (day, show) => {

        setModal(show);
        setDataModal({
            day: day.dia,
            percent: day.porcentajeDisponibilidad,
            rooms: day.habitacionesDisponibles
        })
    };

    const toggle = () => setModal(!modal);

    function filtrarReservasPorFecha(reservas, fechaSeleccionada) {

        const fechaSeleccionadaMs = new Date(fechaSeleccionada).getTime();

        return reservas?.filter(reserva => {
            const fechaEntradaMs = reserva.fechaEntrada;
            const fechaSalidaMs = reserva.fechaSalida;

            return fechaSeleccionadaMs >= fechaEntradaMs && fechaSeleccionadaMs <= fechaSalidaMs;
        });
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Disponibilidad y nuevas reservas" breadcrumbItem="Recepción" breadcrumbItemUrl="/reception" />

                    <Card key='availability' className='col-md-12 p-2'>
                        <Row key='rowavailability' className="d-flex justify-content-between m-2 border-bottom align-items-center shadow_calendar_button" >
                            <div key='maindiv' className="col-md-2 col-sm-12 mb-3">
                                <Link key='linkviewbooking' to="/reception/availability/booking">
                                    <button
                                        key='buttonviewbooking'
                                        type="button"
                                        className="btn btn-primary waves-effect waves-light shadow_calendar"
                                        style={{ width: '100%' }}
                                    >
                                        Ver reservas{""}
                                        <i className="mdi mdi-clipboard-text align-middle ms-2"></i>
                                    </button>
                                </Link>
                            </div>
                            <div className="col-md-2 col-sm-12 mb-3">
                                <Link key='linknewbooking' to="/reception/availability/newbooking">
                                    <button
                                        key='buttonnewbooking'
                                        type="button"
                                        className="btn btn-primary waves-effect waves-light shadow_calendar"
                                        style={{ width: '100%' }}
                                    >
                                        Nueva reservar{""}
                                        <i className="mdi mdi-plus align-middle ms-2"></i>
                                    </button>
                                </Link>
                            </div>
                        </Row>
                        <Row key='calendarmain' className='mt-3'>
                            <div key='calendardiv' className="col-md-4 m-3 mt-0 shadow_calendar rounded">
                                <Col key='calendarselect' className='d-flex justify-content-center '>
                                    <Select
                                        key='selectmonth'
                                        options={monthOptions}
                                        value={{ value: month, label: monthOptions[month].label }}
                                        onChange={handleMonthChange}
                                        className="react-select-container col-md-6 m-1"
                                        classNamePrefix="react-select"
                                        placeholder="Select month"

                                    />
                                    <Select
                                        key='selectyear'
                                        options={yearOptions}
                                        value={{ value: year, label: year }}
                                        onChange={handleYearChange}
                                        className="react-select-container col-md-6 m-1"
                                        classNamePrefix="react-select"
                                        placeholder="Select year"

                                    />
                                </Col>
                                <div key='hotcalendar' className="calendar mb-1 ">
                                    <div key='listday' className="calendar-header p-1">
                                        {
                                            daysWeek.map(day => <div className="header-day" key={`header-day${day.label}`}>{day.label}</div>)
                                        }
                                    </div>
                                    <div key='calendardays' className="calendar-body p-1">
                                        {weeks.map((week, weekIndex) => (
                                            <div className="calendar-week" key={`calendarweek${weekIndex}`}>
                                                {week.map((dia) => (
                                                    <Button
                                                        key={`dayweek${dia.dia}${week}`}
                                                        className="calendar-day border border-secondary rounded "
                                                        style={{
                                                            backgroundColor: getColorByPercentage(parseInt(dia.porcentajeDisponibilidad)),
                                                        }}
                                                        onClick={() => getData(dia, true)}
                                                    >
                                                        <span key={`span${dia.dia}${week}`} className="fs-5 " style={{
                                                            color: parseInt(dia.porcentajeDisponibilidad) === 100 ? 'white' : 'black',
                                                        }}>{dia.dia}</span>

                                                    </Button>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div key='listtyperoom' className="col-md-7">
                                <Card>
                                    <CardBody>
                                        <DataList data={roomAvailability !== undefined ? roomAvailability : []} type="typeroomdata" displayLength={3} />
                                    </CardBody>
                                </Card>
                            </div>
                        </Row>
                        <Modal key='modalavailability' isOpen={modal} toggle={toggle} >
                            <ModalHeader key='modalheader' toggle={toggle}><span className="fs-4 m-0 span_package_color">Información de reserva por día</span></ModalHeader>
                            <ModalBody key='modalbody'>
                                <div key='modaldivmain' className="col-md-12 border-bottom mb-3">
                                    <label key='labelmodalmain' className="fs-6 m-0 ms-4 span_package_color">
                                        <strong key='modaliconday' className="mdi mdi-calendar-range me-1" />
                                        <strong>Detalles del día: </strong> <span className="fs-6 label_package_color">{`${dataModal.day}/${month + 1}/${year}`}</span>
                                        <strong> &nbsp; </strong>
                                        <strong>Habitaciones disponibles: </strong> <span className="fs-6 label_package_color">{`${dataModal.rooms}`}</span>
                                    </label>
                                    <label className="fs-6 m-0 ms-4 span_package_color">
                                        <strong className="mdi mdi-percent me-1" />
                                        <strong>Porcentaje de disponibilidad: </strong> <span className="fs-6 label_package_color">{`${dataModal.percent}%`}</span>

                                    </label>
                                    <label className="fs-6 m-0 ms-4 span_package_color">
                                        <strong className="mdi mdi-check-circle-outline me-1" />
                                        <strong>Estado: </strong>
                                        <span className="fs-6 label_package_color">{
                                            dataModal.percent <= 25 ? 'Baja ocupación' :
                                                dataModal.percent <= 50 ? 'Ocupación media' :
                                                    dataModal.percent <= 80 ? 'Alta ocupación' :
                                                        'Ocupación completa'
                                        }
                                        </span>
                                    </label>
                                    <div>
                                        <label className="fs-6 m-0 ms-4 span_package_color">
                                            <strong className="mdi mdi-bed-outline me-1" />
                                            <strong>Habitaciones: </strong>
                                            <div className="ms-5">
                                                {filtrarReservasPorFecha(reservaHabitacion, `${year}-${month + 1}-${dataModal.day}`)?.map(data => (

                                                    <div key={data.habitacion.numeroHabitacion}>Habitación: <span className="fs-6 label_package_color">{`${data.habitacion.numeroHabitacion}`}</span></div>

                                                ))}
                                            </div>
                                        </label>
                                    </div>

                                </div>
                            </ModalBody>

                        </Modal>
                    </Card>

                </Container>
            </div>
        </React.Fragment>
    )
};
export default ReceptionHome;