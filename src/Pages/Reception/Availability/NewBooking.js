import React, { useState } from 'react'
import { Card, CardBody, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../../components/Common/Breadcrumb';
import { useQuery } from '@apollo/client';
import { OBTENER_CLIENTES } from '../../../services/ClienteService';

const NewBooking = ({ ...props }) => {
    document.title = "Nueva Reserva | FARO";

    const [filter, setFilter] = useState('')
    const { loading: load_clientes, error: error_clientes, data: data_clientes } = useQuery(OBTENER_CLIENTES, { pollInterval: 1000 })

    const [customer, setCustomer] = useState(null)
    const [customers, setCustomers] = useState([])

    const [disableSave, setDisableSave] = useState(true);

    function getFilteredByKey(key, value) {
        const valType = key.tipo.toLowerCase()
        const valName = key.nombre.toLowerCase()
        const valCode = key.codigo.toLowerCase()
        const valCountry = key.pais.toLowerCase()
        const val = value.toLowerCase()
        const valEmail = key.correos?.some(correo => correo.email.includes(val));
        const valPhone = key.telefonos?.some(telefono => telefono.telefono.includes(val));


        if (valType.includes(val) || valName.includes(val) || valCode.includes(val) || valCountry.includes(val) || valEmail || valPhone) {
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
        }
        setFilter('')
        setCustomer([])

    }

    const onClickSave = async () => { }

    const searchClient = () => {
        setCustomer(getData())
    }
    console.log(customers)
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
                                placeholder="Escribe el tipo, nombre, identificación, país, correo o teléfono del cliente" />
                        </div>
                        <div className="col-md-2 col-sm-12 mb-3">
                            <button type="button" className="btn btn-primary waves-effect waves-light" onClick={() => searchClient()}>
                                Buscar{" "}
                                <i className="ri-search-line align-middle ms-2"></i>
                            </button>
                        </div>
                        <div >
                            {customers.length > 0 && (
                                <ul className="list-group position-absolute w-100" style={{ zIndex: 1000 }}>
                                    {customers.map((customer) => (
                                        <li
                                            key={customer.id}
                                            onClick={() => setCustomer(customer)}
                                            className='ist-group-item list-group-item-action cursor-pointer'
                                            style={{ backgroundColor: '#fff', listStyleType: 'none' }}
                                        >
                                            {customer.nombre}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>


                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default NewBooking;