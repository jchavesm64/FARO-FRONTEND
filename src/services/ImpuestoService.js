import { gql } from '@apollo/client';

export const OBTENER_IMPUESTOS = gql`
    query obtenerImpuestos{
        obtenerImpuestos{
            id
            nombre
            valor
            estado
        }
    }
`;

export const OBTENER_IMPUESTO_BY_ID = gql`
    query obtenerImpuestoById($id:ID){
        obtenerImpuestoById(id:$id){
            id
            nombre
            valor
            estado
        }
    }
`;

export const OBTENER_IMPUESTO_BY_NOMBRE = gql`
    query obtenerImpuestoByNombre($nombre:String){
        obtenerImpuestoByNombre(nombre:$nombre){
            id
            nombre
            valor
            estado
        }
    }
`;

export const SAVE_IMPUESTO = gql`
    mutation insertarImpuesto($input:ImpuestoInput){
        insertarImpuesto(input:$input){
            estado
            message
        }
    }
`;

export const UPDATE_IMPUESTO = gql`
    mutation actualizarImpuesto($id:ID, $input:ImpuestoInput){
        actualizarImpuesto(id:$id, input:$input){
            estado
            message
        }
    }
`;

export const DELETE_IMPUESTO = gql`
    mutation desactivarImpuesto($id:ID){
        desactivarImpuesto(id:$id){
            estado
            message
        }
    }
`;