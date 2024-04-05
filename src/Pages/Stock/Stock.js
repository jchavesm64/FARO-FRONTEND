import React, { useState } from "react";
import { Card, CardBody, Container, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Link, useParams } from "react-router-dom";
import DataList from "../../components/Common/DataList";
import { useMutation, useQuery } from "@apollo/client";
import Swal from "sweetalert2";
import { infoAlert } from "../../helpers/alert";
import { convertDataStockExcel, exportAndDownloadExcel } from "../../helpers/exportExcel";
import { DELETE_MATERIA_PRIMA, OBTENER_MATERIAS_PRIMAS_MOVIMIENTOS } from "../../services/MateriaPrimaService";


const Stock = ({...props}) => {
    document.title = "Inventario | FARO";

    const { stockType } = useParams();

    const [filter, setFilter] = useState('')
    const { loading: load_materia_prima, error: error_materia_prima, data: data_materia_prima } = useQuery(OBTENER_MATERIAS_PRIMAS_MOVIMIENTOS, {variables: { tipo: stockType }, pollInterval: 1000 })
    const [desactivar] = useMutation(DELETE_MATERIA_PRIMA);

    function getFilteredByKey(key, value) {
        const val1 = key.materia_prima.nombre.toLowerCase();
        const val = value.toLowerCase();

        if(val1.includes(val)){
            return key
        }

        return null
    }

    const getData = () => {
        if(data_materia_prima){
            if(data_materia_prima.obtenerMateriasPrimasConMovimientos){
                return data_materia_prima.obtenerMateriasPrimasConMovimientos.filter((value, index) => {
                    if (filter !== "") {
                        return getFilteredByKey(value, filter);
                    }
                    return value
                });
            }
        }
        return []
    }

    const onDelete = (id, name) => {
        // Swal.fire({
        //     title: "Eliminar orden de compra",
        //     text: `¿Está seguro de eliminar la orden ${name || ''}?`,
        //     icon: "warning",
        //     showCancelButton: true,
        //     confirmButtonColor: "#0BB197",
        //     cancelButtonColor: "#FF3D60",
        //     cancelButtonText: 'Cancelar',
        //     confirmButtonText: "Sí, ¡eliminar!"
        // }).then(async(result) => {
        //     if (result.isConfirmed) {
        //         const { data } = await desactivar({ variables: { id } });
        //         const { estado, message } = data.desactivarOrdenCompra;
        //         if (estado) {
        //             infoAlert('Orden de compra eliminada', message, 'success', 3000, 'top-end')
        //         } else {
        //             infoAlert('Eliminar orden de compra', message, 'error', 3000, 'top-end')
        //         }
        //     }
        // });
    }

    const onClickExportExcel = () => {
        exportAndDownloadExcel('inventario', convertDataStockExcel(data))
    }

    const data = getData();

    if(load_materia_prima){
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title={`Inventario - ${stockType}`} />
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
                    <Breadcrumbs title={`Inventario - ${stockType}`} />
                    <Row className="flex" style={{alignItems: 'flex-end'}}>
                        <div className="col-md-10 mb-3">
                            <label
                                htmlFor="example-search-input"
                                className="col-md-2 col-form-label"
                            >
                                Busca el producto
                            </label>
                            <input className="form-control" value={filter} onChange={(e)=>{setFilter(e.target.value)}} type="search" placeholder="Escribe el nombre del producto" />
                        </div>
                        <div className="col-md-2 col-sm-12 mb-3">
                            <Link to={`/newproduct/${stockType}`}><button
                              type="button"
                              className="btn btn-primary waves-effect waves-light"
                              style={{width: '100%'}}
                            >
                              Agregar{" "}
                              <i className="mdi mdi-plus align-middle ms-2"></i>
                            </button></Link>
                        </div>
                    </Row>
                    <Row className="">
                        <div className="col mb-3">
                            <button
                              type="button"
                              className="btn btn-outline-secondary waves-effect waves-light"
                              onClick={()=>{onClickExportExcel()}}
                            >
                              Exportar Excel{" "}
                              <i className="mdi mdi-file-excel align-middle ms-2"></i>
                            </button>
                        </div>
                    </Row>
                    <Row>
                        <div className="col mb-3">
                            <Card>
                                <CardBody>
                                    <DataList onDelete={onDelete} data={data} type="stock" displayLength={9} {...props} />
                                </CardBody>
                            </Card>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default Stock;
