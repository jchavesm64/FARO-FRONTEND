import { gql } from '@apollo/client';

export const OBTENER_SERVICIO_EXTERNOS = gql` 
    query obtenerServiciosExternos{
        obtenerServiciosExternos{
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

export const OBTENER_SERVICIO_EXTERNOS_BY_ID = gql` 
    query obtenerServicioExterno($id:ID){
        obtenerServicioExterno(id:$id){
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

export const SAVE_SERVICIO_EXTERNO= gql`
    mutation insertarServicioExterno($input:ServiciosInput){
        insertarServicioExterno(input:$input){
            estado
            message
        }
    }
`;

export const UPDATE_SERVICIO_EXTERNO = gql`
    mutation actualizarServicioExterno($id: ID, $input: ServiciosInput){
        actualizarServicioExterno(id:$id, input:$input){
            estado
            message
        }
    }
`;

export const DELETE_SERVICIO_EXTERNO = gql`
    mutation desactivarServicioExterno($id:ID){
        desactivarServicioExterno(id:$id){
            estado
            message
        }    
    }
`;