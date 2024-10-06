import { gql } from '@apollo/client';

export const OBTENER_TIPOSSERVICIOS = gql`
    query obtenerTipoServicio{
        obtenerTipoServicio{
            id
            nombre
            cuantificable
            icon
            horadia
        }
    }
`;

export const OBTENER_TIPOSSERVICIOSBYID = gql` 
    query obtenerTipoServicioId($id:ID){
        obtenerTipoServicioId(id:$id){
            id
            nombre
            cuantificable
            icon
            horadia
        }
    }
`;

export const SAVE_TIPO_SERVICIOS = gql`
    mutation insertarTipoServicio($input:TipoServicioInput){
        insertarTipoServicio(input:$input){
            estado
            message
        }
    }
`;

export const UPDATE_TIPO_SERVICIOS = gql`
    mutation actualizarTipoServicio($id: ID, $input: TipoServicioInput){
        actualizarTipoServicio(id:$id, input:$input){
            estado
            message
        }
    }
`;

export const DELETE_TIPO_SERVICIOS = gql`
    mutation desactivarTipoServicio($id:ID){
        desactivarTipoServicio(id:$id){
            estado
            message
        }    
    }
`;