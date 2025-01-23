import gql from 'graphql-tag'

export const OBTENER_RESERVAHABITACIONES = gql`
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

export const OBTENER_RESERVAHABITACION = gql`
    query obtenerReservaHabitacion($id:ID){
        obtenerReservaHabitacion(id:$id){
            id
            habitacion{
                id
                numeroHabitacion
                tipoHabitacion{
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
        }
    }
`;


