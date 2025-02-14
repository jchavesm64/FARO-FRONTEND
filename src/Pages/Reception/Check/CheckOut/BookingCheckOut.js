import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Tab, Tabs } from "react-bootstrap";
import {
  OBTENER_RESERVA,
  CHECKIN_RESERVA,
} from "../../../../services/ReservaService";
import { OBTENER_CLIENTES } from "../../../../services/ClienteService";
import { OBTENER_RESERVAHABITACION } from "../../../../services/ReservaHabitacionService";
import { OBTENER_TIPOSHABITACION } from "../../../../services/TipoHabitacionService";
import {
  Container,
  Row,
  Col,
  Button,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Card,
  CardBody,
} from "reactstrap";
import Breadcrumbs from "../../../../components/Common/Breadcrumb";
import ButtonIconTable from "../../../../components/Common/ButtonIconTable";
import NewCustomer from "../../../Customers/NewCustomer";
import { typesBooking } from "../../../../constants/routesConst";
import InvoiceMaintenance from "../../../Invoices/Maintenance";
import { ServiceSelectCheckOut } from "./ServiceSelectCheckOut";

const BookingChecOut = () => {
  document.title = "CheckOut | FARO";

  const navigate = useNavigate();

  const { id } = useParams(); // Obtener el ID de la reserva desde los parámetros de la URL
  const { data: dataCustomer } = useQuery(OBTENER_CLIENTES, {});
  const { loading: loadTypeRooms, data: typeRooms } = useQuery(
    OBTENER_TIPOSHABITACION
  );
  const {
    data: data_booking,
    loading: loading_booking,
    error: error_booking,
  } = useQuery(OBTENER_RESERVA, { variables: { id } });
  const {
    data: bookingRoom,
    loading: loading_room,
    error: error_room,
  } = useQuery(OBTENER_RESERVAHABITACION, {
    variables: { id: data_booking?.obtenerReserva.id },
    skip: !id,
  });

  const tableData = [
    {
      descripcion: "Laptop HP ProBook 450",
      codigoCabys: "43211507",
      precioUnitario: 750.0,
      cantidad: 2,
      subtotal: 1500.0,
      impuestos: 195.0,
    },
    {
      descripcion: "Monitor Dell 24''",
      codigoCabys: "43211900",
      precioUnitario: 200.0,
      cantidad: 1,
      subtotal: 200.0,
      impuestos: 26.0,
    },
    {
      descripcion: "Teclado Mecánico RGB",
      codigoCabys: "43211802",
      precioUnitario: 85.0,
      cantidad: 3,
      subtotal: 255.0,
      impuestos: 33.15,
    },
    {
      descripcion: "Mouse Inalámbrico Logitech",
      codigoCabys: "43211708",
      precioUnitario: 50.0,
      cantidad: 4,
      subtotal: 200.0,
      impuestos: 26.0,
    },
    {
      descripcion: "Silla Ergonómica de Oficina",
      codigoCabys: "56101504",
      precioUnitario: 320.0,
      cantidad: 1,
      subtotal: 320.0,
      impuestos: 41.6,
    },
  ];

  const [filter, setFilter] = useState("");
  const [booking, setBooking] = useState(null);
  const [modal, setModal] = useState(false);
  const [billingModal, setBillingModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [huespedes, setHuespedes] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [stateBooking, setStateBooking] = useState(false);

  const [billingOption, setBillingOption] = useState("init");

  const [facturaData, setFacturaData] = useState([]);

  const [showListService, setShowListService] = useState(false);
  const [productsSelectBill, setProductsSelectBill] = useState(null);

  useEffect(() => {
    if (data_booking) {
      setBooking(data_booking.obtenerReserva);
    }
  }, [data_booking]);

  const toggleModal = (room = null) => {
    setSelectedRoom(room);
    setModal(!modal);
    setBillingOption("init");
  };

  const toggleBillingModal = () => {
    setBillingModal(!billingModal);
  };

  const handleCheckOut = async () => {
    if (!selectedRoom) return;

    Swal.fire({
      title: "Realizar Check-Out",
      text: `¿Está seguro de realizar el check-Out para la habitación ${selectedRoom.habitacion.numeroHabitacion}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0BB197",
      cancelButtonColor: "#FF3D60",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Sí, ¡realizar check-Out!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const values = [];
        // Habitacion
        values.push({
          descripcion: selectedRoom.habitacion.descripcion,
          codigoCabys: "N/A",
          precioCompra: selectedRoom.habitacion.tipoHabitacion.precioBase,
          cantidadArticulo: 1,
          impuestos: [{ impuesto: 13 }],
        });
        // Servicos Extras - inHouse
        selectedRoom.serviciosExtra?.forEach((value) => {
          values.push({
            descripcion: value.nombre,
            codigoCabys: value.cabys ?? "N/A",
            precioCompra: value.precio,
            cantidadArticulo: value.extra,
            impuestos: [{ impuesto: 13 }],
          });
        });
        // Tours - inHouse
        selectedRoom.toursExtra?.forEach((value) => {
          values.push({
            descripcion: value.nombre,
            codigoCabys: value.cabys ?? "N/A",
            precioCompra: value.precio,
            cantidadArticulo: value.extra,
            impuestos: [{ impuesto: 13 }],
          });
        });
        // Reservacion de servicios Externos
        selectedRoom.serviciosExternos?.forEach((value) => {
          values.push({
            descripcion: value.nombre,
            codigoCabys: value.cabys ?? "N/A",
            precioCompra: value.precio,
            cantidadArticulo: value.extra ?? 1,
            impuestos: [{ impuesto: 13 }],
          });
        });
        // Cargos a la habitacion - inHouse
        selectedRoom.cargosHabitacion?.forEach((value) => {
          values.push({
            descripcion: value.cargo,
            codigoCabys: value.cabys ?? "N/A",
            precioCompra: value.monto,
            cantidadArticulo: value.extra ?? 1,
            impuestos: [{ impuesto: 13 }],
          });
        });

        setFacturaData(values);
        setBillingModal(true);
        toggleModal();
      }
    });
  };

  const removeHuesped = (index) => {
    const removedHuesped = huespedes[index];
    const newHuespedes = huespedes.filter((_, i) => i !== index);
    setHuespedes(newHuespedes);

    if (removedHuesped.id === booking.cliente.id) {
      setBillingOption("init");
    }
  };

  const handleOptionChange = (event) => {
    const newBillingOption = event.target.value;
    setBillingOption(newBillingOption);

    if (newBillingOption === "splitBill" && booking) {
      setHuespedes([]);
    } else if (newBillingOption === "bookingClient") {
      setHuespedes([booking.cliente]);
    }
  };

  const getFilteredByKey = (key, value) => {
    const valName = key.nombre.toLowerCase();
    const valCode = key.codigo.toLowerCase();
    const val = value.toLowerCase();

    if (valName.includes(val) || valCode.includes(val)) {
      return key;
    }
    setStateBooking(true);
    return null;
  };

  const getDataCustomer = () => {
    if (dataCustomer) {
      if (dataCustomer.obtenerClientes) {
        return dataCustomer.obtenerClientes.filter((value) => {
          if (filter !== "") {
            return getFilteredByKey(value, filter);
          }
          return value;
        });
      }
    }
    return [];
  };

  const handleCustomer = (c) => {
    setHuespedes([{ ...c }, ...huespedes]);
    setFilter("");
    setCustomers([]);
  };

  const handleInputChange = (e) => {
    if (e.target.value !== "") {
      setFilter(e.target.value);
      setCustomers(getDataCustomer());
      return;
    } else {
      setFilter("");
      setCustomers([]);
      setStateBooking(false);
    }
  };

  const addNewCustomer = (data) => {
    setHuespedes([{ ...data }, ...huespedes]);
    setFilter("");
  };

  const estadoColores = {
    Cancelada: "danger",
    Pendiente: "warning",
    Pagada: "success",
    Conflicto: "dark",
    Incompleto: "secondary",
    Activa: "info",
    Completada: "primary",
    CheckOut: "purple-600",
    Finalizada: "teal-500",
  };

  const selectpaymentService = () => {
    setShowListService(!showListService);
  };

  if (loading_booking || loading_room) return <p>Cargando...</p>;
  if (error_booking || error_room) return <p>Error al cargar la reserva</p>;
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs
            title="CheckOut"
            breadcrumbItem="Recepción"
            breadcrumbItemUrl="/reception"
          />
        </Container>

        {booking && (
          <Row className="mb-4">
            <Col md={12}>
              <div className="booking-details">
                <h2 className="booking-title">Detalles de la Reservación</h2>
                <div className="booking-info">
                  <div className="info-item">
                    <strong>Reservación ID:</strong> {booking.id}
                  </div>
                  <div className="info-item">
                    <strong>Cliente:</strong> {booking.cliente.nombre}
                  </div>
                  <div className="info-item">
                    <strong>Estado:</strong>{" "}
                    <Badge
                      color={`${estadoColores[booking.estado] || "bg-primary"}`}
                    >
                      {booking.estado}
                    </Badge>
                  </div>
                  <div className="info-item">
                    <strong>Tipo:</strong>{" "}
                    <Badge
                      color={`${estadoColores[booking.estado] || "bg-primary"}`}
                      className="fs-6 p-1 text-center"
                    >
                      {
                        typesBooking.find((item) => item.value === booking.tipo)
                          .label
                      }
                    </Badge>
                  </div>
                  <div className="info-item">
                    <strong>Niños:</strong> {booking.numeroPersonas.ninos}
                  </div>
                  <div className="info-item">
                    <strong>Adultos:</strong> {booking.numeroPersonas.adulto}
                  </div>
                  <div className="info-item">
                    <strong>Ciudad:</strong> {booking.cliente.ciudad},{" "}
                    {booking.cliente.pais}
                  </div>
                  <div className="info-item">
                    <strong>Fecha de Reserva:</strong>{" "}
                    {new Date(
                      Number(booking.fechaReserva)
                    ).toLocaleDateString()}
                  </div>
                  <div className="info-item">
                    <h3>Total: ${booking.total}</h3>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        )}

        {bookingRoom &&
          bookingRoom.obtenerReservaHabitacion &&
          bookingRoom.obtenerReservaHabitacion.length > 0 && (
            <Row className="mb-4">
              <Col md={12}>
                <div className="room-details">
                  <h2 className="room-title">Detalles de la Habitación</h2>
                  {bookingRoom.obtenerReservaHabitacion?.map(
                    (habitacion, index) => (
                      <Card
                        key={habitacion.id}
                        className="room-info p-2 m-3 shadow_booking"
                      >
                        <div key={habitacion.id} className="room-info">
                          <h5>Habitación {index + 1}</h5>
                          <div className="info-item">
                            <strong>Número de Habitación:</strong>{" "}
                            {habitacion.habitacion.numeroHabitacion}
                          </div>
                          <div className="info-item">
                            <strong>Tipo de Habitación:</strong>{" "}
                            {habitacion.habitacion.tipoHabitacion?.nombre}
                          </div>
                          <div className="info-item">
                            <strong>Precio por Noche:</strong> $
                            {habitacion.habitacion.precioPorNoche}
                          </div>
                          <div className="info-item">
                            <strong>Fecha de Entrada:</strong>{" "}
                            {new Date(
                              Number(habitacion.fechaEntrada)
                            ).toLocaleDateString()}
                          </div>
                          <div className="info-item">
                            <strong>Fecha de Salida:</strong>{" "}
                            {new Date(
                              Number(habitacion.fechaSalida)
                            ).toLocaleDateString()}
                          </div>

                          <Button
                            color="success"
                            onClick={() => toggleModal(habitacion)}
                          >
                            Check-Out
                          </Button>
                        </div>
                      </Card>
                    )
                  )}
                </div>
              </Col>
            </Row>
          )}
        <Modal
          classname=""
          isOpen={billingModal}
          toggle={() => toggleBillingModal(null)}
          size="xl"
        >
          <ModalHeader toggle={() => toggleBillingModal(null)}>
            Facturación
          </ModalHeader>
          <ModalBody>
            <Card className="w-100">
              <CardBody>
                <Tabs defaultActiveKey={`0`} id="builling-tab" className="mb-3">
                  {huespedes.map((huesped, index) => (
                    <Tab eventKey={`${index}`} title={huesped.nombre}>
                      <InvoiceMaintenance
                        data={{ articulosLista: facturaData }}
                      />
                    </Tab>
                  ))}
                </Tabs>
              </CardBody>
            </Card>
          </ModalBody>
        </Modal>

        <Modal
          classname=""
          isOpen={modal}
          toggle={() => toggleModal(null)}
          size="lg"
        >
          <ModalHeader toggle={() => toggleModal(null)}>
            {!showListService ? (
              <>¿A quién facturar? </>
            ) : (
              <>Selecionar servicios</>
            )}
          </ModalHeader>
          {!showListService ? (
            <ModalBody>
              <FormGroup>
                <Row className="p-3">
                  <Col className="d-flex justify-content-center">
                    <div className="form-check ms-3 mt-4">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="useBookingClient"
                        name="billingOption"
                        value="bookingClient"
                        checked={billingOption === "bookingClient"}
                        onClick={handleOptionChange}
                      />
                      <label
                        htmlFor="useBookingClient"
                        className="form-check-label ms-2"
                      >
                        Facturar a quien realizó la reserva
                      </label>
                    </div>
                  </Col>
                  <Col className="d-flex justify-content-center">
                    <div className="form-check ms-3 mt-4">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="useSplitBill"
                        name="billingOption"
                        value="splitBill"
                        checked={billingOption === "splitBill"}
                        onClick={handleOptionChange}
                      />
                      <label
                        htmlFor="useSplitBill"
                        className="form-check-label ms-2"
                      >
                        Dividir cuenta
                      </label>
                    </div>
                  </Col>
                </Row>
              </FormGroup>
              {(billingOption !== "init") & (billingOption !== null) ? (
                <Row className="d-flex justify-content-between p-3">
                  <Row className="d-flex justify-content-between p-3 pb-0">
                    <div className="col-md-12 mb-1">
                      <label> Busca el cliente</label>
                      <input
                        className="form-control"
                        id="search-input"
                        value={filter}
                        onChange={(e) => handleInputChange(e)}
                        type="search"
                        disabled={billingOption === "bookingClient"}
                        placeholder="Escribe el nombre o la identificación del cliente"
                      />
                    </div>
                  </Row>

                  <Row className="col-md-12 d-flex align-items-center flex-wrap ps-4">
                    {customers?.length > 0 ? (
                      <ul
                        className="list-group form-control ontent-scroll p-3 mb-3 border rounded-3"
                        style={{
                          zIndex: 1000,
                          maxHeight: "300px",
                          overflowY: "auto",
                        }}
                      >
                        {customers.map((customer, index) => (
                          <li
                            key={customer.id}
                            onClick={() => handleCustomer(customer)}
                            className="ist-group-item list-group-item-action rounded p-2 search_customer_wizard"
                          >
                            {customer.nombre}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      filter !== "" && (
                        <Row className="d-flex justify-content-between  p-3">
                          <label>
                            No existe el cliente, ¿Desea agregar uno?
                          </label>
                          <Card className="col-xl-12 col-md-12 p-0">
                            <CardBody className="p-0">
                              <NewCustomer
                                props={{ addNewCustomer, stateBooking }}
                              />
                            </CardBody>
                          </Card>
                        </Row>
                      )
                    )}
                  </Row>
                  <Card className="p-3">
                    {huespedes.map((huesped, index) => (
                      <Row key={index} form>
                        <Col md={5}>
                          <FormGroup>
                            <Label for={`nombre-${index}`}>
                              <strong>Nombre:</strong>{" "}
                              <span className="fs-5 label_package_color">
                                {huesped.nombre}
                              </span>
                            </Label>
                          </FormGroup>
                        </Col>
                        <Col md={5}>
                          <FormGroup>
                            <Label for={`documento-${index}`}>
                              <strong>Identificación:</strong>{" "}
                              <span className="fs-5 label_package_color">
                                {huesped.codigo}
                              </span>
                            </Label>
                          </FormGroup>
                        </Col>
                        <Col md={2} className="d-flex align-items-center">
                          <ButtonIconTable
                            icon="mdi mdi-delete"
                            color="danger"
                            onClick={() => {
                              removeHuesped(index);
                            }}
                          />
                        </Col>
                      </Row>
                    ))}
                  </Card>
                </Row>
              ) : (
                <div className="d-flex justify-content-center p-3">
                  <label
                    htmlFor="search-input"
                    className="col-md-4 col-form-label text-center"
                  >
                    Selecciona una opción
                  </label>
                </div>
              )}
            </ModalBody>
          ) : (
            <ModalBody>
              <Card className="w-100">
                <CardBody>
                  <Tabs
                    defaultActiveKey={`0`}
                    id="builling-tab"
                    className="mb-3"
                  >
                    {huespedes.map((huesped, index) => (
                      <Tab eventKey={`${index}`} title={huesped.nombre}>
                        <ServiceSelectCheckOut />
                      </Tab>
                    ))}
                  </Tabs>
                </CardBody>
              </Card>
            </ModalBody>
          )}

          <ModalFooter>
            <Button color="secondary" onClick={() => toggleModal(null)}>
              Cancelar
            </Button>
            {billingOption !== "init" && (
              <Button
                disabled={huespedes.length === 0}
                color="success"
                onClick={
                  billingOption === "bookingClient"
                    ? handleCheckOut
                    : selectpaymentService
                }
              >
                {billingOption === "bookingClient" ? (
                  <>Realizar Check-Out</>
                ) : (
                  <>Selecionar servicios</>
                )}
              </Button>
            )}
          </ModalFooter>
        </Modal>
      </div>
    </React.Fragment>
  );
};

export default BookingChecOut;
