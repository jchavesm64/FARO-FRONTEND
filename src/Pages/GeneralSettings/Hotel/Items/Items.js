import { useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { infoAlert } from "../../../../helpers/alert";
import { DELETE_ITEM, OBTENER_ITEMS } from "../../../../services/ItemsService";
import { Breadcrumb, Card, CardBody, Container, Row } from "reactstrap";
import { Link } from "react-router-dom";
import DataList from "../../../../components/Common/DataList";

const Items = ({ ...props }) => {
  document.title = "Items | FARO";

  const [filter, setFilter] = useState("");
  const [modo] = useState("1");

  const { data: tiposItems } = useQuery(OBTENER_ITEMS, { pollInterval: 1000 });
  const [desactivar] = useMutation(DELETE_ITEM);

  const onDeleteItem = (id, nombre) => {
    Swal.fire({
      title: "Eliminar Item",
      text: `¿Está seguro de eliminar el item ${nombre}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0BB197",
      cancelButtonColor: "#FF3D60",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Sí, ¡eliminar!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { data } = await desactivar({ variables: { id } });
        const { estado, message } = data.desactivarItem;
        if (estado) {
          infoAlert("Item eliminado", message, "success", 3000, "top-end");
        } else {
          infoAlert("Eliminar item", message, "error", 3000, "top-end");
        }
      }
    });
  };

  function getFilteredByKey(modo, key, value) {
    const valName = key.nombre.toLowerCase();
    const val = value.toLowerCase();

    if (valName.includes(val)) {
      return key;
    }

    return null;
  }

  const getData = () => {
    if (tiposItems) {
      if (tiposItems.obtenerItems) {
        return tiposItems.obtenerItems.filter((value) => {
          if (filter !== "" && modo !== "") {
            return getFilteredByKey(modo, value, filter);
          }
          return value;
        });
      }
    }
    return [];
  };

  const data = getData();

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Items"
            breadcrumbItem="Ajustes generales Hotel"
            breadcrumbItemUrl="/hotelsettings"
          />
          <Row className="flex" style={{ alignItems: "flex-end" }}>
            <div className="col-md-10 mb-3">
              <label htmlFor="filter" className="form-label">
                Buscar items
              </label>
              <input
                className="form-control"
                id="search-input"
                type="search"
                placeholder="Escribe el nombre del tipo de comodidad"
                onChange={(e) => {
                  setFilter(e.target.value);
                }}
              />
            </div>
            <div className="col-md-2 col-sm-12 mb-3">
              <Link to="/hotelsettings/newitems">
                <button
                  type="button"
                  className="btn btn-primary waves-effect waves-light"
                  style={{ width: "100%" }}
                >
                  Agregar{" "}
                </button>
              </Link>
            </div>
          </Row>
          <Row>
            <div className="col mb-3">
              <Card>
                <CardBody>
                  <DataList
                    onDelete={onDeleteItem}
                    data={data}
                    type="items"
                    displayLength={9}
                    {...props}
                  />
                </CardBody>
              </Card>
            </div>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Items;