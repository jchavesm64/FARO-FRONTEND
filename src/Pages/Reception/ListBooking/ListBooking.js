import React, { useState, useEffect } from "react";
import { Container, Card, CardBody, Input, Table } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { OBTENER_RESERVAS } from "../../../services/ReservaService";
import { useApolloClient } from "@apollo/client";
import { first } from "lodash";
import { timestampToDateLocal } from "../../../helpers/helpers";

const ListBooking = () => {
  document.title = "Listado de reservas | FARO";
  const client = useApolloClient();

  const [reservas, setReservas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const { data } = await client.query({
          query: OBTENER_RESERVAS,
          fetchPolicy: "network-only",
        });
        setReservas(data.obtenerReservas);
      } catch (error) {
        console.error("Error fetching reservas:", error);
      }
    };

    fetchReservas();
  }, [client]);

  const handleSearchFilter = (value) => {
    if (!searchTerm) return true;
    return value.cliente?.nombre?.toLowerCase().includes(searchTerm);
  };

  return (
    <div className="page-content">
      <Container fluid={true}>
        <Breadcrumbs
          title="Listado de reservas"
          breadcrumbItem="Recepción"
          breadcrumbItemUrl="/reception"
        />
        <Card className="p-4">
          <CardBody className="reservas-list-container">
            <div className="search-container pt-2 pb-2">
              <Input
                className=""
                value={searchTerm}
                type="search"
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
                placeholder="Buscar por nombre"
              />
            </div>
            <Table striped>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Correo</th>
                  <th>Estado</th>
                  <th>Tipo</th>
                  <th>Fecha de Reserva</th>
                  <th>Adultos</th>
                  <th>Niños</th>
                  <th>Total</th>
                  <th>Método de Pago</th>
                </tr>
              </thead>
              <tbody>
                {reservas.filter(handleSearchFilter).map((reserva, index) => (
                  <tr key={index}>
                    <td>{reserva.cliente?.nombre || "Desconocido"}</td>
                    <td>
                      {first(reserva.cliente?.correos)?.email ||
                        "No disponible"}
                    </td>
                    <td>{reserva.estado}</td>
                    <td>{reserva.tipo}</td>
                    <td>
                      {timestampToDateLocal(
                        Number(reserva.fechaReserva),
                        "date"
                      )}
                    </td>
                    <td>{reserva.numeroPersonas.adulto}</td>
                    <td>{reserva.numeroPersonas.ninos}</td>
                    <td>₡{reserva.total.toLocaleString()}</td>
                    <td>{reserva.metodoPago || "No especificado"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default ListBooking;
