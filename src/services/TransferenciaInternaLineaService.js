import { gql } from '@apollo/client';

export const OBTENER_LINEAS_TRANSFERENCIA_INTERNA = gql`
    query obtenerLineasTransferenciaInterna($id:ID){
        obtenerLineasTransferenciaInterna(id:$id){
            id
            transferenciaInterna{
                id
            }
            producto{
                id
                nombre
                unidad
            }
            cantidad
        }
    }
`;

export const OBTENER_LINEA_TRANSFERENCIA_INTERNA = gql`
    query obtenerLineaTransferenciaInterna($id:ID){
        obtenerLineaTransferenciaInterna(id:$id){
            id
            transferenciaInterna{
                id
            }
            producto{
                id
                nombre
                unidad
            }
            cantidad
        }
    }
`;


export const INSERTAR_TRANSFERENCIA_INTERNA = gql`
    mutation insertarLineaTransferenciaInterna($input:LineasRecepcionPedidoInput){
        insertarLineaTransferenciaInterna(input:$input){
            estado
            message
            data
        }
    }
`;