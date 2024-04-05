import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Container, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { infoAlert } from "../../helpers/alert";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate } from 'react-router-dom';
import SpanSubtitleForm from "../../components/Forms/SpanSubtitleForm";
import ButtonIconTable from "../../components/Common/ButtonIconTable";
import { OBTENER_UBICACIONES } from "../../services/UbicacionService";
import { SAVE_PUESTO_LIMPIEZA } from "../../services/PuestoLimpiezaService";


const NewCleaningJob = (props) => {
    document.title = "Puestos de limpieza | FARO";

    const navigate = useNavigate();

    const [insertar] = useMutation(SAVE_PUESTO_LIMPIEZA);

    const [nombre, setNombre] = useState('')
    const [codigo, setCodigo] = useState('')
    const [ubicacion, setUbicacion] = useState(null)
    const [lineas, setLineas] = useState([])
    const [areaNombre, setAreaNombre] = useState('')
    const [modoLinea, setModoLinea] = useState('Agregar')
    const [indexEditar, setIndexEditar] = useState(null)


    const { loading: load_ubicaciones, data: data_ubicaciones } = useQuery(OBTENER_UBICACIONES, { pollInterval: 1000 })

    const getUbicaciones = () => {
        const ubicaciones = []
        if (data_ubicaciones) {
            data_ubicaciones.obtenerUbicaciones.map(item => {
                ubicaciones.push({
                    "label": item.nombre,
                    "value": item.id
                })
            })
        }
        return ubicaciones
    }

    const limpiarLinea = () => {
        setAreaNombre('')
        setIndexEditar(null)
        setModoLinea('Agregar')
    }

    const eliminarLinea = (index) => {
        setLineas(lineas.filter((l, i) => i !== index))
    }

    const editarLinea = (linea, index) => {
        setIndexEditar(index)
        setAreaNombre(linea.nombre)
        setModoLinea('Editar')
    }

    const disabledSaveLine = () => {
        if (!areaNombre || areaNombre === null || areaNombre.trim().length === 0) {
            return true
        }
        return false
    }


    const guardarLinea = () => {
        if (modoLinea === 'Agregar') {
            const existe = lineas.find(l => l.nombre === areaNombre)
            if (existe) {
                infoAlert('Oops', 'Ya existe una área con ese nombre', 'warning', 3000, 'top-end')
                return
            }

            const obj = {
                nombre: areaNombre,
            }
            setLineas([...lineas, obj])
            limpiarLinea()
        } else {
            const obj = {
                nombre: areaNombre,
            }
            setLineas(lineas.map((l, i) => {
                if (i !== indexEditar) {
                    return l
                } else {
                    return obj
                }
            }))
            limpiarLinea()
        }
    }

    const [disableSave, setDisableSave] = useState(true);

    useEffect(() => {
        setDisableSave(!nombre || nombre === null || nombre.trim().length === 0 || lineas.length <= 0 || !codigo || codigo === null || codigo.trim().length === 0 || !ubicacion)
    }, [nombre, codigo, ubicacion, lineas])


    const onSave = async () => {
        try {
            setDisableSave(true)
            const input = {
                nombre,
                ubicacion: ubicacion.value,
                codigo,
                areas: lineas,
                estado: 'ACTIVO'
            }
            const { data } = await insertar({ variables: { input }, errorPolicy: 'all' });
            const { estado, message } = data.insertarPuestoLimpieza;

            if (estado) {
                infoAlert('Excelente', message, 'success', 3000, 'top-end')
                navigate(`/cleaningjobs`);
            } else {
                infoAlert('Oops', message, 'error', 3000, 'top-end')
            }
            setDisableSave(false)
        } catch (error) {
            console.log(error);
            infoAlert('Oops', 'Ocurrió un error inesperado al guardar el puesto de limpieza', 'error', 3000, 'top-end')
            setDisableSave(false)
        }
    }

    if (load_ubicaciones) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title='Puesto de limpieza nuevo' breadcrumbItem='Puestos de limpieza' breadcrumbItemUrl='/cleaningjobs' />
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
                    <Breadcrumbs title='Puesto de limpieza nuevo' breadcrumbItem='Puestos de limpieza' breadcrumbItemUrl='/cleaningjobs' />
                    <Row>
                        <div className="col mb-3 text-end">
                            <button disabled={disableSave} onClick={onSave} type="button" className="btn btn-primary waves-effect waves-light" >
                                Guardar{" "}
                                <i className="ri-save-line align-middle ms-2"></i>
                            </button>
                        </div>
                    </Row>
                    <Row>
                        <div className="col-md-5 col-sm-12 mb-3">
                            <Row>
                                <div className="col mb-3">
                                    <SpanSubtitleForm subtitle='Información general' />
                                </div>
                            </Row>
                            <Row>
                                <div className="col mb-3">
                                    <label htmlFor="nombre" className="form-label">* Nombre</label>
                                    <input className="form-control" type="text" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                                </div>
                            </Row>
                            <Row>
                                <div className="col mb-3">
                                    <label htmlFor="ubicacion" className="form-label">* Ubicación</label>
                                    <Select
                                        id="ubicacion"
                                        value={ubicacion}
                                        onChange={(e) => {
                                            setUbicacion(e);
                                        }}
                                        options={getUbicaciones()}
                                        classNamePrefix="select2-selection"
                                        isSearchable={true}
                                        menuPosition="fixed"
                                    />
                                </div>
                            </Row>
                            <Row>
                                <div className="col mb-3">
                                    <label htmlFor="codigo" className="form-label">* Código</label>
                                    <input className="form-control" type="text" id="codigo" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
                                </div>
                            </Row>
                        </div>
                        <div className="col-md-7 col-sm-12 mb-3">
                            <Row className="align-items-center">
                                <div className="col mb-3">
                                    <SpanSubtitleForm subtitle='Áreas a atender' />
                                </div>
                            </Row>
                            <Row className="align-items-end">
                                <div className="col-md-8 col-sm-12 mb-3">
                                    <label htmlFor='areaNombre'>
                                        Nombre de área
                                    </label>
                                    <input id='areaNombre' value={areaNombre} onChange={(e) => setAreaNombre(e.target.value)} placeholder='Nombre de área' type='text' className='form-control' />
                                </div>
                                <div className="col-md-3 col-sm-12 mb-3">
                                    {
                                        modoLinea === 'Agregar' ?
                                            <button style={{ width: '100%' }} type="button" className="btn btn-outline-secondary waves-effect waves-light" disabled={disabledSaveLine()} onClick={() => guardarLinea()}>
                                                Agregar{" "}
                                                <i className="ri-add-line align-middle"></i>
                                            </button>
                                            :
                                            <button style={{ width: '100%' }} type="button" className="btn btn-outline-secondary waves-effect waves-light" disabled={disabledSaveLine()} onClick={() => guardarLinea()}>
                                                Guardar{" "}
                                                <i className="ri-save-line align-middle"></i>
                                            </button>
                                    }
                                </div>
                                <div className="col-1 mb-3">
                                    <button type="button" className="btn btn-outline-secondary waves-effect waves-light" onClick={limpiarLinea}>
                                        <i className="ri-delete-bin-line align-middle"></i>
                                    </button>
                                </div>
                            </Row>
                            <Row>
                                <div className='col mt-3 mb-3'>
                                    <div className="table-responsive">
                                        <table className="table">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Nombre de área</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    lineas.length > 0 && lineas.map((linea, index) => (
                                                        <tr key={index}>
                                                            <td>{linea.nombre}</td>
                                                            <td>
                                                                <div className="d-flex justify-content-end mx-1 my-1">
                                                                    <ButtonIconTable icon='mdi mdi-pencil' color='warning' onClick={() => { editarLinea(linea, index) }} />
                                                                    <ButtonIconTable icon='mdi mdi-delete' color='danger' onClick={() => { eliminarLinea(index) }} />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </Row>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default NewCleaningJob;
