import { gql } from '@apollo/client';



export const UPDATE_LINEA_ORDEN_COMPRA = gql`
    mutation actualizarLineaOrdenCompra($id:ID, $input:LineaOrdenCompraInput){
        actualizarLineaOrdenCompra(id:$id, input:$input){
            estado
            message
        }
    }
`;

export const DELETE_LINEA_ORDEN_COMPRA = gql`
    mutation desactivarLineaOrdenCompra($id:ID, $idOrden:ID){
        desactivarLineaOrdenCompra(id:$id, idOrden:$idOrden){
            estado
            message
        }
    }
`;