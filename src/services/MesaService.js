import { gql } from '@apollo/client';

export const OBTENER_MESAS = gql`
    query obtenerMesas{
        obtenerMesas{
            id
            numero
            tipo
            piso{
                id
                nombre
            }
            ubicacion{
                x
                y
            }
            estado
            temporizador
        }
    }
`;

export const OBTENER_MESA_BY_ID = gql`
    query obtenerMesaById($id:ID){
        obtenerMesaById(id:$id){
            id
            numero
            tipo
            piso{
                id
                nombre
            }
            ubicacion{
                x
                y
            }
            estado
            temporizador
        }
    }
`;

export const OBTENER_COMANDAS_POR_MESA = gql`
    query obtenerComandasPorMesa($id:ID){
        obtenerComandasPorMesa(id:$id){
            id
            mesa
            fecha
            preFactura,
            estado
            subcuentas
        }
    }
`;

export const SAVE_MESA = gql`
    mutation insertarMesa($input:MesaInput){
        insertarMesa(input:$input){
            estado
            message
        }
    }
`;

export const UPDATE_MESA = gql`
    mutation actualizarMesa($id:ID, $input:MesaInput){
        actualizarMesa(id:$id, input:$input){
            estado
            message
        }
    }
`;

export const DELETE_MESA = gql`
    mutation desactivarMesa($id:ID){
        desactivarMesa(id:$id){
            estado
            message
        }
    }
`;