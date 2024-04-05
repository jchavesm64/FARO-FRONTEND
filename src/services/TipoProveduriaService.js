import { gql } from '@apollo/client';

export const OBTENER_TIPO_PROVEDURIA = gql`
    query obtenerTipoProveduria{
        obtenerTipoProveduria{
            id
            tipo
            estado
        }
    }
`;

export const OBTENER_TIPO_PROVEDURIA_BY_ID = gql`
    query obtenerTipoProveduriaById($id:ID){
        obtenerTipoProveduriaById(id:$id){
            id
            tipo
            estado
        }
    }
`;

export const SAVE_TIPO_PROVEDURIA = gql`
    mutation insertarTipoProveduria($input:TipoProveduriaInput){
        insertarTipoProveduria(input:$input){
            estado
            message
        }
    }
`;

export const UPDATE_TIPO_PROVEDURIA = gql`
    mutation actualizarTipoProveduria($id:ID, $input:TipoProveduriaInput){
        actualizarTipoProveduria(id:$id, input:$input){
            estado
            message
        }
    }
`;

export const DELETE_TIPO_PROVEDURIA = gql`
    mutation desactivarTipoProveduria($id:ID){
        desactivarTipoProveduria(id:$id){
            estado
            message
        }
    }
`;