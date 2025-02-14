import { Card, CardBody, Container } from "reactstrap";
import Breadcrumbs from "../../../../components/Common/Breadcrumb";
import { useEffect, useState } from "react";
import { useApolloClient, useMutation } from "@apollo/client";
import {
  OBTENER_FULL_RESERVAHABITACION,
  UPDATE_RESERVA_HABITACION,
} from "../../../../services/ReservaHabitacionService";
import {
  OBTENER_HABITACIONES_DISPONIBLES,
  UPDATE_HABITACION,
} from "../../../../services/HabitacionesService";
import {
  askForInputAlert,
  requestConfirmationAlert,
  requestConfirmationAlertAsync,
} from "../../../../helpers/alert";

const RoomChange = () => {
  const client = useApolloClient();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedNewRoom, setSelectedNewRoom] = useState(null);
  const [roomsReservation, setRoomsReservation] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);

  const [actualizarHabitacion] = useMutation(UPDATE_HABITACION);
  const [actualizarReservaHabitacion] = useMutation(UPDATE_RESERVA_HABITACION);

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

          <div className="button-actions-container"></div>
          <p>Seleccione la habitación a cambiar</p>
        </div>
        <div className="rooms p-6 pt-0 overflow-auto">
          <div className="rooms-container">
            {[...roomsReservation]
              .sort((a, b) =>
                collator.compare(
                  a.habitacion.numeroHabitacion,
                  b.habitacion.numeroHabitacion
                )
              )
              .map((room) => {
                return (
                  <RoomCard
                    roomName={room.habitacion.numeroHabitacion}
                    description={buildPersonQuantity(
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
    const {
      roomName,
      description,
      onClick,
      isSelected,
      defaultDescription = "",
    } = props;
    return (
      <Card color={isSelected ? "secondary" : "primary"} onClick={onClick}>
        <CardBody>
          <div className="text-left">
            <div className="font-bold">Numero de habitacion: {roomName}</div>
            <div>{description || defaultDescription}</div>
          </div>
        </CardBody>
      </Card>
    );
  };

  const handleRoomChange = async () => {
    // se actualiza la habitacion "vieja"
    const oldRoominput = {
      estado: "Disponible",
    };
    const { data: oldRoomData } = await actualizarHabitacion({
      variables: { id: selectedRoom.habitacion.id, input: oldRoominput },
      errorPolicy: "all",
    });
    // const { estado, message } = data.actualizarHabitacion;

    // se actualiza la habitacion "nueva"
    const newRoominput = {
      estado: "Ocupada",
    };
    const { data: newRoomData } = await actualizarHabitacion({
      variables: { id: selectedNewRoom.id, input: newRoominput },
      errorPolicy: "all",
    });
    // const { estado, message } = data.actualizarHabitacion;

    //se actualiza la reservaHabitacion
    const reservaHabitacionInput = {
      habitacion: selectedNewRoom.id,
    };
    const { data: reservaHabitacionData } = await actualizarReservaHabitacion({
      variables: { id: selectedRoom.id, input: reservaHabitacionInput },
      errorPolicy: "all",
    });

    fetchInitialInfo();
    setSelectedNewRoom(null);
    setSelectedRoom(null);
  };

  const collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: "base",
  });

  const fetchInitialInfo = () => {
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

    const fetchHabitacionesDisponibles = async () => {
      try {
        const { data } = await client.query({
          query: OBTENER_HABITACIONES_DISPONIBLES,
          fetchPolicy: "network-only",
        });
        setAvailableRooms(data.obtenerHabitacionesDisponibles);
      } catch (error) {
        console.error("Error fetching available rooms:", error);
      }
    };

    fetchReservas();
    fetchHabitacionesDisponibles();
  };

  useEffect(() => {
    fetchInitialInfo();
  }, [client]);

  return (
    <div className="page-content">
      <Container fluid={true}>
        <Breadcrumbs
          title="Cargos a la habitación"
          breadcrumbItem="InHouse"
          breadcrumbItemUrl="/inhouse"
        />
        <div className="flex gap-4">
          <Card className="w-50">
            <CardBody>
              <RoomsSelection />
            </CardBody>
          </Card>
          <Card className="w-50">
            <CardBody>
              <div>
                <div className="flex flex-col p-6">
                  {selectedRoom && (
                    <>
                      <div className="button-actions-container room-change-actions">
                        <p>Seleccione la habitación destino</p>
                        <button
                          type="button"
                          class="btn btn-primary"
                          disabled={!selectedNewRoom}
                          onClick={() => {
                            requestConfirmationAlertAsync({
                              title: "Antes de guardar",
                              bodyText: `La habitación número ${selectedRoom.habitacion.numeroHabitacion} sera cambiada por la número ${selectedNewRoom.numeroHabitacion}`,
                              confirmButtonText: "Confirmar",
                              asyncConfirmationEvent: handleRoomChange,
                            });
                          }}
                        >
                          Realizar cambio de Habitación
                        </button>
                      </div>
                      {/* <SearchInput /> */}
                    </>
                  )}
                </div>
                {selectedRoom && (
                  <div className="pt-0 overflow-auto">
                    <div className="rooms p-6 pt-0 overflow-auto">
                      <div className="rooms-container">
                        {[...availableRooms]
                          .sort((a, b) =>
                            collator.compare(
                              a.numeroHabitacion,
                              b.numeroHabitacion
                            )
                          )
                          .map((room) => {
                            return (
                              <RoomCard
                                roomName={room.numeroHabitacion}
                                description={room.descripcion}
                                defaultDescription={"N/A"}
                                onClick={() => setSelectedNewRoom(room)}
                                isSelected={selectedNewRoom?.id === room.id}
                              />
                            );
                          })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default RoomChange;
