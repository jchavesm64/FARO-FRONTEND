import React, { useState } from "react";
import { Card, CardBody, CardTitle, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Link } from "react-router-dom";
import DataList from "../../components/Common/DataList";
import { DELETE_CLIENTE, OBTENER_CLIENTES } from "../../services/ClienteService";
import { useMutation, useQuery } from "@apollo/client";
import { isNonNullObject } from "@apollo/client/utilities";
import Swal from "sweetalert2";
import { infoAlert } from "../../helpers/alert";
import { convertDataCustomersExcel, exportAndDownloadExcel } from "../../helpers/exportExcel";


const Customers = ({...props}) => {
    document.title = "Clientes | FARO";

    const [filter, setFilter] = useState('')
    const { loading: load_clientes, error: error_clientes, data: data_clientes } = useQuery(OBTENER_CLIENTES, { pollInterval: 1000 })
    const [desactivar] = useMutation(DELETE_CLIENTE);


    function getFilteredByKey(key, value) {
        const valName = key.nombre.toLowerCase()
        const valCode = key.codigo.toLowerCase()
        const valCountry = key.pais.toLowerCase()
        const val = value.toLowerCase()
        

        if(valName.includes(val) || valCode.includes(val) || valCountry.includes(val)){
            return key
        }

        return null
    }

    const getData = () => {
        if(data_clientes){
            if(data_clientes.obtenerClientes){
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

    const onDeleteCustomer = (id, name) => {
        Swal.fire({
            title: "Eliminar cliente",
            text: `¿Está seguro de eliminar al cliente ${name}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#0BB197",
            cancelButtonColor: "#FF3D60",
            cancelButtonText: 'Cancelar',
            confirmButtonText: "Sí, ¡eliminar!"
        }).then(async(result) => {
            if (result.isConfirmed) {
                const { data } = await desactivar({ variables: { id } });
                const { estado, message } = data.desactivarCliente;
                if (estado) {
                    infoAlert('Cliente eliminado', message, 'success', 3000, 'top-end')
                } else {
                    infoAlert('Eliminar Cliente', message, 'error', 3000, 'top-end')
                }
            }
        });
    }

    const onClickExportExcel = () => {
        exportAndDownloadExcel('clientes', convertDataCustomersExcel(data))
    }

    const data = getData();

    if(load_clientes){
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title="Clientes"  />
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
                    <Breadcrumbs title="Clientes"  />
                    <Row className="flex" style={{alignItems: 'flex-end'}}>
                        <div className="col-md-10 mb-3">
                            <label
                                htmlFor="example-search-input"
                                className="col-md-2 col-form-label"
                            >
                                Busca el cliente
                            </label>
                            <input className="form-control" value={filter} onChange={(e)=>{setFilter(e.target.value)}} type="search" placeholder="Escribe el nombre, código o país del cliente" />
                        </div>
                        <div className="col-md-2 col-sm-12 mb-3">
                            <Link to="/newcustomer"><button
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
                                    <DataList onDelete={onDeleteCustomer} data={data} type="customers" displayLength={9} {...props} />
                                </CardBody>
                            </Card>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default Customers;
