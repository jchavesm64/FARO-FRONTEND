import { gql } from '@apollo/client';

/*export const OBTENER_COMANDAS = gql`
    query obtenerComandas{
        obtenerComandass{
            id
            mesa{
                id
            }
            fecha
            observaciones
            preFactura
            estado
            subcuentas{
                id
                numero
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
                    cantidad
                    nombre
                    precio
                    descuento
                }
                descuento
                total
                moneda
                formaPago{
                    tipo{
                        id
                        nombre
                    }
                    monto
                    moneda
                }
                estado
            }
        }
    }
`;*/

export const OBTENER_COMANDAS = gql`
    query {
        obtenerComandas {
            id
            fecha
            mesa {
                id
                numero
                piso {
                    id
                    nombre
                }
                tipo
            }
            subcuentas {
                id
                platillos {
                    _id
                    id
                    nombre
                    estado
                    observaciones
                }
            }
        }
    }
`;

export const OBTENER_COMANDAS_PENDIENTES = gql`
    query {
        obtenerComandasPendientes {
            id
            fecha
            mesa {
                id
                numero
                piso {
                    id
                    nombre
                }
                tipo
            }
            subcuentas {
                id
                platillos {
                    _id
                    id
                    nombre
                    estado
                    observaciones
                }
            }
        }
    }
`;
export const OBTENER_COMANDA_BY_ID = gql`
    query obtenerComandaById($id:ID){
        obtenerComandaById(id:$id){
            id
            mesa{
                id
            }
            fecha
            preFactura
            estado
            subcuentas{
                id
                numero
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
                    _id
                    id
                    nombre
                    precio
                    descuento
                    estado
                    observaciones
                }
                descuento
                total
                moneda
                formaPago{
                    tipo{
                        id
                        nombre
                    }
                    monto
                    moneda
                }
                estado
            }
        }
    }
`;

export const OBTENER_COMANDA_POR_MESA = gql`
    query obtenerComandaPorMesa($id:ID){
        obtenerComandaPorMesa(id:$id){
            id
            mesa{
                id
            }
            fecha
            preFactura
            estado
            subcuentas{
                id
                numero
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
                    _id
                    id
                    nombre
                    precio
                    descuento
                    estado
                    observaciones
                }
                descuento
                total
                moneda
                formaPago{
                    tipo{
                        id
                        nombre
                    }
                    monto
                    moneda
                }
                estado
            }
        }
    }
`;

export const SAVE_COMANDA = gql`
    mutation insertarComanda($input:ComandaInput){
        insertarComanda(input:$input){
            estado
            data{
                id
            }
            message
        }
    }
`;

export const UPDATE_COMANDA = gql`
    mutation actualizarComanda($id:ID, $input:ComandaInput){
        actualizarComanda(id:$id, input:$input){
            estado
            message
        }
    }
`;

export const DELETE_COMANDA = gql`
    mutation desactivarComanda($id:ID){
        desactivarComanda(id:$id){
            estado
            message
        }
    }
`;