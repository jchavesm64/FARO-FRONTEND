import gql from 'graphql-tag'

export const OBTENER_RESERVAS = gql`
    query obtenerReservas{
        obtenerReservas{
            id
            numeroPersonas {
                adulto
                ninos
            }
            estado
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
            }
            usuario{
                nombre
                cedula
            }
            fechaReserva
            total
            metodoPago
            politicas
        }
    }
`;

export const SAVE_RESERVA = gql`
    mutation insertarReserva($input: ReservaInput,$bookingRoom: ReservaHabitacionInput){
        insertarReserva(input: $input, bookingRoom: $bookingRoom){
            estado
            message
        }
    }
`;