import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle, Col, Container, Label, Row } from "reactstrap";
import Breadcrumb from "../../components/Common/Breadcrumb";
import SpanSubtitleForm from "../../components/Forms/SpanSubtitleForm";
import Select from "react-select";
import { useMutation, useQuery } from '@apollo/client'
import { infoAlert } from "../../helpers/alert";
import { OBTENER_PROVEEDORES } from "../../services/ProveedorService";
import { OBTENER_CLIENTES } from "../../services/ClienteService";
import { OBTENER_USUARIOS_ACTIVOS } from "../../services/UsuarioService";
import { GUARDAR_REGISTRO_CONTABLE } from "../../services/RegistroContableService";
import { useNavigate, useParams } from 'react-router-dom';

const NewAccountsControl = (props) => {

    document.title = "Clientes | FARO";
    const { tipo } = useParams();

    const navigate = useNavigate();

    const [insertar] = useMutation(GUARDAR_REGISTRO_CONTABLE);
    const [contactsType, setContactsType] = useState('');
    const [accontType, setAccountsType] = useState(null);
    const { loading: load_proveedores, data: data_proveedores, startPolling: startPolling_proveedores, stopPolling: stopPolling_proveedores } = useQuery(OBTENER_PROVEEDORES, { pollInterval: 1000 })
    const { loading: load_clientes, data: data_clientes, startPolling: startPolling_clientes, stopPolling: stopPolling_clientes } = useQuery(OBTENER_CLIENTES, { pollInterval: 1000 })
    const { loading: load_usuarios, data: data_usuarios, startPolling: startPolling_usuarios, stopPolling: stopPolling_usuarios } = useQuery(OBTENER_USUARIOS_ACTIVOS, { pollInterval: 1000 })
    const [referenciaModelo, setReferenciaModelo] = useState('manual')
    const [cliente, setCliente] = useState(null)
    const [proveedor, setProveedor] = useState(null)
    const [usuario, setUsuario] = useState(null)
    const [monto, setMonto] = useState(0)
    const [fechaRegistro, setFechaRegistro] = useState(`${new Date().getFullYear()}-${(new Date().getMonth() + 1) > 10 ? (new Date().getMonth() + 1) : '0' + (new Date().getMonth() + 1)}-${new Date().getDate() > 10 ? new Date().getDate() : '0' + new Date().getDate()}`)

    useEffect(() => {
        const fechaActual = new Date().toISOString().split('T')[0];
        setFechaRegistro(fechaActual);
    }, []); // El array vacío asegura que este efecto se ejecute solo una vez al montar el componente

    useEffect(() => {
        if (tipo === 'PAGAR') {
            setAccountsType({ label: "Por pagar", value: "PAGAR" })
        } else {
            setAccountsType({ label: "Por cobrar", value: "COBRAR" })
        }
    }, [tipo])

    useEffect(() => {
        startPolling_proveedores(5000)
        startPolling_clientes(5000)
        startPolling_usuarios(5000)
        return () => {
            stopPolling_proveedores()
            stopPolling_clientes()
            stopPolling_usuarios()
        }
    }, [startPolling_proveedores, stopPolling_proveedores, startPolling_clientes, stopPolling_clientes, startPolling_usuarios, stopPolling_usuarios])



    const contactsTypes = [
        { label: "Usuario", value: "usuario" },
        { label: "Cliente", value: "cliente" },
        { label: "Proveedor", value: "proveedor" }
    ]

    const accontsTypes = [
        { label: "Por pagar", value: "PAGAR" },
        { label: "Por cobrar", value: "COBRAR" }
    ]

    function handleAccountType(selectedType) {
        setAccountsType(selectedType)
    }

    function handleContactType(selectedType) {
        setContactsType(selectedType)
        setCliente(null)
        setProveedor(null)
        setUsuario(null)
    }

    const getProveedores = () => {
        const datos = [];
        if (data_proveedores?.obtenerProveedores) {
            data_proveedores.obtenerProveedores.map(item => {
                datos.push({
                    "value": item,
                    "label": item?.empresa || ''
                });
            });
        }
        return datos;
    }

    const getClientes = () => {
        const datos = [];
        if (data_clientes?.obtenerClientes) {
            data_clientes.obtenerClientes.map(item => {
                datos.push({
                    "value": item,
                    "label": item?.nombre || ''
                });
            });
        }
        return datos;
    }

    const getUsuarios = () => {
        const datos = [];
        if (data_usuarios?.obtenerUsuariosActivos) {
            data_usuarios.obtenerUsuariosActivos.map(item => {
                datos.push({
                    "value": item,
                    "label": item?.nombre || ''
                });
            });
        }

        return datos;
    }

    const [disableSave, setDisableSave] = useState(true);

    useEffect(() => {
        setDisableSave(fechaRegistro === null || fechaRegistro.trim().length === 0 || monto === null || monto === 0 || (usuario === null && proveedor === null && cliente === null))
    }, [fechaRegistro, monto, usuario, proveedor, cliente])

    const onSaveAccount = async () => {
        try {
            setDisableSave(true)
            const input = {
                estado: 'ACTIVO',
                estadoRegistroContable: 'BORRADOR',
                fechaRegistro: fechaRegistro !== null && fechaRegistro.trim().length > 0 ? fechaRegistro + ' 00:00:00' : null,
                tipoRegistroContable: accontType.value,
                referenciaModelo: referenciaModelo,
                cliente: cliente !== null ? cliente.value.id : null,
                proveedor: proveedor !== null ? proveedor.value.id : null,
                usuario: usuario !== null ? usuario.value.id : null,
                monto: parseFloat(parseFloat(monto).toFixed(2)),
                cedula: localStorage.getItem('cedula')
            }
            const { data } = await insertar({ variables: { input }, errorPolicy: 'all' });
            const { estado, message, data: res } = data.insertarRegistroContable;
            if (estado) {
                infoAlert('Excelente', message, 'success', 3000, 'top-end')
                navigate(`/editaccountingcontrol/${accontType.value}/${res.id}`)
            } else {
                infoAlert('Oops', message, 'error', 3000, 'top-end')
            }
            setDisableSave(false)
        } catch (error) {
            infoAlert('Oops', 'Ocurrió un error inesperado al guardar el registro contable', 'error', 3000, 'top-end')
            setDisableSave(false)
        }
    }

    const getValueBeadcrum = () => {
        if (tipo === 'PAGAR') {
            return {
                value: 'Cuentas por pagar',
                url: '/accountspayable'
            }
        }
        return {
            value: 'Cuentas por cobrar',
            url: '/accountsreceivable'
        }
    }


    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumb title="Nuevo registro contable" breadcrumbItem={getValueBeadcrum().value} breadcrumbItemUrl={getValueBeadcrum().url} />
                    <Row>
                        <div className="col mb-3 text-end">
                            <button type="button" className="btn btn-primary waves-effect waves-light"
                                disabled={disableSave}
                                onClick={() => onSaveAccount()}>
                                Guardar{" "}
                                <i className="ri-save-line align-middle ms-2"></i>
                            </button>
                        </div>
                    </Row>
                    <div className="col-md-12 col-sm-12">
                        <Row>
                            <div className="col mb-3">
                                <SpanSubtitleForm subtitle='Información registro contable' />
                            </div>
                        </Row>
                        <Row>
                            <div className="col-md-3 col-sm-6 mb-3">
                                <Label>Tipo cuenta</Label>
                                <Select
                                    isDisabled={true}
                                    value={accontType}
                                    onChange={(e) => {
                                        handleAccountType(e);
                                    }}
                                    options={accontsTypes}
                                    classNamePrefix="select2-selection"
                                />
                            </div>

                            <div className="col-md-3 col-sm-6 mb-3">
                                <label htmlFor="id" className="form-label">Monto</label>
                                <input className="form-control" type="number"
                                    id="monto" pattern="[0-9]*" inputMode="numeric"
                                    value={monto} onChange={(e) => setMonto(parseFloat(e.target.value))} />
                            </div>

                            <div className="col-md-3 col-sm-6 mb-3">
                                <label htmlFor="id" className="form-label">Fecha registro</label>
                                <input className="form-control" type="date" id="idDate"
                                    value={fechaRegistro} onChange={(e) => { setFechaRegistro(e.target.value) }} />
                            </div>
                        </Row>

                        <Row>

                            <div className="col-md-3 col-sm-6 mb-3">
                                <Label>Tipo contacto</Label>
                                <Select
                                    menuPosition="fixed"
                                    value={contactsType}
                                    onChange={(e) => { handleContactType(e); }}
                                    options={contactsTypes}
                                    classNamePrefix="select2-selection"
                                    isClearable={false}
                                    isSearchable={true}
                                />
                            </div>

                            <div className="col-md-3 col-sm-6 mb-3">
                                {
                                    contactsType.value === 'cliente' &&
                                    <>
                                        <Label>Cliente</Label>
                                        <Select id='cliente' menuPosition="fixed"
                                            size="md" placeholder="Cliente" value={cliente}
                                            options={getClientes()} searchable={true}
                                            onChange={
                                                (e) => setCliente(e)
                                            } />
                                    </>
                                }
                                {
                                    contactsType.value === 'proveedor' &&
                                    <>
                                        <Label>Proveedor</Label>
                                        <Select id='proveedor' menuPosition="fixed"
                                            size="md" placeholder="Proveedor" value={proveedor}
                                            options={getProveedores()} searchable={true}
                                            onChange={
                                                (e) => setProveedor(e)
                                            }
                                        />
                                    </>
                                }
                                {
                                    contactsType.value === 'usuario' &&
                                    <>
                                        <Label>Usuario</Label>
                                        <Select id='usuario' menuPosition="fixed"
                                            size="md" placeholder="Usuario" value={usuario}
                                            options={getUsuarios()}
                                            onChange={
                                                (e) => setUsuario(e)
                                            } />
                                    </>
                                }
                            </div>

                        </Row>
                    </div>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default NewAccountsControl;