import React, { useState } from "react";
import { Card, Container, Row, CardBody, Col } from "reactstrap";
import Select from "react-select";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { OBTENER_HABITACIONES } from "../../../services/HabitacionesService";
import { OBTENER_RESERVAHABITACION } from "../../../services/ReservaHabitacionService";
import DataList from "../../../components/Common/DataList";
import { OBTENER_TIPOSHABITACION } from "../../../services/TipoHabitacionService";

export default function ReceptionHome() {
    document.title = "Disponibilidad | FARO";

    const { data: rooms } = useQuery(OBTENER_HABITACIONES, { pollInterval: 1000 });
    const { data: tiposHabitacion } = useQuery(OBTENER_TIPOSHABITACION, { pollInterval: 1000 });
    const { data: reservaHabitacion } = useQuery(OBTENER_RESERVAHABITACION, { pollInterval: 1000 });

    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());


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

    const totalHabitaciones = rooms?.obtenerHabitaciones.length;

    const calcularDisponibilidadPorDia = (mes, anio) => {
        const diasEnMes = new Date(anio, mes + 1, 0).getDate();
        const disponibilidadPorDia = [];

        for (let dia = 1; dia <= diasEnMes; dia++) {
            const fechaActual = new Date(anio, mes, dia);
            const timestampDia = fechaActual.getTime();

            let habitacionesReservadas = 0;

            reservaHabitacion?.obtenerReservaHabitaciones.forEach(reserva => {
                const fechaEntrada = Number(reserva.fechaEntrada);
                const fechaSalida = Number(reserva.fechaSalida);

                if (timestampDia >= fechaEntrada && timestampDia < fechaSalida) {
                    habitacionesReservadas++;
                }
            });

            const habitacionesDisponibles = totalHabitaciones - habitacionesReservadas;
            const porcentajeDisponibilidad = Math.max(0, Math.abs(((habitacionesDisponibles / totalHabitaciones) * 100) - 100));

            disponibilidadPorDia.push({
                dia,
                porcentajeDisponibilidad: porcentajeDisponibilidad.toFixed(0),

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
        } else if (porcentajeDisponibilidad <= 25) {
            return 'red';
        }

    };

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const weeks = [];
    for (let i = 0; i < daysInMonth; i += 7) {
        weeks.push(disponibilidadDia.slice(i, i + 7));
    };

    function crearDisponibilidadPorMes(mes) {
        const resultado = tiposHabitacion?.obtenerTiposHabitaciones.map(tipo => {
            const habitacionesTipo = rooms?.obtenerHabitaciones.filter(h => h.tipoHabitacion.id === tipo.id);
            const cantidadTotal = habitacionesTipo?.length;
            const cantidadDisponibles = habitacionesTipo?.filter(h => {
                // Verificar si la habitación está ocupada en el mes específico
                return !reservaHabitacion?.obtenerReservaHabitaciones.some(reserva => {
                    const fechaEntrada = new Date(parseInt(reserva.fechaEntrada));
                    const fechaSalida = new Date(parseInt(reserva.fechaSalida));

                    // Verificar si el mes de la reserva está dentro del rango
                    return (
                        fechaEntrada.getMonth() === mes ||
                        fechaSalida.getMonth() === mes ||
                        (fechaEntrada.getMonth() < mes && fechaSalida.getMonth() > mes)
                    );
                });
            }).length;

            const porcentajeDisponibilidad = cantidadTotal > 0
                ? ((cantidadDisponibles / cantidadTotal) * 100).toFixed(0) + '%'
                : '0%';

            return {
                nombre: tipo.nombre,
                cantidadTotal: cantidadTotal,
                cantidadDisponibles: cantidadDisponibles,
                porcentajeDisponibilidad: porcentajeDisponibilidad
            };
        });

        return resultado;
    }

    // Suponiendo que deseas verificar el mes de octubre (mes 9 en JS)



    console.log(crearDisponibilidadPorMes(month));


    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Disponibilidad y nuevas reservas" breadcrumbItem="Recepción" breadcrumbItemUrl="/reception" />


                    <Card className='col-md-12 p-2'>
                        <Row className="d-flex justify-content-end" >
                            <div className="col-md-2 col-sm-12 mb-3">
                                <Link to="/reception/availability/newbooking">
                                    <button
                                        type="button"
                                        className="btn btn-primary waves-effect waves-light"
                                        style={{ width: '100%' }}
                                    >
                                        Reservar{" "}
                                        <i className="mdi mdi-plus align-middle ms-2"></i>
                                    </button>
                                </Link>
                            </div>
                        </Row>

                        <Row>
                            <div className="col-md-5 m-3 mt-0 shadow_calendar rounded">
                                <Col className='d-flex justify-content-center'>
                                    <Select
                                        options={monthOptions}
                                        value={{ value: month, label: monthOptions[month].label }}
                                        onChange={handleMonthChange}
                                        className="react-select-container col-md-6 m-1"
                                        classNamePrefix="react-select"
                                        placeholder="Select month"

                                    />
                                    <Select
                                        options={yearOptions}
                                        value={{ value: year, label: year }}
                                        onChange={handleYearChange}
                                        className="react-select-container col-md-6 m-1"
                                        classNamePrefix="react-select"
                                        placeholder="Select year"

                                    />
                                </Col>
                                <div className="calendar ">
                                    <div className="calendar-header">
                                        <div className="header-day">Lun</div>
                                        <div className="header-day">Mar</div>
                                        <div className="header-day">Mié</div>
                                        <div className="header-day">Jue</div>
                                        <div className="header-day">Vie</div>
                                        <div className="header-day">Sáb</div>
                                        <div className="header-day">Dom</div>
                                    </div>
                                    <div className="calendar-body p-2">
                                        {weeks.map((week, weekIndex) => (
                                            <div className="calendar-week" key={weekIndex}>
                                                {week.map((dia) => (
                                                    <div
                                                        key={dia.dia}
                                                        className="calendar-day border border-secondary rounded"
                                                        style={{
                                                            backgroundColor: getColorByPercentage(parseInt(dia.porcentajeDisponibilidad)),
                                                        }}
                                                    >
                                                        <div style={{
                                                            color: dia.porcentajeDisponibilidad === 0 ? 'red' : 'black',
                                                        }}>{dia.dia}</div>
                                                        <div style={{
                                                            color: dia.porcentajeDisponibilidad === 0 ? 'red' : 'black',
                                                        }}>{dia.porcentajeDisponibilidad}%</div>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <Card>
                                    <CardBody>
                                        <DataList data={crearDisponibilidadPorMes(month)} type="typeroomdata" displayLength={5} />
                                    </CardBody>
                                </Card>
                            </div>

                        </Row>
                    </Card>

                </Container>
            </div>
        </React.Fragment>
    )
}
