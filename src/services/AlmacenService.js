import { gql } from '@apollo/client';

export const OBTENER_ALMACENES = gql`
    query obtenerAlmacenes{
        obtenerAlmacenes{
            id
            nombre
            descripcion
            estado
        }
    }
`;

export const OBTENER_ALMACEN = gql`
    query obtenerAlmacen($id:ID){
        obtenerAlmacen(id:$id){
            id
            nombre
            descripcion
            estado
        }
    }
`;

export const GUARDAR_ALMACEN = gql`
    mutation insertarAlmacen($input:AlmacenInput){
        insertarAlmacen(input:$input){
                estado
                message
        }
    }
`;

export const ACTUALIZAR_ALMACEN = gql`
    mutation actualizarAlmacen($id:ID, $input:AlmacenInput){
        actualizarAlmacen(id:$id, input:$input){
            estado
            message
        }
    }
`;


export const ELIMINAR_ALMANCEN = gql`
    mutation desactivarAlmacen($id:ID){
        desactivarAlmacen(id:$id){
            estado
            message
        }
    }
`;
