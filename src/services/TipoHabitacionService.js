import { gql } from '@apollo/client';

export const OBTENER_TIPOSHABITACION = gql` 
    query obtenerTiposHabitaciones{
        obtenerTiposHabitaciones{
            id
            nombre
            descripcion
            precioBase
            estado
        }
    }
`;

export const OBTENER_TIPOSHABITACION_BY_ID = gql` 
    query obtenerTipoHabitacionById($id:ID){
        obtenerTipoHabitacionById(id:$id){
            id
            nombre
            descripcion
            precioBase
            estado
        }
    }
`;

export const SAVE_TIPO_HABITACION = gql`
    mutation insertarTipoHabitacion($input:TipoHabitacionInput){
        insertarTipoHabitacion(input:$input){
            estado
            message
        }
    }
`;

export const UPDATE_TIPO_HABITACION = gql`
    mutation actualizarTipoHabitacion($id: ID, $input: TipoHabitacionInput){
        actualizarTipoHabitacion(id:$id, input:$input){
            estado
            message
        }
    }
`;

export const DELETE_TIPO_HABITACION = gql`
    mutation desactivarTipoHabitacion($id:ID){
        desactivarTipoHabitacion(id:$id){
            estado
            message
        }    
    }
`;