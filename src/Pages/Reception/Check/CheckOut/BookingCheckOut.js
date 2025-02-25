import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { infoAlert } from "../../../../helpers/alert";
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

const BookingChecOut = () => {
  document.title = "CheckOut | FARO";

  const navigate = useNavigate();

  const { id } = useParams(); // Obtener el ID de la reserva desde los parámetros de la URL
  const { data: dataCustomer } = useQuery(OBTENER_CLIENTES, {
    pollInterval: 1000,
  });
  const { loading: loadTypeRooms, data: typeRooms } = useQuery(
    OBTENER_TIPOSHABITACION,
    { pollInterval: 1000 }
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
    pollInterval: 1000,
  });

  const [filter, setFilter] = useState("");
  const [booking, setBooking] = useState(null);
  const [modal, setModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [huespedes, setHuespedes] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [stateBooking, setStateBooking] = useState(false);

  const [billingOption, setBillingOption] = useState("init");

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
        //Acá check Out
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
    setBillingOption(event.target.value);
    setHuespedes([]);
    if (billingOption === "splitBill" && booking) {
      setHuespedes([{ ...booking.cliente }]);
    } else {
      setHuespedes(huespedes.filter((h) => h.id !== booking.cliente.id));
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
          isOpen={modal}
          toggle={() => toggleModal(null)}
          size="lg"
        >
          <ModalHeader toggle={() => toggleModal(null)}>
            Facturación
          </ModalHeader>
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
                        <label>No existe el cliente, ¿Desea agregar uno?</label>
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
          <ModalFooter>
            <Button color="secondary" onClick={() => toggleModal(null)}>
              Cancelar
            </Button>
            <Button
              disabled={huespedes.length === 0}
              color="success"
              onClick={handleCheckOut}
            >
              Realizar Check-Out
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </React.Fragment>
  );
};

export default BookingChecOut;
