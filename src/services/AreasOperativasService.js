import { gql } from '@apollo/client';

export const OBTENER_AREAS = gql` 
    query obtenerAreas{
        obtenerAreas{
            id
            nombre
            descripcion
            estado
        }
    }
`;

export const OBTENER_AREA_BY_ID = gql` 
    query obtenerArea($id:ID){
        obtenerArea(id:$id){
            id
            nombre
            descripcion
            estado
        }
    }
`;

export const SAVE_AREA = gql`
    mutation insertarArea($input:AreasInput){
        insertarArea(input:$input){
            estado
            message
        }
    }
`;

export const UPDATE_AREA = gql`
    mutation actualizarArea($id: ID, $input: AreasInput){
        actualizarArea(id:$id, input:$input){
            estado
            message
        }
    }
`;

export const DELETE_AREA = gql`
    mutation desactivarArea($id:ID){
        desactivarArea(id:$id){
            estado
            message
        }    
    }
`;