import { gql } from '@apollo/client';

export const OBTENER_TEMPORADAS = gql`
    query obtenerTemporada{
        obtenerTemporada{
            id
            fechaInicio
            fechaFin
            nombre
            tipo
            precio
            tiposHabitacion
            descripcion
        }
    }
`;
export const OBTENER_TEMPORADA = gql`
    query obtenerTemporadaById($id:ID){
        obtenerTemporadaById(id:$id){
            id
            fechaInicio
            fechaFin
            nombre
            tipo
            precio
            tiposHabitacion
            descripcion
        }
    }
`;
export const UPDATE_TEMPORADA = gql`
    mutation actualizarTemporada($id: ID, $input: TemporadaInput){
        actualizarTemporada(id:$id, input:$input){
            estado
            message
        }
    }
`;
export const SAVE_TEMPORADA = gql`
    mutation insertarTemporada($input:TemporadaInput){
        insertarTemporada(input:$input){
            estado
            message
        }
    }
`;


