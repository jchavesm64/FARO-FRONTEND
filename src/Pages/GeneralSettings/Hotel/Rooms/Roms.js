import React, { useState } from 'react'
import { Card, CardBody, Container, Row } from "reactstrap";
import Breadcrumbs from '../../../../components/Common/Breadcrumb';
import { Link } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { DELETE_HABITACION, OBTENER_HABITACIONES } from '../../../../services/HabitacionesService';
import Swal from 'sweetalert2';
import { infoAlert } from '../../../../helpers/alert';
import DataList from '../../../../components/Common/DataList';

const Rooms = ({ ...props }) => {
    document.title = "Habitaciones | FARO";

    const [filter, setFilter] = useState('');
    const [modo] = useState('1')

    const { data: habitaciones } = useQuery(OBTENER_HABITACIONES, { pollInterval: 1000 });
    const [desactivar] = useMutation(DELETE_HABITACION);

    const onDeleteRooms = (id, numerohabitacion) => {
        Swal.fire({
            title: "Eliminar habitación",
            text: `¿Está seguro de eliminar la habitación ${numerohabitacion}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#0BB197",
            cancelButtonColor: "#FF3D60",
            cancelButtonText: 'Cancelar',
            confirmButtonText: "Sí, ¡eliminar!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { data } = await desactivar({ variables: { id } });
                const { estado, message } = data.desactivarHabitacion;
                if (estado) {
                    infoAlert('Habitacion eliminada', message, 'success', 3000, 'top-end')
                } else {
                    infoAlert('Eliminar habitación', message, 'error', 3000, 'top-end')
                }
            }
        });
    }

    function getFilteredByKey(modo, key, value) {
        const valName = key.nombre.toLowerCase()
        const val = value.toLowerCase()

        if (valName.includes(val)) {
            return key
        }

        return null
    }

    const getData = () => {
        if (habitaciones) {
            if (habitaciones.obtenerHabitaciones) {
                return habitaciones.obtenerHabitaciones.filter((value) => {
                    if (filter !== "" && modo !== "") {
                        return getFilteredByKey(modo, value, filter);
                    }
                    return value
                });
            }
        }
        return []
    }

    const data = getData();

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Habitaciones" breadcrumbItem="Ajustes generales Hotel" breadcrumbItemUrl="/hotelsettings" />
                    <Row className="flex" style={{ alignItems: 'flex-end' }}>
                        <div className="col-md-10 mb-3">
                            <label htmlFor="search-input" className="col-md-4 col-form-label">
                                Buscar habitacion
                            </label>
                            <input
                                className="form-control"
                                id="search-input"
                                type="search"
                                placeholder="Escribe el número de la habitación"
                                onChange={(e) => { setFilter(e.target.value) }}

                            />
                        </div>
                        <div className="col-md-2 col-sm-12 mb-3">
                            <Link to="/hotelsettings/newroom">
                                <button
                                    type="button"
                                    className="btn btn-primary waves-effect waves-light"
                                    style={{ width: '100%' }}
                                >
                                    Agregar{" "}
                                    <i className="mdi mdi-plus align-middle ms-2"></i>
                                </button>
                            </Link>
                        </div>
                    </Row>

                    <Row>
                        <div className="col mb-3">
                            <Card>
                                <CardBody>
                                    <DataList onDelete={onDeleteRooms} data={data} type="rooms" displayLength={9} {...props} />
                                </CardBody>
                            </Card>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default Rooms