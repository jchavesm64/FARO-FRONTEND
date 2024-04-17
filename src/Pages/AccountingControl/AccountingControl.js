import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Alert, CardBody, Button, Label, Input, FormFeedback, Form, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import withRouter from "../../components/Common/withRouter";
import Breadcrumb from "../../components/Common/Breadcrumb";
import { Link } from "react-router-dom";
import DataList from "../../components/Common/DataList";
import { OBTENER_REGISTROS_CONTABLES } from "../../services/RegistroContableService";
import { useMutation, useQuery } from "@apollo/client";
import Swal from "sweetalert2";
import { infoAlert } from "../../helpers/alert";
import { convertirDataRegistrosContablesExcel, exportAndDownloadExcel } from "../../helpers/exportExcel";

const AccountingControl = ({ ...props }) => {
  document.title = "Profile | FARO";

  const [filter, setFilter] = useState('')
  const { loading: load_accounting, error: error_accounting, data: data_accounting } = useQuery(OBTENER_REGISTROS_CONTABLES, { pollInterval: 1000 })

  const getData = () => {
    if (data_accounting) {
      if (data_accounting.obtenerRegistrosContables) {
        return data_accounting.obtenerRegistrosContables.filter((value, index) => {
          if (filter !== "") {
            return getFilteredByKey(value, filter);
          }
          return value
        });
      }
    }
    return []
  }

  function getFilteredByKey(key, value) {
    const valIdenticator = key.consecutivo?.consecutivo.toLowerCase()
    const valSupplier = key.proveedor?.empresa.toLowerCase()
    const valClient = key.cliente?.nombre.toLowerCase()
    const valUser = key.usuario?.nombre.toLowerCase()
    const val = value.toLowerCase()


    if (valIdenticator?.includes(val) || valSupplier?.includes(val) || valClient?.includes(val) || valUser?.includes(val)) {
      return key
    }

    return null
  }

  const onDeleteAccounting = (id, name) => {
    Swal.fire({
      title: "Eliminar registro contable",
      text: `¿Está seguro de eliminar el registro contable de tipo ${name}?`,
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
    exportAndDownloadExcel('RegistrosContables', convertirDataRegistrosContablesExcel(data))
  }

  const data = getData();

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Control contable" />
          <Row className="flex" style={{ alignItems: 'flex-end' }}>
            <label htmlFor="search-input" className="col-md-3 col-form-label">
              Busca el registro contable
            </label>
            <div className="col-md-12 mb-3 d-flex align-items-end">
              <input
                className="form-control"
                type="search"
                id="search-input"
                placeholder="Escribe el identificador o proveedor"
                value={filter}
                onChange={(e) => { setFilter(e.target.value) }}
              />
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
                  <DataList onDelete={onDeleteAccounting} data={data} setConfirmation={false} mostrarMsj={false} type="accountingControl" view='TODOS' displayLength={9} {...props} />
                </CardBody>
              </Card>
            </div>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
};

export default withRouter(AccountingControl);


