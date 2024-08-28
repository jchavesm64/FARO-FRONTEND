import React, { useEffect, useState } from "react";
import { Card, CardBody, CardTitle, Col, Container, Label, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import Select from "react-select";
import SpanSubtitleForm from "../../components/Forms/SpanSubtitleForm";
import countriesJson from '../../store/json/countries.json'
import statesJson from '../../store/json/states.json'
import { infoAlert } from "../../helpers/alert";
import ListInfo from "../../components/Common/ListInfo";
import { useMutation } from "@apollo/client";
import { SAVE_CLIENTE } from "../../services/ClienteService";
import { useNavigate } from 'react-router-dom';


const NewCustomer = (props) => {
    document.title = "Clientes | FARO";
    console.log(props)

    const navigate = useNavigate();

    const [customerType, setCustomerType] = useState(null);
    const [customerId, setCustomerId] = useState('')
    const [customerName, setCustomerName] = useState('')
    const [billingName, setBillingName] = useState('')
    const [isSameAsCustomer, setIsSameAsCustomer] = useState(false)

    const [country, setCountry] = useState(null);
    const [countryState, setCountryState] = useState(null);
    const [city, setCity] = useState('')
    const [street, setStreet] = useState('')
    const [postalCode, setPostalCode] = useState('')
    const [address, setAddress] = useState('')


    const [code, setCode] = useState(null);
    const [socialMediaType, setSocialMediaType] = useState(null);

    const [insertar] = useMutation(SAVE_CLIENTE);

    const customerTypes = [
        {
            label: "Físico",
            value: "Físico"
        },
        {
            label: "Jurídico",
            value: "Jurídico"
        },
        {
            label: "Pasaporte",
            value: "Pasaporte"
        }
    ]

    const countriesOptions = () => {
        const countries = countriesJson.map(c => {
            return {
                label: c.name,
                value: c
            }
        });
        return countries;
    }

    const statesOptions = () => {
        if (country !== null) {
            const states = []
            statesJson.map(s => {
                if (s.id_country === country.value.id) {
                    states.push({
                        label: s.name,
                        value: s
                    })
                }
            })
            return states;
        }
        return []
    }

    const codes = countriesJson.map(c => ({ label: c.code, value: c.code }));
    const socialMediaTypes = [
        {
            label: 'Facebook',
            value: 'Facebook'
        },
        {
            label: 'X (Twitter)',
            value: 'X (Twitter)'
        },
        {
            label: 'Instagram',
            value: 'Instagram'
        }]

    function handleCustomerType(selectedType) {
        setCustomerType(selectedType)
    }

    const handleCountry = (c) => {
        if (!c) {
            setCountryState(null)
        }
        setCountry(c);
        setCode(c !== null ? c.value.code : null)

    }

    const handleCountryState = (s) => {
        setCountryState(s)
    }

    const handleCode = (c) => {
        setCode(c)
    }

    const handleSocialMediaType = (c) => {
        setSocialMediaType(c)
    }

    const handleOnClickIsSameAsCustomer = () => {
        setIsSameAsCustomer(!isSameAsCustomer)
        if (!isSameAsCustomer) {
            setBillingName(customerName)
        } else {
            setBillingName('')
        }
    }

    const handleSetCustomerName = (e) => {
        setCustomerName(e.target.value)
        if (isSameAsCustomer) {
            setBillingName(e.target.value)
        }
    }

    const [telefonos, setTelefonos] = useState([]);
    const [telefonoTemp, setTelefonoTemp] = useState('');
    const [correos, setCorreos] = useState([]);
    const [correoTemp, setCorreoTemp] = useState('');
    const [redes, setRedes] = useState([]);
    const [redTemp, setRedTemp] = useState('');
    const [ext, setExt] = useState('')
    const [description, setDescription] = useState('')


    const agregarTelefono = () => {
        if (code) {
            var band = false;
            telefonos.map(t => {
                if (t.telefono === code.value + ' ' + telefonoTemp) {
                    if (t.ext === ext || t.ext === undefined) {
                        band = true;
                    } else {
                        band = false;
                    }
                }
            })
            if (!band) {
                if (ext.trim().length === 0) {
                    setTelefonos([...telefonos, {
                        'telefono': `${code.value} ${telefonoTemp}`,
                        'descripcion': description
                    }])
                } else {
                    setTelefonos([...telefonos, {
                        'telefono': `${code.value} ${telefonoTemp}`,
                        'ext': `${ext}`,
                        'descripcion': description
                    }])
                }
                setTelefonoTemp('');
                setExt('');
                setDescription('');
            } else {
                infoAlert('Oops', 'Ese teléfono ya existe', 'error', 3000, 'top-end')
            }
        } else {
            infoAlert('Oops', 'No ha seleccionado el código', 'error', 3000, 'top-end')
        }
    }

    const eliminarTelefono = (telefono) => {
        console.log(telefonos.filter(e => e.telefono !== telefono))
        setTelefonos(telefonos.filter(e => e.telefono !== telefono))
    }


    const agregarCorreo = () => {
        if (/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(correoTemp)) {
            var band = false;
            correos.map(c => {
                if (c.email === correoTemp) {
                    band = true;
                }
            })
            if (!band) {
                setCorreos([...correos, {
                    "email": correoTemp
                }])
                setCorreoTemp('')
            } else {
                infoAlert('Oops', 'Ese correo ya existe', 'error', 3000, 'top-end')
            }
        } else {
            infoAlert('Oops', 'El formato del correo es incorrecto', 'error', 3000, 'top-end')
        }
    }

    const eliminarCorreo = (correo) => {
        setCorreos(correos.filter(e => e.email !== correo))
    }

    const agregarRedSocial = () => {
        if (socialMediaType) {
            var band = false
            redes.map(item => {
                if (item.red === socialMediaType.value && item.enlace === redTemp) {
                    band = true
                }
            })
            if (!band) {
                setRedes([...redes, {
                    'red': socialMediaType.value,
                    'enlace': redTemp
                }])
                setSocialMediaType(null)
                setRedTemp('')
            } else {
                infoAlert('Oops', 'Esa red social ya existe', 'error', 3000, 'top-end')
            }
        } else {
            infoAlert('Oops', 'No ha seleccionado el tipo de red social', 'error', 3000, 'top-end')
        }
    }

    const eliminarRed = (red, enlace) => {
        const mismaRed = redes.filter(e => e.red === red)
        const diferenteRed = redes.filter(e => e.red !== red)
        const diferentes = mismaRed.filter(e => e.enlace !== enlace)
        setRedes([...diferenteRed, ...diferentes])
    }

    const [disableSave, setDisableSave] = useState(true);

    useEffect(() => {
        setDisableSave(
            !customerType || customerName.trim().length === 0 || customerId.trim().length === 0
            || !country || !countryState || !city || (billingName.trim().length === 0 && !isSameAsCustomer)
        )
    }, [customerType, customerName, customerId, country, countryState, city, billingName, isSameAsCustomer])

    const onClickSave = async () => {
        try {
            setDisableSave(true)
            const input = {
                tipo: customerType.value,
                nombre: customerName,
                nombreFacturacion: billingName,
                codigo: customerId,
                pais: country.value.name,
                ciudad: countryState.value.name,
                city: city,
                calle: street,
                cp: postalCode,
                direccion: address,
                telefonos,
                correos,
                redes,
                estado: "ACTIVO"
            }

            const { data } = await insertar({ variables: { input }, errorPolicy: 'all' });
            const { estado, message } = data.insertarCliente;
            if (estado) {
                infoAlert('Excelente', message, 'success', 3000, 'top-end');
                debugger
                if (props.props.stateBooking) {
                    props.props.addNewCustomer(input)
                } else {

                    navigate('/customers');
                }
            } else {
                infoAlert('Oops', message, 'error', 3000, 'top-end')
            }
            setDisableSave(false)
        } catch (error) {
            infoAlert('Oops', 'Ocurrió un error inesperado al guardar el cliente', 'error', 3000, 'top-end')
            setDisableSave(false)
        }
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Cliente nuevo" breadcrumbItem="Clientes" breadcrumbItemUrl='/customers' />
                    <Row>
                        <div className="col mb-3 text-end">
                            <button type="button" className="btn btn-primary waves-effect waves-light" disabled={disableSave} onClick={() => onClickSave()}>
                                Guardar{" "}
                                <i className="ri-save-line align-middle ms-2"></i>
                            </button>
                        </div>
                    </Row>
                    <Row>
                        <div className="col-md-6 col-sm-12">
                            <Row>
                                <div className="col mb-3">
                                    <SpanSubtitleForm subtitle='Información personal' />
                                </div>
                            </Row>
                            <Row>
                                <div className="col-md-6 col-sm-12 mb-3">
                                    <Label>* Tipo de cliente</Label>
                                    <Select
                                        value={customerType}
                                        onChange={(e) => {
                                            handleCustomerType(e);
                                        }}
                                        options={customerTypes}
                                        classNamePrefix="select2-selection"
                                    />
                                </div>
                                <div className="col-md-6 col-sm-12 mb-3">
                                    <label htmlFor="id" className="form-label">* Identificación</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        id="id"
                                        value={customerId}
                                        placeholder="ej. 102340567"
                                        onChange={(e) => { setCustomerId(e.target.value) }}
                                    />
                                </div>
                            </Row>
                            <Row>
                                <div className="col-md-12 col-sm-12 mb-3">
                                    <label htmlFor="name" className="form-label">* Nombre</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        id="name"
                                        value={customerName}
                                        placeholder="ej. Juan Rafael Pérez Bolaños"
                                        onChange={(e) => { handleSetCustomerName(e) }}
                                    />
                                </div>
                            </Row>
                            <Row>
                                <div className="col-md-12 col-sm-12 mb-3 d-flex align-items-center">
                                    <div className="flex-grow-1">
                                        <label htmlFor="billingName" className="form-label">* Nombre de facturación</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            id="billingName"
                                            value={billingName}
                                            placeholder={isSameAsCustomer ? "ej. Juan Rafael Pérez Bolaños" : "ej. Juan Pérez"}
                                            disabled={isSameAsCustomer}
                                            onChange={(e) => { setBillingName(e.target.value) }}
                                        />
                                    </div>
                                    <div className="form-check ms-3 mt-4">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="isSameAsCustomer"
                                            readOnly
                                            checked={isSameAsCustomer}
                                            onClick={() => { handleOnClickIsSameAsCustomer() }}
                                        />
                                        <label htmlFor="isSameAsCustomer" className="form-check-label ms-2">Igual que Nombre</label>
                                    </div>
                                </div>
                            </Row>
                        </div>
                        <div className="col-md-6 col-sm-12">
                            <Row>
                                <div className="col mb-3">
                                    <SpanSubtitleForm subtitle='Dirección' />
                                </div>
                            </Row>
                            <Row>
                                <div className="col-md-6 col-sm-12 mb-3">
                                    <Label>* País</Label>
                                    <Select
                                        value={country}
                                        onChange={(e) => {
                                            handleCountry(e);
                                        }}
                                        options={countriesOptions()}
                                        classNamePrefix="select2-selection"
                                        isClearable={true}
                                    />
                                </div>
                                <div className="col-md-6 col-sm-12 mb-3">
                                    <Label>* Provincia/Estado</Label>
                                    <Select
                                        value={countryState}
                                        onChange={(e) => {
                                            handleCountryState(e);
                                        }}
                                        options={statesOptions()}
                                        classNamePrefix="select2-selection"
                                        isClearable={true}
                                    />
                                </div>
                            </Row>
                            <Row>
                                <div className="col-md-4 col-sm-12 mb-3">
                                    <label htmlFor="city" className="form-label">* Ciudad</label>
                                    <input
                                        className="form-control"
                                        type="text" id="city"
                                        value={city}
                                        placeholder="ej. San José"
                                        onChange={(e) => { setCity(e.target.value) }}
                                    />
                                </div>
                                <div className="col-md-4 col-sm-12 mb-3">
                                    <label htmlFor="street" className="form-label">Calle</label>
                                    <input
                                        className="form-control"
                                        type="text" id="street"
                                        value={street}
                                        placeholder="ej. Avenida Central, Calle 5"
                                        onChange={(e) => { setStreet(e.target.value) }}
                                    />
                                </div>
                                <div className="col-md-4 col-sm-12 mb-3">
                                    <label htmlFor="postalCode" className="form-label">Código postal</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        id="postalCode"
                                        value={postalCode}
                                        placeholder="ej. 10101"
                                        onChange={(e) => { setPostalCode(e.target.value) }}
                                    />
                                </div>
                            </Row>
                            <Row>
                                <div className="col-md-12col-sm-12 mb-3">
                                    <label htmlFor="address" className="form-label">Señas</label>
                                    <textarea
                                        className="form-control"
                                        type="text"
                                        id="address"
                                        value={address}
                                        placeholder="ej. Frente al Parque Central, Edificio Azul con Puertas Blancas"
                                        onChange={(e) => { setAddress(e.target.value) }}
                                    ></textarea>
                                </div>
                            </Row>
                        </div>
                    </Row>
                    <Row>
                        <div className="col-md-4 col-sm-12">
                            <Card className="p-2">
                                <CardBody>
                                    <Row>
                                        <div className="col mb-2">
                                            Teléfonos
                                        </div>
                                    </Row>
                                    <div className="row row-cols-lg-auto g-3 align-items-center">
                                        <div className=" mb-1">
                                            <Select
                                                value={code}
                                                onChange={(e) => {
                                                    handleCode(e);
                                                }}
                                                options={codes}
                                                placeholder="Código"
                                                classNamePrefix="select2-selection"
                                            />
                                        </div>
                                        <div className="mb-1">
                                            <label className="visually-hidden" htmlFor="phone">Teléfono</label>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                id="phone"
                                                placeholder="Teléfono"
                                                value={telefonoTemp}
                                                onChange={(e) => { setTelefonoTemp(e.target.value) }}
                                            />
                                        </div>
                                        <div className="col-lg-3 mb-1">
                                            <label className="visually-hidden" htmlFor="extension">Extensión</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="extension"
                                                placeholder="Extensión"
                                                value={ext}
                                                onChange={(e) => { setExt(e.target.value) }}
                                            />
                                        </div>
                                        <div className="mb-1">
                                            <label className="visually-hidden" htmlFor="description">Descripción</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="description"
                                                placeholder="Descripción"
                                                value={description}
                                                onChange={(e) => { setDescription(e.target.value) }}
                                            />
                                        </div>
                                        <div className="mb-1">
                                            <button type="submit" className="btn btn-outline-primary" onClick={() => { agregarTelefono() }}>
                                                Agregar
                                            </button>
                                        </div>
                                    </div>
                                    <Row>
                                        <ListInfo data={telefonos} headers={['Descripción', 'Teléfono', 'Extensión']} keys={['descripcion', 'telefono', 'ext']} enableEdit={false} enableDelete={true} actionDelete={eliminarTelefono} mainKey={'telefono'} />
                                    </Row>
                                </CardBody>
                            </Card>
                        </div>
                        <div className="col-md-4 col-sm-12">
                            <Card className="p-2">
                                <CardBody>
                                    <Row>
                                        <div className="col mb-2">
                                            Correo electrónico
                                        </div>
                                    </Row>
                                    <div className="row row-cols-lg-auto g-3 align-items-center">
                                        <div className="col-12 mb-1">
                                            <label className="visually-hidden" htmlFor="email">Correo</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                id="email"
                                                placeholder="ejemplo@correo.com"
                                                value={correoTemp}
                                                onChange={(e) => { setCorreoTemp(e.target.value) }}
                                            />
                                        </div>
                                        <div className="col-12 mb-1">
                                            <button type="submit" className="btn btn-outline-primary" onClick={() => { agregarCorreo() }}>
                                                Agregar
                                            </button>
                                        </div>
                                    </div>
                                    <Row>
                                        <ListInfo data={correos} headers={['Correo']} keys={['email']} enableEdit={false} enableDelete={true} actionDelete={eliminarCorreo} mainKey={'email'} />
                                    </Row>
                                </CardBody>
                            </Card>
                        </div>
                        <div className="col-md-4 col-sm-12">
                            <Card className="p-2">
                                <CardBody>
                                    <Row>
                                        <div className="col mb-2">
                                            Redes sociales
                                        </div>
                                    </Row>
                                    <div className="row row-cols-lg-auto g-3 align-items-center">
                                        <div className="col-12 mb-1">
                                            <Select
                                                value={socialMediaType}
                                                onChange={(e) => {
                                                    handleSocialMediaType(e);
                                                }}
                                                options={socialMediaTypes}
                                                placeholder="Red social"
                                                classNamePrefix="select2-selection"
                                            />
                                        </div>
                                        <div className="col-12 mb-1">
                                            <label className="visually-hidden" htmlFor="link">link</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="link"
                                                placeholder="URL de red social"
                                                value={redTemp}
                                                onChange={(e) => { setRedTemp(e.target.value) }}
                                            />
                                        </div>
                                        <div className="col-12 mb-1">
                                            <button type="submit" className="btn btn-outline-primary" onClick={() => { agregarRedSocial() }}>
                                                Agregar
                                            </button>
                                        </div>
                                    </div>
                                    <Row>
                                        <ListInfo data={redes} headers={['Red social', 'URL']} keys={['red', 'enlace']} enableEdit={false} enableDelete={true} actionDelete={eliminarRed} mainKey={'red'} secondKey={'enlace'} />
                                    </Row>
                                </CardBody>
                            </Card>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default NewCustomer;
