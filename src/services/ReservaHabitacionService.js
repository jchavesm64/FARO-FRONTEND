import gql from 'graphql-tag'

export const OBTENER_RESERVAHABITACION = gql`
    query obtenerReservaHabitaciones{
        obtenerReservaHabitaciones{
            id
            habitacion{
                id
                numeroHabitacion
            }
            fechaEntrada
            fechaSalida
        }
    }
`;

