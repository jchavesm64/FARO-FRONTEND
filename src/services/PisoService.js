import { gql } from '@apollo/client';

export const OBTENER_PISOS = gql`
    query obtenerPisos{
        obtenerPisos{
            id
            nombre
            estado
        }
    }
`;

export const OBTENER_PISO_BY_ID = gql`
    query obtenerPisoById($id:ID){
        obtenerPisoById(id:$id){
            id
            nombre
            estado
        }
    }
`;

export const OBTENER_MESAS_POR_PISO = gql`
    query obtenerMesasPorPiso($id:ID){
        obtenerMesasPorPiso(id:$id){
            id
            numero
            tipo
            piso{
                id
                nombre
            }
            disponibilidad
            temporizador
            estado
        }
    }
`;

export const OBTENER_COMANDAS_POR_PISO = gql`
    query obtenerComandasPorPiso($id:ID){
        obtenerComandasPorPiso(id:$id){
            piso
            mesa
        }
    }
`;

export const SAVE_PISO = gql`
    mutation insertarPiso($input:PisoInput){
        insertarPiso(input:$input){
            estado
            message
        }
    }
`;

export const UPDATE_PISO = gql`
    mutation actualizarPiso($id:ID, $input:PisoInput){
        actualizarPiso(id:$id, input:$input){
            estado
            message
        }
    }
`;

export const DELETE_PISO = gql`
    mutation desactivarPiso($id:ID){
        desactivarPiso(id:$id){
            estado
            message
        }
    }
`;