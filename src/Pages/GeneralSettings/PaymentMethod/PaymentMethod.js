import React, { useEffect, useState } from "react";
import { Container, Row, Card, CardBody } from "reactstrap";
import withRouter from "../../../components/Common/withRouter";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import { Link, useNavigate } from "react-router-dom";
import DataList from "../../../components/Common/DataList";
import { useMutation, useQuery } from "@apollo/client";
import Swal from "sweetalert2";
import { infoAlert } from "../../../helpers/alert";
import { OBTENER_TIPOS_METODO_PAGO, DELETE_TIPO_METODO_PAGO } from '../../../services/TipoMetodoPagoService';
import { convertirDataTipoMetodoPagoExcel, exportAndDownloadExcel } from "../../../helpers/exportExcel";

const PaymentMethod = ({ ...props }) => {
    document.title = "Métodos de Pago | FARO";

    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const [displayLength, setDisplayLength] = useState(10);
    const [filter, setFilter] = useState('');
    const { loading, error, data: tipos, refetch } = useQuery(OBTENER_TIPOS_METODO_PAGO, { pollInterval: 1000 });
    const [desactivar] = useMutation(DELETE_TIPO_METODO_PAGO);

    const onDeletePaymentMethod = (id, nombre) => {
        Swal.fire({
            title: "Eliminar método de pago",
            text: `¿Está seguro de eliminar el método de pago ${nombre}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#0BB197",
            cancelButtonColor: "#FF3D60",
            cancelButtonText: 'Cancelar',
            confirmButtonText: "Sí, ¡eliminar!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { data } = await desactivar({ variables: { id } });
                const { estado, message } = data.desactivarTipoMetodoPago;
                if (estado) {
                    infoAlert('Método de Pago eliminado', message, 'success', 3000, 'top-end')
                    refetch();
                } else {
                    infoAlert('Eliminar Método de Pago', message, 'error', 3000, 'top-end')
                }
            }
        });
    }

    function getFilteredByKey(key, value) {
        const valName = key.nombre.toLowerCase();
        const val = value.toLowerCase();
        if (valName.includes(val)) {
            return key
        }
        return null;
    }

    const getData = () => {
        if (tipos) {

            if (tipos.obtenerTiposMetodoPago) {
                return tipos.obtenerTiposMetodoPago.filter((value, index) => {
                    if (filter !== "") {
                        return getFilteredByKey(value, filter);
                    }
                    return value
                });
            }
        }
        return []
    }


    const onClickExportExcel = () => {
        exportAndDownloadExcel('Métodos de Pago', convertirDataTipoMetodoPagoExcel(data))
    }

    const data = getData();

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumb title="Gestion de Métodos de Pago" breadcrumbItem="Ajustes Generales" breadcrumbItemUrl="/generalsettings" />

                    <Row className="flex" style={{ alignItems: 'flex-end' }}>
                        <div className="col-md-10 mb-3">
                            <label htmlFor="search-input" className="col-md-6 col-form-label">
                                Busca el nombre del método de pago
                            </label>
                            <input
                                className="form-control"
                                id="search-input"
                                type="search"
                                placeholder="Escribe el nombre del método de pago"
                                value={filter}
                                onChange={(e) => { setFilter(e.target.value) }}
                            />
                        </div>
                        <div className="col-md-2 col-sm-12 mb-3">
                            <Link to="/newpaymentmethod"><button
                                type="button"
                                className="btn btn-primary waves-effect waves-light"
                                style={{ width: '100%' }}
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
                                onClick={() => { onClickExportExcel() }}
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
                                    <DataList onDelete={onDeletePaymentMethod} data={data} type="paymentMethod" displayLength={9} {...props} />
                                </CardBody>
                            </Card>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
};

export default withRouter(PaymentMethod);


