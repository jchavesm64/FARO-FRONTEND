import { gql } from '@apollo/client';

export const OBTENER_SUBCUENTAS = gql`
    query obtenerSubcuentas{
        obtenerSubcuentas{
            id
            numero
            comanda{
                id
                estado
            }
            cliente{
                id
                nombre
                correos{
                    email
                }
                telefonos{
                    telefono
                }
            }
            fecha
            platillos{
                id
                precio
                descuento
                estado
                observaciones
            }
            descuento
            total
            moneda
            formaPago{
                tipo
                monto
                moneda
            }
            estado
        }
    }
`;

export const OBTENER_SUBCUENTA_BY_ID = gql`
    query obtenerSubcuentaById($id:ID){
        obtenerSubcuentaById(id:$id){
            id
            numero
            comanda{
                id
                estado
            }
            cliente{
                id
                nombre
                correos{
                    email
                }
                telefonos{
                    telefono
                }
            }
            fecha
            platillos{
                id
                precio
                descuento
                estado
                observaciones
            }
            descuento
            total
            moneda
            formaPago{
                tipo
                monto
                moneda
            }
            estado
        }
    }
`;

export const OBTENER_SUBCUENTAS_POR_COMANDA = gql`
    query obtenerSubcuentasPorComanda($id:ID){
        obtenerSubcuentasPorComanda(id:$id){
            id
            numero
            comanda{
                id
                estado
            }
            cliente{
                id
                nombre
                correos{
                    email
                }
                telefonos{
                    telefono
                }
            }
            fecha
            platillos{
                id
                precio
                descuento
                estado
                observaciones
            }
            descuento
            total
            moneda
            formaPago{
                tipo
                monto
                moneda
            }
            estado
        }
    }
`;

export const SAVE_SUBCUENTA = gql`
    mutation insertarSubcuenta($input:SubcuentaInput){
        insertarSubcuenta(input:$input){
            estado
            message
        }
    }
`;

export const UPDATE_SUBCUENTA = gql`
    mutation actualizarSubcuenta($id:ID, $input:SubcuentaInput){
        actualizarSubcuenta(id:$id, input:$input){
            estado
            message
        }
    }
`;

export const UPDATE_SERVED = gql`
    mutation actualizarEntregados($id:ID, $input:actualizarEntregadosInput){
        actualizarEntregados(id:$id,input:$input){
            estado
            message
        }
    }
`;

export const DELETE_SUBCUENTA = gql`
    mutation desactivarSubcuenta($id:ID){
        desactivarSubcuenta(id:$id){
            estado
            message
        }
    }
`;

export const DELETE_PLATILLO = gql`
    mutation desactivarPlatillo($subcuentaId: ID, $platilloId: ID){
        desactivarPlatillo(subcuentaId: $subcuentaId, platilloId:$platilloId){
            estado
            message
        }
    }
`;