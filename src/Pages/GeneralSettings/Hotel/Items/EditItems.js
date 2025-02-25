import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import {
  OBTENER_ITEMS_BY_ID,
  UPDATE_ITEM,
} from "../../../../services/ItemsService";
import React, { useEffect, useState } from "react";
import { infoAlert } from "../../../../helpers/alert";
import { Breadcrumb, Card, Col, Container, Row } from "reactstrap";
import SpanSubtitleForm from "../../../../components/Forms/SpanSubtitleForm";

const EditItems = () => {
  document.title = "Edit Items | FARO";
  const navigate = useNavigate();

  const { id } = useParams();
  const {
    loading: loading_items,
    error: error_items,
    data: data_items,
    startPolling,
    stopPolling,
  } = useQuery(OBTENER_ITEMS_BY_ID, {
    variables: { id: id },
    pollInterval: 1000,
  });
  const [actualizar] = useMutation(UPDATE_ITEM);

  useEffect(() => {
    startPolling(1000);
    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling]);

  const [name, setName] = useState("");
  const [description, setDescripcion] = useState("");
  const [price, setPrice] = useState(0);

  useEffect(() => {
    if (data_items) {
      setName(data_items.obtenerItem.nombre);
      setDescripcion(data_items.obtenerItem.descripcion);
    }
  }, [data_items]);

  const [disableSave, setDisableSave] = useState(true);

  useEffect(() => {
    setDisableSave(name.trim().length === 0);
  }, [name]);

  const onClickSave = async () => {
    try {
      setDisableSave(true);
      const input = {
        nombre: name,
        descripcion: description,
        estado: "ACTIVO",
      };
      const { data } = await actualizar({
        variables: { id, input },
        errorPolicy: "all",
      });
      const { estado, message } = data.actualizarItem;
      if (estado) {
        infoAlert("Excelente", message, "success", 3000, "top-end");
        navigate("/hotelsettings/items");
      } else {
        infoAlert("Oops", message, "error", 3000, "top-end");
      }
    } catch (error) {
      infoAlert(
        "Oops",
        "Ocurrió un error inesperado al guardar el tipo de item",
        "error",
        3000,
        "top-end"
      );
      setDisableSave(false);
    }
  };

  if (loading_items) {
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              title="Edit Item"
              breadcrumbItem="Item"
              breadcrumbItemUrl="/hotelsettings/item"
            />
            <Row>
              <div className="col text-center pt-3 pb-3">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }

  if (error_items) {
    return null;
  }
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            title="Nuevo tipo de item"
            breadcrumbItem="Tipo de item"
            breadcrumbItemUrl="/hotelsettings/items"
          />
          <Card className="p-4">
            <Row>
              <div className="col mb-3 text-end">
                <button
                  type="button"
                  className="btn btn-primary waves-effect waves-light"
                  disabled={disableSave}
                  onClick={() => onClickSave()}
                >
                  Guardar <i className="ri-save-line align-middle ms-2"></i>
                </button>
              </div>
            </Row>
            <Row>
              <div className="col-md-6">
                <SpanSubtitleForm subtitle="Información del artículo" />
              </div>
            </Row>
            <Row className="d-flex justify-content-between shadow_service rounded-5 p-3">
              <Col className=" shadow_service rounded-5 p-3">
                <div className="col-md-6 col-sm-9 m-2">
                  <label htmlFor="name" className="form-label">
                    * Nombre del artículo
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="Escribe el nombre del artículo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="col-md-6 col-sm-9 m-2">
                  <label htmlFor="type" className="form-label">
                    * Precio del artículo
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    id="type"
                    value={price}
                    onChange={(e) => {
                      setPrice(e.target.value);
                    }}
                  />
                </div>
                <div className="col-md-6 col-sm-9 m-2">
                  <label htmlFor="description" className="form-label">
                    Descripción
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    placeholder="Escribe la descripción del artículo"
                    value={description}
                    onChange={(e) => setDescripcion(e.target.value)}
                  />
                </div>
              </Col>
            </Row>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EditItems;
