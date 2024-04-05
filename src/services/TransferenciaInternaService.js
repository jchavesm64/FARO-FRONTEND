import { gql } from '@apollo/client';

export const OBTENER_TRANSFERENCIAS = gql`
    query obtenerTransferenciasInternas{
        obtenerTransferenciasInternas{
            id
            fecha
            usuario{
                id,
                nombre,
                cedula,
            }
            nota
            almacenDesde{
                id
                nombre
                descripcion
                estado
            }
            almacenHasta{
                id
                nombre
                descripcion
                estado
            }
        }
    }
`;

export const OBTENER_TRANSFERENCIA = gql`
    query obtenerTransferenciaInterna($id:ID){
        obtenerTransferenciaInterna(id:$id){
            id
            fecha
            usuario{
                id,
                nombre,
                cedula,
            }
            nota
            almacenDesde{
                id
                nombre
                descripcion
                estado
            }
            almacenHasta{
                id
                nombre
                descripcion
                estado
            }
        }
    }
`;

export const GUARDAR_TRANSFERENCIA = gql`
    mutation insertarTransferenciaInterna($input:TransferenciaInternaInput, $lineas:[TransferenciaInternaLineaInput2]){
        insertarTransferenciaInterna(input:$input, lineas:$lineas){
                estado
                message
        }
    }
`;

export const ACTUALIZAR_TRANSFERENCIA = gql`
    mutation actualizarTransferenciaInterna($id:ID, $input:TransferenciaInternaInput){
        actualizarTransferenciaInterna(id:$id, input:$input){
            estado
            message
        }
    }
`;

