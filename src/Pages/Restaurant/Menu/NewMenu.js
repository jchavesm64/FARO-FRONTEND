import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Card, CardBody, Container, Row } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { infoAlert } from "../../../helpers/alert";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate } from 'react-router-dom';
import { GUARDAR_MENU } from "../../../services/MenuService";
import SpanSubtitleForm from "../../../components/Forms/SpanSubtitleForm";
import { OBTENER_MATERIAS_PRIMAS } from "../../../services/MateriaPrimaService";
import ButtonIconTable from "../../../components/Common/ButtonIconTable";
import { OBTENER_TIPOS_PLATILLO } from "../../../services/TipoPlatilloService";
import { OBTENER_TIPOS_MENU } from "../../../services/TipoMenuService";


const NewMenu = (props) => {
    document.title = "Menu | FARO";

    const navigate = useNavigate();

    const [insertar] = useMutation(GUARDAR_MENU);
    const { loading: load_materia_prima, error: error_productos, data: data_productos } = useQuery(OBTENER_MATERIAS_PRIMAS, { variables: { tipo: 'Restaurante' }, pollInterval: 1000 })
    const { loading: load_tipos_platillo, error: error_tipos_platillo, data: data_tipos_platillo } = useQuery(OBTENER_TIPOS_PLATILLO, { pollInterval: 1000 })
    const { loading: load_tipos_menu, error: error_tipos_menu, data: data_tipos_menu } = useQuery(OBTENER_TIPOS_MENU, { pollInterval: 1000 })

    const [nombre, setNombre] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [tipoPlatillo, setTipoPlatillo] = useState(null)
    const [tiposMenu, setTiposMenu] = useState([])
    const [ganancia, setGanancia] = useState(0)
    const [precioCosto, setPrecioCosto] = useState(0)

    const [producto, setProducto] = useState(null)
    const [cantidad, setCantidad] = useState(0)
    const [modoLinea, setModoLinea] = useState('Agregar')
    const [indexEditar, setIndexEditar] = useState(null)

    const [lineasMenu, setLineasMenu] = useState([])
    const [dishTypes, setDishTypes] = useState([])
    const [menuTypes, setMenuTypes] = useState([])

    useEffect(() => {
        if (lineasMenu.length > 0) {
            setPrecioCosto(lineasMenu.reduce((acc, l) => acc + (l.producto.precioCompra * l.cantidad), 0))
        } else {
            setPrecioCosto(0)
        }
    }, [lineasMenu])

    useEffect(() => {
        if (data_tipos_platillo?.obtenerTiposPlatillo) {
            const datos = [];
            data_tipos_platillo.obtenerTiposPlatillo.map(item => {
                datos.push({
                    label: item.nombre,
                    value: item.id
                });
            });
            setDishTypes(datos)
        }
    }, [data_tipos_platillo])

    useEffect(() => {
        if (data_tipos_menu?.obtenerTiposMenu) {
            const datos = [];
            data_tipos_menu.obtenerTiposMenu.map(item => {
                datos.push({
                    label: item.nombre,
                    value: item.id
                });
            });
            setMenuTypes(datos)
        }
    }, [data_tipos_menu])

    const getProductos = () => {
        const datos = [];
        if (data_productos?.obtenerMateriasPrimas) {
            data_productos.obtenerMateriasPrimas.map(item => {
                datos.push({
                    "value": item,
                    "label": item.nombre
                });
            });
        }
        return datos;
    }

    const onChangeProducto = (p) => {
        if (p) {
            setProducto(p)
            setCantidad(1)
        } else {
            limpiarLinea()
        }

    }

    const limpiarLinea = () => {
        setCantidad(0)
        setProducto(null)
        setIndexEditar(null)
        setModoLinea('Agregar')
    }

    const eliminarLinea = (index) => {
        setLineasMenu(lineasMenu.filter((l, i) => i !== index))
    }

    const editarLinea = (linea, index) => {
        setIndexEditar(index)
        setCantidad(linea.cantidad)
        setProducto({ value: linea.producto, label: linea.producto.nombre })
        setModoLinea('Editar')
    }

    const disabledSaveLine = () => {
        if (!producto || producto === null || !cantidad || (cantidad && cantidad < 0)) {
            return true
        }
        return false
    }


    const guardarLinea = () => {
        if (modoLinea === 'Agregar') {
            const existe = lineasMenu.find(l => l.producto.id === producto.value.id)
            if (existe) {
                infoAlert('Oops', 'Ya existe una línea con ese producto', 'warning', 3000, 'top-end')
                return
            }

            const obj = {
                producto: producto.value,
                cantidad: parseFloat(cantidad)
            }
            setLineasMenu([...lineasMenu, obj])
            limpiarLinea()
        } else {
            const obj = {
                producto: producto.value,
                cantidad: parseFloat(cantidad)
            }
            setLineasMenu(lineasMenu.map((l, i) => {
                if (l.producto.id !== producto.value.id) {
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
        setDisableSave(!nombre || nombre === null || nombre.trim().length === 0 ||
            lineasMenu.length <= 0 || !tipoPlatillo || tipoPlatillo === null ||
            ganancia < 0 || !tiposMenu || tiposMenu.length <= 0)
    }, [nombre, lineasMenu, tipoPlatillo, ganancia, tiposMenu])


    const onSave = async () => {
        try {
            setDisableSave(true)
            const input = {
                estado: 'ACTIVO',
                nombre: nombre,
                descripcion: descripcion,
                precioCosto: precioCosto,
                tipoPlatillo: tipoPlatillo.value,
                porcentajeGanancia: ganancia,
                tipoMenu: tiposMenu.map(t => t.value)
            }

            const lineasInput = lineasMenu.map((l, i) => {
                return {
                    producto: l.producto.id,
                    cantidad: l.cantidad
                }
            })

            const { data } = await insertar({ variables: { input, lineasInput }, errorPolicy: 'all' });
            const { estado, message } = data.insertarMenu;
            if (estado) {
                infoAlert('Excelente', message, 'success', 3000, 'top-end')
                navigate(`/restaurant/menu`);
            } else {
                infoAlert('Oops', message, 'error', 3000, 'top-end')
            }
            setDisableSave(false)
        } catch (error) {
            console.log(error);
            infoAlert('Oops', `Ocurrió un error inesperado al guardar ${nombre}`, 'error', 3000, 'top-end')
        }
    }

    if (load_materia_prima) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title='Plato nuevo' breadcrumbItem='Menú' breadcrumbItemUrl='/restaurant/menu' />
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
                    <Breadcrumbs title='Plato nuevo' breadcrumbItem='Menú' breadcrumbItemUrl='/restaurant/menu' />
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
                                    <label htmlFor="tipoPlatillo" className="form-label">* Tipo Platillo</label>
                                    <Select
                                        id="tipoPlatillo"
                                        value={tipoPlatillo}
                                        onChange={(e) => {
                                            setTipoPlatillo(e);
                                        }}
                                        options={dishTypes}
                                        classNamePrefix="select2-selection"
                                        isSearchable={true}
                                        menuPosition="fixed"
                                    />
                                </div>
                            </Row>
                            <Row>
                                <div className="col-md-12 col-sm-12 mb-3">
                                    <label htmlFor="tipoPlatillo" className="form-label">* Tipos de Menu</label>
                                    <Select
                                        options={menuTypes}
                                        classNamePrefix="select2-selection"
                                        isMulti={true}
                                        menuPosition="fixed"
                                        value={tiposMenu}
                                        placeholder="Seleccione los tipos de menu a los que pertenece"
                                        onChange={(e) => { setTiposMenu(e) }}
                                        isClearable={true}
                                        isSearchable={true}
                                    />
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
                                    <label htmlFor="descripcion" className="form-label">Descripción</label>
                                    <textarea className="form-control" type="text" id="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)}></textarea>
                                </div>
                            </Row>
                            <Row>
                                <div className="col mb-3">
                                    <label htmlFor="ganancia" className="form-label">* % de ganancia</label>
                                    <input className="form-control" type="number" id="ganancia" value={ganancia} onChange={(e) => setGanancia(e.target.value)} />
                                </div>
                            </Row>
                        </div>
                        <div className="col-md-7 col-sm-12 mb-3">
                            <Row className="align-items-center">
                                <div className="col mb-3">
                                    <SpanSubtitleForm subtitle='Ingredientes' />
                                </div>
                            </Row>
                            <Row className="align-items-end">
                                <div className="col-md-5 col-sm-12 mb-3">
                                    <label htmlFor='productoLinea'>* Producto</label>
                                    <Select
                                        menuPosition="fixed"
                                        isDisabled={modoLinea === 'Editar'}
                                        id='productoLinea'
                                        placeholder="Producto"
                                        value={producto}
                                        options={getProductos()}
                                        isSearchable={true}
                                        isClearable={true}
                                        onChange={(e) => onChangeProducto(e)}
                                    />
                                </div>
                                <div className="col-md-3 col-sm-12 mb-3">
                                    <label htmlFor='cantidadLinea'>
                                        * Cantidad
                                    </label>
                                    <input id='cantidadLinea' value={cantidad} onChange={(e) => setCantidad(e.target.value)} placeholder='Cantidad' type='number' className='form-control' />
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
                                <div className='col mt-3'>
                                    <div className="table-responsive">
                                        <table className="table">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Producto</th>
                                                    <th>Cantidad</th>
                                                    <th>Unidad</th>
                                                    <th>Costo</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    lineasMenu.length > 0 && lineasMenu.map((linea, index) => (
                                                        <tr key={index}>
                                                            <td>{linea.producto.nombre}</td>
                                                            <td>{linea.cantidad}</td>
                                                            <td>{linea.producto.unidad}</td>
                                                            <td>{'₡' + linea.producto.precioCompra * linea.cantidad}</td>
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
                            <Row className="d-flex align-center">
                                <div className="bg-white col-12">
                                    {'Total: ₡ ' + lineasMenu.reduce((acc, l) => acc + (l.producto.precioCompra * l.cantidad), 0)}
                                </div>
                                <div className="bg-white col-12">
                                    {'Precio de venta: ₡ ' + (precioCosto + (precioCosto * (ganancia / 100))).toFixed(2)}
                                </div>
                            </Row>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default NewMenu;
