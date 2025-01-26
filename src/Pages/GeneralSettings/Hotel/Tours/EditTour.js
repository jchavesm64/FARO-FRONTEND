import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../../../components/Common/Breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import Select from "react-select";
import { OBTENER_TOUR, UPDATE_TOUR } from "../../../../services/TourService";
import { infoAlert } from "../../../../helpers/alert";
import { typeTours } from "../../../../constants/routesConst";


const EditTour = ({ idBooking, updateTourBooking }) => {
    document.title = "Tours | FARO";
    const navigate = useNavigate();

    const { id } = useParams();
    const { loading: loadingTour, error: errorTour, data: dataTour, startPolling, stopPolling } = useQuery(OBTENER_TOUR, { variables: { id: idBooking ? idBooking : id }, pollInterval: 1000 });
    const [actualizar] = useMutation(UPDATE_TOUR);

    useEffect(() => {
        startPolling(1000)
        return () => {
            stopPolling()
        }
    }, [startPolling, stopPolling]);


    const [disableSave, setDisableSave] = useState(true);
    const [typeTour, setTypeTour] = useState(null);
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');



    useEffect(() => {
        if (dataTour) {
            setTypeTour({
                label: dataTour?.obtenerTour?.tipo,
                value: dataTour?.obtenerTour?.tipo
            });
            setName(dataTour?.obtenerTour?.nombre);
            setPrice(dataTour?.obtenerTour?.precio);
            setDescription(dataTour?.obtenerTour?.descripcion);
        }
    }, [dataTour])

    useEffect(() => {
        setDisableSave(!typeTour || price <= 0 || name === '')
    }, [typeTour, price, name])

    const cleanData = () => {
        setTypeTour(null);
        setName('');
        setPrice(0);
        setDescription('');
    }

    const onClickSave = async () => {
        try {
            setDisableSave(true);

            const input = {
                tipo: typeTour.value,
                nombre: name,
                precio: price,
                descripcion: description,
                estado: "ACTIVO"
            };
            
            if (!idBooking) {
                const { data } = await actualizar({ variables: { id, input }, errorPolicy: 'all' });
                const { estado, message } = data.actualizarTour;
                if (estado) {
                    infoAlert('Excelente', message, 'success', 3000, 'top-end');
                    cleanData();
                    navigate('/hotelsettings/tours');
                } else {
                    infoAlert('Oops', message, 'error', 3000, 'top-end')
                }
                setDisableSave(false)
            } else {
                infoAlert('Excelente', "Servicio actualizado para la reserva", 'success', 3000, 'top-end');
                updateTourBooking(input);
                cleanData();
            }
        } catch (error) {
            infoAlert('Oops', 'Ocurrió un error inesperado al guardar el tour', 'error', 3000, 'top-end')
            setDisableSave(false)
        }
    };


    if (loadingTour) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title="Editar Tour" breadcrumbItem="Tour" breadcrumbItemUrl='/hotelsettings/tours' />
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

    if (errorTour) {
        return null
    };

    return (
        <React.Fragment>
            <div className={!idBooking && "page-content"}>
                <Container fluid={true}>
                    {!idBooking && <Breadcrumbs title="Nuevo Tour" breadcrumbItem="Tour" breadcrumbItemUrl='/hotelsettings/tours' />}
                    <Card className='p-4'>
                        <Row>
                            <div className="col mb-3 text-end">
                                <button type="button" className="btn btn-primary waves-effect waves-light" disabled={disableSave} onClick={() => onClickSave()}>
                                    Guardar{" "}
                                    <i className="ri-save-line align-middle ms-2"></i>
                                </button>
                            </div>
                        </Row>
                        <Row className='d-flex justify-content-between shadow_service rounded-5 p-3'>
                            <Col className="col-md-6  d-flex justify-content-center flex-wrap">
                                <div className="col-md-11 col-sm-9 m-2">
                                    <label htmlFor="supplier" className="form-label">* Tipo de tour</label>
                                    <Select
                                        id="supplier"
                                        value={typeTour}
                                        onChange={(e) => {
                                            setTypeTour(e);
                                        }}
                                        options={typeTours}
                                        classNamePrefix="select2-selection"
                                    />
                                </div>
                                <div className="col-md-11 col-sm-9 m-2">
                                    <label htmlFor="nameTour" className="form-label" >Nombre del tour</label>
                                    <input className="form-control" type="text" id="nameTour" value={name} onChange={(e) => { setName(e.target.value) }} />
                                </div>
                                <div className="col-md-11 col-sm-9 m-2">
                                    <label htmlFor="priceTour" className="form-label" >Precio del tour</label>
                                    <input className="form-control" type="number" id="priceTour" value={price} onChange={(e) => { setPrice(e.target.value) }} />
                                </div>
                                <div className="col-md-11 col-sm-9 m-2">
                                    <label htmlFor="descripcion" className="form-label">Descripción</label>
                                    <textarea className="form-control" type="text" id="descripcion" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                                </div>
                            </Col>


                        </Row>
                    </Card>
                </Container>
            </div>
        </React.Fragment>
    );
};
export default EditTour;