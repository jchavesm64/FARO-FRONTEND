import React, { useEffect, useState } from "react";
import { Card, CardBody, Container, Row } from "reactstrap";
import Breadcrumbs from "../../../../components/Common/Breadcrumb";
import SpanSubtitleForm from "../../../../components/Forms/SpanSubtitleForm";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { SAVE_HABITACION } from "../../../../services/HabitacionesService";
import { OBTENER_COMODIDADES } from "../../../../services/ComodidadesService";
import { OBTENER_TIPOSHABITACION } from "../../../../services/TipoHabitacionService";
import Select from "react-select";
import { infoAlert } from "../../../../helpers/alert";
import ListInfo from "../../../../components/Common/ListInfo";

const NewRoom = () => {
    document.title = "Habitaciones | FARO";

    const navigate = useNavigate();

    const { loading: loadTypeRooms, data: typeRooms } = useQuery(OBTENER_TIPOSHABITACION, { pollInterval: 1000 });
    const { loading: loadAmenities, data: typeAmenities } = useQuery(OBTENER_COMODIDADES, { pollInterval: 1000 });
    const [insertar] = useMutation(SAVE_HABITACION)

    const [numberRoom, setNumberRoom] = useState('');
    const [typeRoom, setTypeRoom] = useState(null);// Se agrega un valor seleccionado
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [amenities, setAmenites] = useState(null);
    const [amenitiesList, setAmenitiesList] = useState([]);
    const [stateRoom, setStateRoom] = useState(null);


    const stateRooms = [
        {
            label: "Disponible",
            value: "Disponible"
        },
        {
            label: "Mantenimineto",
            value: "Mantenimineto"
        },
        {
            label: "Servicio",
            value: "Servicio"
        },
        {
            label: "Desmantelada",
            value: "Desmantelada"
        }
    ]

    const getTypeRooms = () => {
        const data = []
        if (typeRooms?.obtenerTiposHabitaciones) {
            typeRooms.obtenerTiposHabitaciones.forEach((item) => {
                data.push({
                    "value": item,
                    "label": item.nombre
                });
            });
        }
        return data;
    }

    const getAmenities = () => {
        const data = []
        if (typeAmenities?.obtenerComodidades) {
            typeAmenities?.obtenerComodidades.forEach((item) => {
                data.push({
                    "value": item,
                    "label": item.nombre
                });
            });
        }
        return data;
    }

    const handleAmenities = (a) => {
        setAmenites(a);
    }

    const addAmenities = () => {
        if (amenities) {
            const exist = amenitiesList.find(e => e.id === amenities.value.id)
            if (exist) {
                infoAlert('Oops', 'Ya existe esta comodidad en la habitación', 'warning', 3000, 'top-end')
                setAmenites(null)
                return
            }

            setAmenitiesList([...amenitiesList, amenities.value])
            setAmenites(null)

        } else {
            infoAlert('Oops', 'No ha seleccionado una comodida', 'error', 3000, 'top-end')
        }
    }

    const eliminarAmenities = (nombre) => {
        setAmenitiesList([amenitiesList.find(a => a.nombre !== nombre)])
        console.log([amenitiesList.find(a => a.nombre !== nombre)])
    }

    const [disableSave, setDisableSave] = useState(true);

    useEffect(() => {
        setDisableSave(numberRoom.trim().length === 0 || !typeRoom || price <= 0 || amenitiesList.length === 0 || !stateRoom)
    }, [numberRoom, typeRoom, price, amenitiesList, stateRoom])

    const onClickSave = async () => {
        try {
            setDisableSave(true)
            const input = {
                numeroHabitacion: numberRoom,
                tipoHabitacion: typeRoom.value.id,
                precioPorNoche: price,
                descripcion: description,
                comodidades: amenitiesList.map(a => a.id),
                estado: stateRoom.value
            }
            debugger
            const { data } = await insertar({ variables: { input }, errorPolicy: 'all' });
            const { estado, message } = data.insertarHabitacion;
            if (estado) {
                infoAlert('Excelente', message, 'success', 3000, 'top-end')
                navigate('/hotelsettings/rooms');
            } else {
                infoAlert('Oops', message, 'error', 3000, 'top-end')
            }
            setDisableSave(false)
        } catch (error) {
            infoAlert('Oops', 'Ocurrió un error inesperado al guardar la habitación', 'error', 3000, 'top-end')
            setDisableSave(false)
        }
    }

    if (loadAmenities || loadTypeRooms) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title="Nuevo Habitación" breadcrumbItem="Habitaciones" breadcrumbItemUrl='/hotelsettings/rooms' />
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

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Nuevo Habitación" breadcrumbItem="Habitaciones" breadcrumbItemUrl='/hotelsettings/rooms' />
                    <Row>
                        <div className="col mb-3 text-end">
                            <button type="button" className="btn btn-primary waves-effect waves-light" disabled={disableSave} onClick={() => onClickSave()}>
                                Guardar{" "}
                                <i className="ri-save-line align-middle ms-2"></i>
                            </button>
                        </div>
                    </Row>
                    <Row>
                        <div className="col-md-12 col-sm-12">
                            <Row>
                                <div className="col mb-3">
                                    <SpanSubtitleForm subtitle='Información de la habitación' />
                                </div>
                            </Row>
                        </div>
                    </Row>

                    <Row>
                        <div className="col-md-4 col-sm-12 mb-3">
                            <label htmlFor="voucherNumber" className="form-label">Número habitacion</label>
                            <input className="form-control" type="text" id="voucherNumber" value={numberRoom} onChange={(e) => { setNumberRoom(e.target.value) }} />
                        </div>
                        <div className="col-md-4 col-sm-12 mb-3">
                            <label htmlFor="supplier" className="form-label">* Tipo de habitación</label>
                            <Select
                                id="supplier"
                                value={typeRoom}
                                onChange={(e) => {
                                    setTypeRoom(e);
                                }}
                                options={getTypeRooms()}
                                classNamePrefix="select2-selection"
                            />
                        </div>
                        <div className="col-md-4 col-sm-12 mb-3">
                            <label htmlFor="voucherNumber" className="form-label">Precio por noche</label>
                            <input className="form-control" type="number" id="voucherNumber" value={price} onChange={(e) => { setPrice(e.target.value) }} />
                        </div>
                        <div className="col-md-4 col-sm-12 mb-3">
                            <label htmlFor="voucherNumber" className="form-label">Descripción de habitación</label>
                            <input className="form-control" type="text" id="voucherNumber" value={description} onChange={(e) => { setDescription(e.target.value) }} />
                        </div>
                        <div className="col-md-4 col-sm-12 mb-3">
                            <label htmlFor="supplier" className="form-label">* Estado</label>
                            <Select
                                id="supplier"
                                value={stateRoom}
                                onChange={(e) => {
                                    setStateRoom(e);
                                }}
                                options={stateRooms}
                                classNamePrefix="select2-selection"
                            />
                        </div>

                    </Row>

                    <Row>
                        <div className="col-md-4 col-sm-12">
                            <Card className="p-2">
                                <CardBody>
                                    <Row>
                                        <div className="col mb-2">
                                            Comodidades
                                        </div>
                                    </Row>
                                    <div className="row row-cols-lg-auto g-3 align-items-center">
                                        <div className="col-12 mb-1">
                                            <Select
                                                value={amenities}
                                                onChange={(e) => {
                                                    handleAmenities(e);
                                                }}
                                                options={getAmenities()}
                                                placeholder="Comodidad"
                                                classNamePrefix="select2-selection"
                                            />
                                        </div>
                                        <div className="col-12 mb-1">
                                            <button type="submit" className="btn btn-outline-primary" onClick={() => { addAmenities() }}>
                                                Agregar
                                            </button>
                                        </div>
                                    </div>
                                    <Row>
                                        <ListInfo data={amenitiesList} headers={['Comodidad', 'Descripción']} keys={['nombre', 'descripcion']} enableEdit={false} enableDelete={true} actionDelete={eliminarAmenities} mainKey={'nombre'} secondKey={'descripcion'} />
                                    </Row>
                                </CardBody>
                            </Card>
                        </div>
                    </Row>

                </Container>
            </div>
        </React.Fragment>
    )
}

export default NewRoom;