import React from "react";
import DatePicker from "react-datepicker";
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
    const [startDate, setStartDate] = React.useState(new Date());
    const [endDate, setEndDate] = React.useState(new Date(new Date().setDate(new Date().getDate() + 1)));
    const handleGenerateReport = () => {
      if (reportType === "mostSoldDishes") {
        console.log("Generando reporte de platillos más vendidos...");
        
      } else if (reportType === "mostConsumedIngredients") {
        console.log("Generando reporte de ingredientes más consumidos...");
      
      }
      toggle();
    };
    const handleStartDateChange = (date) => {
      setStartDate(date);
      const minEndDate = new Date(date);
      minEndDate.setDate(minEndDate.getDate() + 1);

      if (endDate <= date) {
        setEndDate(minEndDate);
      }
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
                <Container>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="startDate">Fecha de inicio</Label>
                        <DatePicker
                          id="startDate"
                          selected={startDate}
                          onChange={handleStartDateChange}
                          className="datepicker form-control"
                          dateFormat="yyyy-MM-dd"
                        />
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup>
                        <Label for="endDate">Fecha de fin</Label>
                        <DatePicker
                          id="endDate"
                          selected={endDate}
                          onChange={(date) => setEndDate(date)}
                          className="datepicker form-control"
                          dateFormat="yyyy-MM-dd"
                          minDate={new Date(startDate.getTime() + 24 * 60 * 60 * 1000)}
                        />
                    </FormGroup>
                  </Col>
                  </Row>
                </Container>
                <FormGroup check>
                    <Label check>
                      <Input type="radio" name="reportType" value="mostSoldDishes" onChange={(e) => setReportType(e.target.value)} style={{ transform: "scale(1.5)" }} />{" "}
                      Platillos más vendidos
                    </Label>
                </FormGroup>
                <FormGroup check>
                  <Label check>
                    <Input type="radio" name="reportType" value="mostConsumedIngredients" onChange={(e) => setReportType(e.target.value)} style={{ transform: "scale(1.5)" }} />{" "}
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
