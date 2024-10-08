import { gql } from '@apollo/client';

export const OBTENER_SERVICIO = gql` 
    query obtenerServicios{
        obtenerServicios{
            id
            nombre
            descripcion
            precio
            tipo{
                id
                nombre
                cuantificable
                horadia
                icon
            }
            estado
        }
    }
`;

export const OBTENER_SERVICIO_BY_ID = gql` 
    query obtenerServicio($id:ID){
        obtenerServicio(id:$id){
            id
            nombre
            descripcion
            precio
            tipo{
                id
                nombre
                cuantificable
                horadia
                icon
            }
            estado
        }
    }
`;

export const SAVE_SERVICIO = gql`
    mutation insertarServicio($input:ServiciosInput){
        insertarServicio(input:$input){
            estado
            message
        }
    }
`;

export const UPDATE_SERVICIO = gql`
    mutation actualizarServicio($id: ID, $input: ServiciosInput){
        actualizarServicio(id:$id, input:$input){
            estado
            message
        }
    }
`;

export const DELETE_SERVICIO = gql`
    mutation desactivarServicio($id:ID){
        desactivarServicio(id:$id){
            estado
            message
        }    
    }
`;