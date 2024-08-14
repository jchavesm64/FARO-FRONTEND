import React, { useState } from 'react'
import { Card, CardBody, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../../components/Common/Breadcrumb';
import { useQuery } from '@apollo/client';
import { OBTENER_CLIENTES } from '../../../services/ClienteService';
import Autosuggest from 'react-autosuggest'
import { Link } from 'react-router-dom';
import { OBTENER_HABITACIONES_DISPONIBLES } from '../../../services/HabitacionesService';

const NewBooking = ({ ...props }) => {
    document.title = "Nueva Reserva | FARO";

    const [filter, setFilter] = useState('')
    const { data: data_clientes } = useQuery(OBTENER_CLIENTES, { pollInterval: 1000 });
    const { data: data_RoomsAvailable } = useQuery(OBTENER_HABITACIONES_DISPONIBLES, { pollInterval: 1000 });

    const [customer, setCustomer] = useState(null)
    const [customers, setCustomers] = useState([])
    const [bookingDate] = useState(`${new Date().getFullYear()}-${(new Date().getMonth() + 1) > 10 ? (new Date().getMonth() + 1) : '0' + (new Date().getMonth() + 1)}-${new Date().getDate() > 10 ? new Date().getDate() : '0' + new Date().getDate()}`)

    const [disableSave, setDisableSave] = useState(true);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [roomsAvailable] = useState(data_RoomsAvailable.obteberHabitacionesDisponibles);


    function getFilteredByKey(key, value) {
        const valName = key.nombre.toLowerCase()
        const valCode = key.codigo.toLowerCase()
        const val = value.toLowerCase()


        if (valName.includes(val) || valCode.includes(val)) {
            return key
        }

        return null
    }

    const getData = () => {
        if (data_clientes) {
            if (data_clientes.obtenerClientes) {
                return data_clientes.obtenerClientes.filter((value, index) => {
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
            setFilter(e.target.value)
            setCustomers(getData())
            return
        } else {
            setFilter('')
            setCustomers([])
        }

    }

    const selectClient = (c) => {
        setCustomer(c)
        setFilter('')
        setCustomers([])
    }

    const searchClient = () => {
        setFilter('')
        setCustomer(getData())
    }

    const onClickSave = async () => { }
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Nueva Reserva" breadcrumbItem="Reservas" breadcrumbItemUrl='/reception/availability' />
                    <Row>
                        <div className="col mb-3 text-end">
                            <button type="button" className="btn btn-primary waves-effect waves-light" disabled={disableSave} onClick={() => onClickSave()}>
                                Guardar{" "}
                                <i className="ri-save-line align-middle ms-2"></i>
                            </button>
                        </div>
                    </Row>
                    <Row className="flex" style={{ alignItems: 'flex-end' }}>
                        <div className="col-md-10 mb-3">
                            <label
                                htmlFor="search-input"
                                className="col-md-2 col-form-label"
                            >
                                Busca el cliente
                            </label>
                            <input
                                className="form-control"
                                id="search-input"
                                value={filter}
                                onChange={handleInputChange}
                                type="search"
                                placeholder="Escribe el nombre o identificación del cliente" />
                        </div>
                        <div className="col-md-2 col-sm-12 mb-3">
                            <button type="button" className="btn btn-primary waves-effect waves-light" onClick={() => searchClient()}>
                                Buscar{" "}
                                <i className="ri-search-line align-middle ms-2"></i>
                            </button>
                        </div>

                    </Row>
                    <Row>
                        {customers.length > 0 ? (

                            <ul className="list-group form-control ontent-scroll p-3 mb-3 border" style={{ zIndex: 1000, maxHeight: '300px', overflowY: 'auto' }}>
                                {customers.map((customer, index) => (
                                    <li
                                        key={customer.id}
                                        onClick={() => selectClient(customer)}
                                        className='ist-group-item list-group-item-action rounded p-2'
                                        style={{
                                            backgroundColor: hoveredIndex === index ? '#0BB197' : '#fff',
                                            listStyleType: 'none',
                                            cursor: 'pointer',
                                        }}
                                        onMouseEnter={() => setHoveredIndex(index)}
                                        onMouseLeave={() => setHoveredIndex(null)}
                                    >
                                        {customer.nombre}
                                    </li>
                                ))}
                            </ul>

                        ) : filter !== '' && (

                            <div className="col-md-3 col-sm-12 mb-3">
                                <label>No existe el cliente, ¿Desea crear uno?</label>
                                <Link to="/hotelsettings/newamenities">
                                    <button
                                        type="button"
                                        className="btn btn-primary waves-effect waves-light"
                                        style={{ width: '100%' }}
                                    >
                                        Nuevo cliente{" "}
                                        <i className="mdi mdi-plus align-middle ms-2"></i>
                                    </button>
                                </Link>
                            </div>
                        )}

                    </Row>
                    {customer ? (
                        <div>
                            <Card>
                                <CardBody className="text-muted">
                                    <h5 className="mb-2">{customer.nombre}</h5>
                                    <p className="mb-2 fw-bold">Identificación: <span className='fw-normal'>{customer.codigo}</span></p>
                                    <p className="mb-2 fw-bold">Fecha de reserva: <span className='fw-normal'>{bookingDate}</span></p>
                                </CardBody>
                            </Card>
                        </div>
                    ) : filter === '' && (<label>Debe buscar un cliente</label>)}
                </Container>
            </div>
        </React.Fragment>
    )
}

export default NewBooking;