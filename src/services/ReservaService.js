import gql from 'graphql-tag'

export const SAVE_RESERVA = gql`
    mutation insertarReserva($input: ReservaInput,$bookingRoom: ReservaHabitacionInput){
        insertarReserva(input: $input, bookingRoom: $bookingRoom){
            estado
            message
        }
    }
`;