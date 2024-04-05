import { gql } from '@apollo/client';

export const VALIDAR_PARAMETRO = gql`
    mutation validarParametro($input:entrada_parametro){
        validarParametro(input:$input){
            estado
            message
        }
    }
`;