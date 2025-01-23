import { gql } from '@apollo/client';

export const OBTENER_TIPOS_METODO_PAGO = gql`
    query obtenerTiposMetodoPago{
        obtenerTiposMetodoPago{
            id
            nombre
            estado
        }
    }
`;

export const OBTENER_TIPOS_METODO_PAGO_BY_ID = gql`
    query obtenerTipoMetodoPagoById($id:ID){
        obtenerTipoMetodoPagoById(id:$id){
            id
            nombre
            estado
        }
    }
`;

export const SAVE_TIPO_METODO_PAGO = gql`
    mutation insertarTipoMetodoPago($input:TipoMetodoPagoInput){
        insertarTipoMetodoPago(input:$input){
            estado
            message
        }
    }
`;

export const UPDATE_TIPO_METODO_PAGO = gql`
    mutation actualizarTipoMetodoPago($id:ID, $input:TipoMetodoPagoInput){
        actualizarTipoMetodoPago(id:$id, input:$input){
            estado
            message
        }
    }
`;

export const DELETE_TIPO_METODO_PAGO = gql`
    mutation desactivarTipoMetodoPago($id:ID){
        desactivarTipoMetodoPago(id:$id){
            estado
            message
        }
    }
`;