import { gql } from '@apollo/client';
export const OBTENER_MOVIMIENTOS_RESTAURANTE = gql`
    query obtenerMovimientosRestaurante {
        obtenerMovimientosRestaurante {
            id
            fecha
            cliente
            nombreFacturacion
            comanda
            condicionVenta
            medioPago
            tipoCambio
            codigoMoneda
            platillos {
                id
                nombre
                precio
                observaciones
            }
            numeroHabitacion
            reserva
            subtotal
            descuento
            IVA
            impuestoServicio
            total
        }
    }
`;

export const INSERTAR_MOVIMIENTO_RESTAURANTE = gql`
    mutation insertarMovimientoRestaurante($input:MovimientoRestauranteInput){
        insertarMovimientoRestaurante(input:$input){
            estado
            message
        }
    }
`;