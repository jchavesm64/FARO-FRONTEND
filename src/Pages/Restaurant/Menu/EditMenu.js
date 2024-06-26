import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Container, Row } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { infoAlert } from "../../../helpers/alert";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate } from 'react-router-dom';
import { ACTUALIZAR_MENU } from "../../../services/MenuService";
import SpanSubtitleForm from "../../../components/Forms/SpanSubtitleForm";
import { OBTENER_MATERIAS_PRIMAS } from "../../../services/MateriaPrimaService";
import ButtonIconTable from "../../../components/Common/ButtonIconTable";
import { ACTUALIZAR_LINEA_MENU, ELIMINAR_LINEA_MENU, INSERTAR_LINEA_MENU, OBTENER_LINEAS_MENU } from "../../../services/MenuLineaService";
import Swal from "sweetalert2";


const EditMenu = ({ props, menu }) => {
    document.title = "Menu | FARO";

    const navigate = useNavigate();

    const [actualizar] = useMutation(ACTUALIZAR_MENU);
    const [insertarLinea] = useMutation(INSERTAR_LINEA_MENU);
    const { loading: load_materia_prima, error: error_productos, data: data_productos } = useQuery(OBTENER_MATERIAS_PRIMAS, { variables: { tipo: 'Restaurante' }, pollInterval: 1000 })
    const { loading: load_lineas_menu, error: error_lineas_menu, data: data_lineas_menu, refetch: refetch_lineas } = useQuery(OBTENER_LINEAS_MENU, { variables: { id: menu.id }, pollInterval: 1000 })

    const [nombre, setNombre] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [tipo, setTipo] = useState(null)
    const [precioVenta, setPrecioVenta] = useState(0)

    const [producto, setProducto] = useState(null)
    const [cantidad, setCantidad] = useState(0)
    const [modoLinea, setModoLinea] = useState('Agregar')
    const [indexEditar, setIndexEditar] = useState(null)
    const [idEditar, setIdEditar] = useState(-1)

    const [lineasMenu, setLineasMenu] = useState([])
    const [desactivar] = useMutation(ELIMINAR_LINEA_MENU);
    const [actualizarLinea] = useMutation(ACTUALIZAR_LINEA_MENU);


    useEffect(() => {
        setNombre(menu.nombre)
        setDescripcion(menu.descripcion)
        setTipo({ label: menu.tipo, value: menu.tipo })
        setPrecioVenta(menu.precioVenta)

    }, [menu])

    useEffect(() => {
        setLineasMenu(data_lineas_menu?.obtenerLineasMenu || [])
    }, [data_lineas_menu])

    const menuTypes = [
        {
            label: "Entrada",
            value: "Entrada"
        },
        {
            label: "Plato fuerte",
            value: "Plato fuerte"
        },
        {
            label: "Guarnicion",
            value: "Guarnicion"
        },
        {
            label: "Postres",
            value: "Postres"
        },
        {
            label: "Menu Niño",
            value: "Menu Niño"
        },
        {
            label: "Bebidas",
            value: "Bebidas"
        }
    ]

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
        setModoLinea('Agregar')
        setIndexEditar(null)
        setIdEditar(-1)
    }

    const eliminarLinea = (index, id, name) => {
        Swal.fire({
            title: "Eliminar ingrediente",
            text: `¿Está seguro de eliminar el ingrediente ${name}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#0BB197",
            cancelButtonColor: "#FF3D60",
            cancelButtonText: 'Cancelar',
            confirmButtonText: "Sí, ¡eliminar!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { data } = await desactivar({ variables: { id } });
                const { estado, message } = data.desactivarLineaMenu;
                if (estado) {
                    setLineasMenu(lineasMenu.filter((l, i) => i !== index))
                    infoAlert('Ingrediente eliminado', message, 'success', 3000, 'top-end')
                } else {
                    infoAlert('Eliminar ingrediente', message, 'error', 3000, 'top-end')
                }
            }
        });
    }

    const editarLinea = (linea, index, id) => {
        setIndexEditar(index)
        setCantidad(linea.cantidad)
        setProducto({ value: linea.producto, label: linea.producto.nombre })
        setModoLinea('Editar')
        setIdEditar(id)
    }

    const disabledSaveLine = () => {
        if (!producto || producto === null || !cantidad || (cantidad && cantidad < 0)) {
            return true
        }
        return false
    }


    const guardarLinea = async () => {
        if (modoLinea === 'Agregar') {
            const existe = lineasMenu.find(l => l.producto.id === producto.value.id)
            if (existe) {
                infoAlert('Oops', 'Ya existe una línea con ese producto', 'warning', 3000, 'top-end')
                return
            }

            const obj = {
                menu: menu.id,
                producto: producto.value.id,
                cantidad: parseFloat(cantidad)
            }

            const { data } = await insertarLinea({ variables: { input: obj }, errorPolicy: 'all' });
            const { estado, message } = data.insertarLineaMenu;

            if (estado) {
                infoAlert('Excelente', message, 'success', 3000, 'top-end')
                limpiarLinea()
                refetch_lineas()
            } else {
                infoAlert('Oops', message, 'error', 3000, 'top-end')
            }


            setLineasMenu([...lineasMenu, obj])

        } else {
            const obj = {
                menu: menu.id,
                producto: producto.value.id,
                cantidad: parseFloat(cantidad)
            }

            const { data } = await actualizarLinea({ variables: { id: idEditar, input: obj }, errorPolicy: 'all' });
            const { estado, message } = data.actualizarLineaMenu;

            if (estado) {
                infoAlert('Excelente', message, 'success', 3000, 'top-end')
                limpiarLinea()
                refetch_lineas()
            } else {
                infoAlert('Oops', message, 'error', 3000, 'top-end')
            }

        }
    }

    const [disableSave, setDisableSave] = useState(true);

    useEffect(() => {
        setDisableSave(!nombre || nombre === null || nombre.trim().length === 0 || lineasMenu.length <= 0 || !tipo)
    }, [nombre, lineasMenu, tipo])


    const onSave = async () => {
        try {
            setDisableSave(true)
            const input = {
                estado: 'ACTIVO',
                nombre: nombre,
                descripcion: descripcion,
                precioCosto: 0,
                precioVenta: precioVenta,
                tipo: tipo.value
            }

            const { data } = await actualizar({ variables: { id: menu.id, input }, errorPolicy: 'all' });
            const { estado, message } = data.actualizarMenu;
            if (estado) {
                infoAlert('Excelente', message, 'success', 3000, 'top-end')
                navigate('/restaurant/menu');
            } else {
                infoAlert('Oops', message, 'error', 3000, 'top-end')
            }
            setDisableSave(false)
        } catch (error) {
            infoAlert('Oops', `Ocurrió un error inesperado al actaulizar el ${tipo.value}`, 'error', 3000, 'top-end')
            setDisableSave(false)
        }
    }

    if (load_materia_prima || load_lineas_menu) {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title='Editar plato' breadcrumbItem='Menú' breadcrumbItemUrl='/restaurant/menu' />
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
                    <Breadcrumbs title='Editar plato' breadcrumbItem='Menú' breadcrumbItemUrl='/restaurant/menu' />

                    <Row>
                        <div className="col-md-5 col-sm-12 mb-3">
                            <Row>
                                <div className="col mb-3">
                                    <SpanSubtitleForm subtitle='Información general' />
                                </div>
                            </Row>
                            <Row>
                                <div className="col mb-3">
                                    <label htmlFor="tipo" className="form-label">* Tipo</label>
                                    <Select
                                        id="tipo"
                                        value={tipo}
                                        onChange={(e) => {
                                            setTipo(e);
                                        }}
                                        options={menuTypes}
                                        classNamePrefix="select2-selection"
                                        isSearchable={true}
                                        menuPosition="fixed"
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
                                    <label htmlFor="precioVenta" className="form-label">Precio venta</label>
                                    <input className="form-control" type="number" id="precioVenta" value={precioVenta} onChange={(e) => setPrecioVenta(e.target.value)} />
                                </div>
                            </Row>
                            <Row>
                                <div className="col mb-3 text-end">
                                    <button disabled={disableSave} onClick={onSave} type="button" className="btn btn-primary waves-effect waves-light" >
                                        Guardar{" "}
                                        <i className="ri-save-line align-middle ms-2"></i>
                                    </button>
                                </div>
                            </Row>
                        </div>
                        <div className="col-md-7 col-sm-12 mb-3">
                            <Row>
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
                                <div className='col mt-3 mb-3'>
                                    <div className="table-responsive">
                                        <table className="table">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Producto</th>
                                                    <th>Cantidad</th>
                                                    <th>Unidad</th>
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
                                                            <td>
                                                                <div className="d-flex justify-content-end mx-1 my-1">
                                                                    <ButtonIconTable icon='mdi mdi-pencil' color='warning' onClick={() => { editarLinea(linea, index, linea.id) }} />
                                                                    <ButtonIconTable icon='mdi mdi-delete' color='danger' onClick={() => { eliminarLinea(index, linea.id, linea.producto.nombre) }} />
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

export default EditMenu;
