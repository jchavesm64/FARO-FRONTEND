import { gql } from '@apollo/client';

export const OBTENER_MOVIMIENTOS_ACTIVOS = gql`
    query obtenerMovimientosActivos {
        obtenerMovimientosActivos {
            id
            tipo
            beneficiario
            fecha
            activo{
                id
                nombre
                referenciaInterna
            }
            consecutivo{
                id
                consecutivo
            }
        }
    }
`;

export const INSERTAR_MOVIMIENTO_ACTIVO = gql`
    mutation insertarMovimientosActivo($input:MovimientosActivoInput){
        insertarMovimientosActivo(input:$input){
            estado
            message
        }
    }
`;