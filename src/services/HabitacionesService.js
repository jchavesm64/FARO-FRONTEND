import { gql } from '@apollo/client';

export const OBTENER_HABITACIONES = gql` 
    query obtenerHabitaciones{
        obtenerHabitaciones{
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
            }
            estado
        }
    }
`;

export const OBTENER_HABITACION_BY_ID = gql` 
    query obtenerHabitacionById($id:ID){
        obtenerHabitacionById(id:$id){
            id
            numeroHabitacion
            tipoHabitacion
            precioPorNoche
            descripcion
            comodidades
            estado
        }
    }
`;
export const OBTENER_HABITACIONES_DISPONIBLES = gql` 
    query obteberHabitacionesDisponibles{
        obteberHabitacionesDisponibles{
            id
            numeroHabitacion
            tipoHabitacion
            precioPorNoche
            descripcion
            comodidades
            estado
        }
    }
`;

export const SAVE_HABITACION = gql`
    mutation insertarHabitacion($input:HabitacionesInput){
        insertarHabitacion(input:$input){
            estado
            message
        }
    }
`;

export const UPDATE_HABITACION = gql`
    mutation actualizarHabitacion($id: ID, $input: HabitacionesInput){
        actualizarHabitacion(id:$id, input:$input){
            estado
            message
        }
    }
`;

export const DELETE_HABITACION = gql`
    mutation desactivarHabitacion($id:ID){
        desactivarHabitacion(id:$id){
            estado
            message
        }    
    }
`;