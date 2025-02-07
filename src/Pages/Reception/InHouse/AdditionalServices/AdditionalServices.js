import React, { useState, useEffect, useRef } from "react";
import { Card, CardBody, Container, Input, Row } from "reactstrap";
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
import { keys } from "lodash";

const AdditionalServices = () => {
  const client = useApolloClient();

  const [selectedReservation, setSelectedReservation] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomsReservation, setRoomsReservation] = useState([]);
  const [services, setServices] = useState([]);
  const [extraServices, setExtraServices] = useState({});
  const [selectedService, setSelectedService] = useState(null);
  const [isSelectingType, setIsSelectingType] = useState(false);

  const [key, setKey] = useState("room");
  const [filterKey, setFilterKey] = useState("");
  const searchRef = useRef(null);

  //services
  const [update] = useMutation(UPDATE_RESERVA_HABITACION);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const { data } = await client.query({
          query: OBTENER_FULL_RESERVAHABITACION,
          fetchPolicy: "network-only", // Always fetch fresh data
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
          fetchPolicy: "network-only", // Always fetch fresh data
        });
        setServices(data.obtenerServicios);
      } catch (error) {
        console.error("Error fetching servicios:", error);
      }
    };

    fetchReservas();
    fetchServicios();
    // const interval = setInterval(fetchReservas, 1000); // Poll every second

    // return () => clearInterval(interval); // Cleanup on unmount
  }, [client]);

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
        <div className="p-6 flex flex-col align-items-left">
          <h3>Reservaciones</h3>
        </div>
        <div className="reservations p-6 pt-0 overflow-auto">
          <div className="reservations-container">
            {reservations.map((reservation) => {
              const date = new Date(+reservation?.fechaReserva);
              return (
                <ReservationCard
                  title={reservation?.cliente?.nombreFacturacion}
                  rangeDates={date.toLocaleDateString("es-ES")}
                  onClick={() => setSelectedReservation(reservation)}
                  isSelected={selectedReservation?.id === reservation.id}
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
        <div className="p-6 flex flex-col align-items-left">
          {/* <SearchInput /> */}
        </div>
        <div className="rooms p-6 pt-0 overflow-auto">
          <div className="rooms-container">
            {roomsReservation.map((room) => {
              return (
                <RoomCard
                  roomName={room.habitacion.numeroHabitacion}
                  personQuantity={buildPersonQuantity(
                    room.reserva?.numeroPersonas?.adulto,
                    room.reserva?.numeroPersonas?.nino
                  )}
                  onClick={() => setSelectedRoom(room)}
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
    const list = extraServices[selectedRoom?.id] ?? [];
    setExtraServices({
      ...extraServices,
      [selectedRoom?.id]: [...list, service],
    });
  };

  const TypeSelector = () => {
    const buildOptions = () => {
      const datos = [];
      if (services) {
        const alreadySelectedServices = extraServices[selectedRoom?.id]?.map(
          (service) => service?.id
        );
        services
          .filter((item) => !alreadySelectedServices?.includes(item.id))
          .map((item) => {
            datos.push({
              value: item,
              label: item?.nombre || "",
            });
          });
      }
      return datos;
    };

    const saveService = async (service) => {
      const input = {
        serviciosExtra: [{ _id: service.id, estado: "ACTIVO" }],
      };
      const { data } = await update({
        variables: { id: selectedRoom.id, input },
        errorPolicy: "all",
      });
    };

    return (
      <Card color={"secondary"}>
        <CardBody>
          <div className="draft-card-container">
            <div className="select-container">
              <Select
                id="servicios"
                menuPosition="fixed"
                size="md"
                placeholder="Seleccione el servicio a agregar"
                value={selectedService}
                options={buildOptions()}
                searchable={true}
                onChange={(e) => {
                  if (e?.value) {
                    setSelectedService(e);
                  }
                }}
              />
            </div>
            <ButtonIconTable
              icon="mdi mdi-check"
              color="success"
              disabled={!selectedService}
              onClick={() => {
                addExtraService(selectedService.value);
                setSelectedService(null);
                setIsSelectingType(false);
                saveService(selectedService.value);
              }}
            />
            <ButtonIconTable
              icon="bx bx-x"
              color="danger"
              onClick={() => {
                setIsSelectingType(false);
                setSelectedService(null);
              }}
            />
          </div>
        </CardBody>
      </Card>
    );
  };

  const AdditionalServices = () => {
    return (
      <Card className="w-50">
        <CardBody>
          <div>
            <div className="flex flex-col p-6">
              <h3>Servicios Adicionales</h3>
            </div>
            <div className="p-6 pt-0 overflow-auto">
              <div>
                <div className="flex items-center flex-direction-column services-container">
                  {selectedRoom === null && (
                    <p>
                      Para actualizar o agregar servicios adicionales, primero
                      tiene que seleccionar un cuarto.
                    </p>
                  )}
                  {extraServices[selectedRoom?.id]?.map((service, index) => {
                    return (
                      <AdditionalServiceCard service={service} index={index} />
                    );
                  })}
                  {isSelectingType && <TypeSelector />}

                  {!(selectedRoom === null || isSelectingType) && (
                    <a
                      onClick={() => setIsSelectingType(true)}
                      className="add-link"
                    >
                      Agregar servicio
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  };

  const AdditionalServiceCard = (props) => {
    const { service, index } = props;
    return (
      <Card color={"secondary"}>
        <CardBody>
          <div className="text-left additional-service-container">
            <div className="additional-service-info">
              <div className="font-bold">Servicio: {service.nombre}</div>
              <div>Precio: {service.precio}</div>
            </div>
            {service?.tipo?.cuantificable === "true" && (
              <PlusMinusInput
                value={extraServices[selectedRoom?.id][index]?.numExtra ?? 0}
                handleChange={(newNum) => {
                  const newListValue = extraServices[selectedRoom?.id]?.map(
                    (s, i) => {
                      if (index === i) return { ...s, numExtra: newNum };
                      return s;
                    }
                  );
                  setExtraServices({
                    ...extraServices,
                    [selectedRoom?.id]: newListValue,
                  });
                }}
                maxAvailable={5}
              />
            )}
          </div>
        </CardBody>
      </Card>
    );
  };

  const SearchInput = () => {
    return (
      <input
        className="form-control"
        type="search"
        placeholder="Escriba el término a buscar"
        value={filterKey}
        ref={searchRef}
        onChange={(e) => {
          setFilterKey(e.target.value);
          searchRef.current.focus();
          // setFilterKey(e.target.value);
        }}
      />
    );
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
                  setKey(k);
                }}
                className="mb-3"
              >
                <Tab eventKey="room" title="Habitación">
                  <RoomsSelection />
                </Tab>
                <Tab eventKey="reservation" title="Reservación">
                  Tab content for reservation
                  <ReservationSelection />
                </Tab>
              </Tabs>
            </CardBody>
          </Card>
          <AdditionalServices />
        </div>
      </Container>
    </div>
  );
};

export default AdditionalServices;
