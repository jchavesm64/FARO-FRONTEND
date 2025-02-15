import React from "react";
import { Container, Row, Card, CardTitle, Col , Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input} from "reactstrap";
import { Link } from "react-router-dom";

import Breadcrumbs from "../../components/Common/Breadcrumb";
import { restaurantRoutes } from "../../constants/routesConst";
import ButtomCardHome from "../Home/ButtonCardHome";

const RestaurantHome = () => {
  document.title = "Restaurante | FARO";
  const[modal, setModal] = React.useState(false);
  const toggle = () => setModal(!modal);
  const [reportType, setReportType] = React.useState("mostSoldDishes");

  const handleGenerateReport = () => {
    if (reportType === "mostSoldDishes") {
      console.log("Generando reporte de platillos más vendidos...");
      
    } else if (reportType === "mostConsumedIngredients") {
      console.log("Generando reporte de ingredientes más consumidos...");
     
    }
    toggle();
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Restaurante"  />
          <Row className="flex justify-content-center gap-3 mb-4">
                {
                    restaurantRoutes.map((route, index) => (
                        <ButtomCardHome key={index} route={route}/> 
                    ))
                }
                <Link className="card_home_link" onClick={toggle}>
                  <Card className="card_home">
                      <Row>
                          <Col className="text-center">
                              <i className={'mdi mdi-file-chart card_home_icon'}></i>
                          </Col>
                      </Row>
                      <Row>
                          <Col className="text-center">
                              <CardTitle className="card_home_title">
                                  {`Reportes`}
                              </CardTitle>
                          </Col>
                      </Row>
                  </Card>
                </Link>
          </Row>
        </Container>
      </div>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Seleccionar tipo de reporte</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup check>
              <Label check>
                <Input type="radio" name="reportType" value="mostSoldDishes" onChange={(e) => setReportType(e.target.value)} />{" "}
                Platillos más vendidos
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input type="radio" name="reportType" value="mostConsumedIngredients" onChange={(e) => setReportType(e.target.value)} />{" "}
                Ingredientes más consumidos
              </Label>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>Cerrar</Button>
          <Button color="primary" onClick={handleGenerateReport}>Generar Reporte</Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default RestaurantHome;
