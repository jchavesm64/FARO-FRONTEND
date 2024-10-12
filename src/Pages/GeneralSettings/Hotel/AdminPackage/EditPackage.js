import React, { useState, useEffect } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../../../components/Common/Breadcrumb";
import Select from "react-select";
import ListInfo from "../../../../components/Common/ListInfo";
import { useMutation, useQuery } from "@apollo/client";
import { OBTENER_TOURS } from "../../../../services/TourService";
import { infoAlert } from "../../../../helpers/alert";
import { OBTENER_SERVICIO } from "../../../../services/ServiciosExtraService";
import { useNavigate, useParams } from "react-router-dom";
import { OBTENER_PAQUETE, UPDATE_PAQUETE } from "../../../../services/PaquetesService";
import { OBTENER_TEMPORADAS } from "../../../../services/TemporadaService";
import TabeListService from "../../../../components/Common/TableListService";

const EditPackage = () => {
    document.title = "Administrador de paquetes | FARO";

    const navigate = useNavigate();
    const { id } = useParams();

    const { data: Tours } = useQuery(OBTENER_TOURS, { pollInterval: 1000 });
    const { data: services } = useQuery(OBTENER_SERVICIO, { pollInterval: 1000 });
    const { data: seasons } = useQuery(OBTENER_TEMPORADAS, { pollInterval: 1000 });
    const { loading: loading_paquete, error: error_paquete, data: data_paquete, startPolling, stopPolling } = useQuery(OBTENER_PAQUETE, { variables: { id: id }, pollInterval: 1000 });
    const [actualizar] = useMutation(UPDATE_PAQUETE);

    const [disableSave, setDisableSave] = useState(true);

    const [typePackage, setTypePackage] = useState(null);
    const [service, setService] = useState('');
    const [serviceList, setServiceList] = useState([]);
    const [tour, setTour] = useState(null);
    const [toursList, setToursList] = useState([]);
    const [season, setSeason] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);

    useEffect(() => {
        startPolling(1000)
        return () => {
            stopPolling()
        }
    }, [startPolling, stopPolling])

    const typePackages = [
        {
            label: 'Alojamiento',
            value: 'Alojamiento'
        },
        {
            label: 'Especiales',
            value: 'Especiales'
        },
        {
            label: 'Bienestar',
            value: 'Bienestar'
        },
        {
            label: 'Aventura',
            value: 'Aventura'
        },
        {
            label: 'Eventos',
            value: 'Eventos'
        },
        {
            label: 'Familiares',
            value: 'Familiares'
        },
        {
            label: 'Temporales',
            value: 'Temporales'
        },
        {
            label: 'Negocios',
            value: 'Negocios'
        }
    ];

    useEffect(() => {
        if (data_paquete) {
            console.log(data_paquete)
            setName(data_paquete.obtenerPaquete.nombre);
            setDescription(data_paquete.obtenerPaquete.descripcion);
            setToursList(data_paquete.obtenerPaquete.tours);
            setServiceList(data_paquete.obtenerPaquete.servicios);
            setSeason({
                label: data_paquete.obtenerPaquete.temporadas?.nombre,
                value: data_paquete.obtenerPaquete.temporadas
            });
            setPrice(data_paquete.obtenerPaquete.precio);
            setTypePackage(
                {
                    label: data_paquete.obtenerPaquete.tipo,
                    value: data_paquete.obtenerPaquete.tipo
                });
        }
    }, [data_paquete])

    const getTours = () => {
        const data = [];
        if (Tours?.obtenerTours) {
            Tours.obtenerTours.forEach((item) => {
                data.push({
                    "value": item,
                    "label": item.nombre
                });
            });
        }
        return data;
    };

    const handleTours = (a) => {
        setTour(a);
    };

    const addTour = () => {
        if (tour) {
            const exist = toursList.find(e => e.id === tour.value.id)
            if (exist) {
                infoAlert('Oops', 'Ya existe esta comodidad en la habitación', 'warning', 3000, 'top-end')
                setTour(null)
                return
            }

            setToursList([...toursList, tour.value])
            setTour(null)

        } else {
            infoAlert('Oops', 'No ha seleccionado una comodida', 'error', 3000, 'top-end')
        }
    };

    const eliminarTours = (nombre) => {
        setToursList(toursList.filter(a => a.nombre !== nombre))
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
    };

    const handleService = (a) => {
        setService(a);
    };

    const addService = () => {
        if (service) {
            const exist = serviceList.find(e => e.id === service.value.id)
            if (exist) {
                infoAlert('Oops', 'Ya existe esta comodidad en la habitación', 'warning', 3000, 'top-end')
                setService(null)
                return
            }

            setServiceList([...serviceList, service.value])
            setService(null)

        } else {
            infoAlert('Oops', 'No ha seleccionado una comodida', 'error', 3000, 'top-end')
        }
    };

    const eliminarService = (nombre) => {
        setServiceList(serviceList.filter(a => a.nombre !== nombre))
    };

    const getSeasons = () => {
        const data = []
        if (seasons?.obtenerTemporada) {
            seasons.obtenerTemporada.forEach((item) => {
                data.push({
                    "value": item,
                    "label": item.nombre
                });
            });
        }
        return data;
    };

    const handleSeason = (a) => {
        setSeason(a);
    };

    const handlePrice = (a) => {
        setPrice(a)
    };

    useEffect(() => {
        setDisableSave(!typePackage || price <= 0 || name === '' || (toursList.length === 0 && serviceList.length === 0) || !season)
    }, [typePackage, price, name, toursList, serviceList, season]);

    const cleanData = () => {
        setTypePackage(null);
        setName('');
        setPrice(0);
        setTour(null);
        setService(null);
        setServiceList([]);
        setToursList([]);
        setDescription('');
    };

    const updateAmountService = (type, amount, service) => {
        const newServiceList = serviceList
            .filter(s => !(Number(amount) === 0 && s.nombre === service.nombre)) // Eliminar si es 0
            .map(s => s.id === service.id
                ? { ...s, extra: amount !== '' ? Number(amount) : 0 }
                : s
            );

        setServiceList(newServiceList);
    };
    const onClickSave = async () => {
        try {
            setDisableSave(true);
            const input = {
                tipo: typePackage.value,
                nombre: name,
                servicios: serviceList,
                tours: toursList,
                temporadas: season.value.id,
                descripcion: description,
                precio: price,
                estado: 'ACTIVO'
            };

            const { data } = await actualizar({ variables: { id, input }, errorPolicy: 'all' });
            const { estado, message } = data.actualizarPaquete;
            if (estado) {
                infoAlert('Excelente', message, 'success', 3000, 'top-end');
                cleanData();
                navigate('/hotelsettings/hotelpackages');
            } else {
                infoAlert('Oops', message, 'error', 3000, 'top-end')
            }
            setDisableSave(false)

        } catch (error) {
            infoAlert('Oops', 'Ocurrió un error inesperado al guardar el paquete', 'error', 3000, 'top-end')
            setDisableSave(false)
        }
    };

    if (loading_paquete) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title="Editar tipo de paquete" breadcrumbItem="Paquete" breadcrumbItemUrl='/hotelsettings/hotelpackages' />
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

    if (error_paquete) {
        return null
    };


    return (
        <React.Fragment>
            <div className="page-content" >
                <Container fluid={true}>
                    <Breadcrumbs title="Nuevo paquete" breadcrumbItem="Paquetes" breadcrumbItemUrl='/hotelsettings/hotelpackages' />
                    <Card className='p-4'>
                        <Row >
                            <div className="col mb-3 text-end">
                                <button type="button" className="btn btn-primary waves-effect waves-light" disabled={disableSave} onClick={() => onClickSave()}>
                                    Guardar{" "}
                                    <i className="ri-save-line align-middle ms-2"></i>
                                </button>
                            </div>
                        </Row >
                        <Row className='d-flex justify-content-between shadow_wizard rounded-5'>
                            <Col className="col-md-6  d-flex justify-content-center flex-wrap">
                                <div className="col-md-11 col-sm-9 m-2">
                                    <label htmlFor="season" className="form-label">* Temporada</label>
                                    <Select
                                        id="season"
                                        value={season}
                                        onChange={(e) => {
                                            handleSeason(e);
                                        }}
                                        options={getSeasons()}
                                        placeholder="Temporadas"
                                        classNamePrefix="select2-selection"
                                    />
                                </div>
                                <div className="col-md-11 col-sm-9 m-2">
                                    <label htmlFor="package" className="form-label">* Tipo de paquete</label>
                                    <Select
                                        id="package"
                                        value={typePackage}
                                        onChange={(e) => {
                                            setTypePackage(e);
                                        }}
                                        options={typePackages}
                                        classNamePrefix="select2-selection"
                                    />
                                </div>
                                <div className="col-md-11 col-sm-9 m-2">
                                    <label htmlFor="name" className="form-label" >* Nombre del paquete</label>
                                    <input className="form-control" type="text" id="name" value={name} onChange={(e) => { setName(e.target.value) }} />
                                </div>
                                <div className="col-md-11 col-sm-9 m-1 p-0 mt-4">
                                    <Card className="p-0 table_list">
                                        <CardBody>
                                            <Row>
                                                <div className="col mb-2">
                                                    <label htmlFor="service" className="form-label">* Servicios</label>
                                                </div>
                                            </Row>
                                            <div className="row row-cols-lg-auto g-3 align-items-center">
                                                <div className="col-xl-9 col-md-12 mb-2">
                                                    <Select
                                                        id="service"
                                                        value={service}
                                                        onChange={(e) => {
                                                            handleService(e);
                                                        }}
                                                        options={getServices()}
                                                        placeholder="Servicios"
                                                        classNamePrefix="select2-selection"
                                                    />
                                                </div>
                                                <div className="col-12 mb-1">
                                                    <button type="submit" className="btn btn-outline-primary" onClick={() => { addService() }}>
                                                        Agregar
                                                    </button>
                                                </div>
                                            </div>
                                            <Row>
                                                <TabeListService data={serviceList} headers={['Servicio']} keys={['nombre']} enableAmount={true} enableDelete={true} actionDelete={eliminarService} actionAmount={updateAmountService} mainKey={'nombre'} type='package' amount='Cantidad' />
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </div>
                            </Col>
                            <Col className="col-md-6 d-flex justify-content-center flex-wrap">
                                <div className="col-md-11 col-sm-9 m-2">
                                    <label htmlFor="price" className="form-label" >* Precio por paquete</label>
                                    <input className="form-control" type="number" id="price" min="0" value={price} onChange={(e) => { handlePrice(e.target.value) }} />
                                </div>
                                <div className="col-md-11 col-sm-9 m-2">
                                    <label htmlFor="descripcion" className="form-label">Descripción</label>
                                    <textarea className="form-control" type="text" id="descripcion" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                                </div>
                                <div className="col-md-11 col-sm-9 m-1 p-0 ">
                                    <Card className="p-0 table_list">
                                        <CardBody >
                                            <Row>
                                                <div className="col mb-2">
                                                    <label htmlFor="tour" className="form-label">* Tours</label>
                                                </div>
                                            </Row>
                                            <div className="row row-cols-lg-auto g-3 align-items-center">
                                                <div className="col-xl-9 col-md-12 mb-2">
                                                    <Select
                                                        id="tour"
                                                        value={tour}
                                                        onChange={(e) => {
                                                            handleTours(e);
                                                        }}
                                                        options={getTours()}
                                                        placeholder="Tours"
                                                        classNamePrefix="select2-selection"
                                                    />
                                                </div>
                                                <div className="col-12 mb-1">
                                                    <button type="submit" className="btn btn-outline-primary" onClick={() => { addTour() }}>
                                                        Agregar
                                                    </button>
                                                </div>
                                            </div>
                                            <Row>
                                                <ListInfo data={toursList} headers={['Tour', 'Descripción']} keys={['nombre', 'descripcion']} enableEdit={false} enableDelete={true} actionDelete={eliminarTours} mainKey={'nombre'} secondKey={'descripcion'} />
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </div>
                            </Col>
                        </Row>
                    </Card>

                </Container>
            </div>
        </React.Fragment>
    )
};

export default EditPackage;