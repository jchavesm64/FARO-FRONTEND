import gql from 'graphql-tag'

export const OBTENER_RESERVAS = gql`
    query obtenerReservas{
        obtenerReservas{
            id
            numeroPersonas {
                adulto
                ninos
            }
            serviciosGrupal{
                nombre
                descripcion
                precio
                tipo{
                    nombre
                    cuantificable
                    icon
                    horadia
                }
                
            }
            tours{
                tipo
                nombre
                precio
                descripcion
            }
            paquetes{
                tipo
                nombre
                servicios{
                    id
                    nombre
                    descripcion
                    precio
                    tipo{
                        nombre
                        cuantificable
                        horadia
                    }
                }
                tours{
                    nombre
                }
                temporadas{
                    fechaInicio
                    fechaFin
                    nombre
                    tipo
                    precio 
                }
                descripcion
                precio
            }

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
            estado
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