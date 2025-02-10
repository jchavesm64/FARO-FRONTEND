import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  FormGroup,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import { useApolloClient, useMutation } from "@apollo/client";
import Select from "react-select";
import Breadcrumbs from "../../../../components/Common/Breadcrumb";
import {
  OBTENER_FULL_RESERVAHABITACION,
  UPDATE_RESERVA_HABITACION,
} from "../../../../services/ReservaHabitacionService";
import { OBTENER_SERVICIO } from "../../../../services/ServiciosExtraService";
import PlusMinusInput from "../../../../components/Common/PlusMinusInput";
import ButtonIconTable from "../../../../components/Common/ButtonIconTable";
import { Tab, Tabs } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { getFecha, timestampToDateLocal } from "../../../../helpers/helpers";
import DataList from "../../../../components/Common/DataList";
import { infoAlert, requestConfirmationAlert } from "../../../../helpers/alert";
import { keys } from "lodash";
import { UPDATE_RESERVA_INFO } from "../../../../services/ReservaService";

const AdditionalServices = () => {
  const client = useApolloClient();

  const [selectedReservation, setSelectedReservation] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomsReservation, setRoomsReservation] = useState([]);
  const [services, setServices] = useState([]);
  const [extraServices, setExtraServices] = useState({});
  const [selectedService, setSelectedService] = useState(null);
  const [isSelectingType, setIsSelectingType] = useState(false);
  const [isInfoModified, setIsInfoModified] = useState(false);

  const [calendarModal, setCalendarModal] = useState(false);
  const [extraDate, setExtraDate] = useState({});

  const [key, setKey] = useState("room");

  const isRoomTabSelected = key === "room";
  const isReservationTabSelected = key === "reservation";

  // Services
  const [updateReservaHabitacion] = useMutation(UPDATE_RESERVA_HABITACION);
  const [updateReserva] = useMutation(UPDATE_RESERVA_INFO);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const { data } = await client.query({
          query: OBTENER_FULL_RESERVAHABITACION,
          fetchPolicy: "network-only",
        });
        setRoomsReservation(data.obtenerReservaHabitaciones);
      } catch (error) {
        console.error("Error fetching reservas:", error);
      }
    };
    const fetchServicios = async () => {
      try {
        const { data } = await client.query({
          query: OBTENER_SERVICIO,
          fetchPolicy: "network-only",
        });
        setServices(data.obtenerServicios);
      } catch (error) {
        console.error("Error fetching servicios:", error);
      }
    };

    fetchReservas();
    fetchServicios();
  }, [client, key]);

  const toggleCalendarModal = () => setCalendarModal(!calendarModal);

  const getServices = () => {
    const datos = [];
    if (services) {
      const currentIdSelected = isRoomTabSelected
        ? selectedRoom?.id
        : selectedReservation?.id;
      const alreadySelectedServices = extraServices[currentIdSelected]?.map(
        (service) => service?.id
      );
      services
        .filter((item) => !alreadySelectedServices?.includes(item.id))
        .forEach((item) => {
          datos.push({
            value: item,
            label: item?.nombre || "",
          });
        });
    }
    return datos;
  };

  const AdditionalServicesTable = () => {
    const currentIdSelected = isRoomTabSelected
      ? selectedRoom?.id
      : selectedReservation?.id;
    return (
      <table className="table table-hover table-striped mb-0">
        <thead>
          <tr>
            <th key="service" className="text-center">
              Servicio
            </th>
            <th key="price" className="text-center">
              Precio
            </th>
            <th style={{ width: "20%" }} key="extra" className="text-center">
              Extra
            </th>
            <th style={{ width: "28%" }} key="actions" className="text-center">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {extraServices[currentIdSelected]?.map((line, index) => {
            const isQuantifiable = line.tipo?.cuantificable === "true";
            return (
              <tr key={index}>
                <td>{line.nombre}</td>
                <td className="precio-td">{line.precio}</td>
                <td>
                  {isQuantifiable && (
                    <PlusMinusInput
                      value={line?.extra ?? 1}
                      handleChange={(newNum) => {
                        const newListValue = extraServices[
                          currentIdSelected
                        ]?.map((s, i) => {
                          if (index === i) return { ...s, extra: newNum };
                          return s;
                        });
                        setExtraServices({
                          ...extraServices,
                          [currentIdSelected]: newListValue,
                        });
                        if (!isInfoModified) setIsInfoModified(true);
                      }}
                      maxAvailable={100}
                    />
                  )}
                </td>
                <td className="actions-td">
                  {isQuantifiable && (
                    <ButtonIconTable
                      icon="mdi mdi-calendar-range"
                      color="info"
                      onClick={() => {
                        setExtraDate(line);
                        toggleCalendarModal();
                      }}
                    />
                  )}
                  {
                    <ButtonIconTable
                      icon="mdi mdi-delete"
                      color="danger"
                      onClick={() => {
                        const currentIdSelected = isRoomTabSelected
                          ? selectedRoom?.id
                          : selectedReservation?.id;
                        const newListValue = extraServices[
                          currentIdSelected
                        ]?.filter((s, i) => {
                          return index !== i;
                        });
                        setExtraServices({
                          ...extraServices,
                          [currentIdSelected]: newListValue,
                        });
                        if (!isInfoModified) setIsInfoModified(true);
                      }}
                    />
                  }
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  const ReservationSelection = () => {
    const uniqueArray = roomsReservation.reduce((acc, value) => {
      if (
        !acc.find(
          (f) => f?.reserva?.cliente?.id === value?.reserva?.cliente?.id
        )
      ) {
        acc.push(value);
      }
      return acc;
    }, []);
    const reservations = uniqueArray.map((value) => value?.reserva);

    return (
      <div className="">
        <div className="p-6 flex flex-col align-items-left"></div>
        <div className="reservations p-6 pt-0 overflow-auto">
          <div className="reservations-container">
            {reservations.map((reservation, index) => {
              const date = new Date(+reservation?.fechaReserva);
              return (
                <ReservationCard
                  key={index}
                  title={reservation?.cliente?.nombreFacturacion}
                  rangeDates={date.toLocaleDateString("es-ES")}
                  onClick={() => {
                    setSelectedReservation(reservation);
                    const extraServicesKeys = keys(extraServices);
                    if (!extraServicesKeys.includes(reservation?.id)) {
                      setExtraServices({
                        ...extraServices,
                        [reservation?.id]: reservation?.serviciosGrupal ?? [],
                      });
                    }
                  }}
                  isSelected={selectedReservation?.id === reservation?.id}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const ReservationCard = (props) => {
    const { title, rangeDates, onClick, isSelected } = props;
    return (
      <Card color={isSelected ? "secondary" : "primary"} onClick={onClick}>
        <CardBody>
          <div className="text-left">
            <div className="font-bold">{title}</div>
            <div>Fecha: {rangeDates}</div>
          </div>
        </CardBody>
      </Card>
    );
  };

  const RoomsSelection = () => {
    const buildPersonQuantity = (adults, children) => {
      let verbiage = "";
      if (adults > 0) {
        verbiage += `${adults} adulto${adults > 1 ? "s" : ""}`;
      }
      if (children > 0) {
        verbiage += `${adults > 0 ? ", " : ""}${children} niño${
          children > 1 ? "s" : ""
        }`;
      }
      return verbiage;
    };

    return (
      <div>
        <div className="p-6 flex flex-col align-items-left"></div>
        <div className="rooms p-6 pt-0 overflow-auto">
          <div className="rooms-container">
            {roomsReservation.map((room, index) => {
              return (
                <RoomCard
                  key={index}
                  roomName={room.habitacion.numeroHabitacion}
                  personQuantity={buildPersonQuantity(
                    room.reserva?.numeroPersonas?.adulto,
                    room.reserva?.numeroPersonas?.nino
                  )}
                  onClick={() => {
                    setSelectedRoom(room);
                    const extraServicesKeys = keys(extraServices);
                    if (!extraServicesKeys.includes(room?.id)) {
                      setExtraServices({
                        ...extraServices,
                        [room?.id]: room?.serviciosExtra ?? [],
                      });
                    }
                  }}
                  isSelected={selectedRoom?.id === room.id}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const RoomCard = (props) => {
    const { roomName, personQuantity, onClick, isSelected } = props;
    return (
      <Card color={isSelected ? "secondary" : "primary"} onClick={onClick}>
        <CardBody>
          <div className="text-left">
            <div className="font-bold">Numero de habitacion: {roomName}</div>
            <div>{personQuantity}</div>
          </div>
        </CardBody>
      </Card>
    );
  };

  const addExtraService = (service) => {
    if (isRoomTabSelected) {
      const list = extraServices[selectedRoom?.id] ?? [];
      setExtraServices({
        ...extraServices,
        [selectedRoom?.id]: [...list, service],
      });
    } else if (isReservationTabSelected) {
      const list = extraServices[selectedReservation?.id] ?? [];
      setExtraServices({
        ...extraServices,
        [selectedReservation?.id]: [...list, service],
      });
    }
  };

  const saveServicesForReservaHabitacion = async () => {
    const savedServicesPromises = [];
    keys(extraServices).forEach((key) => {
      const input = {
        serviciosExtra: extraServices[key],
      };
      savedServicesPromises.push(
        updateReservaHabitacion({
          variables: { id: key, input },
          errorPolicy: "all",
        })
      );
    });

    await Promise.all(savedServicesPromises);
  };

  const saveServicesForReserva = async () => {
    const savedServicesPromises = [];
    keys(extraServices).forEach((key) => {
      const input = {
        serviciosGrupal: extraServices[key],
      };
      savedServicesPromises.push(
        updateReserva({
          variables: { id: key, input },
          errorPolicy: "all",
        })
      );
    });

    await Promise.all(savedServicesPromises);
  };

  const AdditionalServices = () => {
    return (
      <Card className="w-50">
        <CardBody>
          <div>
            <div className="flex flex-col p-6 additional-services-container">
              <h3>Servicios Adicionales</h3>
              {(selectedRoom != null || selectedReservation != null) &&
              isSelectingType ? (
                <div className="row row-cols-lg-auto g-3 align-items-center justify-content-between">
                  <div className="col-xl-8 col-md-12">
                    <Select
                      id="service"
                      value={selectedService}
                      onChange={(e) => {
                        if (e?.value) setSelectedService(e);
                      }}
                      options={getServices()}
                      placeholder="Servicios"
                      classNamePrefix="select2-selection"
                    />
                  </div>
                  <div style={{ gap: "14px" }} className="col-12 d-flex">
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        addExtraService({
                          ...selectedService.value,
                          extra: 1,
                        });
                        setSelectedService(null);
                        setIsSelectingType(false);
                        if (!isInfoModified) setIsInfoModified(true);
                      }}
                      disabled={selectedService === null}
                    >
                      Aceptar
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        setSelectedService(null);
                        setIsSelectingType(false);
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="add-save-services-container">
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => {
                      setIsSelectingType(true);
                    }}
                    disabled={
                      (isRoomTabSelected && !selectedRoom) ||
                      (isReservationTabSelected && !selectedReservation)
                    }
                  >
                    Agregar Servicio
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      requestConfirmationAlert({
                        title: "¿Estás seguro?",
                        bodyText: "¿Deseas guardar los servicios adicionales?",
                        confirmButtonText: "Sí, guardar cambios",
                        confirmationEvent: () => {
                          if (isRoomTabSelected)
                            saveServicesForReservaHabitacion();
                          if (isReservationTabSelected)
                            saveServicesForReserva();
                          setIsInfoModified(false);
                        },
                      });
                    }}
                    disabled={
                      (isRoomTabSelected && !selectedRoom) ||
                      (isReservationTabSelected && !selectedReservation)
                    }
                  >
                    Guardar Servicios
                  </button>
                </div>
              )}
            </div>
            <div className="p-6 pt-0 overflow-auto">
              <div>
                <div className="flex items-center flex-direction-column services-container">
                  {((isRoomTabSelected && selectedRoom === null) ||
                    (isReservationTabSelected &&
                      selectedReservation === null)) && (
                    <p>
                      Para actualizar o agregar servicios adicionales, primero
                      tiene que seleccionar un cuarto.
                    </p>
                  )}
                  {((isRoomTabSelected && selectedRoom) ||
                    (isReservationTabSelected && selectedReservation)) && (
                    <AdditionalServicesTable />
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  };

  const getFechaFromReservaHabitacion = (fechaField) => {
    const date = timestampToDateLocal(
      Number(selectedRoom?.[fechaField]),
      "date"
    );
    return getFecha(date);
  };

  return (
    <div className="page-content">
      <Container fluid={true}>
        <Breadcrumbs
          title="InHouse"
          breadcrumbItem="Recepción"
          breadcrumbItemUrl="/reception"
        />
        <div className="flex gap-4">
          <Card className="w-50">
            <CardBody>
              <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(k) => {
                  const handleChangeTab = () => {
                    setExtraServices({});
                    setSelectedRoom(null);
                    setSelectedReservation(null);
                    setIsSelectingType(false);
                    setIsInfoModified(false);
                    setKey(k);
                  };
                  if (isInfoModified) {
                    requestConfirmationAlert({
                      title: "¿Estás seguro?",
                      bodyText:
                        "Tienes cambios sin guardar. ¿Deseas continuar sin guardar los servicios adicionales?",
                      confirmButtonText: "Sí, Continuar",
                      confirmationEvent: handleChangeTab,
                    });
                  } else {
                    handleChangeTab();
                  }
                }}
                className="mb-3"
              >
                <Tab eventKey="room" title="Habitación">
                  <RoomsSelection />
                </Tab>
                <Tab eventKey="reservation" title="Reservación">
                  <ReservationSelection />
                </Tab>
              </Tabs>
            </CardBody>
          </Card>
          <AdditionalServices />
        </div>
        <Modal
          key="modalCustomer"
          isOpen={calendarModal}
          toggle={toggleCalendarModal}
          onClosed={() => {
            const currentIdSelected = isRoomTabSelected
              ? selectedRoom?.id
              : selectedReservation?.id;
            const currentServiceEdited = extraServices[currentIdSelected].find(
              (es) => es.id === extraDate.id
            );
            if (!currentServiceEdited.useExtra?.length) {
              const newListValue = extraServices[currentIdSelected]?.map(
                (s) => {
                  if (s.id === extraDate.id) {
                    return { ...s, useExtra: extraDate.useExtra };
                  }
                  return s;
                }
              );
              setExtraServices({
                ...extraServices,
                [currentIdSelected]: newListValue,
              });
            } else {
              const newListValue = extraServices[currentIdSelected]?.map(
                (se) => {
                  if (se.id === extraDate.id) {
                    return { ...se, useExtra: extraDate.useExtra };
                  }
                  return se;
                }
              );
              setExtraServices({
                ...extraServices,
                [currentIdSelected]: newListValue,
              });
            }
          }}
          size={!extraDate ? "xl" : "lg"}
        >
          <ModalHeader key="modalheader" toggle={toggleCalendarModal}>
            {extraDate.length === 0 ? (
              <span className="fs-4 m-0 span_package_color">
                Editar sevicio
              </span>
            ) : (
              <span className="fs-4 m-0 span_package_color">
                Fechas para el uso de cada servicio extra
              </span>
            )}
          </ModalHeader>

          <ModalBody key="modalbody">
            <Card className="p-4">
              <Row>
                <div className="d-flex flex-column">
                  <label className="fs-5 m-0 ms-1 mb-2 span_package_color">
                    <strong>Servicio: </strong>
                    <span className="fs-5 label_package_color">
                      {extraDate?.nombre}
                    </span>
                  </label>
                  <label className="fs-5 m-0 ms-1 mb-2 span_package_color">
                    <strong>Extra: </strong>
                    <span className="fs-5 label_package_color">
                      {extraDate?.extra}
                    </span>
                  </label>
                </div>
              </Row>
              <Row className="d-flex justify-content-between shadow_service rounded-5 p-3">
                <Col className="col-md-6 d-flex  flex-wrap justify-content-center align-items-center p-0">
                  <FormGroup className=" m-0" disabled={true}>
                    <DatePicker
                      startDate={new Date()}
                      onChange={(e) => {
                        if (
                          (extraDate?.useExtra?.length ?? 0) < extraDate?.extra
                        ) {
                          const newUseExtra = [
                            ...(extraDate?.useExtra || []),
                            e,
                          ];
                          setExtraDate({
                            ...extraDate,
                            useExtra: newUseExtra,
                          });
                          if (!isInfoModified) setIsInfoModified(true);
                        } else {
                          infoAlert(
                            "Oops",
                            "Ya completó las fechas para los servicios extra",
                            "warning",
                            3000,
                            "top-end"
                          );
                        }
                      }}
                      inline
                      className="form-control"
                      minDate={getFechaFromReservaHabitacion("fechaEntrada")}
                      maxDate={getFechaFromReservaHabitacion("fechaSalida")}
                    />
                  </FormGroup>
                </Col>
                <Col className="col-md-6  d-flex justify-content-center flex-wrap">
                  <DataList
                    data={extraDate?.useExtra ? extraDate.useExtra : []}
                    type="tableDate"
                    displayLength={3}
                    enableDelete={true}
                    deleteAction={(index) => {
                      setExtraDate({
                        ...extraDate,
                        useExtra: extraDate.useExtra.filter(
                          (_, i) => index !== i
                        ),
                      });
                      if (!isInfoModified) setIsInfoModified(true);
                    }}
                  />
                </Col>
              </Row>
            </Card>
          </ModalBody>
        </Modal>
      </Container>
    </div>
  );
};

export default AdditionalServices;
