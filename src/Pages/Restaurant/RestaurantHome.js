import React from "react";
import DatePicker from "react-datepicker";
import { Container, Row, Card, CardTitle, Col , Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input} from "reactstrap";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { OBTENER_MOVIMIENTOS_POR_FECHA } from "../../services/MovimientosRestauranteService";
import { OBTENER_LINEAS_MENU } from "../../services/MenuLineaService";
import { useApolloClient } from "@apollo/client";
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
    const [movements, setMovements] = React.useState([]);
    const client = useApolloClient();
    const handleGenerateReport = async () => {
      const startDateFormatted = startDate.toISOString().split('T')[0];
      const endDateFormatted = endDate.toISOString().split('T')[0];
      const { data } = await client.query({
        query: OBTENER_MOVIMIENTOS_POR_FECHA,
        variables: { fechaInicio: startDate, fechaFin: endDate }, 
        fetchPolicy: "network-only",
      });
      let fileName;
      if (reportType === "mostSoldDishes") {
        platillosMasVendidos(data);
        fileName = `reporte_platillos_mas_vendidos_${startDateFormatted}_a_${endDateFormatted}.xlsx`;
      } else if (reportType === "mostConsumedIngredients") {
        ingredientesMasConsumidos(data.obtenerMovimientosPorFecha);
        fileName = `reporte_ingredientes_mas_consumidos_${startDateFormatted}_a_${endDateFormatted}.xlsx`;
      }
      exportToExcel(fileName);
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


    const ingredientesMasConsumidos = async (movimientos) => {
      const platillos = movimientos.flatMap((movimiento) => movimiento.platillos);
      const platillosCount = platillos.reduce((acc, platillo) => {
        const { nombre } = platillo;
        if (!acc[nombre]) {
          acc[nombre] = { ...platillo, cantidad: 0 };
        }
        acc[nombre].cantidad += 1;
        return acc;
      }, {});
      const filteredPlatillos = Object.values(platillosCount);
      const ingredientes = filteredPlatillos.map(async (platillo) => {
        const { data } = await client.query({
            query: OBTENER_LINEAS_MENU,
            variables: { id: platillo.id }, 
            fetchPolicy: "network-only",
        });
        const ingredientes = data.obtenerLineasMenu.map((linea) => {
          const { producto, cantidad } = linea;
          return { ...producto, cantidad: cantidad * platillo.cantidad };
        });
        return ingredientes;
      }, []);
      
      const ingredientesConsumidos = await Promise.all(ingredientes);
      const ingredientesCount = ingredientesConsumidos.flat().reduce((acc, ingrediente) => {
        const {cantidad, unidad ,nombre, precioCompra} = ingrediente;
        if (!acc[nombre]) {
          acc[nombre] = {cantidad: 0, unidad, nombre, precioCompra };
        }
        acc[nombre].cantidad += cantidad;
        return acc;
      }, {});
      const ingredientesMasConsumidos = Object.values(ingredientesCount);
      setMovements(ingredientesMasConsumidos);

    };

    const platillosMasVendidos = async (data) => {
      const platillos = data.obtenerMovimientosPorFecha.flatMap((movimiento) => movimiento.platillos);
      const platillosCount = platillos.reduce((acc, platillo) => {
        const { nombre, precio } = platillo;
        if (!acc[nombre]) {
          acc[nombre] = { nombre, precio, cantidad: 0 };
        }
        acc[nombre].cantidad += 1;
        return acc;
      }, {});

      const platillosMasVendidos = Object.values(platillosCount);
      setMovements(platillosMasVendidos);
    };

    const exportToExcel = async (fileName) => {
      if (movements == undefined && movements.length == 0) {
        console.warn("No hay datos para exportar.");
        return;
      }
      const worksheet = XLSX.utils.json_to_sheet(movements);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");
    
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(blob, fileName);
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
