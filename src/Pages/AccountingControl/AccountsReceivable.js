import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Alert, CardBody, Button, Label, Input, FormFeedback, Form, } from "reactstrap";
import withRouter from "../../components/Common/withRouter";
import Breadcrumb from "../../components/Common/Breadcrumb";
import { Link } from "react-router-dom";
import DataList from "../../components/Common/DataList";
import { OBTENER_REGISTROS_CONTABLES_TIPO } from '../../services/RegistroContableService';
import Swal from "sweetalert2";
import { infoAlert } from "../../helpers/alert";
import { useMutation, useQuery } from "@apollo/client";
import { convertirDataRegistrosContablesExcel, exportAndDownloadExcel } from "../../helpers/exportExcel";


const AccountsReceivable = ({ ...props }) => {
  document.title = "Profile | FARO";


  const [filter, setFilter] = useState('')
  const [modo, setModo] = useState('1')
  const { loading: load_accounting, error: error_accounting, data: data_accounting } = useQuery(OBTENER_REGISTROS_CONTABLES_TIPO, { variables: { tipo: "COBRAR" }, pollInterval: 1000 })

  const getData = () => {
    if (data_accounting) {
      if (data_accounting.obtenerRegistrosContablesTipo) {
        return data_accounting.obtenerRegistrosContablesTipo.filter((value, index) => {
          if (filter !== "" && modo !== "") {
            return getFilteredByKey(modo, value, filter);
          }
          return value
        });
      }
    }
    return []
  }

  function getFilteredByKey(modo, key, value) {
    const valIdenticator = key.consecutivo.consecutivo.toLowerCase()
    const valSupplier = key.proveedor?.empresa.toLowerCase()
    const valClient = key.cliente?.nombre.toLowerCase()
    const valUser = key.usuario?.nombre.toLowerCase()
    const val = value.toLowerCase()


    if (valIdenticator.includes(val) || valSupplier?.includes(val) || valClient?.includes(val) || valUser?.includes(val)) {
      return key
    }

    return null
  }

  const onDeleteAccounting = (id, name) => {
    Swal.fire({
      title: "Eliminar cliente",
      text: `¿Está seguro de eliminar al cliente ${name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0BB197",
      cancelButtonColor: "#FF3D60",
      cancelButtonText: 'Cancelar',
      confirmButtonText: "Sí, ¡eliminar!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        // const { data } = await desactivar({ variables: { id } });
        // const { estado, message } = data.desactivarCliente;
        // if (estado) {
        // infoAlert('Cliente eliminado', message, 'success', 3000, 'top-end')
        // } else {
        //     infoAlert('Eliminar Cliente', message, 'error', 3000, 'top-end')
        // }
      }
    });
  }

  const onClickExportExcel = () => {
    exportAndDownloadExcel('RegistroS contables', convertirDataRegistrosContablesExcel(data))
  }

  const data = getData();

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Cuentas por cobrar" />

          <Row className="flex" style={{ alignItems: 'flex-end' }}>
            <div className="col-md-10 mb-3">
              <label htmlFor="search-input" className="col-md-3 col-form-label">
                Busca el registro contable
              </label>
              <input
                className="form-control"
                type="search"
                id="search-input"
                placeholder="Escribe el número de registro"
                value={filter}
                onChange={(e) => { setFilter(e.target.value) }}
              />
            </div>
            <div className="col-md-2 col-sm-12 mb-3">
              <Link to="/newaccountscontrol/COBRAR">
                <button type="button" className="btn btn-primary waves-effect waves-light" style={{ width: '100%' }} >
                  Agregar{" "}
                  <i className="mdi mdi-plus align-middle ms-2"></i>
                </button>
              </Link>
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
          <Card>
            <CardBody>
              <DataList onDelete={onDeleteAccounting} data={data} setConfirmation={false} mostrarMsj={false} type="accountingControl" view='COBRAR' displayLength={9} {...props} />
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(AccountsReceivable);



