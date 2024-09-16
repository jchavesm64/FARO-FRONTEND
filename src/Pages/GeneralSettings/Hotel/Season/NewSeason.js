import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import Select from "react-select";
import { OBTENER_TEMPORADAS, SAVE_TEMPORADA } from "../../../../services/TemporadaService";
import { infoAlert } from "../../../../helpers/alert";
import { OBTENER_TIPOSHABITACION } from "../../../../services/TipoHabitacionService";

const NewSeason = () => {
    document.title = "Temporada | FARO";


    const navigate = useNavigate();
    const [insertar] = useMutation(SAVE_TEMPORADA);
    const { data: season } = useQuery(OBTENER_TEMPORADAS, { pollInterval: 1000 });
    const { data: typeRoom } = useQuery(OBTENER_TIPOSHABITACION, { pollInterval: 1000 });

    const [disableSave, setDisableSave] = useState(true);
    const [typeSeason, setTypeSeason] = useState(null);
    const [price, setPrice] = useState(0);
    const [dateStart, setDateStart] = useState('');
    const [dateEnd, setDateEnd] = useState('');
    const [description, setDescription] = useState('');

    const [typeRooms, setTypeRooms] = useState([]);
    const [priceTypeRoom, setPriceTypeRoom] = useState({});

    const typeSeasons = [
        {
            label: 'Temporada alta 1',
            value: 'Alta1'
        },
        {
            label: 'Temporada alta 2',
            value: 'Alta2'
        },
        {
            label: 'Fin de año',
            value: 'FinAño'
        },
        {
            label: 'Temporada Baja',
            value: 'Baja'
        }
    ];

    const validatePriceForPriceTypeRoom = (obj) => {
        return Object.values(obj).some(item => item.price !== 0);
    };

    console.log(priceTypeRoom)

    useEffect(() => {
        setDisableSave(!(typeSeason && dateStart && dateEnd && validatePriceForPriceTypeRoom(priceTypeRoom)));
    }, [typeSeason, dateStart, dateEnd, priceTypeRoom]);

    useEffect(() => {
        const getTypeRooms = () => {
            if (typeRoom) {
                if (typeRoom.obtenerTiposHabitaciones) {
                    return typeRoom.obtenerTiposHabitaciones;
                }
            }
            return [];
        };
        setTypeRooms(getTypeRooms())
    }, [typeRoom]);

    useEffect(() => {
        if (typeRooms.length > 0) {
            const initialPrices = {};
            typeRooms.forEach(type => {
                initialPrices[type.nombre] = { type: type.nombre, price: 0 };
            });
            setPriceTypeRoom(initialPrices);
        }
    }, [typeRooms]);

    const getSeason = () => {
        if (season) {
            if (season.obtenerTemporada) {
                return season.obtenerTemporada;
            }
        }
        return [];
    };

    const seasonLimit = () => {
        const seasonExist = getSeason();
        return typeSeasons.filter(ts => !seasonExist.some(exist => exist.tipo === ts.value))
    };

    const cleanData = () => {
        setTypeSeason(null);
        setPrice(0);
        setDateStart('');
        setDateEnd('');
        setDescription('');
    };

    const handlePriceChange = (e, typeName) => {
        const value = Number(e.target.value);
        setPriceTypeRoom(prevState => ({
            ...prevState,
            [typeName]: {
                ...prevState[typeName],
                price: value
            }
        }));
    };

    const onClickSave = async () => {
        try {
            setDisableSave(true);
            const getMonthDay = (date) => {
                const fullDate = new Date(date);
                return new Intl.DateTimeFormat('es-ES', { month: 'long', day: '2-digit' }).format(fullDate);
            };
            const fechaInicio = getMonthDay(dateStart);
            const fechaFin = getMonthDay(dateEnd);

            const input = {
                fechaInicio,
                fechaFin,
                tipo: typeSeason.value,
                nombre: typeSeason.label,
                precio: price,
                tiposHabitacion: priceTypeRoom,
                descripcion: description,
            };

            const { data } = await insertar({ variables: { input }, errorPolicy: 'all' });
            const { estado, message } = data.insertarTemporada;
            if (estado) {
                infoAlert('Excelente', message, 'success', 3000, 'top-end');
                cleanData();
                navigate('/hotelsettings/season');
            } else {
                infoAlert('Oops', message, 'error', 3000, 'top-end')
            }
            setDisableSave(false)

        } catch (error) {
            infoAlert('Oops', 'Ocurrió un error inesperado al guardar la temporada', 'error', 3000, 'top-end')
            setDisableSave(false)
        }
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Nueva temporada" breadcrumbItem="temporada" breadcrumbItemUrl='/hotelsettings/season' />
                    <Row>
                        <div className="col mb-0 text-end">
                            <button type="button" className="btn btn-primary waves-effect waves-light" disabled={disableSave} onClick={() => onClickSave()}>
                                Guardar{" "}
                                <i className="ri-save-line align-middle ms-2"></i>
                            </button>
                        </div>
                    </Row>
                    <Row>
                        <Col className="col-md-6 d-flex align-content-center flex-wrap">
                            <div className="col-md-11 d-flex">
                                <div className="col-md-12 col-sm-12 m-1">
                                    <label htmlFor="supplier" className="form-label">* Tipo de temporada</label>
                                    <Select
                                        id="supplier"
                                        value={typeSeason}
                                        onChange={(e) => {
                                            setTypeSeason(e);
                                        }}
                                        options={seasonLimit()}
                                        classNamePrefix="select2-selection"
                                    />
                                </div>

                            </div>
                            <div className="col-md-11 d-flex ">
                                <div className="col-md-6 m-1">
                                    <label htmlFor="checkInDate" className="form-label ">Fecha de Inicio</label>
                                    <input
                                        className="form-control"
                                        type="date"
                                        id="checkInDate"
                                        value={dateStart}
                                        disabled={!typeSeason}
                                        onChange={(e) => { setDateStart(e.target.value) }}
                                    />
                                </div>
                                <div className=" col-md-6 m-1">
                                    <label htmlFor="checkOutDate" className="form-label ">Fecha de Fin</label>
                                    <input
                                        className="form-control"
                                        type="date"
                                        id="checkOutDate"
                                        value={dateEnd}
                                        disabled={dateStart === '' || !typeSeason}
                                        onChange={(e) => { setDateEnd(e.target.value) }}
                                        min={dateStart ? new Date(new Date(dateStart).setDate(new Date(dateStart).getDate() + 1)).toISOString().split('T')[0] : ''}
                                    />
                                </div>
                            </div>
                            <Row className="col-md-12">
                                <div className="col-md-12 m-1">
                                    <label htmlFor="descripcion" className="form-label">Descripción</label>
                                    <textarea className="form-control" type="text" id="descripcion" disabled={!typeSeason} value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                                </div>
                            </Row>
                        </Col >
                        <Col>
                            <Row className="mt-3">
                                <label htmlFor="lableTypeRoom" className="form-label" >Precio por tipo de Habitación</label>
                                {typeRooms.map(type => (
                                    <div id={`id${type.nombre}`} className="col-md-6 col-sm-12 m-1">
                                        <label id={`label${type.nombre}`} htmlFor={type.nombre} className="form-label" >{type.nombre}</label>
                                        <input className="form-control" type="number" id={type.nombre} disabled={!typeSeason} value={priceTypeRoom[type.nombre]?.price} onChange={(e) => handlePriceChange(e, type.nombre)} />
                                    </div>
                                ))}

                            </Row>

                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
};
export default NewSeason;