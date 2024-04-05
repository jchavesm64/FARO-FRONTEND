import {gql} from '@apollo/client';

export const OBTENER_CHEQUEOS = gql`
    query obtenerChequeos($id: ID, $fecha1: Date, $fecha2: Date){
        obtenerChequeos(id:$id, fecha1:$fecha1, fecha2:$fecha2){
            id
            puesto_limpieza {
                id
                nombre
            }
            areas{
                area
                estado
            }
            usuario{
                nombre
            }
            fecha
            fechaRegistro
            aprobado
        }
    }
`;

export const OBTENER_TODOS_CHEQUEOS = gql`
    query obtenerTodosChequeos{
        obtenerTodosChequeos{
            id
            puesto_limpieza {
                id
                nombre
            }
            areas{
                area
                estado
            }
            usuario{
                nombre
            }
            fecha
            fechaRegistro
            aprobado
        }
    }
`;

export const OBTENER_CHEQUEO = gql`
    mutation obtenerChequeo($id: ID, $fecha: Date){
        obtenerChequeo(id:$id, fecha:$fecha){
            chequeo{
              id
              puesto_limpieza {
                  nombre
              }
              areas{
                  area
                  estado
              }
              fecha
              aprobado
            }
    		estado
        }
    }
`;

export const OBTENER_CHEQUEO_ID = gql`
    query obtenerChequeoId($id:ID){
        obtenerChequeoId(id:$id){
            id
            puesto_limpieza {
                id
                nombre
            }
            areas{
                area
                estado
            }
            usuario{
                nombre
            }
            fecha
            fechaRegistro
            aprobado
        }
    }
`;

export const SAVE_CHEQUEO = gql`
    mutation insertarChequeo($input:ChequeoInput){
        insertarChequeo(input:$input){
            estado
            message
        }
    }
`;

export const UPDATE_CHEQUEO = gql`
    mutation actualizarChequeo($id:ID, $input:ChequeoInput){
        actualizarChequeo(id:$id, input:$input){
            estado
            message
        }
    }
`;

export const APROBAR_CHEQUEO = gql`
    mutation aprobarChequeo($id:ID){
        aprobarChequeo(id:$id){
            estado
            message
        }
    }
`;