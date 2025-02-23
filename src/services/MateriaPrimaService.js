import { gql } from '@apollo/client';

export const OBTENER_MATERIAS_PRIMAS = gql`
    query obtenerMateriasPrimas($tipo:String){
        obtenerMateriasPrimas(tipo:$tipo){
            id
            nombre
            pais
            unidad
            existencias
            estado
            tipo,
            precioCompra
        }
    }
`;

export const OBTENER_TODAS_MATERIAS_PRIMAS = gql`
    query {
        obtenerTodasMateriasPrimas{
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
            margen
            impuestos{
                impuesto
                aplicaVentas
                aplicaCompras
            }
        }
    }
`;

export const OBTENER_MATERIAS_PRIMAS_MOVIMIENTOS = gql`
    query obtenerMateriasPrimasConMovimientos($tipo:String){
        obtenerMateriasPrimasConMovimientos(tipo:$tipo){
            materia_prima{
                id
                nombre
                pais
                unidad
                existencias
                estado
                tipo
            }
            movimientos{
                id
                tipo
                lote
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
                usuario{
                    id
                    nombre
                    cedula
                }
            }
        }
    }
`;

export const OBTENER_MATERIA_PRIMA = gql`
    query obtenerMateriaPrima($id:ID){
        obtenerMateriaPrima(id:$id){
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
            margen
            impuestos{
                impuesto
                aplicaVentas
                aplicaCompras
            }
            movimientos{
                id
                tipo
                lote
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
                usuario{
                    id
                    nombre
                    cedula
                }
            }
        }
    }
`;


export const SAVE_MATERIA_PRIMA = gql`
    mutation insertarMateriaPrima($input:MateriaPrimaInput){
        insertarMateriaPrima(input:$input){
            estado
            message
        }
    }
`;

export const UPDATE_MATERIA_PRIMA = gql`
    mutation actualizarMateriaPrima($id:ID, $input:MateriaPrimaInput){
        actualizarMateriaPrima(id:$id, input:$input){
            estado
            message
        }
    }
`;

export const UPDATE_EXISTENCIAS_MATERIA_PRIMA = gql`
    mutation actualizarExistenciasMateriaPrima($id:ID, $cantidad:Number){
        actualizarExistenciasMateriaPrima(id:$id, cantidad:$cantidad){
            estado
            message
        }
    }
`;

export const DELETE_MATERIA_PRIMA = gql`
    mutation desactivarMateriaPrima($id:ID){
        desactivarMateriaPrima(id:$id){
            estado
            message
        }
    }
`;