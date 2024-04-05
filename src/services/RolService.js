import { gql } from '@apollo/client';

export const OBTENER_ROLES = gql`
    query obtenerRoles{
        obtenerRoles{
            id
            nombre
            permisos{
                modulo
                agregar
                editar
                eliminar
                ver
            }
            estado
        }
    }
`;

export const OBTENER_ROL = gql`
    query obtenerRol($id:ID){
        obtenerRol(id:$id){
            id
            nombre
            permisos{
                modulo
                agregar
                editar
                eliminar
                ver
            }
            estado
        }
    }
`;

export const UPDATE_ROLES = gql`
    mutation actualizarRol($id:ID, $input:RolInput){
        actualizarRol(id:$id, input:$input){
            estado
            message
        }
    }
`;

export const OBTENER_PERMISOS = gql`
    query obtenerPermisos{
        obtenerPermisos{
            id
            descripcion
            estado
        }
    }
`;

export const DELETE_ROL = gql`
    mutation desactivarRol($id:ID){
        desactivarRol(id:$id){
            estado
            message
        }
    }
`;


export const SAVE_ROL = gql`
    mutation insertarRol($input:RolInput){
        insertarRol(input:$input){
                estado
                message
        }
    }
`;