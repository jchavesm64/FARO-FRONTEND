import { gql } from '@apollo/client';

export const OBTENER_ORDENES_COMPRA = gql`
    query obtenerOrdenesCompra{
        obtenerOrdenesCompra{
            id
            estado
            proveedor{
                id
                empresa
                cedula
            }
            fechaPedido
            estadoPedido
            numeroComprobante
            subtotal
            impuestosMonto
            total
            consecutivo{
                id
                consecutivo
            }
        }
    }
`;

export const OBTENER_ORDEN_COMPRA = gql`
    query obtenerOrdenCompra($id:ID){
        obtenerOrdenCompra(id:$id){
            id
            estado
            proveedor{
                id
                empresa
            }
            fechaPedido
            estadoPedido
            numeroComprobante
            lineasPedido{
                id
                estado
                producto{
                    id
                    nombre
                    pais
                    unidad
                    existencias
                    estado
                    tipo
                    referenciaInterna
                    codigoBarras
                    codigoCabys
                    descripcion
                    precioCompra
                    precioCostoPromedio
                    precioVenta
                    impuestos{
                        impuesto
                        aplicaVentas
                        aplicaCompras
                    }
                }
                impuesto{
                    id
                    nombre
                    valor
                    estado
                }
                precioUnitario
                cantidad
                cantidadRecibida
                porcentajeDescuento
                descuento
                montoImpuestos
                subtotalSinImpuesto
                subtotalConImpuesto
            }
            subtotal
            impuestosMonto
            total
        }
    }
`;

export const SAVE_ORDEN_COMPRA = gql`
    mutation insertarOrdenCompra($input:OrdenCompraInput, $inputLineas: [LineaOrdenCompraInput]){
        insertarOrdenCompra(input:$input, inputLineas:$inputLineas){
            estado
            message
            data{
                id
            }
        }
    }
`;


export const UPDATE_ORDEN_COMPRA = gql`
    mutation actualizarOrdenCompra($id:ID, $input:OrdenCompraInput, $inputLineasEditar: [LineasEditarInput]){
        actualizarOrdenCompra(id:$id, input:$input, inputLineasEditar:$inputLineasEditar){
            estado
            message
        }
    }
`;

export const UPDATE_ESTADO_ORDEN_COMPRA = gql`
    mutation actualizarEstadoOrdenCompra($id:ID, $estado:EstadoPedido){
        actualizarEstadoOrdenCompra(id:$id, estado:$estado){
            estado
            message
        }
    }
`;

export const DELETE_ORDEN_COMPRA = gql`
    mutation desactivarOrdenCompra($id:ID){
        desactivarOrdenCompra(id:$id){
            estado
            message
        }
    }
`;