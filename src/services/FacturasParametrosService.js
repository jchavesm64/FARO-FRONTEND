import { gql } from '@apollo/client';

export const OBTENER_FACTURAS_PARAMETROS_BY_TYPE = gql`
    query obtenerFacturasParametrosByType($type:String){
        obtenerFacturasParametrosByType(type:$type){
            id
            value
            type
        }
    }
`;