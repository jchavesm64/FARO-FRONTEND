import { gql } from '@apollo/client';

export const OBTENER_TIPOS_PLATILLO = gql`
    query obtenerTiposPlatillo{
        obtenerTiposPlatillo{
            id
            nombre
            estado
        }
    }
`;

export const OBTENER_TIPOS_PLATILLO_BY_ID = gql`
    query obtenerTipoPlatilloById($id:ID){
        obtenerTipoPlatilloById(id:$id){
            id
            nombre
            estado
        }
    }
`;

export const SAVE_TIPO_PLATILLO = gql`
    mutation insertarTipoPlatillo($input:TipoPlatilloInput){
        insertarTipoPlatillo(input:$input){
            estado
            message
        }
    }
`;

export const UPDATE_TIPO_PLATILLO = gql`
    mutation actualizarTipoPlatillo($id:ID, $input:TipoPlatilloInput){
        actualizarTipoPlatillo(id:$id, input:$input){
            estado
            message
        }
    }
`;

export const DELETE_TIPO_PLATILLO = gql`
    mutation desactivarTipoPlatillo($id:ID){
        desactivarTipoPlatillo(id:$id){
            estado
            message
        }
    }
`;