import gql from "graphql-tag";

export const OBTENER_RESERVAHABITACIONES = gql`
  query obtenerReservaHabitaciones {
    obtenerReservaHabitaciones {
      id
      habitacion {
        id
        numeroHabitacion
      }
      fechaEntrada
      fechaSalida
    }
  }
`;

export const OBTENER_RESERVAHABITACION = gql`
  query obtenerReservaHabitacion($id: ID) {
    obtenerReservaHabitacion(id: $id) {
      id
      serviciosExtra
      habitacion {
        id
        numeroHabitacion
        tipoHabitacion {
          id
          nombre
          descripcion
          precioBase
        }
        precioPorNoche
        descripcion
        comodidades {
          id
          nombre
          descripcion
        }
        estado
      }
      fechaEntrada
      fechaSalida
      estado
    }
  }
`;

export const OBTENER_FULL_RESERVAHABITACION = gql`
  query obtenerReservaHabitaciones {
    obtenerReservaHabitaciones {
      id
      habitacion {
        id
        numeroHabitacion
      }
      serviciosExtra
      reserva {
        numeroPersonas {
          adulto
          ninos
        }
        cliente {
          id
          nombreFacturacion
        }
        fechaReserva
      }
      estado
      fechaEntrada
      fechaSalida
    }
  }
`;

export const UPDATE_RESERVA_HABITACION = gql`
  mutation actualizarReservaHabitacion(
    $id: ID
    $input: ReservaHabitacionInput
  ) {
    actualizarReservaHabitacion(id: $id, input: $input) {
      estado
      message
    }
  }
`;
