import gql from 'graphql-tag'

export const OBTENER_RESERVAS = gql`
    query obtenerReservas{
        obtenerReservas{
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
                telefonos{
                    telefono,
                    ext,
                    descripcion
                }
                correos{
                    email
                }
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

export const OBTENER_RESERVA = gql`
    query obtenerReserva($id:ID){
        obtenerReserva(id:$id){
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
                telefonos{
                    telefono,
                    ext,
                    descripcion
                }
                correos{
                    email
                }
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