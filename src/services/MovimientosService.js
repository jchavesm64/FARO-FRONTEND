import gql from 'graphql-tag'

export const OBTENER_MOVIMIENTOS = gql`
    query obtenerMovimientos($id:ID){
        obtenerMovimientos(id:$id){
            id
            tipo
            lote
            cedido
            cliente{
                id
                nombre
                codigo
            }
            proveedor{
                id
                empresa
                cedula
            }
            fecha
            cantidad
            existencia
            precio
            precio_unidad
            moneda
            usuario{
                id
                nombre
                cedula
            }
            materia_prima{
                id
                nombre
            }
            almacen{
                id
                nombre
            }
        }
    }
`;

export const OBTENER_MOVIMIENTOS_2 = gql`
    query obtenerMovimientos2($id:ID){
        obtenerMovimientos2(id:$id){
            id
            tipo
            lote
            cedido
            cliente{
                id
                nombre
                codigo
            }
            proveedor{
                id
                empresa
                cedula
            }
            fecha
            cantidad
            existencia
            precio
            precio_unidad
            moneda
            usuario{
                id
                nombre
                cedula
            }
            materia_prima{
                id
                nombre
            }
            almacen{
                id
                nombre
            }
        }
    }
`;

export const SAVE_MOVIMIENTO = gql`
    mutation insertarMovimiento($input:MovimientosInput, $almacen: ID){
        insertarMovimiento(input:$input, almacen:$almacen){
            estado
            message
        }
    }
`;


export const SAVE_SALIDA = gql`
    mutation insertarSalida($input:salida_inventario, $almacen: ID){
        insertarSalida(input:$input, almacen:$almacen){
            estado
            message
        }
    }
`;

export const VERIFICAR = gql`
    mutation verificarExistencias($input:Items){
        verificarExistencias(input:$input){
            estado
            message
        }
    }
`;

export const PRODUCCION = gql`
    mutation enviarProduccion($input:salidas){
        enviarProduccion(input:$input){
            estado
            message
        }
    }
`;

export const UPLOAD_FILE_COA = gql`
    mutation subirArchivoCOA($file:Upload){
        subirArchivoCOA(file:$file){
            estado
            filename
            message
        }
    }
`;