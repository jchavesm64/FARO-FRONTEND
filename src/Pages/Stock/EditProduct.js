import React, { useEffect, useState } from "react";
import { Card, CardBody, CardTitle, Col, Container, Label, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import Select from "react-select";
import SpanSubtitleForm from "../../components/Forms/SpanSubtitleForm";
import countriesJson from '../../store/json/countries.json'
import statesJson from '../../store/json/states.json'
import { infoAlert } from "../../helpers/alert";
import { useMutation } from "@apollo/client";
import { useNavigate } from 'react-router-dom';
import { UPDATE_MATERIA_PRIMA } from "../../services/MateriaPrimaService";
import { calculateStockMovements } from "../../helpers/helpers";


const EditProduct = ({ stockType, product }) => {
    document.title = "Inventario | FARO";

    const navigate = useNavigate();

    const [nombre, setNombre] = useState('');
    const [existencias, setExistencias] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [referenciaInterna, setReferenciaInterna] = useState('');
    const [codigoBarras, setCodigoBarras] = useState('');
    const [codigoCabys, setCodigoCabys] = useState('');
    const [actualizar] = useMutation(UPDATE_MATERIA_PRIMA);
    const [unidad, setUnidad] = useState(null)

    const [precioCompra, setPrecioCompra] = useState(0)
    const [precioCostoPromedio, setPrecioCostoPromedio] = useState(0)
    const [precioVenta, setPrecioVenta] = useState(0)
    const [precioVentaConImpuesto, setPrecioVentaConImpuesto] = useState(0)

    useEffect(() => {
        setNombre(product.nombre || '')
        setExistencias(calculateStockMovements(product.movimientos) || '')
        setUnidad({ value: product.unidad, label: product.unidad } || null)
        setDescripcion(product.descripcion || '')
        setReferenciaInterna(product.referenciaInterna || '')
        setCodigoBarras(product.codigoBarras || '')
        setCodigoCabys(product.codigoCabys || '')
        setPrecioCompra(product.precioCompra || 0)
        setPrecioVenta(product.precioVenta || 0)
        setPrecioCostoPromedio(product.precioCostoPromedio || 0)
    }, [product])

    const [disableSave, setDisableSave] = useState(true);

    useEffect(() => {
        setDisableSave(!nombre || !unidad || nombre.trim().length === 0)
    }, [nombre, unidad])

    const onSaveProduct = async () => {
        try {
            setDisableSave(true)
            const input = {
                nombre,
                pais: product.pais,
                unidad: unidad.value,
                estado: 'ACTIVO',
                tipo: product.tipo,
                referenciaInterna: referenciaInterna,
                codigoBarras: codigoBarras,
                codigoCabys: codigoCabys,
                descripcion: descripcion,
                precioCompra: parseFloat(precioCompra),
                precioCostoPromedio: product.precioCostoPromedio,
                precioVenta: parseFloat(precioVenta),
            }

            const { data } = await actualizar({ variables: { id: product.id, input }, errorPolicy: 'all' });
            const { estado, message } = data.actualizarMateriaPrima;
            if (estado) {
                infoAlert('Excelente', message, 'success', 3000, 'top-end')
                navigate(`/stock/${stockType}`);
            } else {
                infoAlert('Oops', message, 'error', 3000, 'top-end')
            }
            setDisableSave(false)
        } catch (error) {
            console.log(error);
            infoAlert('Oops', 'Ocurrió un error inesperado al guardar el producto', 'error', 3000, 'top-end')
            setDisableSave(false)
        }
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title='Editar producto' breadcrumbItem={`Inventario - ${stockType}`} breadcrumbItemUrl={`/stock/${stockType}`} />
                    <Row>
                        <div className="col mb-3 text-end">
                            <button disabled={disableSave} onClick={onSaveProduct} type="button" className="btn btn-primary waves-effect waves-light" >
                                Guardar{" "}
                                <i className="ri-save-line align-middle ms-2"></i>
                            </button>
                        </div>
                    </Row>
                    <Row>
                        <div className="col-md-6 col-sm-12">
                            <Row>
                                <div className="col-6 mb-3">
                                    <label htmlFor="nombre" className="form-label">* Nombre</label>
                                    <input className="form-control" type="text" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                                </div>
                                <div className="col-3 mb-3">
                                    <label htmlFor="existencias" className="form-label">Existencias</label>
                                    <input readOnly={true} className="form-control" type="number" id="existencias" value={existencias} onChange={(e) => setExistencias(e.target.value)} />
                                </div>
                                <div className="col-3 mb-3">
                                    <label htmlFor="unidad" className="form-label">* Unidad de medida</label>
                                    <Select
                                        menuPosition="fixed"
                                        id="unidad"
                                        value={unidad}
                                        onChange={(e) => setUnidad(e)}
                                        options={[{ label: 'Kilogramo', value: 'Kilogramo' }, { label: 'Litro', value: 'Litro' }, { label: 'Unidades', value: 'Unidades' }]}
                                        classNamePrefix="select2-selection"
                                    />
                                </div>
                            </Row>
                            <Row>
                                <div className="col mb-3">
                                    <label htmlFor="descripcion" className="form-label">Descripción del producto</label>
                                    <textarea className="form-control" type="text" id="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)}></textarea>
                                </div>
                            </Row>

                        </div>
                        <div className="col-md-6 col-sm-12">
                            <Row>
                                <div className="col-md-4 col-sm-12 mb-3">
                                    <label htmlFor="refInterna" className="form-label">Referencia interna</label>
                                    <input className="form-control" type="text" id="refInterna" value={referenciaInterna} onChange={(e) => setReferenciaInterna(e.target.value)} />
                                </div>
                                <div className="col-md-4 col-sm-12 mb-3">
                                    <label htmlFor="codBarras" className="form-label">Código de barras</label>
                                    <input className="form-control" type="text" id="codBarras" value={codigoBarras} onChange={(e) => setCodigoBarras(e.target.value)} />
                                </div>
                                <div className="col-md-4 col-sm-12 mb-3">
                                    <label htmlFor="codCabys" className="form-label">Código Cabys</label>
                                    <input className="form-control" type="text" id="codCabys" value={codigoCabys} onChange={(e) => setCodigoCabys(e.target.value)} />
                                </div>
                            </Row>
                            <Row>
                                <div className="col-md-6 col-sm-12 mb-3">
                                    <label htmlFor="precioCosto" className="form-label">Precio costo</label>
                                    <input className="form-control" type="number" id="precioCosto" value={precioCompra} onChange={(e) => setPrecioCompra(e.target.value)} />
                                </div>
                                <div className="col-md-6 col-sm-12 mb-3">
                                    <label htmlFor="precioCostoPromedio" className="form-label">Precio costo promedio</label>
                                    <input readOnly={true} className="form-control" type="number" id="precioCostoPromedio" value={precioCostoPromedio} onChange={(e) => setPrecioCostoPromedio(e.target.value)} />
                                </div>
                            </Row>
                            <Row>
                                <div className="col-md-6 col-sm-12 mb-3">
                                    <label htmlFor="precioVenta" className="form-label">Precio venta</label>
                                    <input className="form-control" type="number" id="precioVenta" value={precioVenta} onChange={(e) => setPrecioVenta(e.target.value)} />
                                </div>
                                <div className="col-md-6 col-sm-12 mb-3">
                                    <label htmlFor="precioVentaImpuestos" className="form-label">Precio venta más impuestos</label>
                                    <input readOnly={true} className="form-control" type="number" id="precioVentaImpuestos" value={precioVentaConImpuesto} onChange={(e) => precioVentaConImpuesto(e.target.value)} />
                                </div>

                            </Row>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default EditProduct;
