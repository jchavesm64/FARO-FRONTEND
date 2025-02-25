import {
  Button,
  Card,
  CardBody,
  Container,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import Breadcrumbs from "../../../../components/Common/Breadcrumb";
import { useCallback, useEffect, useRef, useState } from "react";
import { useApolloClient, useMutation } from "@apollo/client";
import {
  OBTENER_FULL_RESERVAHABITACION,
  UPDATE_RESERVA_HABITACION,
} from "../../../../services/ReservaHabitacionService";
import {
  OBTENER_HABITACIONES_DISPONIBLES,
  UPDATE_HABITACION,
} from "../../../../services/HabitacionesService";
import { requestConfirmationAlertAsync } from "../../../../helpers/alert";
import { useYupValidationResolver } from "../../../../helpers/yupValidations";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import RequestPermissions from "../../../../components/Common/RequestPermissions";
import React from "react";
import { OBTENER_USUARIO_CODIGO } from "../../../../services/UsuarioService";
import { checkUserPermissions } from "../../../../helpers/roles";

const validationSchema = yup.object({
  reason: yup.string().required("Campo requerido"),
  amount: yup
    .number()
    .min(0, "El monto debe ser mayor a 0")
    .typeError("Solo números son permitidos")
    .required("Campo requerido"),
});

const RoomChange = () => {
  const client = useApolloClient();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedNewRoom, setSelectedNewRoom] = useState(null);
  const [roomsReservation, setRoomsReservation] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const formRef = useRef(null);

  const [modalOpen, setModalOpen] = useState(false);

  const [actualizarHabitacion] = useMutation(UPDATE_HABITACION);
  const [actualizarReservaHabitacion] = useMutation(UPDATE_RESERVA_HABITACION);
  const [currentUser, setCurrentUser] = useState(null);

  const resolver = useYupValidationResolver(validationSchema);
  const [permissionModal, setPermissionModal] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset: resetForm,
    formState: { errors },
  } = useForm({
    resolver,
    defaultValues: { reason: "", amount: 0, disableAmount: true },
  });

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
              .map((room, index) => {
                return (
                  <RoomCard
                    key={index}
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

  const handleRoomChange = async (data) => {
    // se actualiza la habitacion "vieja"
    await actualizarHabitacion({
      variables: {
        id: selectedRoom.habitacion.id,
        input: {
          estado: "Disponible",
        },
      },
      errorPolicy: "all",
    });

    // se actualiza la habitacion "nueva"
    await actualizarHabitacion({
      variables: {
        id: selectedNewRoom.id,
        input: {
          estado: "Ocupada",
        },
      },
      errorPolicy: "all",
    });

    //se actualiza la reservaHabitacion
    const reservaHabitacionInput = {
      habitacion: selectedNewRoom.id,
    };

    const oldPrice = selectedRoom?.habitacion?.tipoHabitacion?.precioBase || 0;
    const newPrice = selectedNewRoom?.tipoHabitacion?.precioBase || 0;
    if (newPrice > oldPrice) {
      reservaHabitacionInput.cargosHabitacion = [
        ...(selectedRoom.cargosHabitacion || []),
        {
          cargo: data.reason,
          monto: data.amount,
        },
      ];
    }
    await actualizarReservaHabitacion({
      variables: { id: selectedRoom.id, input: reservaHabitacionInput },
      errorPolicy: "all",
    });

    fetchInitialInfo();
    setSelectedNewRoom(null);
    setSelectedRoom(null);
    Swal.fire("Guardado!", "Los cambios han sido guardados.", "success");
  };

  const collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: "base",
  });

  const onSubmit = (data) => {
    requestConfirmationAlertAsync({
      title: "Confirmación",
      bodyText: `Se creará un cargo a la habitacion por el monto de ${
        watch("amount") || 0
      }.`,
      confirmButtonText: "Confirmar",
      omitSuccessAlert: true,
      asyncConfirmationEvent: () => {
        handleRoomChange(data);
        resetForm();
        setModalOpen(false);
      },
    });
  };

  const fetchInitialInfo = useCallback(() => {
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

    const fetchCurrentUser = async () => {
      try {
        const codigo = localStorage.getItem("cedula");
        const { data } = await client.query({
          variables: { codigo },
          query: OBTENER_USUARIO_CODIGO,
          fetchPolicy: "network-only",
        });

        setCurrentUser(data.obtenerUsuarioByCodigo);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchReservas();
    fetchHabitacionesDisponibles();
    fetchCurrentUser();
  }, [client]);

  useEffect(() => {
    fetchInitialInfo();
  }, [fetchInitialInfo]);

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
                          className="btn btn-primary"
                          disabled={!selectedNewRoom}
                          onClick={() => {
                            const oldPrice =
                              selectedRoom?.habitacion?.tipoHabitacion
                                ?.precioBase || 0;
                            const newPrice =
                              selectedNewRoom?.tipoHabitacion?.precioBase || 0;
                            if (newPrice > oldPrice) {
                              setValue("amount", newPrice - oldPrice);
                              setModalOpen(true);
                            } else {
                              requestConfirmationAlertAsync({
                                title: "Confirmación",
                                bodyText: `¿Desea realizar el cambio de habitación?.`,
                                confirmButtonText: "Confirmar",
                                asyncConfirmationEvent: () => {
                                  handleRoomChange();
                                },
                              });
                            }
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
                          .map((room, index) => {
                            return (
                              <RoomCard
                                key={index}
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
      <Modal
        isOpen={modalOpen}
        toggle={() => {
          setModalOpen(false);
          resetForm();
        }}
      >
        <ModalHeader
          toggle={() => {
            setModalOpen(false);
            resetForm();
          }}
        >
          Confirmar Cambio de Habitación
        </ModalHeader>
        <ModalBody>
          <form
            ref={formRef}
            className="needs-validation"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Label for="reason">Motivo del cambio</Label>
            <textarea
              {...register("reason")}
              className="form-control"
              id="reason"
            />
            {errors?.["reason"] && (
              <p className="errorMessage">{errors?.["reason"].message}</p>
            )}
            <Label for="amount" className="mt-3">
              Monto a cobrar
            </Label>
            <div className="amount-container">
              <input
                {...register("amount")}
                className={`form-control ${
                  watch("disableAmount") ? "amount-input" : ""
                }`}
                type="number"
                id="amount"
                disabled={watch("disableAmount")}
              />
              {watch("disableAmount") && (
                <Button
                  color="primary"
                  onClick={() => {
                    let hasPermissionToEdit = checkUserPermissions(
                      currentUser?.roles,
                      ["INHOUSE"],
                      ["editar"]
                    );
                    if (hasPermissionToEdit) {
                      setValue("disableAmount", false);
                    } else setPermissionModal(true);
                  }}
                >
                  Editar Monto
                </Button>
              )}
            </div>

            {errors?.["amount"] && (
              <p className="errorMessage">{errors?.["amount"].message}</p>
            )}
          </form>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={() => {
              setModalOpen(false);
              resetForm();
            }}
          >
            Cancelar
          </Button>
          <Button
            color="primary"
            onClick={() => {
              const triggerSubmit = handleSubmit(onSubmit);
              triggerSubmit();
            }}
            disabled={!!(errors?.["reason"] || errors?.["amount"])}
          >
            Confirmar Cambio
          </Button>
        </ModalFooter>
      </Modal>
      {/* This request modal it is to enable the amount field */}
      <RequestPermissions
        modalOpen={permissionModal}
        setModalOpen={setPermissionModal}
        onSuccessConfirmation={() => {
          setValue("disableAmount", false);
        }}
        modules={["INHOUSE"]}
        permissions={["editar"]}
        enableConfirmationMessage
      />
    </div>
  );
};

export default RoomChange;
