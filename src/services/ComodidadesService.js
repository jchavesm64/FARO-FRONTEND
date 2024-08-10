import { gql } from '@apollo/client';

export const OBTENER_COMODIDADES = gql` 
    query obtenerComodidades{
        obtenerComodidades{
            id
            nombre
            descripcion
            estado
        }
    }
`;

export const OBTENER_COMODIDADES_BY_ID = gql` 
    query obtenerComodidadById($id:ID){
        obtenerComodidadById(id:$id){
            id
            nombre
            descripcion
            estado
        }
    }
`;

export const SAVE_COMODIDAD = gql`
    mutation insertarComodidad($input:ComodidadesInput){
        insertarComodidad(input:$input){
            estado
            message
        }
    }
`;

export const UPDATE_COMODIDAD = gql`
    mutation actualizarComodidad($id: ID, $input: ComodidadesInput){
        actualizarComodidad(id:$id, input:$input){
            estado
            message
        }
    }
`;

export const DELETE_COMODIDAD = gql`
    mutation desactivarComodidad($id:ID){
        desactivarComodidad(id:$id){
            estado
            message
        }    
    }
`;