import { gql } from '@apollo/client';

export const OBTENER_RECEPCION_PRODUCTOS = gql`
    query obtenerRecepcionPedidos{
        obtenerRecepcionPedidos{
            id
            estado
            proveedor{
                id
                empresa
                cedula
            }
            pedido{
                id
                estadoPedido
                consecutivo{
                    id
                    consecutivo
                }
            }
            fechaPedido
            fechaEntrega
            estadoRecepcion
            subtotal
            impuestosMonto
            total	
        }
    }
`;

export const OBTENER_RECEPCION_PRODUCTO = gql`
    query obtenerRecepcionPedido($id:ID){
        obtenerRecepcionPedido(id:$id){
            id
            estado
            proveedor{
                id
                empresa
                cedula
            }
            pedido{
                id
                estadoPedido
            }
            fechaPedido
            fechaEntrega
            estadoRecepcion
            subtotal
            impuestosMonto
            total	
        }
    }
`;

export const UPDATE_ESTADO_RECEPCION = gql`
    mutation actualizarEstadoRecepcion($id:ID, $estado:EstadoRecepcion){
        actualizarEstadoRecepcion(id:$id, estado:$estado){
            estado
            message
        }
    }
`;

// export const OBTENER_RECEPCION_PRODUCTO = gql`
//     query obtenerOrdenCompra($id:ID){
//         obtenerOrdenCompra(id:$id){
//             id
//             estado
//             proveedor{
//             id
//             empresa
//             }
//             fechaPedido
//             estadoPedido
//             numeroComprobante
//             lineasPedido{
//                 id
//                 estado
//                 producto{
//                     id
//                     nombre
//                     pais
//                     unidad
//                     existencias
//                     estado
//                     tipo
//                     referenciaInterna
//                     codigoBarras
//                     codigoCabys
//                     descripcion
//                     precioCompra
//                     precioCostoPromedio
//                     precioVenta
//                     impuestos{
//                         impuesto
//                         aplicaVentas
//                         aplicaCompras
//                     }
//                 }
//                 impuesto{
//                     id
//                     nombre
//                     valor
//                     estado
//                 }
//                 precioUnitario
//                 cantidad
//                 cantidadRecibida
//                 porcentajeDescuento
//                 descuento
//                 montoImpuestos
//                 subtotalSinImpuesto
//                 subtotalConImpuesto
//             }
//             subtotal
//             impuestosMonto
//             total
//         }
//     }
// `;

// export const SAVE_RECEPCION_PRODUCTOS = gql`
//     mutation insertarOrdenCompra($input:OrdenCompraInput, $inputLineas: [LineaOrdenCompraInput]){
//         insertarOrdenCompra(input:$input, inputLineas:$inputLineas){
//             estado
//             message
//         }
//     }
// `;


// export const UPDATE_RECEPCION_PRODUCTOS = gql`
//     mutation actualizarOrdenCompra($id:ID, $input:OrdenCompraInput, $inputLineasEditar: [LineasEditarInput]){
//         actualizarOrdenCompra(id:$id, input:$input, inputLineasEditar:$inputLineasEditar){
//             estado
//             message
//         }
//     }
// `;

// export const UPDATE_ESTADO_RECEPCION_PRODUCTOS = gql`
//     mutation actualizarEstadoOrdenCompra($id:ID, $estado:EstadoPedido){
//         actualizarEstadoOrdenCompra(id:$id, estado:$estado){
//             estado
//             message
//         }
//     }
// `;

// export const DELETE_RECEPCION_PRODUCTOS = gql`
//     mutation desactivarOrdenCompra($id:ID){
//         desactivarOrdenCompra(id:$id){
//             estado
//             message
//         }
//     }
// `;