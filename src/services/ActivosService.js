import { gql } from '@apollo/client';

export const OBTENER_ACTIVOS = gql`
    query obtenerActivos{
        obtenerActivos{
            id
            nombre
            unidad
            referenciaInterna
            fechaRegistro
            estado
        }
    }
`;

export const OBTENER_ACTIVO = gql`
    query obtenerActivo($id:ID){
        obtenerActivo(id:$id){
            id
            nombre
            unidad
            referenciaInterna
            fechaRegistro
            estado
        }
    }
`;

export const OBTENER_ACTIVO_CON_MOVIMIENTOS = gql`
    query obtenerActivoConMovimientos($id:ID){
        obtenerActivoConMovimientos(id:$id){
            id
            nombre
            unidad
            referenciaInterna
            fechaRegistro
            estado
            movimientos{
                id
                fecha
                tipo
                beneficiario
                consecutivo{
                    id
                    consecutivo
                }
            }
        }
    }
`;

export const INSERTAR_ACTIVO = gql`
    mutation insertarActivo($input:ActivoInput){
        insertarActivo(input:$input){
            estado
            message
        }
    }
`;

export const ACTUALIZAR_ACTIVO = gql`
    mutation actualizarActivo($id:ID, $input:ActivoInput){
        actualizarActivo(id:$id, input:$input){
            estado
            message
        }
    }
`;

export const ELIMINAR_ACTIVO = gql`
    mutation desactivarActivo($id:ID){
        desactivarActivo(id:$id){
            estado
            message
        }
    }
`;
