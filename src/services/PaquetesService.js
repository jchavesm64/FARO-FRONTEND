import { gql } from '@apollo/client';

export const OBTENER_PAQUETES = gql` 
    query obtenerPaquetes{
        obtenerPaquetes{
            id
            tipo
            nombre
            servicios
            tours
            temporadas{
               fechaInicio
                fechaFin
                nombre
                tipo
                precio 
            }
            descripcion
            precio
            estado
        }
    }
`;

export const OBTENER_PAQUETE = gql` 
    query obtenerPaquete($id:ID){
        obtenerPaquete(id:$id){
            id
            tipo
            nombre
            servicios
            tours
            temporadas{
               fechaInicio
                fechaFin
                nombre
                tipo
                precio 
            }
            descripcion
            precio
            estado
        }
    }
`;

export const SAVE_PAQUETE = gql`
    mutation insertarPaquete($input:PaqueteInput){
        insertarPaquete(input:$input){
            estado
            message
        }
    }
`;

export const UPDATE_PAQUETE = gql`
    mutation actualizarPaquete($id: ID,$input:PaqueteInput){
        actualizarPaquete(id:$id,input:$input){
            estado
            message
        }
    }
`;

export const DELETE_PAQUETE = gql`
    mutation desactivarPaquete($id:ID){
        desactivarPaquete(id:$id){
            estado
            message
        }    
    }
`;