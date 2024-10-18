import { gql } from '@apollo/client';

export const OBTENER_TIPOS_MENU = gql`
    query obtenerTiposMenu{
        obtenerTiposMenu{
            id
            nombre
            estado
        }
    }
`;

export const OBTENER_TIPOS_MENU_BY_ID = gql`
    query obtenerTipoMenuById($id:ID){
        obtenerTipoMenuById(id:$id){
            id
            nombre
            estado
        }
    }
`;

export const SAVE_TIPO_MENU = gql`
    mutation insertarTipoMenu($input:TipoMenuInput){
        insertarTipoMenu(input:$input){
            estado
            message
        }
    }
`;

export const UPDATE_TIPO_MENU = gql`
    mutation actualizarTipoMenu($id:ID, $input:TipoMenuInput){
        actualizarTipoMenu(id:$id, input:$input){
            estado
            message
        }
    }
`;

export const DELETE_TIPO_MENU = gql`
    mutation desactivarTipoMenu($id:ID){
        desactivarTipoMenu(id:$id){
            estado
            message
        }
    }
`;