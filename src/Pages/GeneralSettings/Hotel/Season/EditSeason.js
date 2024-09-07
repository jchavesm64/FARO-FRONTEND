import React, { useEffect, useState } from "react";
import { Container, Row } from "reactstrap";
import Breadcrumbs from "../../../../components/Common/Breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { useMutation, useQuery } from "@apollo/client";
import { OBTENER_TEMPORADA, OBTENER_TEMPORADAS, UPDATE_TEMPORADA } from "../../../../services/TemporadaService";
import { infoAlert } from "../../../../helpers/alert";
import { convertDate } from "../../../../helpers/helpers";

const EditSeason = () => {
    document.title = "Temporada | FARO";
    const navigate = useNavigate();

    const { id } = useParams();
    const { loading: loadingSeason, error: errorSeason, data: dataSeason, startPolling, stopPolling } = useQuery(OBTENER_TEMPORADA, { variables: { id: id }, pollInterval: 1000 });
    const { data: season } = useQuery(OBTENER_TEMPORADAS, { pollInterval: 1000 });
    const [actualizar] = useMutation(UPDATE_TEMPORADA);

    useEffect(() => {
        startPolling(1000)
        return () => {
            stopPolling()
        }
    }, [startPolling, stopPolling]);

    const [disableSave, setDisableSave] = useState(true);
    const [typeSeason, setTypeSeason] = useState(null);
    const [price, setPrice] = useState(0);
    const [dateStart, setDateStart] = useState('');
    const [dateEnd, setDateEnd] = useState('');
    const [description, setDescription] = useState('');

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



    useEffect(() => {
        if (dataSeason) {
            console.log(convertDate(dataSeason.obtenerTemporadaById.fechaFin));
            setTypeSeason({ value: dataSeason.obtenerTemporadaById.tipo, label: dataSeason.obtenerTemporadaById.nombre });
            setPrice(dataSeason.obtenerTemporadaById.precio);
            setDescription(dataSeason.obtenerTemporadaById.descripcion);
            setDateStart(convertDate(dataSeason.obtenerTemporadaById.fechaInicio));
            setDateEnd(convertDate(dataSeason.obtenerTemporadaById.fechaFin));


        }
    }, [dataSeason])

    useEffect(() => {
        setDisableSave(!typeSeason || price <= 0 || dateStart === '' || dateEnd === '')
    }, [typeSeason, price, dateStart, dateEnd])

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
    }

    const cleanData = () => {
        setTypeSeason(null);
        setPrice(0);
        setDateStart('');
        setDateEnd('');
        setDescription('');
    };

    const onClickSave = async () => {
        try {
            setDisableSave(true);
            const getMonthDay = (date) => {
                const [year, month, day] = date.split('-');
                const fullDate = new Date(`${year}-${month}-${day}T00:00:00`);
                return fullDate.toLocaleDateString('es-ES', { month: 'long', day: '2-digit' });

            };
            const fechaInicio = getMonthDay(dateStart);
            const fechaFin = getMonthDay(dateEnd);

            const input = {
                fechaInicio,
                fechaFin,
                tipo: typeSeason.value,
                nombre: typeSeason.label,
                precio: price,
                descripcion: description
            };
            debugger
            const { data } = await actualizar({ variables: { id, input }, errorPolicy: 'all' });
            const { estado, message } = data.actualizarTemporada;
            if (estado) {
                infoAlert('Excelente', message, 'success', 3000, 'top-end');
                cleanData();
                navigate('/hotelsettings/season');
            } else {
                infoAlert('Oops', message, 'error', 3000, 'top-end');
            }
            setDisableSave(false)

        } catch (error) {
            infoAlert('Oops', 'Ocurrió un error inesperado al guardar la habitación', 'error', 3000, 'top-end')
            setDisableSave(false)
        }
    };

    if (loadingSeason) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title="Editar Temporada" breadcrumbItem="Temporada" breadcrumbItemUrl='/hotelsettings/season' />
                        <Row>
                            <div className="col text-center pt-3 pb-3">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        </Row>
                    </Container>
                </div>
            </React.Fragment>)
    }

    if (errorSeason) {
        return null
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Editar temporada" breadcrumbItem="temporada" breadcrumbItemUrl='/hotelsettings/season' />
                    <Row>
                        <div className="col mb-3 text-end">
                            <button type="button" className="btn btn-primary waves-effect waves-light" disabled={disableSave} onClick={() => onClickSave()}>
                                Guardar{" "}
                                <i className="ri-save-line align-middle ms-2"></i>
                            </button>
                        </div>
                    </Row>
                    <Row>
                        <div className="col-md-10 d-flex">
                            <div className="col-md-4 col-sm-12 m-2">
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
                            <div className="col-md-4 col-sm-12 m-2">
                                <label htmlFor="voucherNumber" className="form-label" >Precio por temporada</label>
                                <input className="form-control" type="number" id="voucherNumber" disabled={!typeSeason} value={price} onChange={(e) => { setPrice(e.target.value) }} />
                            </div>
                        </div>
                        <div className="col-md-10 d-flex ">
                            <div className="col-md-4 m-2">
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
                            <div className=" col-md-4 m-2">
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
                        <Row>
                            <div className="col-md-7 m-3">
                                <label htmlFor="descripcion" className="form-label">Descripción</label>
                                <textarea className="form-control" type="text" id="descripcion" disabled={!typeSeason} value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                            </div>
                        </Row>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
};

export default EditSeason;