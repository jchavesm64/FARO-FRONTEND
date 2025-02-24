import {
  Button,
  Card,
  CardBody,
  Container,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import Breadcrumbs from "../../../../components/Common/Breadcrumb";
import React, { useEffect, useState } from "react";
import { useApolloClient, useMutation } from "@apollo/client";
import {
  OBTENER_FULL_RESERVAHABITACION,
  UPDATE_RESERVA_HABITACION,
} from "../../../../services/ReservaHabitacionService";
import ButtonIconTable from "../../../../components/Common/ButtonIconTable";
import { v4 as uuidv4 } from "uuid";
import { requestConfirmationAlert } from "../../../../helpers/alert";
import RequestPermissions from "../../../../components/Common/RequestPermissions";
import { OBTENER_USUARIO_CODIGO } from "../../../../services/UsuarioService";
import { checkUserPermissions } from "../../../../helpers/roles";

const chargeInitialValue = { id: null, cargo: "", monto: "" };

const RoomCharges = () => {
  const client = useApolloClient();
  const [roomsReservation, setRoomsReservation] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [chargesPerRoom, setChargesPerRoom] = useState([]);
  const [modal, setModal] = useState(false);
  const [newCharge, setNewCharge] = useState(chargeInitialValue);

  const [tempCharge, setTempCharge] = useState(null);

  const [permissionEditModal, setPermissionEditModal] = useState(false);
  const [permissionDeleteModal, setPermissionDeleteModal] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);

  const [update] = useMutation(UPDATE_RESERVA_HABITACION);

  // Modal functions
  const toggle = () => setModal(!modal);

  const handleChange = (e) => {
    setNewCharge({ ...newCharge, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const charges = chargesPerRoom.find(
      (charge) => charge.roomId === selectedRoom.id
    );
    if (charges) {
      const newList = chargesPerRoom.map((cpr) => {
        if (cpr.roomId === selectedRoom.id) {
          return {
            ...cpr,
            modified: true,
            chargesList: newCharge.id
              ? cpr.chargesList.map((cl) => {
                  if (cl.id === newCharge.id) {
                    return newCharge;
                  }
                  return cl;
                })
              : [
                  ...cpr.chargesList,
                  {
                    ...newCharge,
                    id: uuidv4(),
                    monto: Number(newCharge.monto),
                  },
                ],
          };
        }
        return cpr;
      });
      setChargesPerRoom(newList);
    } else {
      setChargesPerRoom([
        ...chargesPerRoom,
        {
          roomId: selectedRoom.id,
          modified: true,
          chargesList: [
            {
              ...newCharge,
              id: uuidv4(),
              monto: Number(newCharge.monto),
            },
          ],
        },
      ]);
    }
    setNewCharge(chargeInitialValue);
    toggle();
  };

  const updateRoomCharges = async (chargesToUpdate) => {
    const cargosHabitacion = chargesToUpdate.map((cpr) => {
      const { id, ...rest } = cpr;
      return rest;
    });

    const input = {
      cargosHabitacion,
    };

    await update({
      variables: { id: selectedRoom.id, input },
      errorPolicy: "all",
    });
  };

  const mapChargesPerRoom = (rooms) => {
    const newChargesPerRoom = [];
    rooms?.forEach((room) => {
      if (room.cargosHabitacion) {
        newChargesPerRoom.push({
          roomId: room.id,
          chargesList: room.cargosHabitacion.map((cargo) => {
            const { _id, ...rest } = cargo;
            return { ...rest, id: uuidv4() };
          }),
        });
      }
    });
    setChargesPerRoom(newChargesPerRoom);
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
          <p>Seleccione la habitación a la cual desea agregar cargos</p>
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

  const handleDeleteCharge = (chargeId) => {
    const newChargesPerRoom = chargesPerRoom.map((cpr) => {
      if (cpr.roomId === selectedRoom.id) {
        return {
          ...cpr,
          chargesList: cpr.chargesList.filter((cl) => cl.id !== chargeId),
        };
      }
      return cpr;
    });
    setChargesPerRoom(newChargesPerRoom);
  };

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const { data } = await client.query({
          query: OBTENER_FULL_RESERVAHABITACION,
          fetchPolicy: "network-only",
        });
        setRoomsReservation(data.obtenerReservaHabitaciones);
        mapChargesPerRoom(data.obtenerReservaHabitaciones);
      } catch (error) {
        console.error("Error fetching reservas:", error);
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
    fetchCurrentUser();
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
                    <div className="button-actions-container">
                      <button
                        type="button"
                        class="btn btn-primary"
                        onClick={toggle}
                      >
                        Agregar nuevo cargo
                      </button>
                      <button
                        type="button"
                        class="btn btn-secondary"
                        disabled={
                          !chargesPerRoom.find(
                            (cpr) => cpr.roomId === selectedRoom?.id
                          )?.modified
                        }
                        onClick={() => {
                          const chargesToUpdate = chargesPerRoom.find(
                            (cpr) => cpr.roomId === selectedRoom.id
                          );
                          if (chargesToUpdate) {
                            requestConfirmationAlert({
                              title: "¿Estás seguro?",
                              bodyText:
                                "¿Deseas guardar los cambios realizados en los cargos de la habitación?",
                              confirmButtonText: "Sí, guardar cambios",
                              confirmationEvent: () => {
                                updateRoomCharges(chargesToUpdate.chargesList);
                              },
                            });
                          }
                        }}
                      >
                        Guardar Cambios
                      </button>
                    </div>
                  )}
                </div>
                {selectedRoom && (
                  <div className="p-6 pt-0 overflow-auto charges-container">
                    <div className="table-responsive bg-white shadow rounded">
                      <table className="table table-bordered">
                        <thead className="table-light">
                          <tr>
                            <th>Descripcion</th>
                            <th>Monto</th>
                            <th style={{ width: "25%" }}>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {chargesPerRoom
                            .find((cpr) => cpr.roomId === selectedRoom?.id)
                            ?.chargesList?.map((charge, index) => (
                              <tr key={charge.id}>
                                <td>{charge.cargo}</td>
                                <td>₡{charge.monto}</td>
                                <td className="charges-actions">
                                  <ButtonIconTable
                                    icon="mdi mdi-pencil"
                                    color="warning"
                                    disabled={false}
                                    onClick={() => {
                                      let hasPermissionToEdit =
                                        checkUserPermissions(
                                          currentUser?.roles,
                                          ["INHOUSE"],
                                          ["editar"]
                                        );
                                      if (hasPermissionToEdit) {
                                        setNewCharge(charge);
                                        toggle();
                                      } else {
                                        setPermissionEditModal(true);
                                        setTempCharge(charge);
                                      }
                                    }}
                                  />
                                  <span
                                    id={"deleteChargeButton" + index}
                                    className="charges-span-container"
                                  >
                                    <ButtonIconTable
                                      icon="bx bx-x"
                                      color="danger"
                                      onClick={() => {
                                        let hasPermissionToDelete =
                                          checkUserPermissions(
                                            currentUser?.roles,
                                            ["INHOUSE"],
                                            ["eliminar"]
                                          );
                                        if (hasPermissionToDelete) {
                                          handleDeleteCharge(charge.id);
                                        } else {
                                          setTempCharge(charge);
                                          setPermissionDeleteModal(true);
                                        }
                                      }}
                                    />
                                  </span>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                <Modal
                  isOpen={modal}
                  toggle={toggle}
                  onClosed={() => {
                    setNewCharge(chargeInitialValue);
                  }}
                >
                  <ModalHeader toggle={toggle}>
                    {newCharge?.id ? "Actualizar" : "Agregar"} Cargo
                  </ModalHeader>
                  <ModalBody>
                    <Form>
                      <FormGroup>
                        <Label for="cargo">Cargo</Label>
                        <Input
                          type="text"
                          name="cargo"
                          id="cargo"
                          value={newCharge.cargo}
                          onChange={handleChange}
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label for="monto">Monto</Label>
                        <InputGroup>
                          <InputGroupText>₡</InputGroupText>{" "}
                          <Input
                            type="number"
                            name="monto"
                            id="monto"
                            value={newCharge.monto}
                            onChange={handleChange}
                          />
                        </InputGroup>
                      </FormGroup>
                    </Form>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onClick={handleSubmit}>
                      {newCharge?.id ? "Actualizar" : "Agregar"}
                    </Button>
                    <Button color="secondary" onClick={toggle}>
                      Cancelar
                    </Button>
                  </ModalFooter>
                </Modal>
              </div>
            </CardBody>
          </Card>
        </div>
        {/* This is to request edit permissions */}
        <RequestPermissions
          modalOpen={permissionEditModal}
          setModalOpen={setPermissionEditModal}
          onSuccessConfirmation={() => {
            setNewCharge(tempCharge);
            toggle();
            setTempCharge(null);
          }}
          modules={["INHOUSE"]}
          permissions={["editar"]}
          enableConfirmationMessage
        />
        <RequestPermissions
          modalOpen={permissionDeleteModal}
          setModalOpen={setPermissionDeleteModal}
          onSuccessConfirmation={() => {
            handleDeleteCharge(tempCharge.id);
            setTempCharge(null);
          }}
          modules={["INHOUSE"]}
          permissions={["eliminar"]}
          enableConfirmationMessage
        />
      </Container>
    </div>
  );
};

export default RoomCharges;
