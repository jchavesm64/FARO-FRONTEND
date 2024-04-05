import { gql } from '@apollo/client';

export const OBTENER_MENUS = gql`
    query obtenerMenus{
        obtenerMenus{
            id
            nombre
            descripcion
            estado
            precioCosto
            precioVenta
            tipo
        }
    }
`;

export const OBTENER_MENU = gql`
    query obtenerMenu($id:ID){
        obtenerMenu(id:$id){
            id
            nombre
            descripcion
            estado
            precioCosto
            precioVenta
            tipo
        }
    }
`;

export const GUARDAR_MENU = gql`
    mutation insertarMenu($input:MenuInput, $lineasInput:[MenuLineaInput2]){
        insertarMenu(input:$input, lineasInput:$lineasInput){
                estado
                message
        }
    }
`;

export const ACTUALIZAR_MENU = gql`
    mutation actualizarMenu($id:ID, $input:MenuInput){
        actualizarMenu(id:$id, input:$input){
            estado
            message
        }
    }
`;


export const ELIMINAR_MENU = gql`
    mutation desactivarMenu($id:ID){
        desactivarMenu(id:$id){
            estado
            message
        }
    }
`;
