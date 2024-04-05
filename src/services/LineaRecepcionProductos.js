import { gql } from '@apollo/client';

export const OBTENER_LINEAS_RECEPCION_PEDIDO = gql`
    query obtenerLineasRecepcionPedido($id:ID){
        obtenerLineasRecepcionPedido(id:$id){
            id
            estado
            producto{
                id
                nombre
            }
            recepcion{
                id
            }
            impuesto{
                id
                nombre
                valor
            }
            precioUnitario
            cantidadSolicitada
            cantidadRecibida
            porcentajeDescuento
            descuento
            montoImpuestos
            subtotalSinImpuesto
            subtotalConImpuesto
            almacen{
                id
                nombre
                descripcion
                estado
            }
        }
    }
`;

export const OBTENER_LINEA_RECEPCION_PEDIDO = gql`
    query obtenerLineaRecepcionPedido($id:ID){
        obtenerLineaRecepcionPedido(id:$id){
            id
            estado
            producto{
                id
                nombre
            }
            recepcion{
                id
            }
            impuesto{
                id
                nombre
                valor
            }
            precioUnitario
            cantidadSolicitada
            cantidadRecibida
            porcentajeDescuento
            descuento
            montoImpuestos
            subtotalSinImpuesto
            subtotalConImpuesto
            almacen{
                id
                nombre
                descripcion
                estado
            }
        }
    }
`;


export const ACTUALIZAR_CANTIDAD_LINEA_RECEPCION = gql`
    mutation actualizarCantidadRecibidaLineaRecepcion($id:ID, $cantidad:Number, $almacen:ID){
        actualizarCantidadRecibidaLineaRecepcion(id:$id, cantidad:$cantidad, almacen:$almacen){
            estado
            message
        }
    }
`;