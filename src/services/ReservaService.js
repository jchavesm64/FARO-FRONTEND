import gql from "graphql-tag";

export const OBTENER_RESERVAS = gql`
  query obtenerReservas {
    obtenerReservas {
      id
      numeroPersonas {
        adulto
        ninos
      }
      serviciosGrupal
      tipo
      tours
      paquetes
      cliente {
        id
        tipo
        nombre
        nombreFacturacion
        codigo
        pais
        ciudad
        city
        calle
        cp
        direccion
        telefonos {
          telefono
          ext
          descripcion
        }
        correos {
          email
        }
      }
      usuario {
        nombre
        cedula
      }
      fechaReserva
      total
      metodoPago
      politicas
      estado
    }
  }
`;

export const OBTENER_RESERVA = gql`
  query obtenerReserva($id: ID) {
    obtenerReserva(id: $id) {
      id
      numeroPersonas {
        adulto
        ninos
      }
      serviciosGrupal
      tipo
      tours
      paquetes
      notas
      cliente {
        id
        tipo
        nombre
        nombreFacturacion
        codigo
        pais
        ciudad
        city
        calle
        cp
        direccion
        telefonos {
          telefono
          ext
          descripcion
        }
        correos {
          email
        }
      }
      usuario {
        nombre
        cedula
      }
      fechaReserva
      total
      metodoPago
      politicas
      estado
    }
  }
`;

export const SAVE_RESERVA = gql`
  mutation insertarReserva(
    $input: ReservaInput
    $bookingRoom: ReservaHabitacionInput
  ) {
    insertarReserva(input: $input, bookingRoom: $bookingRoom) {
      estado
      message
    }
  }
`;

export const UPDATE_RESERVA = gql`
  mutation actualizarReserva(
    $id: ID
    $input: ReservaInput
    $bookingRoom: ReservaHabitacionInput
  ) {
    actualizarReserva(id: $id, input: $input, bookingRoom: $bookingRoom) {
      estado
      message
    }
  }
`;

export const UPDATE_RESERVA_INFO = gql`
  mutation actualizarReservaInfo($id: ID, $input: ReservaInput) {
    actualizarReservaInfo(id: $id, input: $input) {
      estado
      message
    }
  }
`;

export const DELETE_RESERVA = gql`
  mutation desactivarReserva($id: ID) {
    desactivarReserva(id: $id) {
      estado
      message
    }
  }
`;

export const CHECKIN_RESERVA = gql`
  mutation checkIn($id: ID!, $reserva: ID!, $huespedes: [JSON!]!) {
    checkIn(id: $id, reserva: $reserva, huespedes: $huespedes) {
      estado
      message
    }
  }
`;

export const UPDATE_ESTADO_RESERVA = gql`
  mutation updateState($id: ID!) {
    updateState(id: $id) {
      estado
      message
    }
  }
`;



