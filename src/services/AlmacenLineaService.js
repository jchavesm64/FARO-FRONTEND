import { gql } from '@apollo/client';

export const OBTENER_LINEAS_ALMACEN = gql`
    query obtenerLineasAlmacen($id:ID){
        obtenerLineasAlmacen(id:$id){
            id
            producto{
                id
                nombre
                unidad
            }
            almacen{
                id
                nombre
            }
            cantidad
        }
    }
`;

export const OBTENER_LINEA_ALMACEN = gql`
    query obtenerLineaAlmacen($id:ID){
        obtenerLineaAlmacen(id:$id){
            id
            producto{
                id
                nombre
                unidad
            }
            almacen{
                id
                nombre
            }
            cantidad
        }
    }
`;


export const INSERTAR_LINEA_ALMACEN = gql`
    mutation insertarLineaAlmacen($input:LineasRecepcionPedidoInput){
        insertarLineaAlmacen(input:$input){
            estado
            message
            data
        }
    }
`;