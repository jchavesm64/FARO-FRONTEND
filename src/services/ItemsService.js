import { gql } from "@apollo/client";

export const OBTENER_ITEMS = gql`
    query obtenerItems{
        obtenerItems{
            id
            nombre
            descripcion
            estado
        }
    }
`;

export const OBTENER_ITEMS_BY_ID = gql`
    query obtenerItem($id:ID){
        obtenerItem(id:$id){
            id
            nombre
            descripcion
            estado
        }
    }
`;

export const SAVE_ITEM = gql`
    mutation insertarItem($input:ItemsInput){
        insertarItem(input:$input){
            estado
            message
        }
    }
`;

export const UPDATE_ITEM = gql`
    mutation actualizarItem($id: ID, $input: ItemsInput){
        actualizarItem(id:$id, input:$input){
            estado
            message
        }
    }
`;

export const DELETE_ITEM = gql`
    mutation desactivarItem($id:ID){
        desactivarItem(id:$id){
            estado
            message
        }    
    }
`;
